/* ==========================================================================
   GAIA SEASON — shared knowledge for the season pages (M6):
   Ma saison · Calendrier cultural · Sol · Mottainai.

   - CAL: indicative crop calendars for Tunisia (olive, date palm, citrus,
     cereals). Month ranges come from public Tunisian sources where one
     exists (cited per stage); the rest is standard practice, marked
     "à valider" until an agronomist (CRDA, extension service) reviews it.
   - MOTT: farm residues and what to do with them, with the cautions.
   - SEKKI: the 24 Japanese solar terms (二十四節気). Start dates are the
     usual civil dates, ±1 day depending on the year.
   Load after gaia-core.js.
   ========================================================================== */
(function (global) {
  'use strict';
  var G = global.GAIA;

  G.addStrings({
    fr: {
      ss_tab_season: 'Ma saison', ss_tab_cal: 'Calendrier', ss_tab_soil: 'Sol', ss_tab_mott: 'Mottainai',
      ss_tabs: 'Saison',
      crop_olive: 'Olivier', crop_palm: 'Palmier dattier', crop_citrus: 'Agrumes', crop_cereal: 'Céréales (blé, orge)',
      to_validate: 'Calendrier indicatif pour la Tunisie, à valider avec le CRDA ou un technicien de votre région.',
      src: 'Source'
    },
    ar: {
      ss_tab_season: 'موسمي', ss_tab_cal: 'الرزنامة', ss_tab_soil: 'التربة', ss_tab_mott: 'موتايناي',
      ss_tabs: 'الموسم',
      crop_olive: 'الزيتون', crop_palm: 'نخيل التمر', crop_citrus: 'القوارص', crop_cereal: 'الحبوب (قمح، شعير)',
      to_validate: 'رزنامة تقريبية لتونس، يجب التثبت منها مع المندوبية الجهوية للفلاحة أو تقني من جهتك.',
      src: 'المصدر'
    }
  });

  /* ------------------------------------------------ sources */
  var SRC = {
    olive_start: { t: 'La Presse / AllAfrica — Kairouan : démarrage de la cueillette fixé au 1er novembre (2025)', u: 'https://fr.allafrica.com/stories/202510280448.html' },
    olive_tunis: { t: 'AllAfrica — Tunis : la récolte des olives démarre le 3 novembre (2026)', u: 'https://fr.allafrica.com/stories/202610230172.html' },
    cereal_harvest: { t: 'AllAfrica — Récolte céréalière : coup d’envoi le 3 juin à Tunis (2026)', u: 'https://fr.allafrica.com/stories/202606020316.html' },
    cereal_sow: { t: 'AllAfrica — L’Office des céréales lance la campagne de semis (septembre 2026)', u: 'https://fr.allafrica.com/stories/202609160570.html' },
    dates_kebili: { t: 'La Presse — Dattes : prémices d’une saison record, récolte à Kébili (octobre 2025)', u: 'https://lapresse.tn/2025/10/28/dattes-premices-dune-saison-record/' },
    maltaise: { t: 'WMC — Lancement de la saison d’exportation de la Maltaise (janvier 2026)', u: 'https://www.webmanagercenter.com/2026/01/02/558986/exportations-agricoles-la-tunisie-lance-la-saison-de-lorange-maltaise-vers-le-marche-francais/' },
    zhar: { t: 'Kapitalis — La saison du zhar (fleur de bigaradier) à Nabeul (mars 2026)', u: 'https://kapitalis.com/tunisie/2026/03/28/la-saison-du-zhar-est-de-retour-a-nabeul/' },
    sfax_omw: { t: 'Gargouri et al., 2013 — Gestion intégrée des sous-produits des huileries, Sfax (Options Méditerranéennes A106, CIHEAM)', u: 'https://om.ciheam.org/article.php?IDPDF=6807' },
    palm_compost: { t: 'INRAE / UM6P — Compostage des palmes sèches avec du fumier (oasis marocaines, 2022)', u: 'https://umrsas.rennes.hub.inrae.fr/Media/files/faits-marquants-2022/FM2022_Ficheweb_PROBIN_Compostage-palme-seche' },
    palm_review: { t: 'BioResources — Transforming date palm agro-waste into organic compost (revue)', u: 'https://bioresources.cnr.ncsu.edu/resources/transforming-date-palm-agro-waste-into-organic-compost-a-review-for-sustainable-farming-systems/' },
    fao56: { t: 'FAO-56, Crop evapotranspiration (Allen et al., 1998)', u: 'https://www.fao.org/4/x0490e/x0490e00.htm' }
  };

  /* ------------------------------------------------ crop calendars
     m: month indices (0 = janvier). w: 'water' marks a stage sensitive to water stress.
     res: residue produced (key of MOTT). src: key of SRC, or null = standard practice, to validate. */
  var CAL = {
    olive: { kc: 0.70, stages: [
      { id: 'harvest', m: [10, 11, 0], src: 'olive_start', res: 'olive_pomace',
        fr: ['Récolte des olives', "Démarre en novembre selon les gouvernorats (1er novembre à Kairouan, 3 novembre à Tunis en 2025–2026). Porter vite au moulin : une olive stockée perd en qualité."],
        ar: ['جني الزيتون', 'يبدأ في نوفمبر حسب الولايات (1 نوفمبر بالقيروان و3 نوفمبر بتونس في موسم 2025–2026). الإسراع بنقله إلى المعصرة: الزيتون المخزّن يفقد جودته.'] },
      { id: 'prune', m: [0, 1, 2], src: null, res: 'olive_wood',
        fr: ['Taille', "Après la récolte et avant la floraison. Garder l'arbre ouvert à la lumière ; broyer le bois plutôt que le brûler."],
        ar: ['التقليم', 'بعد الجني وقبل الإزهار. تهوئة الشجرة للضوء؛ فرم الأغصان بدل حرقها.'] },
      { id: 'flower', m: [3, 4], src: null, w: 'water',
        fr: ['Floraison et nouaison', "Période sensible au manque d'eau : si vous irriguez, c'est un moment prioritaire."],
        ar: ['الإزهار والعقد', 'فترة حساسة لنقص الماء: إن كنت تسقي، فهذه أولوية.'] },
      { id: 'fruit', m: [5, 6, 7, 8], src: null, w: 'water',
        fr: ['Grossissement du fruit', 'Été : forte demande en eau. Paillis au pied des arbres pour limiter l’évaporation.'],
        ar: ['نمو الثمار', 'الصيف: طلب كبير على الماء. تغطية التربة تحت الأشجار للحد من التبخر.'] },
      { id: 'catch', m: [8, 9], src: null,
        fr: ["Préparer les pluies d'automne", 'Entretenir les cuvettes, tabias et impluviums (meskat) avant les premières pluies.'],
        ar: ['الاستعداد لأمطار الخريف', 'صيانة الأحواض والطوابي والمساقي قبل الأمطار الأولى.'] }
    ] },
    palm: { kc: 0.95, stages: [
      { id: 'pollinate', m: [2, 3], src: null,
        fr: ['Pollinisation', 'Placer les brins de fleurs mâles dans les spathes femelles dès leur ouverture.'],
        ar: ['التلقيح (التذكير)', 'وضع شماريخ الذكار في الطلع الأنثوي عند انفتاحه.'] },
      { id: 'thin', m: [4, 5], src: null,
        fr: ['Limitation et attache des régimes', 'Garder un nombre de régimes adapté à la vigueur du palmier ; attacher les régimes aux palmes.'],
        ar: ['تحديد العراجين وربطها', 'الإبقاء على عدد عراجين يناسب قوة النخلة؛ ربط العراجين بالجريد.'] },
      { id: 'summer', m: [5, 6, 7], src: null, w: 'water',
        fr: ['Irrigation d’été', 'Pic de besoin en eau : respecter les tours d’eau de l’oasis, ne pas dépasser le quota.'],
        ar: ['سقي الصيف', 'ذروة الحاجة للماء: احترام دورات الماء في الواحة وعدم تجاوز الحصة.'] },
      { id: 'bag', m: [7, 8], src: null,
        fr: ['Protection des régimes', 'Ensacher les régimes (filets, sacs) contre la pluie d’automne et les ravageurs.'],
        ar: ['حماية العراجين', 'تغليف العراجين (شباك، أكياس) ضد أمطار الخريف والآفات.'] },
      { id: 'harvest', m: [9, 10, 11], src: 'dates_kebili', res: 'palm_rejects',
        fr: ['Récolte (Deglet Nour)', 'Récolte d’octobre à décembre selon les oasis (Kébili, Tozeur). Trier sur place : les écarts ont une seconde vie.'],
        ar: ['الجني (دقلة نور)', 'الجني من أكتوبر إلى ديسمبر حسب الواحات (قبلي، توزر). الفرز في المكان: للتمور المفرزة حياة ثانية.'] },
      { id: 'clean', m: [11, 0, 1], src: null, res: 'palm_fronds',
        fr: ['Toilette du palmier', 'Enlever les palmes sèches et les vieux régimes : une ressource, pas un déchet.'],
        ar: ['تنظيف النخلة', 'إزالة الجريد اليابس والعراجين القديمة: مورد لا نفاية.'] }
    ] },
    citrus: { kc: 0.65, stages: [
      { id: 'harvest', m: [0, 1, 2, 3], src: 'maltaise', res: 'citrus_fallen',
        fr: ['Récolte (Maltaise)', 'La Maltaise se récolte de janvier au printemps ; d’autres variétés (clémentines) dès l’automne.'],
        ar: ['الجني (المالطي)', 'يُجنى المالطي من جانفي إلى الربيع؛ وأصناف أخرى (الكليمنتين) منذ الخريف.'] },
      { id: 'flower', m: [2, 3], src: 'zhar',
        fr: ['Floraison', 'Fleur d’oranger : au Cap Bon, la fleur de bigaradier (zhar) est cueillie et distillée en mars.'],
        ar: ['الإزهار', 'زهر القوارص: في الوطن القبلي يُجنى الزهر ويُقطّر في مارس.'] },
      { id: 'prune', m: [3, 4], src: null, res: 'citrus_wood',
        fr: ['Taille', 'Après la récolte : enlever le bois mort et aérer le centre de l’arbre.'],
        ar: ['التقليم', 'بعد الجني: إزالة الخشب اليابس وتهوئة وسط الشجرة.'] },
      { id: 'summer', m: [5, 6, 7, 8], src: null, w: 'water',
        fr: ['Irrigation d’été', 'Les agrumes ne supportent pas le manque d’eau en été : irrigation régulière, au goutte-à-goutte si possible.'],
        ar: ['سقي الصيف', 'القوارص لا تتحمّل العطش صيفاً: سقي منتظم، بالتقطير إن أمكن.'] },
      { id: 'early', m: [9, 10, 11], src: null,
        fr: ['Premières récoltes, ramassage', 'Ramasser les fruits tombés : ils entretiennent la mouche des fruits.'],
        ar: ['أولى الجني، جمع الثمار', 'جمع الثمار المتساقطة: فهي تغذّي ذبابة الثمار.'] }
    ] },
    cereal: { kc: 1.15, stages: [
      { id: 'prepare', m: [8, 9], src: 'cereal_sow',
        fr: ['Préparation et semences', 'La campagne de semis est lancée à l’automne ; préparer le sol et réserver les semences.'],
        ar: ['التحضير والبذور', 'تنطلق حملة البذر في الخريف؛ تحضير الأرض وحجز البذور.'] },
      { id: 'sow', m: [10, 11], src: null,
        fr: ['Semis', 'Semer après les premières pluies utiles d’automne, généralement novembre–décembre.'],
        ar: ['البذر', 'البذر بعد أولى أمطار الخريف النافعة، عادة نوفمبر–ديسمبر.'] },
      { id: 'tiller', m: [0, 1, 2], src: null,
        fr: ['Tallage et montaison', 'Désherbage et fertilisation azotée selon la pluie.'],
        ar: ['الإشطاء والاستطالة', 'إزالة الأعشاب والتسميد الآزوتي حسب الأمطار.'] },
      { id: 'head', m: [2, 3], src: null, w: 'water',
        fr: ['Épiaison et floraison', 'Stade le plus sensible à la sécheresse : une irrigation d’appoint ici vaut le plus.'],
        ar: ['الإسبال والإزهار', 'أكثر مرحلة حساسية للجفاف: الري التكميلي هنا هو الأنفع.'] },
      { id: 'harvest', m: [5], src: 'cereal_harvest', res: 'cereal_straw',
        fr: ['Moisson', 'Début juin dans le nord : 3 juin à Tunis en 2026 ; selon les années, l’orge passe avant le blé (à Béja, orge dès le 3 juin, blé dès le 7).'],
        ar: ['الحصاد', 'بداية جوان في الشمال: 3 جوان بتونس في 2026؛ يُحصد الشعير قبل القمح (بباجة، الشعير من 3 جوان والقمح من 7 جوان).'] }
    ] }
  };

  /* ------------------------------------------------ residues (Mottainai) */
  // tags: soil | energy | income | animals ; months: when the residue appears (from CAL)
  var MOTT = {
    olive_wood: { crop: 'olive', tags: ['soil', 'energy', 'animals'], src: null,
      fr: { name: 'Bois et feuilles de taille', uses: ['Broyer et étaler en paillis au pied des arbres : garde l’humidité, nourrit le sol.', 'Composter les feuilles avec du fumier.', 'Les grosses branches : bois de chauffe.', 'Les feuilles vertes peuvent compléter l’alimentation des moutons et chèvres.'], care: 'Brûler à l’air libre gaspille la matière organique et enfume les voisins.' },
      ar: { name: 'أغصان وأوراق التقليم', uses: ['فرمها وفرشها تحت الأشجار: تحفظ الرطوبة وتغذي التربة.', 'تسميد الأوراق مع الغبار (السماد الحيواني).', 'الأغصان الكبيرة: حطب للتدفئة.', 'الأوراق الخضراء يمكن أن تكمّل علف الأغنام والماعز.'], care: 'الحرق في الهواء الطلق يضيّع المادة العضوية ويؤذي الجيران.' } },
    olive_pomace: { crop: 'olive', tags: ['soil', 'energy'], src: 'sfax_omw',
      fr: { name: 'Grignons (résidus du moulin)', uses: ['Composter avec du fumier : à Sfax, ce compost a donné un engrais organique de bonne qualité.', 'Les grignons épuisés servent de combustible.'], care: 'Ne pas épandre les grignons frais directement : composter d’abord.' },
      ar: { name: 'الفيتورة (بقايا المعصرة)', uses: ['تسميدها مع الغبار: في صفاقس أعطى هذا السماد سماداً عضوياً جيداً.', 'الفيتورة المستنفدة تُستعمل وقوداً.'], care: 'لا تُنثر الفيتورة الطازجة مباشرة: تُسمّد أولاً.' } },
    olive_omw: { crop: 'olive', tags: ['soil'], src: 'sfax_omw',
      fr: { name: 'Margines (eaux du moulin)', uses: ['Un épandage contrôlé sur trois ans a amélioré la fertilité du sol dans l’étude de Sfax.'], care: 'Jamais dans un oued, un puits ou une sebkha. L’épandage est encadré : se renseigner auprès du CRDA avant.' },
      ar: { name: 'المرجين (مياه المعصرة)', uses: ['في دراسة صفاقس، حسّن النثر المراقب على ثلاث سنوات خصوبة التربة.'], care: 'لا يُرمى أبداً في واد أو بئر أو سبخة. النثر مؤطر قانونياً: الاستفسار لدى المندوبية الجهوية للفلاحة قبل ذلك.' } },
    palm_fronds: { crop: 'palm', tags: ['soil', 'income'], src: 'palm_compost',
      fr: { name: 'Palmes sèches (jrid)', uses: ['Broyer et composter avec du fumier : dans des oasis marocaines, un compost 70 % palmes / 30 % fumier a donné des rendements proches de l’engrais minéral.', 'Paillis, brise-vent et clôtures dans l’oasis.', 'Les folioles : vannerie et artisanat.'], care: 'Les palmes sèches brûlent vite : ne pas les stocker contre les habitations.' },
      ar: { name: 'الجريد اليابس', uses: ['فرمه وتسميده مع الغبار: في واحات مغربية أعطى سماد 70٪ جريد و30٪ غبار مردوداً قريباً من السماد الكيميائي.', 'تغطية التربة، مصدّات الرياح والسياجات في الواحة.', 'السعف: صناعة القفاف والحرف.'], care: 'الجريد اليابس سريع الاشتعال: لا يُخزّن قرب المساكن.' } },
    palm_rejects: { crop: 'palm', tags: ['animals', 'income'], src: 'palm_review',
      fr: { name: 'Dattes d’écart', uses: ['Alimentation du bétail, en complément.', 'Transformation (pâte, sirop) si la qualité le permet.'], care: 'Écarter les dattes moisies : elles ne nourrissent pas, elles rendent malade.' },
      ar: { name: 'التمور المفرزة', uses: ['علف تكميلي للماشية.', 'التحويل (عجين، رب) إن سمحت الجودة.'], care: 'استبعاد التمور المتعفنة: فهي تُمرض ولا تُغذّي.' } },
    citrus_wood: { crop: 'citrus', tags: ['soil'], src: null,
      fr: { name: 'Bois de taille des agrumes', uses: ['Broyer en paillis ou composter.'], care: 'Le bois malade ne va pas au compost : le sortir de la parcelle.' },
      ar: { name: 'أغصان تقليم القوارص', uses: ['فرمها غطاءً للتربة أو تسميدها.'], care: 'الخشب المريض لا يوضع في السماد: يُخرج من القطعة.' } },
    citrus_fallen: { crop: 'citrus', tags: ['soil'], src: null,
      fr: { name: 'Fruits tombés et écarts', uses: ['Ramasser et composter (ou enfouir profondément).'], care: 'Laissés au sol, ils entretiennent la mouche des fruits.' },
      ar: { name: 'الثمار المتساقطة والمفرزة', uses: ['جمعها وتسميدها (أو دفنها عميقاً).'], care: 'إن تُركت على الأرض تغذّي ذبابة الثمار.' } },
    citrus_flower: { crop: 'citrus', tags: ['income'], src: 'zhar',
      fr: { name: 'Fleurs de bigaradier (zhar)', uses: ['Cueillette et distillation en eau de fleur d’oranger : un revenu de mars, tradition du Cap Bon.'], care: 'Ne cueillir que sur les bigaradiers prévus pour la fleur, pas sur les arbres à fruits.' },
      ar: { name: 'زهر النارنج', uses: ['الجني والتقطير ماءَ زهر: دخل في مارس، تقليد في الوطن القبلي.'], care: 'الجني فقط من أشجار النارنج المخصصة للزهر، لا من أشجار الثمار.' } },
    cereal_straw: { crop: 'cereal', tags: ['animals', 'soil'], src: null,
      fr: { name: 'Paille et chaumes', uses: ['Paille : fourrage et litière.', 'Laisser une partie des chaumes au sol : moins d’érosion, plus d’eau gardée.', 'Chaumes : pâture après la moisson.'], care: 'Ne pas brûler les chaumes : le sol perd sa protection et sa matière organique.' },
      ar: { name: 'التبن والقصب', uses: ['التبن: علف وفراش للماشية.', 'ترك جزء من القصب على الأرض: انجراف أقل وماء محفوظ أكثر.', 'القصب: مرعى بعد الحصاد.'], care: 'عدم حرق القصب: تفقد التربة حمايتها ومادتها العضوية.' } }
  };

  /* ------------------------------------------------ 24 sekki (二十四節気) */
  // [kanji, romaji, month (1-12), day, meaning fr, meaning ar]
  var SEKKI = [
    ['小寒', 'Shōkan', 1, 5, 'Petit froid', 'البرد الصغير'], ['大寒', 'Daikan', 1, 20, 'Grand froid', 'البرد الكبير'],
    ['立春', 'Risshun', 2, 4, 'Début du printemps', 'بداية الربيع'], ['雨水', 'Usui', 2, 19, 'Eau de pluie', 'ماء المطر'],
    ['啓蟄', 'Keichitsu', 3, 5, 'Réveil des insectes', 'استيقاظ الحشرات'], ['春分', 'Shunbun', 3, 20, 'Équinoxe de printemps', 'الاعتدال الربيعي'],
    ['清明', 'Seimei', 4, 4, 'Pure clarté', 'الصفاء'], ['穀雨', 'Kokuu', 4, 20, 'Pluie des céréales', 'مطر الحبوب'],
    ['立夏', 'Rikka', 5, 5, "Début de l'été", 'بداية الصيف'], ['小満', 'Shōman', 5, 21, 'Les grains se remplissent', 'امتلاء الحبوب'],
    ['芒種', 'Bōshu', 6, 5, 'Céréales à barbe', 'الحبوب ذات السفا'], ['夏至', 'Geshi', 6, 21, "Solstice d'été", 'الانقلاب الصيفي'],
    ['小暑', 'Shōsho', 7, 7, 'Petite chaleur', 'الحر الصغير'], ['大暑', 'Taisho', 7, 22, 'Grande chaleur', 'الحر الكبير'],
    ['立秋', 'Risshū', 8, 7, "Début de l'automne", 'بداية الخريف'], ['処暑', 'Shosho', 8, 23, 'Fin de la chaleur', 'انتهاء الحر'],
    ['白露', 'Hakuro', 9, 7, 'Rosée blanche', 'الندى الأبيض'], ['秋分', 'Shūbun', 9, 23, "Équinoxe d'automne", 'الاعتدال الخريفي'],
    ['寒露', 'Kanro', 10, 8, 'Rosée froide', 'الندى البارد'], ['霜降', 'Sōkō', 10, 23, 'Descente du givre', 'نزول الصقيع'],
    ['立冬', 'Rittō', 11, 7, "Début de l'hiver", 'بداية الشتاء'], ['小雪', 'Shōsetsu', 11, 22, 'Petite neige', 'الثلج الصغير'],
    ['大雪', 'Taisetsu', 12, 7, 'Grande neige', 'الثلج الكبير'], ['冬至', 'Tōji', 12, 21, "Solstice d'hiver", 'الانقلاب الشتوي']
  ];
  function sekki(date) {
    var d = date || new Date(), m = d.getMonth() + 1, day = d.getDate(), cur = SEKKI[SEKKI.length - 1], idx = SEKKI.length - 1;
    SEKKI.forEach(function (s, i) { if (m > s[2] || (m === s[2] && day >= s[3])) { cur = s; idx = i; } });
    return { kanji: cur[0], romaji: cur[1], fr: cur[4], ar: cur[5], next: SEKKI[(idx + 1) % SEKKI.length] };
  }

  /* ------------------------------------------------ helpers */
  function stagesIn(crop, month) {
    var c = CAL[crop]; if (!c) return [];
    return c.stages.filter(function (s) { return s.m.indexOf(month) !== -1; });
  }
  function source(key) {
    var s = SRC[key]; if (!s) return null;
    return G.el('a', { href: s.u, target: '_blank', rel: 'noopener' }, [s.t]);
  }
  function subnav(current) {
    var tabs = [['season', 'season.html', 'ss_tab_season', '季'], ['cal', 'calendar.html', 'ss_tab_cal', '暦'], ['soil', 'soil.html', 'ss_tab_soil', '土'], ['mott', 'mottainai.html', 'ss_tab_mott', '惜']];
    return G.el('nav', { class: 'ss-tabs', 'aria-label': G.t('ss_tabs') }, tabs.map(function (x) {
      return G.el('a', { href: x[1], 'aria-current': x[0] === current ? 'page' : null }, [G.el('span', { class: 'k', 'aria-hidden': 'true' }, [x[3]]), G.t(x[2])]);
    }));
  }
  function parcelCrop() {
    var p = G.getParcel();
    var c = p && p.dna && global.GAIA_DNA ? global.GAIA_DNA.value(p.dna, 'crop') : null;
    return CAL[c] ? c : null;
  }

  global.GAIA_SEASON = { CAL: CAL, MOTT: MOTT, SEKKI: SEKKI, SRC: SRC, sekki: sekki, stagesIn: stagesIn, source: source, subnav: subnav, parcelCrop: parcelCrop };
}(window));
