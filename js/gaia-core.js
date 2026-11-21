/* ==========================================================================
   GAIA core — shared by every platform page.
   - configuration and integration boundaries
   - FR / AR interface (RTL), remembered per browser
   - the selected parcel (GAIA LAND DNA), remembered per browser
   - header, footer, small UI helpers, accessible SVG bar charts
   ========================================================================== */

(function (global) {
  'use strict';

  /* ---------------------------------------------------------- config */
  // Integration boundaries. Leave an endpoint null and the page says so
  // instead of inventing a result.
  var CONFIG = Object.assign({
    soilEndpoint: null,        // e.g. '/api/soil?lat={lat}&lon={lon}' served from local SoilGrids rasters
    assistantEndpoint: null,   // e.g. '/api/assistant' — FastAPI + LLM, receives retrieved records only
    visionManifest: 'models/gaia-vision/manifest.json', // exported ONNX models (see health.html)
    feedbackEndpoint: null,    // e.g. '/api/feedback' — Kaizen corrections; null = kept on the device only
    climatePeriod: { start: '2015-01-01', end: '2024-12-31' }
  }, global.GAIA_CONFIG || {});

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
      nav_home: 'Accueil', nav_land: 'Land Intelligence', nav_engine: 'Compatibilité', nav_lab: 'AI Lab',
      nav_health: 'Santé des plantes', nav_nexus: 'Eau & énergie', nav_biz: 'Modèle économique', nav_agv: 'Agrivoltaïsme', nav_lib: 'Bibliothèque',
      parcel_none: 'Aucune parcelle', parcel_pick: 'Choisir une parcelle',
      skip: 'Aller au contenu',
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
      nav_home: 'الرئيسية', nav_land: 'ذكاء الأرض', nav_engine: 'التوافق', nav_lab: 'مختبر الذكاء',
      nav_health: 'صحة النبات', nav_nexus: 'الماء والطاقة', nav_biz: 'النموذج الاقتصادي', nav_agv: 'الطاقة الزراعية الشمسية', nav_lib: 'المكتبة',
      parcel_none: 'لا توجد قطعة', parcel_pick: 'اختر قطعة أرض',
      skip: 'انتقل إلى المحتوى',
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
    }
  };

  var lang = load('gaia.lang', 'fr');
  if (!DICT[lang]) lang = 'fr';
  var extraDict = { fr: {}, ar: {} };

  function addStrings(map) {
    Object.keys(map).forEach(function (l) { Object.assign(extraDict[l] || (extraDict[l] = {}), map[l]); });
  }
  function t(key) {
    var d = Object.assign({}, DICT[lang], extraDict[lang] || {});
    if (d[key] !== undefined) return d[key];
    var f = Object.assign({}, DICT.fr, extraDict.fr);
    return f[key] !== undefined ? f[key] : key;
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
    langListeners.forEach(function (fn) { try { fn(l); } catch (e) { console.error(e); } });
  }

  /* ---------------------------------------------------------- parcel */
  function getParcel() { return load('gaia.parcel', null); }
  function setParcel(p) { save('gaia.parcel', p); renderParcelBadge(); }

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
    return Number(x).toLocaleString(lang === 'ar' ? 'ar-TN' : 'fr-FR', { maximumFractionDigits: digits === undefined ? 0 : digits, minimumFractionDigits: 0 });
  }

  var ICONS = {
    ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    adapt: '<path d="M4 12h11"/><path d="M12 6l6 6-6 6"/>',
    no: '<path d="M6 6l12 12M18 6L6 18"/>',
    unk: '<circle cx="12" cy="12" r="8"/><path d="M12 16h.01M10 10a2 2 0 1 1 3 1.7c-.7.4-1 .8-1 1.5"/>',
    info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
    warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    leaf: '<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'
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
    ['lab', 'lab.html', 'nav_lab'], ['health', 'health.html', 'nav_health'], ['nexus', 'nexus.html', 'nav_nexus'],
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

  function mountShell(current) {
    var header = el('header', { class: 'gp-top' }, [
      el('div', { class: 'wrap gp-top-in' }, [
        el('a', { class: 'gp-brand', href: 'index.html', 'aria-label': 'GAIA' }, [
          el('span', { class: 'gp-seal', 'aria-hidden': 'true' }, ['絆']),
          el('span', null, [el('span', { class: 'gp-word' }, ['GAIA']), el('br'), el('span', { class: 'gp-tag', 'data-i18n': 'tagline' })])
        ]),
        el('nav', { class: 'gp-nav', 'aria-label': 'GAIA' }, NAV.map(function (n) {
          return el('a', { href: n[1], 'data-i18n': n[2], 'aria-current': n[0] === current ? 'page' : null });
        })),
        el('div', { class: 'gp-tools' }, [
          el('a', { id: 'gp-parcel', class: 'gp-parcel', href: 'land.html' }),
          el('div', { class: 'gp-lang', role: 'group', 'aria-label': 'Langue / اللغة' }, [
            el('button', { type: 'button', 'data-l': 'fr', lang: 'fr', onclick: function () { setLang('fr'); } }, ['FR']),
            el('button', { type: 'button', 'data-l': 'ar', lang: 'ar', onclick: function () { setLang('ar'); } }, ['عربي'])
          ])
        ])
      ])
    ]);
    var skip = el('a', { class: 'gp-skip', href: '#main', 'data-i18n': 'skip' });
    document.body.insertBefore(header, document.body.firstChild);
    document.body.insertBefore(skip, document.body.firstChild);

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
  }

  /* ---------------------------------------------------------- tooltips */
  var tip;
  function bindTip(node, text) {
    if (!tip) { tip = el('div', { class: 'gp-tip', role: 'tooltip' }); document.body.appendChild(tip); }
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', text);
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
        bindTip(r, lab + ' · ' + s.name + ' : ' + fmt(v, opts.digits || 0) + ' ' + (opts.unit || ''));
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
          kz_save: 'إرسال', kz_cancel: 'إلغاء', kz_ok_local: 'شكراً. حُفظ التصحيح على هذا الجهاز في انتظار المراجعة.', kz_ok_sent: 'شكراً. أُرسل التصحيح للمراجعة.' }
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
    CONFIG: CONFIG, t: t, addStrings: addStrings, applyI18n: applyI18n, setLang: setLang,
    lang: function () { return lang; }, onLang: function (fn) { langListeners.push(fn); },
    getParcel: getParcel, setParcel: setParcel, load: load, save: save,
    el: el, clear: clear, fmt: fmt, icon: icon, pill: pill, note: note, confBadge: confBadge,
    mountShell: mountShell, barChart: barChart, bindTip: bindTip, needParcel: needParcel,
    kaizenButton: kaizenButton, recordFeedback: recordFeedback
  };
}(window));
