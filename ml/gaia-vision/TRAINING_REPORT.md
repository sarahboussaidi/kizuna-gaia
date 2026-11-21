# GAIA Vision v2: why v1 "overfit" and what changed

## Diagnosis of the v1 notebook (`GAIA_Vision_Kaggle.ipynb`)
The v1 scores (stage 1: 99.8 %, apple/cherry/grape: 100 %) were not real. They came from:

1. **Leaky split.** `01_prepare.py` split by a hash of the *file name*. PlantVillage photographs the same leaf several
   times, and the olive (Kaggle) and date-palm (Mendeley) sets ship rotated/flipped/recoloured copies of each photo under
   new names. Exact-MD5 de-duplication does not catch those, so copies sat in train *and* test. Measured here on palm:
   a file-level split reports 89 %, the near-duplicate-grouped split 81 %.
2. **Dataset = label shortcut.** Each plant (and some classes) came from a single dataset with its own background and camera:
   stage 1 learned "which dataset", not "which leaf". Worst case: `citrus/greening` was mostly PlantVillage *Orange HLB*
   (lab background) while the other citrus classes were field photos, so "plain background" meant "greening".
   Palm `healthy` merged two unrelated datasets (Mendeley leaves + Iraqi drone images).
3. **Lab-only test.** Train and test were both lab photos. Nothing measured the real use (a phone photo in an orchard).
   On field photos, a lab-only tomato model gets **25 %** (10 classes), potato **42 %**.
4. **Full fine-tuning on a few hundred images** (5 M parameters, lr 2e-4, 8 epochs) with unstable validation
   (citrus val acc 0.80 → 0.31 → 0.68) and 1-image classes (citrus melanose: 1 test image).
5. **Export crashed** (`torch.onnx.export` needs `onnxscript` on recent torch), so no model was actually shipped.

## What v2 does (`scripts/10_fetch_hf.py` → `14_report.py`)
- **Data:** PlantVillage (lab, capped 450/class) **plus field photos**: PlantDoc (tomato, potato, pepper, grape),
  Citrus Leaves + Orange Leaf (citrus), Grape Leaf Disease (downy/powdery mildew), date-palm leaves (Mendeley, 9 classes)
  and Iraqi Dubas images. 22,324 images, all CC BY 4.0 via Hugging Face `Project-AgML`. Orange HLB lab images removed.
- **Leakage-free split:** EfficientNet-B0 embeddings, cosine ≥ 0.93 inside a plant → union-find groups
  (1,645 groups of copies, largest 146), groups split 70/15/15 stratified by class.
- **Model:** frozen EfficientNet-B0 (ImageNet) + one linear head per task (≈ 9 k parameters per head). Trained on
  3 augmented views per image (crop, flips, rotation, colour, blur) + the clean view, class-balanced loss, field photos ×2,
  label smoothing, weight decay picked on validation, early stopping on validation loss.
- **Calibration:** temperature scaling on validation (test ECE 0.08–0.12 → 0.01–0.05). Refusal threshold = lowest
  confidence giving ≥ 90 % accuracy on *field* validation photos.
- **Export:** one 16 MB ONNX file with the backbone once and one output per head; manifest stages name their head with
  `"output"`. Checked: ONNX vs PyTorch max diff 5e-6; onnxruntime-web 1.17.3 (the version `health.js` loads) gives the
  same logits; `backend` tests pass, including `/diagnose` on the shipped model.

## Results (held-out test split, see `reports/`)
Lab = PlantVillage photos, field = real photos. "Answers" = share of photos above the refusal threshold.

| model | classes | lab test acc | field test acc | field macro-F1 | field: answers / accuracy when answering | lab-only model in the field | old leaky split would say |
|---|---|---|---|---|---|---|---|
| stage1 | 7 | 95 % (n=1374) | 94 % (n=1966) | 78 % | 100 % / 94 % | – | – |
| citrus | 9 | – (n=0) | 97 % (n=506) | 96 % | 100 % / 97 % | – | 97 % |
| grape | 7 | 98 % (n=256) | 92 % (n=438) | 86 % | 100 % / 92 % | 15 % | 95 % |
| palm | 12 | – (n=0) | 81 % (n=701) | 76 % | 76 % / 90 % | – | 89 % |
| pepper | 2 | 99 % (n=134) | 65 % (n=20) | 65 % | 100 % / 65 % | 70 % | 96 % |
| potato | 3 | 95 % (n=167) | 54 % (n=24) | 55 % | 29 % / 71 % | 42 % | 91 % |
| tomato | 10 | 91 % (n=663) | 48 % (n=112) | 48 % | 7 % / 88 % | 25 % | 84 % |

Confusion matrices: `reports/cm_<model>_field.png` and `reports/cm_<model>_all.png`. Full numbers: `reports/report.json`.

## What this means
- **Citrus, grape, palm, plant identification: usable** on field-style photos (81–97 %), and the palm head refuses
  24 % of photos to stay at 90 % when it answers.
- **Tomato, potato, pepper: not reliable in the field yet** (48 %, 54 %, 65 % on PlantDoc). Calibration makes GAIA
  refuse most of these photos (tomato answers 7 % of field photos, 88 % right when it does) instead of guessing.
  The fix is data, not a bigger network: a few hundred Tunisian field photos per disease (GAIA Kaizen corrections).
- **Olive is not in v2**: its datasets live on Roboflow/Kaggle, which this training environment cannot reach.
  Add `raw/olive/<class>/*.jpg` (with the original, un-augmented photos) and re-run; the scripts pick it up as an extra plant
  once `10_fetch_hf.py`'s index includes it.
- Field test sets are small for pepper (20) and potato (24): treat those numbers as ±15 points.
- No Tunisian test set exists yet. Fill `evaluation` in the manifest with one before any public demo.
- `advice.json` holds draft advice (FR/AR/EN) for a few diseases; none is shipped until an agronomist fills `validated_by`.

## Reproduce (CPU is enough: about 45 minutes on 4 cores)
    pip install -r requirements.txt timm huggingface_hub pyarrow matplotlib
    # parquet files: see the docstring of scripts/10_fetch_hf.py
    curl -L -o efficientnet_b0_ra-3dd342df.pth https://github.com/rwightman/pytorch-image-models/releases/download/v0.1-weights/efficientnet_b0_ra-3dd342df.pth
    python scripts/10_fetch_hf.py --hf hf --out raw_hf --index data/index.csv
    python scripts/11_embed_split.py --index data/index.csv --weights efficientnet_b0_ra-3dd342df.pth --views 3
    python scripts/12_train_heads.py --data data --out models_out
    python scripts/13_export.py --weights efficientnet_b0_ra-3dd342df.pth --heads models_out \
        --dest ../../models/gaia-vision --dest ../../backend/models/gaia-vision
    python scripts/14_report.py --heads models_out --out reports
