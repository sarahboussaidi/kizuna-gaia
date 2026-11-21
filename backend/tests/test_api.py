import json, shutil, subprocess
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from gaia import business, engine, nexus
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

KWH = [100, 150, 300, 500, 800, 1000, 1200, 1100, 700, 300, 120, 80]
PAYG = [
    dict(kit_tnd=24000, diesel_tnd_year=9000, maint_tnd_year=300),
    dict(kit_tnd=24000, diesel_tnd_year=9000, maint_tnd_year=300, monthly_kwh=KWH, seasonal=True, start_month=3),
    dict(kit_tnd=40000, diesel_tnd_year=6000, term_months=24, fee_rate=0.12),
    dict(kit_tnd=24000),
]
COOP = dict(kit_tnd=30000, individual_kit_tnd=18000, members=[
    {"name": "A", "quota_m3": 6000, "diesel_tnd_year": 5000}, {"name": "B", "quota_m3": 3000, "diesel_tnd_year": 2600},
    {"name": "C", "quota_m3": 4500}])
ADOPTION = [
    dict(ghi_mean=5.4, water_source="well", has_quota=True, payg=PAYG[0],
         ease={k: True for k in business.EASE_KEYS}, partners={"coop_gda": True, "finance": True, "installer": True, "tn_jp": False}),
    dict(ghi_mean=4.3, water_source="rainfed"),
    dict(),
]


@pytest.fixture(scope="module")
def js():
    if not shutil.which("node"):
        pytest.skip("node not installed")
    p = subprocess.run(["node", str(Path(__file__).with_name("js_ref.js"))], input=json.dumps({"profiles": PROFILES, "nexus": NEXUS, "business": {"payg": PAYG, "coop": COOP, "adoption": ADOPTION}}),
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


def _close(a, b):
    if isinstance(a, dict):
        assert set(k for k in b if b[k] is not None) <= set(a), (a.keys(), b.keys())
        for k in b:
            _close(a.get(k), b[k])
    elif isinstance(a, list):
        assert len(a) == len(b)
        for x, y in zip(a, b):
            _close(x, y)
    elif isinstance(a, (int, float)) and not isinstance(a, bool) and b is not None:
        assert a == pytest.approx(b)
    else:
        assert a == b


def test_business_matches_js(js):
    for inp, ref in zip(PAYG, js["payg"]):
        _close(business.payg(**inp), ref)
    _close(business.coop(**COOP), js["coop"])
    for inp, ref in zip(ADOPTION, js["adoption"]):
        d = dict(inp, payg=business.payg(**inp["payg"]) if inp.get("payg") else None)
        _close(business.adoption(**d), ref)


def test_payg_seasonal_follows_pumping():
    r = business.payg(**PAYG[1])
    jan = [x for x in r["schedule"] if x["month"] == 0][0]["installment"]
    jul = [x for x in r["schedule"] if x["month"] == 6][0]["installment"]
    assert jul > 10 * jan
    assert r["installments_term"] == pytest.approx(r["total"])


def test_coop_allowance_is_sum_of_quotas():
    r = client.post("/business/coop", json=COOP).json()
    assert r["quota_m3"] == 13500
    assert sum(m["share"] for m in r["members"]) == pytest.approx(1)
    assert r["capex_saved"] == pytest.approx(18000 * 3 - 30000)


def test_business_endpoints_report_missing():
    assert client.post("/business/payg", json={"kit_tnd": 1000}).json()["missing"] == ["diesel"]
    res = client.post("/business/adoption", json={}).json()
    assert res["overall"] in ("unk", "no")
