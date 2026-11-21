"""GAIA BUSINESS MODEL (M5). Python port of js/business-core.js.

PAYG solar pump kit: installments paid out of the diesel the pump replaces,
flat or seasonal (weighted by the month's pumping energy).
Cooperative pump: members pay in proportion to their water quota; the shared
allowance is the sum of the quotas; a reserve builds a repair / solidarity fund.
Adoption scorecard: climate fit, economic fit, ease of use, partners.
"""
from __future__ import annotations

from typing import Optional, Sequence

DEFAULTS = {"deposit_pct": 0.10, "term_months": 36, "fee_rate": 0.08, "share_cap": 0.70,
            "maint_tnd_year": 0.0, "reserve_pct": 0.05, "life_y": 20}
EASE_KEYS = ["phone", "mobile_money", "technician", "controller", "training"]
PARTNER_KEYS = ["water_authority", "coop_gda", "finance", "installer", "tn_jp"]


def _pos(x) -> bool:
    return isinstance(x, (int, float)) and not isinstance(x, bool) and x > 0


def _num(x, d):
    return x if isinstance(x, (int, float)) and not isinstance(x, bool) else d


def weights(monthly_kwh: Optional[Sequence[Optional[float]]]) -> tuple[list[float], bool]:
    vals = [max(0.0, v or 0.0) for v in monthly_kwh] if monthly_kwh and len(monthly_kwh) == 12 else []
    s = sum(vals)
    if s > 0:
        return [v / s for v in vals], True
    return [1 / 12] * 12, False


def payg(kit_tnd: Optional[float] = None, diesel_tnd_year: Optional[float] = None, deposit_pct: Optional[float] = None,
         term_months: Optional[int] = None, fee_rate: Optional[float] = None, share_cap: Optional[float] = None,
         maint_tnd_year: Optional[float] = None, monthly_kwh: Optional[Sequence[Optional[float]]] = None,
         seasonal: bool = False, start_month: int = 0, life_y: Optional[float] = None, _suggest: bool = True) -> dict:
    missing = []
    if not _pos(kit_tnd):
        missing.append("kit")
    if not _pos(diesel_tnd_year):
        missing.append("diesel")
    if missing:
        return {"missing": missing}

    dep = _num(deposit_pct, DEFAULTS["deposit_pct"])
    term = max(1, round(_num(term_months, DEFAULTS["term_months"])))
    rate = _num(fee_rate, DEFAULTS["fee_rate"])
    cap = _num(share_cap, DEFAULTS["share_cap"])
    maint = _num(maint_tnd_year, DEFAULTS["maint_tnd_year"])
    life = _num(life_y, DEFAULTS["life_y"])
    start = max(0, min(11, round(_num(start_month, 0))))
    w, has_w = weights(monthly_kwh)
    seasonal = bool(seasonal) and has_w

    deposit = kit_tnd * dep
    financed = kit_tnd - deposit
    fee = financed * rate * term / 12
    total = financed + fee
    w_term = sum(w[(start + i) % 12] for i in range(term))

    sched, cum, s_inst, s_save, neg, max_inst, min_net, be = [], -deposit, 0.0, 0.0, 0, 0.0, float("inf"), None
    for i in range(term):
        m = (start + i) % 12
        saving = diesel_tnd_year * w[m] - maint / 12
        inst = total * w[m] / w_term if seasonal and w_term > 0 else total / term
        net = saving - inst
        cum += net
        s_inst += inst
        s_save += saving
        neg += net < 0
        max_inst = max(max_inst, inst)
        min_net = min(min_net, net)
        if be is None and cum >= 0:
            be = i + 1
        sched.append({"i": i + 1, "month": m, "saving": saving, "installment": inst, "net": net, "cumulative": cum})

    yearly_after = diesel_tnd_year - maint
    suggested = None
    if _suggest:  # shortest term, in steps of 6 months up to 7 years, within the cap
        for t in range(6, 85, 6):
            if payg(kit_tnd, diesel_tnd_year, deposit_pct, t, fee_rate, share_cap, maint_tnd_year, monthly_kwh,
                    seasonal, start_month, life_y, _suggest=False)["verdict"] == "ok":
                suggested = t
                break
    ratio = s_inst / s_save if s_save > 0 else None
    verdict = "unk" if ratio is None else "ok" if ratio <= cap else "adapt" if ratio <= 1 else "no"
    return {
        "missing": [], "deposit": deposit, "financed": financed, "fee": fee, "total": total, "term": term,
        "seasonal": seasonal, "schedule": sched, "avg_installment": s_inst / term, "max_installment": max_inst,
        "min_net": min_net, "savings_term": s_save, "installments_term": s_inst, "negative_months": neg,
        "ratio": ratio, "share_cap": cap, "verdict": verdict, "cash_at_term": cum, "break_even_month": be,
        "yearly_after": yearly_after, "life_gain": cum + yearly_after * max(0, life - term / 12),
        "simple_payback_y": kit_tnd / yearly_after if yearly_after > 0 else None,
        "suggested_term": suggested,
    }


def coop(kit_tnd: Optional[float] = None, members: Optional[list[dict]] = None, individual_kit_tnd: Optional[float] = None,
         deposit_pct: Optional[float] = None, term_months: Optional[int] = None, fee_rate: Optional[float] = None,
         reserve_pct: Optional[float] = None) -> dict:
    mem = [x for x in (members or []) if x and _pos(x.get("quota_m3"))]
    missing = []
    if not _pos(kit_tnd):
        missing.append("kit")
    if len(mem) < 2:
        missing.append("members")
    if missing:
        return {"missing": missing}

    dep = _num(deposit_pct, DEFAULTS["deposit_pct"])
    term = max(1, round(_num(term_months, DEFAULTS["term_months"])))
    rate = _num(fee_rate, DEFAULTS["fee_rate"])
    reserve = _num(reserve_pct, DEFAULTS["reserve_pct"])
    total = kit_tnd * (1 - dep) * (1 + rate * term / 12)
    monthly = total / term
    m_res = monthly * reserve
    quota = sum(x["quota_m3"] for x in mem)

    out = []
    for x in mem:
        share = x["quota_m3"] / quota
        pay = (monthly + m_res) * share
        saving = x["diesel_tnd_year"] / 12 if _pos(x.get("diesel_tnd_year")) else None
        out.append({"name": x.get("name") or "", "quota_m3": x["quota_m3"], "share": share,
                    "deposit": kit_tnd * dep * share, "monthly": pay, "saving_month": saving,
                    "net_month": None if saving is None else saving - pay,
                    "own_kit_saved": individual_kit_tnd - kit_tnd * share if _pos(individual_kit_tnd) else None})
    return {
        "missing": [], "members": out, "quota_m3": quota, "monthly_total": monthly + m_res, "reserve_month": m_res,
        "reserve_at_term": m_res * term, "reserve_months_cover": m_res * term / monthly if monthly > 0 else None,
        "term": term, "total": total,
        "capex_saved": individual_kit_tnd * len(mem) - kit_tnd if _pos(individual_kit_tnd) else None,
        "principle": "The shared pump's allowance is the sum of the members' agronomic needs, never more.",
    }


def _checklist(obj: Optional[dict], keys: list[str]) -> tuple[int, int, list[str]]:
    yes = known = 0
    missing = []
    for k in keys:
        v = (obj or {}).get(k)
        if v is True:
            yes += 1
            known += 1
        else:
            if v is False:
                known += 1
            missing.append(k)
    return yes, known, missing


def adoption(ghi_mean: Optional[float] = None, water_source: Optional[str] = None, has_quota: bool = False,
             payg: Optional[dict] = None, ease: Optional[dict] = None, partners: Optional[dict] = None) -> dict:
    tests = []
    why = []
    if not _pos(ghi_mean):
        v = "unk"; why.append("ghi_missing")
    elif ghi_mean >= 5:
        v = "ok"; why.append("ghi_high")
    elif ghi_mean >= 4:
        v = "adapt"; why.append("ghi_mid")
    else:
        v = "no"; why.append("ghi_low")
    if water_source == "rainfed":
        v = "unk" if v == "unk" else "no"
        why.append("src_rainfed")
    elif water_source in ("well", "borehole"):
        why.append("src_well")
    elif not water_source:
        why.append("src_missing")
    if has_quota:
        why.append("quota_ok")
    else:
        why.append("quota_missing")
        if v == "ok":
            v = "adapt"
    tests.append({"key": "climate", "verdict": v, "why": why})

    if not payg or payg.get("ratio") is None:
        tests.append({"key": "economic", "verdict": "unk", "why": ["eco_missing"]})
    else:
        pv = payg["verdict"]
        tests.append({"key": "economic", "verdict": pv, "why": ["eco_" + ("ok" if pv == "ok" else "adapt" if pv == "adapt" else "no")],
                      "ratio": payg["ratio"]})

    for key, obj, keys in (("ease", ease, EASE_KEYS), ("partners", partners, PARTNER_KEYS)):
        yes, known, miss = _checklist(obj, keys)
        n = len(keys)
        verdict = "unk" if known == 0 else "ok" if yes == n else "adapt" if yes >= -(-n // 2) else "no"
        tests.append({"key": key, "verdict": verdict, "why": ["need_" + k for k in miss], "yes": yes, "n": n})

    order = {"no": 0, "unk": 1, "adapt": 2, "ok": 3}
    overall = "ok"
    for t in tests:
        if order[t["verdict"]] < order[overall]:
            overall = t["verdict"]
    return {"tests": tests, "overall": overall}
