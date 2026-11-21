/* Business model page (M5): PAYG solar pump kit, cooperative pump, adoption tests, resilience.
   Calculations in business-core.js. Reads the Water–Energy page's inputs when they exist. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, D = window.GAIA_DNA, N = window.GAIA_NEXUS, B = window.GAIA_BUSINESS;

  G.addStrings({
    fr: {
      nav_biz: 'Modèle économique',
      b_title: 'Modèle économique',
      b_lead: "Le panneau n'est pas l'innovation ; le modèle autour l'est. Un kit de pompage solaire payé par mensualités mobiles, à partir du gazole qu'il remplace, avec le quota d'eau inscrit dans le contrat.",
      principle: "Le quota fait partie du contrat.",
      principle_p: "Le kit est payé par le gazole qu'il fait économiser, pas par plus d'eau pompée. Le contrôleur ne débloque que le volume dont la culture a besoin : rembourser plus vite en pompant davantage n'est pas possible, et c'est voulu.",
      from_nexus: "Repris de la page Eau & énergie pour votre parcelle :",
      no_nexus: "Astuce : renseignez la page Eau & énergie (surface, hauteur, prix) pour pré-remplir le gazole, le prix du kit, le quota et la saisonnalité.",
      open_nexus: 'Ouvrir Eau & énergie',
      in_t: 'Kit en paiement à l’usage',
      in_diesel: 'Dépense actuelle en gazole de pompage (TND/an)', in_diesel_h: 'Ce que le kit fait économiser chaque année.',
      in_kit: 'Prix installé du kit solaire (TND)', in_kit_h: 'Panneaux, pompe, contrôleur avec compteur et quota.',
      in_maint: 'Entretien (TND/an)', in_dep: 'Apport initial (%)', in_term: 'Durée (mois)', in_fee: 'Frais de financement (% par an, forfait)',
      in_cap: 'Part max. des économies consacrée aux mensualités (%)', in_cap_h: 'Le reste reste dans la poche de l’agriculteur dès le premier mois.',
      in_mode: 'Rythme des paiements', mode_flat: 'Mensuel fixe', mode_seasonal: 'Saisonnier', mode_seasonal_h: 'Saisonnier : on paie quand la pompe remplace le gazole, peu en hiver. Nécessite le profil mensuel de pompage.',
      in_start: 'Mois de démarrage', in_life: 'Durée de vie du kit (ans)',
      assumption: 'Hypothèse modifiable',
      k_dep: 'Apport', k_inst: 'Mensualité moyenne', k_inst_max: 'max.', k_ratio: 'Part des économies', k_after: 'Gain après remboursement', per_year: 'par an', per_month: 'par mois',
      k_life: 'Gain net sur la durée de vie', k_total: 'Coût total financé', k_payback: 'Retour simple', years: 'ans', months_u: 'mois',
      v_ok: 'Remboursable par les économies', v_adapt: 'À ajuster', v_no: 'Trop lourd',
      v_ok_p: "Les mensualités restent sous la part choisie des économies : l'agriculteur gagne dès le premier mois.",
      v_adapt_p: 'Les économies couvrent les mensualités, mais au-delà de la part choisie. Allongez la durée ou augmentez l’apport.',
      v_no_p: 'Les mensualités dépassent le gazole économisé sur la durée. Le contrat ne doit pas être proposé tel quel.',
      suggest: 'Durée la plus courte qui respecte la part choisie :', suggest_none: 'Aucune durée jusqu’à 84 mois ne respecte la part choisie : revoyez le prix du kit ou l’apport.',
      c_cash_t: 'Économies et mensualités, 12 premiers mois', s_save: 'Gazole économisé', s_inst: 'Mensualité',
      sched_t: 'Échéancier complet', th_i: 'N°', th_m: 'Mois', th_save: 'Économie', th_inst: 'Mensualité', th_net: 'Net', th_cum: 'Cumul',
      miss_t: 'Informations manquantes', miss_kit: 'Prix du kit : saisissez un prix daté.', miss_diesel: 'Dépense en gazole : saisissez votre dépense annuelle.',
      payg_how_t: 'Comment le paiement mobile fonctionne',
      payg_how: [
        "L'agriculteur verse l'apport ; un installateur local pose le kit et le contrôleur.",
        'Chaque mensualité est payée par portefeuille mobile ou en espèces chez un agent ; un code SMS crédite le contrôleur.',
        'Pas de coupure en pleine saison : en cas de retard, un délai de grâce est appliqué pendant les mois de forte demande, puis le contrôleur passe en service réduit.',
        "Le compteur relève l'eau et l'énergie ; les mêmes données alimentent le quota et le suivi du remboursement.",
        "Au dernier paiement, le kit appartient à l'agriculteur. Le quota d'eau, lui, reste."
      ],
      co_t: 'Pompe partagée en coopérative', co_p: "Plusieurs fermes voisines partagent un kit plus grand. Chacune paie selon son quota d'eau, et l'autorisation de pompage du groupe est la somme des quotas, jamais plus.",
      co_kit: 'Prix du kit partagé (TND)', co_ind: "Prix d'un kit individuel (TND, pour comparer)", co_res: 'Fonds de réserve (% de chaque paiement)',
      co_name: 'Ferme', co_quota: 'Quota (m³/an)', co_diesel: 'Gazole (TND/an)', co_add: 'Ajouter une ferme', co_del: 'Retirer',
      co_need: "Ajoutez au moins deux fermes avec un quota, et le prix du kit partagé.",
      co_th_share: 'Part', co_th_dep: 'Apport', co_th_month: 'Paiement / mois', co_th_net: 'Net / mois', co_th_saved: 'Économie vs kit seul',
      co_allow: 'Autorisation de pompage du groupe', co_fund: 'Fonds de réserve en fin de contrat', co_fund_u: 'mois de mensualités couverts', co_capex: 'Investissement évité par le partage',
      me: 'Ma parcelle',
      ad_t: "Quatre tests d'adoption", ad_p: "Une technologie qui marche ailleurs n'est adoptée que si elle passe ces quatre tests ici. GAIA dit lequel bloque, et pourquoi.",
      ad_climate: 'Adaptation au climat', ad_economic: 'Viabilité économique', ad_ease: "Facilité d'usage pour l'agriculteur", ad_partners: 'Partenaires capables de passer à l’échelle',
      overall: 'Bilan', declared: 'Déclaratif : cochez ce qui existe déjà.',
      ghi_missing: 'Rayonnement solaire inconnu pour la parcelle.', ghi_high: 'Ensoleillement élevé (≥ 5 kWh/m²/jour en moyenne).', ghi_mid: 'Ensoleillement moyen (4 à 5 kWh/m²/jour) : champ solaire plus grand.', ghi_low: 'Ensoleillement faible (< 4 kWh/m²/jour).',
      src_rainfed: "Culture pluviale : pas de pompe à remplacer.", src_well: "Puits ou forage : la pompe solaire remplace un usage existant.", src_missing: "Source d'eau non renseignée.",
      quota_ok: 'Quota agronomique calculé : la nappe est protégée.', quota_missing: "Pas encore de quota calculé : renseignez Eau & énergie avant d'installer.",
      eco_missing: 'Saisissez la dépense en gazole et le prix du kit.', eco_ok: 'Mensualités payées par les économies, sous la part choisie.', eco_adapt: 'Couvert par les économies, mais au-delà de la part choisie.', eco_no: 'Les mensualités dépassent les économies.',
      e_phone: "L'agriculteur a un téléphone (SMS suffit)", e_mobile_money: 'Paiement mobile ou agent de paiement accessible', e_technician: 'Technicien local formé à moins d’une heure', e_controller: 'Contrôleur avec quota automatique (aucun réglage manuel)', e_training: 'Une demi-journée de formation sur la parcelle',
      p_water_authority: "Autorisation de l'administration de l'eau (CRDA) pour le puits", p_coop_gda: 'Groupement local (GDA ou SMSA) pour la pompe partagée', p_finance: 'Institution de microfinance ou banque agricole pour le crédit', p_installer: 'Installateur agréé et stock de pièces en Tunisie', p_tn_jp: 'Partenaire technique Tunisie–Japon (contrôleur, formation, suivi)',
      need: 'Manque :',
      rs_t: 'Résilience et communauté', rs_p: 'Absorber un choc, s’adapter au climat qui change, transformer la ferme. Les fermes connectées partagent pompe, fonds et données.',
      rs_absorb: 'Absorber', rs_absorb_p: "Le fonds de réserve de la coopérative paie les mensualités d'un membre en difficulté ou une réparation ; le délai de grâce évite la coupure en saison.",
      rs_adapt: "S'adapter", rs_adapt_p: "Le quota est recalculé chaque année sur le climat de la parcelle ; les paiements saisonniers suivent le pompage réel.",
      rs_transform: 'Transformer', rs_transform_p: "Après remboursement, l'énergie est gratuite : le surplus peut alimenter une chambre froide ou un moulin partagé, sans pomper plus d'eau.",
      rs_i_fund: 'de mensualités couvertes par le fonds', rs_i_quota: 'm³/an : plafond protégé', rs_i_after: 'TND/an libérés après remboursement',
      rs_i_none: 'Renseignez la coopérative ou le kit pour chiffrer.',
      method_t: 'Méthode et hypothèses',
      method_p: "Frais de financement forfaitaires sur le montant financé ; pas d'actualisation. Les économies sont la dépense en gazole évitée moins l'entretien. Le mode saisonnier répartit les mensualités selon l'énergie de pompage mensuelle calculée sur la page Eau & énergie. Aucun prix n'est inventé : sans prix, GAIA ne calcule pas.",
      sim: 'Estimation de modèle, pas une offre de crédit.'
    },
    ar: {
      nav_biz: 'النموذج الاقتصادي',
      b_title: 'النموذج الاقتصادي',
      b_lead: 'اللوح الشمسي ليس هو الابتكار، بل النموذج الذي يحيط به. منظومة ضخ شمسية تُسدَّد بأقساط عبر الهاتف من ثمن الغازوال الذي تعوّضه، مع حصة الماء مكتوبة في العقد.',
      principle: 'حصة الماء جزء من العقد.',
      principle_p: 'تُسدَّد المنظومة بالغازوال الذي توفّره، لا بضخ ماء أكثر. لا يسمح المتحكم إلا بالحجم الذي تحتاجه الزراعة: لا يمكن التسديد أسرع بالضخ أكثر، وهذا مقصود.',
      from_nexus: 'مأخوذ من صفحة الماء والطاقة لقطعتك:',
      no_nexus: 'نصيحة: املأ صفحة الماء والطاقة (المساحة، الارتفاع، الأسعار) لملء الغازوال وسعر المنظومة والحصة والموسمية تلقائياً.',
      open_nexus: 'فتح الماء والطاقة',
      in_t: 'منظومة بالدفع حسب الاستعمال',
      in_diesel: 'الإنفاق الحالي على غازوال الضخ (د.ت/سنة)', in_diesel_h: 'ما توفّره المنظومة كل سنة.',
      in_kit: 'سعر المنظومة الشمسية مركّبة (د.ت)', in_kit_h: 'ألواح، مضخة، ومتحكم بعداد وحصة.',
      in_maint: 'الصيانة (د.ت/سنة)', in_dep: 'الدفعة الأولى (%)', in_term: 'المدة (أشهر)', in_fee: 'كلفة التمويل (% سنوياً، جزافية)',
      in_cap: 'الحد الأقصى من التوفير المخصص للأقساط (%)', in_cap_h: 'الباقي يبقى في جيب الفلاح من الشهر الأول.',
      in_mode: 'نسق الدفع', mode_flat: 'شهري ثابت', mode_seasonal: 'موسمي', mode_seasonal_h: 'موسمي: يُدفع حين تعوّض المضخة الغازوال، وقليلاً في الشتاء. يتطلب الملف الشهري للضخ.',
      in_start: 'شهر البداية', in_life: 'عمر المنظومة (سنوات)',
      assumption: 'فرضية قابلة للتعديل',
      k_dep: 'الدفعة الأولى', k_inst: 'متوسط القسط', k_inst_max: 'الأقصى', k_ratio: 'نسبة من التوفير', k_after: 'الربح بعد التسديد', per_year: 'في السنة', per_month: 'في الشهر',
      k_life: 'الربح الصافي على عمر المنظومة', k_total: 'الكلفة الجملية الممولة', k_payback: 'الاسترجاع البسيط', years: 'سنوات', months_u: 'أشهر',
      v_ok: 'قابل للتسديد من التوفير', v_adapt: 'يحتاج تعديلاً', v_no: 'ثقيل جداً',
      v_ok_p: 'تبقى الأقساط تحت النسبة المختارة من التوفير: يربح الفلاح من الشهر الأول.',
      v_adapt_p: 'يغطي التوفير الأقساط، لكن فوق النسبة المختارة. أطِل المدة أو زِد الدفعة الأولى.',
      v_no_p: 'تتجاوز الأقساط الغازوال الموفَّر على المدة. لا يجب عرض العقد بهذا الشكل.',
      suggest: 'أقصر مدة تحترم النسبة المختارة:', suggest_none: 'لا توجد مدة حتى 84 شهراً تحترم النسبة المختارة: راجع سعر المنظومة أو الدفعة الأولى.',
      c_cash_t: 'التوفير والأقساط، أول 12 شهراً', s_save: 'الغازوال الموفَّر', s_inst: 'القسط',
      sched_t: 'جدول الأقساط الكامل', th_i: 'رقم', th_m: 'الشهر', th_save: 'التوفير', th_inst: 'القسط', th_net: 'الصافي', th_cum: 'المجموع',
      miss_t: 'معلومات ناقصة', miss_kit: 'سعر المنظومة: أدخل سعراً مؤرخاً.', miss_diesel: 'الإنفاق على الغازوال: أدخل إنفاقك السنوي.',
      payg_how_t: 'كيف يعمل الدفع عبر الهاتف',
      payg_how: [
        'يدفع الفلاح الدفعة الأولى، ويركّب مركّب محلي المنظومة والمتحكم.',
        'يُدفع كل قسط عبر محفظة هاتفية أو نقداً لدى وكيل؛ ورمز SMS يشحن المتحكم.',
        'لا قطع في ذروة الموسم: عند التأخير تُمنح مهلة خلال أشهر الطلب المرتفع، ثم ينتقل المتحكم إلى خدمة مخفّضة.',
        'يسجّل العداد الماء والطاقة؛ ونفس البيانات تغذي الحصة ومتابعة التسديد.',
        'عند آخر قسط تصبح المنظومة ملكاً للفلاح. أما حصة الماء فتبقى.'
      ],
      co_t: 'مضخة مشتركة في تعاضدية', co_p: 'تتقاسم عدة ضيعات متجاورة منظومة أكبر. تدفع كل ضيعة حسب حصتها من الماء، وترخيص الضخ للمجموعة هو مجموع الحصص، لا أكثر.',
      co_kit: 'سعر المنظومة المشتركة (د.ت)', co_ind: 'سعر منظومة فردية (د.ت، للمقارنة)', co_res: 'صندوق الاحتياط (% من كل دفعة)',
      co_name: 'الضيعة', co_quota: 'الحصة (م³/سنة)', co_diesel: 'الغازوال (د.ت/سنة)', co_add: 'إضافة ضيعة', co_del: 'حذف',
      co_need: 'أضف ضيعتين على الأقل بحصة، وسعر المنظومة المشتركة.',
      co_th_share: 'النصيب', co_th_dep: 'الدفعة الأولى', co_th_month: 'الدفع / شهر', co_th_net: 'الصافي / شهر', co_th_saved: 'التوفير مقارنة بمنظومة فردية',
      co_allow: 'ترخيص الضخ للمجموعة', co_fund: 'صندوق الاحتياط في نهاية العقد', co_fund_u: 'أشهر من الأقساط مغطاة', co_capex: 'الاستثمار الموفَّر بالاشتراك',
      me: 'قطعتي',
      ad_t: 'أربعة اختبارات للتبنّي', ad_p: 'التقنية التي تنجح في مكان آخر لا تُتبنّى هنا إلا إذا نجحت في هذه الاختبارات الأربعة. تقول غايا أيّها يعرقل، ولماذا.',
      ad_climate: 'الملاءمة المناخية', ad_economic: 'الجدوى الاقتصادية', ad_ease: 'سهولة الاستعمال للفلاح', ad_partners: 'شركاء قادرون على التعميم',
      overall: 'الحصيلة', declared: 'تصريحي: ضع علامة على ما هو موجود.',
      ghi_missing: 'الإشعاع الشمسي غير معروف للقطعة.', ghi_high: 'إشعاع مرتفع (≥ 5 ك.و.س/م²/يوم في المتوسط).', ghi_mid: 'إشعاع متوسط (4 إلى 5 ك.و.س/م²/يوم): حقل شمسي أكبر.', ghi_low: 'إشعاع ضعيف (< 4 ك.و.س/م²/يوم).',
      src_rainfed: 'زراعة مطرية: لا توجد مضخة لتعويضها.', src_well: 'بئر أو بئر عميقة: المضخة الشمسية تعوّض استعمالاً قائماً.', src_missing: 'مصدر الماء غير محدد.',
      quota_ok: 'الحصة الزراعية محسوبة: المائدة المائية محمية.', quota_missing: 'لم تُحسب الحصة بعد: املأ صفحة الماء والطاقة قبل التركيب.',
      eco_missing: 'أدخل الإنفاق على الغازوال وسعر المنظومة.', eco_ok: 'الأقساط تُدفع من التوفير، تحت النسبة المختارة.', eco_adapt: 'يغطيها التوفير، لكن فوق النسبة المختارة.', eco_no: 'الأقساط تتجاوز التوفير.',
      e_phone: 'للفلاح هاتف (SMS يكفي)', e_mobile_money: 'دفع عبر الهاتف أو وكيل دفع قريب', e_technician: 'تقني محلي مكوَّن على بعد أقل من ساعة', e_controller: 'متحكم بحصة آلية (دون ضبط يدوي)', e_training: 'نصف يوم تكوين في القطعة',
      p_water_authority: 'ترخيص إدارة المياه (المندوبية الجهوية للفلاحة) للبئر', p_coop_gda: 'مجمع محلي (مجمع تنمية أو شركة تعاونية) للمضخة المشتركة', p_finance: 'مؤسسة قروض صغرى أو بنك فلاحي للتمويل', p_installer: 'مركّب معتمد ومخزون قطع غيار في تونس', p_tn_jp: 'شريك تقني تونسي–ياباني (المتحكم، التكوين، المتابعة)',
      need: 'ينقص:',
      rs_t: 'الصمود والمجتمع', rs_p: 'امتصاص الصدمة، التكيّف مع المناخ المتغيّر، وتحويل الضيعة. الضيعات المتصلة تتقاسم المضخة والصندوق والبيانات.',
      rs_absorb: 'الامتصاص', rs_absorb_p: 'يدفع صندوق احتياط التعاضدية أقساط عضو في صعوبة أو كلفة إصلاح؛ والمهلة تمنع القطع في الموسم.',
      rs_adapt: 'التكيّف', rs_adapt_p: 'تُعاد حسابة الحصة كل سنة على مناخ القطعة؛ والأقساط الموسمية تتبع الضخ الفعلي.',
      rs_transform: 'التحويل', rs_transform_p: 'بعد التسديد تصبح الطاقة مجانية: يمكن للفائض تشغيل غرفة تبريد أو مطحنة مشتركة، دون ضخ ماء أكثر.',
      rs_i_fund: 'من الأقساط مغطاة بالصندوق', rs_i_quota: 'م³/سنة: سقف محمي', rs_i_after: 'د.ت/سنة متاحة بعد التسديد',
      rs_i_none: 'املأ التعاضدية أو المنظومة للحساب.',
      method_t: 'المنهجية والفرضيات',
      method_p: 'كلفة التمويل جزافية على المبلغ الممول، دون تحيين. التوفير هو الإنفاق على الغازوال المتجنَّب ناقص الصيانة. يوزّع النمط الموسمي الأقساط حسب طاقة الضخ الشهرية المحسوبة في صفحة الماء والطاقة. لا يُخترع أي سعر: دون أسعار لا تحسب غايا.',
      sim: 'تقدير نموذجي، وليس عرض قرض.'
    },
    en: {
      nav_biz: 'Business model',
      b_title: 'Business model',
      b_lead: 'The panel is not the innovation; the model around it is. A solar pumping kit paid in mobile instalments, out of the diesel it replaces, with the water quota written into the contract.',
      principle: 'The quota is part of the contract.',
      principle_p: 'The kit is paid for by the diesel it saves, not by pumping more water. The controller only releases the volume the crop needs: paying back faster by pumping more is not possible, and that is deliberate.',
      from_nexus: 'Taken from the Water & energy page for your plot:',
      no_nexus: 'Tip: fill in the Water & energy page (area, head, prices) to pre-fill the diesel, kit price, quota and seasonality.',
      open_nexus: 'Open Water & energy',
      in_t: 'Pay-as-you-go kit',
      in_diesel: 'Current diesel spending on pumping (TND/yr)', in_diesel_h: 'What the kit saves each year.',
      in_kit: 'Installed price of the solar kit (TND)', in_kit_h: 'Panels, pump, controller with meter and quota.',
      in_maint: 'Maintenance (TND/yr)', in_dep: 'Down payment (%)', in_term: 'Term (months)', in_fee: 'Financing fee (% per year, flat)',
      in_cap: 'Max. share of savings spent on instalments (%)', in_cap_h: 'The rest stays in the farmer’s pocket from the first month.',
      in_mode: 'Payment rhythm', mode_flat: 'Fixed monthly', mode_seasonal: 'Seasonal', mode_seasonal_h: 'Seasonal: you pay when the pump replaces diesel, little in winter. Needs the monthly pumping profile.',
      in_start: 'Start month', in_life: 'Kit lifetime (years)',
      assumption: 'Editable assumption',
      k_dep: 'Down payment', k_inst: 'Average instalment', k_inst_max: 'max.', k_ratio: 'Share of savings', k_after: 'Gain after repayment', per_year: 'per year', per_month: 'per month',
      k_life: 'Net gain over the lifetime', k_total: 'Total financed cost', k_payback: 'Simple payback', years: 'years', months_u: 'months',
      v_ok: 'Repayable from the savings', v_adapt: 'To adjust', v_no: 'Too heavy',
      v_ok_p: 'Instalments stay under the chosen share of savings: the farmer gains from the first month.',
      v_adapt_p: 'Savings cover the instalments, but beyond the chosen share. Extend the term or raise the down payment.',
      v_no_p: 'Instalments exceed the diesel saved over the term. The contract should not be offered as it is.',
      suggest: 'Shortest term that respects the chosen share:', suggest_none: 'No term up to 84 months respects the chosen share: review the kit price or the down payment.',
      c_cash_t: 'Savings and instalments, first 12 months', s_save: 'Diesel saved', s_inst: 'Instalment',
      sched_t: 'Full schedule', th_i: 'No.', th_m: 'Month', th_save: 'Saving', th_inst: 'Instalment', th_net: 'Net', th_cum: 'Cumulative',
      miss_t: 'Missing information', miss_kit: 'Kit price: enter a dated price.', miss_diesel: 'Diesel spending: enter your annual spending.',
      payg_how_t: 'How mobile payment works',
      payg_how: [
        'The farmer pays the down payment; a local installer sets up the kit and the controller.',
        'Each instalment is paid by mobile wallet or in cash at an agent; an SMS code credits the controller.',
        'No cut-off in the middle of the season: if a payment is late, a grace period applies during the high-demand months, then the controller switches to reduced service.',
        'The meter records water and energy; the same data feeds the quota and the repayment tracking.',
        'After the last payment the kit belongs to the farmer. The water quota stays.'
      ],
      co_t: 'Pump shared in a cooperative', co_p: 'Several neighbouring farms share a larger kit. Each pays according to its water quota, and the group’s pumping permit is the sum of the quotas, never more.',
      co_kit: 'Shared kit price (TND)', co_ind: 'Price of an individual kit (TND, to compare)', co_res: 'Reserve fund (% of each payment)',
      co_name: 'Farm', co_quota: 'Quota (m³/yr)', co_diesel: 'Diesel (TND/yr)', co_add: 'Add a farm', co_del: 'Remove',
      co_need: 'Add at least two farms with a quota, and the shared kit price.',
      co_th_share: 'Share', co_th_dep: 'Down payment', co_th_month: 'Payment / month', co_th_net: 'Net / month', co_th_saved: 'Saving vs own kit',
      co_allow: 'Group pumping permit', co_fund: 'Reserve fund at the end of the contract', co_fund_u: 'months of instalments covered', co_capex: 'Investment avoided by sharing',
      me: 'My plot',
      ad_t: 'Four adoption tests', ad_p: 'A technology that works elsewhere is only adopted if it passes these four tests here. GAIA says which one blocks, and why.',
      ad_climate: 'Climate fit', ad_economic: 'Economic viability', ad_ease: 'Ease of use for the farmer', ad_partners: 'Partners able to scale up',
      overall: 'Overall', declared: 'Self-declared: tick what already exists.',
      ghi_missing: 'Solar radiation unknown for the plot.', ghi_high: 'High sunshine (≥ 5 kWh/m²/day on average).', ghi_mid: 'Medium sunshine (4 to 5 kWh/m²/day): larger solar array.', ghi_low: 'Low sunshine (< 4 kWh/m²/day).',
      src_rainfed: 'Rainfed crop: no pump to replace.', src_well: 'Well or borehole: the solar pump replaces an existing use.', src_missing: 'Water source not entered.',
      quota_ok: 'Agronomic quota calculated: the aquifer is protected.', quota_missing: 'No quota calculated yet: fill in Water & energy before installing.',
      eco_missing: 'Enter the diesel spending and the kit price.', eco_ok: 'Instalments paid from the savings, under the chosen share.', eco_adapt: 'Covered by the savings, but beyond the chosen share.', eco_no: 'Instalments exceed the savings.',
      e_phone: 'The farmer has a phone (SMS is enough)', e_mobile_money: 'Mobile payment or a payment agent within reach', e_technician: 'Trained local technician less than an hour away', e_controller: 'Controller with an automatic quota (no manual setting)', e_training: 'Half a day of training on the plot',
      p_water_authority: 'Permit from the water administration (CRDA) for the well', p_coop_gda: 'Local group (GDA or SMSA) for the shared pump', p_finance: 'Microfinance institution or agricultural bank for the credit', p_installer: 'Approved installer and spare parts stock in Tunisia', p_tn_jp: 'Tunisia–Japan technical partner (controller, training, follow-up)',
      need: 'Missing:',
      rs_t: 'Resilience and community', rs_p: 'Absorb a shock, adapt to a changing climate, transform the farm. Connected farms share a pump, a fund and data.',
      rs_absorb: 'Absorb', rs_absorb_p: 'The cooperative’s reserve fund pays the instalments of a member in difficulty or a repair; the grace period avoids a cut-off in season.',
      rs_adapt: 'Adapt', rs_adapt_p: 'The quota is recalculated each year from the plot’s climate; seasonal payments follow actual pumping.',
      rs_transform: 'Transform', rs_transform_p: 'After repayment the energy is free: the surplus can run a cold room or a shared mill, without pumping more water.',
      rs_i_fund: 'of instalments covered by the fund', rs_i_quota: 'm³/yr: protected ceiling', rs_i_after: 'TND/yr freed after repayment',
      rs_i_none: 'Fill in the cooperative or the kit to put figures on it.',
      method_t: 'Method and assumptions',
      method_p: 'Flat financing fee on the financed amount; no discounting. Savings are the diesel spending avoided minus maintenance. Seasonal mode spreads the instalments according to the monthly pumping energy calculated on the Water & energy page. No price is invented: without prices, GAIA does not calculate.',
      sim: 'Model estimate, not a credit offer.'
    },
    ja: {
      nav_biz: 'ビジネスモデル',
      b_title: 'ビジネスモデル',
      b_lead: 'イノベーションはパネルではなく、その周りの仕組みです。置き換える軽油代から、モバイル決済の分割払いで支払う太陽光揚水キット。水の割当量は契約に書き込まれています。',
      principle: '割当量は契約の一部です。',
      principle_p: 'キットの代金は、より多く汲み上げることではなく、節約した軽油代で払います。制御装置は作物に必要な量しか出しません。多く汲んで早く返済することはできず、それは意図したものです。',
      from_nexus: 'あなたの区画の「水とエネルギー」ページから引き継いだ値：',
      no_nexus: 'ヒント：「水とエネルギー」ページ（面積、揚程、価格）を入力すると、軽油代、キット価格、割当量、季節性が自動で入ります。',
      open_nexus: '「水とエネルギー」を開く',
      in_t: '使った分だけ払うキット',
      in_diesel: '現在の揚水用軽油代（TND/年）', in_diesel_h: 'キットで毎年節約できる額。',
      in_kit: '太陽光キットの設置価格（TND）', in_kit_h: 'パネル、ポンプ、水量計と割当機能つきの制御装置。',
      in_maint: '保守費（TND/年）', in_dep: '頭金（%）', in_term: '期間（月）', in_fee: '融資手数料（年率%、定額）',
      in_cap: '節約額のうち返済に充てる上限（%）', in_cap_h: '残りは最初の月から農家の手元に残ります。',
      in_mode: '支払いのリズム', mode_flat: '毎月定額', mode_seasonal: '季節に応じて', mode_seasonal_h: '季節払い：ポンプが軽油の代わりに働く時期に払い、冬はわずか。月別の揚水プロファイルが必要です。',
      in_start: '開始月', in_life: 'キットの寿命（年）',
      assumption: '変更できる前提',
      k_dep: '頭金', k_inst: '平均月額', k_inst_max: '最大', k_ratio: '節約額に占める割合', k_after: '返済後の利益', per_year: '年あたり', per_month: '月あたり',
      k_life: '寿命全体での純利益', k_total: '融資総額', k_payback: '単純回収期間', years: '年', months_u: 'か月',
      v_ok: '節約額で返済可能', v_adapt: '要調整', v_no: '負担が重すぎる',
      v_ok_p: '月々の支払いは選んだ節約額の割合を下回ります。農家は最初の月から得をします。',
      v_adapt_p: '節約額で支払いはまかなえますが、選んだ割合を超えます。期間を延ばすか、頭金を増やしてください。',
      v_no_p: '期間全体で、支払いが節約できる軽油代を上回ります。この契約はこのままでは提案すべきではありません。',
      suggest: '選んだ割合を守れる最短の期間：', suggest_none: '84か月までのどの期間でも、選んだ割合を守れません。キット価格か頭金を見直してください。',
      c_cash_t: '節約額と月々の支払い（最初の12か月）', s_save: '節約した軽油代', s_inst: '月々の支払い',
      sched_t: '返済スケジュール全体', th_i: '番号', th_m: '月', th_save: '節約額', th_inst: '支払い', th_net: '差引', th_cum: '累計',
      miss_t: '欠けている情報', miss_kit: 'キット価格：日付つきの価格を入力してください。', miss_diesel: '軽油代：年間の支出を入力してください。',
      payg_how_t: 'モバイル決済の仕組み',
      payg_how: [
        '農家が頭金を払い、地元の施工業者がキットと制御装置を設置します。',
        '毎月の支払いはモバイルウォレットか、代理店での現金払い。SMSのコードで制御装置にクレジットが入ります。',
        'シーズン中に止まることはありません。支払いが遅れても、需要の多い月は猶予期間が適用され、その後に制御装置が縮小運転に切り替わります。',
        '水量計が水とエネルギーを記録し、同じデータで割当量と返済状況を管理します。',
        '最後の支払いでキットは農家のものになります。水の割当量はそのまま残ります。'
      ],
      co_t: '協同組合で共有するポンプ', co_p: '近隣の複数の農場が、より大きなキットを共有します。各農場は水の割当量に応じて支払い、グループの揚水許可は割当量の合計で、それ以上にはなりません。',
      co_kit: '共有キットの価格（TND）', co_ind: '個別キットの価格（TND、比較用）', co_res: '積立金（各支払いの%）',
      co_name: '農場', co_quota: '割当量（m³/年）', co_diesel: '軽油代（TND/年）', co_add: '農場を追加', co_del: '削除',
      co_need: '割当量のある農場を2つ以上と、共有キットの価格を入力してください。',
      co_th_share: '割合', co_th_dep: '頭金', co_th_month: '月々の支払い', co_th_net: '月々の差引', co_th_saved: '個別キットとの差額',
      co_allow: 'グループの揚水許可', co_fund: '契約終了時の積立金', co_fund_u: 'か月分の支払いに相当', co_capex: '共有で避けられた投資',
      me: '自分の区画',
      ad_t: '4つの導入テスト', ad_p: '他の場所でうまくいく技術も、ここでこの4つのテストに通らなければ導入されません。GAIAはどれが障害になっているか、その理由を示します。',
      ad_climate: '気候への適合', ad_economic: '経済的な実現性', ad_ease: '農家にとっての使いやすさ', ad_partners: '規模を広げられるパートナー',
      overall: '総合', declared: '自己申告：すでにあるものにチェックしてください。',
      ghi_missing: '区画の日射量が不明です。', ghi_high: '日射が強い（平均5 kWh/m²/日以上）。', ghi_mid: '日射は中程度（4〜5 kWh/m²/日）：より大きな太陽光アレイが必要。', ghi_low: '日射が弱い（4 kWh/m²/日未満）。',
      src_rainfed: '天水作物：置き換えるポンプがありません。', src_well: '井戸・ボーリング井：太陽光ポンプが既存の用途を置き換えます。', src_missing: '水源が未入力です。',
      quota_ok: '農学的な割当量を計算済み：帯水層は守られています。', quota_missing: 'まだ割当量がありません。設置前に「水とエネルギー」を入力してください。',
      eco_missing: '軽油代とキット価格を入力してください。', eco_ok: '月々の支払いは節約額でまかなえ、選んだ割合以内です。', eco_adapt: '節約額でまかなえますが、選んだ割合を超えます。', eco_no: '月々の支払いが節約額を上回ります。',
      e_phone: '農家が電話を持っている（SMSで十分）', e_mobile_money: 'モバイル決済または支払い代理店を利用できる', e_technician: '1時間以内の場所に研修を受けた地元の技術者がいる', e_controller: '割当量を自動で守る制御装置（手動設定なし）', e_training: '区画での半日の研修',
      p_water_authority: '井戸について水行政（CRDA）の許可', p_coop_gda: '共有ポンプのための地元グループ（GDAまたはSMSA）', p_finance: '融資のためのマイクロファイナンス機関または農業銀行', p_installer: 'チュニジア国内の認定施工業者と部品在庫', p_tn_jp: 'チュニジア–日本の技術パートナー（制御装置、研修、フォローアップ）',
      need: '不足：',
      rs_t: 'レジリエンスとコミュニティ', rs_p: 'ショックを吸収し、変わる気候に適応し、農場を変革する。つながった農場はポンプ、基金、データを共有します。',
      rs_absorb: '吸収する', rs_absorb_p: '協同組合の積立金が、困っている組合員の支払いや修理を肩代わりします。猶予期間によってシーズン中の停止を避けます。',
      rs_adapt: '適応する', rs_adapt_p: '割当量は区画の気候から毎年計算し直します。季節払いは実際の揚水量に合わせます。',
      rs_transform: '変革する', rs_transform_p: '返済後はエネルギーが無料になります。余剰電力で、水を余分に汲むことなく冷蔵室や共有の製粉機を動かせます。',
      rs_i_fund: '基金でまかなえる支払い', rs_i_quota: 'm³/年：守られた上限', rs_i_after: '返済後に浮くTND/年',
      rs_i_none: '数値を出すには、協同組合かキットの情報を入力してください。',
      method_t: '方法と前提',
      method_p: '融資額に対する定額の融資手数料。割引計算はしていません。節約額は、避けられた軽油代から保守費を引いたものです。季節払いでは、「水とエネルギー」ページで計算した月別の揚水エネルギーに応じて支払いを配分します。価格は作りません。価格がなければGAIAは計算しません。',
      sim: 'モデルによる推定で、融資の申し出ではありません。'
    }
  });

  G.mountShell('biz');
  var app = document.getElementById('app');

  /* --------------------------------------------- what the Water–Energy page already knows */
  function fromNexus() {
    var p = G.getParcel();
    if (!p || !p.dna) return null;
    var dna = p.dna, saved = G.load('gaia.nexus.inputs', null);
    var CM = dna.climateMonthly, SM = dna.solarMonthly;
    var ghi = SM && SM.ghi ? SM.ghi : (CM && CM.ghi ? CM.ghi : null);
    var out = { dna: dna, ghi: ghi, water_source: D.value(dna, 'water.source') };
    if (ghi) { var g = ghi.filter(function (v) { return v > 0; }); out.ghi_mean = g.length ? g.reduce(function (a, b) { return a + b; }, 0) / g.length : null; }
    if (!saved || saved.parcelAt !== dna.builtAt || !CM) return out;
    var S = saved.values, n = function (v) { var x = parseFloat(String(v).replace(',', '.')); return isNaN(x) ? null : x; };
    var r = N.compute({
      et0: CM.et0, rain: CM.rain, ghi: ghi, kc: n(S.kc), months: S.months, area_ha: n(S.area), ea: n(S.ea), head_m: n(S.head), pump_eff: n(S.pump_eff), pr: n(S.pr),
      prices: { diesel_tnd_l: n(S.diesel_tnd_l), diesel_kwh_l: n(S.diesel_kwh_l), grid_tnd_kwh: n(S.grid_tnd_kwh), pv_tnd_kwp: n(S.pv_tnd_kwp), pv_life_y: n(S.pv_life_y) }
    });
    if (r.totals && r.totals.kwh > 0) out.monthly_kwh = r.months.map(function (x) { return x.kwh || 0; });
    if (r.totals && r.totals.vol > 0) out.quota_m3 = r.totals.vol;
    if (r.costs && r.costs.diesel) out.diesel_tnd_year = r.costs.diesel;
    if (r.solar && n(S.pv_tnd_kwp) > 0) out.kit_tnd = r.solar.kwp * n(S.pv_tnd_kwp);
    return out;
  }
  var NX = fromNexus();

  var saved = G.load('gaia.business.inputs', null) || {};
  var S = Object.assign({
    diesel: NX && NX.diesel_tnd_year ? Math.round(NX.diesel_tnd_year) : '',
    kit: NX && NX.kit_tnd ? Math.round(NX.kit_tnd) : '',
    maint: '', dep: 10, term: 36, fee: 8, cap: 70, seasonal: !!(NX && NX.monthly_kwh), start: 3, life: 20,
    co_kit: '', co_ind: '', co_res: 5,
    members: [{ name: '', quota: NX && NX.quota_m3 ? Math.round(NX.quota_m3) : '', diesel: '' }, { name: '', quota: '', diesel: '' }],
    ease: {}, partners: {}
  }, saved);

  function num(v) { var x = parseFloat(String(v).replace(',', '.')); return isNaN(x) ? null : x; }
  function persist() { G.save('gaia.business.inputs', S); }

  function field(id, labelKey, key, hintKey, attrs) {
    return el('div', { class: 'gp-field' }, [
      el('label', { for: id }, [t(labelKey)]),
      el('input', Object.assign({ id: id, type: 'number', step: 'any', inputmode: 'decimal', value: S[key] === null ? '' : S[key],
        oninput: function (e) { S[key] = e.target.value; persist(); draw(); } }, attrs || {})),
      hintKey ? el('span', { class: 'hint' }, [t(hintKey)]) : null
    ]);
  }

  function inputs() {
    var months = G.t('months'), canSeason = !!(NX && NX.monthly_kwh);
    var seg = el('div', { class: 'seg', role: 'group', 'aria-label': t('in_mode') }, [
      el('button', { type: 'button', 'aria-pressed': String(!S.seasonal), onclick: function () { S.seasonal = false; persist(); renderAll(); } }, [t('mode_flat')]),
      el('button', { type: 'button', 'aria-pressed': String(!!S.seasonal && canSeason), disabled: canSeason ? null : 'disabled', onclick: function () { S.seasonal = true; persist(); renderAll(); } }, [t('mode_seasonal')])
    ]);
    var startSel = el('select', { id: 'bm-start', onchange: function (e) { S.start = +e.target.value; persist(); draw(); } },
      months.map(function (m, i) { return el('option', { value: i, selected: +S.start === i }, [m]); }));
    return el('div', { class: 'gp-card bm-in' }, [
      el('h2', null, [t('in_t')]),
      field('bm-diesel', 'in_diesel', 'diesel', 'in_diesel_h'),
      field('bm-kit', 'in_kit', 'kit', 'in_kit_h'),
      field('bm-maint', 'in_maint', 'maint'),
      field('bm-dep', 'in_dep', 'dep', 'assumption', { min: 0, max: 100 }),
      field('bm-term', 'in_term', 'term', 'assumption', { min: 1, max: 120, step: 1 }),
      field('bm-fee', 'in_fee', 'fee', 'assumption', { min: 0, max: 40 }),
      field('bm-cap', 'in_cap', 'cap', 'in_cap_h', { min: 10, max: 100 }),
      el('div', { class: 'gp-field' }, [el('span', { class: 'lab' }, [t('in_mode')]), seg, el('span', { class: 'hint' }, [t('mode_seasonal_h')])]),
      el('div', { class: 'gp-field' }, [el('label', { for: 'bm-start' }, [t('in_start')]), startSel]),
      field('bm-life', 'in_life', 'life', 'assumption', { min: 1, max: 30 })
    ]);
  }

  function paygInput() {
    return {
      kit_tnd: num(S.kit), diesel_tnd_year: num(S.diesel), maint_tnd_year: num(S.maint) || 0,
      deposit_pct: (num(S.dep) || 0) / 100, term_months: num(S.term) || 36, fee_rate: (num(S.fee) || 0) / 100,
      share_cap: (num(S.cap) || 70) / 100, monthly_kwh: NX && NX.monthly_kwh ? NX.monthly_kwh : null,
      seasonal: !!S.seasonal, start_month: +S.start || 0, life_y: num(S.life) || 20
    };
  }

  function kpi(label, value, unit, hi) {
    return el('div', { class: 'kpi' + (hi ? ' hi' : '') }, [el('b', null, [label]), el('div', { class: 'v' }, [value]), el('span', { class: 'u' }, [unit])]);
  }

  var out, coOut, adOut, rsOut, lastPayg, lastCoop;

  function drawPayg() {
    G.clear(out);
    var r = lastPayg = B.payg(paygInput()), months = G.t('months');
    if (r.missing.length) {
      out.appendChild(el('div', { class: 'gp-note' }, [G.icon('info'), el('div', null, [el('b', null, [t('miss_t')]),
        el('ul', { style: 'margin:4px 0 0;padding-inline-start:18px' }, r.missing.map(function (k) { return el('li', null, [t('miss_' + k)]); }))])]));
      return;
    }
    var vk = { ok: 'ok', adapt: 'adapt', no: 'no', unk: 'unk' }[r.verdict];
    out.appendChild(el('div', { class: 'kpis' }, [
      kpi(t('k_dep'), fmt(r.deposit) + ' TND', t('in_dep').replace(' (%)', '') + ' · ' + fmt(num(S.dep)) + ' %'),
      kpi(t('k_inst'), fmt(r.avg_installment) + ' TND', t('per_month') + (r.seasonal ? ' · ' + t('k_inst_max') + ' ' + fmt(r.max_installment) : '')),
      kpi(t('k_ratio'), fmt(r.ratio * 100) + ' %', '≤ ' + fmt(r.share_cap * 100) + ' %', true),
      kpi(t('k_after'), fmt(r.yearly_after) + ' TND', t('per_year'))
    ]));
    out.appendChild(el('div', { class: 'gp-note ' + (r.verdict === 'ok' ? 'ok' : r.verdict === 'no' ? 'err' : ''), style: 'margin-top:12px' }, [
      G.icon(r.verdict === 'ok' ? 'ok' : 'warn'),
      el('div', null, [G.pill(vk, t('v_' + r.verdict)), ' ', t('v_' + r.verdict + '_p'),
        r.verdict !== 'ok' ? el('div', { style: 'margin-top:4px' }, [r.suggested_term ? t('suggest') + ' ' + r.suggested_term + ' ' + t('months_u') : t('suggest_none')]) : null])
    ]));
    out.appendChild(el('div', { class: 'kpis', style: 'margin-top:8px' }, [
      kpi(t('k_total'), fmt(r.total) + ' TND', r.term + ' ' + t('months_u')),
      kpi(t('k_payback'), r.simple_payback_y === null ? '—' : fmt(r.simple_payback_y, 1) + ' ' + t('years'), ''),
      kpi(t('k_life'), fmt(r.life_gain) + ' TND', fmt(num(S.life)) + ' ' + t('years')),
      kpi(t('in_term'), String(r.term), t('months_u'))
    ]));
    out.appendChild(el('p', { class: 'assump', style: 'margin-top:6px' }, [t('sim')]));

    var c = el('div'), first = r.schedule.slice(0, 12);
    out.appendChild(el('div', { class: 'gp-card', style: 'margin-top:16px' }, [el('h2', null, [t('c_cash_t')]), c]));
    G.barChart(c, { labels: first.map(function (x) { return months[x.month]; }), unit: 'TND', title: t('c_cash_t'), series: [
      { name: t('s_save'), color: '#7C9455', values: first.map(function (x) { return Math.max(0, x.saving); }) },
      { name: t('s_inst'), color: '#A88746', values: first.map(function (x) { return x.installment; }) }
    ] });

    out.appendChild(el('details', { class: 'gp-card gp-more', style: 'margin-top:16px' }, [
      el('summary', null, [t('sched_t')]),
      el('div', { class: 'gp-table-wrap', style: 'margin-top:10px' }, [el('table', { class: 'gp-table' }, [
        el('thead', null, [el('tr', null, ['th_i', 'th_m', 'th_save', 'th_inst', 'th_net', 'th_cum'].map(function (k, i) { return el('th', { class: i > 1 ? 'num' : null }, [t(k)]); }))]),
        el('tbody', null, r.schedule.map(function (x) {
          return el('tr', null, [el('td', null, [String(x.i)]), el('td', null, [months[x.month]]), el('td', { class: 'num' }, [fmt(x.saving)]),
            el('td', { class: 'num' }, [fmt(x.installment)]), el('td', { class: 'num' }, [fmt(x.net)]), el('td', { class: 'num' }, [fmt(x.cumulative)])]);
        }))
      ])])
    ]));
  }

  function drawCoop() {
    G.clear(coOut);
    var r = lastCoop = B.coop({
      kit_tnd: num(S.co_kit), individual_kit_tnd: num(S.co_ind), reserve_pct: (num(S.co_res) || 0) / 100,
      deposit_pct: (num(S.dep) || 0) / 100, term_months: num(S.term) || 36, fee_rate: (num(S.fee) || 0) / 100,
      members: S.members.map(function (m, i) { return { name: m.name || (i === 0 && NX && NX.quota_m3 ? t('me') : '#' + (i + 1)), quota_m3: num(m.quota), diesel_tnd_year: num(m.diesel) }; })
    });
    if (r.missing.length) { coOut.appendChild(G.note('info', t('co_need'))); return; }
    coOut.appendChild(el('div', { class: 'kpis', style: 'margin-top:12px' }, [
      kpi(t('co_allow'), fmt(r.quota_m3) + ' m³', t('per_year'), true),
      kpi(t('co_th_month'), fmt(r.monthly_total) + ' TND', r.term + ' ' + t('months_u')),
      kpi(t('co_fund'), fmt(r.reserve_at_term) + ' TND', fmt(r.reserve_months_cover, 1) + ' ' + t('co_fund_u')),
      kpi(t('co_capex'), r.capex_saved === null ? '—' : fmt(r.capex_saved) + ' TND', '')
    ]));
    coOut.appendChild(el('div', { class: 'gp-table-wrap', style: 'margin-top:12px' }, [el('table', { class: 'gp-table' }, [
      el('thead', null, [el('tr', null, [t('co_name'), t('co_th_share'), t('co_th_dep'), t('co_th_month'), t('co_th_net'), t('co_th_saved')].map(function (h, i) { return el('th', { class: i ? 'num' : null }, [h]); }))]),
      el('tbody', null, r.members.map(function (m) {
        return el('tr', null, [el('td', null, [m.name]), el('td', { class: 'num' }, [fmt(m.share * 100) + ' %']), el('td', { class: 'num' }, [fmt(m.deposit)]),
          el('td', { class: 'num' }, [fmt(m.monthly)]), el('td', { class: 'num' }, [m.net_month === null ? '—' : fmt(m.net_month)]),
          el('td', { class: 'num' }, [m.own_kit_saved === null ? '—' : fmt(m.own_kit_saved)])]);
      }))
    ])]));
  }

  function coopCard() {
    var rows = el('div', { class: 'members' });
    function drawRows() {
      G.clear(rows);
      S.members.forEach(function (m, i) {
        function inp(key, type, label) {
          return el('label', null, [el('span', { class: 'lab' }, [label]), el('input', { type: type, step: 'any', value: m[key] || '', 'aria-label': label + ' ' + (i + 1),
            oninput: function (e) { m[key] = e.target.value; persist(); drawCoop(); drawRes(); } })]);
        }
        rows.appendChild(el('div', { class: 'mrow' }, [
          inp('name', 'text', t('co_name')), inp('quota', 'number', t('co_quota')), inp('diesel', 'number', t('co_diesel')),
          el('button', { type: 'button', 'aria-label': t('co_del') + ' ' + (i + 1), title: t('co_del'), disabled: S.members.length <= 2 ? 'disabled' : null,
            onclick: function () { S.members.splice(i, 1); persist(); drawRows(); drawCoop(); drawRes(); } }, ['×'])
        ]));
      });
    }
    drawRows();
    coOut = el('div', { 'aria-live': 'polite' });
    var f = function (id, k, key) {
      return el('div', { class: 'gp-field' }, [el('label', { for: id }, [t(k)]), el('input', { id: id, type: 'number', step: 'any', value: S[key] || '',
        oninput: function (e) { S[key] = e.target.value; persist(); drawCoop(); drawRes(); } })]);
    };
    return el('section', { class: 'sec-t', 'aria-labelledby': 'h-co' }, [
      el('h2', { id: 'h-co' }, [t('co_t')]),
      el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2);max-width:80ch' }, [t('co_p')]),
      el('div', { class: 'gp-card', style: 'margin-top:12px' }, [
        el('div', { class: 'gp-grid gp-cols-3' }, [f('co-kit', 'co_kit', 'co_kit'), f('co-ind', 'co_ind', 'co_ind'), f('co-res', 'co_res', 'co_res')]),
        rows,
        el('button', { type: 'button', class: 'btn-s', style: 'margin-top:10px', onclick: function () { S.members.push({ name: '', quota: '', diesel: '' }); persist(); drawRows(); } }, ['+ ' + t('co_add')]),
        coOut
      ])
    ]);
  }

  function drawAdoption() {
    G.clear(adOut);
    var a = B.adoption({ ghi_mean: NX ? NX.ghi_mean : null, water_source: NX ? NX.water_source : null, has_quota: !!(NX && NX.quota_m3),
      payg: lastPayg && !lastPayg.missing.length ? lastPayg : null, ease: S.ease, partners: S.partners });
    var keys = { ease: B.EASE_KEYS, partners: B.PARTNER_KEYS }, pre = { ease: 'e_', partners: 'p_' };
    adOut.appendChild(el('p', { style: 'margin-top:10px' }, [el('b', null, [t('overall') + ' : ']), G.pill(a.overall, t({ ok: 'verdict_ok', adapt: 'verdict_adapt', no: 'verdict_no', unk: 'verdict_unk' }[a.overall]))]));
    adOut.appendChild(el('div', { class: 'tests' }, a.tests.map(function (x) {
      var body = [G.pill(x.verdict, t({ ok: 'verdict_ok', adapt: 'verdict_adapt', no: 'verdict_no', unk: 'verdict_unk' }[x.verdict])), el('h3', null, [t('ad_' + x.key)])];
      if (keys[x.key]) {
        body.push(el('p', { class: 'assump' }, [t('declared')]));
        body.push(el('div', { class: 'checks' }, keys[x.key].map(function (k) {
          return el('label', null, [el('input', { type: 'checkbox', checked: S[x.key][k] === true ? 'checked' : null, onchange: function (e) { S[x.key][k] = e.target.checked; persist(); drawAdoption(); } }), el('span', null, [t(pre[x.key] + k)])]);
        })));
      } else {
        body.push(el('ul', null, x.why.map(function (w) { return el('li', null, [t(w)]); })));
      }
      return el('div', { class: 'test' }, body);
    })));
  }

  function drawRes() {
    G.clear(rsOut);
    var c = lastCoop && !lastCoop.missing.length ? lastCoop : null, p = lastPayg && !lastPayg.missing.length ? lastPayg : null;
    var quota = c ? c.quota_m3 : (NX && NX.quota_m3 ? NX.quota_m3 : null);
    var items = [
      ['吸', 'rs_absorb', c ? fmt(c.reserve_months_cover, 1) + ' ' + t('months_u') + ' ' + t('rs_i_fund') : t('rs_i_none')],
      ['適', 'rs_adapt', quota ? fmt(quota) + ' ' + t('rs_i_quota') : t('rs_i_none')],
      ['変', 'rs_transform', p ? fmt(p.yearly_after) + ' ' + t('rs_i_after') : t('rs_i_none')]
    ];
    rsOut.appendChild(el('div', { class: 'res3' }, items.map(function (x) {
      return el('div', { class: 'test' }, [el('span', { class: 'k', 'aria-hidden': 'true' }, [x[0]]), el('h3', null, [t(x[1])]),
        el('p', { class: 'small', style: 'color:var(--g-ink-2)' }, [t(x[1] + '_p')]), x[2] === t('rs_i_none') ? el('p', { class: 'assump', style: 'margin-top:8px' }, [x[2]]) : el('div', { class: 'ind' }, [x[2]])]);
    })));
  }

  function draw() { if (!out) return; drawPayg(); drawCoop(); drawAdoption(); drawRes(); }

  function renderAll() {
    G.clear(app);
    app.appendChild(el('div', { class: 'gp-principle', style: 'margin-bottom:8px' }, [t('principle')]));
    app.appendChild(el('p', { class: 'small', style: 'margin:0 0 14px;color:var(--g-ink-2);max-width:80ch' }, [t('principle_p')]));
    if (NX && (NX.diesel_tnd_year || NX.kit_tnd || NX.quota_m3)) {
      var bits = [];
      if (NX.diesel_tnd_year) bits.push(t('in_diesel').split(' (')[0] + ' ' + fmt(NX.diesel_tnd_year) + ' TND');
      if (NX.kit_tnd) bits.push(t('in_kit').split(' (')[0] + ' ' + fmt(NX.kit_tnd) + ' TND');
      if (NX.quota_m3) bits.push(t('co_quota').split(' (')[0] + ' ' + fmt(NX.quota_m3) + ' m³');
      app.appendChild(G.note('ok', t('from_nexus') + ' ' + bits.join(' · ')));
    } else {
      app.appendChild(el('div', { class: 'gp-note' }, [G.icon('info'), el('div', null, [t('no_nexus') + ' ', el('a', { href: 'nexus.html' }, [t('open_nexus')])])]));
    }
    out = el('div', { 'aria-live': 'polite' });
    app.appendChild(el('div', { class: 'bm', style: 'margin-top:14px' }, [inputs(), el('div', null, [out,
      el('div', { class: 'gp-card', style: 'margin-top:16px' }, [el('h2', null, [t('payg_how_t')]),
        el('ol', { style: 'margin:8px 0 0;padding-inline-start:20px;font-size:14px;color:var(--g-ink-2);display:grid;gap:4px' }, G.t('payg_how').map(function (s) { return el('li', null, [s]); }))])
    ])]));
    app.appendChild(coopCard());
    adOut = el('div', { 'aria-live': 'polite' });
    app.appendChild(el('section', { class: 'sec-t', 'aria-labelledby': 'h-ad' }, [el('h2', { id: 'h-ad' }, [t('ad_t')]),
      el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2);max-width:80ch' }, [t('ad_p')]), adOut]));
    rsOut = el('div');
    app.appendChild(el('section', { class: 'sec-t', 'aria-labelledby': 'h-rs' }, [el('h2', { id: 'h-rs' }, [t('rs_t')]),
      el('p', { class: 'small', style: 'margin-top:6px;color:var(--g-ink-2);max-width:80ch' }, [t('rs_p')]), rsOut]));
    app.appendChild(el('details', { class: 'gp-card gp-more', style: 'margin-top:24px' }, [
      el('summary', null, [t('method_t')]),
      el('div', { class: 'formula' }, ['financed = kit × (1 − deposit) ; total = financed × (1 + rate × term / 12)']),
      el('div', { class: 'formula', style: 'margin-top:6px' }, ['saving_m = diesel_year × w_m − maintenance / 12 ; w_m = kWh_m / Σ kWh (or 1/12)']),
      el('div', { class: 'formula', style: 'margin-top:6px' }, ['seasonal: installment_i = total × w_m(i) / Σ_term w ; affordable ⇔ Σ installments ≤ cap × Σ savings']),
      el('div', { class: 'formula', style: 'margin-top:6px' }, ['coop: share_i = quota_i / Σ quota ; allowance = Σ quota ; fund = reserve × installment × term']),
      el('p', { class: 'small', style: 'margin-top:10px;color:var(--g-ink-2)' }, [t('method_p')])
    ]));
    draw();
  }

  renderAll();
  G.onLang(renderAll);
}());
