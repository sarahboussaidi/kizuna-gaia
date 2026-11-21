# GAIA API (FastAPI)

The website works on its own in the browser. This backend exposes the same logic as an API, for a mobile app, a partner, or server-side checks.

```bash
cd backend
python -m venv .venv && . .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn gaia.main:app --reload                   # http://127.0.0.1:8000/docs
pytest -q                                        # needs node for the JS parity tests
```

| Endpoint | What it does | Status |
|---|---|---|
| `GET /health` | records loaded, whether a vision model is installed | implemented |
| `GET /knowledge/techniques?origin=tn\|jp\|x` | the 11 knowledge records (exported from `js/kb.js` by `tools/export_kb.js`) | implemented |
| `GET /parcel/profile?lat=&lon=` | GAIA LAND DNA from Open-Meteo (ERA5), Copernicus DEM, NASA POWER; soil only from a local SoilGrids raster (`GAIA_SOIL_RASTER`) | implemented, needs internet; not tested from the build sandbox |
| `POST /analyze` | compatibility rules, verdicts feasible / adapt / insufficient / rejected | implemented, parity-tested against the browser engine |
| `POST /nexus/calculate` | FAO-56 water need → pumping energy → solar size → monthly quota | implemented, parity-tested |
| `POST /solar/simulate` | agrivoltaic simulation with pvlib (SPA, Erbs, isotropic) + 2-D row shading | implemented, labelled *simulation* |
| `POST /diagnose` | two-stage plant health (tree, then disease) with ONNX models from `models/gaia-vision/manifest.json` (or `GAIA_MODEL_DIR`); abstains when unsure | implemented; returns **503 model_not_loaded** until a validated model is installed (none is shipped yet) |
| `POST /feedback` | Kaizen correction, appended to `data/feedback.jsonl` with `expert_status: pending` | implemented |

To make the website send Kaizen feedback here, set `feedbackEndpoint: 'http://127.0.0.1:8000/feedback'` in `js/gaia-core.js` (`CONFIG`).

When `js/kb.js` changes, run `node tools/export_kb.js` again.
