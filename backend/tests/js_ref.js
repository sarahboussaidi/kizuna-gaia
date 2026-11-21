// Runs the browser engine + nexus in node to produce reference outputs for the Python port.
const vm = require('vm'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..');
const ctx = { window: {}, console }; ctx.window.GAIA = { fmt: String }; vm.createContext(ctx);
for (const f of ['js/kb.js', 'js/landdna.js', 'js/engine-core.js', 'js/nexus-core.js', 'js/guard-core.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
const w = ctx.window, inp = JSON.parse(fs.readFileSync(0, 'utf8'));
const out = {};
out.engine = inp.profiles.map(p => w.GAIA_ENGINE.evaluateAll(p).map(r => ({ id: r.record.id, verdict: r.verdict, score: r.score })));
out.nexus = w.GAIA_NEXUS.compute(inp.nexus);
out.guard = (inp.guard || []).map(g => w.GAIA_GUARD.guard(g));
console.log(JSON.stringify(out));
