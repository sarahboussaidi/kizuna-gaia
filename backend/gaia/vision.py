"""GAIA VISION, server side: the same two-stage pipeline as js/health.js.

1. stage 1 model: which tree (olive / palm / citrus / other)
2. stage 2 model for that tree: which disease
3. softmax with the manifest's calibration temperature
4. abstain under the manifest's threshold, or when the tree is "other"
5. guidance only when an expert-validated card exists in the manifest

Nothing here invents a result. Every way the model can be missing or broken
raises VisionUnavailable with a status code the API turns into a clear 503.
"""
from __future__ import annotations

import io
import json
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np


class VisionUnavailable(Exception):
    def __init__(self, status: str, message: str, **extra: Any):
        super().__init__(message)
        self.detail = {"status": status, "message": message, **extra}


class BadImage(ValueError):
    pass


def load_manifest(model_dir: Path) -> dict:
    path = model_dir / "manifest.json"
    if not path.exists():
        raise VisionUnavailable(
            "model_not_loaded",
            "No validated plant-health model is installed. GAIA does not return a diagnosis without one.",
            expected=str(path))
    try:
        m = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise VisionUnavailable("manifest_invalid", f"manifest.json is not valid JSON: {e}") from e
    s1 = m.get("stage1") or {}
    if not s1.get("file") or not s1.get("classes"):
        raise VisionUnavailable("manifest_invalid", "manifest.json needs stage1.file and stage1.classes.")
    for name, spec in [("stage1", s1), *((f"stage2.{k}", v) for k, v in (m.get("stage2") or {}).items())]:
        if not (model_dir / spec.get("file", "")).is_file():
            raise VisionUnavailable("manifest_invalid", f"{name}: model file {spec.get('file')!r} not found in {model_dir}.")
    return m


def _ort():
    try:
        import onnxruntime  # noqa: WPS433 (optional dependency)
    except ImportError as e:
        raise VisionUnavailable(
            "runtime_missing",
            "A model is installed but onnxruntime is not. Run: pip install onnxruntime pillow") from e
    return onnxruntime


@lru_cache(maxsize=8)
def _session(path: str, mtime: float):
    return _ort().InferenceSession(path, providers=["CPUExecutionProvider"])


def preprocess(data: bytes, spec: dict) -> np.ndarray:
    """Centre crop to a square, resize, scale to [0,1], normalise, NCHW. Matches tensorFrom() in js/health.js."""
    try:
        from PIL import Image, UnidentifiedImageError
    except ImportError as e:
        raise VisionUnavailable("runtime_missing", "Pillow is needed to read images. Run: pip install pillow") from e
    try:
        img = Image.open(io.BytesIO(data)).convert("RGB")
    except (UnidentifiedImageError, OSError) as e:
        raise BadImage("The file is not a readable image.") from e
    size = int(spec.get("size", 224))
    w, h = img.size
    s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((size, size), Image.BILINEAR)
    x = np.asarray(img, dtype=np.float32) / 255.0
    mean = np.asarray(spec.get("mean", [0, 0, 0]), dtype=np.float32)
    std = np.asarray(spec.get("std", [1, 1, 1]), dtype=np.float32)
    x = (x - mean) / std
    return x.transpose(2, 0, 1)[None].astype(np.float32)


def softmax(logits: np.ndarray, temperature: float = 1.0) -> np.ndarray:
    z = np.asarray(logits, dtype=np.float64).ravel() / (temperature or 1.0)
    e = np.exp(z - z.max())
    return e / e.sum()


def run_stage(model_dir: Path, spec: dict, x: np.ndarray) -> dict:
    path = model_dir / spec["file"]
    sess = _session(str(path), path.stat().st_mtime)
    out = sess.run(None, {sess.get_inputs()[0].name: x})[0]
    probs = softmax(out, spec.get("temperature", 1.0))
    classes = spec["classes"]
    if len(probs) != len(classes):
        raise VisionUnavailable("manifest_invalid", f"{spec['file']} returns {len(probs)} scores but the manifest lists {len(classes)} classes.")
    ranked = sorted(({"label": c, "p": round(float(p), 4)} for c, p in zip(classes, probs)), key=lambda r: -r["p"])
    return {"ranked": ranked, "top": ranked[0], "abstain": ranked[0]["p"] < spec.get("threshold", 0.5)}


def diagnose(model_dir: Path, image: bytes) -> dict:
    m = load_manifest(model_dir)
    x = preprocess(image, m.get("input") or {})
    s1 = run_stage(model_dir, m["stage1"], x)
    tree = s1["top"]["label"]
    res: dict[str, Any] = {"status": "ok", "model_version": m.get("version"), "tree": tree, "stage1": s1,
                           "stage2": None, "disease": None, "guidance": None}
    if s1["abstain"]:
        res["status"] = "unsure"
        return res
    if tree == "other":
        res["status"] = "unsupported_tree"
        return res
    spec2 = (m.get("stage2") or {}).get(tree)
    if not spec2:
        res["status"] = "no_disease_model"
        return res
    s2 = run_stage(model_dir, spec2, x)
    res["stage2"] = s2
    if s2["abstain"]:
        res["status"] = "unsure"
        return res
    res["disease"] = s2["top"]["label"]
    res["guidance"] = (m.get("guidance") or {}).get(f"{tree}/{res['disease']}")
    return res
