/* Agrivoltaic page (M3). Simulation in solar-core.js; solar input from GAIA LAND DNA. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, D = window.GAIA_DNA, S = window.GAIA_SOLAR;

  G.addStrings({
    fr: {
      a_title: 'Agrivoltaïsme',
      a_lead: "Réglez la hauteur, l'espacement, l'inclinaison et l'orientation des panneaux : GAIA estime l'électricité produite et la lumière qui reste pour la culture, mois par mois.",
      sim_badge: 'Simulation', sim_note: 'Toutes les valeurs de cette page sont des estimations de modèle, pas des mesures. Aucune installation réelle n’est représentée.',
      in_t: 'Configuration', h: 'Hauteur des panneaux', p: 'Espacement entre rangées', w: 'Largeur des panneaux', tilt: 'Inclinaison', az: 'Orientation',
      az_s: 'plein sud', az_e: 'vers l’est', az_w: 'vers l’ouest', area: 'Surface couverte (ha)', area_h: 'Surface de la parcelle si connue ; sinon le calcul est fait pour 1 ha.',
      dens: 'Puissance des modules (Wc/m²)', pr: 'Ratio de performance', assumption: 'Hypothèse modifiable',
      k_cap: 'Puissance installée', k_energy: 'Électricité par an', k_yield: 'Productible', k_light: 'Lumière pour la culture', k_light_s: 'en été (juin–août)', k_gcr: 'Taux de couverture',
      c_energy: 'Électricité estimée par mois', c_light: 'Part de la lumière qui atteint la culture, par mois',
      xs_t: 'Coupe : où tombe l’ombre', xs_month: 'Mois', xs_hour: 'Heure solaire', xs_south: 'face des panneaux →', xs_shade: 'ombre directe sur le sol à cette heure',
      insight_h: "Dans ce modèle à rangées longues, la hauteur déplace l'ombre sans changer sa part moyenne : elle sert surtout au passage des machines et à rendre l'ombre plus mobile au fil de la journée. Pour donner plus de lumière à la culture, écartez les rangées ou réduisez la largeur des panneaux.",
      no_solar: 'Rayonnement solaire indisponible pour cette parcelle : reconstruisez le profil sur la page Land Intelligence.',
      crop_t: 'Lecture pour la culture', crop_p: "GAIA ne compare pas cette lumière aux besoins de la culture tant qu'aucune fiche sourcée ne documente la tolérance à l'ombre de cette culture.",
      method_t: 'Méthode', method_p: "Position du soleil (déclinaison de Spencer, angle horaire), fraction diffuse journalière d'Erbs à partir de l'indice de clarté, ciel isotrope sur le plan des panneaux, ombre portée en coupe 2-D. L'énergie applique le ratio de performance, qui regroupe pertes thermiques et pertes système. La version serveur utilise pvlib.",
      gw_t: 'Si ce champ alimente une pompe : le garde-nappe',
      gw_p: "Ces panneaux pourraient pomper {c} m³ d'eau par an, soit {x} fois ce que la culture demande ({n} m³). Le garde-nappe plafonne la pompe à {a} m³ : {b} m³ restent dans la nappe et {f} kWh restent disponibles pour d'autres usages.",
      gw_ok: "Ce champ ne dépasse pas le besoin de la culture : pas de surpompage possible.",
      gw_none: "Renseignez la page Eau & énergie (surface, hauteur de pompage) pour voir combien d'eau ce champ pourrait pomper et le plafond qui protège la nappe.",
      gw_go: 'Voir le garde-nappe',
      sun_el: 'hauteur du soleil', sun_az: 'azimut', src: 'Rayonnement :', src_om: 'Open-Meteo (rayonnement de courte longueur d’onde)'
    },
    ar: {
      a_title: 'الزراعة الضوئية',
      a_lead: 'اضبط ارتفاع الألواح والمسافة بين الصفوف والميل والاتجاه: تقدّر غايا الكهرباء المنتجة والضوء المتبقي للزراعة شهراً بشهر.',
      sim_badge: 'محاكاة', sim_note: 'كل القيم في هذه الصفحة تقديرات نموذجية وليست قياسات. لا تمثل أي منشأة حقيقية.',
      in_t: 'الإعدادات', h: 'ارتفاع الألواح', p: 'المسافة بين الصفوف', w: 'عرض الألواح', tilt: 'الميل', az: 'الاتجاه',
      az_s: 'جنوب تام', az_e: 'نحو الشرق', az_w: 'نحو الغرب', area: 'المساحة المغطاة (هك)', area_h: 'مساحة القطعة إن كانت معروفة؛ وإلا يُحسب لهكتار واحد.',
      dens: 'قدرة الألواح (واط ذروة/م²)', pr: 'نسبة الأداء', assumption: 'فرضية قابلة للتعديل',
      k_cap: 'القدرة المركبة', k_energy: 'الكهرباء سنوياً', k_yield: 'الإنتاجية', k_light: 'الضوء للزراعة', k_light_s: 'في الصيف (جوان–أوت)', k_gcr: 'نسبة التغطية',
      c_energy: 'الكهرباء المقدرة حسب الشهر', c_light: 'نسبة الضوء الذي يصل إلى الزراعة حسب الشهر',
      xs_t: 'مقطع: أين يسقط الظل', xs_month: 'الشهر', xs_hour: 'الساعة الشمسية', xs_south: 'واجهة الألواح ←', xs_shade: 'الظل المباشر على الأرض في هذه الساعة',
      insight_h: 'في هذا النموذج ذي الصفوف الطويلة، يحرّك الارتفاع الظل دون أن يغيّر نسبته المتوسطة: فائدته الأساسية مرور الآلات وجعل الظل أكثر تنقلاً خلال اليوم. لمزيد من الضوء للزراعة، باعد بين الصفوف أو قلّل عرض الألواح.',
      no_solar: 'الإشعاع الشمسي غير متاح لهذه القطعة: أعد بناء الملف في صفحة ذكاء الأرض.',
      crop_t: 'قراءة للزراعة', crop_p: 'لا تقارن غايا هذا الضوء بحاجة الزراعة ما دامت لا توجد بطاقة موثقة بمصادر عن تحمّل هذه الزراعة للظل.',
      method_t: 'المنهجية', method_p: 'موقع الشمس (ميل سبنسر والزاوية الساعية)، الجزء المنتشر اليومي حسب إربس انطلاقاً من مؤشر الصفاء، سماء متجانسة على مستوى الألواح، ظل في مقطع ثنائي الأبعاد. تطبّق الطاقة نسبة الأداء التي تجمع الخسائر الحرارية وخسائر المنظومة. تستعمل نسخة الخادم مكتبة pvlib.',
      gw_t: 'إذا شغّل هذا الحقل مضخة: حارس المائدة المائية',
      gw_p: 'يمكن لهذه الألواح ضخ {c} م³ من الماء سنوياً، أي {x} مرة ما تحتاجه الزراعة ({n} م³). يحدد الحارس سقف المضخة بـ {a} م³: يبقى {b} م³ في المائدة و{f} ك.و.س متاحة لاستعمالات أخرى.',
      gw_ok: 'هذا الحقل لا يتجاوز حاجة الزراعة: لا ضخ مفرط ممكن.',
      gw_none: 'أكمل صفحة الماء والطاقة (المساحة، ارتفاع الضخ) لترى كم يمكن لهذا الحقل أن يضخ والسقف الذي يحمي المائدة.',
      gw_go: 'عرض حارس المائدة',
      sun_el: 'ارتفاع الشمس', sun_az: 'السمت', src: 'الإشعاع:', src_om: 'Open-Meteo (إشعاع الموجة القصيرة)'
    },
    en: {
      a_title: 'Agrivoltaics',
      a_lead: 'Set the height, spacing, tilt and orientation of the panels: GAIA estimates the electricity produced and the light left for the crop, month by month.',
      sim_badge: 'Simulation', sim_note: 'Every value on this page is a model estimate, not a measurement. No real installation is shown.',
      in_t: 'Configuration', h: 'Panel height', p: 'Row spacing', w: 'Panel width', tilt: 'Tilt', az: 'Orientation',
      az_s: 'due south', az_e: 'towards the east', az_w: 'towards the west', area: 'Area covered (ha)', area_h: 'Plot area if known; otherwise the calculation is for 1 ha.',
      dens: 'Module power (Wp/m²)', pr: 'Performance ratio', assumption: 'Editable assumption',
      k_cap: 'Installed power', k_energy: 'Electricity per year', k_yield: 'Specific yield', k_light: 'Light for the crop', k_light_s: 'in summer (June–August)', k_gcr: 'Ground coverage ratio',
      c_energy: 'Estimated electricity by month', c_light: 'Share of light reaching the crop, by month',
      xs_t: 'Cross-section: where the shade falls', xs_month: 'Month', xs_hour: 'Solar time', xs_south: 'panel face →', xs_shade: 'direct shade on the ground at this hour',
      insight_h: 'In this long-row model, height moves the shade without changing its average share: it mainly helps machines pass under and makes the shade move more over the day. To give the crop more light, space the rows further apart or narrow the panels.',
      no_solar: 'Solar radiation unavailable for this plot: rebuild the profile on the Land Intelligence page.',
      crop_t: 'Reading for the crop', crop_p: 'GAIA does not compare this light with the crop’s needs until a sourced record documents the crop’s shade tolerance.',
      method_t: 'Method', method_p: 'Sun position (Spencer declination, hour angle), Erbs daily diffuse fraction from the clearness index, isotropic sky on the panel plane, cast shade in a 2-D cross-section. The energy applies the performance ratio, which groups thermal and system losses. The server version uses pvlib.',
      gw_t: 'If this array powers a pump: the groundwater guard',
      gw_p: 'These panels could pump {c} m³ of water a year, {x} times what the crop needs ({n} m³). The groundwater guard caps the pump at {a} m³: {b} m³ stay in the aquifer and {f} kWh stay available for other uses.',
      gw_ok: 'This array does not exceed the crop’s need: no over-pumping is possible.',
      gw_none: 'Fill in the Water & energy page (area, pumping head) to see how much water this array could pump and the ceiling that protects the aquifer.',
      gw_go: 'See the groundwater guard',
      sun_el: 'sun elevation', sun_az: 'azimuth', src: 'Radiation:', src_om: 'Open-Meteo (shortwave radiation)'
    },
    ja: {
      a_title: '営農型太陽光',
      a_lead: 'パネルの高さ・間隔・傾き・向きを設定すると、GAIAが発電量と作物に届く光を月ごとに推定します。',
      sim_badge: 'シミュレーション', sim_note: 'このページの値はすべてモデルによる推定で、実測ではありません。実在の設備は表示していません。',
      in_t: '設定', h: 'パネルの高さ', p: '列の間隔', w: 'パネルの幅', tilt: '傾斜角', az: '向き',
      az_s: '真南', az_e: '東向き', az_w: '西向き', area: '対象面積（ha）', area_h: 'わかれば区画の面積。なければ1 haとして計算します。',
      dens: 'モジュール出力（Wp/m²）', pr: '性能比', assumption: '変更できる前提',
      k_cap: '設置容量', k_energy: '年間発電量', k_yield: '発電量（kWpあたり）', k_light: '作物に届く光', k_light_s: '夏（6〜8月）', k_gcr: '被覆率',
      c_energy: '月別の推定発電量', c_light: '作物に届く光の割合（月別）',
      xs_t: '断面図：影の落ちる場所', xs_month: '月', xs_hour: '太陽時', xs_south: 'パネルの正面 →', xs_shade: 'この時刻の地面への直射の影',
      insight_h: 'この長い列のモデルでは、高さは影の位置を動かしますが、平均的な割合は変えません。主に機械が下を通れるようにし、一日の中で影が動きやすくなる効果です。作物の光を増やすには、列の間隔を広げるか、パネルの幅を狭くしてください。',
      no_solar: 'この区画の日射量を取得できません。ランド・インテリジェンスでプロファイルを作り直してください。',
      crop_t: '作物にとっての意味', crop_p: 'この作物の耐陰性を記した出典つきの記録がない限り、GAIAはこの光を作物の必要量と比較しません。',
      method_t: '方法', method_p: '太陽位置（Spencerの赤緯、時角）、晴天指数からのErbsの日別散乱成分比、パネル面での等方性天空、2次元断面での影。発電量には熱損失とシステム損失をまとめた性能比を適用しています。サーバー版はpvlibを使用します。',
      gw_t: 'このアレイでポンプを動かす場合：地下水ガード',
      gw_p: 'このパネルは年間{c} m³の水を汲み上げられ、作物の必要量（{n} m³）の{x}倍です。地下水ガードはポンプを{a} m³までに制限し、{b} m³は帯水層に残り、{f} kWhは他の用途に使えます。',
      gw_ok: 'このアレイは作物の必要量を超えないため、過剰揚水は起こりません。',
      gw_none: '「水とエネルギー」ページ（面積、揚程）を入力すると、このアレイで汲める水の量と、帯水層を守る上限を確認できます。',
      gw_go: '地下水ガードを見る',
      sun_el: '太陽高度', sun_az: '方位角', src: '日射：', src_om: 'Open-Meteo（短波放射）'
    }
  });

  G.mountShell('agv');
  var app = document.getElementById('app');
  var p = G.getParcel();
  if (!p || !p.dna) { G.needParcel(app); return; }
  var dna = p.dna;
  var SM = dna.solarMonthly, CM = dna.climateMonthly;
  var ghi = SM && SM.ghi ? SM.ghi : (CM && CM.ghi ? CM.ghi : null);
  var ghiSrc = SM && SM.ghi ? SM.source : (CM && CM.ghi ? t('src_om') : null);
  var area0 = D.value(dna, 'area_ha');

  var C = Object.assign({ height: 4, pitch: 8, width: 2, tilt: 25, azimuth: 180, area: area0 || 1, density: 200, pr: 0.8, month: 5, hour: 10 },
    G.load('gaia.agv', {}));
  function persist() { G.save('gaia.agv', C); }

  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, a) { var n = document.createElementNS(NS, tag); Object.keys(a || {}).forEach(function (k) { n.setAttribute(k, a[k]); }); return n; }

  function slider(key, labelKey, min, max, step, unit, fmtFn) {
    var out = el('output', { for: 'r-' + key }, [fmtFn ? fmtFn(C[key]) : fmt(C[key], step < 1 ? 1 : 0) + ' ' + unit]);
    var input = el('input', { id: 'r-' + key, type: 'range', min: min, max: max, step: step, value: C[key], oninput: function (e) {
      C[key] = +e.target.value; out.textContent = fmtFn ? fmtFn(C[key]) : fmt(C[key], step < 1 ? 1 : 0) + ' ' + unit; persist(); update();
    } });
    return el('div', { class: 'rng' }, [el('div', { class: 'top' }, [el('label', { for: 'r-' + key }, [t(labelKey)]), out]), input]);
  }
  function azLabel(a) { return fmt(a) + '° · ' + (a === 180 ? t('az_s') : a < 180 ? t('az_e') : t('az_w')); }
  function numField(key, labelKey, hintKey) {
    return el('div', { class: 'gp-field', style: 'margin-top:12px' }, [
      el('label', { for: 'n-' + key }, [t(labelKey)]),
      el('input', { id: 'n-' + key, type: 'number', step: 'any', value: C[key], oninput: function (e) { var v = parseFloat(e.target.value); if (v > 0) { C[key] = v; persist(); update(); } } }),
      hintKey ? el('span', { class: 'hint' }, [t(hintKey)]) : null
    ]);
  }

  var kpiBox, c1, c2, xs, xsCaption, gwBox;

  // Groundwater guard: what this array could pump if it drove the farm's well.
  function drawGuard(kwp) {
    if (!gwBox) return;
    G.clear(gwBox);
    var saved = G.load('gaia.nexus.inputs', null), v = saved && saved.parcelAt === dna.builtAt ? saved.values : null;
    var N = window.GAIA_NEXUS, GG = window.GAIA_GUARD;
    var nb = function (x) { var y = parseFloat(String(x).replace(',', '.')); return isNaN(y) ? null : y; };
    var g = v && CM && N && GG ? GG.guard({ et0: CM.et0, rain: CM.rain, ghi: ghi, kc: nb(v.kc), months: v.months, area_ha: nb(v.area), ea: nb(v.ea),
      head_m: nb(v.head), pump_eff: nb(v.pump_eff), pr: nb(v.pr), pv_kwp: kwp, safe_yield_m3_year: nb(v.safe_yield) }) : null;
    gwBox.appendChild(el('h2', null, [t('gw_t')]));
    if (!g || g.status === 'incomplete') { gwBox.appendChild(el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2)' }, [t('gw_none')])); }
    else {
      var T = g.totals;
      gwBox.appendChild(el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2)' }, [T.blocked > 0 ? t('gw_p')
        .replace('{c}', fmt(T.capacity)).replace('{x}', fmt(T.over_ratio, 1)).replace('{n}', fmt(T.need)).replace('{a}', fmt(T.allowed))
        .replace('{b}', fmt(T.blocked)).replace('{f}', fmt(T.freed_kwh)) : t('gw_ok')]));
    }
    gwBox.appendChild(el('a', { class: 'gp-btn ghost', href: 'nexus.html', style: 'margin-top:10px' }, [t('gw_go')]));
  }
  function geom() { return { lat: dna.location.lat, ghi: ghi, tilt: C.tilt, azimuth: C.azimuth, height: C.height, width: C.width, pitch: C.pitch, area_ha: C.area, density_wp_m2: C.density, pr: C.pr }; }

  function update() {
    var r = S.simulate(geom()), months = G.t('months');
    G.clear(kpiBox);
    [['k_cap', fmt(r.kwp) + ' kWc', ''], ['k_energy', fmt(r.annual_kwh / 1000, 1) + ' MWh', ''], ['k_yield', fmt(r.kwp ? r.annual_kwh / r.kwp : null) + ' kWh/kWc', ''],
     ['k_light', fmt(r.lightShareYear * 100) + ' %', ''], ['k_light_s', fmt(r.lightShareSummer * 100) + ' %', t('k_light')], ['k_gcr', fmt(r.gcr * 100) + ' %', '']].forEach(function (k) {
      kpiBox.appendChild(el('div', { class: 'kpi' }, [el('b', null, [k[2] ? k[2] + ' — ' + t(k[0]) : t(k[0])]), el('div', { class: 'v' }, [k[1]])]));
    });
    G.barChart(c1, { labels: months, unit: 'kWh', title: t('c_energy'), series: [{ name: t('k_energy'), color: '#A88746', values: r.months.map(function (x) { return x ? x.energy_kwh : null; }) }] });
    G.barChart(c2, { labels: months, unit: '%', title: t('c_light'), series: [{ name: t('k_light'), color: '#7C9455', values: r.months.map(function (x) { return x ? x.lightShare * 100 : null; }) }] });
    drawSection();
    drawGuard(r.kwp);
  }

  function drawSection() {
    G.clear(xs);
    var W = 760, H = 250, ground = 210, scale = Math.min(26, (W - 60) / (3 * C.pitch + 4));
    var x0 = W / 2, X = function (m) { return x0 + m * scale; }, Z = function (z) { return ground - z * scale; };
    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'gp-chart', role: 'img', 'aria-label': t('xs_t'), direction: 'ltr' });
    svg.appendChild(svgEl('rect', { x: 0, y: ground, width: W, height: H - ground, fill: '#C9B173' }));
    var doy = S.DOY[C.month], sun = S.sunPosition(dna.location.lat, doy, C.hour);
    var g = geom(), b = C.tilt * Math.PI / 180, half = C.width / 2;
    var shadeLen = 0;
    [-1, 0, 1].forEach(function (k) {
      var cx = k * C.pitch;
      if (sun.el > 0) {
        var sh = S.shadeFraction(sun, g);
        if (sh.a !== undefined) {
          shadeLen = sh.b - sh.a;
          svg.appendChild(svgEl('rect', { x: X(cx + sh.a), y: ground, width: Math.max(1, (sh.b - sh.a) * scale), height: 10, fill: '#3B4A3A', opacity: 0.55 }));
        }
      }
      svg.appendChild(svgEl('line', { x1: X(cx), y1: ground, x2: X(cx), y2: Z(C.height), stroke: '#7A6A55', 'stroke-width': 4, 'stroke-linecap': 'round' }));
      svg.appendChild(svgEl('line', {
        x1: X(cx + half * Math.cos(b)), y1: Z(C.height - half * Math.sin(b)), x2: X(cx - half * Math.cos(b)), y2: Z(C.height + half * Math.sin(b)),
        stroke: '#24324A', 'stroke-width': 7, 'stroke-linecap': 'round'
      }));
    });
    // crop row hints
    for (var x = -1.5 * C.pitch; x <= 1.5 * C.pitch; x += 1) svg.appendChild(svgEl('circle', { cx: X(x), cy: ground - 5, r: 4, fill: '#7C9455' }));
    // sun ray
    if (sun.el > 0) {
      var c = Math.cos((sun.az - C.azimuth) * Math.PI / 180), cot = 1 / Math.tan(sun.el * Math.PI / 180);
      var dx = c * cot; // horizontal metres travelled toward the panel face per metre of height
      var topZ = C.height + 4, sx = dx * topZ;
      svg.appendChild(svgEl('line', { x1: X(sx), y1: Z(topZ), x2: X(0), y2: Z(0), stroke: '#E8B33C', 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
      svg.appendChild(svgEl('circle', { cx: X(sx), cy: Z(topZ), r: 11, fill: '#F4D875', stroke: '#E8B33C' }));
    }
    var lbl = svgEl('text', { x: W - 12, y: H - 12, 'text-anchor': 'end', 'font-size': 12, fill: '#4B5650' }); lbl.textContent = 'S →'; svg.appendChild(lbl);
    var lblN = svgEl('text', { x: 12, y: H - 12, 'font-size': 12, fill: '#4B5650' }); lblN.textContent = '← N'; svg.appendChild(lblN);
    xs.appendChild(svg);
    xsCaption.textContent = (sun.el > 0 ? t('xs_shade') + ' : ' + fmt(Math.min(100, shadeLen / C.pitch * 100)) + ' % · ' : '') +
      t('sun_el') + ' ' + fmt(sun.el, 0) + '° · ' + t('sun_az') + ' ' + fmt(sun.az, 0) + '°';
  }

  function render() {
    G.clear(app);
    if (!ghi) { app.appendChild(G.note('err', t('no_solar'))); return; }
    var months = G.t('months');
    var monthSel = el('select', { id: 'xs-m', onchange: function (e) { C.month = +e.target.value; persist(); drawSection(); } },
      months.map(function (m, i) { return el('option', { value: i, selected: C.month === i }, [m]); }));
    var hourOut = el('output', { for: 'xs-h' }, [fmt(C.hour, 1) + ' h']);
    var hourIn = el('input', { id: 'xs-h', type: 'range', min: 5, max: 19, step: 0.25, value: C.hour, oninput: function (e) { C.hour = +e.target.value; hourOut.textContent = fmt(C.hour, 1) + ' h'; persist(); drawSection(); } });

    gwBox = el('div', { class: 'gp-card', style: 'border:2px solid #2F5A75' });
    kpiBox = el('div', { class: 'kpis' }); c1 = el('div'); c2 = el('div'); xs = el('div', { class: 'xs-wrap' }); xsCaption = el('p', { class: 'small muted', style: 'margin-top:6px', 'aria-live': 'polite' });

    app.appendChild(el('div', { style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px' }, [G.pill('demo', t('sim_badge')), el('span', { class: 'small muted' }, [t('sim_note')])]));
    app.appendChild(el('div', { class: 'av' }, [
      el('div', { class: 'gp-card av-in' }, [
        el('h2', null, [t('in_t')]),
        slider('height', 'h', 2, 7, 0.5, 'm'),
        slider('pitch', 'p', 3, 16, 0.5, 'm'),
        slider('width', 'w', 1, 4, 0.1, 'm'),
        slider('tilt', 'tilt', 0, 40, 1, '°'),
        slider('azimuth', 'az', 90, 270, 5, '°', azLabel),
        numField('area', 'area', 'area_h'),
        numField('density', 'dens', 'assumption'),
        numField('pr', 'pr', 'assumption')
      ]),
      el('div', { class: 'gp-grid' }, [
        kpiBox,
        el('p', { class: 'insight' }, [t('insight_h')]),
        gwBox,
        el('div', { class: 'gp-card' }, [
          el('h2', null, [t('xs_t')]), el('div', { style: 'margin-top:10px' }, [xs]), xsCaption,
          el('div', { class: 'xs-ctl' }, [el('label', { for: 'xs-m' }, [t('xs_month'), monthSel]), el('label', { for: 'xs-h' }, [t('xs_hour'), hourIn, hourOut])])
        ]),
        el('div', { class: 'gp-card' }, [el('h2', null, [t('c_energy')]), c1]),
        el('div', { class: 'gp-card' }, [el('h2', null, [t('c_light')]), c2]),
        el('div', { class: 'gp-card' }, [el('h3', null, [t('crop_t')]), el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2)' }, [t('crop_p')])]),
        el('details', { class: 'gp-card gp-more' }, [el('summary', null, [t('method_t')]), el('p', { class: 'small', style: 'color:var(--g-ink-2)' }, [t('method_p')]), el('p', { class: 'small muted', style: 'margin-top:8px' }, [t('src') + ' ' + ghiSrc])])
      ])
    ]));
    update();
  }

  render();
  G.onLang(render);
}());
