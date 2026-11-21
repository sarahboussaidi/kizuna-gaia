"""Confusion matrices (PNG) + a markdown summary from models_out/report.json.

    python scripts/14_report.py --heads models_out --out reports
"""
import argparse, json
from pathlib import Path

import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

INK, MUTED = "#1f2328", "#6e7781"

def cm_plot(cm, classes, title, path):
    cm = np.asarray(cm, float); rows = cm.sum(1, keepdims=True); P = np.divide(cm, rows, out=np.zeros_like(cm), where=rows > 0)
    k = len(classes); fig, ax = plt.subplots(figsize=(1.2 + 0.55 * k, 1.0 + 0.5 * k), dpi=150)
    ax.imshow(P, cmap="Greens", vmin=0, vmax=1)   # sequential, one hue: share of each true class
    for i in range(k):
        for j in range(k):
            if cm[i, j]: ax.text(j, i, int(cm[i, j]), ha="center", va="center", fontsize=7, color="white" if P[i, j] > 0.55 else INK)
    lab = [c.replace("_", " ") for c in classes]
    ax.set_xticks(range(k), lab, rotation=45, ha="right", fontsize=7, color=INK); ax.set_yticks(range(k), lab, fontsize=7, color=INK)
    ax.set_xlabel("predicted", fontsize=8, color=MUTED); ax.set_ylabel("true", fontsize=8, color=MUTED)
    ax.set_title(title, fontsize=9, color=INK, loc="left")
    for s in ax.spines.values(): s.set_visible(False)
    fig.tight_layout(); fig.savefig(path); plt.close(fig)

pct = lambda v: "–" if v is None else f"{100 * v:.0f} %"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--heads", type=Path, default=Path("models_out")); ap.add_argument("--out", type=Path, default=Path("reports"))
    a = ap.parse_args(); a.out.mkdir(parents=True, exist_ok=True); rep = json.load(open(a.heads / "report.json"))
    lines = ["| model | classes | lab test acc | field test acc | field macro-F1 | field: answers / accuracy when answering | lab-only model in the field | old leaky split would say |",
             "|---|---|---|---|---|---|---|---|"]
    for name, r in rep.items():
        cm_plot(r["confusion_test"], r["classes"], f"{name}: all test photos", a.out / f"cm_{name}_all.png")
        if r.get("confusion_test_field"): cm_plot(r["confusion_test_field"], r["classes"], f"{name}: field test photos", a.out / f"cm_{name}_field.png")
        L, Fd, B = r.get("test_lab") or {}, r.get("test_field") or {}, (r.get("lab_only_baseline") or {}).get("test_field") or {}
        lines.append(f"| {name} | {len(r['classes'])} | {pct(L.get('accuracy'))} (n={L.get('n', 0)}) | {pct(Fd.get('accuracy'))} (n={Fd.get('n', 0)}) | "
                     f"{pct(Fd.get('macro_f1'))} | {pct(Fd.get('coverage_at_threshold'))} / {pct(Fd.get('accuracy_when_answering'))} | "
                     f"{pct(B.get('accuracy'))} | {pct(r.get('leaky_random_split_test_accuracy'))} |")
    (a.out / "results.md").write_text("\n".join(lines) + "\n"); print("\n".join(lines))

if __name__ == "__main__":
    main()
