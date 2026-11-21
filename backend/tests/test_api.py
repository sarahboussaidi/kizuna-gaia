import json, shutil, subprocess
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from gaia import engine, nexus
from gaia.main import KB, app

client = TestClient(app)
ok = lambda v: {"value": v, "status": "ok"}
PROFILES = [
    {"climate": {"rain_mm": ok(180), "tmax_hot": ok(36)}, "terrain": {"slope_pct": ok(12)}, "water": {"source": ok("rainfed")}, "crop": ok("olive")},
    {"climate": {"rain_mm": ok(420)}, "terrain": {"slope_pct": ok(2)}, "water": {"source": ok("well")}, "crop": ok("cereal"), "energy": {"pump": ok("diesel")}},
    {"climate": {"rain_mm": ok(90)}, "terrain": {}, "water": {}},
    {},
]
NEXUS = dict(et0=[60, 70, 100, 130, 170, 200, 220, 200, 150, 110, 70, 55],
             rain=[35, 30, 30, 20, 12, 4, 1, 4, 20, 35, 35, 40], kc=0.7, area_ha=2, ea=0.9, head_m=40,
             pump_eff=0.45, pr=0.75, ghi=[3.2, 4.1, 5.3, 6.4, 7.2, 7.9, 7.9, 7.1, 5.8, 4.5, 3.4, 2.9],
             months=[1] * 12, prices={"grid_tnd_kwh": 0.2})


@pytest.fixture(scope="module")
def js():
    if not shutil.which("node"):
        pytest.skip("node not installed")
    p = subprocess.run(["node", str(Path(__file__).with_name("js_ref.js"))], input=json.dumps({"profiles": PROFILES, "nexus": NEXUS}),
                       capture_output=True, text=True, check=True)
    return json.loads(p.stdout)


def test_engine_matches_js(js):
    for prof, ref in zip(PROFILES, js["engine"]):
        py = [{"id": r["technique"], "verdict": r["verdict"], "score": r["score"]} for r in engine.evaluate_all(KB["records"], prof)]
        assert [(x["id"], x["verdict"]) for x in py] == [(x["id"], x["verdict"]) for x in ref]
        for a, b in zip(py, ref):
            assert (a["score"] is None) == (b["score"] is None)
            if a["score"] is not None:
                assert a["score"] == pytest.approx(b["score"])


def test_nexus_matches_js(js):
    py, ref = nexus.compute(**NEXUS), js["nexus"]
    assert py["totals"]["vol"] == pytest.approx(ref["totals"]["vol"])
    assert py["totals"]["kwh"] == pytest.approx(ref["totals"]["kwh"])
    assert py["solar"]["kwp"] == pytest.approx(ref["solar"]["kwp"])
    assert py["costs"]["grid_tnd_year"] == pytest.approx(ref["costs"]["grid"])


def test_empty_profile_is_never_feasible():
    for r in client.post("/analyze", json={"profile": {}}).json()["results"]:
        assert r["verdict"] in ("insufficient", "rejected")
        assert r["score"] is None


def test_nexus_endpoint_reports_missing():
    body = {k: v for k, v in NEXUS.items() if k not in ("area_ha", "head_m")}
    res = client.post("/nexus/calculate", json=body).json()
    assert set(res["missing"]) >= {"area", "head"}
    assert res["solar"] is None


def test_solar_simulation_is_labelled_and_plausible():
    res = client.post("/solar/simulate", json={"lat": 34.7, "lon": 10.7, "ghi": NEXUS["ghi"]}).json()
    assert res["label"] == "simulation"
    yield_kwh_kwp = res["annual_kwh"] / res["kwp"]
    assert 1300 < yield_kwh_kwp < 2100
    assert 0 < res["light_share_year"] < 1


def test_diagnose_refuses_without_model():
    r = client.post("/diagnose", files={"image": ("leaf.jpg", b"\xff\xd8\xff", "image/jpeg")})
    assert r.status_code == 503
    assert r.json()["detail"]["status"] == "model_not_loaded"


def test_feedback_appends(tmp_path, monkeypatch):
    import gaia.main as m
    monkeypatch.setattr(m, "FEEDBACK", tmp_path / "fb.jsonl")
    r = client.post("/feedback", json={"kind": "recommendation", "text": "La pente est mal estimée", "context": {"technique": "tn-jessour"}})
    assert r.status_code == 201
    assert json.loads((tmp_path / "fb.jsonl").read_text().splitlines()[0])["expert_status"] == "pending"


def test_knowledge_endpoint():
    assert client.get("/knowledge/techniques").json()["count"] == 11
    assert all(r["origin"] == "jp" for r in client.get("/knowledge/techniques?origin=jp").json()["records"])


# ---------------------------------------------------------------- vision with a test-only model
def _fixed_logits_model(path, logits):
    """A tiny ONNX graph that ignores its input and returns fixed logits. For tests only."""
    import numpy as np
    from onnx import TensorProto, helper, numpy_helper
    x = helper.make_tensor_value_info("x", TensorProto.FLOAT, [1, 3, 8, 8])
    y = helper.make_tensor_value_info("y", TensorProto.FLOAT, [1, len(logits)])
    w = numpy_helper.from_array(np.zeros((3 * 8 * 8, len(logits)), np.float32), "w")
    b = numpy_helper.from_array(np.asarray([logits], np.float32), "b")
    shp = numpy_helper.from_array(np.asarray([1, -1], np.int64), "shp")
    g = helper.make_graph([helper.make_node("Reshape", ["x", "shp"], ["f"]),
                           helper.make_node("MatMul", ["f", "w"], ["m"]),
                           helper.make_node("Add", ["m", "b"], ["y"])], "t", [x], [y], [w, b, shp])
    model = helper.make_model(g, opset_imports=[helper.make_opsetid("", 13)])
    model.ir_version = 8
    path.write_bytes(model.SerializeToString())


def _png():
    import io
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (40, 30), (60, 140, 50)).save(buf, "PNG")
    return buf.getvalue()


def _install(tmp_path, monkeypatch, s1_logits, s2_logits=None, threshold=0.6):
    import pytest
    pytest.importorskip("onnxruntime"); pytest.importorskip("onnx"); pytest.importorskip("PIL")
    import gaia.main as m
    _fixed_logits_model(tmp_path / "s1.onnx", s1_logits)
    man = {"version": "test", "input": {"size": 8},
           "stage1": {"file": "s1.onnx", "classes": ["olive", "palm", "citrus", "other"], "threshold": threshold}}
    if s2_logits:
        _fixed_logits_model(tmp_path / "olive.onnx", s2_logits)
        man["stage2"] = {"olive": {"file": "olive.onnx", "classes": ["healthy", "peacock_spot"], "threshold": threshold}}
        man["guidance"] = {"olive/peacock_spot": {"fr": "test", "validated_by": "test"}}
    (tmp_path / "manifest.json").write_text(json.dumps(man))
    monkeypatch.setattr(m, "MODEL_DIR", tmp_path)


def test_diagnose_two_stages(tmp_path, monkeypatch):
    _install(tmp_path, monkeypatch, [5, 0, 0, 0], [0, 5])
    r = client.post("/diagnose", files={"image": ("leaf.png", _png(), "image/png")})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "ok" and body["tree"] == "olive" and body["disease"] == "peacock_spot"
    assert body["guidance"]["validated_by"] == "test"


def test_diagnose_abstains_when_unsure(tmp_path, monkeypatch):
    _install(tmp_path, monkeypatch, [1, 1, 1, 1])
    r = client.post("/diagnose", files={"image": ("leaf.png", _png(), "image/png")})
    assert r.status_code == 200 and r.json()["status"] == "unsure" and r.json()["disease"] is None


def test_diagnose_rejects_bad_image(tmp_path, monkeypatch):
    _install(tmp_path, monkeypatch, [5, 0, 0, 0])
    r = client.post("/diagnose", files={"image": ("leaf.jpg", b"not an image", "image/jpeg")})
    assert r.status_code == 422 and r.json()["detail"]["status"] == "bad_image"


def test_diagnose_reports_broken_manifest(tmp_path, monkeypatch):
    import gaia.main as m
    (tmp_path / "manifest.json").write_text(json.dumps({"stage1": {"file": "missing.onnx", "classes": ["olive"]}}))
    monkeypatch.setattr(m, "MODEL_DIR", tmp_path)
    r = client.post("/diagnose", files={"image": ("leaf.png", b"x", "image/png")})
    assert r.status_code == 503 and r.json()["detail"]["status"] == "manifest_invalid"
