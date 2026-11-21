"""Train the stage-1 (which plant) and stage-2 (which disease, per plant) heads on frozen embeddings.

    python scripts/12_train_heads.py --data data --out models_out

Anti-overfitting choices, in order of impact:
- leakage-free split from 11_embed_split.py (near-duplicate groups never cross train/val/test);
- frozen ImageNet backbone + one linear layer per task: ~1280*K parameters instead of 5M, so the model
  cannot memorise PlantVillage backgrounds the way a fully fine-tuned network does on a few hundred images;
- training on augmented views (crop, flip, rotation, colour, blur), class-balanced loss, field photos
  weighted x2 (they are the minority and the real use case), label smoothing;
- weight decay picked on the validation split, early stopping on validation loss;
- temperature scaling on validation, refusal threshold picked on FIELD validation photos when available.
Every number is reported separately for lab (PlantVillage) and field photos.
"""
import argparse, json
from pathlib import Path

import numpy as np, pandas as pd, torch, torch.nn as nn, torch.nn.functional as F
from sklearn.metrics import confusion_matrix, f1_score

MIN_IMAGES = 40      # a class with fewer images (all splits) is dropped and listed in the report
FIELD_WEIGHT = 2.0
TARGET = 0.90        # refusal threshold: lowest confidence giving >= 90 % accuracy on accepted val photos

def fit(Xtr, ytr, wtr, Xva, yva, K, wd, epochs=80, patience=8, seed=0):
    torch.manual_seed(seed)
    lin = nn.Linear(Xtr.shape[1], K); opt = torch.optim.AdamW(lin.parameters(), lr=3e-3, weight_decay=wd)
    cw = torch.tensor(np.bincount(ytr, minlength=K), dtype=torch.float32).clamp(min=1); cw = (cw.sum() / (K * cw))
    best, bad, state = 1e9, 0, None
    for ep in range(epochs):
        perm = torch.randperm(len(Xtr))
        for s in range(0, len(perm), 256):
            b = perm[s:s + 256]
            l = (F.cross_entropy(lin(Xtr[b]), ytr[b], weight=cw, reduction="none", label_smoothing=0.05) * wtr[b]).mean()
            opt.zero_grad(); l.backward(); opt.step()
        with torch.no_grad(): vl = F.cross_entropy(lin(Xva), yva, weight=cw).item()
        if vl < best - 1e-4: best, bad, state = vl, 0, {k: v.clone() for k, v in lin.state_dict().items()}
        else:
            bad += 1
            if bad >= patience: break
    lin.load_state_dict(state); return lin, best

def temperature(L, y):
    logT = torch.zeros(1, requires_grad=True); opt = torch.optim.LBFGS([logT], lr=0.1, max_iter=200)
    def cl():
        opt.zero_grad(); l = F.cross_entropy(L / logT.exp(), y); l.backward(); return l
    opt.step(cl); return float(logT.exp())

def ece(P, y, bins=10):
    conf, pred = P.max(1), P.argmax(1); e = 0.0
    for lo in np.linspace(0, 1, bins, endpoint=False):
        m = (conf > lo) & (conf <= lo + 1 / bins)
        if m.any(): e += m.mean() * abs((pred[m] == y[m]).mean() - conf[m].mean())
    return float(e)

def threshold(P, y, target=TARGET):
    conf, ok = P.max(1), P.argmax(1) == y
    for th in np.round(np.arange(0.30, 0.995, 0.01), 2):
        sel = conf >= th
        if sel.sum() >= max(10, 0.15 * len(y)) and ok[sel].mean() >= target: return float(th)
    return 0.99

def metrics(P, y, thr, K):
    if len(y) == 0: return None
    pred, conf = P.argmax(1), P.max(1); sel = conf >= thr
    return {"n": int(len(y)), "accuracy": round(float((pred == y).mean()), 4),
            "macro_f1": round(float(f1_score(y, pred, average="macro", labels=sorted(set(y)), zero_division=0)), 4),
            "coverage_at_threshold": round(float(sel.mean()), 4),
            "accuracy_when_answering": round(float((pred[sel] == y[sel]).mean()), 4) if sel.any() else None,
            "ece": round(ece(P, y), 4)}

def run_task(name, df, col, E, A, Aidx, train_mask=None, wds=(1e-4, 1e-3, 1e-2, 5e-2)):
    counts = df[col].value_counts(); dropped = sorted(counts[counts < MIN_IMAGES].index)
    df = df[~df[col].isin(dropped)]; classes = sorted(df[col].unique()); K = len(classes); c2i = {c: i for i, c in enumerate(classes)}
    tr = df[df.split == "train"]
    if train_mask is not None: tr = tr[train_mask(tr)]
    va, te = df[df.split == "val"], df[df.split == "test"]
    sel = np.isin(Aidx, tr.index.to_numpy())                        # augmented views of the training rows
    Xtr_np = np.concatenate([E[tr.index], A[sel]]); rows = np.concatenate([tr.index, Aidx[sel]])
    mu, sd = Xtr_np.mean(0), Xtr_np.std(0) + 1e-6
    z = lambda X: torch.tensor((X - mu) / sd, dtype=torch.float32)
    y_of = lambda r: torch.tensor(df.loc[r, col].map(c2i).to_numpy())
    Xtr, ytr = z(Xtr_np), y_of(rows)
    wtr = torch.tensor(np.where(df.loc[rows, "domain"].to_numpy() == "field", FIELD_WEIGHT, 1.0), dtype=torch.float32)
    Xva, yva, Xte, yte = z(E[va.index]), y_of(va.index), z(E[te.index]), y_of(te.index)
    best = None
    for wd in wds:
        lin, vl = fit(Xtr, ytr, wtr, Xva, yva, K, wd)
        with torch.no_grad(): f1 = f1_score(yva, lin(Xva).argmax(1), average="macro")
        if best is None or f1 > best[2]: best = (lin, wd, f1)
    lin, wd, _ = best
    with torch.no_grad(): Lva, Lte, Ltr = lin(Xva), lin(Xte), lin(z(E[tr.index]))
    T_ = temperature(Lva, yva)
    Pva, Pte = F.softmax(Lva / T_, 1).numpy(), F.softmax(Lte / T_, 1).numpy()
    fv = (va.domain == "field").to_numpy()
    thr = threshold(Pva[fv], yva.numpy()[fv]) if fv.sum() >= 30 else threshold(Pva, yva.numpy())
    yt = yte.numpy(); lab, field = (te.domain == "lab").to_numpy(), (te.domain == "field").to_numpy()
    rep = {"classes": classes, "dropped_classes_too_few_images": dropped, "weight_decay": wd, "temperature": round(T_, 4),
           "threshold": thr, "n_train_images": int(len(tr)), "n_train_views": int(len(Xtr)),
           "train_accuracy": round(float((Ltr.argmax(1) == y_of(tr.index)).float().mean()), 4),
           "val_accuracy": round(float((Lva.argmax(1) == yva).float().mean()), 4),
           "test_all": metrics(Pte, yt, thr, K), "test_lab": metrics(Pte[lab], yt[lab], thr, K),
           "test_field": metrics(Pte[field], yt[field], thr, K),
           "test_ece_before_temperature": round(ece(F.softmax(Lte, 1).numpy(), yt), 4),
           "confusion_test": confusion_matrix(yt, Pte.argmax(1), labels=range(K)).tolist(),
           "confusion_test_field": confusion_matrix(yt[field], Pte[field].argmax(1), labels=range(K)).tolist() if field.any() else None}
    # fold the standardisation into the linear layer, so the exported head reads raw backbone features
    W = lin.weight.detach().numpy() / sd; b = lin.bias.detach().numpy() - W @ mu
    return rep, W.astype(np.float32), b.astype(np.float32)

def random_split_accuracy(df, col, E):
    """what the OLD file-level split would report: same head, rows shuffled without near-duplicate groups."""
    d = df.copy(); rng = np.random.default_rng(0); r = rng.random(len(d))
    d["split"] = np.where(r < 0.7, "train", np.where(r < 0.85, "val", "test"))
    rep, _, _ = run_task("leaky", d, col, E, np.zeros((0, E.shape[1])), np.zeros(0, int), wds=(1e-3,))
    return rep["test_all"]["accuracy"]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=Path, default=Path("data")); ap.add_argument("--out", type=Path, default=Path("models_out"))
    a = ap.parse_args(); a.out.mkdir(parents=True, exist_ok=True); torch.set_num_threads(4)
    df = pd.read_csv(a.data / "split.csv"); E = np.load(a.data / "emb_clean.npy")
    A, Aidx = np.load(a.data / "emb_aug.npy"), np.load(a.data / "emb_aug_idx.npy")
    heads, report = {}, {}
    rep, W, b = run_task("stage1", df, "plant", E, A, Aidx); heads["stage1"] = (W, b); report["stage1"] = rep
    print("stage1", json.dumps({k: rep[k] for k in ("classes", "temperature", "threshold", "test_lab", "test_field")}))
    for plant in sorted(p for p in df.plant.unique() if p != "other"):
        d = df[df.plant == plant]
        if d.disease.nunique() < 2: continue
        rep, W, b = run_task(plant, d, "disease", E, A, Aidx); heads[plant] = (W, b)
        if (d.source == "plantvillage").any() and (d.domain == "field").any():   # how a lab-only model does in the field
            lab_only, _, _ = run_task(plant, d, "disease", E, A, Aidx, train_mask=lambda t: t.domain == "lab")
            rep["lab_only_baseline"] = {"test_lab": lab_only["test_lab"], "test_field": lab_only["test_field"]}
        rep["leaky_random_split_test_accuracy"] = random_split_accuracy(d, "disease", E)
        report[plant] = rep
        print(plant, json.dumps({k: rep[k] for k in ("classes", "dropped_classes_too_few_images", "temperature", "threshold", "test_lab", "test_field")}), flush=True)
    np.savez(a.out / "heads.npz", **{f"{k}_W": v[0] for k, v in heads.items()}, **{f"{k}_b": v[1] for k, v in heads.items()})
    json.dump(report, open(a.out / "report.json", "w"), indent=2)
    print("saved", a.out / "heads.npz", a.out / "report.json")

if __name__ == "__main__":
    main()
