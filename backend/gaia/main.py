"""GAIA API — FastAPI backend.

Run:  uvicorn gaia.main:app --reload   (from the backend/ folder)
Every endpoint returns what it can compute and says what is missing. No endpoint
invents a value: if a model or a source is not available, the answer says so.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import engine, nexus, solar, vision

DATA = Path(__file__).resolve().parent.parent / "data"
KB = json.loads((DATA / "knowledge.json").read_text(encoding="utf-8"))
FEEDBACK = Path(os.environ.get("GAIA_FEEDBACK_FILE", DATA / "feedback.jsonl"))
MODEL_DIR = Path(os.environ.get("GAIA_MODEL_DIR", DATA.parent / "models" / "gaia-vision"))

app = FastAPI(title="GAIA API", version="0.1.0",
              description="Land intelligence for Tunisian farms. Rules, calculations and simulations; no invented outputs.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "records": len(KB["records"]), "vision_model": (MODEL_DIR / "manifest.json").exists()}


@app.get("/knowledge/techniques")
def techniques(origin: Optional[str] = None) -> dict:
    recs = [r for r in KB["records"] if origin is None or r["origin"] == origin]
    return {"count": len(recs), "families": KB.get("families"), "records": recs}


@app.get("/parcel/profile")
async def parcel_profile(lat: float, lon: float) -> dict:
    if not (30 <= lat <= 38 and 7 <= lon <= 12):
        raise HTTPException(422, "Point outside the Tunisia bounding box.")
    from . import profile
    return await profile.build(lat, lon)


class AnalyzeIn(BaseModel):
    profile: dict[str, Any] = Field(..., description="GAIA LAND DNA (nested) or flat {'climate.rain_mm': 180, 'crop': 'olive', ...}")
    technique: Optional[str] = None


@app.post("/analyze")
def analyze(body: AnalyzeIn) -> dict:
    recs = KB["records"]
    if body.technique:
        recs = [r for r in recs if r["id"] == body.technique]
        if not recs:
            raise HTTPException(404, f"Unknown technique {body.technique}")
    results = engine.evaluate_all(recs, body.profile)
    return {"method": "explicit rules from the knowledge base (no ML)", "results": results}


class NexusIn(BaseModel):
    et0: list[Optional[float]] = Field(..., min_length=12, max_length=12)
    rain: list[Optional[float]] = Field(..., min_length=12, max_length=12)
    kc: Optional[float] = None
    months: Optional[list[int]] = None
    area_ha: Optional[float] = None
    ea: float = 0.9
    head_m: Optional[float] = None
    pump_eff: float = 0.45
    pr: float = 0.75
    ghi: Optional[list[Optional[float]]] = None
    prices: Optional[dict[str, float]] = None


@app.post("/nexus/calculate")
def nexus_calculate(body: NexusIn) -> dict:
    return nexus.compute(**body.model_dump())


class SolarIn(BaseModel):
    lat: float
    lon: float
    ghi: list[Optional[float]] = Field(..., min_length=12, max_length=12, description="monthly mean kWh/m²/day")
    tilt: float = 20
    azimuth: float = 180
    height: float = 4
    width: float = 2
    pitch: float = 8
    area_ha: float = 1
    density_wp_m2: float = 200
    pr: float = 0.8
    albedo: float = 0.2


@app.post("/solar/simulate")
def solar_simulate(body: SolarIn) -> dict:
    if body.pitch <= body.width:
        raise HTTPException(422, "pitch must be larger than panel width")
    return solar.simulate(**body.model_dump())


@app.post("/diagnose")
async def diagnose(image: UploadFile = File(...)) -> dict:
    """Two-stage plant-health check. 503 with a clear status when no usable model is installed."""
    try:
        return vision.diagnose(MODEL_DIR, await image.read())
    except vision.VisionUnavailable as e:
        raise HTTPException(503, detail=e.detail) from e
    except vision.BadImage as e:
        raise HTTPException(422, detail={"status": "bad_image", "message": str(e)}) from e


class FeedbackIn(BaseModel):
    kind: Literal["recommendation", "diagnosis", "data", "other"] = "other"
    role: Optional[str] = None
    text: str = Field(..., min_length=1, max_length=4000)
    context: dict[str, Any] = {}


@app.post("/feedback", status_code=201)
def feedback(body: FeedbackIn) -> dict:
    item = body.model_dump() | {"at": datetime.now(timezone.utc).isoformat(), "expert_status": "pending"}
    FEEDBACK.parent.mkdir(parents=True, exist_ok=True)
    with FEEDBACK.open("a", encoding="utf-8") as f:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")
    return {"stored": True, "expert_status": "pending"}
