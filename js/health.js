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
      h_lead: "Photographiez une feuille d'olivier, de palmier dattier ou d'agrume. GAIA vérifie d'abord la photo, reconnaît l'arbre, puis donne la maladie probable — ou dit qu'il n'est pas sûr.",
      up_t: 'Ajouter une photo de feuille', up_p: 'Une seule feuille, à plat, bien éclairée, qui remplit le cadre.',
      up_file: 'Choisir une image', up_cam: 'Prendre une photo', up_drop: 'ou déposez une image ici',
      up_change: 'Changer de photo', up_privacy: "L'image est analysée dans votre navigateur. Elle n'est envoyée nulle part.",
      s1: 'Qualité de la photo', s2: "Identification de l'arbre", s3: 'Maladie probable', s4: 'Confiance', s5: 'Refus si incertain', s6: 'Conseil validé',
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
      tree: 'Arbre reconnu', disease: 'Maladie probable', conf: 'Confiance calibrée', top: 'Probabilités',
      unsure_t: 'Je ne suis pas sûr', unsure_p: 'La confiance est sous le seuil fixé pour ce modèle. GAIA préfère ne pas répondre. Reprenez une photo d’une autre feuille, ou montrez la plante à un technicien.',
      other_t: 'Arbre non pris en charge', other_p: 'Cette feuille ne ressemble pas à un olivier, un palmier dattier ou un agrume. GAIA ne diagnostique que ces trois arbres pour l’instant.',
      g_none: "Aucune fiche de conseil validée par un expert n'est encore associée à ce résultat.",
      g_by: 'Validée par', limits_t: 'Limites de ce diagnostic',
      lim1: "Les images d'entraînement ne viennent pas de Tunisie : le résultat doit être confirmé sur le terrain.",
      lim2: 'Un symptôme peut avoir plusieurs causes (carence, sécheresse, ravageur).',
      lim3: 'GAIA ne prescrit aucun traitement chimique.',
      kz_t: 'GAIA Kaizen — corriger le résultat', kz_p: "Si vous savez ce qu'a la plante, dites-le. Chaque correction est relue par un agronome avant de servir à réentraîner un modèle.",
      kz_tree: 'Arbre', kz_label: 'Ce que vous observez', kz_label_ph: 'ex. œil de paon, carence, rien de grave…', kz_note: 'Commentaire (facultatif)', kz_send: 'Enregistrer la correction',
      kz_saved: 'Correction enregistrée sur cet appareil, en attente de relecture.', kz_sent: 'Correction envoyée au serveur GAIA pour relecture.',
      kz_q: 'Corrections en attente sur cet appareil :', kz_export: 'Exporter (JSON)', kz_need_img: 'Ajoutez d’abord une photo.',
      tr_olive: 'Olivier', tr_palm: 'Palmier dattier', tr_citrus: 'Agrumes', tr_other: 'Autre / je ne sais pas',
      supported: 'Arbres pris en charge : olivier, palmier dattier, agrumes.'
    },
    ar: {
      h_title: 'صحة النبات',
      h_lead: 'صوّر ورقة زيتون أو نخيل أو قوارص. تتحقق غايا أولاً من جودة الصورة، ثم تتعرف على الشجرة، ثم تقترح المرض المحتمل — أو تقول إنها غير متأكدة.',
      up_t: 'أضف صورة ورقة', up_p: 'ورقة واحدة، مسطحة، جيدة الإضاءة، تملأ الإطار.',
      up_file: 'اختر صورة', up_cam: 'التقط صورة', up_drop: 'أو اسحب الصورة إلى هنا',
      up_change: 'تغيير الصورة', up_privacy: 'تُحلَّل الصورة داخل متصفحك ولا تُرسل إلى أي مكان.',
      s1: 'جودة الصورة', s2: 'التعرف على الشجرة', s3: 'المرض المحتمل', s4: 'درجة الثقة', s5: 'الامتناع عند الشك', s6: 'نصيحة مصادق عليها',
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
      tree: 'الشجرة', disease: 'المرض المحتمل', conf: 'الثقة بعد المعايرة', top: 'الاحتمالات',
      unsure_t: 'لست متأكدة', unsure_p: 'الثقة أقل من العتبة المحددة لهذا النموذج، لذلك تفضّل غايا عدم الإجابة. صوّر ورقة أخرى أو اعرض النبتة على تقني.',
      other_t: 'شجرة غير مدعومة', other_p: 'لا تشبه هذه الورقة الزيتون أو النخيل أو القوارص. لا تشخّص غايا حالياً إلا هذه الأشجار الثلاث.',
      g_none: 'لا توجد بعد بطاقة نصح مصادق عليها من خبير لهذه النتيجة.',
      g_by: 'صادق عليها', limits_t: 'حدود هذا التشخيص',
      lim1: 'صور التدريب ليست من تونس: يجب تأكيد النتيجة في الحقل.',
      lim2: 'قد يكون للعَرَض الواحد عدة أسباب (نقص غذائي، جفاف، آفة).',
      lim3: 'لا تصف غايا أي علاج كيميائي.',
      kz_t: 'غايا كايزن — تصحيح النتيجة', kz_p: 'إذا كنت تعرف ما تعانيه النبتة فأخبرنا. يراجع مهندس فلاحي كل تصحيح قبل استعماله لإعادة تدريب النموذج.',
      kz_tree: 'الشجرة', kz_label: 'ما تلاحظه', kz_label_ph: 'مثال: عين الطاووس، نقص غذائي، لا شيء خطير…', kz_note: 'تعليق (اختياري)', kz_send: 'حفظ التصحيح',
      kz_saved: 'حُفظ التصحيح على هذا الجهاز في انتظار المراجعة.', kz_sent: 'أُرسل التصحيح إلى خادم غايا للمراجعة.',
      kz_q: 'تصحيحات في الانتظار على هذا الجهاز:', kz_export: 'تصدير (JSON)', kz_need_img: 'أضف صورة أولاً.',
      tr_olive: 'زيتون', tr_palm: 'نخيل التمر', tr_citrus: 'قوارص', tr_other: 'أخرى / لا أعرف',
      supported: 'الأشجار المدعومة: الزيتون، نخيل التمر، القوارص.'
    },
    en: {
      h_title: 'Plant health',
      h_lead: 'Photograph an olive, date palm or citrus leaf. GAIA first checks the photo, recognises the tree, then gives the likely disease — or says it is not sure.',
      up_t: 'Add a photo of a leaf', up_p: 'A single leaf, flat, well lit, filling the frame.',
      up_file: 'Choose an image', up_cam: 'Take a photo', up_drop: 'or drop an image here',
      up_change: 'Change photo', up_privacy: 'The image is analysed in your browser. It is not sent anywhere.',
      s1: 'Photo quality', s2: 'Tree identification', s3: 'Likely disease', s4: 'Confidence', s5: 'Refusal when unsure', s6: 'Validated advice',
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
      tree: 'Tree recognised', disease: 'Likely disease', conf: 'Calibrated confidence', top: 'Probabilities',
      unsure_t: 'I am not sure', unsure_p: 'Confidence is below the threshold set for this model. GAIA prefers not to answer. Take a photo of another leaf, or show the plant to a technician.',
      other_t: 'Tree not supported', other_p: 'This leaf does not look like an olive, date palm or citrus. GAIA only diagnoses these three trees for now.',
      g_none: 'No advice record validated by an expert is linked to this result yet.',
      g_by: 'Validated by', limits_t: 'Limits of this diagnosis',
      lim1: 'The training images do not come from Tunisia: the result must be confirmed in the field.',
      lim2: 'A symptom can have several causes (deficiency, drought, pest).',
      lim3: 'GAIA prescribes no chemical treatment.',
      kz_t: 'GAIA Kaizen — correct the result', kz_p: 'If you know what the plant has, say so. Every correction is reviewed by an agronomist before it is used to retrain a model.',
      kz_tree: 'Tree', kz_label: 'What you observe', kz_label_ph: 'e.g. peacock spot, deficiency, nothing serious…', kz_note: 'Comment (optional)', kz_send: 'Save the correction',
      kz_saved: 'Correction saved on this device, waiting for review.', kz_sent: 'Correction sent to the GAIA server for review.',
      kz_q: 'Corrections waiting on this device:', kz_export: 'Export (JSON)', kz_need_img: 'Add a photo first.',
      tr_olive: 'Olive', tr_palm: 'Date palm', tr_citrus: 'Citrus', tr_other: 'Other / I don’t know',
      supported: 'Supported trees: olive, date palm, citrus.'
    },
    ja: {
      h_title: '植物の健康',
      h_lead: 'オリーブ、ナツメヤシ、柑橘の葉を撮影してください。GAIAはまず写真を確認し、木を識別してから、考えられる病気を示します。確信がなければそう伝えます。',
      up_t: '葉の写真を追加', up_p: '葉は1枚、平らにして明るく、画面いっぱいに。',
      up_file: '画像を選ぶ', up_cam: '写真を撮る', up_drop: 'または画像をここにドロップ',
      up_change: '写真を変更', up_privacy: '画像はブラウザ内で分析され、どこにも送信されません。',
      s1: '写真の画質', s2: '樹種の識別', s3: '考えられる病気', s4: '信頼度', s5: '不確かなら回答しない', s6: '検証済みの助言',
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
      tree: '識別した樹種', disease: '考えられる病気', conf: '調整済みの信頼度', top: '確率',
      unsure_t: '確信がありません', unsure_p: '信頼度がこのモデルのしきい値を下回っています。GAIAは回答を控えます。別の葉を撮影するか、技術者に植物を見てもらってください。',
      other_t: '対象外の樹種', other_p: 'この葉はオリーブ、ナツメヤシ、柑橘のようには見えません。現在GAIAが診断できるのはこの3種だけです。',
      g_none: 'この結果に結びついた、専門家検証済みの助言記録はまだありません。',
      g_by: '検証者', limits_t: 'この診断の限界',
      lim1: '学習用の画像はチュニジアのものではありません。結果は現地で確認する必要があります。',
      lim2: '1つの症状に複数の原因がありえます（栄養欠乏、干ばつ、害虫）。',
      lim3: 'GAIAは化学的な処置を指示しません。',
      kz_t: 'GAIAカイゼン — 結果を修正する', kz_p: '植物の状態がわかる場合は教えてください。修正はすべて農業技術者が確認してから、モデルの再学習に使われます。',
      kz_tree: '樹種', kz_label: '観察したこと', kz_label_ph: '例：クジャク病、栄養欠乏、深刻ではない…', kz_note: 'コメント（任意）', kz_send: '修正を保存',
      kz_saved: '修正はこの端末に保存され、確認待ちです。', kz_sent: '修正を確認のためGAIAサーバーに送信しました。',
      kz_q: 'この端末で確認待ちの修正：', kz_export: 'エクスポート（JSON）', kz_need_img: 'まず写真を追加してください。',
      tr_olive: 'オリーブ', tr_palm: 'ナツメヤシ', tr_citrus: '柑橘', tr_other: 'その他／わからない',
      supported: '対象の樹種：オリーブ、ナツメヤシ、柑橘。'
    }
  });

  G.mountShell('health');
  var app = document.getElementById('app');

  var state = { img: null, quality: null, model: { status: 'checking', manifest: null, error: null }, result: null, running: false };

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
      light: { value: fmt(mean), level: mean >= 60 && mean <= 200 ? 'pass' : mean >= 35 && mean <= 225 ? 'warn' : 'fail' },
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
  function runModel(spec, tensor) {
    return window.ort.InferenceSession.create(baseUrl() + spec.file).then(function (sess) {
      var feeds = {}; feeds[sess.inputNames[0]] = tensor;
      return sess.run(feeds).then(function (out) {
        var probs = softmax(out[sess.outputNames[0]].data, spec.temperature);
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
        if (s1.abstain || s1.top.label === 'other' || !m.stage2 || !m.stage2[s1.top.label]) return res;
        return runModel(m.stage2[s1.top.label], x).then(function (s2) { res.stage2 = s2; return res; });
      });
    }).then(function (res) { state.result = res; }).catch(function (e) {
      state.result = { error: e.message };
    }).then(function () { state.running = false; render(); });
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
  function label(x) {
    var map = { olive: 'tr_olive', palm: 'tr_palm', citrus: 'tr_citrus', other: 'tr_other' };
    return map[x] ? t(map[x]) : String(x).replace(/_/g, ' ');
  }

  function uploader() {
    var input = el('input', { type: 'file', accept: 'image/*', id: 'f-file', class: 'sr', onchange: function (e) { use(e.target.files[0]); } });
    var cam = el('input', { type: 'file', accept: 'image/*', capture: 'environment', id: 'f-cam', class: 'sr', onchange: function (e) { use(e.target.files[0]); } });
    var box = el('div', { class: 'drop', id: 'drop' });
    if (state.img) {
      box.appendChild(el('img', { src: state.img.src, alt: t('up_t') }));
    } else {
      box.appendChild(G.icon('leaf', 34));
      box.appendChild(el('h2', { style: 'font-size:20px' }, [t('up_t')]));
      box.appendChild(el('p', { class: 'muted small' }, [t('up_p')]));
    }
    box.appendChild(el('div', { class: 'btns' }, [
      el('label', { for: 'f-file', class: 'gp-btn primary', role: 'button', tabindex: '0', onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } } }, [state.img ? t('up_change') : t('up_file')]),
      el('label', { for: 'f-cam', class: 'gp-btn ghost', role: 'button', tabindex: '0', onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cam.click(); } } }, [t('up_cam')])
    ]));
    if (!state.img) box.appendChild(el('p', { class: 'muted small' }, [t('up_drop')]));
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('over'); });
    box.addEventListener('dragleave', function () { box.classList.remove('over'); });
    box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('over'); if (e.dataTransfer.files[0]) use(e.dataTransfer.files[0]); });
    return el('div', null, [input, cam, box,
      el('p', { class: 'muted small', style: 'margin-top:8px' }, [t('up_privacy')]),
      el('p', { class: 'muted small' }, [t('supported')])]);
  }

  function use(file) {
    if (!file || !/^image\//.test(file.type)) return;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () { state.img = img; state.quality = analyse(img); state.result = null; render(); };
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
    out.push(el('div', { class: 'gp-card' }, [
      el('p', { class: 'eyebrow' }, [t('tree')]),
      el('p', { style: 'font-family:var(--g-display);font-size:24px;font-weight:600;margin-top:4px' }, [label(s1.top.label)]),
      probs(s1.ranked)
    ]));
    if (s1.abstain) { out.push(el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('unsure_t')]), el('p', { style: 'margin-top:6px' }, [t('unsure_p')])])); return out; }
    if (s1.top.label === 'other') { out.push(el('div', { class: 'unsure', role: 'status' }, [el('h3', null, [t('other_t')]), el('p', { style: 'margin-top:6px' }, [t('other_p')])])); return out; }
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
      return el('div', { class: 'prob' }, [el('span', null, [label(x.label)]), el('span', { class: 'bar' }, [bar]), el('span', { class: 'p' }, [fmt(x.p * 100) + ' %'])]);
    }));
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
    else if (!ready) right.push(boundaryBlock());
    else if (hasImg) {
      right.push(el('button', { class: 'gp-btn primary', type: 'button', disabled: state.running || state.quality.overall === 'fail', onclick: diagnose }, [state.running ? t('running') : t('run')]));
      var rb = resultBlocks(); if (rb) right = right.concat(rb);
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
            el('select', { id: 'kz-tree', name: 'tree' }, ['olive', 'palm', 'citrus', 'other'].map(function (k) { return el('option', { value: k }, [label(k)]); }))]),
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
  G.onLang(render);
}());
