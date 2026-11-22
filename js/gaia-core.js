/* ==========================================================================
   GAIA core — shared by every platform page.
   - configuration and integration boundaries
   - FR / AR (RTL) / EN / JA interface, remembered per browser
   - the selected parcel (GAIA LAND DNA), remembered per browser
   - header, footer, small UI helpers, accessible SVG bar charts
   ========================================================================== */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------- config */
  // Integration boundaries. Leave an endpoint null and the page says so
  // instead of inventing a result.
  // Where the GAIA server (backend/) runs. Tried in order:
  //  1. ?server=http://192.168.1.20:8000 in any page URL (remembered on this browser; ?server=off forgets it),
  //  2. this computer (127.0.0.1:8000, then :8765) when the site is opened on localhost or as a file,
  //  3. the computer that serves the site (same host, :8000 then :8765), so friends on the same Wi-Fi
  //     use the server of the person who runs it (start it with --host 0.0.0.0).
  var SERVER_BASES = (function () {
    var loc = global.location || {}, saved = null, h = loc.hostname || '';
    try {
      var q = new URLSearchParams(loc.search || '').get('server');
      if (q) { if (q === 'off') global.localStorage.removeItem('gaia.server'); else global.localStorage.setItem('gaia.server', q.replace(/\/+$/, '')); }
      saved = global.localStorage.getItem('gaia.server');
    } catch (e) { /* no storage */ }
    if (saved) return [saved];
    if (loc.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(h)) return ['http://127.0.0.1:8000', 'http://127.0.0.1:8765'];
    if (loc.protocol === 'http:' && h) return ['http://' + h + ':8000', 'http://' + h + ':8765'];
    return [];
  }());

  // irrigation forecast, planner, farm record and irrigation agent: the first server found above
  var GAIA_API = SERVER_BASES[0] || 'http://127.0.0.1:8000';
  try { var lastBase = global.sessionStorage.getItem('gaia.apiBase'); if (lastBase && SERVER_BASES.indexOf(lastBase) !== -1) GAIA_API = lastBase; } catch (e) { /* no storage */ }

  var CONFIG = Object.assign({
    soilEndpoint: null,        // e.g. '/api/soil?lat={lat}&lon={lon}' served from local SoilGrids rasters
    assistantEndpoint: null,   // e.g. '/api/assistant' — FastAPI + LLM, receives retrieved records only
    visionManifest: 'models/gaia-vision/manifest.json', // exported ONNX models (see health.html)
    plantnetEndpoint: /^(localhost|127\.0\.0\.1)$/.test(global.location && global.location.hostname) ? GAIA_API + '/plantnet' : null,    // local dev: backend on :8765. e.g. '/api/plantnet' — backend POST /plantnet (Pl@ntNet, key on the server). null = off. Only used after the user consents.
    feedbackEndpoint: null,    // e.g. '/api/feedback' — Kaizen corrections; null = kept on the device only
    irrigationEndpoint: GAIA_API + '/irrigation/forecast?lat={lat}&lon={lon}', // trained 7-day model (backend/, ml/); null = off
    planEndpoint: GAIA_API + '/irrigation/plan',   // optimal irrigation planner + solar pumping (backend/gaia/planner.py); null = off
    farmEndpoint: GAIA_API + '/farm',              // farm record: confirmed plan, reported irrigations, morning check, alerts; null = off
    replayEndpoint: GAIA_API + '/irrigation/replay', // season replay on real past data; null = off
    agentEndpoint: GAIA_API + '/agent',            // irrigation agent (free Gemini / Groq key in backend/.env); null = off
    effectiveRainTable: 'ml/models/pluie_efficace_meta.json', // learned effective rain per month and site (ml/, section 11); null = USDA-SCS only
    authEndpoint: /^(localhost|127\.0\.0\.1)$/.test(global.location && global.location.hostname) ? GAIA_API + '/auth' : null, // accounts (backend /auth/*). null = guest only
    climatePeriod: { start: '2015-01-01', end: '2024-12-31' }
  }, global.GAIA_CONFIG || {});

  // The server may run on :8000 or :8765. Every call to the server goes to the one that answers.
  var API_READY = (function () {
    if (SERVER_BASES.length < 2 || !global.fetch) return Promise.resolve(GAIA_API);
    var order = [GAIA_API].concat(SERVER_BASES.filter(function (b) { return b !== GAIA_API; }));
    function use(base) {
      if (base !== GAIA_API) Object.keys(CONFIG).forEach(function (k) {
        if (/Endpoint$/.test(k) && typeof CONFIG[k] === 'string' && CONFIG[k].indexOf(GAIA_API) === 0) CONFIG[k] = base + CONFIG[k].slice(GAIA_API.length);
      });
      GAIA_API = base;
      try { global.sessionStorage.setItem('gaia.apiBase', base); } catch (e) { /* no storage */ }
      return base;
    }
    return order.reduce(function (p, base) {
      return p.catch(function () { return global.fetch(base + '/health').then(function (r) { if (!r.ok) throw r.status; return use(base); }); });
    }, Promise.reject(0)).catch(function () { return GAIA_API; });
  }());

  /* ---------------------------------------------------------- storage */
  function load(key, fallback) {
    try { var v = global.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { global.localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  /* ---------------------------------------------------------- i18n */
  var DICT = {
    fr: {
      tagline: "L'intelligence qui comprend la terre",
      nav_home: 'Accueil', nav_land: 'Land Intelligence', nav_engine: 'Compatibilité', nav_lab: 'AI Lab', nav_agent: 'Agent',
      nav_health: 'Santé des plantes', nav_nexus: 'Eau & énergie', nav_biz: 'Modèle économique', nav_farm: 'Tableau de bord', nav_market: 'Vendre ma récolte', nav_season: 'Ma saison', nav_agv: 'Agrivoltaïsme', nav_lib: 'Bibliothèque',
      parcel_none: 'Aucune parcelle', parcel_pick: 'Choisir une parcelle',
      skip: 'Aller au contenu', acc_signin: 'Se connecter', acc_signout: 'Se déconnecter', acc_menu: 'Mon compte', acc_admin: 'Administration',
      foot_line: "GAIA n'impose pas la technologie à la terre. GAIA adapte la technologie à la terre.",
      foot_honest: "Données ouvertes citées à chaque valeur. Les modules non connectés le disent.",
      verdict_ok: 'Faisable', verdict_adapt: 'Faisable avec adaptation', verdict_no: 'Non recommandé', verdict_unk: 'Preuves insuffisantes',
      unknown: 'Non évalué', info: 'À vérifier', pass: 'Rempli', fail: 'Non rempli',
      dim_climate: 'Climat', dim_terrain: 'Terrain', dim_water: 'Eau', dim_materials: 'Matériaux et coût',
      dim_org: 'Organisation locale', dim_reg: 'Réglementation',
      origin_jp: 'Japon', origin_tn: 'Tunisie',
      conf_high: 'élevée', conf_medium: 'moyenne', conf_low: 'faible', conf_declared: 'déclarée', conf_missing: 'manquante', conf_error: 'indisponible',
      status_live: 'Fonctionnel', status_demo: 'Démo', status_plan: 'Prévu', status_concept: 'Concept',
      need_parcel_t: "Choisissez d'abord une parcelle",
      need_parcel_p: "Cette page lit le profil GAIA LAND DNA de votre parcelle. Sélectionnez-la sur la carte, GAIA construit le profil à partir de données ouvertes.",
      go_land: 'Ouvrir Land Intelligence',
      months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    },
    ar: {
      tagline: 'ذكاء يفهم الأرض',
      nav_home: 'الرئيسية', nav_land: 'ذكاء الأرض', nav_engine: 'التوافق', nav_lab: 'مختبر الذكاء', nav_agent: 'الوكيل',
      nav_health: 'صحة النبات', nav_nexus: 'الماء والطاقة', nav_biz: 'النموذج الاقتصادي', nav_farm: 'لوحة المتابعة', nav_market: 'بيع محصولي', nav_season: 'موسمي', nav_agv: 'الطاقة الزراعية الشمسية', nav_lib: 'المكتبة',
      parcel_none: 'لا توجد قطعة', parcel_pick: 'اختر قطعة أرض',
      skip: 'انتقل إلى المحتوى', acc_signin: 'تسجيل الدخول', acc_signout: 'تسجيل الخروج', acc_menu: 'حسابي', acc_admin: 'الإدارة',
      foot_line: 'غايا لا تفرض التكنولوجيا على الأرض، بل تكيّف التكنولوجيا مع الأرض.',
      foot_honest: 'كل قيمة مصحوبة بمصدرها. والوحدات غير المتصلة تصرّح بذلك.',
      verdict_ok: 'ممكن', verdict_adapt: 'ممكن مع التكييف', verdict_no: 'غير موصى به', verdict_unk: 'أدلة غير كافية',
      unknown: 'لم يُقيَّم', info: 'للتحقق', pass: 'مستوفى', fail: 'غير مستوفى',
      dim_climate: 'المناخ', dim_terrain: 'التضاريس', dim_water: 'الماء', dim_materials: 'المواد والتكلفة',
      dim_org: 'التنظيم المحلي', dim_reg: 'التنظيمات القانونية',
      origin_jp: 'اليابان', origin_tn: 'تونس',
      conf_high: 'عالية', conf_medium: 'متوسطة', conf_low: 'ضعيفة', conf_declared: 'مصرّح بها', conf_missing: 'ناقصة', conf_error: 'غير متاحة',
      status_live: 'يعمل', status_demo: 'عرض', status_plan: 'مخطط', status_concept: 'مفهوم',
      need_parcel_t: 'اختر قطعة أرض أولاً',
      need_parcel_p: 'تعتمد هذه الصفحة على ملف «غايا لاند دي إن إي» لقطعتك. حدّدها على الخريطة لتبني غايا الملف من بيانات مفتوحة.',
      go_land: 'افتح ذكاء الأرض',
      months: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    },
    en: {
      tagline: 'Intelligence that understands the land',
      nav_home: 'Home', nav_land: 'Land Intelligence', nav_engine: 'Compatibility', nav_lab: 'AI Lab', nav_agent: 'Agent',
      nav_health: 'Plant health', nav_nexus: 'Water & energy', nav_biz: 'Business model', nav_farm: 'Dashboard', nav_market: 'Sell my crop', nav_season: 'My season', nav_agv: 'Agrivoltaics', nav_lib: 'Library',
      parcel_none: 'No plot', parcel_pick: 'Choose a plot',
      skip: 'Skip to content', acc_signin: 'Sign in', acc_signout: 'Sign out', acc_menu: 'My account', acc_admin: 'Administration',
      foot_line: 'GAIA does not impose technology on the land. GAIA adapts technology to the land.',
      foot_honest: 'Open data, cited for every value. Modules that are not connected say so.',
      verdict_ok: 'Feasible', verdict_adapt: 'Feasible with adaptation', verdict_no: 'Not recommended', verdict_unk: 'Not enough evidence',
      unknown: 'Not assessed', info: 'To check', pass: 'Met', fail: 'Not met',
      dim_climate: 'Climate', dim_terrain: 'Terrain', dim_water: 'Water', dim_materials: 'Materials and cost',
      dim_org: 'Local organisation', dim_reg: 'Regulation',
      origin_jp: 'Japan', origin_tn: 'Tunisia',
      conf_high: 'high', conf_medium: 'medium', conf_low: 'low', conf_declared: 'declared', conf_missing: 'missing', conf_error: 'unavailable',
      status_live: 'Working', status_demo: 'Demo', status_plan: 'Planned', status_concept: 'Concept',
      need_parcel_t: 'Choose a plot first',
      need_parcel_p: 'This page reads the GAIA LAND DNA profile of your plot. Select it on the map and GAIA builds the profile from open data.',
      go_land: 'Open Land Intelligence',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    ja: {
      tagline: '土地を理解するインテリジェンス',
      nav_home: 'ホーム', nav_land: 'ランド・インテリジェンス', nav_engine: '適合性', nav_lab: 'AIラボ', nav_agent: 'エージェント',
      nav_health: '植物の健康', nav_nexus: '水とエネルギー', nav_biz: 'ビジネスモデル', nav_farm: 'ダッシュボード', nav_market: '作物を売る', nav_season: 'わたしの季節', nav_agv: '営農型太陽光', nav_lib: 'ライブラリ',
      parcel_none: '区画なし', parcel_pick: '区画を選ぶ',
      skip: '本文へ移動', acc_signin: 'ログイン', acc_signout: 'ログアウト', acc_menu: 'マイアカウント', acc_admin: '管理',
      foot_line: 'GAIAは技術を土地に押しつけません。技術を土地に合わせます。',
      foot_honest: 'すべての値にオープンデータの出典を表示。未接続のモジュールはそう明示します。',
      verdict_ok: '実施可能', verdict_adapt: '調整すれば実施可能', verdict_no: '推奨しない', verdict_unk: '根拠不足',
      unknown: '未評価', info: '要確認', pass: '満たす', fail: '満たさない',
      dim_climate: '気候', dim_terrain: '地形', dim_water: '水', dim_materials: '資材とコスト',
      dim_org: '地域の組織', dim_reg: '規制',
      origin_jp: '日本', origin_tn: 'チュニジア',
      conf_high: '高', conf_medium: '中', conf_low: '低', conf_declared: '申告値', conf_missing: '欠測', conf_error: '取得不可',
      status_live: '稼働中', status_demo: 'デモ', status_plan: '予定', status_concept: '構想',
      need_parcel_t: 'まず区画を選んでください',
      need_parcel_p: 'このページは区画の「GAIA LAND DNA」プロファイルを読み込みます。地図で区画を選ぶと、GAIAがオープンデータからプロファイルを作成します。',
      go_land: 'ランド・インテリジェンスを開く',
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  };

  var lang = load('gaia.lang', 'fr');
  if (!DICT[lang]) lang = 'fr';
  var extraDict = { fr: {}, ar: {}, en: {}, ja: {} };
  var LOCALES = { fr: 'fr-FR', ar: 'ar-TN', en: 'en-GB', ja: 'ja-JP' };

  function addStrings(map) {
    Object.keys(map).forEach(function (l) { Object.assign(extraDict[l] || (extraDict[l] = {}), map[l]); });
  }
  function t(key) {
    var d = Object.assign({}, DICT[lang], extraDict[lang] || {});
    if (d[key] !== undefined) return d[key];
    if (lang === 'ja') { var e = Object.assign({}, DICT.en, extraDict.en); if (e[key] !== undefined) return e[key]; }
    var f = Object.assign({}, DICT.fr, extraDict.fr);
    return f[key] !== undefined ? f[key] : key;
  }
  // Data text (source labels, notes, record fields) is written in French. In EN / JA
  // it goes through a phrase table: exact strings first, then patterns for strings
  // built with values. FR and AR show it unchanged, as before.
  var PHRASES = { en: {}, ja: {} }, PATTERNS = { en: [], ja: [] };
  function addPhrases(map) {
    Object.keys(map).forEach(function (l) {
      if (!PHRASES[l]) { PHRASES[l] = {}; PATTERNS[l] = []; }
      Object.assign(PHRASES[l], map[l].exact || {});
      (map[l].patterns || []).forEach(function (p) { PATTERNS[l].push(p); });
    });
  }
  function tr(s) {
    if (typeof s !== 'string' || !s) return s;
    var P = PHRASES[lang]; if (!P) return s;
    if (P[s] !== undefined) return P[s];
    var pats = PATTERNS[lang];
    for (var i = 0; i < pats.length; i++) {
      var m = s.match(pats[i][0]);
      if (m) return typeof pats[i][1] === 'function' ? pats[i][1](m, tr) : s.replace(pats[i][0], pats[i][1]);
    }
    return s;
  }
  // Land DNA field path → readable label (EN / JA); FR / AR keep the path, as before.
  function fieldLabel(path) {
    var k = 'fld_' + path.replace(/\./g, '_');
    if (lang !== 'en' && lang !== 'ja') return path;
    var v = t(k); return v === k ? path : v;
  }
  function applyI18n(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    (root || document).querySelectorAll('[data-i18n-ph]').forEach(function (n) { n.setAttribute('placeholder', t(n.getAttribute('data-i18n-ph'))); });
    (root || document).querySelectorAll('[data-i18n-aria]').forEach(function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-i18n-aria'))); });
  }
  var langListeners = [];
  function setLang(l) {
    if (!DICT[l]) return;
    lang = l; save('gaia.lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = document.documentElement.dir;
    document.querySelectorAll('.gp-lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-l') === l)); });
    applyI18n();
    renderParcelBadge();
    renderAccount();
    langListeners.forEach(function (fn) { try { fn(l); } catch (e) { console.error(e); } });
  }

  /* ---------------------------------------------------------- parcel */
  function getParcel() {
    var p = load('gaia.parcel', null);
    // plots saved before the unit fix kept NASA POWER radiation in MJ/m²/day: convert to kWh/m²/day
    var SM = p && p.dna && p.dna.solarMonthly, S = p && p.dna && p.dna.solar && p.dna.solar.ghi_kwh;
    if (SM && /MJ/i.test(SM.unit || '')) {
      SM.ghi = (SM.ghi || []).map(function (v) { return typeof v === 'number' ? v / 3.6 : v; });
      SM.unit = 'kWh/m²/jour';
      if (S && typeof S.value === 'number' && /MJ/i.test(S.unit || '')) { S.value = S.value / 3.6; S.unit = 'kWh/m²/jour'; }
      save('gaia.parcel', p);
    }
    return p;
  }
  function setParcel(p) { save('gaia.parcel', p); renderParcelBadge(); }

  /* ---------------------------------------------------------- accounts */
  // The backend keeps the account (hashed password, sessions). The browser keeps only the
  // session token and the public profile, under 'gaia.session'.
  var authListeners = [];
  function session() { return load('gaia.session', null); }
  function currentUser() { var s = session(); return s && s.user ? s.user : null; }
  function setSession(s) {
    if (s) save('gaia.session', s); else { try { global.localStorage.removeItem('gaia.session'); } catch (e) {} }
    renderAccount();
    authListeners.forEach(function (fn) { try { fn(currentUser()); } catch (e) { console.error(e); } });
  }
  function authCall(path, opts) {   // path relative to /auth; '../share/x' style paths go to the API root
    if (!CONFIG.authEndpoint) return Promise.reject({ code: 'no_server' });
    return API_READY.then(function () { return authSend(path, opts); });
  }
  function authSend(path, opts) {
    var s = session(), h = { 'Content-Type': 'application/json' };
    if (s && s.token) h.Authorization = 'Bearer ' + s.token;
    var url = /^\/(share|admin)\//.test(path) ? CONFIG.authEndpoint.replace(/\/auth$/, '') + path : CONFIG.authEndpoint + path;
    return fetch(url, Object.assign({ headers: h }, opts || {})).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) throw Object.assign({ status: r.status }, (b && b.detail) || {});
        return b;
      });
    }, function () { throw { code: 'no_server' }; });
  }
  var auth = {
    enabled: function () { return !!CONFIG.authEndpoint; },
    user: currentUser,
    onChange: function (fn) { authListeners.push(fn); },
    signup: function (body) { return authCall('/signup', { method: 'POST', body: JSON.stringify(body) }).then(function (r) { setSession(r); return r.user; }); },
    login: function (identifier, password) {
      return authCall('/login', { method: 'POST', body: JSON.stringify({ identifier: identifier, password: password }) }).then(function (r) { setSession(r); return r.user; });
    },
    logout: function () {
      var done = function () { setSession(null); };
      return authCall('/logout', { method: 'POST' }).then(done, done);   // always forget the session on this device
    },
    forgot: function (identifier) { return authCall('/forgot', { method: 'POST', body: JSON.stringify({ identifier: identifier }) }); },
    reset: function (identifier, code, password) {
      return authCall('/reset', { method: 'POST', body: JSON.stringify({ identifier: identifier, code: code, password: password }) }).then(function (r) { setSession(r); return r.user; });
    },
    setFarm: function (farm) {
      return authCall('/farm', { method: 'PUT', body: farm ? JSON.stringify(farm) : null }).then(function (r) { var s = session(); s.user = r.user; setSession(s); return r.user; });
    },
    headers: function () { var s = session(); return s && s.token ? { Authorization: 'Bearer ' + s.token } : {}; },   // for the other routes of the GAIA server
    adminOverview: function () { return authCall('/admin/overview'); },   // 403 unless the server says this account is an administrator
    neighbours: function (radiusKm) { return authCall('/share/neighbours?radius_km=' + encodeURIComponent(radiusKm || 5)); },
    requestShare: function (id) { return authCall('/share/request', { method: 'POST', body: JSON.stringify({ to: id }) }); },
    respondShare: function (id, accept) { return authCall('/share/respond', { method: 'POST', body: JSON.stringify({ from_id: id, accept: !!accept }) }); },
    refresh: function () {   // drop a session the server no longer knows (expired, signed out elsewhere)
      if (!session()) return Promise.resolve(null);
      return authCall('/me').then(function (r) { var s = session(); s.user = r.user; save('gaia.session', s); renderAccount(); return r.user; },
        function (e) { if (e && e.status === 401) setSession(null); return currentUser(); });
    }
  };
  function initials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }
  function renderAccount() {
    var box = document.getElementById('gp-account');
    if (!box) return;
    clear(box);
    var u = currentUser();
    if (u) {
      box.appendChild(el('a', { class: 'gp-acc', href: 'account.html', title: t('acc_menu') }, [
        el('span', { class: 'gp-acc-av', 'aria-hidden': 'true' }, [initials(u.name)]),
        el('span', { class: 'gp-acc-name' }, [u.name.split(/\s+/)[0]])
      ]));
      if (u.admin) box.appendChild(el('a', { class: 'gp-acc-out', style: 'color:#DCE3D2', href: 'admin.html', title: t('acc_admin'), 'aria-label': t('acc_admin') }, [icon('chart', 16)]));
      box.appendChild(el('button', { type: 'button', class: 'gp-acc-out', title: t('acc_signout'), 'aria-label': t('acc_signout'),
        onclick: function () { auth.logout().then(function () { if (/account\.html$/.test(global.location.pathname)) global.location.reload(); }); } }, [icon('logout', 16)]));
    } else {
      box.appendChild(el('a', { class: 'gp-acc in', href: 'account.html' }, [icon('user', 16), el('span', null, [t('acc_signin')])]));
    }
  }

  /* ---------------------------------------------------------- dom utils */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v; // only ever used with static, trusted markup
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) { if (c !== null && c !== undefined) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function fmt(x, digits) {
    if (x === null || x === undefined || isNaN(x)) return '—';
    return Number(x).toLocaleString(LOCALES[lang] || 'fr-FR', { maximumFractionDigits: digits === undefined ? 0 : digits, minimumFractionDigits: 0 });
  }

  var ICONS = {
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    adapt: '<path d="M4 12h11"/><path d="M12 6l6 6-6 6"/>',
    no: '<path d="M6 6l12 12M18 6L6 18"/>',
    unk: '<circle cx="12" cy="12" r="8"/><path d="M12 16h.01M10 10a2 2 0 1 1 3 1.7c-.7.4-1 .8-1 1.5"/>',
    info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
    warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    cash: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    frost: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9.5 4L12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5"/>',
    drop: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 5v6h-6"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    star: '<path d="M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.2-5.6-3.1-5.6 3.1 1.2-6.2L3 9.6l6.3-.8z"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    network: '<circle cx="5" cy="7" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="19" cy="17" r="2"/><path d="M7 7.8l3.2 3M7 16.2l3.2-3M13.8 11l3.4-3.2M13.8 13l3.4 3.2"/>'
  };
  function icon(name, size) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    if (size) { s.setAttribute('width', size); s.setAttribute('height', size); }
    s.innerHTML = ICONS[name] || '';
    return s;
  }
  // answers written by a language model: no emoji on the page
  function noEmoji(x) { return String(x || '').replace(/(?![©®™])[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1F3FB}-\u{1F3FF}]|[️‍⃣]/gu, ''); }
  function iconText(name, text, size) {
    return el('span', { style: 'display:inline-flex;align-items:center;gap:6px' }, [icon(name, size || 16), el('span', null, [text])]);
  }
  function pill(kind, text) {
    var map = { ok: 'ok', feasible: 'ok', adapt: 'adapt', no: 'no', rejected: 'no', unk: 'unk', info: 'unk', demo: 'demo', live: 'live', plan: 'plan' };
    var ic = { ok: 'ok', adapt: 'adapt', no: 'no', unk: 'unk', demo: 'info', live: 'ok', plan: 'info' };
    var k = map[kind] || 'unk';
    return el('span', { class: 'pill ' + k }, [icon(ic[k] || 'info'), text]);
  }
  function note(kind, text) {
    var ic = { info: 'info', err: 'warn', ok: 'ok', warn: 'warn' }[kind] || 'info';
    return el('div', { class: 'gp-note ' + (kind === 'warn' ? '' : kind), role: kind === 'err' ? 'alert' : null }, [icon(ic), el('div', null, [text])]);
  }
  function confBadge(c) { return el('span', { class: 'conf ' + c }, [t('conf_' + c)]); }

  /* ---------------------------------------------------------- shell */
  var NAV = [
    ['home', 'home.html', 'nav_home'], ['land', 'land.html', 'nav_land'], ['engine', 'engine.html', 'nav_engine'],
    ['lab', 'lab.html', 'nav_lab'], ['agent', 'agent.html', 'nav_agent'], ['health', 'health.html', 'nav_health'], ['nexus', 'nexus.html', 'nav_nexus'], ['farm', 'farm.html', 'nav_farm'], ['market', 'market.html', 'nav_market'],
    ['biz', 'business.html', 'nav_biz'], ['agv', 'agrivoltaic.html', 'nav_agv'], ['lib', 'library.html', 'nav_lib']
  ];

  function renderParcelBadge() {
    var b = document.getElementById('gp-parcel');
    if (!b) return;
    var p = getParcel();
    clear(b);
    b.appendChild(icon('pin', 15));
    if (p && p.lat !== undefined) {
      b.className = 'gp-parcel';
      b.appendChild(el('span', null, [(p.name || t('nav_land')) + ' · ' + fmt(p.lat, 3) + ', ' + fmt(p.lon, 3)]));
    } else {
      b.className = 'gp-parcel none';
      b.appendChild(el('span', null, [t('parcel_pick')]));
    }
  }

  // the phone menu: every module with an icon and one plain line saying what it is for
  var NAV_ICON = { home: 'home', land: 'pin', engine: 'ok', lab: 'chat', agent: 'network', health: 'leaf', nexus: 'drop', farm: 'chart', market: 'cash', biz: 'card', agv: 'sun', lib: 'book' };
  addStrings({
    fr: { menu: 'Menu', menu_title: 'Que voulez-vous faire ?', menu_close: 'Fermer le menu',
      nd_home: 'Revenir au début', nd_land: 'Choisir mon terrain sur la carte', nd_engine: 'Voir quelles techniques marchent chez moi',
      nd_lab: 'Poser une question et avoir une réponse', nd_agent: 'Un assistant prépare mon plan de travail', nd_health: 'Photographier une feuille malade',
      nd_nexus: 'Combien d\'eau, quelle pompe solaire', nd_farm: 'Suivre l\'eau et l\'énergie de ma ferme', nd_market: 'Vendre ma récolte au bon prix',
      nd_biz: 'Coûts, revenus et aides', nd_agv: 'Panneaux solaires au-dessus des cultures', nd_lib: 'Fiches pratiques et sources' },
    ar: { menu: 'القائمة', menu_title: 'ماذا تريد أن تفعل؟', menu_close: 'إغلاق القائمة',
      nd_home: 'العودة إلى البداية', nd_land: 'اختر أرضك على الخريطة', nd_engine: 'اعرف التقنيات التي تنجح في أرضك',
      nd_lab: 'اطرح سؤالًا واحصل على جواب', nd_agent: 'مساعد يحضّر لك خطة العمل', nd_health: 'صوّر ورقة مريضة',
      nd_nexus: 'كم من الماء، وأي مضخة شمسية', nd_farm: 'تابع الماء والطاقة في مزرعتك', nd_market: 'بِع محصولك بسعر جيد',
      nd_biz: 'التكاليف والمداخيل والمساعدات', nd_agv: 'ألواح شمسية فوق المزروعات', nd_lib: 'بطاقات عملية ومصادر' },
    en: { menu: 'Menu', menu_title: 'What do you want to do?', menu_close: 'Close the menu',
      nd_home: 'Go back to the start', nd_land: 'Pick my land on the map', nd_engine: 'See which methods work on my land',
      nd_lab: 'Ask a question, get an answer', nd_agent: 'An assistant prepares my work plan', nd_health: 'Take a photo of a sick leaf',
      nd_nexus: 'How much water, which solar pump', nd_farm: 'Follow my farm\'s water and energy', nd_market: 'Sell my crop at a fair price',
      nd_biz: 'Costs, income and support', nd_agv: 'Solar panels above the crops', nd_lib: 'Practical guides and sources' },
    ja: { menu: 'メニュー', menu_title: '何をしますか？', menu_close: 'メニューを閉じる',
      nd_home: '最初に戻る', nd_land: '地図で自分の土地を選ぶ', nd_engine: '自分の土地に合う方法を見る',
      nd_lab: '質問して答えをもらう', nd_agent: 'アシスタントが作業計画を作る', nd_health: '病気の葉を撮影する',
      nd_nexus: '必要な水とソーラーポンプ', nd_farm: '農場の水とエネルギーを記録', nd_market: '作物を適正価格で売る',
      nd_biz: '費用・収入・支援', nd_agv: '作物の上の太陽光パネル', nd_lib: '実用ガイドと出典' }
  });
  addStrings({ fr: { chart_table: 'Voir les chiffres' }, ar: { chart_table: 'عرض الأرقام' }, en: { chart_table: 'Show the numbers' }, ja: { chart_table: '数値を見る' } });
  function navMenu(current) {
    var dlg = el('dialog', { class: 'gp-menu', 'aria-labelledby': 'gp-menu-h' });
    function fill() {
      clear(dlg);
      dlg.appendChild(el('div', { class: 'gp-menu-hd' }, [
        el('h2', { id: 'gp-menu-h' }, [t('menu_title')]),
        el('button', { type: 'button', class: 'gp-menu-x', 'aria-label': t('menu_close'), onclick: function () { dlg.close(); } }, [icon('close', 26)])
      ]));
      dlg.appendChild(el('ul', { class: 'gp-menu-grid', role: 'list' }, NAV.map(function (n) {
        return el('li', null, [el('a', { href: n[1], 'aria-current': n[0] === current ? 'page' : null }, [
          el('span', { class: 'ic' }, [icon(NAV_ICON[n[0]] || 'info', 28)]),
          el('span', { class: 'tx' }, [el('b', null, [t(n[2])]), el('small', null, [t('nd_' + n[0])])])
        ])]);
      })));
    }
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    var btn = el('button', { type: 'button', class: 'gp-menu-btn', 'aria-haspopup': 'dialog', onclick: function () {
      fill(); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      var a = dlg.querySelector('[aria-current]') || dlg.querySelector('a'); if (a) a.focus();
    } }, [icon('menu', 24), el('span', { 'data-i18n': 'menu' })]);
    onLang(function () { if (dlg.open) fill(); });
    return { btn: btn, dlg: dlg };
  }
  function onLang(fn) { langListeners.push(fn); }

  function mountShell(current) {
    var menu = navMenu(current);
    var header = el('header', { class: 'gp-top' }, [
      el('div', { class: 'wrap gp-top-in' }, [
        el('a', { class: 'gp-brand', href: 'index.html', 'aria-label': 'GAIA' }, [
          el('span', { class: 'gp-seal', 'aria-hidden': 'true' }, ['絆']),
          el('span', null, [el('span', { class: 'gp-word' }, ['GAIA']), el('br'), el('span', { class: 'gp-tag', 'data-i18n': 'tagline' })])
        ]),
        el('nav', { class: 'gp-nav', 'aria-label': 'GAIA' }, NAV.map(function (n) {
          return el('a', { href: n[1], 'data-i18n': n[2], 'aria-current': n[0] === current ? 'page' : null });
        })),
        menu.btn,
        el('div', { class: 'gp-tools' }, [
          el('div', { id: 'gp-account', class: 'gp-account' }),
          el('a', { id: 'gp-parcel', class: 'gp-parcel', href: 'land.html' }),
          el('div', { class: 'gp-lang', role: 'group', 'aria-label': 'Langue / اللغة / Language / 言語' }, [
            el('button', { type: 'button', 'data-l': 'fr', lang: 'fr', onclick: function () { setLang('fr'); } }, ['FR']),
            el('button', { type: 'button', 'data-l': 'ar', lang: 'ar', onclick: function () { setLang('ar'); } }, ['عربي']),
            el('button', { type: 'button', 'data-l': 'en', lang: 'en', onclick: function () { setLang('en'); } }, ['EN']),
            el('button', { type: 'button', 'data-l': 'ja', lang: 'ja', onclick: function () { setLang('ja'); } }, ['日本語'])
          ])
        ])
      ])
    ]);
    var skip = el('a', { class: 'gp-skip', href: '#main', 'data-i18n': 'skip' });
    document.body.insertBefore(header, document.body.firstChild);
    document.body.insertBefore(skip, document.body.firstChild);
    document.body.appendChild(menu.dlg);

    var foot = el('footer', { class: 'gp-foot' }, [
      el('div', { class: 'wrap gp-foot-in' }, [
        el('strong', null, ['GAIA']),
        el('span', { 'data-i18n': 'foot_line' }),
        el('span', { 'data-i18n': 'foot_honest' }),
        el('a', { href: 'story.html' }, ['Kizuna 2026 · Japan × Tunisia'])
      ])
    ]);
    document.body.appendChild(foot);
    setLang(lang);
    auth.refresh();
  }

  /* ---------------------------------------------------------- tooltips */
  var tip;
  // quiet: mouse-only tip (the same numbers are in the chart's table for keyboard and screen readers)
  function bindTip(node, text, quiet) {
    if (!tip) { tip = el('div', { class: 'gp-tip', 'aria-hidden': 'true' }); document.body.appendChild(tip); }
    if (!quiet) { node.setAttribute('tabindex', '0'); node.setAttribute('aria-label', text); }
    function show(e) {
      tip.textContent = text; tip.style.opacity = '1';
      var r = node.getBoundingClientRect();
      var x = (e && e.clientX) || (r.left + r.width / 2), y = (e && e.clientY) || r.top;
      tip.style.left = Math.min(window.innerWidth - 250, x + 12) + 'px'; tip.style.top = (y - 36) + 'px';
    }
    function hide() { tip.style.opacity = '0'; }
    node.addEventListener('mousemove', show); node.addEventListener('mouseleave', hide);
    node.addEventListener('focus', show); node.addEventListener('blur', hide);
  }

  /* ---------------------------------------------------------- bar chart */
  // series: [{ name, color, values: [12 numbers] }]; grouped monthly bars, one y axis.
  function barChart(container, opts) {
    clear(container);
    var W = 720, H = 300, L = 52, R = 14, T = 16, B = 34;
    var labels = opts.labels, series = opts.series;
    var max = 0;
    series.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
    if (!(max > 0)) { container.appendChild(note('info', opts.emptyText || '—')); return; }
    var step = niceStep(max / 4), top = Math.ceil(max / step) * step;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('class', 'gp-chart');
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', opts.title || '');
    var Y = function (v) { return T + (H - T - B) * (1 - v / top); };
    for (var g = 0; g <= top + 1e-9; g += step) {
      var gl = document.createElementNS(svgNS, 'line');
      gl.setAttribute('x1', L); gl.setAttribute('x2', W - R); gl.setAttribute('y1', Y(g)); gl.setAttribute('y2', Y(g));
      gl.setAttribute('stroke', 'rgba(30,38,34,0.1)'); svg.appendChild(gl);
      var tx = document.createElementNS(svgNS, 'text');
      tx.setAttribute('x', L - 8); tx.setAttribute('y', Y(g) + 4); tx.setAttribute('text-anchor', 'end');
      tx.setAttribute('font-size', '11'); tx.setAttribute('fill', '#66706A'); tx.textContent = fmt(g, step < 1 ? 1 : 0);
      svg.appendChild(tx);
    }
    var slot = (W - L - R) / labels.length, n = series.length, gap = 2;
    var bw = Math.max(4, Math.min(18, (slot - 10) / n - gap));
    labels.forEach(function (lab, i) {
      var x0 = L + i * slot + (slot - (bw + gap) * n + gap) / 2;
      series.forEach(function (s, j) {
        var v = s.values[i]; if (v === null || v === undefined || isNaN(v)) return;
        var r = document.createElementNS(svgNS, 'rect');
        var y = Y(Math.max(v, 0)), h = Math.max(0, Y(0) - y);
        r.setAttribute('x', x0 + j * (bw + gap)); r.setAttribute('y', y); r.setAttribute('width', bw); r.setAttribute('height', Math.max(h, 0.5));
        r.setAttribute('rx', '3'); r.setAttribute('fill', s.color);
        svg.appendChild(r);
        bindTip(r, lab + ' · ' + s.name + ' : ' + fmt(v, opts.digits || 0) + ' ' + (opts.unit || ''), true);
      });
      var lt = document.createElementNS(svgNS, 'text');
      lt.setAttribute('x', L + i * slot + slot / 2); lt.setAttribute('y', H - 12); lt.setAttribute('text-anchor', 'middle');
      lt.setAttribute('font-size', '11.5'); lt.setAttribute('fill', '#4B5650'); lt.textContent = lab; svg.appendChild(lt);
    });
    var unit = document.createElementNS(svgNS, 'text');
    unit.setAttribute('x', 4); unit.setAttribute('y', 12); unit.setAttribute('font-size', '11'); unit.setAttribute('fill', '#66706A');
    unit.textContent = opts.unit || ''; svg.appendChild(unit);
    container.appendChild(svg);
    if (series.length > 1 || opts.legend) {
      container.appendChild(el('div', { class: 'gp-legend' }, series.map(function (s) {
        var i = el('i'); i.style.background = s.color; return el('span', null, [i, s.name]);
      })));
    }
    // the same numbers as a table: for screen readers, keyboards, and anyone who prefers figures to bars
    container.appendChild(el('details', { class: 'gp-chart-data' }, [
      el('summary', null, [t('chart_table')]),
      el('div', { class: 'gp-chart-scroll', tabindex: '0', role: 'region', 'aria-label': (opts.title || '') + ' · ' + t('chart_table') }, [
        el('table', null, [
          el('caption', { class: 'sr' }, [(opts.title || '') + (opts.unit ? ' (' + opts.unit + ')' : '')]),
          el('thead', null, [el('tr', null, [el('th', { scope: 'col' }, [opts.unit || ''])].concat(series.map(function (s) { return el('th', { scope: 'col' }, [s.name]); })))]),
          el('tbody', null, labels.map(function (lab, i) {
            return el('tr', null, [el('th', { scope: 'row' }, [lab])].concat(series.map(function (s) {
              var v = s.values[i]; return el('td', null, [v === null || v === undefined || isNaN(v) ? '—' : fmt(v, opts.digits || 0)]);
            })));
          }))
        ])
      ])
    ]));
  }
  function niceStep(raw) {
    var p = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
  }

  function needParcel(container) {
    clear(container).appendChild(el('div', { class: 'gp-empty' }, [
      el('h2', { 'data-i18n': 'need_parcel_t' }),
      el('p', { 'data-i18n': 'need_parcel_p' }),
      el('a', { class: 'gp-btn primary', href: 'land.html', 'data-i18n': 'go_land' })
    ]));
    applyI18n(container);
  }

  /* ---------------------------------------------------------- Kaizen feedback (shared) */
  addStrings({
    fr: { kz_btn: 'Signaler une erreur (Kaizen)', kz_dlg_t: 'GAIA Kaizen — votre correction', kz_dlg_p: "Dites ce qui est faux ou ce que vous savez de votre terrain. Un agronome relit chaque correction avant qu'elle modifie une fiche ou un modèle.",
          kz_what: 'Votre correction', kz_who: 'Vous êtes', who_farmer: 'Agriculteur', who_expert: 'Agronome / technicien', who_other: 'Autre',
          kz_save: 'Envoyer', kz_cancel: 'Annuler', kz_ok_local: 'Merci. Correction enregistrée sur cet appareil, en attente de relecture.', kz_ok_sent: 'Merci. Correction envoyée pour relecture.' },
    ar: { kz_btn: 'الإبلاغ عن خطأ (كايزن)', kz_dlg_t: 'غايا كايزن — تصحيحك', kz_dlg_p: 'قل ما هو خاطئ أو ما تعرفه عن أرضك. يراجع مهندس فلاحي كل تصحيح قبل أن يغيّر بطاقة أو نموذجاً.',
          kz_what: 'تصحيحك', kz_who: 'أنت', who_farmer: 'فلاح', who_expert: 'مهندس / تقني فلاحي', who_other: 'أخرى',
          kz_save: 'إرسال', kz_cancel: 'إلغاء', kz_ok_local: 'شكراً. حُفظ التصحيح على هذا الجهاز في انتظار المراجعة.', kz_ok_sent: 'شكراً. أُرسل التصحيح للمراجعة.' },
    en: { kz_btn: 'Report an error (Kaizen)', kz_dlg_t: 'GAIA Kaizen — your correction', kz_dlg_p: 'Tell us what is wrong or what you know about your land. An agronomist reviews every correction before it changes a record or a model.',
          kz_what: 'Your correction', kz_who: 'You are', who_farmer: 'Farmer', who_expert: 'Agronomist / technician', who_other: 'Other',
          kz_save: 'Send', kz_cancel: 'Cancel', kz_ok_local: 'Thank you. Correction saved on this device, waiting for review.', kz_ok_sent: 'Thank you. Correction sent for review.' },
    ja: { kz_btn: '誤りを報告（カイゼン）', kz_dlg_t: 'GAIAカイゼン — あなたの修正', kz_dlg_p: '間違っている点や、ご自身の土地について知っていることを教えてください。記録やモデルを変更する前に、農業技術者がすべての修正を確認します。',
          kz_what: 'あなたの修正', kz_who: 'あなたは', who_farmer: '農家', who_expert: '農業技術者・指導員', who_other: 'その他',
          kz_save: '送信', kz_cancel: 'キャンセル', kz_ok_local: 'ありがとうございます。修正はこの端末に保存され、確認待ちです。', kz_ok_sent: 'ありがとうございます。修正を確認のため送信しました。' }
  });
  function recordFeedback(item, done) {
    item.at = new Date().toISOString(); item.expert_status = 'pending';
    var q = load('gaia.feedback', []); q.push(item); save('gaia.feedback', q);
    if (!CONFIG.feedbackEndpoint) { done(false); return; }
    fetch(CONFIG.feedbackEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
      .then(function (r) { done(r.ok); }).catch(function () { done(false); });
  }
  function kaizenButton(context) {
    return el('button', { type: 'button', class: 'gp-btn ghost sm', onclick: function () {
      var msg = el('div', { 'aria-live': 'polite' });
      var dlg = el('dialog', { class: 'gp-dialog' });
      var form = el('form', { method: 'dialog', onsubmit: function (e) {
        e.preventDefault();
        var text = form.querySelector('textarea').value.trim(); if (!text) return;
        recordFeedback(Object.assign({ correction: text, author_role: form.querySelector('select').value }, context), function (sent) {
          clear(msg).appendChild(note(sent ? 'ok' : 'info', t(sent ? 'kz_ok_sent' : 'kz_ok_local')));
          setTimeout(function () { dlg.close(); dlg.remove(); }, 1400);
        });
      } }, [
        el('div', { class: 'gp-field', style: 'margin-top:12px' }, [el('label', { for: 'kz-w' }, [t('kz_who')]),
          el('select', { id: 'kz-w' }, ['farmer', 'expert', 'other'].map(function (k) { return el('option', { value: k }, [t('who_' + k)]); }))]),
        el('div', { class: 'gp-field', style: 'margin-top:10px' }, [el('label', { for: 'kz-t' }, [t('kz_what')]), el('textarea', { id: 'kz-t', required: true })]),
        el('div', { style: 'display:flex;gap:8px;margin-top:14px' }, [
          el('button', { type: 'submit', class: 'gp-btn primary' }, [t('kz_save')]),
          el('button', { type: 'button', class: 'gp-btn ghost', onclick: function () { dlg.close(); dlg.remove(); } }, [t('kz_cancel')])
        ]), msg
      ]);
      dlg.appendChild(el('div', { class: 'in' }, [el('h2', { style: 'font-size:21px' }, [t('kz_dlg_t')]), el('p', { style: 'margin-top:6px;color:var(--g-ink-2);font-size:14.5px' }, [t('kz_dlg_p')]), form]));
      document.body.appendChild(dlg);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    } }, [t('kz_btn')]);
  }

  global.GAIA = {
    CONFIG: CONFIG, serverBases: SERVER_BASES, apiReady: API_READY, t: t, tr: tr, addPhrases: addPhrases, fieldLabel: fieldLabel, addStrings: addStrings, applyI18n: applyI18n, setLang: setLang,
    lang: function () { return lang; }, onLang: function (fn) { langListeners.push(fn); },
    getParcel: getParcel, setParcel: setParcel, load: load, save: save, auth: auth,
    el: el, clear: clear, fmt: fmt, icon: icon, iconText: iconText, noEmoji: noEmoji, pill: pill, note: note, confBadge: confBadge,
    mountShell: mountShell, barChart: barChart, bindTip: bindTip, needParcel: needParcel,
    kaizenButton: kaizenButton, recordFeedback: recordFeedback
  };
}(window));
