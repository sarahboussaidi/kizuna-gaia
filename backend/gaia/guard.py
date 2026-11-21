"""GAIA GROUNDWATER GUARD. Python port of js/guard-core.js.

A solar field sized on the hottest month can lift far more water than the crop
needs the rest of the year, and once the panels are paid for every extra cubic
metre is almost free. The guard caps pumping at the FAO-56 crop need, and lower
when a safe yield (permit or the farm's share of aquifer recharge) is given.

PV[kWh] = kWp × days × GHI × PR · Capacity[m³] = PV × 367 × ηp / H
Share = min(1, SafeYield / ΣNeed) · Allowed = min(Need × Share, Capacity)
Blocked = Capacity − Allowed · Freed[kWh] = PV − Allowed × H / (367 × ηp)
"""
from __future__ import annotations

from typing import Optional

from . import nexus


def guard(pv_kwp: Optional[float] = None, safe_yield_m3_year: Optional[float] = None,
          flow_m3_h: Optional[float] = None, **nexus_inputs) -> dict:
    r = nexus.compute(**nexus_inputs)
    missing = list(r["missing"])
    sized = r["solar"]["kwp"] if r["solar"] else None
    kwp = pv_kwp if pv_kwp and pv_kwp > 0 else sized
    kwp_source = "installed" if pv_kwp and pv_kwp > 0 else ("sized" if sized else None)
    if not (kwp and kwp > 0) and "pv" not in missing:
        missing.append("pv")

    head, eff = nexus_inputs.get("head_m"), nexus_inputs.get("pump_eff", 0.45)
    pr, area, ghi = nexus_inputs.get("pr", 0.75), nexus_inputs.get("area_ha"), nexus_inputs.get("ghi")
    base = {"missing": missing, "nexus": r}
    if not (kwp and kwp > 0 and head and head > 0 and eff and eff > 0 and pr and pr > 0 and area and area > 0 and ghi):
        return {**base, "months": [], "totals": None, "status": "incomplete"}

    need_tot = sum(x["volume_m3"] or 0.0 for x in r["months"])
    sy = safe_yield_m3_year if safe_yield_m3_year and safe_yield_m3_year > 0 else None
    share = min(1.0, sy / need_tot) if (sy is not None and need_tot > 0) else 1.0
    lift = head / (367 * eff)

    rows = []
    tot = dict(need=0.0, capacity=0.0, allowed=0.0, blocked=0.0, deficit=0.0, pv_kwh=0.0, pump_kwh=0.0, freed_kwh=0.0)
    peak_daily = 0.0
    for m in range(12):
        g = ghi[m]
        pv = kwp * nexus.DAYS[m] * g * pr if (g and g > 0) else 0.0
        cap = pv / lift
        need = r["months"][m]["volume_m3"] or 0.0
        used = min(need * share, cap)
        daily = used / nexus.DAYS[m]
        peak_daily = max(peak_daily, daily)
        row = {"month": m, "irrigated": r["months"][m]["irrigated"], "pv_kwh": pv, "capacity_m3": cap,
               "need_m3": need, "allowed_m3": used, "blocked_m3": max(0.0, cap - used),
               "deficit_m3": max(0.0, need - used), "pump_kwh": used * lift,
               "freed_kwh": max(0.0, pv - used * lift), "daily_cap_m3": daily,
               "hours_per_day": daily / flow_m3_h if flow_m3_h and flow_m3_h > 0 else None}
        rows.append(row)
        tot["need"] += need
        tot["capacity"] += cap
        tot["allowed"] += used
        tot["blocked"] += row["blocked_m3"]
        tot["deficit"] += row["deficit_m3"]
        tot["pv_kwh"] += pv
        tot["pump_kwh"] += row["pump_kwh"]
        tot["freed_kwh"] += row["freed_kwh"]
    tot.update(share=share, over_ratio=tot["capacity"] / tot["need"] if tot["need"] > 0 else None,
               blocked_pct=tot["blocked"] / tot["capacity"] if tot["capacity"] > 0 else 0.0,
               peak_daily_m3=peak_daily)
    status = "aquifer_limited" if share < 1 else ("guarded" if tot["blocked"] > 0 else "no_surplus")
    return {**base, "months": rows, "totals": tot, "status": status, "kwp": kwp, "kwp_source": kwp_source,
            "safe_yield_m3_year": sy,
            "principle": "The pump stops at the crop need: clean energy must not become unlimited water extraction."}
