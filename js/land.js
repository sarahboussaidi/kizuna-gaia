/* Land Intelligence page — map, parcel selection, LAND DNA panel. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt;

  G.addStrings({
    fr: {
      l_eyebrow: 'GAIA LAND DNA', l_title: 'Choisissez votre parcelle',
      l_intro: "Cliquez sur la carte, cherchez un lieu ou saisissez des coordonnées. GAIA construit ensuite le profil de la parcelle à partir de données ouvertes.",
      l_search: 'Rechercher un lieu', l_search_ph: 'ex. Béni Khédache, Médenine', l_go: 'Chercher', l_regions: 'Aller à une région',
      l_name: 'Nom de la parcelle (facultatif)', l_crop: 'Culture', l_water: 'Eau disponible',
      c_olive: 'Olivier', c_palm: 'Palmier dattier', c_citrus: 'Agrumes', c_cereal: 'Céréales', c_veg: 'Maraîchage', c_other: 'Autre',
      w_rainfed: 'Pluie seulement', w_well: 'Puits ou forage', w_network: "Réseau d'irrigation", w_shared: 'Source partagée (GDA)',
      l_more: 'Votre exploitation', l_more_hint: 'Ces informations affinent le profil. Sans elles, GAIA les marque « manquantes ».',
      l_demo: 'Pré-remplir avec des valeurs de démonstration', l_demo_done: 'Valeurs de démonstration ajoutées dans les champs vides (marquées « démo » dans le profil). Remplacez-les par les vôtres.',
      st_none: 'Aucun', k_fill: 'Renseigner', st_approx: 'valeur régionale approximative', na: 'sans objet', l_area: 'Surface (ha)', l_well: 'Profondeur du puits (m)', l_pump: 'Pompage actuel',
      p_none: 'Aucun', p_diesel: 'Pompe diesel', p_grid: 'Pompe sur réseau', p_solar: 'Pompe solaire',
      l_soil: 'Sol (si connu)', s_unknown: 'Je ne sais pas', s_sandy: 'Sableux', s_loamy: 'Limoneux', s_clayey: 'Argileux',
      l_struct: 'Ouvrages déjà présents', st_terr: 'Terrasses',
      l_build: 'Construire le profil LAND DNA', l_build_hint: "Placez d'abord un point sur la carte.", l_ready: 'Point placé. Vous pouvez construire le profil.',
      l_plan: 'Plan', l_sat: 'Satellite',
      st_climate: 'Climat — Open-Meteo', st_terrain: 'Relief — Copernicus DEM', st_solar: 'Soleil — NASA POWER', st_soil: 'Sol — SoilGrids / référence régionale',
      d_empty_t: 'Aucun profil pour l’instant', d_empty_p: 'Le profil LAND DNA apparaîtra ici : chaque valeur avec sa source, sa résolution et sa confiance, et la liste de ce qui manque.',
      d_title: 'LAND DNA', d_conf: 'Confiance globale', d_missing: 'Informations manquantes', d_none_missing: 'Aucune information essentielle ne manque.',
      g_climate: 'Climat', g_terrain: 'Relief', g_solar: 'Soleil', g_soil: 'Sol', g_farm: 'Exploitation',
      k_rain: 'Pluie annuelle moyenne', k_rain_range: 'Plage interannuelle', k_et0: 'Évapotranspiration de référence', k_tmax: 'Max. du mois le plus chaud', k_tmin: 'Min. du mois le plus froid',
      k_elev: 'Altitude', k_slope: 'Pente moyenne', k_aspect: 'Orientation', k_ghi: 'Rayonnement global', k_texture: 'Texture', k_clay: 'Argile 0–30 cm', k_soc: 'Carbone organique',
      k_crop: 'Culture', k_water: "Source d'eau", k_well: 'Profondeur du puits', k_pump: 'Pompage', k_area: 'Surface', k_struct: 'Ouvrages',
      a_engine: 'Évaluer les techniques compatibles', a_lab: "Poser une question à l'AI Lab", a_nexus: 'Calculer eau et énergie',
      demo_none: 'Aucune donnée inventée : une source indisponible laisse la valeur vide, avec la raison.',
      search_none: 'Aucun résultat en Tunisie.', search_err: 'Recherche indisponible (service OpenStreetMap Nominatim). Cliquez directement sur la carte.',
      out_tn: 'Ce point semble hors de Tunisie. GAIA est conçu pour des parcelles tunisiennes.',
      l_leaflet: 'La bibliothèque de carte (Leaflet) n’a pas pu être chargée. Saisissez les coordonnées à gauche.', l_err: 'Erreur inattendue : ', l_years: 'ans', l_demo_pill: 'démo', l_pin: 'Parcelle', l_map_aria: 'Carte de la Tunisie', l_base_aria: 'Fond de carte'
    },
    ar: {
      l_eyebrow: 'غايا لاند دي إن إي', l_title: 'اختر قطعة أرضك',
      l_intro: 'انقر على الخريطة أو ابحث عن مكان أو أدخل الإحداثيات. ثم تبني غايا ملف القطعة من بيانات مفتوحة.',
      l_search: 'البحث عن مكان', l_search_ph: 'مثال: بني خداش، مدنين', l_go: 'بحث', l_regions: 'الانتقال إلى جهة',
      l_name: 'اسم القطعة (اختياري)', l_crop: 'الزراعة', l_water: 'الماء المتوفر',
      c_olive: 'زيتون', c_palm: 'نخيل التمر', c_citrus: 'قوارص', c_cereal: 'حبوب', c_veg: 'خضروات', c_other: 'أخرى',
      w_rainfed: 'أمطار فقط', w_well: 'بئر', w_network: 'شبكة ري', w_shared: 'مصدر مشترك (مجمع تنمية فلاحية)',
      l_more: 'ضيعتك', l_more_hint: 'هذه المعلومات تدقّق الملف. بدونها تعتبرها غايا «ناقصة».',
      l_demo: 'ملء بقيم تجريبية', l_demo_done: 'أُضيفت قيم تجريبية في الحقول الفارغة (معلّمة «تجريبية» في الملف). عوّضها بقيمك.',
      st_none: 'لا يوجد', k_fill: 'أدخل', st_approx: 'قيمة جهوية تقريبية', na: 'لا ينطبق', l_area: 'المساحة (هك)', l_well: 'عمق البئر (م)', l_pump: 'الضخ الحالي',
      p_none: 'لا يوجد', p_diesel: 'مضخة ديزل', p_grid: 'مضخة على الشبكة', p_solar: 'مضخة شمسية',
      l_soil: 'التربة (إن كانت معروفة)', s_unknown: 'لا أعرف', s_sandy: 'رملية', s_loamy: 'طميية', s_clayey: 'طينية',
      l_struct: 'المنشآت الموجودة', st_terr: 'مدرجات',
      l_build: 'بناء ملف لاند دي إن إي', l_build_hint: 'ضع نقطة على الخريطة أولاً.', l_ready: 'تم وضع النقطة. يمكنك بناء الملف.',
      l_plan: 'خريطة', l_sat: 'قمر صناعي',
      st_climate: 'المناخ — أوبن ميتيو', st_terrain: 'التضاريس — كوبرنيكوس', st_solar: 'الشمس — ناسا باور', st_soil: 'التربة — سويل غريدز / مرجع جهوي',
      d_empty_t: 'لا يوجد ملف بعد', d_empty_p: 'سيظهر ملف لاند دي إن إي هنا: كل قيمة مع مصدرها ودقتها ودرجة الثقة، وقائمة بما ينقص.',
      d_title: 'لاند دي إن إي', d_conf: 'الثقة العامة', d_missing: 'معلومات ناقصة', d_none_missing: 'لا تنقص أي معلومة أساسية.',
      g_climate: 'المناخ', g_terrain: 'التضاريس', g_solar: 'الشمس', g_soil: 'التربة', g_farm: 'الضيعة',
      k_rain: 'معدل الأمطار السنوي', k_rain_range: 'المدى بين السنوات', k_et0: 'التبخر النتحي المرجعي', k_tmax: 'أقصى حرارة في أحر شهر', k_tmin: 'أدنى حرارة في أبرد شهر',
      k_elev: 'الارتفاع', k_slope: 'متوسط الانحدار', k_aspect: 'الاتجاه', k_ghi: 'الإشعاع الشمسي', k_texture: 'القوام', k_clay: 'الطين 0–30 سم', k_soc: 'الكربون العضوي',
      k_crop: 'الزراعة', k_water: 'مصدر الماء', k_well: 'عمق البئر', k_pump: 'الضخ', k_area: 'المساحة', k_struct: 'المنشآت',
      a_engine: 'تقييم التقنيات المتوافقة', a_lab: 'اطرح سؤالاً على مختبر الذكاء', a_nexus: 'حساب الماء والطاقة',
      demo_none: 'لا توجد بيانات مختلقة: المصدر غير المتاح يترك القيمة فارغة مع ذكر السبب.',
      search_none: 'لا نتائج في تونس.', search_err: 'البحث غير متاح. انقر مباشرة على الخريطة.',
      out_tn: 'يبدو أن هذه النقطة خارج تونس. صُممت غايا لقطع الأرض التونسية.',
      l_leaflet: 'تعذّر تحميل مكتبة الخرائط (Leaflet). أدخل الإحداثيات على اليمين.', l_err: 'خطأ غير متوقع: ', l_years: 'سنوات', l_demo_pill: 'تجريبية', l_pin: 'القطعة', l_map_aria: 'خريطة تونس', l_base_aria: 'خلفية الخريطة'
    },
    en: {
      l_eyebrow: 'GAIA LAND DNA', l_title: 'Choose your plot',
      l_intro: 'Click the map, search for a place or enter coordinates. GAIA then builds the plot’s profile from open data.',
      l_search: 'Search for a place', l_search_ph: 'e.g. Beni Khedache, Medenine', l_go: 'Search', l_regions: 'Go to a region',
      l_name: 'Plot name (optional)', l_crop: 'Crop', l_water: 'Available water',
      c_olive: 'Olive', c_palm: 'Date palm', c_citrus: 'Citrus', c_cereal: 'Cereals', c_veg: 'Vegetables', c_other: 'Other',
      w_rainfed: 'Rain only', w_well: 'Well or borehole', w_network: 'Irrigation network', w_shared: 'Shared source (GDA)',
      l_more: 'Your farm', l_more_hint: 'This information refines the profile. Without it, GAIA marks it “missing”.',
      l_demo: 'Pre-fill with demo values', l_demo_done: 'Demo values added to the empty fields (marked “demo” in the profile). Replace them with your own.',
      st_none: 'None', k_fill: 'Fill in', st_approx: 'approximate regional value', na: 'not applicable', l_area: 'Area (ha)', l_well: 'Well depth (m)', l_pump: 'Current pumping',
      p_none: 'None', p_diesel: 'Diesel pump', p_grid: 'Grid pump', p_solar: 'Solar pump',
      l_soil: 'Soil (if known)', s_unknown: 'I don’t know', s_sandy: 'Sandy', s_loamy: 'Loamy', s_clayey: 'Clayey',
      l_struct: 'Existing structures', st_terr: 'Terraces',
      l_build: 'Build the LAND DNA profile', l_build_hint: 'Place a point on the map first.', l_ready: 'Point placed. You can build the profile.',
      l_plan: 'Map', l_sat: 'Satellite',
      st_climate: 'Climate — Open-Meteo', st_terrain: 'Relief — Copernicus DEM', st_solar: 'Sun — NASA POWER', st_soil: 'Soil — SoilGrids / regional reference',
      d_empty_t: 'No profile yet', d_empty_p: 'The LAND DNA profile will appear here: each value with its source, resolution and confidence, and the list of what is missing.',
      d_title: 'LAND DNA', d_conf: 'Overall confidence', d_missing: 'Missing information', d_none_missing: 'No essential information is missing.',
      g_climate: 'Climate', g_terrain: 'Relief', g_solar: 'Sun', g_soil: 'Soil', g_farm: 'Farm',
      k_rain: 'Mean annual rainfall', k_rain_range: 'Year-to-year range', k_et0: 'Reference evapotranspiration', k_tmax: 'Max. of the hottest month', k_tmin: 'Min. of the coldest month',
      k_elev: 'Elevation', k_slope: 'Mean slope', k_aspect: 'Aspect', k_ghi: 'Global radiation', k_texture: 'Texture', k_clay: 'Clay 0–30 cm', k_soc: 'Organic carbon',
      k_crop: 'Crop', k_water: 'Water source', k_well: 'Well depth', k_pump: 'Pumping', k_area: 'Area', k_struct: 'Structures',
      a_engine: 'Assess compatible practices', a_lab: 'Ask the AI Lab a question', a_nexus: 'Calculate water and energy',
      demo_none: 'No invented data: an unavailable source leaves the value empty, with the reason.',
      search_none: 'No results in Tunisia.', search_err: 'Search unavailable (OpenStreetMap Nominatim service). Click directly on the map.',
      out_tn: 'This point seems to be outside Tunisia. GAIA is designed for Tunisian plots.',
      l_leaflet: 'The map library (Leaflet) could not be loaded. Enter the coordinates on the left.', l_err: 'Unexpected error: ', l_years: 'years', l_demo_pill: 'demo', l_pin: 'Plot', l_map_aria: 'Map of Tunisia', l_base_aria: 'Base map'
    },
    ja: {
      l_eyebrow: 'GAIA LAND DNA', l_title: '区画を選ぶ',
      l_intro: '地図をクリックするか、場所を検索するか、座標を入力してください。GAIAがオープンデータから区画のプロファイルを作成します。',
      l_search: '場所を検索', l_search_ph: '例：Beni Khedache, Medenine', l_go: '検索', l_regions: '地域へ移動',
      l_name: '区画名（任意）', l_crop: '作物', l_water: '利用できる水',
      c_olive: 'オリーブ', c_palm: 'ナツメヤシ', c_citrus: '柑橘', c_cereal: '穀物', c_veg: '野菜', c_other: 'その他',
      w_rainfed: '雨水のみ', w_well: '井戸・ボーリング井', w_network: '灌漑網', w_shared: '共同水源（GDA）',
      l_more: 'あなたの農場', l_more_hint: 'これらの情報でプロファイルの精度が上がります。未入力の場合、GAIAは「欠測」と表示します。',
      l_demo: 'デモ値で入力する', l_demo_done: '空欄にデモ値を入れました（プロファイルでは「デモ」と表示）。ご自身の値に置き換えてください。',
      st_none: 'なし', k_fill: '入力する', st_approx: 'おおよその地域値', na: '該当なし', l_area: '面積（ha）', l_well: '井戸の深さ（m）', l_pump: '現在の揚水方法',
      p_none: 'なし', p_diesel: 'ディーゼルポンプ', p_grid: '系統電力ポンプ', p_solar: '太陽光ポンプ',
      l_soil: '土壌（わかれば）', s_unknown: 'わからない', s_sandy: '砂質', s_loamy: 'ローム質', s_clayey: '粘土質',
      l_struct: '既存の構造物', st_terr: '段々畑',
      l_build: 'LAND DNAプロファイルを作成', l_build_hint: 'まず地図上に地点を置いてください。', l_ready: '地点を置きました。プロファイルを作成できます。',
      l_plan: '地図', l_sat: '衛星写真',
      st_climate: '気候 — Open-Meteo', st_terrain: '地形 — Copernicus DEM', st_solar: '日射 — NASA POWER', st_soil: '土壌 — SoilGrids／地域参照値',
      d_empty_t: 'まだプロファイルがありません', d_empty_p: 'ここにLAND DNAプロファイルが表示されます。各値の出典・解像度・信頼度と、欠けている情報の一覧です。',
      d_title: 'LAND DNA', d_conf: '総合信頼度', d_missing: '欠けている情報', d_none_missing: '欠けている重要な情報はありません。',
      g_climate: '気候', g_terrain: '地形', g_solar: '日射', g_soil: '土壌', g_farm: '農場',
      k_rain: '年平均降水量', k_rain_range: '年ごとの幅', k_et0: '基準蒸発散量', k_tmax: '最暑月の最高気温', k_tmin: '最寒月の最低気温',
      k_elev: '標高', k_slope: '平均傾斜', k_aspect: '斜面の向き', k_ghi: '全天日射量', k_texture: '土性', k_clay: '粘土 0–30 cm', k_soc: '有機炭素',
      k_crop: '作物', k_water: '水源', k_well: '井戸の深さ', k_pump: '揚水', k_area: '面積', k_struct: '構造物',
      a_engine: '適合する技術を評価', a_lab: 'AIラボに質問する', a_nexus: '水とエネルギーを計算',
      demo_none: 'データは作りません。取得できない出典は値を空欄にし、理由を示します。',
      search_none: 'チュニジア国内に結果がありません。', search_err: '検索を利用できません（OpenStreetMap Nominatim）。地図を直接クリックしてください。',
      out_tn: 'この地点はチュニジア国外のようです。GAIAはチュニジアの区画向けに設計されています。',
      l_leaflet: '地図ライブラリ（Leaflet）を読み込めませんでした。左側に座標を入力してください。', l_err: '予期しないエラー：', l_years: '年', l_demo_pill: 'デモ', l_pin: '区画', l_map_aria: 'チュニジアの地図', l_base_aria: '背景地図'
    }
  });

  G.mountShell('land');

  /* ---------------------------------------------------------- map */
  var REGIONS = [
    ['Aïn Draham', 36.78, 8.69], ['Cap Bon', 36.45, 10.73], ['Sahel (Sousse)', 35.83, 10.64], ['Kairouan', 35.68, 10.10],
    ['Sidi Bouzid', 35.04, 9.48], ['Matmata', 33.54, 9.97], ['Médenine', 33.35, 10.50], ['Tozeur', 33.92, 8.13]
  ];
  var map = null, marker = null;
  var plan, sat;

  if (window.L) {
    map = L.map('map', { zoomControl: true, attributionControl: true }).setView([34.6, 9.6], 7);
    plan = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);
    sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' });
    map.on('click', function (e) { place(e.latlng.lat, e.latlng.lng, true); });
    // Country outline drawn from local data: the map stays readable even when tiles cannot load.
    if (window.GAIA_TUNISIA) {
      L.geoJSON(window.GAIA_TUNISIA, { interactive: false, style: { color: '#1F3A2B', weight: 1.5, fill: true, fillColor: '#A9B89A', fillOpacity: 0.08 } }).addTo(map);
    }
  } else {
    G.clear(document.getElementById('map')).appendChild(G.note('err', t('l_leaflet')));
  }

  function setBase(which) {
    if (!map) return;
    var isSat = which === 'sat';
    if (isSat) { map.removeLayer(plan); sat.addTo(map); } else { map.removeLayer(sat); plan.addTo(map); }
    document.getElementById('b-sat').setAttribute('aria-pressed', String(isSat));
    document.getElementById('b-plan').setAttribute('aria-pressed', String(!isSat));
  }
  document.getElementById('b-plan').addEventListener('click', function () { setBase('plan'); });
  document.getElementById('b-sat').addEventListener('click', function () { setBase('sat'); });

  var regionsBox = document.getElementById('regions');
  REGIONS.forEach(function (r) {
    regionsBox.appendChild(el('button', { type: 'button', onclick: function () { if (map) map.setView([r[1], r[2]], 11); } }, [r[0]]));
  });

  var latI = document.getElementById('lat'), lonI = document.getElementById('lon');
  var buildB = document.getElementById('build'), hint = document.getElementById('buildhint');

  function place(lat, lon, fromMap) {
    lat = Math.round(lat * 1e5) / 1e5; lon = Math.round(lon * 1e5) / 1e5;
    latI.value = lat; lonI.value = lon;
    if (map) {
      if (marker) marker.setLatLng([lat, lon]); else marker = L.marker([lat, lon], { keyboard: true, title: t('l_pin'), icon: L.divIcon({ className: '', html: '<div class="gp-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 22] }) }).addTo(map);
      if (!fromMap) map.setView([lat, lon], Math.max(map.getZoom(), 12));
    }
    var inTn = lat >= 30 && lat <= 37.6 && lon >= 7.4 && lon <= 11.8;
    buildB.disabled = false;
    hint.textContent = inTn ? t('l_ready') : t('out_tn');
  }
  function fromInputs() {
    var la = parseFloat(latI.value), lo = parseFloat(lonI.value);
    if (!isNaN(la) && !isNaN(lo)) place(la, lo, false);
  }
  latI.addEventListener('change', fromInputs); lonI.addEventListener('change', fromInputs);

  // Deep link from the home page map: land.html?lat=..&lon=..
  (function () {
    var q = new URLSearchParams(window.location.search);
    var la = parseFloat(q.get('lat')), lo = parseFloat(q.get('lon'));
    if (!isNaN(la) && !isNaN(lo)) setTimeout(function () { place(la, lo, false); }, 0);
  }());

  /* ---------------------------------------------------------- search */
  var qI = document.getElementById('q'), qRes = document.getElementById('qres'), qMsg = document.getElementById('qmsg');
  function search() {
    var q = qI.value.trim(); if (!q) return;
    qMsg.textContent = ''; G.clear(qRes); qRes.hidden = true;
    qMsg.appendChild(el('span', { class: 'gp-spin' }));
    fetch('https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=tn&accept-language=' + G.lang() + '&q=' + encodeURIComponent(q))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (list) {
        qMsg.textContent = '';
        if (!list.length) { qMsg.textContent = t('search_none'); return; }
        list.forEach(function (it) {
          qRes.appendChild(el('li', null, [el('button', { type: 'button', onclick: function () {
            place(+it.lat, +it.lon, false); qRes.hidden = true;
            if (!document.getElementById('pname').value) document.getElementById('pname').value = it.display_name.split(',')[0];
          } }, [it.display_name])]));
        });
        qRes.hidden = false;
      })
      .catch(function () { qMsg.textContent = t('search_err'); });
  }
  document.getElementById('qbtn').addEventListener('click', search);
  qI.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); search(); } });

  /* ---------------------------------------------------------- build */
  var stepsBox = document.getElementById('steps');
  var stepState = {};
  function renderSteps() {
    G.clear(stepsBox);
    ['climate', 'terrain', 'solar', 'soil'].forEach(function (k) {
      var s = stepState[k]; if (!s) return;
      var ic = s === 'loading' ? el('span', { class: 'gp-spin' }) : G.icon(s === 'ok' ? 'ok' : 'warn', 16);
      stepsBox.appendChild(el('li', { class: s === 'ok' ? 's-ok' : s === 'error' ? 's-err' : '' }, [ic, t('st_' + k) + (s === 'approx' ? ' (' + t('st_approx') + ')' : '')]));
    });
  }

  /* ---------------------------------------------------------- demo values */
  // Typical values for a small Tunisian farm, the same defaults as the farm dashboard
  // (2 ha, ≈ 60 m total head). Only empty fields are filled, and each one is flagged
  // so the Land DNA labels it "démonstration" until the farmer changes it.
  var demoFlags = {};
  var DEMO = { crop: 'olive', water: 'well', area: '2', well: '50', pump: 'diesel' };
  var DEMO_KEY = { crop: 'crop', water: 'water', area: 'area', well: 'wellDepth', pump: 'pump' };
  Object.keys(DEMO).forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () { delete demoFlags[DEMO_KEY[id]]; });
    document.getElementById(id).addEventListener('change', function () { delete demoFlags[DEMO_KEY[id]]; });
  });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="st"]'), function (c) {
    c.addEventListener('change', function () {
      delete demoFlags.structures;
      if (c.checked && c.value === 'none') Array.prototype.forEach.call(document.querySelectorAll('input[name="st"]'), function (o) { if (o !== c) o.checked = false; });
      if (c.checked && c.value !== 'none') { var n = document.querySelector('input[name="st"][value="none"]'); if (n) n.checked = false; }
    });
  });
  document.getElementById('demo').addEventListener('click', function () {
    Object.keys(DEMO).forEach(function (id) {
      var i = document.getElementById(id);
      if (id === 'well' && document.getElementById('water').value && document.getElementById('water').value !== 'well') return;
      if (!i.value) { i.value = DEMO[id]; demoFlags[DEMO_KEY[id]] = true; }
    });
    if (!document.querySelector('input[name="st"]:checked')) { document.querySelector('input[name="st"][value="none"]').checked = true; demoFlags.structures = true; }
    hint.textContent = t('l_demo_done');
  });

  buildB.addEventListener('click', function () {
    var lat = parseFloat(latI.value), lon = parseFloat(lonI.value);
    if (isNaN(lat) || isNaN(lon)) return;
    var structures = Array.prototype.slice.call(document.querySelectorAll('input[name="st"]:checked')).map(function (c) { return c.value; });
    var input = {
      lat: lat, lon: lon, name: document.getElementById('pname').value.trim() || null,
      crop: document.getElementById('crop').value || null, water: document.getElementById('water').value || null,
      area: document.getElementById('area').value, wellDepth: document.getElementById('well').value,
      pump: document.getElementById('pump').value || null, soilTexture: document.getElementById('soilt').value,
      structures: structures, demo: Object.assign({}, demoFlags)
    };
    buildB.disabled = true; stepState = {};
    showLoading();
    GAIA_DNA.build(input, function (k, s) { stepState[k] = s; renderSteps(); }).then(function (dna) {
      G.setParcel({ lat: lat, lon: lon, name: input.name, input: input, dna: dna });
      renderDNA(dna);
      buildB.disabled = false;
    }).catch(function (e) {
      G.clear(document.getElementById('dna')).appendChild(G.note('err', t('l_err') + e.message));
      buildB.disabled = false;
    });
  });

  /* ---------------------------------------------------------- DNA panel */
  var dnaBox = document.getElementById('dna');

  function showLoading() {
    G.clear(dnaBox);
    dnaBox.appendChild(el('p', { class: 'eyebrow' }, [t('d_title')]));
    for (var i = 0; i < 8; i++) dnaBox.appendChild(el('div', { class: 'skel', style: 'margin:14px 0;width:' + (60 + (i * 7) % 35) + '%' }));
  }

  function emptyDNA() {
    G.clear(dnaBox).appendChild(el('div', { class: 'gp-empty', style: 'padding:30px 16px' }, [
      el('h3', { style: 'font-size:19px' }, [t('d_empty_t')]),
      el('p', { class: 'small' }, [t('d_empty_p')]),
      el('p', { class: 'small muted' }, [t('demo_none')])
    ]));
  }

  function row(label, f, opts) {
    opts = opts || {};
    var v;
    if (f && f.status === 'na') v = el('span', { class: 'v', style: 'font-size:15px;color:var(--g-ink-3)' }, [t('na')]);
    else if (!f || f.status !== 'ok' || f.value === null) v = el('span', { class: 'v', style: 'font-size:15px;color:var(--s-no)' }, ['—']);
    else if (opts.text) v = el('span', { class: 'v', style: 'font-size:15px' }, [opts.text(f.value)]);
    else v = el('span', { class: 'v' }, [fmt(f.value, opts.digits || 0), ' ', el('small', null, [G.tr(f.unit || '')])]);
    var src = el('div', { class: 'src' }, [
      f && f.status === 'na' ? null : G.confBadge(f ? (f.confidence || (f.status === 'ok' ? 'medium' : 'missing')) : 'missing'),
      f && f.source === 'Valeur de démonstration' ? G.pill('demo', t('l_demo_pill')) : null,
      f && f.source ? (f.url ? el('a', { href: f.url, target: '_blank', rel: 'noopener' }, [G.tr(f.source)]) : el('span', null, [G.tr(f.source)])) : null,
      f && f.resolution ? el('span', null, ['· ' + G.tr(f.resolution)]) : null,
      f && f.period ? el('span', null, ['· ' + f.period]) : null
    ]);
    var parts = [el('span', { class: 'k' }, [label]), v, src];
    if (f && f.note) parts.push(el('div', { class: 'src', style: 'margin-top:2px' }, [G.tr(f.note)]));
    if (opts.extra) parts.push(opts.extra);
    if (opts.input && (!f || f.status === 'missing' || f.source === 'Valeur de démonstration')) {
      parts.push(el('button', { type: 'button', class: 'gp-btn ghost sm', style: 'margin-top:6px', onclick: function () {
        var box = document.getElementById('farmbox'); if (box) box.open = true;
        var i = document.getElementById(opts.input); if (i) { i.scrollIntoView({ behavior: 'smooth', block: 'center' }); i.focus(); }
      } }, [t('k_fill') + ' →']));
    }
    return el('div', { class: 'dna-row' }, parts);
  }

  function ring(conf) {
    var pct = { high: 0.9, medium: 0.6, low: 0.3 }[conf] || 0.3;
    var color = { high: '#2F6B45', medium: '#A88746', low: '#9A3B2C' }[conf] || '#9A3B2C';
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 64 64'); s.setAttribute('class', 'ring'); s.setAttribute('aria-hidden', 'true');
    var C = 2 * Math.PI * 26;
    s.innerHTML = '<circle cx="32" cy="32" r="26" fill="none" stroke="rgba(30,38,34,.1)" stroke-width="6"/>' +
      '<circle cx="32" cy="32" r="26" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (C * pct) + ' ' + C + '" transform="rotate(-90 32 32)"/>';
    return s;
  }

  function renderDNA(dna) {
    G.clear(dnaBox);
    var p = G.getParcel();
    dnaBox.appendChild(el('div', { class: 'dna-head' }, [
      el('div', null, [
        el('p', { class: 'eyebrow' }, [t('d_title')]),
        el('h3', { style: 'font-size:22px;margin-top:4px' }, [(p && p.name) || (fmt(dna.location.lat, 4) + ', ' + fmt(dna.location.lon, 4))]),
        el('p', { class: 'small muted', style: 'margin-top:4px' }, [t('d_conf') + ' : ', G.confBadge(dna.quality.overall)])
      ]),
      ring(dna.quality.overall)
    ]));

    var vl = GAIA_ENGINE.valueLabel;
    var groups = [
      ['g_climate', [
        row(t('k_rain'), dna.climate.rain_mm, { extra: dna.climate.rain_mm.extra ? el('div', { class: 'src' }, [t('k_rain_range') + ' : ' + fmt(dna.climate.rain_mm.extra.min) + '–' + fmt(dna.climate.rain_mm.extra.max) + ' mm (' + dna.climate.rain_mm.extra.years + ' ' + t('l_years') + ')']) : null }),
        row(t('k_et0'), dna.climate.et0_mm),
        row(t('k_tmax'), dna.climate.tmax_hot, { digits: 1 }),
        row(t('k_tmin'), dna.climate.tmin_cold, { digits: 1 })
      ]],
      ['g_terrain', [row(t('k_elev'), dna.terrain.elev_m), row(t('k_slope'), dna.terrain.slope_pct, { digits: 1 }), row(t('k_aspect'), dna.terrain.aspect_deg)]],
      ['g_solar', [row(t('k_ghi'), dna.solar.ghi_kwh, { digits: 2 })]],
      ['g_soil', [row(t('k_texture'), dna.soil.texture, { text: function (v) { return t('s_' + v); } }), row(t('k_clay'), dna.soil.clay_pct), row(t('k_soc'), dna.soil.soc)]],
      ['g_farm', [
        row(t('k_crop'), dna.crop, { text: vl, input: 'crop' }), row(t('k_water'), dna.water.source, { text: vl, input: 'water' }),
        row(t('k_well'), dna.water.well_depth_m, { input: 'well' }), row(t('k_pump'), dna.energy.pump, { text: vl, input: 'pump' }),
        row(t('k_area'), dna.area_ha, { digits: 1, input: 'area' }), row(t('k_struct'), dna.structures, { input: 'st-first', text: function (v) { return v.map(function (x) { return x === 'none' ? t('st_none') : x === 'terraces' ? t('st_terr') : x.charAt(0).toUpperCase() + x.slice(1); }).join(', '); } })
      ]]
    ];
    groups.forEach(function (g) {
      dnaBox.appendChild(el('div', { class: 'dna-group' }, [el('h3', null, [t(g[0])])].concat(g[1])));
    });

    // missing info
    var miss = dna.quality.missing;
    dnaBox.appendChild(el('div', { class: 'dna-group' }, [
      el('h3', null, [t('d_missing')]),
      miss.length ? el('ul', { class: 'small', style: 'margin:8px 0 0;padding-inline-start:18px;color:var(--g-ink-2)' }, miss.map(function (m) {
        var f = GAIA_DNA.fieldAt(dna, m);
        return el('li', null, [G.fieldLabel(m) + (f && f.note ? ' — ' + G.tr(f.note) : '')]);
      })) : el('p', { class: 'small muted' }, [t('d_none_missing')])
    ]));

    dnaBox.appendChild(el('div', { class: 'next-actions' }, [
      el('a', { class: 'gp-btn primary', href: 'engine.html' }, [t('a_engine')]),
      el('a', { class: 'gp-btn ghost', href: 'lab.html' }, [t('a_lab')]),
      el('a', { class: 'gp-btn ghost', href: 'nexus.html' }, [t('a_nexus')])
    ]));
  }

  /* ---------------------------------------------------------- restore */
  var saved = G.getParcel();
  if (saved && saved.dna) {
    place(saved.lat, saved.lon, false);
    var inp = saved.input || {};
    ['crop', 'water', 'pump'].forEach(function (k) { if (inp[k]) document.getElementById(k).value = inp[k]; });
    if (inp.area) document.getElementById('area').value = inp.area;
    if (inp.wellDepth) document.getElementById('well').value = inp.wellDepth;
    if (inp.soilTexture) document.getElementById('soilt').value = inp.soilTexture;
    if (saved.name) document.getElementById('pname').value = saved.name;
    demoFlags = Object.assign({}, inp.demo || {});
    (inp.structures || []).forEach(function (s) { var c = document.querySelector('input[name="st"][value="' + s + '"]'); if (c) c.checked = true; });
    renderDNA(saved.dna);
  } else {
    emptyDNA();
  }
  G.onLang(function () { var s = G.getParcel(); if (s && s.dna) renderDNA(s.dna); else emptyDNA(); });
}());
