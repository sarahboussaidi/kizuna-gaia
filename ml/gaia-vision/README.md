# GAIA vision — train & plug in the models (steps 2–6)

**v2 (current model, `models/gaia-vision/`)**: leakage-free split, frozen EfficientNet-B0 + linear heads, lab vs field
evaluation. Why v1 looked perfect but overfit, the results and the commands: [TRAINING_REPORT.md](TRAINING_REPORT.md).
The notebooks below are the v1 pipeline (kept for olive / Kaggle data); prefer `scripts/10_*`–`14_*`.

Easiest way: open `GAIA_Vision_Kaggle.ipynb` (Kaggle, GPU + Internet on) or `GAIA_Vision_Training.ipynb` (Colab) and run all cells.
Plants covered: olive, palm (date palm), citrus + 13 PlantVillage crops (apple, blueberry, cherry, corn, grape, peach, pepper,
potato, raspberry, soybean, squash, strawberry, tomato). Plants with a single class in PlantVillage (blueberry, raspberry,
soybean) are identified but get no disease model; the page then shows only the plant.

## Manual / local run (all commands from `ml/gaia-vision`)
    python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
    pip install -r requirements.txt

Data layout: `raw/<plant>/<class>/*.jpg` — folder `other_crops` = the "other" (refuse) class.

    python scripts/01_prepare.py --raw raw
    python scripts/02_train.py --task tree
    python scripts/02_train.py --task disease --tree olive      # repeat for each plant with >= 2 classes
    python scripts/03_calibrate_export.py --name tree
    python scripts/03_calibrate_export.py --name disease_olive  # repeat
    python scripts/04_build_manifest.py                         # writes ../../models/gaia-vision/manifest.json

Fill `advice.json` (key `<plant>/<disease>`, FR + AR, agronomist in `validated_by`) before the last step; unvalidated
entries are skipped and the page shows "no validated advice".
Then serve the site over http (not file://) and reload /health.
