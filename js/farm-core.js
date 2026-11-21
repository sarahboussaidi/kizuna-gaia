/* ==========================================================================
   GAIA FARM DASHBOARD — calculation core (M5). Pure functions, no DOM.

   "Measure to manage": every day the dashboard compares what the pump
   took (meter) with what the crop needed (quota), how much the sun
   produced, and what that saved.

     daily quota  V = 10 × max(0, Kc × ET0 − Pe) / Ea × A        (m³, FAO-56)
     Pe (daily)   = 0.8 × P  when P ≥ 5 mm, else 0                (light rain is lost)
     pump energy  E = V × H / (367 × ηp)                          (kWh)
     solar        S = kWp × GHI × PR                              (kWh/day)
     solar pump capacity  Vmax = S × 367 × ηp / H                  (m³ the sun could lift)
     groundwater spared   = Vmax − pumped                         (what an uncapped pump would take)
     diesel avoided       = E_solar / kWh_per_L ; CO₂ = L × 2.68 kg

   The meter readings are SIMULATED for the demo (seeded, reproducible),
   with two injected events so the alerts can be shown: a stretch of
   over-pumping and a night-time flow (likely leak).
   ========================================================================== */

(function (root) {
  'use strict';

  var DIESEL_CO2_KG_L = 2.68; // combustion factor for gas oil, commonly used (IPCC 2006 default ≈ 2.68 kg/L)

  var DEFAULTS = {
    kc: 0.70, ea: 0.90, area_ha: 2, head_m: 60, pump_eff: 0.45, pr: 0.75, kwp: null,
    diesel_tnd_l: 2.205, // indicative Tunisian retail gas-oil price, to check before use
    diesel_kwh_l: 2.5    // indicative output of a small diesel pump set, to check
  };

  function effRainDay(P) {
    if (!(P >= 5)) return 0;
    return 0.8 * P;
  }

  function quotaDay(d, s) {
    var etc = s.kc * (d.et0 || 0);
    var irn = Math.max(0, etc - effRainDay(d.rain));
    var irg = s.ea > 0 ? irn / s.ea : 0;
    return { etc: etc, pe: effRainDay(d.rain), irn: irn, vol: 10 * irg * s.area_ha };
  }

  function pumpKwh(vol, s) { return s.head_m > 0 && s.pump_eff > 0 ? vol * s.head_m / (367 * s.pump_eff) : 0; }
  function solarKwh(ghi, s) { return (s.kwp || 0) * (ghi || 0) * s.pr; }
  function solarPumpCapacity(ghi, s) { return s.head_m > 0 ? solarKwh(ghi, s) * 367 * s.pump_eff / s.head_m : 0; }

  // Size the array for the most demanding day of the window at the window's
  // mean sunshine, with a 20 % margin, rounded up to 0.5 kWp. Cloudy days are
  // then short of sun on purpose (the alert says so) instead of oversizing.
  // Used only when the farmer has not entered a size.
  function sizeKwp(days, s) {
    var peak = 0, ghiSum = 0, n = 0;
    days.forEach(function (d) {
      var e = pumpKwh(quotaDay(d, s).vol, s);
      if (e > peak) peak = e;
      if (d.ghi > 0) { ghiSum += d.ghi; n++; }
    });
    var denom = n ? (ghiSum / n) * s.pr : 0;
    return denom > 0 ? Math.max(0.5, Math.ceil(peak / denom * 1.2 * 2) / 2) : 0.5;
  }

  /* seeded RNG so the simulated meter is stable for a farm and a date */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seedOf(lat, lon, dateStr) {
    var s = String(Math.round(lat * 1000)) + ':' + String(Math.round(lon * 1000)) + ':' + dateStr, h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  /**
   * Simulated water meter for the past days.
   * past: [{date, et0, rain, ghi, tmax}], oldest first, the last one is today.
   * Returns per day: quota, pumped, nightFlow, solar, capacity…
   */
  function simulateMeter(past, s, lat, lon) {
    var r = rng(seedOf(lat, lon, past.length ? past[past.length - 1].date : ''));
    var n = past.length;
    return past.map(function (d, i) {
      var q = quotaDay(d, s);
      var back = n - 1 - i; // 0 = today
      var factor = 0.88 + r() * 0.16;            // a careful farmer: 88–104 % of the need
      var night = 0;
      if (back >= 9 && back <= 11) factor = 1.35 + r() * 0.15;  // injected: over-pumping stretch
      if (back === 2) night = Math.max(3, q.vol * 0.25);         // injected: flow at night (leak)
      if (back === 0) factor *= 0.55;                            // today: the day is not over yet
      var pumped = q.vol * factor + night;
      var solar = solarKwh(d.ghi, s);
      var cap = solarPumpCapacity(d.ghi, s);
      var kwh = pumpKwh(pumped, s);
      return {
        date: d.date, et0: d.et0, rain: d.rain, ghi: d.ghi, tmax: d.tmax,
        quota: q.vol, pumped: pumped, nightFlow: night, kwhPump: kwh,
        solar: solar, solarUsed: Math.min(solar, kwh), capacity: cap,
        spared: Math.max(0, cap - pumped), partial: back === 0
      };
    });
  }

  function forecast(next, s) {
    return next.map(function (d) {
      var q = quotaDay(d, s);
      var cap = solarPumpCapacity(d.ghi, s);
      var kwh = pumpKwh(q.vol, s);
      var solar = solarKwh(d.ghi, s);
      // hours of pumping at the array's mean power over ~ GHI "sun hours"
      var hours = solar > 0 ? Math.min(12, kwh / (solar / Math.max(1, d.ghi))) : null;
      return {
        date: d.date, et0: d.et0, rain: d.rain, ghi: d.ghi, tmax: d.tmax,
        need: q.vol, skip: q.vol < 0.5, solar: solar, capacity: cap, kwh: kwh,
        enoughSun: cap >= q.vol, hours: hours
      };
    });
  }

  function summary(hist, s, today) {
    var month = today.slice(0, 7);
    var mtd = hist.filter(function (h) { return h.date.slice(0, 7) === month; });
    var sum = function (arr, k) { return arr.reduce(function (a, h) { return a + (h[k] || 0); }, 0); };
    var solarUsed = sum(mtd, 'solarUsed');
    var litres = s.diesel_kwh_l > 0 ? solarUsed / s.diesel_kwh_l : 0;
    return {
      days: mtd.length,
      pumped: sum(mtd, 'pumped'), quota: sum(mtd, 'quota'),
      solar: sum(mtd, 'solar'), solarUsed: solarUsed, kwhPump: sum(mtd, 'kwhPump'),
      litres: litres, tnd: litres * (s.diesel_tnd_l || 0), co2: litres * DIESEL_CO2_KG_L,
      spared: sum(mtd, 'spared'),
      pumped30: sum(hist, 'pumped'), quota30: sum(hist, 'quota')
    };
  }

  /**
   * Alerts, most serious first. Each: { level: 'critical'|'warning'|'info'|'good', code, data }.
   * The page turns codes into sentences in the farmer's language.
   */
  function alerts(hist, fc, sum) {
    var out = [];
    var done = hist.filter(function (h) { return !h.partial; });
    // 1. month to date: pumped more than the crop needed so far
    if (sum.quota > 0 && sum.pumped > sum.quota * 1.05) {
      out.push({ level: sum.pumped > sum.quota * 1.15 ? 'critical' : 'warning', code: 'mtd_over', data: { pct: 100 * (sum.pumped / sum.quota - 1), extra: sum.pumped - sum.quota } });
    }
    // 2. night flow in the last 7 days
    done.slice(-7).forEach(function (h) {
      if (h.nightFlow > 0) out.push({ level: 'critical', code: 'night_flow', data: { date: h.date, vol: h.nightFlow } });
    });
    // 3. days over quota in the last 14 days
    var over = done.slice(-14).filter(function (h) { return h.quota > 0.5 && h.pumped > h.quota * 1.2 && !h.nightFlow; });
    if (over.length) {
      var extra = over.reduce(function (a, h) { return a + h.pumped - h.quota; }, 0);
      out.push({ level: 'warning', code: 'days_over', data: { n: over.length, extra: extra, from: over[0].date, to: over[over.length - 1].date } });
    }
    // 4. forecast: rain, heat, weak sun
    fc.forEach(function (f, i) {
      if (f.rain >= 5) out.push({ level: 'info', code: 'rain_skip', data: { date: f.date, rain: f.rain, i: i } });
    });
    var hot = fc.filter(function (f) { return f.tmax >= 38; });
    if (hot.length) out.push({ level: 'warning', code: 'heat', data: { date: hot[0].date, tmax: hot[0].tmax, n: hot.length } });
    var dim = fc.filter(function (f) { return !f.skip && !f.enoughSun; });
    if (dim.length) out.push({ level: 'info', code: 'low_sun', data: { date: dim[0].date, n: dim.length } });
    if (!out.some(function (a) { return a.level === 'critical' || a.level === 'warning'; })) out.push({ level: 'good', code: 'all_good', data: {} });
    var rank = { critical: 0, warning: 1, info: 2, good: 3 };
    return out.sort(function (a, b) { return rank[a.level] - rank[b.level]; });
  }

  /* Offline fallback: a plausible weather series from monthly normals (ET0, rain, GHI). */
  var NORMALS = { // central Tunisia, order of magnitude, used only when no data at all is available
    et0: [55, 68, 102, 128, 166, 195, 214, 196, 145, 105, 66, 52],      // mm/month
    rain: [28, 25, 30, 25, 18, 8, 3, 9, 30, 32, 28, 26],                // mm/month
    ghi: [2.9, 3.8, 5.0, 6.1, 7.0, 7.6, 7.7, 6.9, 5.6, 4.3, 3.2, 2.6],  // kWh/m²/day
    tmax: [16, 17, 20, 23, 28, 33, 36, 36, 31, 26, 21, 17]
  };
  var DAYS = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function syntheticWeather(startDate, n, lat, lon, monthly) {
    var M = monthly || NORMALS, r = rng(seedOf(lat, lon, 'wx' + startDate)), out = [];
    var d0 = new Date(startDate + 'T12:00:00Z');
    for (var i = 0; i < n; i++) {
      var d = new Date(d0.getTime() + i * 86400000), m = d.getUTCMonth();
      var wet = r() < 0.18, cloud = wet ? 0.45 + r() * 0.3 : 0.85 + r() * 0.2;
      out.push({
        date: d.toISOString().slice(0, 10),
        et0: (M.et0[m] / DAYS[m]) * (wet ? 0.6 : 0.9 + r() * 0.25),
        rain: wet ? (M.rain[m] / 4) * (0.4 + r() * 1.4) : 0,
        ghi: (M.ghi ? M.ghi[m] : NORMALS.ghi[m]) * Math.min(1.1, cloud),
        tmax: (M.tmax ? M.tmax[m] : NORMALS.tmax[m]) + (r() - 0.5) * 6
      });
    }
    return out;
  }

  var api = {
    DEFAULTS: DEFAULTS, DIESEL_CO2_KG_L: DIESEL_CO2_KG_L, NORMALS: NORMALS,
    effRainDay: effRainDay, quotaDay: quotaDay, pumpKwh: pumpKwh, solarKwh: solarKwh,
    solarPumpCapacity: solarPumpCapacity, sizeKwp: sizeKwp, simulateMeter: simulateMeter,
    forecast: forecast, summary: summary, alerts: alerts, syntheticWeather: syntheticWeather
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GAIA_FARM = api;
}(typeof window !== 'undefined' ? window : this));
