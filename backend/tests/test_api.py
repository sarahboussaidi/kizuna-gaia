import json, shutil, subprocess
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from gaia import engine, guard, nexus
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


# --- groundwater guard -------------------------------------------------------
GUARDS = [dict(NEXUS), dict(NEXUS, pv_kwp=15, flow_m3_h=6), dict(NEXUS, safe_yield_m3_year=4000)]


@pytest.fixture(scope="module")
def js_guard():
    if not shutil.which("node"):
        pytest.skip("node not installed")
    p = subprocess.run(["node", str(Path(__file__).with_name("js_ref.js"))],
                       input=json.dumps({"profiles": [], "nexus": NEXUS, "guard": GUARDS}),
                       capture_output=True, text=True, check=True)
    return json.loads(p.stdout)["guard"]


def test_guard_matches_js(js_guard):
    for inp, ref in zip(GUARDS, js_guard):
        py = guard.guard(**inp)
        assert py["status"] == ref["status"]
        for k in ("need", "capacity", "allowed", "blocked", "deficit", "freed_kwh", "share"):
            assert py["totals"][k] == pytest.approx(ref["totals"][k])
        for a, b in zip(py["months"], ref["months"]):
            assert a["allowed_m3"] == pytest.approx(b["allowed_m3"])
            assert (a["hours_per_day"] is None) == (b["hours_per_day"] is None)


def test_guard_never_pumps_more_than_the_crop_needs():
    res = guard.guard(**GUARDS[1])
    for x in res["months"]:
        assert x["allowed_m3"] <= x["need_m3"] + 1e-9
        assert x["allowed_m3"] <= x["capacity_m3"] + 1e-9
    assert res["totals"]["blocked"] > 0 and res["status"] == "guarded"
    assert res["totals"]["over_ratio"] > 1


def test_sized_array_matches_need_in_peak_month_and_over_pumps_elsewhere():
    res = guard.guard(**NEXUS)
    peak = res["nexus"]["solar"]["peak_month"]
    assert res["months"][peak]["capacity_m3"] == pytest.approx(res["months"][peak]["need_m3"])
    winter = res["months"][0]
    assert winter["capacity_m3"] > winter["need_m3"]
    assert res["totals"]["freed_kwh"] > 0


def test_safe_yield_scales_every_month_down():
    res = guard.guard(**GUARDS[2])
    assert res["status"] == "aquifer_limited"
    assert res["totals"]["allowed"] == pytest.approx(4000)
    assert res["totals"]["deficit"] == pytest.approx(res["totals"]["need"] - 4000)


def test_guard_endpoint_reports_missing_and_does_not_guess():
    body = {k: v for k, v in NEXUS.items() if k != "head_m"}
    res = client.post("/nexus/guard", json=body).json()
    assert res["status"] == "incomplete"
    assert set(res["missing"]) >= {"head", "pv"}
    assert res["totals"] is None
    ok_ = client.post("/nexus/guard", json=GUARDS[1]).json()
    assert ok_["status"] == "guarded" and ok_["kwp_source"] == "installed"
