/* ==========================================================================
   GAIA SOIL HELPER — calculation core. Pure functions, no DOM.

   1. Jar test (bocal) → sand / silt / clay % → USDA texture class
      (standard USDA texture-triangle rules) → GAIA group sandy | loamy | clayey
   2. Available water: FAO-56 Table 19 ranges of (θFC − θWP) per texture,
      as m³/m³ → total available water TAW = 1000 × (θFC − θWP) mm per metre of soil.
      MARKED TO CHECK against the publication before external use.
   3. Infiltration test (trou d'eau): drop in mm over the timed period → mm/h,
      compared with the indicative basic infiltration rates per texture of the
      FAO Irrigation Water Management training manual.
   4. Vinegar test: no fizz / weak / strong → calcareous status (field indication,
      not a lab measurement of active lime).
   ========================================================================== */
(function (root) {
  'use strict';

  function percents(sandMm, siltMm, clayMm) {
    var s = +sandMm, si = +siltMm, c = +clayMm;
    if (!(s >= 0 && si >= 0 && c >= 0)) return null;
    var tot = s + si + c;
    if (!(tot > 0)) return null;
    return { sand: 100 * s / tot, silt: 100 * si / tot, clay: 100 * c / tot, total_mm: tot };
  }

  // USDA texture triangle
  function usdaClass(sand, silt, clay) {
    if (silt + 1.5 * clay < 15) return 'sand';
    if (silt + 1.5 * clay >= 15 && silt + 2 * clay < 30) return 'loamy_sand';
    if ((clay >= 7 && clay < 20 && sand > 52 && silt + 2 * clay >= 30) || (clay < 7 && silt < 50 && silt + 2 * clay >= 30)) return 'sandy_loam';
    if (clay >= 7 && clay < 27 && silt >= 28 && silt < 50 && sand <= 52) return 'loam';
    if ((silt >= 50 && clay >= 12 && clay < 27) || (silt >= 50 && silt < 80 && clay < 12)) return 'silt_loam';
    if (silt >= 80 && clay < 12) return 'silt';
    if (clay >= 20 && clay < 35 && silt < 28 && sand > 45) return 'sandy_clay_loam';
    if (clay >= 27 && clay < 40 && sand > 20 && sand <= 45) return 'clay_loam';
    if (clay >= 27 && clay < 40 && sand <= 20) return 'silty_clay_loam';
    if (clay >= 35 && sand > 45) return 'sandy_clay';
    if (clay >= 40 && silt >= 40) return 'silty_clay';
    return 'clay';
  }

  var GROUP = {
    sand: 'sandy', loamy_sand: 'sandy',
    sandy_loam: 'loamy', loam: 'loamy', silt_loam: 'loamy', silt: 'loamy', sandy_clay_loam: 'loamy',
    clay_loam: 'clayey', silty_clay_loam: 'clayey', sandy_clay: 'clayey', silty_clay: 'clayey', clay: 'clayey'
  };

  // FAO-56 Table 19: (θFC − θWP), m³/m³ — to check against the publication
  var TAW = {
    sand: [0.05, 0.11], loamy_sand: [0.06, 0.12], sandy_loam: [0.11, 0.15], loam: [0.13, 0.18],
    silt_loam: [0.13, 0.19], silt: [0.16, 0.20], silty_clay_loam: [0.13, 0.18], silty_clay: [0.13, 0.19], clay: [0.12, 0.20]
  };
  function taw(cls) {
    var r = TAW[cls]; if (!r) return null;
    return { min_mm_m: Math.round(r[0] * 1000), max_mm_m: Math.round(r[1] * 1000), mid_mm_m: Math.round((r[0] + r[1]) / 2 * 1000) };
  }

  // indicative basic infiltration rates, mm/h (FAO Irrigation Water Management, training manual)
  var INFIL = [
    { cls: 'very_slow', max: 5, texture: 'clay' },
    { cls: 'slow', max: 10, texture: 'clay_loam' },
    { cls: 'medium', max: 20, texture: 'loam' },
    { cls: 'fast', max: 30, texture: 'sandy_loam' },
    { cls: 'very_fast', max: Infinity, texture: 'sand' }
  ];
  function infiltration(dropMm, minutes) {
    var d = +dropMm, m = +minutes;
    if (!(d >= 0) || !(m > 0)) return null;
    var rate = d / m * 60;
    for (var i = 0; i < INFIL.length; i++) if (rate < INFIL[i].max) return { mm_h: rate, cls: INFIL[i].cls, typical: INFIL[i].texture };
    return null;
  }

  function lime(fizz) {
    return { none: 'non_calcareous', weak: 'slightly_calcareous', strong: 'calcareous' }[fizz] || null;
  }

  function jar(sandMm, siltMm, clayMm) {
    var p = percents(sandMm, siltMm, clayMm);
    if (!p) return null;
    var cls = usdaClass(p.sand, p.silt, p.clay);
    return { sand: p.sand, silt: p.silt, clay: p.clay, usda: cls, group: GROUP[cls], taw: taw(cls) };
  }

  var api = { percents: percents, usdaClass: usdaClass, GROUP: GROUP, taw: taw, infiltration: infiltration, lime: lime, jar: jar, INFIL: INFIL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GAIA_SOIL = api;
}(typeof window !== 'undefined' ? window : this));
