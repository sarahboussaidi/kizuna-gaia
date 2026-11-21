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
      src: 'Source',
      ms_eyebrow: 'GAIA MA SAISON · M6', cl_eyebrow: 'GAIA CALENDRIER · M6', so_eyebrow: 'GAIA SOL · M6', mt_eyebrow: 'GAIA MOTTAINAI · M6'
    },
    ar: {
      ss_tab_season: 'موسمي', ss_tab_cal: 'الرزنامة', ss_tab_soil: 'التربة', ss_tab_mott: 'موتايناي',
      ss_tabs: 'الموسم',
      crop_olive: 'الزيتون', crop_palm: 'نخيل التمر', crop_citrus: 'القوارص', crop_cereal: 'الحبوب (قمح، شعير)',
      to_validate: 'رزنامة تقريبية لتونس، يجب التثبت منها مع المندوبية الجهوية للفلاحة أو تقني من جهتك.',
      src: 'المصدر',
      ms_eyebrow: 'GAIA موسمي · M6', cl_eyebrow: 'GAIA الرزنامة · M6', so_eyebrow: 'GAIA التربة · M6', mt_eyebrow: 'GAIA موتايناي · M6'
    },
    en: {
      ss_tab_season: 'My season', ss_tab_cal: 'Calendar', ss_tab_soil: 'Soil', ss_tab_mott: 'Mottainai',
      ss_tabs: 'Season',
      crop_olive: 'Olive', crop_palm: 'Date palm', crop_citrus: 'Citrus', crop_cereal: 'Cereals (wheat, barley)',
      to_validate: 'Indicative calendar for Tunisia, to check with the CRDA or an extension officer in your region.',
      src: 'Source',
      ms_eyebrow: 'GAIA MY SEASON · M6', cl_eyebrow: 'GAIA CALENDAR · M6', so_eyebrow: 'GAIA SOIL · M6', mt_eyebrow: 'GAIA MOTTAINAI · M6'
    },
    ja: {
      ss_tab_season: 'わたしの季節', ss_tab_cal: '暦', ss_tab_soil: '土', ss_tab_mott: 'もったいない',
      ss_tabs: '季節',
      crop_olive: 'オリーブ', crop_palm: 'ナツメヤシ', crop_citrus: '柑橘', crop_cereal: '穀物（小麦・大麦）',
      to_validate: 'チュニジア向けの目安の暦です。地域のCRDA（農業開発局）または普及員に確認してください。',
      src: '出典',
      ms_eyebrow: 'GAIA わたしの季節 · M6', cl_eyebrow: 'GAIA 作物暦 · M6', so_eyebrow: 'GAIA 土 · M6', mt_eyebrow: 'GAIA もったいない · M6'
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

  /* ------------------------------------------------ English and Japanese
     Same content as the French above, attached as .en / .ja. A stage or residue
     without a translation falls back to French (see loc()). */
  var CAL_X = {
    olive: {
      harvest: [['Olive harvest', 'Starts in November depending on the governorate (1 November in Kairouan, 3 November in Tunis in 2025–2026). Take the olives to the mill fast: a stored olive loses quality.'],
        ['オリーブの収穫', '県によって11月に始まります（2025〜2026年はカイルアンで11月1日、チュニスで11月3日）。早く搾油所へ運びましょう。置いておいたオリーブは品質が落ちます。']],
      prune: [['Pruning', 'After the harvest and before flowering. Keep the tree open to the light; chip the wood rather than burn it.'],
        ['剪定', '収穫後、開花前に行います。木に光が入るよう開いた形を保ち、枝は燃やさずにチップにします。']],
      flower: [['Flowering and fruit set', 'A period sensitive to water shortage: if you irrigate, this is a priority moment.'],
        ['開花と結実', '水不足に弱い時期です。灌漑するなら、ここが優先すべき時期です。']],
      fruit: [['Fruit growth', 'Summer: high water demand. Mulch at the foot of the trees to limit evaporation.'],
        ['果実の肥大', '夏は水の需要が高い時期です。木の根元をマルチで覆い、蒸発を抑えます。']],
      catch: [['Prepare for the autumn rains', 'Maintain the basins, tabias and catchments (meskat) before the first rains.'],
        ['秋の雨に備える', '最初の雨の前に、水盤、タビア、集水域（メスカット）を手入れします。']]
    },
    palm: {
      pollinate: [['Pollination', 'Place strands of male flowers in the female spathes as soon as they open.'],
        ['受粉', '雌花の苞が開いたらすぐに、雄花の穂を差し込みます。']],
      thin: [['Bunch thinning and tying', 'Keep a number of bunches suited to the palm’s vigour; tie the bunches to the fronds.'],
        ['房の制限と結束', 'ヤシの勢いに合った数の房を残し、房を葉に結びつけます。']],
      summer: [['Summer irrigation', 'Peak water need: respect the oasis water turns and do not exceed the quota.'],
        ['夏の灌漑', '水の必要量がピークです。オアシスの水番を守り、割当量を超えないようにします。']],
      bag: [['Protecting the bunches', 'Bag the bunches (nets, sacks) against autumn rain and pests.'],
        ['房の保護', '秋の雨と害虫から守るため、房に袋（ネット、袋）をかけます。']],
      harvest: [['Harvest (Deglet Nour)', 'Harvest from October to December depending on the oasis (Kebili, Tozeur). Sort on site: the rejects have a second life.'],
        ['収穫（デグレット・ヌール）', 'オアシスによって10月から12月に収穫します（ケビリ、トズール）。その場で選別しましょう。はねたナツメヤシにも第二の生き方があります。']],
      clean: [['Cleaning the palm', 'Remove dry fronds and old bunches: a resource, not waste.'],
        ['ヤシの手入れ', '枯れた葉と古い房を取り除きます。ごみではなく資源です。']]
    },
    citrus: {
      harvest: [['Harvest (Maltaise)', 'Maltaise oranges are picked from January into spring; other varieties (clementines) from autumn.'],
        ['収穫（マルテーズ）', 'マルテーズは1月から春にかけて収穫します。ほかの品種（クレメンタイン）は秋からです。']],
      flower: [['Flowering', 'Orange blossom: in Cap Bon, bitter-orange blossom (zhar) is picked and distilled in March.'],
        ['開花', 'オレンジの花：カップ・ボンでは、3月にダイダイの花（ザハル）を摘んで蒸留します。']],
      prune: [['Pruning', 'After the harvest: remove dead wood and open up the centre of the tree.'],
        ['剪定', '収穫後に、枯れ枝を取り除き、木の中心に風を通します。']],
      summer: [['Summer irrigation', 'Citrus cannot take water shortage in summer: regular irrigation, by drip if possible.'],
        ['夏の灌漑', '柑橘は夏の水不足に耐えられません。定期的に、できれば点滴で灌漑します。']],
      early: [['First harvests, clean-up', 'Pick up fallen fruit: it feeds the fruit fly.'],
        ['最初の収穫と拾い集め', '落ちた果実を拾いましょう。ミバエのえさになります。']]
    },
    cereal: {
      prepare: [['Preparation and seed', 'The sowing campaign opens in autumn; prepare the soil and book your seed.'],
        ['準備と種子', '播種のキャンペーンは秋に始まります。土を準備し、種子を確保します。']],
      sow: [['Sowing', 'Sow after the first useful autumn rains, usually November–December.'],
        ['播種', '秋の最初の有効な雨のあと、ふつうは11月〜12月に播きます。']],
      tiller: [['Tillering and stem extension', 'Weeding and nitrogen fertilisation depending on the rain.'],
        ['分げつと茎立ち', '雨に応じて除草と窒素施肥を行います。']],
      head: [['Heading and flowering', 'The stage most sensitive to drought: supplementary irrigation is worth most here.'],
        ['出穂と開花', '干ばつに最も弱い段階です。補助灌漑はここで最も効果があります。']],
      harvest: [['Harvest', 'Early June in the north: 3 June in Tunis in 2026; depending on the year, barley comes before wheat (in Béja, barley from 3 June, wheat from 7 June).'],
        ['収穫', '北部では6月初め（2026年はチュニスで6月3日）。年によって大麦が小麦より先です（ベジャでは大麦が6月3日から、小麦が6月7日から）。']]
    }
  };
  var MOTT_X = {
    olive_wood: [{ name: 'Pruning wood and leaves', uses: ['Chip and spread as mulch at the foot of the trees: keeps moisture in, feeds the soil.', 'Compost the leaves with manure.', 'The big branches: firewood.', 'Green leaves can supplement sheep and goat feed.'], care: 'Burning in the open wastes organic matter and smokes out the neighbours.' },
      { name: '剪定枝と葉', uses: ['チップにして木の根元にマルチとして敷く：湿り気を保ち、土を養います。', '葉を堆肥と一緒に堆肥化する。', '太い枝：薪にする。', '緑の葉は羊やヤギの餌の足しになります。'], care: '野焼きは有機物を無駄にし、近所に煙を撒き散らします。' }],
    olive_pomace: [{ name: 'Pomace (mill residue)', uses: ['Compost with manure: in Sfax, this compost gave a good-quality organic fertiliser.', 'Exhausted pomace is used as fuel.'], care: 'Do not spread fresh pomace directly: compost it first.' },
      { name: '搾りかす（搾油所の残さ）', uses: ['堆肥と一緒に堆肥化する：スファックスでは、質のよい有機肥料になりました。', '油を抜いた搾りかすは燃料になります。'], care: '生の搾りかすを直接まかないこと。先に堆肥化します。' }],
    olive_omw: [{ name: 'Olive mill wastewater (margines)', uses: ['In the Sfax study, controlled spreading over three years improved soil fertility.'], care: 'Never into a wadi, a well or a sebkha. Spreading is regulated: check with the CRDA first.' },
      { name: '搾油廃水（マルジン）', uses: ['スファックスの研究では、3年間の管理された散布で土の肥沃度が上がりました。'], care: '涸れ川、井戸、塩湖には絶対に流さないこと。散布は規制されています。事前にCRDAに確認してください。' }],
    palm_fronds: [{ name: 'Dry palm fronds (jrid)', uses: ['Chip and compost with manure: in Moroccan oases, a 70 % fronds / 30 % manure compost gave yields close to mineral fertiliser.', 'Mulch, windbreaks and fences in the oasis.', 'The leaflets: basketry and crafts.'], care: 'Dry fronds burn fast: do not store them against houses.' },
      { name: '枯れたヤシの葉（ジュリード）', uses: ['チップにして堆肥と一緒に堆肥化する：モロッコのオアシスでは、葉70 %・堆肥30 %の堆肥が化学肥料に近い収量をあげました。', 'オアシスでのマルチ、防風垣、垣根に。', '小葉：かご編みや手工芸に。'], care: '枯れた葉はよく燃えます。家の近くに積まないでください。' }],
    palm_rejects: [{ name: 'Reject dates', uses: ['Livestock feed, as a supplement.', 'Processing (paste, syrup) if the quality allows.'], care: 'Set aside mouldy dates: they do not feed, they make animals ill.' },
      { name: 'はねたナツメヤシ', uses: ['家畜の補助飼料に。', '品質が許せば加工（ペースト、シロップ）に。'], care: 'カビたものは取り除くこと。栄養にならず、病気のもとになります。' }],
    citrus_wood: [{ name: 'Citrus pruning wood', uses: ['Chip as mulch or compost.'], care: 'Diseased wood does not go in the compost: take it off the parcel.' },
      { name: '柑橘の剪定枝', uses: ['チップにしてマルチにするか、堆肥化する。'], care: '病気の枝は堆肥に入れないこと。区画の外に出します。' }],
    citrus_fallen: [{ name: 'Fallen and reject fruit', uses: ['Pick up and compost (or bury deep).'], care: 'Left on the ground, they feed the fruit fly.' },
      { name: '落果とはねた果実', uses: ['拾い集めて堆肥化する（または深く埋める）。'], care: '地面に残すとミバエのえさになります。' }],
    citrus_flower: [{ name: 'Bitter-orange blossom (zhar)', uses: ['Picking and distilling into orange-flower water: a March income, a Cap Bon tradition.'], care: 'Pick only from bitter-orange trees grown for blossom, not from fruit trees.' },
      { name: 'ダイダイの花（ザハル）', uses: ['摘み取って蒸留し、オレンジフラワーウォーターに：3月の収入になる、カップ・ボンの伝統です。'], care: '花用のダイダイの木からだけ摘むこと。果実用の木からは摘みません。' }],
    cereal_straw: [{ name: 'Straw and stubble', uses: ['Straw: fodder and bedding.', 'Leave part of the stubble on the ground: less erosion, more water kept.', 'Stubble: grazing after the harvest.'], care: 'Do not burn the stubble: the soil loses its cover and its organic matter.' },
      { name: 'わらと刈り株', uses: ['わら：飼料と敷きわらに。', '刈り株の一部を畑に残す：侵食が減り、水がよく保たれます。', '刈り株：収穫後の放牧地に。'], care: '刈り株を燃やさないこと。土が覆いと有機物を失います。' }]
  };
  var SRC_X = {
    olive_start: ['La Presse / AllAfrica — Kairouan: olive picking to start on 1 November (2025)', 'La Presse／AllAfrica — カイルアン：オリーブの収穫開始は11月1日（2025年）'],
    olive_tunis: ['AllAfrica — Tunis: the olive harvest starts on 3 November (2026)', 'AllAfrica — チュニス：オリーブの収穫は11月3日に開始（2026年）'],
    cereal_harvest: ['AllAfrica — Cereal harvest: kick-off on 3 June in Tunis (2026)', 'AllAfrica — 穀物の収穫：チュニスで6月3日に開始（2026年）'],
    cereal_sow: ['AllAfrica — The Cereals Office launches the sowing campaign (September 2026)', 'AllAfrica — 穀物公社が播種キャンペーンを開始（2026年9月）'],
    dates_kebili: ['La Presse — Dates: signs of a record season, harvest in Kebili (October 2025)', 'La Presse — ナツメヤシ：記録的な季節の兆し、ケビリで収穫（2025年10月）'],
    maltaise: ['WMC — Export season for Maltaise oranges opens (January 2026)', 'WMC — マルテーズオレンジの輸出シーズン開始（2026年1月）'],
    zhar: ['Kapitalis — Zhar (bitter-orange blossom) season in Nabeul (March 2026)', 'Kapitalis — ナブールのザハル（ダイダイの花）の季節（2026年3月）'],
    sfax_omw: ['Gargouri et al., 2013 — Integrated management of olive-mill by-products, Sfax (Options Méditerranéennes A106, CIHEAM)', 'Gargouriほか、2013年 — スファックスにおける搾油副産物の総合管理（Options Méditerranéennes A106、CIHEAM）'],
    palm_compost: ['INRAE / UM6P — Composting dry palm fronds with manure (Moroccan oases, 2022)', 'INRAE／UM6P — 枯れたヤシの葉と堆肥の堆肥化（モロッコのオアシス、2022年）'],
    palm_review: ['BioResources — Transforming date palm agro-waste into organic compost (review)', 'BioResources — ナツメヤシの農業廃棄物を有機堆肥に変える（総説）'],
    fao56: ['FAO-56, Crop evapotranspiration (Allen et al., 1998)', 'FAO-56、作物の蒸発散量（Allenほか、1998年）']
  };
  Object.keys(CAL_X).forEach(function (c) {
    if (!CAL[c]) return;
    CAL[c].stages.forEach(function (s) { var x = CAL_X[c][s.id]; if (x) { s.en = x[0]; s.ja = x[1]; } });
  });
  Object.keys(MOTT_X).forEach(function (k) { if (MOTT[k]) { MOTT[k].en = MOTT_X[k][0]; MOTT[k].ja = MOTT_X[k][1]; } });
  Object.keys(SRC_X).forEach(function (k) { if (SRC[k]) { SRC[k].en = SRC_X[k][0]; SRC[k].ja = SRC_X[k][1]; } });

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
  // meanings in English, and readings in kana for Japanese (same order as SEKKI)
  var SEKKI_EN = ['Lesser cold', 'Greater cold', 'Start of spring', 'Rain water', 'Insects awaken', 'Spring equinox', 'Clear and bright', 'Grain rain',
    'Start of summer', 'Grain fills', 'Grain in ear', 'Summer solstice', 'Lesser heat', 'Greater heat', 'Start of autumn', 'End of heat',
    'White dew', 'Autumn equinox', 'Cold dew', 'Frost descends', 'Start of winter', 'Lesser snow', 'Greater snow', 'Winter solstice'];
  var SEKKI_JA = ['しょうかん', 'だいかん', 'りっしゅん', 'うすい', 'けいちつ', 'しゅんぶん', 'せいめい', 'こくう', 'りっか', 'しょうまん', 'ぼうしゅ', 'げし',
    'しょうしょ', 'たいしょ', 'りっしゅう', 'しょしょ', 'はくろ', 'しゅうぶん', 'かんろ', 'そうこう', 'りっとう', 'しょうせつ', 'たいせつ', 'とうじ'];
  function lang() { var l = G.lang(); return l === 'ar' || l === 'en' || l === 'ja' ? l : 'fr'; }
  // text of a calendar stage or residue in the current language, French when a translation is missing
  function loc(o) { return o[lang()] || o.fr; }
  // "label : value" with the separator each language uses
  function colon() { var l = lang(); return l === 'ja' ? '：' : l === 'en' ? ': ' : ' : '; }
  // day + month name ("22 novembre", "22 November", "11月22日")
  function dayMonth(day, mi) { var m = G.t('months')[mi]; return lang() === 'ja' ? m + day + '日' : day + ' ' + m; }
  function meaning(s) { var i = SEKKI.indexOf(s), l = lang(); return l === 'en' ? SEKKI_EN[i] : l === 'ja' ? SEKKI_JA[i] : l === 'ar' ? s[5] : s[4]; }
  function sekki(date) {
    var d = date || new Date(), m = d.getMonth() + 1, day = d.getDate(), cur = SEKKI[SEKKI.length - 1], idx = SEKKI.length - 1;
    SEKKI.forEach(function (s, i) { if (m > s[2] || (m === s[2] && day >= s[3])) { cur = s; idx = i; } });
    return { kanji: cur[0], romaji: cur[1], fr: cur[4], ar: cur[5], en: SEKKI_EN[idx], ja: SEKKI_JA[idx], next: SEKKI[(idx + 1) % SEKKI.length] };
  }

  /* ------------------------------------------------ helpers */
  function stagesIn(crop, month) {
    var c = CAL[crop]; if (!c) return [];
    return c.stages.filter(function (s) { return s.m.indexOf(month) !== -1; });
  }
  function source(key) {
    var s = SRC[key]; if (!s) return null;
    return G.el('a', { href: s.u, target: '_blank', rel: 'noopener' }, [(lang() === 'en' || lang() === 'ja') && s[lang()] || s.t]);
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

  global.GAIA_SEASON = { CAL: CAL, MOTT: MOTT, SEKKI: SEKKI, SRC: SRC, sekki: sekki, lang: lang, loc: loc, colon: colon, dayMonth: dayMonth, meaning: meaning, stagesIn: stagesIn, source: source, subnav: subnav, parcelCrop: parcelCrop };
}(window));
