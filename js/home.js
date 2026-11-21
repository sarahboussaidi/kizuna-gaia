/* Platform home: interactive Tunisia map, LAND DNA preview, modules, Japan × Tunisia, status. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, D = window.GAIA_DNA;

  G.addStrings({
    fr: {
      hero_h: 'Chaque terre a une histoire. GAIA vous aide à la comprendre.',
      hero_p: "Relier l'innovation japonaise et le patrimoine agricole tunisien par des décisions intelligentes, durables et fondées sur des preuves.",
      cta_1: 'Découvrir GAIA : choisir ma parcelle', cta_2: 'Explorer les modules',
      hero_principle: "GAIA n'impose pas la technologie à la terre. GAIA adapte la technologie à la terre.",
      map_hint: 'Cliquez sur la carte pour construire le profil de ce lieu', map_aria: 'Carte de la Tunisie : cliquez pour choisir une parcelle',
      dna_t: 'GAIA LAND DNA', dna_p: "Chaque parcelle reçoit une identité : climat, relief, soleil, sol, eau et culture, chaque valeur avec sa source, sa résolution et sa confiance. Ce qui manque est affiché, jamais inventé.",
      dna_yours: 'Votre parcelle', dna_example: 'Structure du profil (aucune parcelle choisie)', dna_open: 'Ouvrir le profil complet', dna_build: 'Construire mon premier profil',
      f_rain: 'Pluie annuelle', f_slope: 'Pente', f_ghi: 'Rayonnement', f_soil: 'Sol', f_water: "Source d'eau", f_crop: 'Culture',
      src_rain: 'Open-Meteo · ERA5', src_slope: 'Copernicus DEM', src_ghi: 'NASA POWER', src_soil: 'SoilGrids (rasters locaux)', src_water: 'Agriculteur', src_crop: 'Agriculteur',
      mods_t: "Les modules d'intelligence", mods_p: 'Chaque module lit le même profil de parcelle. Leur état réel est indiqué : fonctionnel, simulation ou non connecté.',
      m_land: 'Land Intelligence', m_land_p: 'Carte de la Tunisie, choix de la parcelle, profil construit à partir de données ouvertes en direct.',
      m_engine: 'Compatibilité', m_engine_p: 'Chaque technique testée sur six dimensions : faisable, faisable avec adaptation, ou non recommandée, avec les raisons.',
      m_lab: 'AI Lab', m_lab_p: 'Un assistant qui connaît votre parcelle et cite ses fiches. Il dit quand les preuves manquent.',
      m_health: 'Santé des plantes', m_health_p: "Photo d'une feuille, contrôle de qualité, puis diagnostic — ou « je ne suis pas sûr ».",
      m_nexus: 'Eau & énergie', m_nexus_p: "Besoin en eau FAO-56, énergie de pompage, champ solaire et quota d'eau mensuel.",
      m_farm: 'Tableau de bord', m_farm_p: "Eau pompée face au quota, énergie solaire, économies, alertes et irrigation conseillée pour 7 jours.",
      m_agv: 'Agrivoltaïsme', m_agv_p: 'Hauteur, espacement et orientation des panneaux : électricité et lumière restante pour la culture.',
      m_lib: 'Bibliothèque', m_lib_p: 'Les fiches techniques sourcées qui alimentent le moteur et l’assistant.',
      open: 'Ouvrir →',
      st_live: 'Fonctionnel', st_sim: 'Simulation', st_rules: 'Mode règles', st_partial: 'Partiel', st_off: 'Modèle non connecté', st_concept: 'Concept',
      bridge_t: 'Japon × Tunisie, sans copier', bridge_p: "GAIA ne suppose jamais qu'une méthode japonaise marche partout. Il garde ce qui se transpose et dit ce qui ne passe pas.",
      b_jp: 'Japon · Okuizumo', b_jp_h: 'Rizières en terrasses inondées', b_jp_p: 'Gradins plats, canaux gravitaires, ordre d’arrosage coutumier.',
      b_tn: 'Tunisie · Médenine', b_tn_h: 'Jessour sur une pente aride', b_tn_p: 'Digues de terre qui piègent le ruissellement de quelques orages par an.',
      b_out: 'Ce que GAIA propose', b_out_h: 'Terrasse sèche avec seuil de débordement', b_out_p: "On garde la géométrie, on abandonne l'inondation : impossible avec si peu de pluie.",
      con_t: 'Cinq idées japonaises, cinq fonctions concrètes',
      kaizen: 'Kaizen — amélioration continue', kaizen_p: 'Les corrections des agriculteurs, relues par un expert, améliorent les modèles.',
      satoyama: 'Satoyama — paysages en harmonie', satoyama_p: 'La parcelle vue comme des couches qui s’entraident ; l’image lue avec son contexte.',
      mottainai: 'Mottainai — ne rien gaspiller', mottainai_p: 'Résidus de taille en paillis ; pas une goutte pompée au-delà du besoin.',
      kizuna: 'Kizuna — le lien', kizuna_p: 'Un futur réseau où fermes tunisiennes et japonaises apprennent ensemble, sans partager leurs données.',
      wabisabi: "Wabi-sabi — accepter l'imperfection", wabisabi_p: 'Une confiance calibrée, et le droit de dire « je ne suis pas sûr ».',
      see: 'Voir dans GAIA →', future: 'Futur',
      status_t: 'Ce qui fonctionne aujourd’hui', status_p: 'GAIA distingue toujours ce qui est construit de ce qui est prévu.',
      th_feat: 'Fonction', th_state: 'État', th_detail: 'Détail',
      d_land: 'Open-Meteo, Copernicus DEM (via Open-Meteo) et NASA POWER interrogés en direct. Sol : service local à brancher (API SoilGrids en pause).',
      d_engine: 'Règles explicites sur 11 fiches sourcées, toutes en brouillon tant qu’un agronome ne les a pas validées.',
      d_lab: 'Réponses composées à partir des fiches et du profil ; branchement LLM prévu côté serveur.',
      d_health: 'Contrôle de qualité de la photo dans le navigateur ; aucun modèle entraîné pour l’instant.',
      d_nexus: 'Calcul FAO-56 et énergie de pompage sur les données climatiques de la parcelle.',
      d_agv: 'Modèle physique simplifié dans le navigateur ; version pvlib côté serveur.',
      d_kaizen: 'Corrections enregistrées sur l’appareil et exportables ; relecture experte à organiser.',
      d_kizuna: 'Apprentissage fédéré entre fermes : vision, non planifié.'
    },
    ar: {
      hero_h: 'لكل أرض حكاية. وغايا تساعدك على فهمها.',
      hero_p: 'ربط الابتكار الياباني بالتراث الفلاحي التونسي عبر قرارات ذكية ومستدامة ومبنية على الأدلة.',
      cta_1: 'اكتشف غايا: اختر قطعتك', cta_2: 'استكشف الوحدات',
      hero_principle: 'غايا لا تفرض التكنولوجيا على الأرض، بل تكيّف التكنولوجيا مع الأرض.',
      map_hint: 'انقر على الخريطة لبناء ملف هذا المكان', map_aria: 'خريطة تونس: انقر لاختيار قطعة أرض',
      dna_t: 'غايا لاند دي إن إي', dna_p: 'لكل قطعة هوية: المناخ والتضاريس والشمس والتربة والماء والزراعة، وكل قيمة مع مصدرها ودقتها ودرجة الثقة فيها. ما ينقص يُعرض ولا يُخترع.',
      dna_yours: 'قطعتك', dna_example: 'بنية الملف (لم تُختر أي قطعة)', dna_open: 'افتح الملف الكامل', dna_build: 'ابنِ أول ملف لك',
      f_rain: 'الأمطار السنوية', f_slope: 'الانحدار', f_ghi: 'الإشعاع', f_soil: 'التربة', f_water: 'مصدر الماء', f_crop: 'الزراعة',
      src_rain: 'Open-Meteo · ERA5', src_slope: 'Copernicus DEM', src_ghi: 'NASA POWER', src_soil: 'SoilGrids (ملفات محلية)', src_water: 'الفلاح', src_crop: 'الفلاح',
      mods_t: 'وحدات الذكاء', mods_p: 'تقرأ كل وحدة ملف القطعة نفسه. ونبيّن حالتها الحقيقية: تعمل، محاكاة، أو غير متصلة.',
      m_land: 'ذكاء الأرض', m_land_p: 'خريطة تونس، اختيار القطعة، وملف مبني مباشرة من بيانات مفتوحة.',
      m_engine: 'التوافق', m_engine_p: 'تُختبر كل تقنية على ستة أبعاد: ممكنة، ممكنة مع التكييف، أو غير موصى بها، مع الأسباب.',
      m_lab: 'مختبر الذكاء', m_lab_p: 'مساعد يعرف قطعتك ويستشهد ببطاقاته، ويقول متى تنقص الأدلة.',
      m_health: 'صحة النبات', m_health_p: 'صورة ورقة، فحص للجودة، ثم تشخيص — أو «لست متأكدة».',
      m_nexus: 'الماء والطاقة', m_nexus_p: 'حاجة الماء حسب FAO-56، طاقة الضخ، الحقل الشمسي، والحصة الشهرية للماء.',
      m_farm: 'لوحة المتابعة', m_farm_p: 'الماء المضخوخ مقابل الحصة، الطاقة الشمسية، التوفير، التنبيهات والري المنصوح به لسبعة أيام.',
      m_agv: 'الزراعة الضوئية', m_agv_p: 'ارتفاع الألواح وتباعدها واتجاهها: الكهرباء والضوء المتبقي للزراعة.',
      m_lib: 'المكتبة', m_lib_p: 'البطاقات التقنية الموثقة بمصادر التي تغذي المحرك والمساعد.',
      open: 'افتح ←',
      st_live: 'يعمل', st_sim: 'محاكاة', st_rules: 'وضع القواعد', st_partial: 'جزئي', st_off: 'النموذج غير متصل', st_concept: 'مفهوم',
      bridge_t: 'اليابان × تونس، دون نسخ', bridge_p: 'لا تفترض غايا أبداً أن طريقة يابانية تصلح في كل مكان. تحتفظ بما يمكن نقله وتقول ما لا يصلح.',
      b_jp: 'اليابان · أوكوئيزومو', b_jp_h: 'حقول أرز مدرّجة مغمورة', b_jp_p: 'مدرجات مستوية، قنوات بالجاذبية، ونظام سقي عرفي.',
      b_tn: 'تونس · مدنين', b_tn_h: 'جسور على منحدر جاف', b_tn_p: 'سدود ترابية تحبس سيلان بضع عواصف في السنة.',
      b_out: 'ما تقترحه غايا', b_out_h: 'مدرّج جاف مع مفيض', b_out_p: 'نحتفظ بالشكل ونتخلى عن الغمر: مستحيل مع أمطار بهذه القلة.',
      con_t: 'خمس أفكار يابانية، خمس وظائف ملموسة',
      kaizen: 'كايزن — التحسين المستمر', kaizen_p: 'تصحيحات الفلاحين، بعد مراجعة خبير، تحسّن النماذج.',
      satoyama: 'ساتوياما — مشاهد متناغمة', satoyama_p: 'القطعة كطبقات يدعم بعضها بعضاً؛ والصورة تُقرأ مع سياقها.',
      mottainai: 'موتايناي — لا تبذير', mottainai_p: 'بقايا التقليم غطاءً للتربة؛ ولا قطرة تُضخ فوق الحاجة.',
      kizuna: 'كيزونا — الرابطة', kizuna_p: 'شبكة مستقبلية تتعلم فيها المزارع التونسية واليابانية معاً دون تبادل بياناتها.',
      wabisabi: 'وابي سابي — قبول النقص', wabisabi_p: 'ثقة معايَرة، والحق في قول «لست متأكدة».',
      see: 'شاهده في غايا ←', future: 'مستقبلاً',
      status_t: 'ما يعمل اليوم', status_p: 'تميّز غايا دائماً بين ما بُني وما هو مخطط.',
      th_feat: 'الوظيفة', th_state: 'الحالة', th_detail: 'التفاصيل',
      d_land: 'استعلام مباشر من Open-Meteo وCopernicus DEM (عبر Open-Meteo) وNASA POWER. التربة: خدمة محلية يجب ربطها (واجهة SoilGrids متوقفة).',
      d_engine: 'قواعد صريحة على 11 بطاقة موثقة، كلها مسودات إلى أن يصادق عليها مهندس فلاحي.',
      d_lab: 'إجابات مركبة من البطاقات والملف؛ ربط نموذج لغوي مخطط على الخادم.',
      d_health: 'فحص جودة الصورة في المتصفح؛ لا يوجد نموذج مدرَّب حالياً.',
      d_nexus: 'حساب FAO-56 وطاقة الضخ على البيانات المناخية للقطعة.',
      d_agv: 'نموذج فيزيائي مبسط في المتصفح؛ نسخة pvlib على الخادم.',
      d_kaizen: 'تُحفظ التصحيحات على الجهاز ويمكن تصديرها؛ مراجعة الخبراء لم تُنظَّم بعد.',
      d_kizuna: 'تعلّم موزّع بين المزارع: رؤية غير مبرمجة.'
    }
  });

  G.mountShell('home');

  /* ---------------------------------------------------------- hero map */
  var CITIES = [['Tunis', 36.81, 10.18], ['Aïn Draham', 36.78, 8.69], ['Kairouan', 35.68, 10.10], ['Sfax', 34.74, 10.76],
    ['Gafsa', 34.43, 8.78], ['Tozeur', 33.92, 8.13], ['Matmata', 33.54, 9.97], ['Médenine', 33.35, 10.50], ['Tataouine', 32.93, 10.45]];
  var B = { lonMin: 7.3, lonMax: 11.8, latMin: 30.1, latMax: 37.6 };
  var kx = Math.cos(34 * Math.PI / 180);
  var W = 420, H = Math.round(W * (B.latMax - B.latMin) / ((B.lonMax - B.lonMin) * kx));
  function px(lon) { return (lon - B.lonMin) / (B.lonMax - B.lonMin) * W; }
  function py(lat) { return (B.latMax - lat) / (B.latMax - B.latMin) * H; }
  function unpx(x) { return B.lonMin + x / W * (B.lonMax - B.lonMin); }
  function unpy(y) { return B.latMax - y / H * (B.latMax - B.latMin); }
  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, a) { var n = document.createElementNS(NS, tag); Object.keys(a || {}).forEach(function (k) { n.setAttribute(k, a[k]); }); return n; }

  function drawMap() {
    var box = document.getElementById('tnmap');
    G.clear(box);
    var pad = 24, svg = s('svg', { viewBox: (-pad) + ' ' + (-pad) + ' ' + (W + 2 * pad) + ' ' + (H + 2 * pad), role: 'img', 'aria-label': t('map_aria') });
    // graticule (1°)
    for (var lo = 8; lo <= 11; lo++) svg.appendChild(s('line', { x1: px(lo), x2: px(lo), y1: 0, y2: H, class: 'contour' }));
    for (var la = 31; la <= 37; la++) svg.appendChild(s('line', { x1: 0, x2: W, y1: py(la), y2: py(la), class: 'contour' }));
    // country
    var d = '';
    (window.GAIA_TUNISIA ? window.GAIA_TUNISIA.geometry.coordinates : []).forEach(function (poly) {
      poly.forEach(function (ring) { d += ring.map(function (p, i) { return (i ? 'L' : 'M') + px(p[0]).toFixed(1) + ' ' + py(p[1]).toFixed(1); }).join('') + 'Z'; });
    });
    var country = s('path', { d: d, class: 'country hit' });
    svg.appendChild(country);
    // cities (real places, not data)
    CITIES.forEach(function (c, i) {
      var g = s('g', { class: 'city' });
      g.appendChild(s('circle', { cx: px(c[2]), cy: py(c[1]), r: 3 }));
      var ping = s('circle', { cx: px(c[2]), cy: py(c[1]), r: 6, class: 'ping' }); ping.style.animationDelay = (i * 0.3) + 's';
      g.appendChild(ping);
      var tx = s('text', { x: px(c[2]) + 7, y: py(c[1]) + 4 }); tx.textContent = c[0]; g.appendChild(tx);
      svg.appendChild(g);
    });
    var pick = s('g', { class: 'pick' }); svg.appendChild(pick);
    var hint = el('p', { class: 'hint', 'aria-hidden': 'true' }, [t('map_hint')]);
    country.addEventListener('mousemove', function (e) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse());
      hint.textContent = fmt(unpy(q.y), 3) + ' , ' + fmt(unpx(q.x), 3);
    });
    country.addEventListener('mouseleave', function () { hint.textContent = t('map_hint'); });
    country.addEventListener('click', function (e) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var q = pt.matrixTransform(svg.getScreenCTM().inverse());
      G.clear(pick).appendChild(s('circle', { cx: q.x, cy: q.y, r: 6, class: 'dot' }));
      var lat = unpy(q.y).toFixed(4), lon = unpx(q.x).toFixed(4);
      setTimeout(function () { window.location.href = 'land.html?lat=' + lat + '&lon=' + lon; }, 250);
    });
    box.appendChild(svg);
    box.appendChild(hint);
    box.appendChild(el('nav', { class: 'regions', 'aria-label': 'Régions' }, CITIES.map(function (c) {
      return el('a', { href: 'land.html?lat=' + c[1] + '&lon=' + c[2] }, [c[0]]);
    })));
  }

  /* ---------------------------------------------------------- sections */
  function dnaPreview() {
    var p = G.getParcel(), dna = p && p.dna;
    var rows = [
      ['f_rain', 'climate.rain_mm', 'mm/an', 0, 'src_rain'], ['f_slope', 'terrain.slope_pct', '%', 1, 'src_slope'], ['f_ghi', 'solar.ghi_kwh', 'kWh/m²/j', 2, 'src_ghi'],
      ['f_soil', 'soil.texture', '', 0, 'src_soil'], ['f_water', 'water.source', '', 0, 'src_water'], ['f_crop', 'crop', '', 0, 'src_crop']
    ];
    var card = el('div', { class: 'gp-card' }, [
      el('p', { class: 'eyebrow' }, [dna ? t('dna_yours') + ' · ' + (p.name || fmt(p.lat, 3) + ', ' + fmt(p.lon, 3)) : t('dna_example')])
    ]);
    rows.forEach(function (r) {
      var f = dna ? D.fieldAt(dna, r[1]) : null, ok = f && f.status === 'ok';
      var v = ok ? (typeof f.value === 'number' ? fmt(f.value, r[3]) + (r[2] ? ' ' + r[2] : '') : String(f.value)) : '—';
      card.appendChild(el('div', { class: 'dna-row' }, [
        el('span', { class: 'k' }, [t(r[0])]),
        el('span', { class: 'v' }, [v]),
        el('span', { class: 'src' }, [t(r[4]), G.confBadge(f ? (f.confidence || (ok ? 'medium' : 'missing')) : 'missing')])
      ]));
    });
    card.appendChild(el('a', { class: 'gp-btn ' + (dna ? 'ghost' : 'primary'), href: 'land.html', style: 'margin-top:14px' }, [dna ? t('dna_open') : t('dna_build')]));
    return el('section', { class: 'sec', 'aria-labelledby': 'h-dna' }, [
      el('div', { class: 'dna-prev' }, [
        el('div', null, [el('p', { class: 'eyebrow' }, ['GAIA LAND DNA']), el('h2', { id: 'h-dna' }, [t('dna_t')]), el('p', { class: 'lead' }, [t('dna_p')])]),
        card
      ])
    ]);
  }

  var MODS = [
    ['land.html', 'm_land', 'm_land_p', 'live', 'st_live', '地'], ['engine.html', 'm_engine', 'm_engine_p', 'live', 'st_live', '橋'],
    ['lab.html', 'm_lab', 'm_lab_p', 'demo', 'st_rules', '知'], ['health.html', 'm_health', 'm_health_p', 'plan', 'st_off', '葉'],
    ['nexus.html', 'm_nexus', 'm_nexus_p', 'live', 'st_live', '水'], ['agrivoltaic.html', 'm_agv', 'm_agv_p', 'demo', 'st_sim', '陽'],
    ['farm.html', 'm_farm', 'm_farm_p', 'demo', 'st_sim', '測'], ['library.html', 'm_lib', 'm_lib_p', 'live', 'st_live', '書']
  ];
  function modules() {
    return el('section', { class: 'sec', id: 'modules', 'aria-labelledby': 'h-mods' }, [
      el('h2', { id: 'h-mods' }, [t('mods_t')]), el('p', { class: 'lead' }, [t('mods_p')]),
      el('div', { class: 'mods' }, MODS.map(function (m) {
        return el('a', { class: 'mod', href: m[0] }, [
          el('div', { class: 'top' }, [el('span', { class: 'k', 'aria-hidden': 'true' }, [m[5]]), G.pill(m[3], t(m[4]))]),
          el('h3', null, [t(m[1])]), el('p', null, [t(m[2])]), el('span', { class: 'go' }, [t('open')])
        ]);
      }))
    ]);
  }

  function bridge() {
    return el('section', { class: 'sec', 'aria-labelledby': 'h-br' }, [
      el('h2', { id: 'h-br' }, [t('bridge_t')]), el('p', { class: 'lead' }, [t('bridge_p')]),
      el('div', { class: 'bridge' }, [
        el('div', { class: 'gp-card' }, [el('span', { class: 'origin jp' }, [el('span', { class: 'dot' }), t('b_jp')]), el('h3', null, [t('b_jp_h')]), el('p', null, [t('b_jp_p')])]),
        el('div', { class: 'arrow', 'aria-hidden': 'true' }, ['＋']),
        el('div', { class: 'gp-card' }, [el('span', { class: 'origin tn' }, [el('span', { class: 'dot' }), t('b_tn')]), el('h3', null, [t('b_tn_h')]), el('p', null, [t('b_tn_p')])])
      ]),
      el('div', { class: 'gp-card', style: 'margin-top:12px;border-color:var(--g-gold)' }, [
        el('p', { class: 'eyebrow' }, [t('b_out')]), el('h3', { style: 'font-size:20px;margin-top:6px' }, [t('b_out_h')]),
        el('p', { style: 'margin-top:6px;color:var(--g-ink-2)' }, [t('b_out_p')]),
        el('a', { href: 'engine.html', style: 'display:inline-block;margin-top:8px;font-weight:700;font-size:14px' }, [t('see')])
      ])
    ]);
  }

  function concepts() {
    var C = [['改善', 'kaizen', 'health.html'], ['里山', 'satoyama', 'engine.html'], ['もったいない', 'mottainai', 'nexus.html'], ['絆', 'kizuna', null], ['侘寂', 'wabisabi', 'health.html']];
    return el('section', { class: 'sec', 'aria-labelledby': 'h-con' }, [
      el('h2', { id: 'h-con' }, [t('con_t')]),
      el('div', { class: 'concepts' }, C.map(function (c) {
        return el('div', { class: 'concept' }, [
          el('div', { class: 'kj', 'aria-hidden': 'true' }, [c[0]]), el('h3', null, [t(c[1])]), el('p', null, [t(c[1] + '_p')]),
          c[2] ? el('a', { href: c[2] }, [t('see')]) : G.pill('plan', t('future'))
        ]);
      }))
    ]);
  }

  function status() {
    var R = [['m_land', 'live', 'st_live', 'd_land'], ['m_engine', 'live', 'st_live', 'd_engine'], ['m_lab', 'demo', 'st_rules', 'd_lab'], ['m_health', 'plan', 'st_off', 'd_health'],
      ['m_nexus', 'live', 'st_live', 'd_nexus'], ['m_agv', 'demo', 'st_sim', 'd_agv'], ['kaizen', 'demo', 'st_partial', 'd_kaizen'], ['kizuna', 'plan', 'st_concept', 'd_kizuna']];
    return el('section', { class: 'sec', 'aria-labelledby': 'h-st' }, [
      el('h2', { id: 'h-st' }, [t('status_t')]), el('p', { class: 'lead' }, [t('status_p')]),
      el('div', { class: 'gp-card status gp-table-wrap' }, [el('table', { class: 'gp-table' }, [
        el('thead', null, [el('tr', null, [el('th', null, [t('th_feat')]), el('th', null, [t('th_state')]), el('th', null, [t('th_detail')])])]),
        el('tbody', null, R.map(function (r) {
          return el('tr', null, [el('td', { style: 'font-weight:600' }, [t(r[0]).split(' — ')[0]]), el('td', null, [G.pill(r[1], t(r[2]))]), el('td', { class: 'small' }, [t(r[3])])]);
        }))
      ])])
    ]);
  }

  function render() {
    drawMap();
    var box = G.clear(document.getElementById('sections'));
    [dnaPreview(), modules(), bridge(), concepts(), status()].forEach(function (n) { box.appendChild(n); });
  }
  render();
  G.onLang(render);
}());
