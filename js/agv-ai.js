/* GAIA Solar Brain — the AI block of the agrivoltaic page. Logic in agv-ai-core.js. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, A = window.GAIA_AGV_AI;

  G.addStrings({
    fr: {
      ai_eyebrow: 'GAIA SOLAR BRAIN · IA', ai_t: 'L’IA qui partage le soleil entre la culture et les panneaux',
      ai_lead: 'Trois intelligences tournent dans votre navigateur, sans clé API : un algorithme génétique qui cherche la meilleure installation, un pilote qui oriente les panneaux heure par heure selon la météo, et un classement des cultures qui profitent de l’ombre.',
      ai_badge: 'IA embarquée · fonctionne hors ligne', ai_crop: 'Culture sous les panneaux',
      ai_jp: 'Règle japonaise de la ソーラーシェアリング : la culture garde au moins 80 % de son rendement',
      ai_jp_h: 'Au Japon, depuis 2013, le ministère de l’Agriculture (MAFF) n’autorise un champ solaire sur une terre agricole que si la récolte reste à au moins 80 % de la normale locale. GAIA applique la même règle en Tunisie.',
      tab_opt: '① Optimiseur génétique', tab_pilot: '② Pilote météo 7 jours', tab_rank: '③ Quelles cultures sous l’ombre ?',
      c_lettuce_s: 'Laitue d’été', c_pepper: 'Piment', c_tomato: 'Tomate', c_strawb: 'Fraise', c_potato: 'Pomme de terre de saison', c_alfalfa: 'Luzerne', c_wheat: 'Blé dur',
      cls_tol: 'tolère l’ombre', cls_mod: 'modérée', cls_sens: 'sensible à l’ombre',
      o_goal: 'Objectif', g_ler: 'Terre la plus productive (LER)', g_energy: 'Maximum d’électricité', g_crop: 'Culture et eau d’abord',
      o_run: 'Lancer l’optimisation', o_again: 'Relancer', o_gen: 'Génération {g} / {n} · {e} installations testées',
      o_x: 'Rendement de la culture (% de la normale)', o_y: 'Électricité (MWh/an)', o_rule: 'seuil 80 %',
      o_lg_ok: 'respecte la règle des 80 %', o_lg_no: 'ne la respecte pas', o_lg_front: 'front de Pareto', o_lg_you: 'votre réglage', o_lg_best: 'choix de l’IA',
      o_res_t: 'Proposition de l’IA', o_apply: 'Appliquer cette installation', o_applied: 'Installation appliquée : les curseurs, les graphiques et la coupe sont à jour.',
      o_k_e: 'Électricité', o_k_y: 'Rendement culture', o_k_ler: 'LER (terre équivalente)', o_k_w: 'Eau économisée', o_vs: 'vs votre réglage',
      o_why: 'Pourquoi ce choix',
      o_why_p: 'Rangées tous les {p} m, panneaux de {w} m inclinés à {ti}° orientés {az}. Sur 1 ha, cette installation produit autant que {ler} ha séparés (culture seule + centrale seule). {jp}',
      o_why_jp_ok: 'La culture garde {y} % de son rendement : la règle japonaise est respectée.',
      o_why_jp_no: 'Attention : la culture tombe à {y} % : la règle japonaise n’est pas respectée.',
      o_idle: 'Choisissez une culture et un objectif, puis lancez : l’IA fait évoluer une population de 36 installations pendant 28 générations (sélection, croisement, mutation) et garde la meilleure.',
      p_src: 'Météo', p_live: 'Prévision réelle 7 jours', p_typ: 'Semaine type de juillet', p_heat: 'Canicule +6 °C',
      p_alpha: 'Priorité', p_alpha_c: 'culture', p_alpha_e: 'électricité',
      p_loading: 'Lecture de la prévision Open-Meteo…', p_fail: 'Prévision indisponible (hors ligne ?) : GAIA utilise une semaine type simulée à partir du climat de votre parcelle.',
      p_src_live: 'Prévision horaire Open-Meteo (température, rayonnement direct et diffus, ET0).', p_src_typ: 'Semaine simulée à partir des moyennes mensuelles de votre parcelle.', p_src_heat: 'Scénario simulé : semaine type de juillet avec une vague de chaleur de +6 °C.',
      p_axis: 'Axe nord–sud, rotation ±55° : mêmes rangées ({w} m tous les {p} m) que votre configuration.',
      s_fixed: 'Panneaux fixes (votre réglage)', s_sun: 'Suivi du soleil classique', s_gaia: 'Pilote IA GAIA',
      p_h_kwh: 'Électricité', p_h_light: 'Lumière utile à la culture', p_h_heat: 'Chaleur de midi évitée', p_h_water: 'Eau économisée',
      m_energy: 'Suivi du soleil', m_light: 'Lumière pour la culture', m_shield: 'Bouclier chaleur', m_night: 'Nuit',
      p_ch_t: 'Température (°C)', p_ch_a: 'Angle des panneaux', p_ch_tc: 'seuil de chaleur de la culture', p_ch_sun: 'suivi classique', p_ch_gaia: 'pilote GAIA',
      p_log_t: 'Journal du pilote : ce que l’IA a décidé et pourquoi',
      p_log_day: '{d} — max {tx} °C. {parts} {kwh} kWh produits.',
      p_log_sh: 'Bouclier chaleur de {a} h à {b} h (la culture dépasse son seuil de {tc} °C).',
      p_log_li: 'Panneaux ouverts pour la culture {n} h.',
      p_log_en: 'Suivi du soleil {n} h.',
      p_sum: 'Sur 7 jours, le pilote GAIA produit {k} kWh ({dk} par rapport au suivi classique), donne {l} % de la lumière utile d’un champ ouvert à la culture (contre {ls} %), coupe {h} % du rayonnement de midi pendant les heures trop chaudes et réduit l’évaporation de {w} %.',
      p_nohot: 'Aucune heure ne dépasse le seuil de chaleur de la culture cette semaine : essayez le scénario canicule.',
      r_t: 'Classement des cultures pour votre installation actuelle', r_p: 'GAIA simule chaque culture sous vos panneaux, mois par mois : lumière, rafraîchissement l’été, eau. Cliquez une ligne pour la choisir.',
      r_c: 'Culture', r_cls: 'Ombre', r_y: 'Rendement', r_w: 'Eau économisée / an', r_jp: 'Règle 80 %', r_ok: 'oui', r_no: 'non',
      r_star: 'Surprise : à l’ombre des panneaux, une laitue d’été devient possible en Tunisie, alors qu’en plein soleil la chaleur la fait monter en graine.',
      ai_hon: 'Modèles simplifiés et paramètres indicatifs (classes de tolérance à l’ombre d’après Laub et al. 2022 ; Kc FAO-56 à vérifier ; refroidissement sous panneaux et baisse d’évaporation d’après Marrou et al. 2013). Ce sont des estimations à valider sur une parcelle d’essai.',
      play: '▶ Animer la journée', pause: '❚❚ Pause'
    },
    ar: {
      ai_eyebrow: 'GAIA SOLAR BRAIN · ذكاء اصطناعي', ai_t: 'ذكاء يقسم الشمس بين الزراعة والألواح',
      ai_lead: 'ثلاثة أنظمة ذكية تعمل في متصفحك دون مفتاح API: خوارزمية جينية تبحث عن أفضل منشأة، وطيار يوجّه الألواح ساعة بساعة حسب الطقس، وترتيب للزراعات التي تستفيد من الظل.',
      ai_badge: 'ذكاء مدمج · يعمل دون اتصال', ai_crop: 'الزراعة تحت الألواح',
      ai_jp: 'القاعدة اليابانية لـ ソーラーシェアリング: تحتفظ الزراعة بـ 80 % على الأقل من مردودها',
      ai_jp_h: 'في اليابان، ومنذ 2013، لا تسمح وزارة الفلاحة (MAFF) بحقل شمسي فوق أرض فلاحية إلا إذا بقي المحصول عند 80 % على الأقل من المعدل المحلي. تطبّق غايا القاعدة نفسها في تونس.',
      tab_opt: '① المحسّن الجيني', tab_pilot: '② طيار الطقس 7 أيام', tab_rank: '③ أي زراعات تحت الظل؟',
      c_lettuce_s: 'خس صيفي', c_pepper: 'فلفل', c_tomato: 'طماطم', c_strawb: 'فراولة', c_potato: 'بطاطا فصلية', c_alfalfa: 'فصّة', c_wheat: 'قمح صلب',
      cls_tol: 'يتحمّل الظل', cls_mod: 'متوسط', cls_sens: 'حساس للظل',
      o_goal: 'الهدف', g_ler: 'أكثر أرض إنتاجاً (LER)', g_energy: 'أقصى كهرباء', g_crop: 'الزراعة والماء أولاً',
      o_run: 'تشغيل التحسين', o_again: 'إعادة التشغيل', o_gen: 'الجيل {g} / {n} · {e} منشأة مجرّبة',
      o_x: 'مردود الزراعة (% من العادي)', o_y: 'الكهرباء (م.و.س/سنة)', o_rule: 'عتبة 80 %',
      o_lg_ok: 'تحترم قاعدة 80 %', o_lg_no: 'لا تحترمها', o_lg_front: 'جبهة باريتو', o_lg_you: 'إعدادك', o_lg_best: 'اختيار الذكاء',
      o_res_t: 'اقتراح الذكاء الاصطناعي', o_apply: 'تطبيق هذه المنشأة', o_applied: 'طُبّقت المنشأة: المؤشرات والرسوم والمقطع محدّثة.',
      o_k_e: 'الكهرباء', o_k_y: 'مردود الزراعة', o_k_ler: 'LER (الأرض المكافئة)', o_k_w: 'الماء المقتصد', o_vs: 'مقارنة بإعدادك',
      o_why: 'لماذا هذا الاختيار',
      o_why_p: 'صفوف كل {p} م، ألواح بعرض {w} م مائلة بـ {ti}° متجهة {az}. على هكتار واحد، تنتج هذه المنشأة ما ينتجه {ln} هكتار منفصلة (زراعة وحدها + محطة وحدها). {jp}',
      o_why_jp_ok: 'تحتفظ الزراعة بـ {y} % من مردودها: القاعدة اليابانية محترمة.',
      o_why_jp_no: 'تنبيه: ينخفض المردود إلى {y} %: القاعدة اليابانية غير محترمة.',
      o_idle: 'اختر زراعة وهدفاً ثم شغّل: يطوّر الذكاء مجموعة من 36 منشأة عبر 28 جيلاً (انتقاء، تهجين، طفرة) ويحتفظ بالأفضل.',
      p_src: 'الطقس', p_live: 'توقعات حقيقية 7 أيام', p_typ: 'أسبوع نموذجي في جويلية', p_heat: 'موجة حر +6 °م',
      p_alpha: 'الأولوية', p_alpha_c: 'الزراعة', p_alpha_e: 'الكهرباء',
      p_loading: 'قراءة توقعات Open-Meteo…', p_fail: 'التوقعات غير متاحة (دون اتصال؟): تستعمل غايا أسبوعاً نموذجياً محاكى من مناخ قطعتك.',
      p_src_live: 'توقعات Open-Meteo بالساعة (الحرارة، الإشعاع المباشر والمنتشر، ET0).', p_src_typ: 'أسبوع محاكى من المعدلات الشهرية لقطعتك.', p_src_heat: 'سيناريو محاكى: أسبوع نموذجي في جويلية مع موجة حر +6 °م.',
      p_axis: 'محور شمال–جنوب، دوران ±55°: نفس الصفوف ({w} م كل {p} م) كما في إعدادك.',
      s_fixed: 'ألواح ثابتة (إعدادك)', s_sun: 'تتبّع الشمس التقليدي', s_gaia: 'طيار غايا الذكي',
      p_h_kwh: 'الكهرباء', p_h_light: 'الضوء المفيد للزراعة', p_h_heat: 'حرارة الظهيرة المتجنّبة', p_h_water: 'الماء المقتصد',
      m_energy: 'تتبّع الشمس', m_light: 'ضوء للزراعة', m_shield: 'درع الحرارة', m_night: 'الليل',
      p_ch_t: 'الحرارة (°م)', p_ch_a: 'زاوية الألواح', p_ch_tc: 'عتبة حرارة الزراعة', p_ch_sun: 'التتبّع التقليدي', p_ch_gaia: 'طيار غايا',
      p_log_t: 'سجل الطيار: ما قرّره الذكاء ولماذا',
      p_log_day: '{d} — أقصى {tx} °م. {parts} {kwh} ك.و.س منتجة.',
      p_log_sh: 'درع الحرارة من {a} إلى {b} (تتجاوز الزراعة عتبتها {tc} °م).',
      p_log_li: 'ألواح مفتوحة للزراعة {n} س.',
      p_log_en: 'تتبّع الشمس {n} س.',
      p_sum: 'خلال 7 أيام، ينتج طيار غايا {k} ك.و.س ({dk} مقارنة بالتتبّع التقليدي)، ويمنح الزراعة {l} % من الضوء المفيد لحقل مكشوف (مقابل {ls} %)، ويقطع {h} % من إشعاع الظهيرة في الساعات الحارة جداً، ويخفض التبخر بـ {w} %.',
      p_nohot: 'لا تتجاوز أي ساعة عتبة حرارة الزراعة هذا الأسبوع: جرّب سيناريو موجة الحر.',
      r_t: 'ترتيب الزراعات لمنشأتك الحالية', r_p: 'تحاكي غايا كل زراعة تحت ألواحك شهراً بشهر: الضوء، التبريد صيفاً، الماء. اضغط على سطر لاختياره.',
      r_c: 'الزراعة', r_cls: 'الظل', r_y: 'المردود', r_w: 'الماء المقتصد / سنة', r_jp: 'قاعدة 80 %', r_ok: 'نعم', r_no: 'لا',
      r_star: 'مفاجأة: تحت ظل الألواح يصبح الخس الصيفي ممكناً في تونس، بينما تجعله الحرارة في الشمس المباشرة يزهر قبل أوانه.',
      ai_hon: 'نماذج مبسطة ومعاملات تقريبية (فئات تحمّل الظل حسب Laub وآخرون 2022؛ Kc من FAO-56 للتحقق؛ التبريد تحت الألواح وانخفاض التبخر حسب Marrou وآخرون 2013). هذه تقديرات يجب التحقق منها في قطعة تجريبية.',
      play: '▶ تحريك اليوم', pause: '❚❚ إيقاف'
    },
    en: {
      ai_eyebrow: 'GAIA SOLAR BRAIN · AI', ai_t: 'The AI that shares the sun between the crop and the panels',
      ai_lead: 'Three intelligences run in your browser, with no API key: a genetic algorithm that searches for the best installation, a pilot that turns the panels hour by hour from the weather forecast, and a ranking of the crops that gain from shade.',
      ai_badge: 'On-device AI · works offline', ai_crop: 'Crop under the panels',
      ai_jp: 'Japanese ソーラーシェアリング rule: the crop keeps at least 80 % of its yield',
      ai_jp_h: 'In Japan, since 2013, the Ministry of Agriculture (MAFF) only allows solar panels over farmland if the harvest stays at 80 % or more of the local normal. GAIA applies the same rule in Tunisia.',
      tab_opt: '① Genetic optimiser', tab_pilot: '② 7-day weather pilot', tab_rank: '③ Which crops under the shade?',
      c_lettuce_s: 'Summer lettuce', c_pepper: 'Chilli pepper', c_tomato: 'Tomato', c_strawb: 'Strawberry', c_potato: 'Spring potato', c_alfalfa: 'Alfalfa', c_wheat: 'Durum wheat',
      cls_tol: 'shade tolerant', cls_mod: 'moderate', cls_sens: 'shade sensitive',
      o_goal: 'Goal', g_ler: 'Most productive land (LER)', g_energy: 'Most electricity', g_crop: 'Crop and water first',
      o_run: 'Run the optimisation', o_again: 'Run again', o_gen: 'Generation {g} / {n} · {e} installations tested',
      o_x: 'Crop yield (% of normal)', o_y: 'Electricity (MWh/yr)', o_rule: '80 % threshold',
      o_lg_ok: 'meets the 80 % rule', o_lg_no: 'does not meet it', o_lg_front: 'Pareto front', o_lg_you: 'your setting', o_lg_best: 'AI choice',
      o_res_t: 'The AI’s proposal', o_apply: 'Apply this installation', o_applied: 'Installation applied: sliders, charts and cross-section are updated.',
      o_k_e: 'Electricity', o_k_y: 'Crop yield', o_k_ler: 'LER (land equivalent)', o_k_w: 'Water saved', o_vs: 'vs your setting',
      o_why: 'Why this choice',
      o_why_p: 'Rows every {p} m, {w} m panels tilted {ti}° facing {az}. On 1 ha, this installation produces as much as {ler} ha kept apart (crop only + solar plant only). {jp}',
      o_why_jp_ok: 'The crop keeps {y} % of its yield: the Japanese rule is met.',
      o_why_jp_no: 'Warning: the crop drops to {y} %: the Japanese rule is not met.',
      o_idle: 'Pick a crop and a goal, then run: the AI evolves a population of 36 installations over 28 generations (selection, crossover, mutation) and keeps the best one.',
      p_src: 'Weather', p_live: 'Real 7-day forecast', p_typ: 'Typical July week', p_heat: 'Heat wave +6 °C',
      p_alpha: 'Priority', p_alpha_c: 'crop', p_alpha_e: 'electricity',
      p_loading: 'Reading the Open-Meteo forecast…', p_fail: 'Forecast unavailable (offline?): GAIA uses a typical week simulated from your plot’s climate.',
      p_src_live: 'Open-Meteo hourly forecast (temperature, direct and diffuse radiation, ET0).', p_src_typ: 'Week simulated from your plot’s monthly averages.', p_src_heat: 'Simulated scenario: typical July week with a +6 °C heat wave.',
      p_axis: 'North–south axis, ±55° rotation: same rows ({w} m every {p} m) as your configuration.',
      s_fixed: 'Fixed panels (your setting)', s_sun: 'Classic sun tracking', s_gaia: 'GAIA AI pilot',
      p_h_kwh: 'Electricity', p_h_light: 'Useful light for the crop', p_h_heat: 'Midday heat avoided', p_h_water: 'Water saved',
      m_energy: 'Sun tracking', m_light: 'Light for the crop', m_shield: 'Heat shield', m_night: 'Night',
      p_ch_t: 'Temperature (°C)', p_ch_a: 'Panel angle', p_ch_tc: 'crop heat threshold', p_ch_sun: 'classic tracking', p_ch_gaia: 'GAIA pilot',
      p_log_t: 'Pilot log: what the AI decided and why',
      p_log_day: '{d} — max {tx} °C. {parts} {kwh} kWh produced.',
      p_log_sh: 'Heat shield from {a}:00 to {b}:00 (the crop is above its {tc} °C threshold).',
      p_log_li: 'Panels opened for the crop {n} h.',
      p_log_en: 'Sun tracking {n} h.',
      p_sum: 'Over 7 days, the GAIA pilot produces {k} kWh ({dk} vs classic tracking), gives the crop {l} % of the useful light of an open field (vs {ls} %), cuts {h} % of the midday radiation during the hottest hours and reduces evaporation by {w} %.',
      p_nohot: 'No hour goes above the crop’s heat threshold this week: try the heat-wave scenario.',
      r_t: 'Crop ranking for your current installation', r_p: 'GAIA simulates each crop under your panels, month by month: light, summer cooling, water. Click a row to choose it.',
      r_c: 'Crop', r_cls: 'Shade', r_y: 'Yield', r_w: 'Water saved / yr', r_jp: '80 % rule', r_ok: 'yes', r_no: 'no',
      r_star: 'Surprise: in the panels’ shade, summer lettuce becomes possible in Tunisia, while in full sun the heat makes it bolt.',
      ai_hon: 'Simplified models and indicative parameters (shade-tolerance classes after Laub et al. 2022; FAO-56 Kc to check; cooling and lower evaporation under panels after Marrou et al. 2013). These are estimates to validate on a trial plot.',
      play: '▶ Animate the day', pause: '❚❚ Pause'
    },
    ja: {
      ai_eyebrow: 'GAIA SOLAR BRAIN · AI', ai_t: '太陽を作物とパネルで分け合うAI',
      ai_lead: 'APIキーなしで、3つのAIがブラウザの中で動きます。最適な設備を探す遺伝的アルゴリズム、天気予報から1時間ごとにパネルの向きを決めるパイロット、そして日陰で得をする作物のランキングです。',
      ai_badge: '端末内AI · オフラインで動作', ai_crop: 'パネルの下の作物',
      ai_jp: '日本のソーラーシェアリングのルール：作物の収量を8割以上に保つ',
      ai_jp_h: '日本では2013年から、農林水産省は地域の平均的な収量の8割以上を保つことを条件に、農地の上の太陽光パネルを認めています。GAIAはチュニジアでも同じルールを使います。',
      tab_opt: '① 遺伝的アルゴリズム', tab_pilot: '② 7日間の天気パイロット', tab_rank: '③ 日陰に向く作物は？',
      c_lettuce_s: '夏レタス', c_pepper: '唐辛子', c_tomato: 'トマト', c_strawb: 'イチゴ', c_potato: '春ジャガイモ', c_alfalfa: 'アルファルファ', c_wheat: 'デュラム小麦',
      cls_tol: '日陰に強い', cls_mod: '中程度', cls_sens: '日陰に弱い',
      o_goal: '目標', g_ler: '土地の生産性を最大に（LER）', g_energy: '発電量を最大に', g_crop: '作物と水を優先',
      o_run: '最適化を実行', o_again: 'もう一度実行', o_gen: '第{g}世代 / {n} · {e}通りの設備を試行',
      o_x: '作物の収量（平年比 %）', o_y: '発電量（MWh/年）', o_rule: '8割ライン',
      o_lg_ok: '8割ルールを満たす', o_lg_no: '満たさない', o_lg_front: 'パレート最適線', o_lg_you: '現在の設定', o_lg_best: 'AIの選択',
      o_res_t: 'AIの提案', o_apply: 'この設備を適用', o_applied: '設備を適用しました。スライダー、グラフ、断面図が更新されています。',
      o_k_e: '発電量', o_k_y: '作物の収量', o_k_ler: 'LER（土地等価比）', o_k_w: '節水量', o_vs: '現在の設定との差',
      o_why: 'この選択の理由',
      o_why_p: '列の間隔{p} m、幅{w} mのパネルを{ti}°傾けて{az}に向けます。1 haで、別々の{ler} ha（作物だけ＋発電所だけ）と同じだけ生産します。{jp}',
      o_why_jp_ok: '作物は収量の{y} %を保ちます。日本のルールを満たしています。',
      o_why_jp_no: '注意：作物の収量が{y} %まで下がり、日本のルールを満たしません。',
      o_idle: '作物と目標を選んで実行してください。AIは36通りの設備を28世代にわたって進化させ（選択・交叉・突然変異）、最良のものを残します。',
      p_src: '天気', p_live: '実際の7日間予報', p_typ: '7月の典型的な週', p_heat: '熱波 +6 °C',
      p_alpha: '優先', p_alpha_c: '作物', p_alpha_e: '発電',
      p_loading: 'Open-Meteoの予報を読み込み中…', p_fail: '予報を取得できません（オフライン？）。区画の気候から作った典型的な週を使います。',
      p_src_live: 'Open-Meteoの1時間ごとの予報（気温、直達・散乱日射、ET0）。', p_src_typ: '区画の月平均から作ったシミュレーションの週。', p_src_heat: 'シミュレーション：7月の典型的な週に+6 °Cの熱波。',
      p_axis: '南北軸、±55°回転。列（幅{w} m、間隔{p} m）は現在の設定と同じです。',
      s_fixed: '固定パネル（現在の設定）', s_sun: '従来の太陽追尾', s_gaia: 'GAIA AIパイロット',
      p_h_kwh: '発電量', p_h_light: '作物が使える光', p_h_heat: '避けた真昼の熱', p_h_water: '節水',
      m_energy: '太陽追尾', m_light: '作物に光を', m_shield: '熱よけ', m_night: '夜',
      p_ch_t: '気温（°C）', p_ch_a: 'パネルの角度', p_ch_tc: '作物の高温の限界', p_ch_sun: '従来の追尾', p_ch_gaia: 'GAIAパイロット',
      p_log_t: 'パイロットの記録：AIが決めたことと理由',
      p_log_day: '{d} — 最高{tx} °C。{parts} 発電{kwh} kWh。',
      p_log_sh: '{a}時〜{b}時は熱よけ（作物の限界{tc} °Cを超えるため）。',
      p_log_li: '作物のためにパネルを開いた時間 {n}時間。',
      p_log_en: '太陽追尾 {n}時間。',
      p_sum: '7日間でGAIAパイロットは{k} kWhを発電し（従来の追尾との差 {dk}）、露地で作物が使える光の{l} %を届け（従来は{ls} %）、暑すぎる時間帯の真昼の日射を{h} %カットし、蒸発を{w} %減らします。',
      p_nohot: '今週は作物の高温の限界を超える時間がありません。熱波のシナリオを試してください。',
      r_t: '現在の設備での作物ランキング', r_p: 'GAIAは各作物をパネルの下で月ごとにシミュレーションします：光、夏の冷却、水。行をクリックすると選べます。',
      r_c: '作物', r_cls: '日陰', r_y: '収量', r_w: '年間の節水量', r_jp: '8割ルール', r_ok: 'はい', r_no: 'いいえ',
      r_star: '発見：パネルの日陰なら、チュニジアでも夏レタスが作れます。直射日光の下では暑さでとう立ちしてしまいます。',
      ai_hon: '簡略化したモデルと目安のパラメータです（日陰への強さの分類はLaubら2022、作物係数はFAO-56で要確認、パネル下の冷却と蒸発の減少はMarrouら2013による）。試験区画で検証すべき推定値です。',
      play: '▶ 一日を再生', pause: '❚❚ 一時停止'
    }
  });

  var NS = 'http://www.w3.org/2000/svg';
  function svg(tag, a, txt) { var n = document.createElementNS(NS, tag); Object.keys(a || {}).forEach(function (k) { n.setAttribute(k, a[k]); }); if (txt !== undefined) n.textContent = txt; return n; }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k] !== undefined ? o[k] : m; }); }
  function pct(x, d) { return fmt(x * 100, d || 0) + ' %'; }
  function signed(x, unit, d) { return (x > 0 ? '+' : x < 0 ? '−' : '±') + fmt(Math.abs(x), d || 0) + (unit ? ' ' + unit : ''); }
  var COL = { energy: '#A88746', light: '#7C9455', shield: '#2F5A75', night: 'transparent' };

  var ctx, root, ST = G.load('gaia.agv.ai', { crop: null, japan: true, goal: 'ler', tab: 'opt', src: 'live', alpha: 0.5 });
  var opt = null, optBest = null, optTimer = null, appliedMsg = false, pilotData = null, weatherCache = {};
  function persist() { G.save('gaia.agv.ai', ST); }
  function cropFromParcel(dna) {
    var v = dna && dna.crop && dna.crop.value; v = v ? String(v).toLowerCase() : '';
    return /tomat/.test(v) ? 'tomato' : /piment|pepper|felfel/.test(v) ? 'pepper' : /bl[eé]|wheat|cereal|céréal/.test(v) ? 'wheat' : /pomme|potato/.test(v) ? 'potato' :
      /fraise|straw/.test(v) ? 'strawb' : /luzerne|alfalfa|fourrage/.test(v) ? 'alfalfa' : /laitue|salade|lettuce|veg|maraîch/.test(v) ? 'lettuce_s' : 'tomato';
  }
  function clim() { var CM = ctx.CM || {}; return { ghi: ctx.ghi, tmax: CM.tmax, tmin: CM.tmin, et0: CM.et0, rain: CM.rain }; }
  function base() { return ctx.geom(); }
  function cur() { var C = ctx.C; return { pitch: C.pitch, width: C.width, tilt: C.tilt, azimuth: C.azimuth }; }
  function azText(a) { return a === 180 ? t('az_s') : fmt(a) + '° (' + (a < 180 ? t('az_e') : t('az_w')) + ')'; }

  /* ---------------------------------------------------------- shell */
  function mount(box, context) {
    ctx = context; root = box;
    if (!ST.crop || !A.CROPS[ST.crop]) ST.crop = cropFromParcel(ctx.dna);
    G.clear(root);
    var cropSel = el('select', { id: 'ai-crop', onchange: function (e) { ST.crop = e.target.value; persist(); resetOpt(); body(); } },
      Object.keys(A.CROPS).map(function (k) { return el('option', { value: k, selected: ST.crop === k }, [t('c_' + k) + ' · ' + t('cls_' + A.CROPS[k].cls)]); }));
    var jp = el('input', { type: 'checkbox', id: 'ai-jp', checked: ST.japan, onchange: function (e) { ST.japan = e.target.checked; persist(); resetOpt(); body(); } });
    var tabs = el('div', { class: 'gp-tabs', role: 'tablist' }, ['opt', 'pilot', 'rank'].map(function (k) {
      return el('button', { type: 'button', role: 'tab', 'aria-selected': ST.tab === k ? 'true' : 'false', onclick: function () { ST.tab = k; persist(); mount(root, ctx); } }, [t('tab_' + k)]);
    }));
    root.appendChild(el('div', { class: 'ai-hero' }, [
      el('p', { class: 'eyebrow' }, [t('ai_eyebrow')]),
      el('h2', null, [t('ai_t')]),
      el('p', { class: 'ai-lead' }, [t('ai_lead')]),
      el('div', { class: 'ai-ctl' }, [
        el('span', { class: 'pill live' }, [t('ai_badge')]),
        el('label', { for: 'ai-crop' }, [t('ai_crop'), cropSel]),
        el('label', { for: 'ai-jp', class: 'ai-jp', title: t('ai_jp_h') }, [jp, el('span', null, [t('ai_jp')])])
      ]),
      el('p', { class: 'small ai-jp-h' }, [t('ai_jp_h')])
    ]));
    root.appendChild(tabs);
    root.appendChild(el('div', { id: 'ai-body' }));
    root.appendChild(el('p', { class: 'small muted', style: 'margin-top:12px' }, [t('ai_hon')]));
    body();
  }
  function body() {
    var b = document.getElementById('ai-body'); if (!b) return;
    G.clear(b);
    if (ST.tab === 'opt') optView(b); else if (ST.tab === 'pilot') pilotView(b); else rankView(b);
  }
  function resetOpt() { if (optTimer) clearTimeout(optTimer); optTimer = null; opt = null; optBest = null; appliedMsg = false; }

  /* ---------------------------------------------------------- ① optimiser */
  var scatterBox, genLine, resBox;
  function optView(b) {
    var goal = el('div', { class: 'ai-seg', role: 'radiogroup', 'aria-label': t('o_goal') }, ['ler', 'energy', 'crop'].map(function (g) {
      return el('button', { type: 'button', role: 'radio', 'aria-checked': ST.goal === g ? 'true' : 'false', onclick: function () { ST.goal = g; persist(); resetOpt(); body(); } }, [t('g_' + g)]);
    }));
    var run = el('button', { type: 'button', class: 'gp-btn primary', onclick: startOpt }, [opt ? t('o_again') : t('o_run')]);
    scatterBox = el('div', { class: 'ai-plot' }); genLine = el('p', { class: 'small muted', 'aria-live': 'polite' }); resBox = el('div');
    b.appendChild(el('div', { class: 'ai-ctl' }, [el('span', { class: 'small', style: 'font-weight:600;color:var(--g-ink-2)' }, [t('o_goal')]), goal, run]));
    b.appendChild(el('div', { class: 'ai-opt' }, [el('div', null, [scatterBox, genLine, legendOpt()]), resBox]));
    drawScatter(); drawResult();
  }
  function legendOpt() {
    var item = function (html, label) { var i = el('i'); i.style.cssText = html; return el('span', null, [i, label]); };
    return el('div', { class: 'gp-legend' }, [
      item('background:#7C9455;border-radius:50%', t('o_lg_ok')), item('background:#C4BFB3;border-radius:50%', t('o_lg_no')),
      item('background:#1F3A2B;height:3px', t('o_lg_front')), item('border:2px solid #24324A;border-radius:50%;background:transparent', t('o_lg_you')),
      item('background:#E8B33C;transform:rotate(45deg)', t('o_lg_best'))
    ]);
  }
  function startOpt() {
    resetOpt();
    var seed = Math.round(Math.abs(ctx.dna.location.lat * 1000 + ctx.dna.location.lon * 100)) + Object.keys(A.CROPS).indexOf(ST.crop) * 97 + ['ler', 'energy', 'crop'].indexOf(ST.goal) * 13;
    opt = A.optimizer({ base: base(), crop: ST.crop, clim: clim(), goal: ST.goal, japan: ST.japan, start: cur(), seed: seed });
    body();
    (function step() {
      optBest = opt.next(); drawScatter(); drawResult();
      if (!opt.done()) optTimer = setTimeout(step, 55); else optTimer = null;
    }());
  }
  function drawScatter() {
    if (!scatterBox) return;
    G.clear(scatterBox);
    var W = 760, H = 330, L = 58, R = 16, T = 14, B = 42;
    var you = A.evaluate(base(), cur(), ST.crop, clim(), A.pvOnlyKwhPerHa(base()));
    var pts = opt ? opt.all : [];
    var maxE = Math.max(you.kwh, pts.reduce(function (m, p) { return Math.max(m, p.kwh); }, 0)) / 1000 * 1.08 || 1;
    var x0 = 40, x1 = 115;
    var X = function (y) { return L + (W - L - R) * (Math.max(x0, Math.min(x1, y * 100)) - x0) / (x1 - x0); };
    var Y = function (k) { return T + (H - T - B) * (1 - k / 1000 / maxE); };
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'gp-chart', role: 'img', 'aria-label': t('o_y') + ' / ' + t('o_x'), direction: 'ltr' });
    s.appendChild(svg('rect', { x: X(A.JAPAN_RULE), y: T, width: W - R - X(A.JAPAN_RULE), height: H - T - B, fill: '#E2EFE5', opacity: ST.japan ? 0.6 : 0.25 }));
    for (var gx = 40; gx <= 110; gx += 10) {
      s.appendChild(svg('line', { x1: X(gx / 100), x2: X(gx / 100), y1: T, y2: H - B, stroke: 'rgba(30,38,34,0.08)' }));
      s.appendChild(svg('text', { x: X(gx / 100), y: H - B + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#66706A' }, gx + '%'));
    }
    var step = (function (raw) { var q = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / q; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * q; }(maxE / 5));
    for (var gy = 0; gy <= maxE; gy += step) {
      s.appendChild(svg('line', { x1: L, x2: W - R, y1: Y(gy * 1000), y2: Y(gy * 1000), stroke: 'rgba(30,38,34,0.08)' }));
      s.appendChild(svg('text', { x: L - 8, y: Y(gy * 1000) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#66706A' }, fmt(gy, step < 1 ? 1 : 0)));
    }
    s.appendChild(svg('line', { x1: X(A.JAPAN_RULE), x2: X(A.JAPAN_RULE), y1: T, y2: H - B, stroke: '#2F6B45', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
    s.appendChild(svg('text', { x: X(A.JAPAN_RULE) + 6, y: T + 14, 'font-size': 11.5, fill: '#2F6B45', 'font-weight': 600 }, t('o_rule') + ' · MAFF 🇯🇵'));
    s.appendChild(svg('text', { x: (L + W - R) / 2, y: H - 6, 'text-anchor': 'middle', 'font-size': 12, fill: '#4B5650' }, t('o_x')));
    var yl = svg('text', { x: 14, y: (T + H - B) / 2, 'text-anchor': 'middle', 'font-size': 12, fill: '#4B5650', transform: 'rotate(-90 14 ' + (T + H - B) / 2 + ')' }, t('o_y')); s.appendChild(yl);
    pts.forEach(function (p) {
      s.appendChild(svg('circle', { cx: X(p.yrel), cy: Y(p.kwh), r: 3.2, fill: p.ok ? '#7C9455' : '#C4BFB3', opacity: 0.35 + 0.6 * (p.gen / (opt.gens || 1)) }));
    });
    if (opt && pts.length) {
      var fr = opt.front().filter(function (p) { return p.yrel * 100 >= x0; });
      if (fr.length > 1) s.appendChild(svg('polyline', { points: fr.map(function (p) { return X(p.yrel) + ',' + Y(p.kwh); }).join(' '), fill: 'none', stroke: '#1F3A2B', 'stroke-width': 2 }));
    }
    s.appendChild(svg('circle', { cx: X(you.yrel), cy: Y(you.kwh), r: 8, fill: 'none', stroke: '#24324A', 'stroke-width': 2.5 }));
    if (optBest) {
      var bx = X(optBest.yrel), by = Y(optBest.kwh);
      s.appendChild(svg('polygon', { points: [bx, by - 11, bx + 11, by, bx, by + 11, bx - 11, by].join(','), fill: '#E8B33C', stroke: '#7A5F24', 'stroke-width': 1.5 }));
    }
    scatterBox.appendChild(s);
    if (genLine) genLine.textContent = opt ? fill(t('o_gen'), { g: Math.min(opt.gens, Math.max(0, opt.all.length ? opt.all[opt.all.length - 1].gen : 0)), n: opt.gens, e: opt.all.length }) : '';
  }
  function drawResult() {
    if (!resBox) return;
    G.clear(resBox);
    if (!optBest) { resBox.appendChild(el('div', { class: 'ai-res idle' }, [el('p', { class: 'small' }, [t('o_idle')])])); return; }
    var you = A.evaluate(base(), cur(), ST.crop, clim(), opt.ref), b = optBest, gx = b.genes;
    var kp = function (label, val, delta) { return el('div', { class: 'kpi' }, [el('b', null, [label]), el('div', { class: 'v' }, [val]), delta ? el('div', { class: 'u' }, [delta + ' ' + t('o_vs')]) : null]); };
    var dE = you.kwh > 0 ? (b.kwh / you.kwh - 1) * 100 : 0;
    resBox.appendChild(el('div', { class: 'ai-res' }, [
      el('h3', null, [t('o_res_t')]),
      el('div', { class: 'kpis', style: 'margin-top:8px' }, [
        kp(t('o_k_e'), fmt(b.kwh / 1000, 1) + ' MWh', signed(dE, '%')),
        kp(t('o_k_y'), pct(b.yrel), signed((b.yrel - you.yrel) * 100, 'pts')),
        kp(t('o_k_ler'), fmt(b.ler, 2), signed(b.ler - you.ler, '', 2)),
        kp(t('o_k_w'), fmt(b.waterSaved) + ' m³', signed(b.waterSaved - you.waterSaved, 'm³'))
      ]),
      el('h4', { style: 'margin-top:12px' }, [t('o_why')]),
      el('p', { class: 'small', style: 'margin-top:4px;color:var(--g-ink-2)' }, [fill(t('o_why_p'), { p: fmt(gx.pitch, 1), w: fmt(gx.width, 1), ti: fmt(gx.tilt), az: azText(gx.azimuth), ler: fmt(b.ler, 2), ln: fmt(b.ler, 2),
        jp: fill(t(b.yrel >= A.JAPAN_RULE ? 'o_why_jp_ok' : 'o_why_jp_no'), { y: fmt(b.yrel * 100) }) })]),
      opt.done() ? el('button', { type: 'button', class: 'gp-btn gold', style: 'margin-top:12px', onclick: function () {
        Object.assign(ctx.C, gx); appliedMsg = true; ctx.persist(); ctx.render(); window.scrollTo({ top: 0, behavior: 'smooth' });
      } }, [t('o_apply')]) : null,
      appliedMsg ? G.note('ok', t('o_applied')) : null
    ]));
  }

  /* ---------------------------------------------------------- ② weather pilot */
  var pilotBox;
  function pilotView(b) {
    var seg = el('div', { class: 'ai-seg', role: 'radiogroup', 'aria-label': t('p_src') }, ['live', 'typ', 'heat'].map(function (k) {
      return el('button', { type: 'button', role: 'radio', 'aria-checked': ST.src === k ? 'true' : 'false', onclick: function () { ST.src = k; persist(); body(); } }, [t('p_' + k)]);
    }));
    var aOut = el('output', { for: 'ai-alpha' }, [fmt(ST.alpha * 100) + ' %']);
    var aIn = el('input', { id: 'ai-alpha', type: 'range', min: 0, max: 1, step: 0.05, value: ST.alpha, oninput: function (e) {
      ST.alpha = +e.target.value; aOut.textContent = fmt(ST.alpha * 100) + ' %'; persist(); runPilot(false);
    } });
    pilotBox = el('div', { 'aria-live': 'polite' });
    b.appendChild(el('div', { class: 'ai-ctl' }, [
      el('span', { class: 'small', style: 'font-weight:600;color:var(--g-ink-2)' }, [t('p_src')]), seg,
      el('label', { for: 'ai-alpha', class: 'ai-alpha' }, [t('p_alpha'), el('span', { class: 'small muted' }, [t('p_alpha_c')]), aIn, el('span', { class: 'small muted' }, [t('p_alpha_e')]), aOut])
    ]));
    b.appendChild(pilotBox);
    runPilot(true);
  }
  function getWeather(done) {
    var loc = ctx.dna.location, CM = ctx.CM || {}, tz = Math.round(loc.lon / 15);
    var typical = function (heat) { return { rows: A.typicalWeek(loc.lat, loc.lon, 6, { ghi: ctx.ghi, tmax: CM.tmax, tmin: CM.tmin, et0: CM.et0 }, heat), offset: tz * 3600, src: heat ? 'heat' : 'typ' }; };
    if (ST.src !== 'live') { done(typical(ST.src === 'heat' ? 6 : 0)); return; }
    var key = loc.lat + ',' + loc.lon;
    if (weatherCache[key]) { done(weatherCache[key]); return; }
    G.clear(pilotBox).appendChild(el('p', { class: 'small muted' }, [el('span', { class: 'gp-spin' }), ' ', t('p_loading')]));
    var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    fetch(A.forecastUrl(loc.lat, loc.lon), ctl ? { signal: ctl.signal } : {}).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        var rows = A.parseOpenMeteo(d); if (!rows || rows.length < 24) throw new Error('empty');
        weatherCache[key] = { rows: rows, offset: d.utc_offset_seconds || 0, src: 'live' }; done(weatherCache[key]);
      })
      .catch(function () { clearTimeout(timer); var w = typical(0); w.failed = true; done(w); });
  }
  function runPilot(fetchFirst) {
    if (!pilotBox) return;
    var go = function (w) {
      var C = ctx.C, r = ctx.sim();
      pilotData = { w: w, res: A.pilot(w.rows, ctx.dna.location.lat, ctx.dna.location.lon, { width: C.width, pitch: C.pitch, height: C.height, kwp: r.kwp, pr: C.pr,
        fixedTilt: C.tilt, fixedAz: C.azimuth, crop: ST.crop, alpha: ST.alpha }) };
      drawPilot();
    };
    if (fetchFirst || !pilotData) getWeather(go); else go(pilotData.w);
  }
  function localHour(d, off) { var x = new Date(d.getTime() + off * 1000); return x.getUTCHours(); }
  function dayLabel(d, off) {
    var x = new Date(d.getTime() + off * 1000), L = G.lang(), loc = L === 'ar' ? 'ar-TN' : L === 'ja' ? 'ja-JP' : L === 'en' ? 'en-GB' : 'fr-FR';
    try { return x.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); } catch (e) { return x.toISOString().slice(0, 10); }
  }
  function drawPilot() {
    G.clear(pilotBox);
    var w = pilotData.w, res = pilotData.res, T = res.totals, c = A.CROPS[ST.crop], C = ctx.C;
    if (w.failed) pilotBox.appendChild(G.note('info', t('p_fail')));
    pilotBox.appendChild(el('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0 10px' }, [
      G.pill(w.src === 'live' ? 'live' : 'demo', w.src === 'live' ? 'Open-Meteo' : t('sim_badge')),
      el('span', { class: 'small muted' }, [t('p_src_' + w.src) + ' ' + fill(t('p_axis'), { w: fmt(C.width, 1), p: fmt(C.pitch, 1) })])
    ]));
    // comparison table
    var rows = ['fixed', 'sun', 'gaia'].map(function (k) {
      var x = T[k];
      return el('tr', { class: k === 'gaia' ? 'ai-win' : '' }, [
        el('th', { scope: 'row' }, [t('s_' + k)]),
        el('td', { class: 'num' }, [fmt(x.kwh) + ' kWh']),
        el('td', { class: 'num' }, [x.lightPct === null ? '—' : pct(x.lightPct)]),
        el('td', { class: 'num' }, [x.heatCut === null ? '—' : pct(x.heatCut)]),
        el('td', { class: 'num' }, [x.waterCut === null ? '—' : pct(x.waterCut)])
      ]);
    });
    pilotBox.appendChild(el('div', { class: 'gp-table-wrap' }, [el('table', { class: 'gp-table' }, [
      el('thead', null, [el('tr', null, [el('th', null, ['']), el('th', { class: 'num' }, [t('p_h_kwh')]), el('th', { class: 'num' }, [t('p_h_light')]), el('th', { class: 'num' }, [t('p_h_heat')]), el('th', { class: 'num' }, [t('p_h_water')])])]),
      el('tbody', null, rows)
    ])]));
    var g = T.gaia, s = T.sun;
    pilotBox.appendChild(el('p', { class: 'insight', style: 'margin-top:12px' }, [fill(t('p_sum'), {
      k: fmt(g.kwh), dk: signed(s.kwh > 0 ? (g.kwh / s.kwh - 1) * 100 : 0, '%'), l: fmt((g.lightPct || 0) * 100), ls: fmt((s.lightPct || 0) * 100),
      h: fmt((g.heatCut || 0) * 100), w: fmt((g.waterCut || 0) * 100) }) + (g.hot === 0 ? ' ' + t('p_nohot') : '')]));
    pilotBox.appendChild(timeline(res, w.offset, c));
    pilotBox.appendChild(el('div', { class: 'gp-legend' }, ['energy', 'light', 'shield'].map(function (m) { var i = el('i'); i.style.background = COL[m]; return el('span', null, [i, t('m_' + m)]); })
      .concat([(function () { var i = el('i'); i.style.cssText = 'background:#B5523B;height:3px'; return el('span', null, [i, t('p_ch_t')]); }()),
        (function () { var i = el('i'); i.style.cssText = 'background:#1F3A2B;height:3px'; return el('span', null, [i, t('p_ch_a') + ' · ' + t('p_ch_gaia')]); }()),
        (function () { var i = el('i'); i.style.cssText = 'border-top:2px dashed #A88746;height:0'; return el('span', null, [i, t('p_ch_sun')]); }())])));
    // decision log
    var days = [], hrs = res.hours.gaia;
    for (var d = 0; d * 24 < hrs.length; d++) days.push(hrs.slice(d * 24, d * 24 + 24));
    pilotBox.appendChild(el('details', { class: 'gp-more', open: true }, [el('summary', null, [t('p_log_t')]), el('ul', { class: 'ai-log' }, days.filter(function (x) { return x.length; }).map(function (day) {
      var tx = Math.max.apply(null, day.map(function (h) { return h.t; })), kwh = day.reduce(function (a, h) { return a + h.e; }, 0);
      var sh = day.filter(function (h) { return h.mode === 'shield'; }), li = day.filter(function (h) { return h.mode === 'light'; }).length, en = day.filter(function (h) { return h.mode === 'energy'; }).length;
      var parts = [];
      if (sh.length) parts.push(fill(t('p_log_sh'), { a: localHour(new Date(sh[0].time.getTime() - 3600e3), w.offset), b: localHour(sh[sh.length - 1].time, w.offset), tc: c.tcrit }));
      if (li) parts.push(fill(t('p_log_li'), { n: li }));
      if (en) parts.push(fill(t('p_log_en'), { n: en }));
      return el('li', null, [el('i', { style: 'background:' + (sh.length ? COL.shield : li > en ? COL.light : COL.energy) }), fill(t('p_log_day'), { d: dayLabel(new Date(day[12].time.getTime()), w.offset), tx: fmt(tx, 0), parts: parts.join(' '), kwh: fmt(kwh) })]);
    }))]));
  }
  function timeline(res, off, c) {
    var hrs = res.hours.gaia, sun = res.hours.sun, n = hrs.length;
    var W = 760, H = 250, L = 40, R = 10, tTop = 12, tBot = 100, rTop = 108, rBot = 124, aTop = 134, aBot = 222;
    var dx = (W - L - R) / n, X = function (i) { return L + i * dx; };
    var temps = hrs.map(function (h) { return h.t; }), tMin = Math.floor(Math.min.apply(null, temps.concat([c.tcrit])) / 5) * 5, tMax = Math.ceil(Math.max.apply(null, temps.concat([c.tcrit])) / 5) * 5 + (0);
    if (tMax - tMin < 10) tMax = tMin + 10;
    var YT = function (v) { return tBot - (tBot - tTop) * (v - tMin) / (tMax - tMin); }, YA = function (a) { return aTop + (aBot - aTop) * (55 - a) / 110; };
    var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'gp-chart', role: 'img', 'aria-label': t('p_log_t'), direction: 'ltr' });
    // sunlight band behind temperature
    var ghiPts = hrs.map(function (h, i) { return X(i + 0.5) + ',' + (tBot - (tBot - tTop) * Math.min(1, h.ghi / 1100)); });
    s.appendChild(svg('polygon', { points: X(0) + ',' + tBot + ' ' + ghiPts.join(' ') + ' ' + X(n) + ',' + tBot, fill: '#F4D875', opacity: 0.35 }));
    for (var v = tMin; v <= tMax; v += 5) {
      s.appendChild(svg('line', { x1: L, x2: W - R, y1: YT(v), y2: YT(v), stroke: 'rgba(30,38,34,0.07)' }));
      s.appendChild(svg('text', { x: L - 6, y: YT(v) + 4, 'text-anchor': 'end', 'font-size': 10.5, fill: '#66706A' }, v + '°'));
    }
    s.appendChild(svg('line', { x1: L, x2: W - R, y1: YT(c.tcrit), y2: YT(c.tcrit), stroke: '#B5523B', 'stroke-dasharray': '4 4', opacity: 0.8 }));
    s.appendChild(svg('text', { x: L + 4, y: tTop + 2, 'font-size': 10.5, fill: '#9A3B2C', 'font-weight': 600, stroke: '#FFFDF8', 'stroke-width': 3, 'paint-order': 'stroke' }, '- - ' + t('p_ch_tc') + ' ' + c.tcrit + ' °C'));
    s.appendChild(svg('polyline', { points: hrs.map(function (h, i) { return X(i + 0.5) + ',' + YT(h.t); }).join(' '), fill: 'none', stroke: '#B5523B', 'stroke-width': 2 }));
    // mode ribbon
    hrs.forEach(function (h, i) { if (h.mode !== 'night') s.appendChild(svg('rect', { x: X(i), y: rTop, width: dx + 0.3, height: rBot - rTop, fill: COL[h.mode] })); });
    // angle panel
    [-50, 0, 50].forEach(function (a) {
      s.appendChild(svg('line', { x1: L, x2: W - R, y1: YA(a), y2: YA(a), stroke: 'rgba(30,38,34,0.08)' }));
      s.appendChild(svg('text', { x: L - 6, y: YA(a) + 4, 'text-anchor': 'end', 'font-size': 10.5, fill: '#66706A' }, (a > 0 ? 'E ' : a < 0 ? 'W ' : '') + Math.abs(a) + '°'));
    });
    function line(list, attrs) {
      var d = '', pen = false;
      list.forEach(function (h, i) { if (h.mode === 'night') { pen = false; return; } d += (pen ? 'L' : 'M') + X(i + 0.5).toFixed(1) + ' ' + YA(h.ang).toFixed(1) + ' '; pen = true; });
      s.appendChild(svg('path', Object.assign({ d: d, fill: 'none' }, attrs)));
    }
    line(sun, { stroke: '#A88746', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' });
    line(hrs, { stroke: '#1F3A2B', 'stroke-width': 2.2 });
    // day separators
    for (var i = 0; i < n; i++) {
      if (localHour(hrs[i].time, off) === 1 || i === 0) {
        s.appendChild(svg('line', { x1: X(i), x2: X(i), y1: tTop, y2: aBot, stroke: 'rgba(30,38,34,0.18)' }));
        if (i + 12 < n) s.appendChild(svg('text', { x: X(i + 12), y: H - 10, 'text-anchor': 'middle', 'font-size': 11, fill: '#4B5650' }, dayLabel(hrs[i + 12].time, off)));
      }
    }
    var wrap = el('div', { class: 'ai-plot', style: 'margin-top:12px' }); wrap.appendChild(s); return wrap;
  }

  /* ---------------------------------------------------------- ③ crop ranking */
  function rankView(b) {
    var ref = A.pvOnlyKwhPerHa(base());
    var list = Object.keys(A.CROPS).map(function (k) { var e = A.evaluate(base(), cur(), k, clim(), ref); e.key = k; return e; })
      .sort(function (a, b2) { return (b2.yrel || 0) - (a.yrel || 0); });
    b.appendChild(el('h3', null, [t('r_t')]));
    b.appendChild(el('p', { class: 'small', style: 'margin:4px 0 10px;color:var(--g-ink-2)' }, [t('r_p')]));
    b.appendChild(el('div', { class: 'gp-table-wrap' }, [el('table', { class: 'gp-table ai-rank' }, [
      el('thead', null, [el('tr', null, [el('th', null, [t('r_c')]), el('th', null, [t('r_cls')]), el('th', { class: 'num' }, [t('r_y')]), el('th', null, ['']), el('th', { class: 'num' }, [t('r_w')]), el('th', null, [t('r_jp')])])]),
      el('tbody', null, list.map(function (e) {
        var y = e.yrel || 0, bar = el('span', { class: 'ai-bar' }, [el('i', { style: 'width:' + Math.min(100, y / 1.2 * 100) + '%;background:' + (y >= A.JAPAN_RULE ? '#7C9455' : '#C98A5B') })]);
        return el('tr', { class: e.key === ST.crop ? 'ai-win' : '', tabindex: 0, style: 'cursor:pointer', onclick: function () { ST.crop = e.key; persist(); resetOpt(); mount(root, ctx); },
          onkeydown: function (ev) { if (ev.key === 'Enter') { ST.crop = e.key; persist(); resetOpt(); mount(root, ctx); } } }, [
          el('th', { scope: 'row' }, [t('c_' + e.key)]), el('td', null, [t('cls_' + A.CROPS[e.key].cls)]),
          el('td', { class: 'num' }, [pct(y)]), el('td', { style: 'min-width:120px' }, [bar]),
          el('td', { class: 'num' }, [fmt(e.waterSaved) + ' m³']),
          el('td', null, [G.pill(y >= A.JAPAN_RULE ? 'ok' : 'no', y >= A.JAPAN_RULE ? t('r_ok') : t('r_no'))])
        ]);
      }))
    ])]));
    var lt = list.filter(function (e) { return e.key === 'lettuce_s'; })[0];
    if (lt && lt.yrel > 1) b.appendChild(el('p', { class: 'insight', style: 'margin-top:12px' }, ['✦ ' + t('r_star')]));
  }

  window.GAIA_AGV_UI = {
    mount: mount,
    onUpdate: function () { if (!root || !ctx) return; if (ST.tab === 'rank') body(); else if (ST.tab === 'opt' && !optTimer) { drawScatter(); } }
  };
}());
