"""Export ONE ONNX file (frozen backbone + every head) and the manifest js/health.js and backend/gaia/vision.py read.

    python scripts/13_export.py --weights w/efficientnet_b0_ra-3dd342df.pth --heads models_out \
        --dest ../../models/gaia-vision --dest ../../backend/models/gaia-vision --version 2026.11-effb0-v2

The backbone is shared, so the file holds it once and has one output per head ("stage1", "tomato", ...);
each manifest stage names its head in "output". Guidance cards come from advice.json and are shipped
only when validated_by is filled by an agronomist.
"""
import argparse, json, shutil
from pathlib import Path

import numpy as np, torch, torch.nn as nn, timm

class Gaia(nn.Module):
    def __init__(self, weights, heads, names):
        super().__init__()
        self.backbone = timm.create_model("efficientnet_b0", pretrained=False, num_classes=0)
        sd = {k: v for k, v in torch.load(weights, map_location="cpu").items() if not k.startswith("classifier.")}
        self.backbone.load_state_dict(sd); self.names = names
        self.heads = nn.ModuleList()
        for n in names:
            W, b = heads[f"{n}_W"], heads[f"{n}_b"]; lin = nn.Linear(W.shape[1], W.shape[0])
            lin.weight.data, lin.bias.data = torch.tensor(W), torch.tensor(b); self.heads.append(lin)
        self.eval()
    def forward(self, x):
        f = self.backbone(x)
        return tuple(h(f) for h in self.heads)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", required=True); ap.add_argument("--heads", type=Path, default=Path("models_out"))
    ap.add_argument("--dest", type=Path, action="append", required=True); ap.add_argument("--version", default="2026.11-effb0-v2")
    ap.add_argument("--advice", type=Path, default=Path("advice.json")); ap.add_argument("--file", default="gaia-vision-effb0.onnx")
    a = ap.parse_args()
    H = dict(np.load(a.heads / "heads.npz")); rep = json.load(open(a.heads / "report.json"))
    names = ["stage1"] + sorted(k for k in rep if k != "stage1")
    m = Gaia(a.weights, H, names); onnx_path = a.heads / a.file
    torch.onnx.export(m, torch.zeros(1, 3, 224, 224), str(onnx_path), input_names=["input"], output_names=names,
                      dynamic_axes={"input": {0: "n"}, **{n: {0: "n"} for n in names}}, opset_version=17, dynamo=False)
    # check the ONNX file against PyTorch
    import onnxruntime as ort
    x = torch.randn(2, 3, 224, 224); sess = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    outs = sess.run(None, {"input": x.numpy()})
    with torch.no_grad(): ref = m(x)
    err = max(float(np.abs(o - r.numpy()).max()) for o, r in zip(outs, ref)); print("onnx vs torch max abs diff", err)
    assert err < 1e-3
    spec = lambda n: {"file": a.file, "output": n, "classes": rep[n]["classes"], "temperature": rep[n]["temperature"], "threshold": rep[n]["threshold"]}
    keep = ("n", "accuracy", "macro_f1", "coverage_at_threshold", "accuracy_when_answering", "ece")
    pick = lambda d: {kk: d[kk] for kk in keep} if isinstance(d, dict) and "n" in d else d
    ev = lambda r: {k: ({kk: pick(v) for kk, v in r[k].items()} if k == "lab_only_baseline" else pick(r.get(k)))
                    for k in ("test_lab", "test_field", "lab_only_baseline", "leaky_random_split_test_accuracy", "dropped_classes_too_few_images") if k in r}
    man = {"version": a.version,
           "backbone": "efficientnet_b0 (timm, ImageNet ra weights), frozen; one linear head per stage",
           "input": {"size": 224, "mean": [0.485, 0.456, 0.406], "std": [0.229, 0.224, 0.225]},
           "stage1": spec("stage1"), "stage2": {n: spec(n) for n in names[1:]}, "guidance": {},
           "evaluation": {"note": "Held-out test split after near-duplicate grouping. 'lab' = PlantVillage plain-background photos, "
                                  "'field' = PlantDoc / orchard photos. No Tunisian test set yet: measure one before any public demo.",
                          **{n: ev(rep[n]) for n in names}}}
    if a.advice.exists():
        for k, v in json.load(open(a.advice)).items():
            if k.startswith("_") or not isinstance(v, dict): continue
            if v.get("validated_by") and v.get("fr"): man["guidance"][k] = {x: v[x] for x in ("fr", "ar", "en", "ja", "validated_by", "date") if x in v}
    for d in a.dest:
        d.mkdir(parents=True, exist_ok=True); shutil.copy(onnx_path, d / a.file)
        json.dump(man, open(d / "manifest.json", "w"), indent=2, ensure_ascii=False); print("written", d / "manifest.json")
    print("size MB", round(onnx_path.stat().st_size / 1e6, 1), "| guidance cards:", len(man["guidance"]))

if __name__ == "__main__":
    main()
