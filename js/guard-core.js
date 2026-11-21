/* ==========================================================================
   GAIA GROUNDWATER GUARD — calculation core. Pure functions, no DOM.

   The partners' warning: once solar panels are paid for, pumping one more
   cubic metre costs almost nothing, so solar pumps tend to over-extract the
   aquifer. A solar field sized on the hottest month can lift far more water
   than the crop needs in every other month.

   The guard turns the FAO-56 need (nexus-core.js) into a hard pumping cap:
     PV[kWh]     = kWp × days × GHI × PR                 (what the sun gives)
     Capacity[m³]= PV × 367 × ηp / H                     (what the pump could lift)
     Need[m³]    = V from the nexus                       (what the crop needs)
     Share       = min(1, SafeYield / ΣNeed)              (aquifer / permit limit)
     Allowed[m³] = Need × Share                           (the cap, never more)
     Blocked     = max(0, Capacity − Allowed)             (over-pumping prevented)
     Freed[kWh]  = PV − Allowed × H / (367 × ηp)           (energy for other uses)
   Controller setting: daily cap = Allowed / days ; hours = daily cap / flow.
   Every input is explicit and editable; nothing is invented when missing.
   ========================================================================== */

(function (root) {
  'use strict';

  var N = root.GAIA_NEXUS || (typeof require !== 'undefined' ? require('./nexus-core.js') : null);

  /**
   * inp: the nexus inputs (et0, rain, ghi, kc, months, area_ha, ea, head_m, pump_eff, pr)
   *      + pv_kwp (optional: installed solar driving the pump; default = the nexus size)
   *      + safe_yield_m3_year (optional: permit or the farm's share of aquifer recharge)
   *      + flow_m3_h (optional: pump flow at the working head, for run-time limits)
   */
  function guard(inp, nexusResult) {
    var r = nexusResult || N.compute(inp);
    var res = { months: [], totals: null, missing: r.missing.slice(), status: null, nexus: r };
    var sized = r.solar ? r.solar.kwp : null;
    var kwp = inp.pv_kwp > 0 ? inp.pv_kwp : sized;
    var kwpSource = inp.pv_kwp > 0 ? 'installed' : (sized ? 'sized' : null);
    if (!(kwp > 0) && res.missing.indexOf('pv') === -1) res.missing.push('pv');
    var ok = kwp > 0 && inp.head_m > 0 && inp.pump_eff > 0 && inp.pr > 0 && inp.area_ha > 0 && !!inp.ghi;
    if (!ok) { res.status = 'incomplete'; return res; }

    var needTot = 0;
    r.months.forEach(function (x) { needTot += x.vol || 0; });
    var sy = inp.safe_yield_m3_year > 0 ? inp.safe_yield_m3_year : null;
    var share = sy !== null && needTot > 0 ? Math.min(1, sy / needTot) : 1;
    var lift = inp.head_m / (367 * inp.pump_eff); // kWh per m³

    var T = { need: 0, capacity: 0, allowed: 0, blocked: 0, deficit: 0, pv_kwh: 0, pump_kwh: 0, freed_kwh: 0 };
    var peakDaily = 0;
    for (var m = 0; m < 12; m++) {
      var g = inp.ghi[m];
      var pv = g > 0 ? kwp * N.DAYS[m] * g * inp.pr : 0;
      var cap = pv / lift;
      var need = r.months[m].vol || 0;
      var allowed = need * share;
      var used = Math.min(allowed, cap);              // the sun can also be the limit
      var daily = used / N.DAYS[m];
      var hours = inp.flow_m3_h > 0 ? daily / inp.flow_m3_h : null;
      if (daily > peakDaily) peakDaily = daily;
      var row = {
        m: m, on: r.months[m].on, pv_kwh: pv, capacity_m3: cap, need_m3: need, allowed_m3: used,
        blocked_m3: Math.max(0, cap - used), deficit_m3: Math.max(0, need - used),
        pump_kwh: used * lift, freed_kwh: Math.max(0, pv - used * lift),
        daily_cap_m3: daily, hours_per_day: hours
      };
      res.months.push(row);
      T.need += need; T.capacity += cap; T.allowed += used; T.blocked += row.blocked_m3; T.deficit += row.deficit_m3;
      T.pv_kwh += pv; T.pump_kwh += row.pump_kwh; T.freed_kwh += row.freed_kwh;
    }
    T.share = share;
    T.over_ratio = T.need > 0 ? T.capacity / T.need : null;   // > 1 → the array could over-pump
    T.blocked_pct = T.capacity > 0 ? T.blocked / T.capacity : 0;
    T.peak_daily_m3 = peakDaily;
    res.totals = T;
    res.kwp = kwp; res.kwp_source = kwpSource; res.safe_yield_m3_year = sy;
    res.status = share < 1 ? 'aquifer_limited' : (T.blocked > 0 ? 'guarded' : 'no_surplus');
    res.principle = 'The pump stops at the crop need: clean energy must not become unlimited water extraction.';
    return res;
  }

  var api = { guard: guard };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GAIA_GUARD = api;
}(typeof window !== 'undefined' ? window : this));
