"""Build raw images + data/index.csv from the public Hugging Face (Project-AgML) datasets.

    python scripts/10_fetch_hf.py --hf hf --out raw_hf --index data/index.csv

Every row keeps its SOURCE dataset and its DOMAIN (lab = plain background, field = real
orchard/garden photo). Those two columns are what let 11_split.py and 12_train_heads.py
measure the lab -> field gap honestly instead of hiding it.

Download the parquet files first (needs huggingface.co):
    huggingface-cli download --repo-type dataset Project-AgML/plant_village_classification --local-dir hf/plant_village_classification
    (same for plant_doc_classification, citrus_fruit_leaf_disease_classification, orange_leaf_disease_classification,
     grape_leaf_disease_classification, date_palm_leaf_disease_classification, date_palm_leaf_disease_classification_iraq)
"""
import argparse, csv, glob, io, json, random, re
from pathlib import Path

import pyarrow.parquet as pq
from PIL import Image

slug = lambda s: re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")

# PlantVillage: crop name -> GAIA plant. Crops not grown at scale in Tunisia (or outside the
# app's scope) become the "other" class, so stage 1 learns to refuse them.
PV_PLANT = {"tomato": "tomato", "potato": "potato", "pepper": "pepper", "grape": "grape"}
PV_DISEASE = {"leaf_blight_isariopsis_leaf_spot": "isariopsis_leaf_spot", "esca_black_measles": "esca",
              "spider_mites_two_spotted_spider_mite": "spider_mites", "tomato_mosaic_virus": "mosaic_virus",
              "tomato_yellow_leaf_curl_virus": "yellow_leaf_curl_virus"}

# PlantDoc = real field photos (web/garden), same crops as PlantVillage -> our field test set.
PLANTDOC = {
    "Tomato leaf": ("tomato", "healthy"), "Tomato Early blight leaf": ("tomato", "early_blight"),
    "Tomato Septoria leaf spot": ("tomato", "septoria_leaf_spot"), "Tomato leaf bacterial spot": ("tomato", "bacterial_spot"),
    "Tomato leaf late blight": ("tomato", "late_blight"), "Tomato leaf mosaic virus": ("tomato", "mosaic_virus"),
    "Tomato leaf yellow virus": ("tomato", "yellow_leaf_curl_virus"), "Tomato mold leaf": ("tomato", "leaf_mold"),
    "Tomato two spotted spider mites leaf": ("tomato", "spider_mites"),
    "Potato leaf early blight": ("potato", "early_blight"), "Potato leaf late blight": ("potato", "late_blight"),
    "Bell_pepper leaf": ("pepper", "healthy"), "Bell_pepper leaf spot": ("pepper", "bacterial_spot"),
    "grape leaf": ("grape", "healthy"), "grape leaf black rot": ("grape", "black_rot"),
}

def pv_map(name):
    if "___" not in name:
        return ("other", "background") if "background" in name.lower() else None
    crop, dis = name.split("___", 1)
    crop = slug(re.sub(r"\(.*?\)", "", crop)).split("_")[0]
    dis = PV_DISEASE.get(slug(dis), slug(dis))
    if crop in PV_PLANT: return PV_PLANT[crop], dis
    if crop == "orange": return None          # HLB only exists in the lab set -> would teach "lab background = greening"
    return "other", crop

def plantdoc_map(name):
    if name in PLANTDOC: return PLANTDOC[name]
    return "other", slug(name.split(" ")[0])  # apple, corn, cherry... field photos of crops GAIA must refuse

def citrus_map(name, row):
    if row.get("plant_part") != 1: return None   # leaves only (0 = fruit)
    return "citrus", name

ORANGE = {"citrus_canker": "canker", "citrus_greening": "greening", "yellow_dragon": "greening",
          "healthy_leaf": "healthy", "powdery_mildew": "powdery_mildew", "citrus_mealybugs": "mealybugs",
          "spiny_whitefly": "spiny_whitefly", "shot_hole": "shot_hole", "die_back": "die_back"}
GRAPE = {"Bacterial Leaf Spot": "bacterial_leaf_spot", "Downy Mildew": "downy_mildew", "Healthy Leaves": "healthy", "Powdery Mildew": "powdery_mildew"}
PALM = lambda n: ("palm", {"healthy_sample": "healthy", "honey": "honeydew", "bug": "dubas_bug", "dubas": "dubas"}.get(slug(n), slug(n)))

#        folder name                                   source tag   domain   mapper                                           cap/class
SOURCES = [
    ("plant_village_classification",                "plantvillage", "lab",   lambda n, r: pv_map(n),                            450),
    ("plant_doc_classification",                    "plantdoc",     "field", lambda n, r: plantdoc_map(n),                      None),
    ("citrus_fruit_leaf_disease_classification",    "citrus_sl",    "field", citrus_map,                                        None),
    ("orange_leaf_disease_classification",          "orange_leaf",    "field", lambda n, r: ("citrus", ORANGE[n]) if n in ORANGE else None, 350),
    ("grape_leaf_disease_classification",           "grape_agml",   "field", lambda n, r: ("grape", GRAPE[n]),                  None),
    ("date_palm_leaf_disease_classification",       "palm_sa",      "field", lambda n, r: PALM(n),                              None),
    ("date_palm_leaf_disease_classification_iraq",  "palm_iq",      "field", lambda n, r: PALM(n),                              400),
]
OTHER_CAP = 120   # per "other" sub-class, so refusals do not swamp the real plants

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--hf", type=Path, default=Path("hf")); ap.add_argument("--out", type=Path, default=Path("raw_hf"))
    ap.add_argument("--index", type=Path, default=Path("data/index.csv")); ap.add_argument("--short", type=int, default=288)
    a = ap.parse_args(); rows = []; random.seed(0)
    for folder, src, domain, mapper, cap in SOURCES:
        files = sorted(glob.glob(str(a.hf / folder / "data" / "*.parquet")))
        if not files: print("missing", folder); continue
        names = json.loads(pq.ParquetFile(files[0]).schema_arrow.metadata[b"huggingface"])["info"]["features"]["label"]["names"]
        cols = [c for c in ("label", "plant_part") if c in pq.ParquetFile(files[0]).schema_arrow.names]
        meta = []   # first pass: labels only (cheap), to cap classes before decoding images
        for fi, f in enumerate(files):
            t = pq.read_table(f, columns=cols).to_pylist()
            meta += [(fi, i, r) for i, r in enumerate(t)]
        by = {}
        for fi, i, r in meta:
            m = mapper(names[r["label"]], r)
            if m: by.setdefault(m, []).append((fi, i))
        keep = {}
        for m, ids in by.items():
            random.shuffle(ids); c = OTHER_CAP if m[0] == "other" else cap
            for k in ids[:c] if c else ids: keep[k] = m
        n = 0
        for fi, f in enumerate(files):
            want = {i: keep[(fi, i)] for (ffi, i) in keep if ffi == fi}
            if not want: continue
            pf = pq.ParquetFile(f); off = 0
            for batch in pf.iter_batches(batch_size=256, columns=["image"]):
                for j, im in enumerate(batch.column("image").to_pylist()):
                    i = off + j
                    if i not in want: continue
                    plant, dis = want[i]
                    img = Image.open(io.BytesIO(im["bytes"])).convert("RGB")
                    s = a.short / min(img.size)
                    if s < 1: img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.BICUBIC)
                    p = a.out / plant / dis / f"{src}_{fi}_{i}.jpg"; p.parent.mkdir(parents=True, exist_ok=True)
                    img.save(p, quality=90); n += 1
                    rows.append([str(p.resolve()), plant, dis, src, domain])
                off += len(batch)
        print(f"{src:14s} {domain:5s} {n:6d} images  {len(by)} classes")
    a.index.parent.mkdir(parents=True, exist_ok=True)
    with open(a.index, "w", newline="") as fh:
        w = csv.writer(fh); w.writerow(["path", "plant", "disease", "source", "domain"]); w.writerows(rows)
    print("total", len(rows), "->", a.index)

if __name__ == "__main__":
    main()
