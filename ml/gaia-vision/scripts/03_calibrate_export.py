"""Temperature-scale on the val split, pick a refusal threshold, export ONNX.
  python scripts/03_calibrate_export.py --name tree
  python scripts/03_calibrate_export.py --name disease_olive
Refusal rule: GAIA answers only if max softmax(logits/T) >= threshold, where the
threshold is the lowest value giving >= --target accuracy on the accepted val images.
"""
import argparse, json
import numpy as np, pandas as pd, torch, torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import models
import importlib.util, sys
spec = importlib.util.spec_from_file_location("t", "scripts/02_train.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)

def logits_of(m, df, classes, col, bs=64):
    dl = DataLoader(t.DS(df, classes, col, t.tfs()[1]), batch_size=bs)
    L, Y = [], []
    with torch.no_grad():
        for x, y in dl: L.append(m(x)); Y.append(y)
    return torch.cat(L), torch.cat(Y)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True); ap.add_argument("--target", type=float, default=0.95)
    ap.add_argument("--index", default="data/index.csv")
    a = ap.parse_args()
    ck = torch.load(f"models_out/{a.name}.pt"); classes = ck["classes"]
    m = models.mobilenet_v3_large(weights=None)
    m.classifier[3] = nn.Linear(m.classifier[3].in_features, len(classes)); m.load_state_dict(ck["state"]); m.eval()
    df = pd.read_csv(a.index)
    if a.name == "tree": col = "tree"
    else: df, col = df[df.tree == a.name.split("_", 1)[1]], "disease"
    Lv, Yv = logits_of(m, df[df.split == "val"], classes, col)
    logT = torch.zeros(1, requires_grad=True); opt = torch.optim.LBFGS([logT], lr=0.1, max_iter=100)
    def closure():
        opt.zero_grad(); l = nn.functional.cross_entropy(Lv / logT.exp(), Yv); l.backward(); return l
    opt.step(closure); T_ = float(logT.exp())
    conf = torch.softmax(Lv / T_, 1).max(1).values.numpy(); ok = (Lv.argmax(1) == Yv).numpy()
    thr = 1.0
    for th in np.linspace(0.3, 0.99, 70):
        sel = conf >= th
        if sel.sum() >= 0.2 * len(ok) and ok[sel].mean() >= a.target: thr = float(th); break
    Lt, Yt = logits_of(m, df[df.split == "test"], classes, col)
    ct = torch.softmax(Lt / T_, 1).max(1).values.numpy(); okt = (Lt.argmax(1) == Yt).numpy(); sel = ct >= thr
    rep = {"temperature": T_, "test_accuracy_all": float(okt.mean()),
           "test_coverage": float(sel.mean()), "test_accuracy_when_answering": float(okt[sel].mean()) if sel.any() else None}
    print(rep)
    torch.onnx.export(m, torch.zeros(1, 3, t.SIZE, t.SIZE), f"models_out/{a.name}.onnx", input_names=["input"],
                      output_names=["logits"], dynamic_axes={"input": {0: "n"}, "logits": {0: "n"}}, opset_version=17, dynamo=False)
    fname = "stage1-tree.onnx" if a.name == "tree" else f"{a.name.split('_', 1)[1]}.onnx"
    import os; os.replace(f"models_out/{a.name}.onnx", f"models_out/{fname}")
    # keys match what js/health.js reads: file, classes, temperature, threshold
    json.dump({"file": fname, "classes": classes, "temperature": T_, "threshold": thr, "eval": rep},
              open(f"models_out/{a.name}.json", "w"), indent=2)

if __name__ == "__main__":
    main()
