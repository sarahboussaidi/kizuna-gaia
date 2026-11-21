/* GAIA MON SOL (M6): three field tests a farmer can do — jar, vinegar, water hole —
   turned into soil data stored in the parcel profile with confidence "declared".
   This answers the missing-soil gap honestly (the SoilGrids REST API is paused). */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, S = window.GAIA_SEASON, SC = window.GAIA_SOIL, D = window.GAIA_DNA;

  G.addStrings({
    fr: {
      so_title: 'Mon sol', so_lead: "Pas de carte de sol fiable ? Trois tests faits avec un bocal, du vinaigre et une bouteille d'eau donnent à GAIA la texture, le calcaire et l'infiltration de votre sol.",
      so_why: "Le service de cartes de sol SoilGrids est en pause. Plutôt que d’inventer une valeur, GAIA vous propose de mesurer. Vos résultats sont enregistrés comme « déclarés » : ils comptent, mais une analyse de laboratoire reste la référence.",
      so_now: 'Le sol dans votre profil', so_none: 'Aucune donnée de sol dans le profil pour le moment.',
      so_t1: 'Le test du bocal (texture)', so_t1_steps: ['Remplir un bocal en verre à un tiers de terre prise à 10–20 cm, sans cailloux ni racines.', 'Ajouter de l’eau jusqu’aux trois quarts, une cuillère de liquide vaisselle, fermer et secouer 3 minutes.', 'Poser le bocal. Après 1 minute, marquer la couche de sable ; après 2 heures, le limon ; après 24 heures, l’argile.', 'Mesurer chaque couche en millimètres avec une règle.'],
      so_sand: 'Sable (mm)', so_silt: 'Limon (mm)', so_clay: 'Argile (mm)',
      so_jar_res: 'Sable {s} % · limon {si} % · argile {c} % → texture : {cls}', so_taw: 'Eau disponible pour les racines : {a}–{b} mm par mètre de sol (FAO-56, tableau 19, à vérifier).', so_taw_na: 'Réserve en eau non tabulée pour cette texture dans FAO-56.',
      so_t2: 'Le test du vinaigre (calcaire)', so_t2_steps: ['Prendre une poignée de terre sèche.', 'Verser quelques gouttes de vinaigre blanc.', 'Écouter et regarder : ça mousse ?'],
      fz_none: 'Rien', fz_weak: 'Petites bulles, on entend un léger pétillement', fz_strong: 'Mousse forte et visible',
      lm_non_calcareous: 'Sol non calcaire.', lm_slightly_calcareous: 'Sol légèrement calcaire.', lm_calcareous: 'Sol calcaire.',
      lm_note: "L'olivier supporte bien les sols calcaires ; les agrumes y souffrent souvent de chlorose (feuilles jaunes). À confirmer par une analyse du calcaire actif.",
      so_t3: "Le test du trou d'eau (infiltration)", so_t3_steps: ['Creuser un trou de 30 cm de profondeur et 30 cm de large.', 'Le remplir d’eau et laisser s’infiltrer (le sol se mouille).', 'Le remplir à nouveau, planter une règle, noter la hauteur.', 'Mesurer de combien l’eau a baissé après un temps chronométré (30 à 60 minutes).'],
      so_drop: 'Baisse de l’eau (mm)', so_min: 'Durée (minutes)',
      so_inf_res: 'Infiltration : {v} mm/h → {cls}. Valeur habituelle d’un sol {tx}.',
      inf_very_slow: 'très lente', inf_slow: 'lente', inf_medium: 'moyenne', inf_fast: 'rapide', inf_very_fast: 'très rapide',
      so_inf_advice_slow: 'Arroser lentement et souvent ; éviter les bassins qui stagnent.', so_inf_advice_mid: 'Bon équilibre : l’eau entre sans filer trop vite.', s_sandy: 'Sableux', s_loamy: 'Limoneux', s_clayey: 'Argileux', so_inf_advice_fast: 'L’eau file vite : goutte-à-goutte, apports fractionnés, paillis.',
      so_mismatch: 'Les tests ne concordent pas tout à fait (bocal : {a}, infiltration : {b}). Refaites un test ou demandez une analyse.',
      so_save: 'Enregistrer dans mon profil', so_saved: 'Enregistré dans votre profil comme données déclarées : Land Intelligence les affiche, et elles remplacent la mention « sol manquant ».',
      so_nothing: 'Faites au moins un test avant d’enregistrer.', so_need_parcel: 'Choisissez une parcelle pour enregistrer les résultats dans son profil. Les tests fonctionnent quand même.',
      so_src: "Méthodes : triangle des textures de l'USDA ; FAO-56 (Allen et al., 1998), tableau 19 ; vitesses d'infiltration indicatives du manuel FAO Irrigation Water Management.",
      tx_sand: 'sable', tx_loamy_sand: 'sable limoneux', tx_sandy_loam: 'limon sableux', tx_loam: 'limon (franc)', tx_silt_loam: 'limon silteux', tx_silt: 'silt',
      tx_sandy_clay_loam: 'limon argilo-sableux', tx_clay_loam: 'limon argileux', tx_silty_clay_loam: 'limon argilo-silteux', tx_sandy_clay: 'argile sableuse', tx_silty_clay: 'argile silteuse', tx_clay: 'argile',
      k_texture: 'Texture', k_usda: 'Classe de texture', k_clay: 'Argile', k_lime: 'Calcaire', k_infil: 'Infiltration', k_taw: 'Eau disponible',
      src_jar: 'Test du bocal (agriculteur)', src_vin: 'Test du vinaigre (agriculteur)', src_hole: "Test du trou d'eau (agriculteur)",
      so_note_jar: 'Test du bocal, 10–20 cm', so_src_taw: t('so_src_taw')
    },
    ar: {
      so_title: 'تربتي', so_lead: 'لا توجد خريطة تربة موثوقة؟ ثلاثة اختبارات بإناء زجاجي وخل وقارورة ماء تعطي غايا قوام تربتك وكلسها وسرعة تسرّب الماء فيها.',
      so_why: 'خدمة خرائط التربة SoilGrids متوقفة. بدل اختلاق قيمة، تقترح عليك غايا أن تقيس. تُحفظ نتائجك «مصرّحاً بها»: لها وزن، لكن تحليل المخبر يبقى المرجع.',
      so_now: 'التربة في ملفك', so_none: 'لا بيانات عن التربة في الملف بعد.',
      so_t1: 'اختبار الإناء (القوام)', so_t1_steps: ['املأ إناءً زجاجياً بالثلث بتراب مأخوذ من عمق 10–20 سم دون حجارة أو جذور.', 'أضف الماء حتى ثلاثة أرباع الإناء وملعقة من سائل الجلي، أغلقه ورجّه 3 دقائق.', 'ضع الإناء. بعد دقيقة علّم طبقة الرمل؛ بعد ساعتين الطمي؛ بعد 24 ساعة الطين.', 'قِس كل طبقة بالمليمتر بمسطرة.'],
      so_sand: 'الرمل (مم)', so_silt: 'الطمي (مم)', so_clay: 'الطين (مم)',
      so_jar_res: 'رمل {s}٪ · طمي {si}٪ · طين {c}٪ ← القوام: {cls}', so_taw: 'الماء المتاح للجذور: {a}–{b} مم لكل متر من التربة (FAO-56، الجدول 19، يجب التثبت).', so_taw_na: 'مخزون الماء غير مجدول لهذا القوام في FAO-56.',
      so_t2: 'اختبار الخل (الكلس)', so_t2_steps: ['خذ حفنة من التراب الجاف.', 'اسكب عليها بضع قطرات من الخل الأبيض.', 'استمع وانظر: هل يُزبد؟'],
      fz_none: 'لا شيء', fz_weak: 'فقاعات صغيرة وطقطقة خفيفة', fz_strong: 'رغوة قوية ظاهرة',
      lm_non_calcareous: 'تربة غير كلسية.', lm_slightly_calcareous: 'تربة كلسية قليلاً.', lm_calcareous: 'تربة كلسية.',
      lm_note: 'الزيتون يتحمّل التربة الكلسية جيداً؛ أما القوارص فكثيراً ما تصاب فيها بالاصفرار. يُؤكَّد بتحليل الكلس النشط.',
      so_t3: 'اختبار الحفرة (تسرّب الماء)', so_t3_steps: ['احفر حفرة بعمق 30 سم وعرض 30 سم.', 'املأها ماءً واتركه يتسرّب (لترطيب التربة).', 'املأها من جديد، ضع مسطرة وسجّل الارتفاع.', 'قِس كم انخفض الماء بعد وقت محدد (30 إلى 60 دقيقة).'],
      so_drop: 'انخفاض الماء (مم)', so_min: 'المدة (دقائق)',
      so_inf_res: 'التسرّب: {v} مم/ساعة ← {cls}. قيمة معتادة لتربة {tx}.',
      inf_very_slow: 'بطيء جداً', inf_slow: 'بطيء', inf_medium: 'متوسط', inf_fast: 'سريع', inf_very_fast: 'سريع جداً',
      so_inf_advice_slow: 'اسقِ ببطء وبتواتر؛ تجنّب الأحواض التي يركد فيها الماء.', so_inf_advice_mid: 'توازن جيد: يدخل الماء دون أن يتسرّب بسرعة.', s_sandy: 'رملية', s_loamy: 'طميية', s_clayey: 'طينية', so_inf_advice_fast: 'الماء يتسرّب بسرعة: تقطير، دفعات مجزأة، تغطية التربة.',
      so_mismatch: 'الاختباران لا يتطابقان تماماً (الإناء: {a}، التسرّب: {b}). أعد اختباراً أو اطلب تحليلاً.',
      so_save: 'حفظ في ملفي', so_saved: 'حُفظ في ملفك كبيانات مصرّح بها: تعرضها صفحة ذكاء الأرض وتعوّض عبارة «التربة ناقصة».',
      so_nothing: 'أجرِ اختباراً واحداً على الأقل قبل الحفظ.', so_need_parcel: 'اختر قطعة لحفظ النتائج في ملفها. الاختبارات تعمل مع ذلك.',
      so_src: 'الطرق: مثلث القوام لوزارة الفلاحة الأمريكية (USDA)؛ FAO-56 (Allen وآخرون، 1998)، الجدول 19؛ سرعات تسرّب تقريبية من دليل الفاو لإدارة مياه الري.',
      tx_sand: 'رمل', tx_loamy_sand: 'رمل طميي', tx_sandy_loam: 'طمي رملي', tx_loam: 'طمي', tx_silt_loam: 'طمي سلتي', tx_silt: 'سلت',
      tx_sandy_clay_loam: 'طمي طيني رملي', tx_clay_loam: 'طمي طيني', tx_silty_clay_loam: 'طمي طيني سلتي', tx_sandy_clay: 'طين رملي', tx_silty_clay: 'طين سلتي', tx_clay: 'طين',
      k_texture: 'القوام', k_usda: 'صنف القوام', k_clay: 'الطين', k_lime: 'الكلس', k_infil: 'التسرّب', k_taw: 'الماء المتاح',
      src_jar: 'اختبار الإناء (الفلاح)', src_vin: 'اختبار الخل (الفلاح)', src_hole: 'اختبار الحفرة (الفلاح)',
      so_note_jar: 'اختبار الإناء، 10–20 سم', so_src_taw: 'FAO-56 الجدول 19 (قوام الإناء)'
    },
    en: {
      so_title: 'My soil', so_lead: 'No reliable soil map? Three tests with a jar, some vinegar and a bottle of water give GAIA your soil’s texture, lime and infiltration.',
      so_why: 'The SoilGrids soil map service is paused. Rather than invent a value, GAIA suggests you measure. Your results are saved as “declared”: they count, but a lab analysis remains the reference.',
      so_now: 'The soil in your profile', so_none: 'No soil data in the profile yet.',
      so_t1: 'The jar test (texture)', so_t1_steps: ['Fill a glass jar one third full with soil taken at 10–20 cm, without stones or roots.', 'Add water up to three quarters, a spoon of washing-up liquid, close it and shake for 3 minutes.', 'Set the jar down. After 1 minute, mark the sand layer; after 2 hours, the silt; after 24 hours, the clay.', 'Measure each layer in millimetres with a ruler.'],
      so_sand: 'Sand (mm)', so_silt: 'Silt (mm)', so_clay: 'Clay (mm)',
      so_jar_res: 'Sand {s} % · silt {si} % · clay {c} % → texture: {cls}', so_taw: 'Water available to roots: {a}–{b} mm per metre of soil (FAO-56, table 19, to check).', so_taw_na: 'Water reserve not tabulated for this texture in FAO-56.',
      so_t2: 'The vinegar test (lime)', so_t2_steps: ['Take a handful of dry soil.', 'Pour a few drops of white vinegar on it.', 'Listen and look: does it fizz?'],
      fz_none: 'Nothing', fz_weak: 'Small bubbles, a faint crackle', fz_strong: 'Strong, visible foam',
      lm_non_calcareous: 'Non-calcareous soil.', lm_slightly_calcareous: 'Slightly calcareous soil.', lm_calcareous: 'Calcareous soil.',
      lm_note: 'Olive copes well with calcareous soils; citrus often suffers chlorosis there (yellow leaves). To confirm with an active-lime analysis.',
      so_t3: 'The water-hole test (infiltration)', so_t3_steps: ['Dig a hole 30 cm deep and 30 cm wide.', 'Fill it with water and let it soak in (this wets the soil).', 'Fill it again, stand a ruler in it and note the level.', 'Measure how far the water has dropped after a timed period (30 to 60 minutes).'],
      so_drop: 'Water drop (mm)', so_min: 'Duration (minutes)',
      so_inf_res: 'Infiltration: {v} mm/h → {cls}. Typical of a {tx} soil.',
      inf_very_slow: 'very slow', inf_slow: 'slow', inf_medium: 'medium', inf_fast: 'fast', inf_very_fast: 'very fast',
      so_inf_advice_slow: 'Water slowly and often; avoid basins where water stands.', so_inf_advice_mid: 'Good balance: water gets in without running off too fast.', s_sandy: 'Sandy', s_loamy: 'Loamy', s_clayey: 'Clayey', so_inf_advice_fast: 'Water drains fast: drip, split applications, mulch.',
      so_mismatch: 'The tests do not quite agree (jar: {a}, infiltration: {b}). Repeat a test or ask for an analysis.',
      so_save: 'Save to my profile', so_saved: 'Saved to your profile as declared data: Land Intelligence shows it, and it replaces the “soil missing” mention.',
      so_nothing: 'Do at least one test before saving.', so_need_parcel: 'Choose a parcel to save the results to its profile. The tests work anyway.',
      so_src: 'Methods: USDA soil texture triangle; FAO-56 (Allen et al., 1998), table 19; indicative infiltration rates from the FAO Irrigation Water Management manual.',
      tx_sand: 'sand', tx_loamy_sand: 'loamy sand', tx_sandy_loam: 'sandy loam', tx_loam: 'loam', tx_silt_loam: 'silt loam', tx_silt: 'silt',
      tx_sandy_clay_loam: 'sandy clay loam', tx_clay_loam: 'clay loam', tx_silty_clay_loam: 'silty clay loam', tx_sandy_clay: 'sandy clay', tx_silty_clay: 'silty clay', tx_clay: 'clay',
      k_texture: 'Texture', k_usda: 'Texture class', k_clay: 'Clay', k_lime: 'Lime', k_infil: 'Infiltration', k_taw: 'Available water',
      src_jar: 'Jar test (farmer)', src_vin: 'Vinegar test (farmer)', src_hole: 'Water-hole test (farmer)',
      so_note_jar: 'Jar test, 10–20 cm', so_src_taw: 'FAO-56 table 19 (jar texture)'
    },
    ja: {
      so_title: 'わたしの土', so_lead: '信頼できる土壌図がない？ 瓶と酢と水のボトルでできる3つのテストで、土の質感、石灰分、浸透の速さをGAIAに伝えられます。',
      so_why: '土壌図サービスSoilGridsは停止中です。値をでっち上げる代わりに、GAIAは測ることを提案します。結果は「申告値」として保存されます。意味のある値ですが、基準はあくまで土壌分析です。',
      so_now: 'プロファイルの土', so_none: 'プロファイルにはまだ土のデータがありません。',
      so_t1: '瓶のテスト（土性）', so_t1_steps: ['ガラス瓶の3分の1まで、深さ10〜20 cmの土を入れます。石や根は取り除きます。', '4分の3まで水を入れ、台所用洗剤をスプーン1杯加え、ふたをして3分間振ります。', '瓶を置きます。1分後に砂の層、2時間後にシルトの層、24時間後に粘土の層に印をつけます。', '定規で各層の厚さをミリ単位で測ります。'],
      so_sand: '砂（mm）', so_silt: 'シルト（mm）', so_clay: '粘土（mm）',
      so_jar_res: '砂 {s} %・シルト {si} %・粘土 {c} % → 土性：{cls}', so_taw: '根が使える水：土1メートルあたり{a}〜{b} mm（FAO-56 表19、要確認）。', so_taw_na: 'この土性の保水量はFAO-56に記載がありません。',
      so_t2: '酢のテスト（石灰分）', so_t2_steps: ['乾いた土をひとつかみ取ります。', '白い酢を数滴たらします。', '耳と目で確かめます：泡が立ちますか？'],
      fz_none: '何も起きない', fz_weak: '小さな泡、かすかにパチパチ音がする', fz_strong: 'はっきり見える強い泡',
      lm_non_calcareous: '石灰質ではない土。', lm_slightly_calcareous: 'やや石灰質の土。', lm_calcareous: '石灰質の土。',
      lm_note: 'オリーブは石灰質の土によく耐えますが、柑橘はそこで白化（葉が黄色くなる）を起こしやすいです。活性石灰の分析で確認してください。',
      so_t3: '水穴のテスト（浸透）', so_t3_steps: ['深さ30 cm、幅30 cmの穴を掘ります。', '水を満たし、しみ込ませます（土を湿らせるため）。', 'もう一度水を満たし、定規を立てて水位を記録します。', '決めた時間（30〜60分）のあと、水位がどれだけ下がったかを測ります。'],
      so_drop: '水位の低下（mm）', so_min: '時間（分）',
      so_inf_res: '浸透：{v} mm/時 → {cls}。{tx}の土によくある値です。',
      inf_very_slow: 'とても遅い', inf_slow: '遅い', inf_medium: '中程度', inf_fast: '速い', inf_very_fast: 'とても速い',
      so_inf_advice_slow: 'ゆっくり、こまめに水をやり、水がたまる水盤は避けましょう。', so_inf_advice_mid: 'よいバランスです。水が速く抜けすぎずにしみ込みます。', s_sandy: '砂質', s_loamy: 'ローム質', s_clayey: '粘土質', so_inf_advice_fast: '水が速く抜けます：点滴灌漑、少量ずつの分割、マルチを。',
      so_mismatch: 'テストの結果が完全には一致しません（瓶：{a}、浸透：{b}）。テストをやり直すか、分析を依頼してください。',
      so_save: 'プロファイルに保存', so_saved: '申告値としてプロファイルに保存しました。土地インテリジェンスに表示され、「土のデータなし」の表示に置き換わります。',
      so_nothing: '保存する前に、少なくとも1つテストをしてください。', so_need_parcel: '結果を区画のプロファイルに保存するには、区画を選んでください。テスト自体はそのまま使えます。',
      so_src: '方法：USDAの土性三角図、FAO-56（Allenほか、1998）表19、FAO灌漑水管理マニュアルの目安となる浸透速度。',
      tx_sand: '砂土', tx_loamy_sand: 'ローム質砂土', tx_sandy_loam: '砂壌土', tx_loam: '壌土', tx_silt_loam: 'シルト質壌土', tx_silt: 'シルト',
      tx_sandy_clay_loam: '砂質埴壌土', tx_clay_loam: '埴壌土', tx_silty_clay_loam: 'シルト質埴壌土', tx_sandy_clay: '砂質埴土', tx_silty_clay: 'シルト質埴土', tx_clay: '埴土',
      k_texture: '土性', k_usda: '土性区分', k_clay: '粘土', k_lime: '石灰分', k_infil: '浸透', k_taw: '有効水分',
      src_jar: '瓶のテスト（農家）', src_vin: '酢のテスト（農家）', src_hole: '水穴のテスト（農家）',
      so_note_jar: '瓶のテスト、10〜20 cm', so_src_taw: 'FAO-56 表19（瓶のテストの土性）'
    }
  });

  G.mountShell('season');
  var tabs = document.getElementById('tabs'), app = document.getElementById('app');
  var st = G.load('gaia.soil.tests', { sand: '', silt: '', clay: '', fizz: null, drop: '', min: '60' });
  function persist() { G.save('gaia.soil.tests', st); }
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] === undefined ? '' : o[k]; }); }
  function num(v) { var x = parseFloat(String(v).replace(',', '.')); return isNaN(x) ? null : x; }

  function jarSvg(r) {
    var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 80 120'); svg.setAttribute('width', '80'); svg.setAttribute('height', '120'); svg.setAttribute('aria-hidden', 'true');
    function rect(y, h, fillC) { var e = document.createElementNS(ns, 'rect'); e.setAttribute('x', 10); e.setAttribute('y', y); e.setAttribute('width', 60); e.setAttribute('height', Math.max(0, h)); e.setAttribute('fill', fillC); svg.appendChild(e); }
    rect(20, 92, '#DCE8F0');
    if (r) {
      var H = 70, hs = H * r.sand / 100, hsi = H * r.silt / 100, hc = H * r.clay / 100, base = 112;
      rect(base - hs, hs, '#D9C08A'); rect(base - hs - hsi, hsi, '#A88E6A'); rect(base - hs - hsi - hc, hc, '#7A5F4A');
    }
    var jar = document.createElementNS(ns, 'path');
    jar.setAttribute('d', 'M14 8 h52 v8 h4 v96 a6 6 0 0 1 -6 6 h-48 a6 6 0 0 1 -6 -6 v-96 h4 z');
    jar.setAttribute('fill', 'none'); jar.setAttribute('stroke', '#1F3A2B'); jar.setAttribute('stroke-width', '2'); svg.appendChild(jar);
    return svg;
  }

  function steps(list) { return el('ol', null, list.map(function (s) { return el('li', null, [s]); })); }
  function numField(id, key, label) {
    return el('div', { class: 'gp-field' }, [el('label', { for: id }, [t(label)]),
      el('input', { id: id, type: 'number', min: '0', step: 'any', inputmode: 'decimal', value: st[key], oninput: function (e) { st[key] = e.target.value; persist(); results(); } })]);
  }

  var jarOut, jarPic, limeOut, infOut, checkOut, saveMsg;
  function results() {
    var j = SC.jar(num(st.sand), num(st.silt), num(st.clay));
    G.clear(jarPic).appendChild(jarSvg(j));
    G.clear(jarOut);
    if (j) {
      jarOut.appendChild(el('div', { class: 'ss-res' }, [
        el('strong', null, [fill(t('so_jar_res'), { s: fmt(j.sand, 0), si: fmt(j.silt, 0), c: fmt(j.clay, 0), cls: t('tx_' + j.usda) })]),
        el('p', { style: 'margin-top:4px' }, [j.taw ? fill(t('so_taw'), { a: j.taw.min_mm_m, b: j.taw.max_mm_m }) : t('so_taw_na')])
      ]));
    }
    G.clear(limeOut);
    var lm = SC.lime(st.fizz);
    if (lm) limeOut.appendChild(el('div', { class: 'ss-res' }, [el('strong', null, [t('lm_' + lm)]), el('p', { style: 'margin-top:4px' }, [t('lm_note')])]));
    G.clear(infOut);
    var inf = SC.infiltration(num(st.drop), num(st.min));
    if (inf) {
      infOut.appendChild(el('div', { class: 'ss-res' }, [
        el('strong', null, [fill(t('so_inf_res'), { v: fmt(inf.mm_h, 0), cls: t('inf_' + inf.cls), tx: t('tx_' + inf.typical) })]),
        el('p', { style: 'margin-top:4px' }, [t(inf.cls === 'very_slow' || inf.cls === 'slow' ? 'so_inf_advice_slow' : inf.cls === 'medium' ? 'so_inf_advice_mid' : 'so_inf_advice_fast')])
      ]));
    }
    G.clear(checkOut);
    if (j && inf && SC.GROUP[j.usda] !== SC.GROUP[inf.typical]) {
      checkOut.appendChild(G.note('info', fill(t('so_mismatch'), { a: t('tx_' + j.usda), b: t('tx_' + inf.typical) })));
    }
    return { jar: j, lime: lm, inf: inf };
  }

  function declared(v, src, extra) { return Object.assign({ value: v, status: 'ok', confidence: 'declared', source: src, at: new Date().toISOString() }, extra || {}); }

  function save() {
    var r = results(), p = G.getParcel();
    G.clear(saveMsg);
    if (!r.jar && !r.lime && !r.inf) { saveMsg.appendChild(G.note('info', t('so_nothing'))); return; }
    if (!p || !p.dna) { saveMsg.appendChild(G.note('info', t('so_need_parcel'))); return; }
    var soil = p.dna.soil = p.dna.soil || {};
    if (r.jar) {
      soil.texture = declared(r.jar.group, t('src_jar'));
      soil.usda_class = declared(r.jar.usda, t('src_jar'));
      soil.clay_pct = declared(Math.round(r.jar.clay), t('src_jar'), { unit: '%', note: t('so_note_jar') });
      if (r.jar.taw) soil.taw_mm_m = declared(r.jar.taw.mid_mm_m, 'FAO-56 tableau 19 (texture du bocal)', { unit: 'mm/m', note: r.jar.taw.min_mm_m + '–' + r.jar.taw.max_mm_m + ' mm/m' });
      p.input = p.input || {}; p.input.soilTexture = r.jar.group;
    }
    if (r.lime) soil.lime = declared(r.lime, t('src_vin'));
    if (r.inf) soil.infiltration_mm_h = declared(Math.round(r.inf.mm_h), t('src_hole'), { unit: 'mm/h' });
    // refresh the profile's list of missing fields
    if (p.dna.quality && D && D.walk) {
      p.dna.quality.missing = D.walk(p.dna).filter(function (x) { return x.f && (x.f.status === 'missing' || x.f.status === 'error'); }).map(function (x) { return x.path; });
    }
    G.setParcel(p);
    saveMsg.appendChild(G.note('ok', t('so_saved')));
    profileCard();
  }

  var profBox;
  function profileCard() {
    var p = G.getParcel();
    G.clear(profBox);
    profBox.appendChild(el('h2', null, [t('so_now')]));
    var soil = p && p.dna && p.dna.soil;
    var rows = [['k_texture', 'texture', function (v) { return t('s_' + v) !== 's_' + v ? t('s_' + v) : v; }], ['k_usda', 'usda_class', function (v) { return t('tx_' + v); }],
      ['k_clay', 'clay_pct', function (v) { return fmt(v, 0) + ' %'; }], ['k_lime', 'lime', function (v) { return t('lm_' + v); }],
      ['k_infil', 'infiltration_mm_h', function (v) { return fmt(v, 0) + ' mm/h'; }], ['k_taw', 'taw_mm_m', function (v) { return fmt(v, 0) + ' mm/m'; }]];
    var shown = rows.filter(function (r) { return soil && soil[r[1]] && soil[r[1]].status === 'ok'; });
    if (!shown.length) { profBox.appendChild(el('p', { class: 'small muted', style: 'margin-top:6px' }, [t('so_none')])); return; }
    profBox.appendChild(el('div', { class: 'gp-table-wrap', style: 'margin-top:8px' }, [el('table', { class: 'gp-table' }, [el('tbody', null, shown.map(function (r) {
      var f = soil[r[1]];
      return el('tr', null, [el('td', { style: 'font-weight:600' }, [t(r[0])]), el('td', null, [r[2](f.value)]), el('td', null, [G.confBadge(f.confidence || 'declared')]), el('td', { class: 'small muted' }, [G.tr(f.source || '')])]);
    }))])]));
  }

  function render() {
    G.clear(tabs).appendChild(S.subnav('soil'));
    G.clear(app);
    app.appendChild(G.note('info', t('so_why')));
    profBox = el('div', { class: 'gp-card', style: 'margin-top:14px' });
    app.appendChild(profBox); profileCard();

    jarOut = el('div'); jarPic = el('div'); limeOut = el('div'); infOut = el('div'); checkOut = el('div', { style: 'margin-top:12px' }); saveMsg = el('div', { style: 'margin-top:10px', 'aria-live': 'polite' });
    var fizz = el('div', { class: 'ss-choice', role: 'group', 'aria-label': t('so_t2') }, ['none', 'weak', 'strong'].map(function (k) {
      return el('button', { type: 'button', 'aria-pressed': st.fizz === k ? 'true' : 'false', onclick: function () {
        st.fizz = k; persist();
        Array.prototype.forEach.call(fizz.children, function (b, i) { b.setAttribute('aria-pressed', ['none', 'weak', 'strong'][i] === k ? 'true' : 'false'); });
        results();
      } }, [t('fz_' + k)]);
    }));
    var stepsBox = el('div', { class: 'ss-steps', style: 'margin-top:16px' }, [
      el('section', { class: 'gp-card ss-step' }, [el('h3', null, [el('span', { class: 'n' }, ['1']), t('so_t1')]), steps(t('so_t1_steps')),
        el('div', { class: 'ss-jar' }, [jarPic, el('div', { class: 'gp-row', style: 'flex:1' }, [numField('so-sa', 'sand', 'so_sand'), numField('so-si', 'silt', 'so_silt'), numField('so-cl', 'clay', 'so_clay')])]), jarOut]),
      el('section', { class: 'gp-card ss-step' }, [el('h3', null, [el('span', { class: 'n' }, ['2']), t('so_t2')]), steps(t('so_t2_steps')), fizz, limeOut]),
      el('section', { class: 'gp-card ss-step' }, [el('h3', null, [el('span', { class: 'n' }, ['3']), t('so_t3')]), steps(t('so_t3_steps')),
        el('div', { class: 'gp-row', style: 'margin-top:10px' }, [numField('so-dr', 'drop', 'so_drop'), numField('so-mi', 'min', 'so_min')]), infOut])
    ]);
    app.appendChild(stepsBox);
    app.appendChild(checkOut);
    app.appendChild(el('div', { style: 'margin-top:16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center' }, [
      el('button', { type: 'button', class: 'gp-btn primary', onclick: save }, [t('so_save')]), G.kaizenButton({ kind: 'soil', page: 'soil' })]));
    app.appendChild(saveMsg);
    app.appendChild(el('p', { class: 'small muted', style: 'margin-top:12px' }, [t('so_src')]));
    results();
  }
  render();
  G.onLang(render);
}());
