"""Embed every image with a frozen ImageNet backbone, group near-duplicates, split without leakage.

    python scripts/11_embed_split.py --index data/index.csv --weights w/efficientnet_b0_ra-3dd342df.pth --views 4

Why this exists (the old pipeline's main leak): split_of() hashed the FILE NAME. PlantVillage photographs
the same leaf several times, and the olive / palm sets ship rotated / flipped / recoloured copies of each
photo under new names. Those copies landed in train AND test, so test accuracy measured memory, not skill.

Here:
1. one clean embedding per image (same preprocessing as js/health.js: centre square crop, resize 224);
2. near-duplicates = cosine similarity >= --dup inside a plant -> union-find groups;
3. groups (never single files) are split 70/15/15 per plant, stratified by class (data/split.csv);
4. --views augmented embeddings of each TRAIN image (crop, flip, rotation, colour, blur) for the heads.
Outputs: data/emb_clean.npy, data/emb_aug.npy (+ data/emb_aug_idx.npy), data/split.csv
"""
import argparse, collections, random
from pathlib import Path

import numpy as np, pandas as pd, torch, timm
from PIL import Image, ImageFilter
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms as T

MEAN, STD, SIZE = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225], 224

def backbone(weights):
    m = timm.create_model("efficientnet_b0", pretrained=False, num_classes=0)  # num_classes=0 -> pooled 1280-d features
    sd = {k: v for k, v in torch.load(weights, map_location="cpu").items() if not k.startswith("classifier.")}
    m.load_state_dict(sd); return m.eval()

class Blur:
    def __call__(self, im): return im.filter(ImageFilter.GaussianBlur(random.uniform(0.1, 1.6))) if random.random() < 0.3 else im

CLEAN = T.Compose([T.Resize(SIZE), T.CenterCrop(SIZE), T.ToTensor(), T.Normalize(MEAN, STD)])
AUG = T.Compose([T.RandomResizedCrop(SIZE, scale=(0.45, 1.0), ratio=(0.8, 1.25)), T.RandomHorizontalFlip(), T.RandomVerticalFlip(),
                 T.RandomRotation(30), T.ColorJitter(0.4, 0.4, 0.35, 0.04), Blur(), T.ToTensor(), T.Normalize(MEAN, STD)])

class DS(Dataset):
    def __init__(s, paths, tf): s.p, s.tf = list(paths), tf
    def __len__(s): return len(s.p)
    def __getitem__(s, i): return s.tf(Image.open(s.p[i]).convert("RGB"))

@torch.no_grad()
def embed(m, paths, tf, bs=64, label=""):
    out, dl = [], DataLoader(DS(paths, tf), batch_size=bs, num_workers=3)
    for k, x in enumerate(dl):
        out.append(m(x).numpy().astype(np.float32))
        if k % 20 == 0: print(f"  {label} {k * bs}/{len(paths)}", flush=True)
    return np.concatenate(out)

def groups_of(E, thr):
    """union-find over pairs with cosine >= thr (E rows are L2-normalised)."""
    n = len(E); parent = list(range(n))
    def find(i):
        while parent[i] != i: parent[i] = parent[parent[i]]; i = parent[i]
        return i
    for s in range(0, n, 2048):
        S = E[s:s + 2048] @ E.T
        for i, j in zip(*np.nonzero(S >= thr)):
            a, b = find(s + i), find(j)
            if a != b: parent[a] = b
    return np.array([find(i) for i in range(n)])

def split_groups(df, seed=0, frac=(0.70, 0.15, 0.15)):
    """greedy stratified group split: biggest groups first, each goes where its class is most under target."""
    rng = random.Random(seed); split = {}
    for plant, d in df.groupby("plant"):
        tot = d.disease.value_counts().to_dict(); have = {s: collections.Counter() for s in ("train", "val", "test")}
        gs = [(g, gd.disease.value_counts().to_dict()) for g, gd in d.groupby("group")]
        rng.shuffle(gs); gs.sort(key=lambda x: -sum(x[1].values()))
        for g, cnt in gs:
            c = max(cnt, key=cnt.get)
            need = {s: frac[k] * tot[c] - have[s][c] for k, s in enumerate(("train", "val", "test"))}
            s = max(need, key=need.get); split[g] = s; have[s].update(cnt)
    return df.group.map(split)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", default="data/index.csv"); ap.add_argument("--weights", required=True)
    ap.add_argument("--views", type=int, default=4); ap.add_argument("--dup", type=float, default=0.93)
    a = ap.parse_args(); torch.set_num_threads(4); random.seed(0); torch.manual_seed(0)
    df = pd.read_csv(a.index); m = backbone(a.weights); out = Path(a.index).parent
    if (out / "emb_clean.npy").exists(): E = np.load(out / "emb_clean.npy")
    else: E = embed(m, df.path, CLEAN, label="clean"); np.save(out / "emb_clean.npy", E)
    En = E / np.linalg.norm(E, axis=1, keepdims=True)
    df["group"] = ""
    for plant, idx in df.groupby("plant").groups.items():
        idx = np.asarray(idx); g = groups_of(En[idx], a.dup); df.loc[idx, "group"] = [f"{plant}:{x}" for x in g]
    df["split"] = split_groups(df)
    sizes = df.group.value_counts()
    print(f"near-duplicate groups: {df.group.nunique()} groups for {len(df)} images; "
          f"{(sizes > 1).sum()} groups with copies, largest {sizes.max()}")
    print(df.groupby(["plant", "split"]).size().unstack(fill_value=0))
    df.to_csv(out / "split.csv", index=False)
    tr = np.nonzero((df.split == "train").to_numpy())[0]
    A = [embed(m, df.path.iloc[tr], AUG, label=f"aug view {v + 1}") for v in range(a.views)]
    np.save(out / "emb_aug.npy", np.concatenate(A)); np.save(out / "emb_aug_idx.npy", np.tile(tr, a.views))
    print("saved", out)

if __name__ == "__main__":
    main()
