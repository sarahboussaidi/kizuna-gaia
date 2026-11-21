/* ==========================================================================
   GAIA BUSINESS MODEL — calculation core (M5). Pure functions, no DOM.

   The panel is not the innovation; the model around it is. Three pieces:

   1. PAYG (pay-as-you-go) solar pump kit
        financed  = kit × (1 − deposit)
        fee       = financed × fee_rate × term / 12        (flat, annual rate)
        total     = financed + fee
        saving_m  = diesel_year × w_m − maintenance / 12   (w_m = share of the
                    year's pumping energy that falls in month m, or 1/12)
        flat:     installment_i = total / term
        seasonal: installment_i = total × w_m(i) / Σ w over the term
                  → the farmer pays when the pump replaces diesel, not in winter.
        affordable when Σ installments ≤ share_cap × Σ savings over the term.

   2. Cooperative / shared pump (connected farms)
        each member pays in proportion to its water quota (its agronomic need);
        the shared pump's allowance is the sum of the quotas, never more;
        a reserve share of every payment builds a repair / solidarity fund.

   3. Adoption scorecard — four tests: climate fit, economic fit,
      ease of use, partners able to scale it. Each returns ok / adapt / no /
      unk with the reasons, never a score invented from nothing.

   Every assumption is an explicit, editable input. Prices are never invented.
   ========================================================================== */

(function (root) {
  'use strict';

  var DEFAULTS = { deposit_pct: 0.10, term_months: 36, fee_rate: 0.08, share_cap: 0.70, maint_tnd_year: 0, reserve_pct: 0.05, life_y: 20 };

  function pos(x) { return typeof x === 'number' && !isNaN(x) && x > 0; }
  function num(x, d) { return typeof x === 'number' && !isNaN(x) ? x : d; }

  function weights(monthlyKwh) {
    var s = 0, i;
    if (monthlyKwh && monthlyKwh.length === 12) for (i = 0; i < 12; i++) s += monthlyKwh[i] > 0 ? monthlyKwh[i] : 0;
    var w = [];
    for (i = 0; i < 12; i++) w.push(s > 0 ? (monthlyKwh[i] > 0 ? monthlyKwh[i] : 0) / s : 1 / 12);
    return { w: w, seasonal: s > 0 };
  }

  /**
   * inp: { kit_tnd, diesel_tnd_year, deposit_pct, term_months, fee_rate, share_cap,
   *        maint_tnd_year, monthly_kwh[12] (optional), seasonal (bool), start_month (0–11), life_y }
   */
  function payg(inp) {
    var res = { missing: [] };
    if (!pos(inp.kit_tnd)) res.missing.push('kit');
    if (!pos(inp.diesel_tnd_year)) res.missing.push('diesel');
    if (res.missing.length) return res;

    var dep = num(inp.deposit_pct, DEFAULTS.deposit_pct), term = Math.max(1, Math.round(num(inp.term_months, DEFAULTS.term_months)));
    var rate = num(inp.fee_rate, DEFAULTS.fee_rate), cap = num(inp.share_cap, DEFAULTS.share_cap);
    var maint = num(inp.maint_tnd_year, DEFAULTS.maint_tnd_year), life = num(inp.life_y, DEFAULTS.life_y);
    var start = Math.max(0, Math.min(11, Math.round(num(inp.start_month, 0))));
    var W = weights(inp.monthly_kwh), seasonal = !!inp.seasonal && W.seasonal;

    var deposit = inp.kit_tnd * dep, financed = inp.kit_tnd - deposit;
    var fee = financed * rate * term / 12, total = financed + fee;

    var wTerm = 0, i;
    for (i = 0; i < term; i++) wTerm += W.w[(start + i) % 12];

    var sched = [], cum = -deposit, sumInst = 0, sumSave = 0, negMonths = 0, maxInst = 0, minNet = Infinity, breakEven = null;
    for (i = 0; i < term; i++) {
      var m = (start + i) % 12;
      var saving = inp.diesel_tnd_year * W.w[m] - maint / 12;
      var inst = seasonal && wTerm > 0 ? total * W.w[m] / wTerm : total / term;
      var net = saving - inst;
      cum += net;
      sumInst += inst; sumSave += saving;
      if (net < 0) negMonths++;
      if (inst > maxInst) maxInst = inst;
      if (net < minNet) minNet = net;
      if (breakEven === null && cum >= 0) breakEven = i + 1;
      sched.push({ i: i + 1, month: m, saving: saving, installment: inst, net: net, cumulative: cum });
    }
    var yearlyAfter = inp.diesel_tnd_year - maint;               // once the kit is owned
    var ratio = sumSave > 0 ? sumInst / sumSave : null;
    var lifeGain = cum + yearlyAfter * Math.max(0, life - term / 12);

    res.deposit = deposit; res.financed = financed; res.fee = fee; res.total = total; res.term = term;
    res.seasonal = seasonal; res.schedule = sched;
    res.avg_installment = sumInst / term; res.max_installment = maxInst; res.min_net = minNet;
    res.savings_term = sumSave; res.installments_term = sumInst; res.negative_months = negMonths;
    res.ratio = ratio; res.share_cap = cap;
    res.verdict = ratio === null ? 'unk' : ratio <= cap ? 'ok' : ratio <= 1 ? 'adapt' : 'no';
    res.cash_at_term = cum; res.break_even_month = breakEven;
    res.yearly_after = yearlyAfter; res.life_gain = lifeGain;
    res.simple_payback_y = yearlyAfter > 0 ? inp.kit_tnd / yearlyAfter : null;
    // shortest term, in steps of 6 months up to 7 years, that keeps installments within the cap
    res.suggested_term = null;
    if (!inp._noSuggest) {
      for (var T = 6; T <= 84; T += 6) {
        var r2 = payg(Object.assign({}, inp, { term_months: T, _noSuggest: true }));
        if (r2.verdict === 'ok') { res.suggested_term = T; break; }
      }
    }
    return res;
  }

  /**
   * inp: { kit_tnd, individual_kit_tnd (optional, one farm's own kit), deposit_pct, term_months, fee_rate,
   *        reserve_pct, members: [{ name, quota_m3, diesel_tnd_year }] }
   */
  function coop(inp) {
    var res = { missing: [] };
    var M = (inp.members || []).filter(function (x) { return x && pos(x.quota_m3); });
    if (!pos(inp.kit_tnd)) res.missing.push('kit');
    if (M.length < 2) res.missing.push('members');
    if (res.missing.length) return res;

    var dep = num(inp.deposit_pct, DEFAULTS.deposit_pct), term = Math.max(1, Math.round(num(inp.term_months, DEFAULTS.term_months)));
    var rate = num(inp.fee_rate, DEFAULTS.fee_rate), reserve = num(inp.reserve_pct, DEFAULTS.reserve_pct);
    var financed = inp.kit_tnd * (1 - dep), total = financed * (1 + rate * term / 12);
    var monthly = total / term, monthlyReserve = monthly * reserve;
    var quota = M.reduce(function (s, x) { return s + x.quota_m3; }, 0);

    res.members = M.map(function (x) {
      var share = x.quota_m3 / quota;
      var pay = (monthly + monthlyReserve) * share;
      var saving = pos(x.diesel_tnd_year) ? x.diesel_tnd_year / 12 : null;
      return {
        name: x.name || '', quota_m3: x.quota_m3, share: share,
        deposit: inp.kit_tnd * dep * share, monthly: pay,
        saving_month: saving, net_month: saving === null ? null : saving - pay,
        own_kit_saved: pos(inp.individual_kit_tnd) ? inp.individual_kit_tnd - inp.kit_tnd * share : null
      };
    });
    res.quota_m3 = quota;                      // shared pump allowance: Σ agronomic needs, never more
    res.monthly_total = monthly + monthlyReserve;
    res.reserve_month = monthlyReserve;
    res.reserve_at_term = monthlyReserve * term;
    res.reserve_months_cover = monthly > 0 ? res.reserve_at_term / monthly : null;  // months of installments the fund can absorb
    res.term = term; res.total = total;
    res.capex_saved = pos(inp.individual_kit_tnd) ? inp.individual_kit_tnd * M.length - inp.kit_tnd : null;
    return res;
  }

  /**
   * Four adoption tests.
   * inp: { ghi_mean (kWh/m²/day), water_source, has_quota (bool), payg (result of payg()),
   *        ease: { phone, mobile_money, technician, controller, training } (true/false/undefined),
   *        partners: { water_authority, coop_gda, finance, installer, tn_jp } }
   */
  function checklist(obj, keys) {
    var yes = 0, known = 0, missing = [];
    keys.forEach(function (k) {
      if (obj && obj[k] === true) { yes++; known++; }
      else if (obj && obj[k] === false) { known++; missing.push(k); }
      else missing.push(k);
    });
    return { yes: yes, known: known, n: keys.length, missing: missing };
  }

  var EASE_KEYS = ['phone', 'mobile_money', 'technician', 'controller', 'training'];
  var PARTNER_KEYS = ['water_authority', 'coop_gda', 'finance', 'installer', 'tn_jp'];

  function adoption(inp) {
    var tests = [];

    // 1. climate fit: sun for the panel, groundwater to pump, a quota to protect it
    var why = [], v;
    if (!pos(inp.ghi_mean)) { v = 'unk'; why.push('ghi_missing'); }
    else if (inp.ghi_mean >= 5) { v = 'ok'; why.push('ghi_high'); }
    else if (inp.ghi_mean >= 4) { v = 'adapt'; why.push('ghi_mid'); }
    else { v = 'no'; why.push('ghi_low'); }
    if (inp.water_source === 'rainfed') { v = v === 'unk' ? 'unk' : 'no'; why.push('src_rainfed'); }
    else if (inp.water_source === 'well' || inp.water_source === 'borehole') why.push('src_well');
    else if (!inp.water_source) why.push('src_missing');
    if (inp.has_quota) why.push('quota_ok'); else { why.push('quota_missing'); if (v === 'ok') v = 'adapt'; }
    tests.push({ key: 'climate', verdict: v, why: why });

    // 2. economic fit: installments paid out of the diesel they replace
    var p = inp.payg;
    if (!p || p.ratio === undefined || p.ratio === null) tests.push({ key: 'economic', verdict: 'unk', why: ['eco_missing'] });
    else tests.push({ key: 'economic', verdict: p.verdict, why: [p.verdict === 'ok' ? 'eco_ok' : p.verdict === 'adapt' ? 'eco_adapt' : 'eco_no'], ratio: p.ratio });

    // 3 & 4. declared checklists
    [['ease', inp.ease, EASE_KEYS], ['partners', inp.partners, PARTNER_KEYS]].forEach(function (c) {
      var r = checklist(c[1], c[2]);
      var verdict = r.known === 0 ? 'unk' : r.yes === r.n ? 'ok' : r.yes >= Math.ceil(r.n / 2) ? 'adapt' : 'no';
      tests.push({ key: c[0], verdict: verdict, why: r.missing.map(function (k) { return 'need_' + k; }), yes: r.yes, n: r.n });
    });

    var order = { no: 0, unk: 1, adapt: 2, ok: 3 };
    var overall = tests.reduce(function (a, x) { return order[x.verdict] < order[a] ? x.verdict : a; }, 'ok');
    return { tests: tests, overall: overall };
  }

  var api = { payg: payg, coop: coop, adoption: adoption, weights: weights, DEFAULTS: DEFAULTS, EASE_KEYS: EASE_KEYS, PARTNER_KEYS: PARTNER_KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GAIA_BUSINESS = api;
}(typeof window !== 'undefined' ? window : this));
