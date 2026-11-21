/* ==========================================================================
   GAIA REASONING — compatibility engine (M1), rules only.

   For each record:
   - every condition is evaluated against GAIA LAND DNA: pass | fail | unknown
   - a failed HARD condition rejects the technique, unless an adaptation in
     the record covers that failure → "adapt"
   - the score is the weighted share of SOFT conditions met, and is only
     returned when every soft condition could be evaluated
   - materials, organisation and regulation come from the record: they are
     shown as "to check", never silently passed
   ========================================================================== */

(function (global) {
  'use strict';

  var DIMS = ['climate', 'terrain', 'water', 'materials', 'org', 'reg'];
  var V = function (dna, path) { return global.GAIA_DNA.value(dna, path); };

  function test(c, v) {
    if (v === null || v === undefined) return 'unknown';
    switch (c.op) {
      case 'max': return v <= c.value ? 'pass' : 'fail';
      case 'min': return v >= c.value ? 'pass' : 'fail';
      case 'between': return v >= c.value[0] && v <= c.value[1] ? 'pass' : 'fail';
      case 'in': return c.value.indexOf(v) !== -1 ? 'pass' : 'fail';
      default: return 'unknown';
    }
  }

  function evaluate(rec, dna) {
    var checks = rec.conditions.map(function (c) {
      var v = V(dna, c.field);
      return { cond: c, value: v, result: test(c, v) };
    });

    var hardFails = checks.filter(function (x) { return x.cond.hard && x.result === 'fail'; });
    var unknown = checks.filter(function (x) { return x.result === 'unknown'; });
    var soft = checks.filter(function (x) { return !x.cond.hard; });

    var verdict = 'feasible', adaptation = null;
    if (hardFails.length) {
      var failedFields = hardFails.map(function (x) { return x.cond.field; });
      adaptation = (rec.adaptations || []).filter(function (a) {
        var covers = failedFields.every(function (f) { return a.when.indexOf(f) !== -1; });
        if (!covers) return false;
        if (a.requires) return test(a.requires, V(dna, a.requires.field)) === 'pass';
        return true;
      })[0] || null;
      verdict = adaptation ? 'adapt' : 'rejected';
    } else if (checks.some(function (x) { return x.cond.hard && x.result === 'unknown'; })) {
      verdict = 'insufficient'; // a mandatory condition could not be checked: GAIA says so instead of passing it
    } else if (checks.length && unknown.length === checks.length) {
      verdict = 'insufficient'; // nothing about this parcel could be checked: no verdict without evidence
    }

    var score = null;
    var softKnown = soft.filter(function (x) { return x.result !== 'unknown'; });
    if ((verdict === 'feasible' || verdict === 'adapt') && soft.length && softKnown.length === soft.length) {
      var wSum = soft.reduce(function (s, x) { return s + (x.cond.weight || 1); }, 0);
      var wMet = soft.reduce(function (s, x) { return s + (x.result === 'pass' ? (x.cond.weight || 1) : 0); }, 0);
      score = wSum ? wMet / wSum : null;
    }

    // per-dimension status
    var dims = {};
    DIMS.forEach(function (d) { dims[d] = { status: 'info', checks: [] }; });
    checks.forEach(function (x) {
      var d = x.cond.dim === 'materials' ? 'materials' : x.cond.dim;
      if (!dims[d]) return;
      dims[d].checks.push(x);
    });
    DIMS.forEach(function (d) {
      var cs = dims[d].checks;
      if (!cs.length) { dims[d].status = (d === 'materials' || d === 'org' || d === 'reg') ? 'info' : 'none'; return; }
      if (cs.some(function (x) { return x.result === 'fail' && x.cond.hard; })) dims[d].status = 'fail';
      else if (cs.some(function (x) { return x.result === 'unknown'; })) dims[d].status = 'unknown';
      else if (cs.some(function (x) { return x.result === 'fail'; })) dims[d].status = 'partial';
      else dims[d].status = 'pass';
    });

    return {
      record: rec, verdict: verdict, adaptation: adaptation, score: score,
      checks: checks, hardFails: hardFails, unknown: unknown, dims: dims,
      provisional: checks.some(function (x) { return x.cond.provisional; }),
      conditional: unknown.length > 0
    };
  }

  function evaluateAll(dna) {
    var order = { feasible: 0, adapt: 1, insufficient: 2, rejected: 3 };
    return global.GAIA_KB.records.map(function (r) { return evaluate(r, dna); }).sort(function (a, b) {
      if (order[a.verdict] !== order[b.verdict]) return order[a.verdict] - order[b.verdict];
      var sa = a.score === null ? -1 : a.score, sb = b.score === null ? -1 : b.score;
      return sb - sa;
    });
  }

  // plain-language reason for a single check (FR, EN, JA; AR shows the French wording, as before)
  var WORDS = {
    fr: {
      label: { 'climate.rain_mm': 'pluie annuelle', 'terrain.slope_pct': 'pente', 'water.source': "source d'eau",
        'crop': 'culture', 'energy.pump': 'pompage', 'climate.tmax_hot': 'température max. estivale',
        'climate.et0_mm': 'évapotranspiration de référence', 'solar.ghi_kwh': 'rayonnement solaire', 'climate.tmin_cold': 'température min. hivernale' },
      ghi: ' kWh/m²/j', unknown: 'inconnu', sep: ' : ', req: function (t) { return ' (requis ' + t + ')'; },
      values: { rainfed: 'pluviale', well: 'puits', network: 'réseau', shared: 'source partagée',
        olive: 'olivier', palm: 'palmier dattier', citrus: 'agrumes', cereal: 'céréales', veg: 'maraîchage', other: 'autre',
        none: 'aucune', diesel: 'pompe diesel', grid: 'pompe sur réseau', solar: 'pompe solaire' }
    },
    en: {
      label: { 'climate.rain_mm': 'annual rainfall', 'terrain.slope_pct': 'slope', 'water.source': 'water source',
        'crop': 'crop', 'energy.pump': 'pumping', 'climate.tmax_hot': 'summer max. temperature',
        'climate.et0_mm': 'reference evapotranspiration', 'solar.ghi_kwh': 'solar radiation', 'climate.tmin_cold': 'winter min. temperature' },
      ghi: ' kWh/m²/day', unknown: 'unknown', sep: ': ', req: function (t) { return ' (required ' + t + ')'; },
      values: { rainfed: 'rainfed', well: 'well', network: 'network', shared: 'shared source',
        olive: 'olive', palm: 'date palm', citrus: 'citrus', cereal: 'cereals', veg: 'vegetables', other: 'other',
        none: 'none', diesel: 'diesel pump', grid: 'grid pump', solar: 'solar pump' }
    },
    ja: {
      label: { 'climate.rain_mm': '年間降水量', 'terrain.slope_pct': '傾斜', 'water.source': '水源',
        'crop': '作物', 'energy.pump': '揚水', 'climate.tmax_hot': '夏の最高気温',
        'climate.et0_mm': '基準蒸発散量', 'solar.ghi_kwh': '日射量', 'climate.tmin_cold': '冬の最低気温' },
      ghi: ' kWh/m²/日', unknown: '不明', sep: '：', req: function (t) { return '（必要条件 ' + t + '）'; },
      values: { rainfed: '天水', well: '井戸', network: '灌漑網', shared: '共同水源',
        olive: 'オリーブ', palm: 'ナツメヤシ', citrus: '柑橘', cereal: '穀物', veg: '野菜', other: 'その他',
        none: 'なし', diesel: 'ディーゼルポンプ', grid: '系統電力ポンプ', solar: '太陽光ポンプ' }
    }
  };
  function words() { var l = global.GAIA && global.GAIA.lang ? global.GAIA.lang() : 'fr'; return WORDS[l] || WORDS.fr; }
  function describe(x) {
    var c = x.cond, f = global.GAIA.fmt, W = words();
    var label = W.label[c.field] || c.field;
    var unit = { 'climate.rain_mm': ' mm', 'terrain.slope_pct': ' %', 'climate.tmax_hot': ' °C', 'climate.tmin_cold': ' °C', 'climate.et0_mm': ' mm', 'solar.ghi_kwh': W.ghi }[c.field] || '';
    var target = c.op === 'max' ? '≤ ' + f(c.value) + unit : c.op === 'min' ? '≥ ' + f(c.value) + unit
      : c.op === 'between' ? f(c.value[0]) + '–' + f(c.value[1]) + unit : c.value.map(valueLabel).join(', ');
    var got = x.value === null ? W.unknown : (typeof x.value === 'number' ? f(x.value, c.field === 'terrain.slope_pct' || c.field === 'solar.ghi_kwh' ? 1 : 0) + unit : valueLabel(x.value));
    return label + W.sep + got + W.req(target);
  }
  function valueLabel(v) { return words().values[v] || String(v); }

  global.GAIA_ENGINE = { evaluate: evaluate, evaluateAll: evaluateAll, describe: describe, valueLabel: valueLabel, DIMS: DIMS };
}(window));
