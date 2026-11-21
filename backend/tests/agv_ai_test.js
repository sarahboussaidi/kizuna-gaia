// Checks for the agrivoltaic AI core (js/agv-ai-core.js). Run: node backend/tests/agv_ai_test.js
const assert = require('assert'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
global.GAIA_SOLAR = require(path.join(root, 'js/solar-core.js'));
const A = require(path.join(root, 'js/agv-ai-core.js'));

// Tunis-like monthly climate (order of magnitude, test fixture only)
const clim = { ghi: [2.6, 3.5, 4.8, 5.9, 6.9, 7.6, 7.8, 6.9, 5.4, 4.0, 2.9, 2.4], tmax: [16, 17, 19, 22, 26, 30, 33, 34, 30, 26, 21, 17],
  tmin: [7, 7, 9, 11, 15, 19, 22, 23, 20, 16, 11, 8], et0: [50, 60, 90, 115, 150, 180, 205, 190, 140, 100, 65, 50], rain: [60, 50, 45, 35, 20, 10, 3, 8, 35, 55, 55, 65] };
const base = { lat: 36.8, ghi: clim.ghi, tilt: 25, azimuth: 180, height: 4, width: 2, pitch: 8, area_ha: 1, density_wp_m2: 200, pr: 0.8 };
const ref = A.pvOnlyKwhPerHa(base);

// 1. more shade never helps a shade-sensitive crop in winter; less panel cover gives more yield
const wide = A.evaluate(base, { pitch: 12 }, 'wheat', clim, ref), dense = A.evaluate(base, { pitch: 4 }, 'wheat', clim, ref);
assert(wide.yrel > dense.yrel, 'wheat yield should fall as rows get closer');
assert(dense.kwh > wide.kwh, 'closer rows should produce more electricity');
// 2. a summer leafy crop gains from shade in a hot climate (heat relief)
assert(A.evaluate(base, {}, 'lettuce_s', clim, ref).yrel > 1, 'summer lettuce should gain from shade');
// 3. water: panels always reduce irrigation need
assert(A.evaluate(base, {}, 'tomato', clim, ref).waterSaved > 0);

// 4. optimiser: respects the Japanese 80 % rule and beats the starting layout on LER
const start = { pitch: 8, width: 2, tilt: 25, azimuth: 180 };
const o = A.optimizer({ base, crop: 'tomato', clim, goal: 'ler', japan: true, start, seed: 42 });
while (!o.done()) o.next();
const best = o.best(), you = A.evaluate(base, start, 'tomato', clim, ref);
assert(best.yrel >= A.JAPAN_RULE - 1e-9, 'best layout must keep 80 % of the yield');
assert(best.ler >= you.ler, 'best LER must not be worse than the starting layout');
const o2 = A.optimizer({ base, crop: 'tomato', clim, goal: 'ler', japan: true, start, seed: 42 });
while (!o2.done()) o2.next();
assert.deepStrictEqual(o2.best().genes, best.genes, 'same seed, same answer');

// 5. weather pilot: classic tracking maximises energy; the GAIA pilot gives the crop more light
const week = A.typicalWeek(36.8, 10.2, 6, clim, 6);
assert.strictEqual(week.length, 168);
const p = A.pilot(week, 36.8, 10.2, { width: 2, pitch: 8, height: 4, kwp: 50, pr: 0.8, fixedTilt: 25, fixedAz: 180, crop: 'tomato', alpha: 0.5 });
assert(p.totals.sun.kwh >= p.totals.gaia.kwh - 1e-6);
assert(p.totals.gaia.lightPct > p.totals.sun.lightPct);
assert(p.totals.gaia.modes.shield > 0, 'a heat wave should trigger the heat shield');
const allEnergy = A.pilot(week, 36.8, 10.2, { width: 2, pitch: 8, height: 4, kwp: 50, pr: 0.8, fixedTilt: 25, fixedAz: 180, crop: 'tomato', alpha: 1 });
assert(Math.abs(allEnergy.totals.gaia.kwh - allEnergy.totals.sun.kwh) < 1e-6, 'alpha = 1 is pure sun tracking');

// 6. Open-Meteo parsing: local times shifted back to UTC
const rows = A.parseOpenMeteo({ utc_offset_seconds: 3600, hourly: { time: ['2026-07-01T13:00'], temperature_2m: [35], shortwave_radiation: [900],
  direct_normal_irradiance: [850], diffuse_radiation: [120], et0_fao_evapotranspiration: [0.8] } });
assert.strictEqual(rows[0].time.toISOString(), '2026-07-01T12:00:00.000Z');

console.log('agv-ai: all checks passed');
