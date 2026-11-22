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
      m_agent: 'Agent agricole', m_agent_p: 'Donnez un objectif : l’agent appelle les outils de GAIA (Land DNA, eau, nappe, Solar Brain, météo, satellite, maladies) et rend un plan d’action daté.', d_agent: 'Agent à outils : modèle de langage avec appel d’outils (Claude, Groq, Ollama) ou planificateur hors ligne ; chaque action est reliée à la mesure qui la justifie.', d_ndvi: 'NDVI Sentinel-2 (10 m) de la parcelle sur 12 mois, nuages masqués, tendance et chute récente.', m_ndvi: 'Satellite NDVI',
      m_lab: 'AI Lab', m_lab_p: 'Un assistant qui connaît votre parcelle et cite ses fiches. Il dit quand les preuves manquent.',
      m_health: 'Santé des plantes', m_health_p: "Photo d'une feuille, contrôle de qualité, puis diagnostic — ou « je ne suis pas sûr ».",
      m_nexus: 'Eau & énergie', m_nexus_p: "Besoin en eau FAO-56, énergie de pompage, champ solaire et quota d'eau mensuel.",
      m_farm: 'Tableau de bord', m_farm_p: "Eau pompée face au quota, énergie solaire, économies, alertes et irrigation conseillée pour 7 jours.",
      m_agv: 'Agrivoltaïsme', m_agv_p: 'Hauteur, espacement et orientation des panneaux : électricité et lumière restante pour la culture.',
      m_market: 'Vendre ma récolte', m_market_p: 'Souk, marché de gros, huilerie, export, avec le Teikei, la vente groupée JA et les stations de route japonaises.',
      m_biz: 'Modèle économique', m_biz_p: 'Kit de pompage solaire payé à l’usage par paiement mobile, pompe partagée en coopérative, quatre tests d’adoption.',
      m_season: 'Ma saison', m_season_p: 'Les actions du mois pour votre culture, les alertes sécheresse, pluie, chaleur et gel sur les vraies prévisions, et l’eau utilisée face au quota.',
      m_cal: 'Calendrier cultural', m_cal_p: 'Olivier, palmier dattier, agrumes, céréales : les étapes de l’année croisées avec la pluie et le besoin en eau de votre parcelle.',
      m_soil: 'Mon sol', m_soil_p: 'Tests du bocal, du vinaigre et du trou d’eau : texture, calcaire et infiltration, enregistrés dans votre profil.',
      m_mott: 'Mottainai', m_mott_p: 'Bois de taille, grignons, margines, palmes, paille : la seconde vie de chaque résidu, avec les précautions.',
      st_data: 'Données réelles', st_declared: 'Saisie agriculteur', st_rules2: 'Règles sourcées',
      d_season: 'Prévisions Open-Meteo en direct et relevés de compteur saisis ; aucune valeur simulée.',
      d_cal: 'Étapes sourcées quand une source existe, sinon marquées « à valider » ; climat de la parcelle (ERA5).',
      d_soil: 'Triangle des textures USDA, FAO-56 tableau 19 ; données enregistrées comme déclarées.',
      d_mott: 'Fiches de résidus avec sources ; aucune quantité inventée.',
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
      d_land: 'Open-Meteo, Copernicus DEM (via Open-Meteo) et NASA POWER interrogés en direct. Sol : SoilGrids 2.0 à 250 m (API de nouveau en ligne), sinon grille de secours. Eau réellement utilisée : FAO WaPOR (satellite, 100 m).',
      d_engine: 'Règles explicites sur 11 fiches sourcées, toutes en brouillon tant qu’un agronome ne les a pas validées.',
      d_lab: 'Modèle de langage réel : gratuit dans le navigateur (Qwen2.5), Ollama, Groq, Hugging Face ou Claude ; il s’appuie sur les fiches et le profil, chiffres vérifiés.',
      d_health: 'Modèles entraînés (EfficientNet-B0 + Pl@ntNet MobileNetV4, hors ligne) dans le navigateur : espèce, plante puis maladie pour olivier, palmier, agrumes, vigne, tomate, pomme de terre, poivron ; il s’abstient quand il n’est pas sûr.',
      d_biz: 'Mensualités calculées à partir du gazole économisé ; aucun prix inventé.',
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
      m_agent: 'الوكيل الفلاحي', m_agent_p: 'حدّد هدفاً: يستدعي الوكيل أدوات غايا (حمض الأرض، الماء، المائدة، العقل الشمسي، الطقس، القمر الصناعي، الأمراض) ويعطيك خطة عمل مؤرخة.', d_agent: 'وكيل بأدوات: نموذج لغوي يستدعي الأدوات (Claude، Groq، Ollama) أو مخطط دون اتصال؛ كل إجراء مربوط بالقياس الذي يبرره.', d_ndvi: 'مؤشر NDVI من Sentinel-2 (10 م) للقطعة على 12 شهراً، دون سحب، مع الاتجاه والتراجع الأخير.', m_ndvi: 'NDVI بالقمر الصناعي',
      m_lab: 'مختبر الذكاء', m_lab_p: 'مساعد يعرف قطعتك ويستشهد ببطاقاته، ويقول متى تنقص الأدلة.',
      m_health: 'صحة النبات', m_health_p: 'صورة ورقة، فحص للجودة، ثم تشخيص — أو «لست متأكدة».',
      m_nexus: 'الماء والطاقة', m_nexus_p: 'حاجة الماء حسب FAO-56، طاقة الضخ، الحقل الشمسي، والحصة الشهرية للماء.',
      m_farm: 'لوحة المتابعة', m_farm_p: 'الماء المضخوخ مقابل الحصة، الطاقة الشمسية، التوفير، التنبيهات والري المنصوح به لسبعة أيام.',
      m_agv: 'الزراعة الضوئية', m_agv_p: 'ارتفاع الألواح وتباعدها واتجاهها: الكهرباء والضوء المتبقي للزراعة.',
      m_market: 'بيع محصولي', m_market_p: 'السوق، الجملة، المعصرة، التصدير، مع التيكاي والبيع الجماعي JA ومحطات الطريق اليابانية.',
      m_biz: 'النموذج الاقتصادي', m_biz_p: 'منظومة ضخ شمسية بالدفع حسب الاستعمال عبر الهاتف، مضخة مشتركة في تعاضدية، وأربعة اختبارات للتبنّي.',
      m_season: 'موسمي', m_season_p: 'أعمال الشهر لزراعتك، تنبيهات الجفاف والمطر والحرارة والصقيع من التوقعات الحقيقية، والماء المستعمل مقارنة بالحصة.',
      m_cal: 'الرزنامة الفلاحية', m_cal_p: 'الزيتون ونخيل التمر والقوارص والحبوب: مراحل السنة مع أمطار قطعتك وحاجتها للماء.',
      m_soil: 'تربتي', m_soil_p: 'اختبارات الإناء والخل والحفرة: القوام والكلس والتسرّب، تُحفظ في ملفك.',
      m_mott: 'موتايناي', m_mott_p: 'أغصان التقليم والفيتورة والمرجين والجريد والتبن: الحياة الثانية لكل بقايا، مع الاحتياطات.',
      st_data: 'بيانات حقيقية', st_declared: 'إدخال الفلاح', st_rules2: 'قواعد موثقة',
      d_season: 'توقعات Open-Meteo مباشرة وقراءات عداد يُدخلها الفلاح؛ لا قيمة محاكاة.',
      d_cal: 'مراحل موثقة عند وجود مصدر، وإلا مؤشَّر عليها «للتثبت»؛ مناخ القطعة (ERA5).',
      d_soil: 'مثلث القوام USDA، الجدول 19 من FAO-56؛ تُحفظ البيانات كمصرّح بها.',
      d_mott: 'بطاقات بقايا بمصادرها؛ لا كميات مختلقة.',
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
      d_land: 'استعلام مباشر من Open-Meteo وCopernicus DEM (عبر Open-Meteo) وNASA POWER. التربة: SoilGrids 2.0 بدقة 250 م (الواجهة تعمل من جديد)، وإلا شبكة احتياطية. الماء المستعمل فعلاً: FAO WaPOR (قمر صناعي، 100 م).',
      d_engine: 'قواعد صريحة على 11 بطاقة موثقة، كلها مسودات إلى أن يصادق عليها مهندس فلاحي.',
      d_lab: 'نموذج لغوي حقيقي: مجاني داخل المتصفح (Qwen2.5) أو Ollama أو Groq أو Hugging Face أو Claude؛ يعتمد على البطاقات والملف مع التحقق من الأرقام.',
      d_health: 'نماذج مدرَّبة (EfficientNet-B0 و Pl@ntNet MobileNetV4، دون اتصال) في المتصفح: النوع ثم النبتة ثم المرض للزيتون والنخيل والقوارص والعنب والطماطم والبطاطا والفلفل؛ يمتنع عن الإجابة عندما لا يكون متأكداً.',
      d_biz: 'أقساط محسوبة من الغازوال الموفَّر؛ دون أسعار مخترعة.',
      d_nexus: 'حساب FAO-56 وطاقة الضخ على البيانات المناخية للقطعة.',
      d_agv: 'نموذج فيزيائي مبسط في المتصفح؛ نسخة pvlib على الخادم.',
      d_kaizen: 'تُحفظ التصحيحات على الجهاز ويمكن تصديرها؛ مراجعة الخبراء لم تُنظَّم بعد.',
      d_kizuna: 'تعلّم موزّع بين المزارع: رؤية غير مبرمجة.'
    },
    en: {
      hero_h: 'Every piece of land has a story. GAIA helps you understand it.',
      hero_p: 'Linking Japanese innovation and Tunisian farming heritage through smart, sustainable, evidence-based decisions.',
      cta_1: 'Discover GAIA: choose my plot', cta_2: 'Explore the modules',
      hero_principle: 'GAIA does not impose technology on the land. GAIA adapts technology to the land.',
      map_hint: 'Click the map to build the profile of that place', map_aria: 'Map of Tunisia: click to choose a plot',
      dna_t: 'GAIA LAND DNA', dna_p: 'Each plot gets an identity: climate, relief, sun, soil, water and crop, every value with its source, resolution and confidence. What is missing is shown, never invented.',
      dna_yours: 'Your plot', dna_example: 'Profile structure (no plot chosen)', dna_open: 'Open the full profile', dna_build: 'Build my first profile',
      f_rain: 'Annual rainfall', f_slope: 'Slope', f_ghi: 'Solar radiation', f_soil: 'Soil', f_water: 'Water source', f_crop: 'Crop',
      src_rain: 'Open-Meteo · ERA5', src_slope: 'Copernicus DEM', src_ghi: 'NASA POWER', src_soil: 'SoilGrids (local rasters)', src_water: 'Farmer', src_crop: 'Farmer',
      mods_t: 'The intelligence modules', mods_p: 'Every module reads the same plot profile. Their real state is shown: working, simulation or not connected.',
      m_land: 'Land Intelligence', m_land_p: 'Map of Tunisia, plot selection, and a profile built live from open data.',
      m_engine: 'Compatibility', m_engine_p: 'Each practice tested on six dimensions: feasible, feasible with adaptation, or not recommended, with the reasons.',
      m_agent: 'Farm Agent', m_agent_p: 'Give it a goal: the agent calls GAIA’s tools (Land DNA, water, aquifer, Solar Brain, weather, satellite, diseases) and returns a dated action plan.', d_agent: 'Tool-using agent: a language model with tool calling (Claude, Groq, Ollama) or an offline planner; every action is linked to the measurement behind it.', d_ndvi: 'Sentinel-2 NDVI (10 m) of the plot over 12 months, cloud-masked, with trend and recent drop.', m_ndvi: 'Satellite NDVI',
      m_lab: 'AI Lab', m_lab_p: 'An assistant that knows your plot and cites its records. It says when the evidence is missing.',
      m_health: 'Plant health', m_health_p: 'A photo of a leaf, a quality check, then a diagnosis — or “I am not sure”.',
      m_nexus: 'Water & energy', m_nexus_p: 'FAO-56 water need, pumping energy, solar array and a monthly water quota.',
      m_farm: 'Dashboard', m_farm_p: 'Water pumped against the quota, solar energy, savings, alerts and advised irrigation for 7 days.',
      m_agv: 'Agrivoltaics', m_agv_p: 'Panel height, spacing and orientation: electricity and the light left for the crop.',
      m_market: 'Sell my crop', m_market_p: 'Souk, wholesale, mill, export, with Teikei, JA pooled selling and Japanese roadside stations.',
      m_biz: 'Business model', m_biz_p: 'Pay-as-you-go solar pumping kit paid by mobile money, a pump shared in a cooperative, four adoption tests.',
      m_season: 'My season', m_season_p: 'This month’s actions for your crop, drought, rain, heat and frost alerts from real forecasts, and water used against the quota.',
      m_cal: 'Crop calendar', m_cal_p: 'Olive, date palm, citrus, cereals: the stages of the year set against your parcel’s rain and water need.',
      m_soil: 'My soil', m_soil_p: 'Jar, vinegar and water-hole tests: texture, lime and infiltration, saved to your profile.',
      m_mott: 'Mottainai', m_mott_p: 'Pruning wood, pomace, mill wastewater, fronds, straw: the second life of each residue, with the cautions.',
      st_data: 'Real data', st_declared: 'Farmer input', st_rules2: 'Sourced rules',
      d_season: 'Live Open-Meteo forecasts and meter readings you enter; no simulated values.',
      d_cal: 'Sourced stages where a source exists, otherwise marked “to check”; parcel climate (ERA5).',
      d_soil: 'USDA texture triangle, FAO-56 table 19; data saved as declared.',
      d_mott: 'Residue sheets with sources; no invented quantities.',
      m_lib: 'Library', m_lib_p: 'The sourced technical records that feed the engine and the assistant.',
      open: 'Open →',
      st_live: 'Working', st_sim: 'Simulation', st_rules: 'Rules mode', st_partial: 'Partial', st_off: 'Model not connected', st_concept: 'Concept',
      bridge_t: 'Japan × Tunisia, without copying', bridge_p: 'GAIA never assumes a Japanese method works everywhere. It keeps what transfers and says what does not.',
      b_jp: 'Japan · Okuizumo', b_jp_h: 'Flooded terraced rice fields', b_jp_p: 'Flat steps, gravity canals, a customary watering order.',
      b_tn: 'Tunisia · Medenine', b_tn_h: 'Jessour on an arid slope', b_tn_p: 'Earth dams that trap the runoff of a few storms a year.',
      b_out: 'What GAIA proposes', b_out_h: 'Dry terrace with an overflow sill', b_out_p: 'Keep the geometry, drop the flooding: impossible with so little rain.',
      con_t: 'Five Japanese ideas, five concrete functions',
      kaizen: 'Kaizen — continuous improvement', kaizen_p: 'Farmers’ corrections, reviewed by an expert, improve the models.',
      satoyama: 'Satoyama — landscapes in harmony', satoyama_p: 'The plot seen as layers that support each other; the image read with its context.',
      mottainai: 'Mottainai — waste nothing', mottainai_p: 'Pruning residues as mulch; not one drop pumped beyond the need.',
      kizuna: 'Kizuna — the bond', kizuna_p: 'A future network where Tunisian and Japanese farms learn together without sharing their data.',
      wabisabi: 'Wabi-sabi — accepting imperfection', wabisabi_p: 'Calibrated confidence, and the right to say “I am not sure”.',
      see: 'See it in GAIA →', future: 'Future',
      status_t: 'What works today', status_p: 'GAIA always separates what is built from what is planned.',
      th_feat: 'Feature', th_state: 'State', th_detail: 'Detail',
      d_land: 'Open-Meteo, Copernicus DEM (via Open-Meteo) and NASA POWER queried live. Soil: SoilGrids 2.0 at 250 m (API back online), else a fallback grid. Water actually used: FAO WaPOR (satellite, 100 m).',
      d_engine: 'Explicit rules on 11 sourced records, all drafts until an agronomist validates them.',
      d_lab: 'A real language model: free in the browser (Qwen2.5), Ollama, Groq, Hugging Face or Claude; grounded in the records and the profile, figures checked.',
      d_health: 'Trained models (EfficientNet-B0 + Pl@ntNet MobileNetV4, offline) in the browser: species, plant, then disease, for olive, date palm, citrus, grape, tomato, potato and pepper; it abstains when unsure.',
      d_biz: 'Instalments computed from the diesel saved; no invented prices.',
      d_nexus: 'FAO-56 calculation and pumping energy on the plot’s climate data.',
      d_agv: 'Simplified physical model in the browser; pvlib version on the server.',
      d_kaizen: 'Corrections saved on the device and exportable; expert review still to organise.',
      d_kizuna: 'Federated learning between farms: a vision, not scheduled.'
    },
    ja: {
      hero_h: 'すべての土地には物語がある。GAIAはそれを読み解く手助けをします。',
      hero_p: '日本のイノベーションとチュニジアの農業遺産を、賢く持続可能で根拠に基づく判断で結びます。',
      cta_1: 'GAIAを体験：区画を選ぶ', cta_2: 'モジュールを見る',
      hero_principle: 'GAIAは技術を土地に押しつけません。技術を土地に合わせます。',
      map_hint: '地図をクリックすると、その場所のプロファイルを作成します', map_aria: 'チュニジアの地図：クリックして区画を選ぶ',
      dna_t: 'GAIA LAND DNA', dna_p: '区画ごとに「個性」を持たせます。気候・起伏・日射・土壌・水・作物。すべての値に出典・解像度・信頼度を付け、欠けている情報は作らずにそのまま示します。',
      dna_yours: 'あなたの区画', dna_example: 'プロファイルの構成（区画未選択）', dna_open: 'プロファイル全体を開く', dna_build: '最初のプロファイルを作る',
      f_rain: '年間降水量', f_slope: '傾斜', f_ghi: '日射量', f_soil: '土壌', f_water: '水源', f_crop: '作物',
      src_rain: 'Open-Meteo · ERA5', src_slope: 'Copernicus DEM', src_ghi: 'NASA POWER', src_soil: 'SoilGrids（ローカルラスター）', src_water: '農家', src_crop: '農家',
      mods_t: 'インテリジェンス・モジュール', mods_p: 'すべてのモジュールが同じ区画プロファイルを読み込みます。稼働中・シミュレーション・未接続など、実際の状態を表示します。',
      m_land: 'ランド・インテリジェンス', m_land_p: 'チュニジアの地図で区画を選び、オープンデータからリアルタイムでプロファイルを作成。',
      m_engine: '適合性', m_engine_p: '各技術を6つの観点で検証：実施可能、調整すれば実施可能、推奨しない。理由も示します。',
      m_agent: '農場エージェント', m_agent_p: '目標を伝えると、エージェントがGAIAのツール（ランドDNA、水、地下水、ソーラーブレイン、天気、衛星、病害）を呼び出し、日付つきの行動計画を返します。', d_agent: 'ツールを使うエージェント：ツール呼び出し対応の言語モデル（Claude、Groq、Ollama）またはオフラインのプランナー。各行動は根拠となる測定に結びつく。', d_ndvi: '区画のSentinel-2 NDVI（10 m）を12か月分、雲をマスクし、傾向と最近の低下を表示。', m_ndvi: '衛星NDVI',
      m_lab: 'AIラボ', m_lab_p: '区画を理解し、記録を引用するアシスタント。根拠がないときはそう伝えます。',
      m_health: '植物の健康', m_health_p: '葉の写真を撮り、画質を確認してから診断。または「確信がありません」と答えます。',
      m_nexus: '水とエネルギー', m_nexus_p: 'FAO-56による必要水量、揚水エネルギー、太陽光アレイ、月ごとの水の割当量。',
      m_farm: 'ダッシュボード', m_farm_p: '割当量に対する揚水量、太陽光エネルギー、節約額、アラート、7日間の推奨灌漑。',
      m_agv: '営農型太陽光', m_agv_p: 'パネルの高さ・間隔・向きから、発電量と作物に届く光を計算。',
      m_market: '作物を売る', m_market_p: 'スーク、卸売、搾油所、輸出に、提携・JAの共同販売・日本の道の駅を組み合わせて。',
      m_biz: 'ビジネスモデル', m_biz_p: 'モバイル決済で使った分だけ払う太陽光揚水キット、協同組合で共有するポンプ、4つの導入テスト。',
      m_season: 'わたしの季節', m_season_p: '作物の今月の作業、実際の予報にもとづく干ばつ・雨・暑さ・霜のアラート、割当量に対する使用水量。',
      m_cal: '作物暦', m_cal_p: 'オリーブ、ナツメヤシ、柑橘、穀物：一年の段階を、あなたの区画の雨と必要水量に重ねて。',
      m_soil: 'わたしの土', m_soil_p: '瓶・酢・水穴のテストで、土性、石灰分、浸透をプロファイルに保存。',
      m_mott: 'もったいない', m_mott_p: '剪定枝、搾りかす、搾油廃水、ヤシの葉、わら：それぞれの残さの第二の生き方と注意点。',
      st_data: '実データ', st_declared: '農家の入力', st_rules2: '出典つきのルール',
      d_season: 'Open-Meteoのリアルタイム予報と、入力されたメーター記録。シミュレーション値はありません。',
      d_cal: '出典がある段階は出典つき、ない段階は「要確認」と表示。区画の気候（ERA5）。',
      d_soil: 'USDAの土性三角図、FAO-56 表19。データは申告値として保存。',
      d_mott: '出典つきの残さシート。量はでっち上げません。',
      m_lib: 'ライブラリ', m_lib_p: 'エンジンとアシスタントを支える、出典付きの技術記録。',
      open: '開く →',
      st_live: '稼働中', st_sim: 'シミュレーション', st_rules: 'ルールモード', st_partial: '一部', st_off: 'モデル未接続', st_concept: '構想',
      bridge_t: '日本 × チュニジア、コピーではなく', bridge_p: 'GAIAは日本の手法がどこでも通用するとは考えません。移せるものは残し、合わないものは合わないと伝えます。',
      b_jp: '日本 · 奥出雲', b_jp_h: '水を張った棚田', b_jp_p: '平らな段、重力式の水路、慣習的な配水の順番。',
      b_tn: 'チュニジア · メドニン', b_tn_h: '乾燥した斜面のジェスール', b_tn_p: '年に数回の嵐の流出水をせき止める土の堤。',
      b_out: 'GAIAの提案', b_out_h: '越流堰を備えた乾式テラス', b_out_p: '形は生かし、湛水はやめる。これほど雨が少ないと湛水は不可能です。',
      con_t: '5つの日本の考え方、5つの具体的な機能',
      kaizen: 'カイゼン — 継続的改善', kaizen_p: '農家の修正を専門家が確認し、モデルを改善します。',
      satoyama: '里山 — 調和する風景', satoyama_p: '区画を支え合う層として捉え、画像も文脈とともに読み取ります。',
      mottainai: 'もったいない — 無駄にしない', mottainai_p: '剪定くずをマルチに。必要以上の水は一滴も汲み上げません。',
      kizuna: '絆 — つながり', kizuna_p: 'チュニジアと日本の農場が、データを共有せずに共に学ぶ未来のネットワーク。',
      wabisabi: '侘寂 — 不完全を受け入れる', wabisabi_p: '調整された信頼度と、「確信がありません」と言う権利。',
      see: 'GAIAで見る →', future: '将来',
      status_t: '現在動いているもの', status_p: 'GAIAは、できているものと予定のものを常に区別します。',
      th_feat: '機能', th_state: '状態', th_detail: '詳細',
      d_land: 'Open-Meteo、Copernicus DEM（Open-Meteo経由）、NASA POWERにリアルタイムで問い合わせ。土壌：SoilGrids 2.0（250 m、APIは再稼働）、なければ予備グリッド。実際の水使用量：FAO WaPOR（衛星、100 m）。',
      d_engine: '出典付きの11件の記録に明示的なルールを適用。農業技術者が検証するまではすべて下書き。',
      d_lab: '実際の言語モデル：ブラウザ内の無料モデル（Qwen2.5）、Ollama、Groq、Hugging Face、またはClaude。記録とプロファイルに基づき、数値を検証。',
      d_health: 'ブラウザ内の学習済みモデル（EfficientNet-B0＋Pl@ntNet MobileNetV4、オフライン）：種の同定に加え、オリーブ、ナツメヤシ、柑橘、ブドウ、トマト、ジャガイモ、ピーマンの植物と病気を判定。確信がないときは回答を控えます。',
      d_biz: '節約できた軽油代から月々の支払いを計算。価格は作りません。',
      d_nexus: '区画の気候データでFAO-56と揚水エネルギーを計算。',
      d_agv: 'ブラウザ上の簡易物理モデル。サーバー側にpvlib版。',
      d_kaizen: '修正は端末に保存され、エクスポート可能。専門家による確認体制はこれから。',
      d_kizuna: '農場間の連合学習：構想段階で、予定は未定。'
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
    box.appendChild(el('nav', { class: 'regions', 'aria-label': t('regions') }, CITIES.map(function (c) {
      return el('a', { href: 'land.html?lat=' + c[1] + '&lon=' + c[2] }, [c[0]]);
    })));
  }

  /* ---------------------------------------------------------- sections */
  function dnaPreview() {
    var p = G.getParcel(), dna = p && p.dna;
    var rows = [
      ['f_rain', 'climate.rain_mm', t('u_mm_yr'), 0, 'src_rain'], ['f_slope', 'terrain.slope_pct', '%', 1, 'src_slope'], ['f_ghi', 'solar.ghi_kwh', t('u_kwh_day'), 2, 'src_ghi'],
      ['f_soil', 'soil.texture', '', 0, 'src_soil'], ['f_water', 'water.source', '', 0, 'src_water'], ['f_crop', 'crop', '', 0, 'src_crop']
    ];
    var card = el('div', { class: 'gp-card' }, [
      el('p', { class: 'eyebrow' }, [dna ? t('dna_yours') + ' · ' + (p.name || fmt(p.lat, 3) + ', ' + fmt(p.lon, 3)) : t('dna_example')])
    ]);
    rows.forEach(function (r) {
      var f = dna ? D.fieldAt(dna, r[1]) : null, ok = f && f.status === 'ok';
      var v = ok ? (typeof f.value === 'number' ? fmt(f.value, r[3]) + (r[2] ? ' ' + r[2] : '') : (Array.isArray(f.value) ? f.value.join(', ') : G.valueText(f.value))) : '—';
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
    ['agent.html', 'm_agent', 'm_agent_p', 'live', 'st_live', '策'], ['lab.html', 'm_lab', 'm_lab_p', 'live', 'st_live', '知'], ['health.html', 'm_health', 'm_health_p', 'live', 'st_live', '葉'],
    ['nexus.html', 'm_nexus', 'm_nexus_p', 'live', 'st_live', '水'], ['agrivoltaic.html', 'm_agv', 'm_agv_p', 'demo', 'st_sim', '陽'],
    ['farm.html', 'm_farm', 'm_farm_p', 'live', 'st_data', '測'],
    ['market.html', 'm_market', 'm_market_p', 'live', 'st_live', '旬'],
    ['business.html', 'm_biz', 'm_biz_p', 'live', 'st_live', '結'],
    ['library.html', 'm_lib', 'm_lib_p', 'live', 'st_live', '書']
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
    var C = [['改善', 'kaizen', 'health.html'], ['里山', 'satoyama', 'engine.html'], ['もったいない', 'mottainai', null], ['絆', 'kizuna', null], ['侘寂', 'wabisabi', 'health.html']];
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
    var R = [['m_land', 'live', 'st_live', 'd_land'], ['m_engine', 'live', 'st_live', 'd_engine'], ['m_agent', 'live', 'st_live', 'd_agent'], ['m_lab', 'live', 'st_live', 'd_lab'], ['m_ndvi', 'live', 'st_live', 'd_ndvi'], ['m_health', 'live', 'st_live', 'd_health'],
      ['m_nexus', 'live', 'st_live', 'd_nexus'], ['m_biz', 'live', 'st_live', 'd_biz'], ['m_agv', 'demo', 'st_sim', 'd_agv'], ['m_season', 'live', 'st_data', 'd_season'], ['m_cal', 'live', 'st_rules2', 'd_cal'], ['m_soil', 'live', 'st_declared', 'd_soil'], ['m_mott', 'live', 'st_rules2', 'd_mott'], ['kaizen', 'demo', 'st_partial', 'd_kaizen'], ['kizuna', 'plan', 'st_concept', 'd_kizuna']];
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

  /* ---------------------------------------------------------- start here: three steps in plain words */
  G.addStrings({
    fr: { sh_title: 'Commencer en 3 étapes', sh_lead: 'Pas besoin de tout connaître. Suivez les étapes dans l\'ordre.', sh_listen: 'Écouter',
      s1_t: 'Choisir ma terre', s1_p: 'Touchez la carte ou tapez le nom de votre village.',
      s2_t: 'Voir ce qui marche chez moi', s2_p: 'GAIA dit oui, à adapter ou non pour chaque technique, et pourquoi.',
      s3_t: 'Savoir combien arroser', s3_p: 'L\'eau qu\'il faut et la pompe solaire qui suffit, sans vider la nappe.',
      sh_done: 'Fait', sh_go: 'Commencer', sh_next: 'Continuer', sh_help: 'Besoin d\'aide tout de suite ?',
      h_leaf: 'Une plante malade : prendre une photo', h_ask: 'Poser une question', h_sell: 'Vendre ma récolte', h_access: 'Texte plus grand, lecture à voix haute' },
    ar: { sh_title: 'ابدأ في 3 خطوات', sh_lead: 'لا حاجة لمعرفة كل شيء. اتبع الخطوات بالترتيب.', sh_listen: 'استمع',
      s1_t: 'اختر أرضك', s1_p: 'المس الخريطة أو اكتب اسم قريتك.',
      s2_t: 'اعرف ما ينجح في أرضك', s2_p: 'يقول غايا لكل تقنية: نعم، أو تحتاج تعديلًا، أو لا، ولماذا.',
      s3_t: 'اعرف كم تسقي', s3_p: 'الماء اللازم والمضخة الشمسية الكافية، دون استنزاف المائدة المائية.',
      sh_done: 'تمّ', sh_go: 'ابدأ', sh_next: 'تابع', sh_help: 'تحتاج مساعدة الآن؟',
      h_leaf: 'نبتة مريضة: التقط صورة', h_ask: 'اطرح سؤالًا', h_sell: 'بِع محصولك', h_access: 'كتابة أكبر وقراءة بصوت عالٍ' },
    en: { sh_title: 'Start in 3 steps', sh_lead: 'You do not need to know everything. Follow the steps in order.', sh_listen: 'Listen',
      s1_t: 'Choose my land', s1_p: 'Tap the map or type the name of your village.',
      s2_t: 'See what works on my land', s2_p: 'GAIA says yes, adapt or no for each method, and why.',
      s3_t: 'Know how much to water', s3_p: 'The water you need and a solar pump that is enough, without draining the groundwater.',
      sh_done: 'Done', sh_go: 'Start', sh_next: 'Continue', sh_help: 'Need help right now?',
      h_leaf: 'A sick plant: take a photo', h_ask: 'Ask a question', h_sell: 'Sell my crop', h_access: 'Bigger text, read aloud' },
    ja: { sh_title: '3つのステップで始める', sh_lead: 'すべてを知る必要はありません。順番に進めてください。', sh_listen: '聞く',
      s1_t: '土地を選ぶ', s1_p: '地図をタップするか、村の名前を入力します。',
      s2_t: '自分の土地に合うものを見る', s2_p: '各方法について「可・要調整・不可」とその理由を示します。',
      s3_t: '水やりの量を知る', s3_p: '必要な水と十分なソーラーポンプ。地下水を使い過ぎません。',
      sh_done: '完了', sh_go: '始める', sh_next: '次へ', sh_help: 'すぐに助けが必要ですか？',
      h_leaf: '植物の病気：写真を撮る', h_ask: '質問する', h_sell: '作物を売る', h_access: '大きい文字・読み上げ' }
  });
  function startHere() {
    var p = G.getParcel(), has = !!(p && p.lat !== undefined);
    var steps = [['pin', 'land.html', 's1'], ['ok', 'engine.html', 's2'], ['drop', 'nexus.html', 's3']];
    var nextIdx = has ? 1 : 0;
    var sec = el('section', { class: 'sec start', 'aria-labelledby': 'h-start' });
    var head = el('div', { class: 'start-hd' }, [
      el('div', null, [el('h2', { id: 'h-start' }, [t('sh_title')]), el('p', { class: 'lead' }, [t('sh_lead')])])
    ]);
    if (window.speechSynthesis) head.appendChild(el('button', { type: 'button', class: 'gp-btn ghost start-listen', onclick: function () {
      if (window.GAIA_A11Y) window.GAIA_A11Y.speak(sec);
    } }, [svgSpeaker(), t('sh_listen')]));
    sec.appendChild(head);
    sec.appendChild(el('ol', { class: 'steps' }, steps.map(function (s, i) {
      var done = i === 0 && has, next = i === nextIdx;
      return el('li', { class: 'step' + (done ? ' done' : '') + (next ? ' next' : '') }, [
        el('a', { href: s[1], 'aria-describedby': 'st-' + i }, [
          el('span', { class: 'num', 'aria-hidden': 'true' }, [String(i + 1)]),
          el('span', { class: 'ic' }, [G.icon(done ? 'ok' : s[0], 30)]),
          el('span', { class: 'tx' }, [
            el('b', null, [el('span', { class: 'sr' }, [(i + 1) + '. ']), t(s[2] + '_t')]),
            el('small', { id: 'st-' + i }, [t(s[2] + '_p')])
          ]),
          el('span', { class: 'go' }, [done ? t('sh_done') : (next ? (i ? t('sh_next') : t('sh_go')) : '')])
        ])
      ]);
    })));
    var quick = [['leaf', 'health.html', 'h_leaf'], ['chat', 'lab.html', 'h_ask'], ['cash', 'market.html', 'h_sell']];
    sec.appendChild(el('div', { class: 'quick' }, [el('h3', null, [t('sh_help')]), el('ul', { role: 'list' }, quick.map(function (q) {
      return el('li', null, [el('a', { href: q[1] }, [G.icon(q[0], 22), t(q[2])])]);
    }).concat([el('li', null, [el('button', { type: 'button', onclick: function () { if (window.GAIA_A11Y) window.GAIA_A11Y.open(); } }, [svgAccess(), t('h_access')])])]))]));
    return sec;
  }
  function svgSpeaker() { var n = G.icon('info', 22); n.innerHTML = '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'; return n; }
  function svgAccess() { var n = G.icon('info', 22); n.innerHTML = '<circle cx="12" cy="4.5" r="2"/><path d="M4 8.5l8 1.5 8-1.5M12 10v4.5M8.5 21l3.5-6.5 3.5 6.5"/>'; return n; }

  function render() {
    drawMap();
    var box = G.clear(document.getElementById('sections'));
    [startHere(), dnaPreview(), modules(), bridge(), concepts(), status()].forEach(function (n) { box.appendChild(n); });
  }
  render();
  G.onLang(render);
}());
