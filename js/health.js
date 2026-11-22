/* ==========================================================================
   GAIA VISION (M2) — Plant Health page.

   Pipeline, in order:
   1. Image quality   — computed here, in the browser, on the real photo.
   2. Tree            — stage-1 model (olive / date palm / citrus / other).
   3. Disease         — stage-2 model for that tree.
   4. Confidence      — softmax with the temperature stored in the manifest.
   5. Unknown class   — abstain under the manifest threshold, or tree = other.
   6. Guidance        — only cards validated by an expert, listed in the manifest.

   Steps 2–6 need exported ONNX models described by CONFIG.visionManifest.
   No manifest → the page says the model is not connected. It never shows a
   prediction it did not compute.
   ========================================================================== */

(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt;

  G.addStrings({
    fr: {
      h_title: 'Santé des plantes',
      h_lead: "Photographiez une feuille d'olivier, d'agrume, de palmier dattier, de vigne, de tomate, de pomme de terre ou de poivron. GAIA vérifie d'abord la photo, reconnaît la plante, puis donne la maladie probable — ou dit qu'il n'est pas sûr.",
      up_t: 'Ajouter une photo de feuille', up_p: 'Une seule feuille, à plat, bien éclairée, qui remplit le cadre.',
      up_file: 'Choisir une image', up_cam: 'Prendre une photo', up_drop: 'ou déposez une image ici',
      up_change: 'Changer de photo', up_privacy: "L'image est analysée dans votre navigateur. Elle n'est envoyée nulle part, sauf si vous choisissez vous-même l'identification Pl@ntNet (bouton avec votre accord).",
      s1: 'Qualité de la photo', s2: 'Identification de la plante', s3: 'Maladie probable', s4: 'Confiance', s5: 'Refus si incertain', s6: 'Conseil validé',
      st_wait: 'En attente', st_done: 'Calculé', st_off: 'Modèle non connecté', st_skip: 'Non exécuté',
      q_res: 'Résolution', q_light: 'Luminosité', q_sharp: 'Netteté', q_leaf: 'Part de végétation',
      q_ok: 'Correcte', q_warn: 'Limite', q_bad: 'Insuffisante',
      q_sum_ok: 'Photo exploitable.', q_sum_warn: 'Photo exploitable, mais un critère est limite : le résultat sera moins fiable.', q_sum_bad: 'Photo insuffisante : reprenez-la avant tout diagnostic.',
      q_method_t: 'Comment la qualité est mesurée',
      q_method: 'Méthode : résolution de l’image d’origine ; luminance moyenne ; variance du laplacien (netteté) ; part de pixels verts à jaunes (teinte, saturation). Les seuils sont des heuristiques de GAIA, pas des normes.',
      tips_t: 'Pour une meilleure photo',
      tip1: 'Feuille entière, à plat, sur un fond uni.', tip2: 'Lumière du jour, sans soleil direct ni contre-jour.', tip3: 'Tenez le téléphone immobile, à 20–30 cm.',
      off_t: 'Le modèle de vision n’est pas encore connecté',
      off_p: "Aucun modèle n'a été entraîné et exporté pour cette version. GAIA ne montre donc ni arbre, ni maladie, ni pourcentage : il n'invente aucun diagnostic.",
      off_need: 'Pour activer les étapes 2 à 6 :',
      off_1: 'Entraîner les modèles (étape 1 : arbre ; étape 2 : une maladie par arbre) et les exporter en ONNX.',
      off_2: 'Déposer les fichiers et un manifeste à l’adresse configurée :',
      off_3: 'Le manifeste fixe la température de calibration, le seuil de refus et les fiches de conseil validées.',
      off_manifest: 'Exemple de manifeste',
      off_err: 'Manifeste trouvé mais inutilisable : ',
      run: 'Lancer le diagnostic', running: 'Analyse en cours…',
      tree: 'Plante reconnue', disease: 'Maladie probable', conf: 'Confiance calibrée', top: 'Probabilités',
      unsure_t: 'Je ne suis pas sûr', unsure_p: 'La confiance est sous le seuil fixé pour ce modèle. GAIA préfère ne pas répondre. Reprenez une photo d’une autre feuille, ou montrez la plante à un technicien.',
      other_t: 'Plante non reconnue', other_p: 'Cette feuille ne ressemble à aucune des plantes que le modèle connaît ({l}).',
      hes_t: 'GAIA hésite', hes_p: 'Le modèle penche pour « autre plante » mais n’exclut pas : {c}. Reprenez une seule feuille, à plat, sur un fond uni, puis relancez.',
      tr_other_res: 'Autre plante (hors modèle)', supported_t: 'Plantes reconnues par le modèle actuel : {l}.',
      g_none: "Aucune fiche de conseil validée par un expert n'est encore associée à ce résultat.",
      g_by: 'Validée par', limits_t: 'Limites de ce diagnostic',
      lim1: "Les images d'entraînement ne viennent pas de Tunisie : le résultat doit être confirmé sur le terrain.",
      lim2: 'Un symptôme peut avoir plusieurs causes (carence, sécheresse, ravageur).',
      lim3: 'GAIA ne prescrit aucun traitement chimique.',
      kz_t: 'GAIA Kaizen — corriger le résultat', kz_p: "Si vous savez ce qu'a la plante, dites-le. Chaque correction est relue par un agronome avant de servir à réentraîner un modèle.",
      kz_tree: 'Plante', kz_label: 'Ce que vous observez', kz_label_ph: 'ex. œil de paon, carence, rien de grave…', kz_note: 'Commentaire (facultatif)', kz_send: 'Enregistrer la correction',
      kz_saved: 'Correction enregistrée sur cet appareil, en attente de relecture.', kz_sent: 'Correction envoyée au serveur GAIA pour relecture.',
      kz_q: 'Corrections en attente sur cet appareil :', kz_export: 'Exporter (JSON)', kz_need_img: 'Ajoutez d’abord une photo.',
      tr_kaki: 'Kaki (plaqueminier)', tr_apple: 'Pommier', tr_blueberry: 'Myrtillier', tr_cherry: 'Cerisier', tr_corn: 'Maïs', tr_grape: 'Vigne', tr_peach: 'Pêcher', tr_pepper: 'Poivron', tr_potato: 'Pomme de terre', tr_raspberry: 'Framboisier', tr_soybean: 'Soja', tr_squash: 'Courge', tr_strawberry: 'Fraisier', tr_tomato: 'Tomate',
      tr_olive: 'Olivier', tr_palm: 'Palmier dattier', tr_citrus: 'Agrumes', tr_other: 'Autre / je ne sais pas',
      supported: 'Plantes prises en charge : olivier, palmier dattier, agrumes, kaki, tomate, pomme de terre, poivron, vigne, pommier, pêcher, cerisier, fraisier, maïs, soja, courge, myrtillier, framboisier.'
    },
    ar: {
      h_title: 'صحة النبات',
      h_lead: 'صوّر ورقة زيتون أو قوارص أو نخيل أو عنب أو طماطم أو بطاطا أو فلفل. تتحقق غايا أولاً من جودة الصورة، ثم تتعرف على النبتة، ثم تقترح المرض المحتمل — أو تقول إنها غير متأكدة.',
      up_t: 'أضف صورة ورقة', up_p: 'ورقة واحدة، مسطحة، جيدة الإضاءة، تملأ الإطار.',
      up_file: 'اختر صورة', up_cam: 'التقط صورة', up_drop: 'أو اسحب الصورة إلى هنا',
      up_change: 'تغيير الصورة', up_privacy: 'تُحلَّل الصورة داخل متصفحك ولا تُرسل إلى أي مكان، إلا إذا اخترتَ بنفسك التعرّف عبر Pl@ntNet (زر بموافقتك).',
      s1: 'جودة الصورة', s2: 'التعرف على النبتة', s3: 'المرض المحتمل', s4: 'درجة الثقة', s5: 'الامتناع عند الشك', s6: 'نصيحة مصادق عليها',
      st_wait: 'في الانتظار', st_done: 'تم الحساب', st_off: 'النموذج غير متصل', st_skip: 'لم يُنفَّذ',
      q_res: 'الدقة', q_light: 'الإضاءة', q_sharp: 'الوضوح', q_leaf: 'نسبة النبات',
      q_ok: 'جيدة', q_warn: 'على الحد', q_bad: 'غير كافية',
      q_sum_ok: 'الصورة صالحة للتحليل.', q_sum_warn: 'الصورة صالحة لكن أحد المعايير على الحد، فستكون النتيجة أقل موثوقية.', q_sum_bad: 'الصورة غير كافية: أعد التقاطها قبل أي تشخيص.',
      q_method_t: 'كيف تُقاس الجودة',
      q_method: 'الطريقة: دقة الصورة الأصلية؛ متوسط الإضاءة؛ تباين اللابلاسيان (الوضوح)؛ نسبة البكسلات الخضراء إلى الصفراء. العتبات تقديرية من غايا وليست معايير رسمية.',
      tips_t: 'لصورة أفضل',
      tip1: 'ورقة كاملة ومسطحة على خلفية موحدة.', tip2: 'ضوء النهار دون شمس مباشرة أو إضاءة خلفية.', tip3: 'أمسك الهاتف ثابتاً على بعد 20 إلى 30 سم.',
      off_t: 'نموذج الرؤية غير متصل بعد',
      off_p: 'لم يُدرَّب أي نموذج ولم يُصدَّر في هذه النسخة. لذلك لا تعرض غايا شجرة ولا مرضاً ولا نسبة مئوية: فهي لا تخترع أي تشخيص.',
      off_need: 'لتفعيل المراحل من 2 إلى 6:',
      off_1: 'تدريب النماذج (المرحلة 1: الشجرة؛ المرحلة 2: المرض لكل شجرة) وتصديرها بصيغة ONNX.',
      off_2: 'وضع الملفات وملف التعريف في العنوان المحدد:',
      off_3: 'يحدد ملف التعريف حرارة المعايرة وعتبة الامتناع وبطاقات النصح المصادق عليها.',
      off_manifest: 'مثال على ملف التعريف',
      off_err: 'ملف التعريف موجود لكنه غير صالح: ',
      run: 'ابدأ التشخيص', running: 'جارٍ التحليل…',
      tree: 'النبتة', disease: 'المرض المحتمل', conf: 'الثقة بعد المعايرة', top: 'الاحتمالات',
      unsure_t: 'لست متأكدة', unsure_p: 'الثقة أقل من العتبة المحددة لهذا النموذج، لذلك تفضّل غايا عدم الإجابة. صوّر ورقة أخرى أو اعرض النبتة على تقني.',
      other_t: 'نبتة غير معروفة', other_p: 'لا تشبه هذه الورقة أيّاً من النباتات التي يعرفها النموذج ({l}).',
      hes_t: 'غايا مترددة', hes_p: 'يميل النموذج إلى «نبتة أخرى» لكنه لا يستبعد: {c}. صوّر ورقة واحدة مسطحة على خلفية موحدة ثم أعد المحاولة.',
      tr_other_res: 'نبتة أخرى (خارج النموذج)', supported_t: 'النباتات التي يتعرف عليها النموذج الحالي: {l}.',
      g_none: 'لا توجد بعد بطاقة نصح مصادق عليها من خبير لهذه النتيجة.',
      g_by: 'صادق عليها', limits_t: 'حدود هذا التشخيص',
      lim1: 'صور التدريب ليست من تونس: يجب تأكيد النتيجة في الحقل.',
      lim2: 'قد يكون للعَرَض الواحد عدة أسباب (نقص غذائي، جفاف، آفة).',
      lim3: 'لا تصف غايا أي علاج كيميائي.',
      kz_t: 'غايا كايزن — تصحيح النتيجة', kz_p: 'إذا كنت تعرف ما تعانيه النبتة فأخبرنا. يراجع مهندس فلاحي كل تصحيح قبل استعماله لإعادة تدريب النموذج.',
      kz_tree: 'النبتة', kz_label: 'ما تلاحظه', kz_label_ph: 'مثال: عين الطاووس، نقص غذائي، لا شيء خطير…', kz_note: 'تعليق (اختياري)', kz_send: 'حفظ التصحيح',
      kz_saved: 'حُفظ التصحيح على هذا الجهاز في انتظار المراجعة.', kz_sent: 'أُرسل التصحيح إلى خادم غايا للمراجعة.',
      kz_q: 'تصحيحات في الانتظار على هذا الجهاز:', kz_export: 'تصدير (JSON)', kz_need_img: 'أضف صورة أولاً.',
      tr_kaki: 'كاكا', tr_apple: 'تفاح', tr_blueberry: 'توت أزرق', tr_cherry: 'كرز', tr_corn: 'ذرة', tr_grape: 'عنب', tr_peach: 'خوخ', tr_pepper: 'فلفل', tr_potato: 'بطاطا', tr_raspberry: 'توت العليق', tr_soybean: 'صويا', tr_squash: 'قرع', tr_strawberry: 'فراولة', tr_tomato: 'طماطم',
      tr_olive: 'زيتون', tr_palm: 'نخيل التمر', tr_citrus: 'قوارص', tr_other: 'أخرى / لا أعرف',
      supported: 'النباتات المدعومة: الزيتون، نخيل التمر، القوارص، الكاكا، الطماطم، البطاطا، الفلفل، العنب، التفاح، الخوخ، الكرز، الفراولة، الذرة، الصويا، القرع، التوت الأزرق، توت العليق.'
    },
    en: {
      h_title: 'Plant health',
      h_lead: 'Photograph a leaf of olive, citrus, date palm, grape, tomato, potato or pepper. GAIA first checks the photo, recognises the plant, then gives the likely disease — or says it is not sure.',
      up_t: 'Add a photo of a leaf', up_p: 'A single leaf, flat, well lit, filling the frame.',
      up_file: 'Choose an image', up_cam: 'Take a photo', up_drop: 'or drop an image here',
      up_change: 'Change photo', up_privacy: 'The image is analysed in your browser. It is not sent anywhere, unless you choose the Pl@ntNet identification yourself (button, with your consent).',
      s1: 'Photo quality', s2: 'Plant identification', s3: 'Likely disease', s4: 'Confidence', s5: 'Refusal when unsure', s6: 'Validated advice',
      st_wait: 'Waiting', st_done: 'Calculated', st_off: 'Model not connected', st_skip: 'Not run',
      q_res: 'Resolution', q_light: 'Brightness', q_sharp: 'Sharpness', q_leaf: 'Share of vegetation',
      q_ok: 'Good', q_warn: 'Borderline', q_bad: 'Insufficient',
      q_sum_ok: 'Usable photo.', q_sum_warn: 'Usable photo, but one criterion is borderline: the result will be less reliable.', q_sum_bad: 'Photo not good enough: retake it before any diagnosis.',
      q_method_t: 'How quality is measured',
      q_method: 'Method: resolution of the original image; mean luminance; variance of the Laplacian (sharpness); share of green to yellow pixels (hue, saturation). The thresholds are GAIA heuristics, not standards.',
      tips_t: 'For a better photo',
      tip1: 'Whole leaf, flat, on a plain background.', tip2: 'Daylight, without direct sun or backlight.', tip3: 'Hold the phone still, 20–30 cm away.',
      off_t: 'The vision model is not connected yet',
      off_p: 'No model has been trained and exported for this version. So GAIA shows no tree, no disease and no percentage: it invents no diagnosis.',
      off_need: 'To turn on steps 2 to 6:',
      off_1: 'Train the models (stage 1: tree; stage 2: one disease model per tree) and export them to ONNX.',
      off_2: 'Put the files and a manifest at the configured address:',
      off_3: 'The manifest sets the calibration temperature, the refusal threshold and the validated advice records.',
      off_manifest: 'Example manifest',
      off_err: 'Manifest found but unusable: ',
      run: 'Run the diagnosis', running: 'Analysing…',
      tree: 'Plant recognised', disease: 'Likely disease', conf: 'Calibrated confidence', top: 'Probabilities',
      unsure_t: 'I am not sure', unsure_p: 'Confidence is below the threshold set for this model. GAIA prefers not to answer. Take a photo of another leaf, or show the plant to a technician.',
      other_t: 'Plant not recognised', other_p: 'This leaf does not look like any of the plants the model knows ({l}).',
      hes_t: 'GAIA is hesitating', hes_p: 'The model leans towards “other plant” but does not rule out: {c}. Take a single leaf, flat, on a plain background, and run it again.',
      tr_other_res: 'Other plant (not in the model)', supported_t: 'Plants the current model recognises: {l}.',
      g_none: 'No advice record validated by an expert is linked to this result yet.',
      g_by: 'Validated by', limits_t: 'Limits of this diagnosis',
      lim1: 'The training images do not come from Tunisia: the result must be confirmed in the field.',
      lim2: 'A symptom can have several causes (deficiency, drought, pest).',
      lim3: 'GAIA prescribes no chemical treatment.',
      kz_t: 'GAIA Kaizen — correct the result', kz_p: 'If you know what the plant has, say so. Every correction is reviewed by an agronomist before it is used to retrain a model.',
      kz_tree: 'Plant', kz_label: 'What you observe', kz_label_ph: 'e.g. peacock spot, deficiency, nothing serious…', kz_note: 'Comment (optional)', kz_send: 'Save the correction',
      kz_saved: 'Correction saved on this device, waiting for review.', kz_sent: 'Correction sent to the GAIA server for review.',
      kz_q: 'Corrections waiting on this device:', kz_export: 'Export (JSON)', kz_need_img: 'Add a photo first.',
      tr_kaki: 'Persimmon', tr_apple: 'Apple', tr_blueberry: 'Blueberry', tr_cherry: 'Cherry', tr_corn: 'Corn', tr_grape: 'Grape', tr_peach: 'Peach', tr_pepper: 'Pepper', tr_potato: 'Potato', tr_raspberry: 'Raspberry', tr_soybean: 'Soybean', tr_squash: 'Squash', tr_strawberry: 'Strawberry', tr_tomato: 'Tomato',
      tr_olive: 'Olive', tr_palm: 'Date palm', tr_citrus: 'Citrus', tr_other: 'Other / I don’t know',
      supported: 'Supported plants: olive, date palm, citrus, persimmon, tomato, potato, pepper, grape, apple, peach, cherry, strawberry, corn, soybean, squash, blueberry, raspberry.'
    },
    ja: {
      h_title: '植物の健康',
      h_lead: 'オリーブ、柑橘、ナツメヤシ、ブドウ、トマト、ジャガイモ、ピーマンの葉を撮影してください。GAIAはまず写真を確認し、植物を識別してから、考えられる病気を示します。確信がなければそう伝えます。',
      up_t: '葉の写真を追加', up_p: '葉は1枚、平らにして明るく、画面いっぱいに。',
      up_file: '画像を選ぶ', up_cam: '写真を撮る', up_drop: 'または画像をここにドロップ',
      up_change: '写真を変更', up_privacy: '画像はブラウザ内で分析され、どこにも送信されません。ただし、ご自身でPl@ntNetによる同定を選んだ場合のみ、同意のうえで送信されます。',
      s1: '写真の画質', s2: '植物の識別', s3: '考えられる病気', s4: '信頼度', s5: '不確かなら回答しない', s6: '検証済みの助言',
      st_wait: '待機中', st_done: '計算済み', st_off: 'モデル未接続', st_skip: '未実行',
      q_res: '解像度', q_light: '明るさ', q_sharp: 'シャープさ', q_leaf: '植物の割合',
      q_ok: '良好', q_warn: 'ぎりぎり', q_bad: '不十分',
      q_sum_ok: '使える写真です。', q_sum_warn: '使える写真ですが、1つの基準がぎりぎりです。結果の信頼性は下がります。', q_sum_bad: '写真が不十分です。診断の前に撮り直してください。',
      q_method_t: '画質の測り方',
      q_method: '方法：元画像の解像度、平均輝度、ラプラシアンの分散（シャープさ）、緑〜黄色のピクセルの割合（色相、彩度）。しきい値はGAIAの経験則で、規格ではありません。',
      tips_t: 'よりよい写真のために',
      tip1: '葉全体を、平らに、無地の背景で。', tip2: '直射日光や逆光を避けた自然光で。', tip3: 'スマートフォンを20〜30 cm離し、動かさずに。',
      off_t: '画像認識モデルはまだ接続されていません',
      off_p: 'このバージョンでは、学習・エクスポート済みのモデルがありません。そのためGAIAは樹種も病気も割合も表示しません。診断を作り出すことはしません。',
      off_need: 'ステップ2〜6を有効にするには：',
      off_1: 'モデルを学習させ（ステージ1：樹種、ステージ2：樹種ごとの病気）、ONNXにエクスポートする。',
      off_2: '設定したアドレスにファイルとマニフェストを置く：',
      off_3: 'マニフェストで、キャリブレーション温度、回答しないしきい値、検証済みの助言記録を定めます。',
      off_manifest: 'マニフェストの例',
      off_err: 'マニフェストは見つかりましたが使用できません：',
      run: '診断を実行', running: '分析中…',
      tree: '識別した植物', disease: '考えられる病気', conf: '調整済みの信頼度', top: '確率',
      unsure_t: '確信がありません', unsure_p: '信頼度がこのモデルのしきい値を下回っています。GAIAは回答を控えます。別の葉を撮影するか、技術者に植物を見てもらってください。',
      other_t: '認識できない植物', other_p: 'この葉は、モデルが知っている植物（{l}）のどれにも似ていません。',
      hes_t: 'GAIAは迷っています', hes_p: 'モデルは「その他の植物」に傾いていますが、次の可能性も残ります：{c}。葉を1枚、平らにして無地の背景で撮り直し、もう一度実行してください。',
      tr_other_res: 'その他の植物（モデル外）', supported_t: '現在のモデルが認識できる植物：{l}。',
      g_none: 'この結果に結びついた、専門家検証済みの助言記録はまだありません。',
      g_by: '検証者', limits_t: 'この診断の限界',
      lim1: '学習用の画像はチュニジアのものではありません。結果は現地で確認する必要があります。',
      lim2: '1つの症状に複数の原因がありえます（栄養欠乏、干ばつ、害虫）。',
      lim3: 'GAIAは化学的な処置を指示しません。',
      kz_t: 'GAIAカイゼン — 結果を修正する', kz_p: '植物の状態がわかる場合は教えてください。修正はすべて農業技術者が確認してから、モデルの再学習に使われます。',
      kz_tree: '植物', kz_label: '観察したこと', kz_label_ph: '例：クジャク病、栄養欠乏、深刻ではない…', kz_note: 'コメント（任意）', kz_send: '修正を保存',
      kz_saved: '修正はこの端末に保存され、確認待ちです。', kz_sent: '修正を確認のためGAIAサーバーに送信しました。',
      kz_q: 'この端末で確認待ちの修正：', kz_export: 'エクスポート（JSON）', kz_need_img: 'まず写真を追加してください。',
      tr_kaki: '柿', tr_apple: 'リンゴ', tr_blueberry: 'ブルーベリー', tr_cherry: 'サクランボ', tr_corn: 'トウモロコシ', tr_grape: 'ブドウ', tr_peach: 'モモ', tr_pepper: 'ピーマン', tr_potato: 'ジャガイモ', tr_raspberry: 'ラズベリー', tr_soybean: '大豆', tr_squash: 'カボチャ', tr_strawberry: 'イチゴ', tr_tomato: 'トマト',
      tr_olive: 'オリーブ', tr_palm: 'ナツメヤシ', tr_citrus: '柑橘', tr_other: 'その他／わからない',
      supported: '対象の植物：オリーブ、ナツメヤシ、柑橘、柿、トマト、ジャガイモ、ピーマン、ブドウ、リンゴ、モモ、サクランボ、イチゴ、トウモロコシ、大豆、カボチャ、ブルーベリー、ラズベリー。'
    }
  });

  G.mountShell('health');
  var app = document.getElementById('app');

  var state = { img: null, quality: null, model: { status: 'checking', manifest: null, error: null }, result: null, running: false, file: null, pn: { status: 'idle' }, pnAvail: 'checking' };

  G.addStrings({
    fr: { pn_t: "Identifier la plante avec Pl@ntNet (service externe)", pn_p: "GAIA ne connaît pas encore cette plante, ou n'est pas sûr. Avec votre accord, la photo (réduite, sans position GPS) est envoyée à Pl@ntNet, un service scientifique, pour trouver le nom de l'espèce et d'éventuelles anomalies.",
          pn_send: 'Oui, envoyer la photo', pn_no: 'Non merci', pn_loading: 'Pl@ntNet analyse la photo…', pn_declined: "Photo non envoyée. Vous pouvez changer d'avis :", pn_again: 'Identifier avec Pl@ntNet',
          pn_res_t: 'Résultat Pl@ntNet (externe)', pn_species: 'Espèce probable', pn_none: "Aucune espèce trouvée.", pn_not_plant: "Pl@ntNet ne reconnaît pas de plante sur cette photo.",
          pn_dis: 'Anomalies possibles', pn_dis_none: "Pl@ntNet ne signale aucune anomalie connue.", pn_dis_unavail: "La recherche d'anomalies n'est pas disponible pour le moment.",
          pn_ext: "Résultat externe, non validé par un agronome GAIA. GAIA ne donne aucun conseil de traitement pour cette plante : demandez l'avis d'un technicien.",
          pn_err_key: "Pl@ntNet n'est pas configuré sur le serveur (clé API manquante) : ajoutez PLANTNET_API_KEY dans backend/.env puis redémarrez le serveur.",
          pn_err_server: "Le serveur GAIA ne répond pas ({u}). Pl@ntNet passe par ce serveur (la clé reste côté serveur) : dans backend/, lancez « uvicorn gaia.main:app --reload » (port 8000 ; 8765 marche aussi), puis Réessayer.",
          pn_err_badkey: 'Pl@ntNet a refusé la clé API du serveur : vérifiez PLANTNET_API_KEY.', pn_err_up: 'Le serveur GAIA ne parvient pas à joindre Pl@ntNet (réseau).',
          pn_err_http: 'Pl@ntNet a répondu par une erreur : {m}', pn_err_img: 'Image refusée : {m}',
          pn_off_server: 'Identification Pl@ntNet indisponible : le serveur GAIA ne tourne pas (cherché sur les ports 8000 et 8765). Tout le reste de la page marche sans lui. Pour Pl@ntNet : dans backend/, lancez « uvicorn gaia.main:app --reload », puis Vérifier à nouveau.', pn_recheck: 'Vérifier à nouveau',
          pn_off_key: 'Identification Pl@ntNet indisponible : le serveur GAIA tourne, mais sans clé Pl@ntNet (PLANTNET_API_KEY dans backend/.env).', pn_err_quota: "Quota Pl@ntNet du jour atteint. Réessayez demain.", pn_err: "Pl@ntNet n'a pas pu répondre.", pn_retry: 'Réessayer', pn_left: 'demandes restantes aujourd’hui' },
    ar: { pn_t: 'التعرّف على النبتة عبر Pl@ntNet (خدمة خارجية)', pn_p: 'لا تعرف غايا هذه النبتة بعد أو أنها غير متأكدة. بموافقتك تُرسل الصورة (مصغّرة وبدون موقع GPS) إلى Pl@ntNet، وهي خدمة علمية، لمعرفة اسم النوع وأي أمراض محتملة.',
          pn_send: 'نعم، أرسل الصورة', pn_no: 'لا، شكراً', pn_loading: 'Pl@ntNet يحلّل الصورة…', pn_declined: 'لم تُرسل الصورة. يمكنك تغيير رأيك:', pn_again: 'التعرّف عبر Pl@ntNet',
          pn_res_t: 'نتيجة Pl@ntNet (خارجية)', pn_species: 'النوع المحتمل', pn_none: 'لم يُعثر على أي نوع.', pn_not_plant: 'لا يتعرّف Pl@ntNet على نبتة في هذه الصورة.',
          pn_dis: 'أمراض أو أضرار محتملة', pn_dis_none: 'لا يشير Pl@ntNet إلى أي مرض معروف.', pn_dis_unavail: 'البحث عن الأمراض غير متاح حالياً.',
          pn_ext: 'نتيجة خارجية لم يصادق عليها مهندس فلاحي من غايا. لا تقدّم غايا أي نصيحة علاج لهذه النبتة: استشر تقنياً.',
          pn_err_key: 'Pl@ntNet غير مُعدّ على الخادم (مفتاح API مفقود): أضف PLANTNET_API_KEY في backend/.env ثم أعد تشغيل الخادم.',
          pn_err_server: 'خادم غايا لا يستجيب ({u}). يمرّ Pl@ntNet عبر هذا الخادم (المفتاح يبقى فيه): في backend/ شغّل «uvicorn gaia.main:app --reload» (المنفذ 8000؛ 8765 يعمل أيضاً) ثم أعد المحاولة.',
          pn_err_badkey: 'رفض Pl@ntNet مفتاح API الخاص بالخادم: تحقق من PLANTNET_API_KEY.', pn_err_up: 'لا يستطيع خادم غايا الوصول إلى Pl@ntNet (الشبكة).',
          pn_err_http: 'ردّ Pl@ntNet بخطأ: {m}', pn_err_img: 'الصورة مرفوضة: {m}',
          pn_off_server: 'التعرف عبر Pl@ntNet غير متاح: خادم غايا لا يعمل (بحثنا في المنفذين 8000 و8765). بقية الصفحة تعمل دونه. من أجل Pl@ntNet: في backend/ شغّل «uvicorn gaia.main:app --reload» ثم اضغط «تحقق مجدداً».', pn_recheck: 'تحقق مجدداً',
          pn_off_key: 'التعرف عبر Pl@ntNet غير متاح: خادم غايا يعمل لكن دون مفتاح Pl@ntNet (PLANTNET_API_KEY في backend/.env).', pn_err_quota: 'بلغتَ حصة Pl@ntNet اليومية. أعد المحاولة غداً.', pn_err: 'تعذّر على Pl@ntNet الردّ.', pn_retry: 'إعادة المحاولة', pn_left: 'طلبات متبقية اليوم' },
    en: { pn_t: 'Identify the plant with Pl@ntNet (external service)', pn_p: 'GAIA does not know this plant yet, or is unsure. With your consent, the photo (downsized, without GPS data) is sent to Pl@ntNet, a scientific service, to find the species name and possible anomalies.',
          pn_send: 'Yes, send the photo', pn_no: 'No thanks', pn_loading: 'Pl@ntNet is analysing the photo…', pn_declined: 'Photo not sent. You can change your mind:', pn_again: 'Identify with Pl@ntNet',
          pn_res_t: 'Pl@ntNet result (external)', pn_species: 'Likely species', pn_none: 'No species found.', pn_not_plant: 'Pl@ntNet does not recognise a plant in this photo.',
          pn_dis: 'Possible anomalies', pn_dis_none: 'Pl@ntNet reports no known anomaly.', pn_dis_unavail: 'Anomaly search is not available right now.',
          pn_ext: 'External result, not validated by a GAIA agronomist. GAIA gives no treatment advice for this plant: ask a technician.',
          pn_err_key: 'Pl@ntNet is not configured on the server (API key missing): add PLANTNET_API_KEY to backend/.env and restart the server.',
          pn_err_server: 'The GAIA server is not responding ({u}). Pl@ntNet goes through this server (the key stays there): in backend/, run “uvicorn gaia.main:app --reload” (port 8000; 8765 also works), then Retry.',
          pn_err_badkey: 'Pl@ntNet refused the server’s API key: check PLANTNET_API_KEY.', pn_err_up: 'The GAIA server cannot reach Pl@ntNet (network).',
          pn_err_http: 'Pl@ntNet answered with an error: {m}', pn_err_img: 'Image refused: {m}',
          pn_off_server: 'Pl@ntNet identification unavailable: the GAIA server is not running (looked on ports 8000 and 8765). The rest of this page works without it. For Pl@ntNet: in backend/, run “uvicorn gaia.main:app --reload”, then Check again.', pn_recheck: 'Check again',
          pn_off_key: 'Pl@ntNet identification unavailable: the GAIA server is running, but without a Pl@ntNet key (PLANTNET_API_KEY in backend/.env).', pn_err_quota: "Today's Pl@ntNet quota is reached. Try again tomorrow.", pn_err: 'Pl@ntNet could not answer.', pn_retry: 'Retry', pn_left: 'requests left today' },
    ja: { pn_t: 'Pl@ntNet（外部サービス）で植物を同定する', pn_p: 'GAIAはこの植物をまだ知らないか、確信が持てません。同意いただければ、写真（縮小・GPS情報なし）を科学サービスPl@ntNetに送り、種名と考えられる異常を調べます。',
          pn_send: 'はい、写真を送る', pn_no: '送らない', pn_loading: 'Pl@ntNetが写真を解析中…', pn_declined: '写真は送信されていません。気が変わったら：', pn_again: 'Pl@ntNetで同定',
          pn_res_t: 'Pl@ntNetの結果（外部）', pn_species: '可能性の高い種', pn_none: '種が見つかりませんでした。', pn_not_plant: 'この写真にPl@ntNetは植物を認識できません。',
          pn_dis: '考えられる異常', pn_dis_none: 'Pl@ntNetは既知の異常を報告していません。', pn_dis_unavail: '現在、異常の検索は利用できません。',
          pn_ext: '外部の結果で、GAIAの農学者による検証はありません。この植物についてGAIAは処置の助言をしません。技術者に相談してください。',
          pn_err_key: 'サーバーでPl@ntNetが設定されていません（APIキーなし）。backend/.env に PLANTNET_API_KEY を追加し、サーバーを再起動してください。',
          pn_err_server: 'GAIAサーバーが応答しません（{u}）。Pl@ntNetはこのサーバーを経由します（キーはサーバー側に保管）。backend/ で「uvicorn gaia.main:app --reload」を実行し（ポート8000、8765も可）、再試行してください。',
          pn_err_badkey: 'Pl@ntNetがサーバーのAPIキーを拒否しました。PLANTNET_API_KEY を確認してください。', pn_err_up: 'GAIAサーバーがPl@ntNetに接続できません（ネットワーク）。',
          pn_err_http: 'Pl@ntNetがエラーを返しました：{m}', pn_err_img: '画像が受け付けられませんでした：{m}',
          pn_off_server: 'Pl@ntNetによる同定は利用できません。GAIAサーバーが起動していません（ポート8000と8765を確認）。このページの他の機能はサーバーなしで動きます。Pl@ntNetを使うには backend/ で「uvicorn gaia.main:app --reload」を実行し、「再確認」を押してください。', pn_recheck: '再確認',
          pn_off_key: 'Pl@ntNetによる同定は利用できません。GAIAサーバーは起動していますが、Pl@ntNetのキーがありません（backend/.env の PLANTNET_API_KEY）。', pn_err_quota: '本日のPl@ntNetの上限に達しました。明日もう一度お試しください。', pn_err: 'Pl@ntNetが応答できませんでした。', pn_retry: '再試行', pn_left: '本日の残り回数' }
  });

  G.addStrings({
    fr: { pl_t: 'Identification de l\'espèce (modèle Pl@ntNet, sur l\'appareil)', pl_p: 'Le modèle ouvert de Pl@ntNet (7 806 espèces de la flore méditerranéenne, licence Apache-2.0) tourne dans votre navigateur : la photo ne quitte pas l\'appareil, aucune clé n\'est nécessaire.',
          pl_run: 'Identifier l\'espèce', pl_loading: 'Identification en cours (premier usage : 20 Mo à télécharger)…', pl_agree: 'Concorde avec GAIA', pl_disagree: 'Ne concorde pas avec GAIA : reprenez la photo ou montrez la plante à un technicien', pl_err: 'Le modèle Pl@ntNet n\'a pas pu être chargé : ',
          pl_note: 'Le modèle reconnaît des espèces, pas les maladies. La tomate et le poivron cultivés ne sont pas dans sa liste (flore sauvage) : GAIA utilise alors son propre modèle.', pl_family: 'famille', pl_low: 'Le modèle n’est pas sûr (première espèce à {p} %) : ces noms sont des pistes, pas une identification. Photographiez un rameau entier (feuilles, fleurs ou fruits) plutôt qu’une seule feuille.', pick_t: 'Mauvaise plante ? Choisissez-la :', doubt_t: 'Est-ce vraiment : {p} ?', doubt_p: 'Le modèle Pl@ntNet ne voit presque rien de la famille de la tomate (Solanacées, {s} %) sur cette photo ; il voit d’abord {f}. GAIA préfère vous demander la plante plutôt que de deviner.', manual_p: 'Plante choisie par vous ; le premier modèle de GAIA proposait : {s}.', pl_routed: 'Plante reconnue par le modèle Pl@ntNet ({p} %) ; le premier modèle de GAIA proposait : {s}. Les deux modèles ensemble passent de 59 % à 80 % de plantes bien reconnues sur des photos de terrain.',
          pn_key_how: 'Clé gratuite : créez un compte sur my.plantnet.org, menu « Your API key » (500 identifications par jour gratuites), puis écrivez PLANTNET_API_KEY=votre_clé dans backend/.env et relancez le serveur.' },
    ar: { pl_t: 'التعرف على النوع (نموذج Pl@ntNet على الجهاز)', pl_p: 'يعمل نموذج Pl@ntNet المفتوح (7806 نوعاً من النباتات المتوسطية، رخصة Apache-2.0) داخل متصفحك: لا تغادر الصورة الجهاز ولا حاجة لمفتاح.',
          pl_run: 'تعرّف على النوع', pl_loading: 'جارٍ التعرف (أول استعمال: تنزيل 20 م.ب)…', pl_agree: 'يتفق مع غايا', pl_disagree: 'لا يتفق مع غايا: أعد التصوير أو اعرض النبتة على تقني', pl_err: 'تعذّر تحميل نموذج Pl@ntNet: ',
          pl_note: 'يتعرف النموذج على الأنواع لا على الأمراض. الطماطم والفلفل المزروعان ليسا في قائمته (نباتات برية)، فتستعمل غايا نموذجها الخاص.', pl_family: 'الفصيلة', pl_low: 'النموذج غير متأكد (النوع الأول بنسبة {p} %): هذه الأسماء احتمالات وليست تعريفاً. صوّر غصناً كاملاً (أوراق أو أزهار أو ثمار) بدل ورقة واحدة.', pick_t: 'نبتة خاطئة؟ اخترها:', doubt_t: 'هل هي حقاً: {p}؟', doubt_p: 'لا يرى نموذج Pl@ntNet تقريباً أي نبتة من فصيلة الطماطم (الباذنجانية، {s} %) في هذه الصورة؛ يرى أولاً {f}. تفضّل غايا أن تسألك عن النبتة بدل التخمين.', manual_p: 'نبتة اخترتها أنت؛ النموذج الأول لغايا اقترح: {s}.', pl_routed: 'تعرّف نموذج Pl@ntNet على النبتة ({p} %)؛ النموذج الأول لغايا اقترح: {s}. معاً يرتفع التعرف الصحيح على صور الحقل من 59 % إلى 80 %.',
          pn_key_how: 'مفتاح مجاني: أنشئ حساباً في my.plantnet.org، ثم «Your API key» (500 تعرف يومياً مجاناً)، واكتب PLANTNET_API_KEY=مفتاحك في backend/.env وأعد تشغيل الخادم.' },
    en: { pl_t: 'Species identification (Pl@ntNet model, on this device)', pl_p: 'Pl@ntNet\'s open model (7,806 species of the Mediterranean flora, Apache-2.0 licence) runs in your browser: the photo never leaves the device and no key is needed.',
          pl_run: 'Identify the species', pl_loading: 'Identifying (first use: 20 MB download)…', pl_agree: 'Agrees with GAIA', pl_disagree: 'Does not agree with GAIA: retake the photo or show the plant to a technician', pl_err: 'The Pl@ntNet model could not be loaded: ',
          pl_note: 'The model recognises species, not diseases. Cultivated tomato and pepper are not in its list (wild flora): GAIA uses its own model for them.', pl_family: 'family', pl_low: 'The model is not sure (first species at {p} %): these names are leads, not an identification. Photograph a whole twig (leaves, flowers or fruit) rather than a single leaf.', pick_t: 'Wrong plant? Choose it:', doubt_t: 'Is it really {p}?', doubt_p: 'Pl@ntNet’s model sees almost nothing of the tomato family (Solanaceae, {s} %) in this photo; it sees {f} first. GAIA would rather ask you which plant it is than guess.', manual_p: 'Plant chosen by you; GAIA’s first model said: {s}.', pl_routed: 'Plant recognised by the Pl@ntNet model ({p} %); GAIA’s first model said: {s}. Together the two models raise correct plant recognition on field photos from 59 % to 80 %.',
          pn_key_how: 'Free key: create an account at my.plantnet.org, open “Your API key” (500 identifications a day for free), then write PLANTNET_API_KEY=your_key in backend/.env and restart the server.' },
    ja: { pl_t: '種の同定（Pl@ntNetモデル、端末内）', pl_p: 'Pl@ntNetの公開モデル（地中海植物7,806種、Apache-2.0ライセンス）がブラウザ内で動きます。写真は端末の外に出ず、キーも不要です。',
          pl_run: '種を同定', pl_loading: '同定中（初回は20 MBをダウンロード）…', pl_agree: 'GAIAと一致', pl_disagree: 'GAIAと一致しません。撮り直すか技術者に見てもらってください', pl_err: 'Pl@ntNetモデルを読み込めませんでした：',
          pl_note: 'このモデルが認識するのは種であり、病気ではありません。栽培トマトとピーマンはリストにないため（野生植物）、GAIA独自のモデルを使います。', pl_family: '科', pl_low: 'モデルは確信していません（第1候補 {p}%）。これらの名前は手がかりであり、同定ではありません。葉1枚ではなく、枝全体（葉・花・実）を撮影してください。', pick_t: '植物が違いますか？選んでください：', doubt_t: '本当に{p}ですか？', doubt_p: 'Pl@ntNetモデルはこの写真にナス科（トマトの仲間、{s}%）をほとんど認めず、まず{f}と判定しています。GAIAは推測せず、植物をお尋ねします。', manual_p: 'あなたが選んだ植物です。GAIAの第1モデルの答え：{s}。', pl_routed: 'Pl@ntNetモデルが植物を認識（{p}%）。GAIAの第1モデルの答え：{s}。2つのモデルを組み合わせると、圃場写真での植物の正答率は59%から80%に上がります。',
          pn_key_how: '無料キー：my.plantnet.org でアカウントを作成し「Your API key」を開く（1日500回まで無料）。backend/.env に PLANTNET_API_KEY=キー と書き、サーバーを再起動。' }
  });

  /* ---------------------------------------------------------- Pl@ntNet open model, in the browser */
  // GAIA plants by genus / species of the Pl@ntCLEF list, to cross-check GAIA's own stage 1.
  var PL_GAIA = [[/^Olea /, 'olive'], [/^Phoenix /, 'palm'], [/^Citrus /, 'citrus'], [/^Vitis /, 'grape'], [/^Solanum tuberosum/, 'potato'], [/^Capsicum /, 'pepper'], [/^Solanum lycopersicum|^Lycopersicon/, 'tomato']];
  var PL_COMMON = { 'Olea europaea L.': { fr: 'olivier', en: 'olive tree', ar: 'زيتون', ja: 'オリーブ' }, 'Phoenix dactylifera L.': { fr: 'palmier dattier', en: 'date palm', ar: 'نخلة التمر', ja: 'ナツメヤシ' },
    'Citrus × aurantium L.': { fr: 'oranger / bigaradier', en: 'orange', ar: 'برتقال / نارنج', ja: 'オレンジ' }, 'Citrus × limon (L.) Osbeck': { fr: 'citronnier', en: 'lemon', ar: 'ليمون', ja: 'レモン' },
    'Vitis vinifera L.': { fr: 'vigne', en: 'grapevine', ar: 'عنب', ja: 'ブドウ' }, 'Solanum tuberosum L.': { fr: 'pomme de terre', en: 'potato', ar: 'بطاطا', ja: 'ジャガイモ' },
    'Ficus carica L.': { fr: 'figuier', en: 'fig tree', ar: 'تين', ja: 'イチジク' }, 'Punica granatum L.': { fr: 'grenadier', en: 'pomegranate', ar: 'رمان', ja: 'ザクロ' },
    'Opuntia ficus-indica (L.) Mill.': { fr: 'figuier de Barbarie (hindi)', en: 'prickly pear', ar: 'هندي', ja: 'ウチワサボテン' }, 'Prunus amygdalus Batsch': { fr: 'amandier', en: 'almond', ar: 'لوز', ja: 'アーモンド' },
    'Triticum turgidum L.': { fr: 'blé dur', en: 'durum wheat', ar: 'قمح صلب', ja: 'デュラム小麦' }, 'Hordeum vulgare L.': { fr: 'orge', en: 'barley', ar: 'شعير', ja: '大麦' },
    'Prunus armeniaca L.': { fr: 'abricotier', en: 'apricot', ar: 'مشمش', ja: 'アンズ' }, 'Pistacia vera L.': { fr: 'pistachier', en: 'pistachio', ar: 'فستق', ja: 'ピスタチオ' } };
  var PL = { status: 'idle', labels: null, sess: null };
  // the species model is declared in the vision manifest (species_model): the same ONNX file carries Pl@ntNet's
  // 7,806 species logits and GAIA's v4 disease heads, so it is downloaded once and its session is shared
  function plSpec() { var m = state.model.manifest; return (m && m.species_model) || { file: 'gaia-vision-v4-pn.onnx', output: 'logits', labels: 'plantnet-labels.json', input: { size: 512, mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225] } }; }
  function plLoad() {
    if (PL.sess) return Promise.resolve(PL);
    var sp = plSpec(), url = baseUrl() + sp.file;
    return loadOrt().then(function () {
      sessions[url] = sessions[url] || window.ort.InferenceSession.create(url);
      return Promise.all([fetch(baseUrl() + sp.labels).then(function (r) { if (!r.ok) throw new Error('labels ' + r.status); return r.json(); }), sessions[url]]);
    }).then(function (x) { PL.labels = x[0]; PL.sess = x[1]; PL.spec = sp; return PL; });
  }
  // species identification; resolves to PL (status 'done') or rejects. Also returns the probability of each GAIA plant
  // (sum over its species: Olea → olive, Phoenix → palm, Citrus → citrus, Vitis → grape, Solanum tuberosum → potato).
  function plPredict(img) {
    PL.status = 'loading'; PL.top = null;
    return plLoad().then(function () {
      var x = tensorFrom(img, PL.spec.input || PL.labels.input), feeds = {}; feeds[PL.sess.inputNames[0]] = x;
      return PL.sess.run(feeds);
    }).then(function (o) {
      var z = o[PL.spec.output || 'logits'].data, probs = softmax(z, 1), idx = [], plants = {};
      for (var i = 0; i < probs.length; i++) { idx.push(i); var gp = plGaia(PL.labels.species[i]); if (gp) plants[gp] = (plants[gp] || 0) + probs[i]; }
      idx.sort(function (a, b) { return probs[b] - probs[a]; });
      PL.top = idx.slice(0, 5).map(function (i) { var sp = PL.labels.species[i]; return { species: sp, family: PL.labels.families[PL.labels.family[i]], p: probs[i], gaia: plGaia(sp) }; });
      // family-level score: the sum over the family's species (more robust than one species on a leaf photo)
      var fam = {}; for (var k = 0; k < probs.length; k++) { var f = PL.labels.families[PL.labels.family[k]]; fam[f] = (fam[f] || 0) + probs[k]; }
      PL.fam = fam;
      PL.families = Object.keys(fam).sort(function (a, b) { return fam[b] - fam[a]; }).slice(0, 3).map(function (f) { return { family: f, p: fam[f] }; });
      var best = Object.keys(plants).sort(function (a, b) { return plants[b] - plants[a]; })[0];
      PL.plant = best ? { label: best, p: plants[best] } : null;
      PL.status = 'done'; PL.img = img;
      return PL;
    }, function (e) { PL.status = 'error'; PL.error = e.message || String(e); throw e; });
  }
  function plRun() {
    if (!state.img || PL.status === 'loading') return;
    var img = state.img;
    plPredict(img).catch(function () { /* shown by plBlock */ }).then(function () {
      if (img !== state.img) return;
      try { var last = G.load('gaia.health.last', null); if (last && PL.top) { last.species = PL.top[0].species; last.species_p = PL.top[0].p; G.save('gaia.health.last', last); } } catch (e) { /* storage */ }
      render();
    });
    render();
  }
  function plGaia(sp) { for (var i = 0; i < PL_GAIA.length; i++) if (PL_GAIA[i][0].test(sp)) return PL_GAIA[i][1]; return null; }
  function plBlock() {
    if (!state.img) return null;
    var kids = [el('h3', null, [t('pl_t')]), el('p', { class: 'small', style: 'margin-top:4px;color:var(--g-ink-2)' }, [t('pl_p')])];
    if (PL.status === 'idle') kids.push(el('div', { style: 'margin-top:10px' }, [el('button', { class: 'gp-btn ghost', type: 'button', onclick: plRun }, [t('pl_run')])]));
    if (PL.status === 'loading') kids.push(el('p', { role: 'status', style: 'margin-top:8px' }, [el('span', { class: 'gp-spin' }), ' ' + t('pl_loading')]));
    if (PL.status === 'error') kids.push(G.note('err', t('pl_err') + PL.error));
    if (PL.status === 'done' && PL.top) {
      var L = G.lang();
      if (PL.top[0].p < 0.2) kids.push(G.note('warn', t('pl_low').replace('{p}', fmt(PL.top[0].p * 100))));
      PL.top.slice(0, 3).forEach(function (s, i) {
        var cn = PL_COMMON[s.species] ? PL_COMMON[s.species][L] || PL_COMMON[s.species].en : null;
        kids.push(el('p', { style: i ? 'margin-top:4px' : 'margin-top:8px' }, [
          el('i', { style: i ? '' : 'font-family:var(--g-display);font-size:20px;font-weight:600' }, [s.species]), cn ? ' (' + cn + ')' : '',
          el('span', { class: 'small muted' }, [' · ' + t('pl_family') + ' ' + s.family + ' · ' + fmt(s.p * 100) + ' %'])]));
      });
      kids.push(el('p', { class: 'small muted', style: 'margin-top:6px' }, [PL.families.map(function (f) { return f.family + ' ' + fmt(f.p * 100) + ' %'; }).join(' · ')]));
      var r = state.result, gaiaTree = r && !r.error && !r.stage1.abstain ? r.tree : null, plTree = PL.top[0].gaia;
      if (gaiaTree && gaiaTree !== 'other' && plTree) kids.push(el('div', { style: 'margin-top:8px' }, [plTree === gaiaTree ? G.pill('ok', t('pl_agree')) : G.note('warn', t('pl_disagree'))]));
      kids.push(el('p', { class: 'assump', style: 'margin-top:8px' }, [t('pl_note')]));
      kids.push(el('p', { class: 'small muted', style: 'margin-top:4px' }, ['Model: PlantNet/mobilenetv4-conv-s-plantclef2024 (Pl@ntNet / Inria, Apache-2.0) · Pl@ntCLEF 2026 top-1 62.5 %, top-5 84.1 %']));
    }
    return el('div', { class: 'gp-card' }, kids);
  }

  /* ---------------------------------------------------------- manifest */
  var EXAMPLE_MANIFEST = {
    version: '2026.11-olive-v1',
    input: { size: 224, mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225] },
    stage1: { file: 'stage1-tree.onnx', classes: ['olive', 'palm', 'citrus', 'other'], temperature: 1.0, threshold: 0.6 },
    stage2: {
      olive: { file: 'olive.onnx', classes: ['healthy', 'aculus_olearius', 'peacock_spot'], temperature: 1.0, threshold: 0.6 }
    },
    guidance: { 'olive/peacock_spot': { fr: '…', ar: '…', validated_by: 'Nom, institution', date: 'AAAA-MM-JJ' } },
    evaluation: { tunisian_test_set: { macro_f1: null, n_images: null, note: 'à remplir après mesure' } }
  };

  function checkManifest() {
    var url = G.CONFIG.visionManifest;
    if (!url) { state.model = { status: 'off', manifest: null, error: null }; render(); return; }
    fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (m) {
      if (!m || !m.stage1 || !m.stage1.file || !m.stage1.classes) throw new Error('stage1 manquant');
      state.model = { status: 'ready', manifest: m, error: null };
      render();
    }).catch(function (e) {
      // 404 / file:// / network → simply not connected; a malformed manifest → say so
      var malformed = /stage1|JSON|Unexpected/.test(e.message);
      state.model = { status: 'off', manifest: null, error: malformed ? e.message : null };
      render();
    });
  }

  /* ---------------------------------------------------------- quality */
  function analyse(img) {
    var maxSide = 384, w = img.naturalWidth, h = img.naturalHeight;
    var s = Math.min(1, maxSide / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * s)), ch = Math.max(1, Math.round(h * s));
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, cw, ch);
    var d = ctx.getImageData(0, 0, cw, ch).data;
    var n = cw * ch, gray = new Float32Array(n), sum = 0, veg = 0;
    for (var i = 0, p = 0; i < n; i++, p += 4) {
      var r = d[p], g = d[p + 1], b = d[p + 2];
      var y = 0.299 * r + 0.587 * g + 0.114 * b;
      gray[i] = y; sum += y;
      // hue / saturation / value
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b), dl = mx - mn, hue = 0;
      if (dl > 0) {
        if (mx === r) hue = 60 * (((g - b) / dl) % 6);
        else if (mx === g) hue = 60 * ((b - r) / dl + 2);
        else hue = 60 * ((r - g) / dl + 4);
        if (hue < 0) hue += 360;
      }
      var sat = mx === 0 ? 0 : dl / mx, val = mx / 255;
      if (hue >= 40 && hue <= 170 && sat > 0.18 && val > 0.12) veg++;
    }
    var mean = sum / n;
    // variance of the 4-neighbour Laplacian
    var lsum = 0, lsq = 0, cnt = 0;
    for (var yy = 1; yy < ch - 1; yy++) {
      for (var xx = 1; xx < cw - 1; xx++) {
        var k = yy * cw + xx;
        var lap = gray[k - 1] + gray[k + 1] + gray[k - cw] + gray[k + cw] - 4 * gray[k];
        lsum += lap; lsq += lap * lap; cnt++;
      }
    }
    var lapVar = cnt ? lsq / cnt - Math.pow(lsum / cnt, 2) : 0;
    var minSide = Math.min(w, h), leafShare = veg / n;

    var q = {
      res: { value: w + ' × ' + h, level: minSide >= 448 ? 'pass' : minSide >= 224 ? 'warn' : 'fail' },
      light: { value: fmt(mean), level: mean >= 60 && mean <= 235 ? 'pass' : mean >= 35 && mean <= 248 ? 'warn' : 'fail' },
      sharp: { value: fmt(lapVar), level: lapVar >= 120 ? 'pass' : lapVar >= 40 ? 'warn' : 'fail' },
      leaf: { value: fmt(leafShare * 100) + ' %', level: leafShare >= 0.25 ? 'pass' : leafShare >= 0.1 ? 'warn' : 'fail' }
    };
    var levels = ['res', 'light', 'sharp', 'leaf'].map(function (k2) { return q[k2].level; });
    q.overall = levels.indexOf('fail') !== -1 ? 'fail' : levels.indexOf('warn') !== -1 ? 'warn' : 'pass';
    return q;
  }

  /* ---------------------------------------------------------- inference (only with a manifest) */
  var ortPromise = null;
  function loadOrt() {
    if (window.ort) return Promise.resolve(window.ort);
    if (ortPromise) return ortPromise;
    ortPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/ort.min.js';
      s.onload = function () { window.ort ? resolve(window.ort) : reject(new Error('onnxruntime-web')); };
      s.onerror = function () { reject(new Error('onnxruntime-web indisponible')); };
      document.head.appendChild(s);
    });
    return ortPromise;
  }
  function baseUrl() { var u = G.CONFIG.visionManifest; return u.slice(0, u.lastIndexOf('/') + 1); }

  function tensorFrom(img, input) {
    var size = input.size || 224, c = document.createElement('canvas'); c.width = size; c.height = size;
    var ctx = c.getContext('2d');
    // centre crop to a square, then resize
    var s = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
    var d = ctx.getImageData(0, 0, size, size).data, plane = size * size, arr = new Float32Array(3 * plane);
    var mean = input.mean || [0, 0, 0], std = input.std || [1, 1, 1];
    for (var i = 0; i < plane; i++) for (var ch = 0; ch < 3; ch++) arr[ch * plane + i] = (d[i * 4 + ch] / 255 - mean[ch]) / std[ch];
    return new window.ort.Tensor('float32', arr, [1, 3, size, size]);
  }
  function softmax(logits, T) {
    var z = Array.prototype.map.call(logits, function (v) { return v / (T || 1); });
    var m = Math.max.apply(null, z), e = z.map(function (v) { return Math.exp(v - m); }), s = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (v) { return v / s; });
  }
  // one session per file: stage 1 and every stage 2 head can share a single ONNX file (spec.output names the head)
  var sessions = {}, lastRun = { file: null, tensor: null, out: null };
  function runModel(spec, tensor) {
    var url = baseUrl() + spec.file;
    sessions[url] = sessions[url] || window.ort.InferenceSession.create(url);
    return sessions[url].then(function (sess) {
      var feeds = {}; feeds[sess.inputNames[0]] = tensor;
      // the shared file returns every head in one run: reuse it for stage 2 on the same photo
      var run = lastRun.file === url && lastRun.tensor === tensor ? Promise.resolve(lastRun.out)
        : sess.run(feeds).then(function (o) { lastRun = { file: url, tensor: tensor, out: o }; return o; });
      return run.then(function (out) {
        var probs = softmax(out[spec.output || sess.outputNames[0]].data, spec.temperature);
        var ranked = spec.classes.map(function (c, i) { return { label: c, p: probs[i] }; }).sort(function (a, b) { return b.p - a.p; });
        return { ranked: ranked, top: ranked[0], abstain: ranked[0].p < (spec.threshold || 0.5) };
      });
    });
  }
  function diagnose() {
    var m = state.model.manifest;
    state.running = true; state.result = null; render();
    loadOrt().then(function () {
      var x = tensorFrom(state.img, m.input || {});
      return runModel(m.stage1, x).then(function (s1) {
        var res = { stage1: s1, stage2: null, tree: s1.top.label };
        // Fusion with the Pl@ntNet species model (v4). On held-out field photos, plant identification goes from 59 % (stage 1
        // alone) to 80 % when Pl@ntNet's plant (≥ 15 %) overrides a different stage-1 answer; never on a tomato / pepper
        // answer unless Pl@ntNet is ≥ 50 % sure, because those crops are not in its species list. Lab photos: unchanged.
        var fuse = m.species_model ? plPredict(state.img).catch(function () { return null; }) : Promise.resolve(null);
        return fuse.then(function (pl) {
          var pp = pl && pl.plant, s1lab = s1.abstain ? null : s1.top.label;
          if (pp && pp.label !== s1lab && (pp.p >= 0.5 || (pp.p >= 0.15 && ['tomato', 'pepper'].indexOf(s1lab) === -1))) {
            res.tree = pp.label; res.routed = { by: 'plantnet', p: pp.p, stage1: s1lab };
          }
          // Stage 1 says tomato / pepper / potato but Pl@ntNet sees almost no Solanaceae (< 1 %) and another family
          // (≥ 10 %): ask the farmer for the plant instead of showing a tomato disease. On the test photos this catches
          // the non-Solanaceae leaves (grape: 98 %) and asks on 20 % of real tomato photos, 3 % of pepper, 1 % of potato.
          if (!res.routed && pl && pl.fam && ['tomato', 'pepper', 'potato'].indexOf(s1lab) !== -1) {
            var sol = pl.fam.Solanaceae || 0, other = Object.keys(pl.fam).filter(function (f) { return f !== 'Solanaceae'; }).sort(function (a, b) { return pl.fam[b] - pl.fam[a]; })[0];
            if (sol < 0.01 && other && pl.fam[other] >= 0.1) res.doubt = { sol: sol, family: other, p: pl.fam[other] };
          }
          if ((s1.abstain && !res.routed) || res.tree === 'other' || !m.stage2 || !m.stage2[res.tree]) return res;
          return stage2(res);
        });
      });
      function stage2(res) {
        var spec2 = m.stage2[res.tree];
        // a head can run on another backbone with its own input size (v4: Pl@ntNet MobileNetV4 at 512 px)
        return runModel(spec2, spec2.input ? tensorFrom(state.img, spec2.input) : x).then(function (s2) { res.stage2 = s2; return res; });
      }
    }).then(function (res) {
      state.result = res;
      // the Farm Agent reads the last check (plant_health_last tool); kept on this device only
      try {
        var s2 = res.stage2;
        G.save('gaia.health.last', { at: new Date().toISOString(), plant: (res.stage1.abstain && !res.routed) || res.doubt ? null : res.tree, plant_doubt: res.doubt ? 'GAIA said ' + res.tree + ', Pl@ntNet sees no Solanaceae' : undefined, routed_by_plantnet: !!res.routed, species: PL.top ? PL.top[0].species : null,
          plant_confidence: res.stage1.top.p, disease: s2 && !s2.abstain ? s2.top.label : null, disease_names: s2 && !s2.abstain ? DISEASE[s2.top.label] : undefined, confidence: s2 ? s2.top.p : null,
          unsure: !!(res.stage1.abstain || res.doubt || (s2 && s2.abstain)), model: m.version || null });
      } catch (e) { /* storage full or private mode */ }
    }).catch(function (e) {
      state.result = { error: e.message };
    }).then(function () { state.running = false; render(); if (PL.status !== 'done' && PL.status !== 'loading') plRun(); });
  }

  // the farmer names the plant: run that plant's disease model on the same photo
  function chooseTree(lab) {
    var r = state.result, m = state.model && state.model.manifest;
    if (!r || !m || !m.stage2 || !m.stage2[lab] || state.running) return;
    state.running = true; render();
    var spec2 = m.stage2[lab];
    loadOrt().then(function () { return runModel(spec2, tensorFrom(state.img, spec2.input || m.input || {})); })
      .then(function (s2) { r.tree = lab; r.manual = true; r.stage2 = s2; }, function (e) { r.error = e.message; })
      .then(function () {
        state.running = false; render();
        try { var last = G.load('gaia.health.last', null); if (last) { last.plant = lab; last.plant_chosen_by_farmer = true; last.routed_by_plantnet = false; last.plant_confidence = null; last.disease = r.stage2 && !r.stage2.abstain ? r.stage2.top.label : null; last.disease_names = last.disease ? DISEASE[last.disease] : undefined; last.confidence = r.stage2 ? r.stage2.top.p : null; last.unsure = !!(r.stage2 && r.stage2.abstain); G.save('gaia.health.last', last); } } catch (e) { /* storage */ }
      });
  }
  function pickPlant(current) {
    var m = state.model.manifest, keys = Object.keys(m.stage2 || {}).filter(function (k) { return k !== current; });
    if (!keys.length) return null;
    return el('div', { class: 'small', style: 'margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center' }, [el('span', { class: 'muted' }, [t('pick_t')])].concat(keys.map(function (k) {
      return el('button', { type: 'button', class: 'gp-btn ghost sm', onclick: function () { chooseTree(k); } }, [label(k, true)]);
    })));
  }

  /* ---------------------------------------------------------- feedback (Kaizen) */
  function queue() { return G.load('gaia.feedback', []); }
  function submitFeedback(form) {
    var item = {
      at: new Date().toISOString(), kind: 'vision', tree: form.tree.value, label: form.label.value.trim(), note: form.note.value.trim(),
      model_version: state.model.manifest ? state.model.manifest.version : null,
      prediction: state.result && !state.result.error ? { tree: state.result.tree, disease: state.result.stage2 ? state.result.stage2.top.label : null } : null,
      image_quality: state.quality ? state.quality.overall : null, expert_status: 'pending'
    };
    var q = queue(); q.push(item); G.save('gaia.feedback', q);
    var msg = document.getElementById('kz-msg');
    if (G.CONFIG.feedbackEndpoint) {
      fetch(G.CONFIG.feedbackEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); G.clear(msg).appendChild(G.note('ok', t('kz_sent'))); })
        .catch(function () { G.clear(msg).appendChild(G.note('info', t('kz_saved'))); });
    } else {
      G.clear(msg).appendChild(G.note('info', t('kz_saved')));
    }
    form.reset();
    renderQueue();
  }
  function renderQueue() {
    var box = document.getElementById('kz-q'); if (!box) return;
    var q = queue();
    G.clear(box);
    box.appendChild(el('span', null, [t('kz_q') + ' ' + q.length]));
    if (q.length) box.appendChild(el('button', { type: 'button', class: 'gp-btn ghost sm', onclick: function () {
      var blob = new Blob([JSON.stringify(q, null, 2)], { type: 'application/json' });
      var a = el('a', { href: URL.createObjectURL(blob), download: 'gaia-kaizen-feedback.json' });
      document.body.appendChild(a); a.click(); a.remove();
    } }, [t('kz_export')]));
  }

  /* ---------------------------------------------------------- rendering */
  function stepCard(n, titleKey, statusPill, body) {
    return el('li', { class: 'step' }, [
      el('div', { class: 'step-h' }, [el('span', { class: 'n', 'aria-hidden': 'true' }, [String(n)]), el('h3', null, [t(titleKey)]), statusPill]),
      body ? el('div', { class: 'step-b' }, [body]) : null
    ]);
  }
  var TREE_KEYS = ['olive', 'palm', 'citrus', 'kaki', 'tomato', 'potato', 'pepper', 'grape', 'apple', 'peach', 'cherry', 'strawberry', 'corn', 'soybean', 'squash', 'blueberry', 'raspberry', 'other'];
  // Disease names shown to the farmer (model class -> fr / ar / en / ja); unknown classes fall back to the class name.
  var DISEASE = {"bacterial":{"fr":"Maladie bactérienne","ar":"مرض بكتيري","en":"Bacterial disease","ja":"細菌病"},"fungal_leaf_spot":{"fr":"Taches fongiques (dont alternariose)","ar":"تبقعات فطرية (منها اللفحة المبكرة)","en":"Fungal leaf spots (incl. early blight)","ja":"糸状菌による斑点（夏疫病を含む）"},"nematode":{"fr":"Nématodes","ar":"الديدان الخيطية","en":"Nematodes","ja":"線虫"},"pest_damage":{"fr":"Dégâts de ravageurs","ar":"أضرار الآفات","en":"Pest damage","ja":"害虫の被害"},"virus":{"fr":"Virose","ar":"مرض فيروسي","en":"Virus disease","ja":"ウイルス病"},"healthy":{"fr":"Sain","ar":"سليم","en":"Healthy","ja":"健全"},"aculus_olearius":{"fr":"Acariose de l'olivier (Aculus olearius)","ar":"أكاروس الزيتون (Aculus olearius)","en":"Olive bud mite (Aculus olearius)","ja":"オリーブサビダニ（Aculus olearius）"},"peacock_spot":{"fr":"Œil de paon","ar":"عين الطاووس","en":"Peacock spot","ja":"クジャク斑点病"},"bacterial_leaf_spot":{"fr":"Tache bactérienne des feuilles","ar":"التبقع البكتيري للأوراق","en":"Bacterial leaf spot","ja":"細菌性斑点病"},"bacterial_spot":{"fr":"Tache bactérienne","ar":"التبقع البكتيري","en":"Bacterial spot","ja":"細菌性斑点病"},"black_rot":{"fr":"Pourriture noire","ar":"العفن الأسود","en":"Black rot","ja":"黒腐病"},"black_scorch":{"fr":"Brûlure noire","ar":"اللفحة السوداء","en":"Black scorch","ja":"黒焦病"},"black_spot":{"fr":"Tache noire","ar":"البقعة السوداء","en":"Black spot","ja":"黒点病"},"canker":{"fr":"Chancre","ar":"التقرح","en":"Canker","ja":"かいよう病"},"die_back":{"fr":"Dépérissement","ar":"موت الأطراف","en":"Dieback","ja":"枝枯れ"},"downy_mildew":{"fr":"Mildiou","ar":"البياض الزغبي","en":"Downy mildew","ja":"べと病"},"dubas":{"fr":"Dubas (dégâts)","ar":"الدوباس (أضرار)","en":"Dubas damage","ja":"ドゥバス被害"},"dubas_bug":{"fr":"Punaise du dubas","ar":"حشرة الدوباس","en":"Dubas bug","ja":"ドゥバスムシ"},"early_blight":{"fr":"Alternariose","ar":"اللفحة المبكرة","en":"Early blight","ja":"夏疫病"},"esca":{"fr":"Esca","ar":"الإسكا","en":"Esca","ja":"エスカ病"},"fusarium_wilt":{"fr":"Fusariose (bayoud)","ar":"الذبول الفيوزاريومي (البيوض)","en":"Fusarium wilt (bayoud)","ja":"フザリウム萎凋病（バユード）"},"greening":{"fr":"Greening (HLB)","ar":"الاخضرار (HLB)","en":"Greening (HLB)","ja":"グリーニング病（HLB）"},"honeydew":{"fr":"Miellat","ar":"الندوة العسلية","en":"Honeydew","ja":"甘露"},"isariopsis_leaf_spot":{"fr":"Tache foliaire (Isariopsis)","ar":"تبقع الأوراق (Isariopsis)","en":"Isariopsis leaf spot","ja":"褐斑病（Isariopsis）"},"late_blight":{"fr":"Mildiou","ar":"اللفحة المتأخرة","en":"Late blight","ja":"疫病"},"leaf_mold":{"fr":"Cladosporiose","ar":"عفن الأوراق","en":"Leaf mould","ja":"葉かび病"},"leaf_spots":{"fr":"Taches foliaires","ar":"تبقعات الأوراق","en":"Leaf spots","ja":"葉の斑点"},"leaf_miner":{"fr":"Mineuse (galeries dans la feuille)","ar":"حافرة الأوراق","en":"Leaf miner","ja":"ハモグリバエ類（潜葉虫）"},"magnesium_deficiency":{"fr":"Carence en magnésium","ar":"نقص المغنيسيوم","en":"Magnesium deficiency","ja":"マグネシウム欠乏"},"manganese_deficiency":{"fr":"Carence en manganèse","ar":"نقص المنغنيز","en":"Manganese deficiency","ja":"マンガン欠乏"},"nitrogen_deficiency":{"fr":"Carence en azote","ar":"نقص الآزوت","en":"Nitrogen deficiency","ja":"窒素欠乏"},"mealybugs":{"fr":"Cochenilles farineuses","ar":"البق الدقيقي","en":"Mealybugs","ja":"コナカイガラムシ"},"mosaic_virus":{"fr":"Virus de la mosaïque","ar":"فيروس الموزاييك","en":"Mosaic virus","ja":"モザイクウイルス"},"parlatoria_blanchardi":{"fr":"Cochenille blanche du palmier (Parlatoria)","ar":"القشرية البيضاء للنخيل (Parlatoria)","en":"White scale (Parlatoria blanchardi)","ja":"ナツメヤシのカイガラムシ（Parlatoria）"},"potassium_deficiency":{"fr":"Carence en potassium","ar":"نقص البوتاسيوم","en":"Potassium deficiency","ja":"カリウム欠乏"},"powdery_mildew":{"fr":"Oïdium","ar":"البياض الدقيقي","en":"Powdery mildew","ja":"うどんこ病"},"rachis_blight":{"fr":"Brûlure du rachis","ar":"لفحة العرجون","en":"Rachis blight","ja":"葉軸枯れ"},"septoria_leaf_spot":{"fr":"Septoriose","ar":"التبقع السبتوري","en":"Septoria leaf spot","ja":"斑点病（セプトリア）"},"shot_hole":{"fr":"Criblure","ar":"ثقوب الأوراق","en":"Shot hole","ja":"せん孔病"},"spider_mites":{"fr":"Acariens tisserands","ar":"العنكبوت الأحمر","en":"Spider mites","ja":"ハダニ"},"spiny_whitefly":{"fr":"Aleurode épineux","ar":"الذبابة البيضاء الشوكية","en":"Spiny whitefly","ja":"トゲコナジラミ"},"spotted_wilt_virus":{"fr":"Maladie bronzée (TSWV)","ar":"فيروس الذبول المتبقع","en":"Spotted wilt virus (TSWV)","ja":"黄化えそ病（TSWV）"},"target_spot":{"fr":"Tache cible","ar":"البقعة الهدفية","en":"Target spot","ja":"褐色輪紋病"},"yellow_leaf_curl_virus":{"fr":"Virus des feuilles jaunes en cuillère (TYLCV)","ar":"فيروس تجعد واصفرار الأوراق","en":"Yellow leaf curl virus (TYLCV)","ja":"黄化葉巻病（TYLCV）"}};
  function label(x, inResult) {
    if (x === 'other' && inResult) return t('tr_other_res');
    if (TREE_KEYS.indexOf(x) >= 0) return t('tr_' + x);
    var d = DISEASE[x];
    return d ? (d[G.lang()] || d.fr) : String(x).replace(/_/g, ' ');
  }
  // the plants the loaded model really knows (stage 1 classes), never a fixed list
  function modelPlants() {
    var m = state.model && state.model.manifest;
    if (!m || !m.stage1) return [];
    return m.stage1.classes.filter(function (c) { return c !== 'other'; }).map(function (c) { return label(c); });
  }
  function listJoin(a) { return a.join(G.lang() === 'ja' ? '、' : G.lang() === 'ar' ? '، ' : ', '); }
  function supportedText() { var l = modelPlants(); return l.length ? t('supported_t').replace('{l}', listJoin(l)) : ''; }

  function uploader() {
    var input = el('input', { type: 'file', accept: 'image/*', id: 'f-file', class: 'sr', tabindex: '-1', 'aria-hidden': 'true', onchange: function (e) { use(e.target.files[0]); } });
    var cam = el('input', { type: 'file', accept: 'image/*', capture: 'environment', id: 'f-cam', class: 'sr', tabindex: '-1', 'aria-hidden': 'true', onchange: function (e) { use(e.target.files[0]); } });
    var box = el('div', { class: 'drop', id: 'drop' });
    if (state.img) {
      box.appendChild(el('img', { src: state.img.src, alt: t('up_t') }));
    } else {
      box.appendChild(G.icon('leaf', 34));
      box.appendChild(el('h2', { style: 'font-size:20px' }, [t('up_t')]));
      box.appendChild(el('p', { class: 'muted small' }, [t('up_p')]));
    }
    box.appendChild(el('div', { class: 'btns' }, [
      el('button', { type: 'button', class: 'gp-btn primary', onclick: function () { input.click(); } }, [state.img ? t('up_change') : t('up_file')]),
      el('button', { type: 'button', class: 'gp-btn ghost', onclick: function () { cam.click(); } }, [t('up_cam')])
    ]));
    if (!state.img) box.appendChild(el('p', { class: 'muted small' }, [t('up_drop')]));
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('over'); });
    box.addEventListener('dragleave', function () { box.classList.remove('over'); });
    box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('over'); if (e.dataTransfer.files[0]) use(e.dataTransfer.files[0]); });
    return el('div', null, [input, cam, box,
      el('p', { class: 'muted small', style: 'margin-top:8px' }, [t('up_privacy')]),
      el('p', { class: 'muted small' }, [supportedText()])]);
  }

  function use(file) {
    if (!file || !/^image\//.test(file.type)) return;
    state.file = file; state.pn = { status: 'idle' };
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () { state.img = img; state.quality = analyse(img); state.result = null; PL.status = 'idle'; PL.top = null; render(); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function qualityBlock() {
    var q = state.quality;
    var items = [['res', 'q_res'], ['light', 'q_light'], ['sharp', 'q_sharp'], ['leaf', 'q_leaf']].map(function (x) {
      var it = q[x[0]], word = { pass: 'q_ok', warn: 'q_warn', fail: 'q_bad' }[it.level], ic = { pass: 'ok', warn: 'warn', fail: 'no' }[it.level];
      return el('div', { class: 'qitem ' + it.level }, [el('b', null, [t(x[1])]), el('div', { class: 'v' }, [it.value]), el('span', { class: 's' }, [G.icon(ic), t(word)])]);
    });
    var sumKind = { pass: 'ok', warn: 'warn', fail: 'err' }[q.overall], sumKey = { pass: 'q_sum_ok', warn: 'q_sum_warn', fail: 'q_sum_bad' }[q.overall];
    var tips = q.overall === 'pass' ? null : el('div', { style: 'margin-top:10px' }, [
      el('b', null, [t('tips_t')]),
      el('ul', { style: 'margin:4px 0 0;padding-inline-start:18px' }, ['tip1', 'tip2', 'tip3'].map(function (k) { return el('li', null, [t(k)]); }))
    ]);
    return el('div', null, [el('div', { class: 'qgrid' }, items), el('div', { style: 'margin-top:10px' }, [G.note(sumKind, t(sumKey))]), tips,
      el('details', { class: 'gp-more' }, [el('summary', null, [t('q_method_t')]), el('p', { class: 'small muted' }, [t('q_method')])])]);
  }

  function boundaryBlock() {
    var m = state.model;
    return el('div', { class: 'gp-card boundary' }, [
      el('h2', { style: 'font-size:20px' }, [t('off_t')]),
      el('p', { style: 'margin-top:8px;color:var(--g-ink-2)' }, [t('off_p')]),
      m.error ? el('div', { style: 'margin-top:10px' }, [G.note('err', t('off_err') + m.error)]) : null,
      el('p', { style: 'margin-top:12px;font-weight:600' }, [t('off_need')]),
      el('ol', { style: 'margin:6px 0 0;padding-inline-start:20px;color:var(--g-ink-2);font-size:14px' }, [
        el('li', null, [t('off_1')]),
        el('li', null, [t('off_2') + ' ', el('code', null, [G.CONFIG.visionManifest || 'CONFIG.visionManifest'])]),
        el('li', null, [t('off_3')])
      ]),
      el('details', { class: 'gp-more' }, [el('summary', null, [t('off_manifest')]), el('pre', null, [JSON.stringify(EXAMPLE_MANIFEST, null, 2)])])
    ]);
  }

  function resultBlocks() {
    var r = state.result, m = state.model.manifest;
    if (!r) return null;
    if (r.error) return G.note('err', r.error);
    var s1 = r.stage1, out = [];
    if (r.manual) {   // the farmer chose the plant
      s1 = { top: { label: r.tree, p: 1 }, ranked: s1.ranked, abstain: false };
      out.push(el('div', { class: 'gp-card' }, [
        el('p', { class: 'eyebrow' }, [t('tree')]),
        el('p', { style: 'font-family:var(--g-display);font-size:24px;font-weight:600;margin-top:4px' }, [label(r.tree, true)]),
        el('p', { class: 'small', style: 'margin-top:4px;color:var(--g-ink-2)' }, [t('manual_p').replace('{s}', r.stage1.abstain ? t('unsure_t') : label(r.stage1.top.label) + ' (' + fmt(r.stage1.top.p * 100) + ' %)')]),
        pickPlant(r.tree)
      ]));
    } else if (r.doubt) {   // stage 1 and Pl@ntNet disagree on the plant: ask
      out.push(el('div', { class: 'gp-card' }, [
        el('p', { class: 'eyebrow' }, [t('tree')]),
        probs(r.stage1.ranked)
      ]));
      out.push(el('div', { class: 'unsure', role: 'status' }, [
        el('h3', null, [t('doubt_t').replace('{p}', label(r.tree))]),
        el('p', { style: 'margin-top:6px' }, [t('doubt_p').replace('{s}', fmt(r.doubt.sol * 100, 1)).replace('{f}', r.doubt.family + ' (' + fmt(r.doubt.p * 100) + ' %)')]),
        pickPlant(null)
      ]));
      return out;
    } else if (r.routed) {   // Pl@ntNet's species model overrode stage 1: show the plant it found, and what stage 1 said
      s1 = { top: { label: r.tree, p: r.routed.p }, ranked: s1.ranked, abstain: false };
      out.push(el('div', { class: 'gp-card' }, [
        el('p', { class: 'eyebrow' }, [t('tree')]),
        el('p', { style: 'font-family:var(--g-display);font-size:24px;font-weight:600;margin-top:4px' }, [label(r.tree, true)]),
        el('p', { class: 'small', style: 'margin-top:4px;color:var(--g-ink-2)' }, [t('pl_routed').replace('{p}', fmt(r.routed.p * 100)).replace('{s}', r.routed.stage1 ? label(r.routed.stage1) : t('unsure_t'))]),
        probs(r.stage1.ranked), pickPlant(r.tree)
      ]));
    } else out.push(el('div', { class: 'gp-card' }, [
      el('p', { class: 'eyebrow' }, [t('tree')]),
      el('p', { style: 'font-family:var(--g-display);font-size:24px;font-weight:600;margin-top:4px' }, [label(s1.top.label, true)]),
      probs(s1.ranked), pickPlant(s1.top.label)
    ]));
    if (s1.abstain) { out.push(el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('unsure_t')]), el('p', { style: 'margin-top:6px' }, [t('unsure_p')])])); return out; }
    if (s1.top.label === 'other') {
      var close = s1.ranked.filter(function (x) { return x.label !== 'other' && x.p >= 0.2; });
      out.push(close.length
        ? el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('hes_t')]), el('p', { style: 'margin-top:6px' }, [t('hes_p').replace('{c}', listJoin(close.map(function (x) { return label(x.label) + ' (' + fmt(x.p * 100) + ' %)'; })))])])
        : el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('other_t')]), el('p', { style: 'margin-top:6px' }, [t('other_p').replace('{l}', listJoin(modelPlants()))])]));
      return out;
    }
    if (!r.stage2) { out.push(G.note('info', t('st_off') + ' — ' + label(s1.top.label))); return out; }
    var s2 = r.stage2;
    if (s2.abstain) { out.push(el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('unsure_t')]), el('p', { style: 'margin-top:6px' }, [t('unsure_p')]), probs(s2.ranked)])); return out; }
    var g = m.guidance && m.guidance[s1.top.label + '/' + s2.top.label];
    out.push(el('div', { class: 'gp-card' }, [
      el('p', { class: 'eyebrow' }, [t('disease')]),
      el('p', { style: 'font-family:var(--g-display);font-size:24px;font-weight:600;margin-top:4px' }, [label(s2.top.label)]),
      el('p', { class: 'small muted' }, [t('conf') + ' : ' + fmt(s2.top.p * 100) + ' %']),
      probs(s2.ranked),
      el('div', { style: 'margin-top:12px' }, [g ? el('div', null, [el('p', null, [g[G.lang()] || g.fr]), el('p', { class: 'small muted', style: 'margin-top:6px' }, [t('g_by') + ' : ' + (g.validated_by || '—') + (g.date ? ' · ' + g.date : '')])]) : G.note('info', t('g_none'))])
    ]));
    return out;
  }
  function probs(ranked) {
    return el('div', { class: 'probs', 'aria-label': t('top') }, ranked.slice(0, 4).map(function (x) {
      var bar = el('i'); bar.style.width = (x.p * 100).toFixed(1) + '%';
      return el('div', { class: 'prob' }, [el('span', null, [label(x.label, true)]), el('span', { class: 'bar' }, [bar]), el('span', { class: 'p' }, [fmt(x.p * 100) + ' %'])]);
    }));
  }

  /* ---------------------------------------------------------- Pl@ntNet (optional, consent-based) */
  // Before offering the button, ask the backend whether it runs and has a Pl@ntNet key (GET /health).
  // On localhost the backend may run on :8765 (documented) or uvicorn's default :8000: try both.
  var PN_DEFAULT = G.CONFIG.plantnetEndpoint;
  function checkPlantnet() {
    var set = window.GAIA_CONFIG && window.GAIA_CONFIG.plantnetEndpoint;
    var cands = set ? [set] : (G.serverBases || []).map(function (b) { return b + '/plantnet'; });
    if (!cands.length) { state.pnAvail = 'off'; return; }
    (function next(i) {
      if (i >= cands.length) { state.pnAvail = 'no_server'; render(); return; }
      var ctl = window.AbortController ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 4000) : null;
      fetch(cands[i].replace(/\/plantnet$/, '/health'), ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (h) { clearTimeout(timer); G.CONFIG.plantnetEndpoint = cands[i]; state.pnAvail = h && h.plantnet === false ? 'no_key' : 'ok'; render(); })
        .catch(function () { clearTimeout(timer); next(i + 1); });
    }(0));
  }
  // Only for photos GAIA's own models cannot handle (other / unsure / no model yet). Needs CONFIG.plantnetEndpoint
  // (the backend POST /plantnet: the Pl@ntNet API key stays on the server). The photo is downsized and re-encoded
  // in the browser first, which also drops EXIF (GPS).
  function pnSend() {
    var ep = G.CONFIG.plantnetEndpoint, img = state.img;
    state.pn = { status: 'loading' }; render();
    var k = Math.min(1, 1024 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(function (blob) {
      if (!blob) { state.pn = { status: 'error', error: 'pn_err' }; render(); return; }
      var fd = new FormData();
      fd.append('image', blob, 'leaf.jpg'); fd.append('organ', 'leaf'); fd.append('lang', G.lang()); fd.append('diseases', 'true');
      fetch(ep, { method: 'POST', body: fd }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j, status: r.status }; });
      }).then(function (x) {
        if (x.ok) { state.pn = { status: 'done', data: x.j }; return; }
        var dt = (x.j && x.j.detail) || {}, s = dt.status;
        var key = { no_api_key: 'pn_err_key', quota_exceeded: 'pn_err_quota', bad_api_key: 'pn_err_badkey', upstream_unreachable: 'pn_err_up', upstream_error: 'pn_err_http', bad_image: 'pn_err_img' }[s] || 'pn_err_http';
        state.pn = { status: 'error', error: key, msg: dt.message || ('HTTP ' + x.status) };
        if (s === 'no_api_key') state.pnAvail = 'no_key';
      }).catch(function () { state.pn = { status: 'error', error: 'pn_err_server', msg: ep.replace(/\/plantnet$/, '') }; }).then(render);
    }, 'image/jpeg', 0.85);
  }

  function pnBlock() {
    if (!G.CONFIG.plantnetEndpoint || !state.img) return null;
    var pn = state.pn;
    if (pn.status === 'loading') return el('div', { class: 'gp-card', role: 'status' }, [el('span', { class: 'gp-spin' }), ' ' + t('pn_loading')]);
    if (pn.status === 'declined') return el('p', { class: 'muted small' }, [t('pn_declined') + ' ', el('button', { class: 'gp-btn ghost sm', type: 'button', onclick: function () { state.pn = { status: 'idle' }; render(); } }, [t('pn_again')])]);
    if (state.pnAvail === 'no_server' && pn.status !== 'error') return el('div', null, [G.note('info', t('pn_off_server')),
      el('button', { class: 'gp-btn ghost sm', type: 'button', style: 'margin-top:8px', onclick: function () { state.pnAvail = 'checking'; G.CONFIG.plantnetEndpoint = PN_DEFAULT; render(); checkPlantnet(); } }, [t('pn_recheck')])]);
    if (state.pnAvail === 'no_key') return el('div', null, [G.note('info', t('pn_off_key')), el('p', { class: 'small', style: 'margin-top:6px' }, [t('pn_key_how')])]);
    if (state.pnAvail === 'checking') return null;
    if (pn.status === 'error') return el('div', { class: 'gp-card' }, [G.note('err', t(pn.error).replace('{m}', pn.msg || '').replace('{u}', pn.msg || '')), pn.error === 'pn_err_key' ? el('p', { class: 'small', style: 'margin-top:6px' }, [t('pn_key_how')]) : null, el('div', { style: 'margin-top:10px' }, [el('button', { class: 'gp-btn ghost', type: 'button', onclick: pnSend }, [t('pn_retry')])])]);
    if (pn.status === 'done') {
      var d = pn.data || {}, sp = d.species || [], kids = [el('h3', null, [t('pn_res_t')])];
      if (d.not_a_plant) kids.push(el('p', { style: 'margin-top:6px' }, [t('pn_not_plant')]));
      else {
        kids.push(el('p', { class: 'eyebrow', style: 'margin-top:8px' }, [t('pn_species')]));
        if (!sp.length) kids.push(el('p', null, [t('pn_none')]));
        sp.slice(0, 3).forEach(function (s, i) {
          var common = (s.common_names || []).filter(Boolean).slice(0, 2).join(', ');
          kids.push(el('p', { style: i ? 'margin-top:4px' : 'margin-top:2px' }, [
            el('i', { style: i ? '' : 'font-family:var(--g-display);font-size:20px;font-weight:600' }, [s.scientific_name]),
            common ? ' (' + common + ')' : '',
            s.score != null ? el('span', { class: 'small muted' }, [' · ' + fmt(s.score * 100) + ' %']) : ''
          ]));
        });
        kids.push(el('p', { class: 'eyebrow', style: 'margin-top:12px' }, [t('pn_dis')]));
        if (d.disease_status === 'unavailable') kids.push(el('p', { class: 'small muted' }, [t('pn_dis_unavail')]));
        else if (!d.diseases || !d.diseases.length) kids.push(el('p', null, [t('pn_dis_none')]));
        else d.diseases.slice(0, 3).forEach(function (x) {
          kids.push(el('p', { style: 'margin-top:2px' }, [x.label, x.score != null ? el('span', { class: 'small muted' }, [' · ' + fmt(x.score * 100) + ' %']) : '']));
        });
      }
      kids.push(el('div', { style: 'margin-top:12px' }, [G.note('info', t('pn_ext'))]));
      kids.push(el('p', { class: 'small muted', style: 'margin-top:8px' }, [(d.attribution || 'Powered by Pl@ntNet') + (d.remaining_requests != null ? ' · ' + d.remaining_requests + ' ' + t('pn_left') : '')]));
      return el('div', { class: 'gp-card' }, kids);
    }
    return el('div', { class: 'gp-card' }, [
      el('h3', null, [t('pn_t')]),
      el('p', { style: 'margin-top:6px;color:var(--g-ink-2)' }, [t('pn_p')]),
      el('div', { class: 'btns', style: 'margin-top:10px' }, [
        el('button', { class: 'gp-btn primary', type: 'button', onclick: pnSend }, [t('pn_send')]),
        el('button', { class: 'gp-btn ghost', type: 'button', onclick: function () { state.pn = { status: 'declined' }; render(); } }, [t('pn_no')])
      ])
    ]);
  }

  function render() {
    G.clear(app);
    var ready = state.model.status === 'ready';
    var hasImg = !!state.img;
    var off = function () { return G.pill('plan', t('st_off')); }, wait = function () { return G.pill('unk', t('st_wait')); },
        done = function () { return G.pill('ok', t('st_done')); }, skip = function () { return G.pill('unk', t('st_skip')); };
    var ran = state.result && !state.result.error;

    var pipe = el('ol', { class: 'pipe', 'aria-label': 'Pipeline' }, [
      stepCard(1, 's1', hasImg ? done() : wait(), hasImg ? qualityBlock() : null),
      stepCard(2, 's2', !ready ? off() : ran ? done() : skip()),
      stepCard(3, 's3', !ready ? off() : ran && state.result.stage2 ? done() : skip()),
      stepCard(4, 's4', !ready ? off() : ran ? done() : skip()),
      stepCard(5, 's5', !ready ? off() : ran ? done() : skip()),
      stepCard(6, 's6', !ready ? off() : ran ? done() : skip())
    ]);

    var right = [pipe];
    if (state.model.status === 'checking') right.unshift(el('p', { class: 'muted small' }, [el('span', { class: 'gp-spin' }), ' …']));
    else if (!ready) { if (hasImg) { right.push(plBlock()); var pb0 = pnBlock(); if (pb0) right.push(pb0); } right.push(boundaryBlock()); }
    else if (hasImg) {
      right.push(el('button', { class: 'gp-btn primary', type: 'button', disabled: state.running || state.quality.overall === 'fail', onclick: diagnose }, [state.running ? t('running') : t('run')]));
      var rb = resultBlocks(); if (rb) right = right.concat(rb);
      right.push(plBlock());
      if (ran && (state.result.stage1.abstain || state.result.stage1.top.label === 'other')) { var pb1 = pnBlock(); if (pb1) right.push(pb1); }
      if (ran && window.GAIA_LEAF) right.push(window.GAIA_LEAF.card(state, PL, label));   // language model: what is it, what to do (health-llm.js)
    }
    right.push(el('div', { class: 'gp-card' }, [
      el('h3', null, [t('limits_t')]),
      el('ul', { style: 'margin:6px 0 0;padding-inline-start:18px;font-size:14px;color:var(--g-ink-2)' }, ['lim1', 'lim2', 'lim3'].map(function (k) { return el('li', null, [t(k)]); }))
    ]));

    var kaizen = el('div', { class: 'gp-card kz' }, [
      el('h2', { style: 'font-size:20px' }, [t('kz_t'), el('span', { class: 'wabi', style: 'margin-inline-start:8px;font-size:15px' }, ['改善'])]),
      el('p', { style: 'margin-top:6px;color:var(--g-ink-2);font-size:14.5px' }, [t('kz_p')]),
      el('form', { onsubmit: function (e) {
        e.preventDefault();
        if (!state.img) { G.clear(document.getElementById('kz-msg')).appendChild(G.note('warn', t('kz_need_img'))); return; }
        submitFeedback(e.target);
      } }, [
        el('div', { class: 'gp-row' }, [
          el('div', { class: 'gp-field' }, [el('label', { for: 'kz-tree' }, [t('kz_tree')]),
            el('select', { id: 'kz-tree', name: 'tree' }, TREE_KEYS.map(function (k) { return el('option', { value: k }, [label(k)]); }))]),
          el('div', { class: 'gp-field' }, [el('label', { for: 'kz-label' }, [t('kz_label')]), el('input', { id: 'kz-label', name: 'label', required: true, placeholder: t('kz_label_ph') })])
        ]),
        el('div', { class: 'gp-field' }, [el('label', { for: 'kz-note' }, [t('kz_note')]), el('textarea', { id: 'kz-note', name: 'note' })]),
        el('div', null, [el('button', { class: 'gp-btn gold', type: 'submit' }, [t('kz_send')])])
      ]),
      el('div', { id: 'kz-msg', style: 'margin-top:10px', 'aria-live': 'polite' }),
      el('div', { id: 'kz-q', class: 'queue' })
    ]);

    app.appendChild(el('div', { class: 'hl' }, [
      el('div', { class: 'gp-grid' }, [uploader(), kaizen]),
      el('div', { class: 'gp-grid' }, right)
    ]));
    renderQueue();
  }

  render();
  checkManifest();
  checkPlantnet();
  G.onLang(render);
}());
