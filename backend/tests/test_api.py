import json, shutil, subprocess
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from gaia import business, engine, guard, nexus
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


def test_diagnose_refuses_without_model(tmp_path, monkeypatch):
    import gaia.main as m
    monkeypatch.setattr(m, "MODEL_DIR", tmp_path)   # a model now ships in backend/models; test the empty case explicitly
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


# ---------------------------------------------------------------- soil fallback, assistant, AI Lab retrieval
def test_regional_soil_reference():
    from gaia.profile import regional_soil
    med = regional_soil(33.45, 10.15)            # Matmata / Béni Khédache
    assert med and med["texture"] == "loamy" and 0 < med["clay_pct"] < 40 and med["km"] < 10
    assert regional_soil(45.0, 2.0) is None      # far from Tunisia: no guess


def test_assistant_without_key_is_503(monkeypatch):
    for k in ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_PROFILE"):
        monkeypatch.delenv(k, raising=False)
    r = client.post("/assistant", json={"question": "Combien coûte une citerne ?"})
    assert r.status_code == 503 and r.json()["detail"]["status"] == "no_api_key"


def test_assistant_grounded_prompt():
    from types import SimpleNamespace
    from gaia import assistant
    seen = {}

    class Fake:
        class beta:
            class messages:
                @staticmethod
                def create(**kw):
                    seen.update(kw)
                    return SimpleNamespace(stop_reason="end_turn", model=kw["model"], content=[SimpleNamespace(type="text", text="Selon la fiche Tabia…")])

    rec = next(r for r in KB["records"] if r["id"] == "tn-tabia")
    out = assistant.answer({"question": "Quels risques pour la tabia ?", "lang": "fr", "records": [rec],
                            "profile": {"climate.rain_mm": {"value": 180, "unit": "mm/an"}}}, client=Fake)
    assert out == {"text": "Selon la fiche Tabia…", "status": "ok", "model": assistant.MODEL}
    prompt = seen["messages"][0]["content"]
    assert "tn-tabia" in prompt and "180" in prompt and "Quels risques" in prompt
    assert "ONLY the evidence" in seen["system"]


def test_lab_retrieval_free_questions():
    if not shutil.which("node"):
        pytest.skip("node not installed")
    root = Path(__file__).resolve().parents[2]
    script = """
const vm=require('vm'),fs=require('fs'),path=require('path');const w={};const root=process.argv[1];
for (const f of ['js/kb.js','js/lab-retrieval.js']) vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),{window:w});
const R=w.GAIA_RETRIEVAL, recs=w.GAIA_KB.records;
const qs=JSON.parse(process.argv[2]);
console.log(JSON.stringify(qs.map(q=>{const a=R.analyse(q,recs);return {topics:a.topics,named:a.named,top:a.hits.length?a.hits[0].id:null,score:a.hits.length?a.hits[0].score:0};})));
"""
    qs = ["Combien coûte une citerne ?", "What are the risks of tabia?", "ما هي تكلفة الجسور؟", "quel est mon type de sol ?",
          "comment construire des jesour", "Quel temps fera-t-il demain à Paris ?"]
    out = json.loads(subprocess.run(["node", "-e", script, str(root), json.dumps(qs)], capture_output=True, text=True, check=True).stdout)
    assert "cost" in out[0]["topics"] and out[0]["named"] == ["tn-cistern"]
    assert "risk" in out[1]["topics"] and out[1]["named"][0] == "tn-tabia"
    assert "cost" in out[2]["topics"] and out[2]["named"] == ["tn-jessour"]
    assert out[3]["topics"] == ["soil"]
    assert out[4]["top"] == "tn-jessour"                       # one-letter typo
    assert out[5]["topics"] == [] and out[5]["score"] < 2      # off-topic: stays "not sure"


def test_diagnose_with_shipped_model():
    """the shipped multi-head ONNX answers a real photo through the shared-file 'output' path."""
    import io
    import gaia.main as m
    if not (m.MODEL_DIR / "manifest.json").exists():
        pytest.skip("no shipped model")
    from PIL import Image
    buf = io.BytesIO(); Image.new("RGB", (300, 200), (40, 140, 40)).save(buf, "JPEG")
    r = client.post("/diagnose", files={"image": ("leaf.jpg", buf.getvalue(), "image/jpeg")})
    assert r.status_code == 200
    body = r.json()
    assert body["status"] in {"ok", "unsure", "unsupported_tree", "no_disease_model"}
    assert body["stage1"]["top"]["label"] in m.vision.load_manifest(m.MODEL_DIR)["stage1"]["classes"]
