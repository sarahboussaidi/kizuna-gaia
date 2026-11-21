/* ==========================================================================
   GAIA AI Lab — contextual assistant.

   Answers are assembled from three things only: the parcel's LAND DNA, the
   compatibility engine's verdicts, and the knowledge records. Without a
   configured LLM endpoint the wording comes from templates; with one, the LLM
   receives only that evidence and its numbers are checked before display.
   ========================================================================== */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, E = window.GAIA_ENGINE, KB = window.GAIA_KB, D = window.GAIA_DNA;

  G.addStrings({
    fr: {
      lab_title: "Le centre d'intelligence", lab_lead: 'Posez une question sur votre parcelle. Chaque réponse montre la recommandation, la fiche qui la justifie, les données utilisées, la confiance et ce qui manque.',
      ctx: 'Contexte de la parcelle', ask: 'Questions possibles', ph: 'Posez votre question sur cette parcelle…', send: 'Envoyer',
      mode_rules: 'Réponses composées à partir des fiches et du profil de la parcelle (questions libres en français, arabe ou anglais). Aucun modèle de langage n’est connecté : voir backend/README.md pour activer Claude.',
      mode_llm: 'Formulation par modèle de langage, à partir des seules fiches récupérées ; chiffres vérifiés.',
      s_reco: 'Recommandation', s_expl: 'Explication', s_rec: 'Fiche technique', s_data: 'Données utilisées', s_conf: 'Confiance',
      s_miss: 'Informations manquantes', s_act: 'Actions', s_llm: 'Formulation (modèle de langage)',
      q1: 'Quelles techniques japonaises pourraient marcher ici ?', q2: 'Comment adapter les jessour à cette parcelle ?', q3: "Quelles sont les contraintes en eau ?",
      q4: "L'agrivoltaïsme peut-il convenir ici ?", q5: 'Pourquoi GAIA a-t-il écarté les terrasses japonaises ?', q6: 'Explique la recommandation en arabe.', q7: 'Quelles informations manquent ?',
      k_rain: 'Pluie', k_slope: 'Pente', k_water: 'Eau', k_crop: 'Culture', k_ghi: 'Soleil',
      insufficient: 'Preuves insuffisantes', insufficient_p: "Je n'ai pas de fiche ni de donnée qui permette de répondre à cette question sans inventer. Essayez une des questions proposées, ou ajoutez la technique à la bibliothèque.",
      none_missing: 'Aucune information essentielle ne manque.',
      llm_block: 'La formulation du modèle contenait un chiffre absent des données fournies ; elle a été bloquée.',
      llm_err: 'Le service de modèle de langage ne répond pas ; la réponse ci-dessus reste valable.', conv: 'Conversation'
    },
    ar: {
      lab_title: 'مركز الذكاء', lab_lead: 'اطرح سؤالاً عن قطعتك. تعرض كل إجابة التوصية والبطاقة التي تبررها والبيانات المستعملة ودرجة الثقة وما ينقص.',
      ctx: 'سياق القطعة', ask: 'أسئلة مقترحة', ph: 'اطرح سؤالك عن هذه القطعة…', send: 'إرسال',
      mode_rules: 'الإجابات مركّبة من البطاقات وملف القطعة (أسئلة حرة بالعربية أو الفرنسية أو الإنجليزية). لا يوجد نموذج لغوي متصل.',
      mode_llm: 'صياغة بنموذج لغوي اعتماداً على البطاقات المسترجعة فقط، مع التحقق من الأرقام.',
      s_reco: 'التوصية', s_expl: 'الشرح', s_rec: 'البطاقة التقنية', s_data: 'البيانات المستعملة', s_conf: 'درجة الثقة',
      s_miss: 'معلومات ناقصة', s_act: 'الخطوات', s_llm: 'الصياغة (نموذج لغوي)',
      q1: 'ما التقنيات اليابانية التي قد تنجح هنا؟', q2: 'كيف أكيّف الجسور مع هذه القطعة؟', q3: 'ما هي قيود الماء؟',
      q4: 'هل تناسب الزراعة الضوئية هذه القطعة؟', q5: 'لماذا استبعدت غايا المدرجات اليابانية؟', q6: 'اشرح التوصية بالعربية.', q7: 'ما المعلومات الناقصة؟',
      k_rain: 'الأمطار', k_slope: 'الانحدار', k_water: 'الماء', k_crop: 'الزراعة', k_ghi: 'الشمس',
      insufficient: 'أدلة غير كافية', insufficient_p: 'لا توجد بطاقة ولا بيانات تسمح بالإجابة عن هذا السؤال دون اختلاق. جرّب أحد الأسئلة المقترحة.',
      none_missing: 'لا تنقص أي معلومة أساسية.',
      llm_block: 'تضمنت صياغة النموذج رقماً غير موجود في البيانات، فتم حجبها.',
      llm_err: 'خدمة النموذج اللغوي لا تستجيب؛ الإجابة أعلاه تبقى صالحة.', conv: 'المحادثة'
    },
    en: {
      lab_title: 'The intelligence centre', lab_lead: 'Ask a question about your plot. Each answer shows the recommendation, the record that supports it, the data used, the confidence and what is missing.',
      ctx: 'Plot context', ask: 'Suggested questions', ph: 'Ask your question about this plot…', send: 'Send',
      mode_rules: 'Answers composed from the records and the plot profile (free questions in English, French, Arabic or Japanese). No language model is connected: see backend/README.md to enable Claude.',
      mode_llm: 'Wording by a language model, from the retrieved records only; figures checked.',
      s_reco: 'Recommendation', s_expl: 'Explanation', s_rec: 'Technical record', s_data: 'Data used', s_conf: 'Confidence',
      s_miss: 'Missing information', s_act: 'Actions', s_llm: 'Wording (language model)',
      q1: 'Which Japanese practices could work here?', q2: 'How can jessour be adapted to this plot?', q3: 'What are the water constraints?',
      q4: 'Could agrivoltaics fit here?', q5: 'Why did GAIA rule out the Japanese terraces?', q6: 'Explain the recommendation in Arabic.', q7: 'What information is missing?',
      k_rain: 'Rainfall', k_slope: 'Slope', k_water: 'Water', k_crop: 'Crop', k_ghi: 'Sun',
      insufficient: 'Not enough evidence', insufficient_p: 'I have no record or data that lets me answer this question without inventing. Try one of the suggested questions, or add the practice to the library.',
      none_missing: 'No essential information is missing.',
      llm_block: 'The model’s wording contained a figure that is not in the data provided; it was blocked.',
      llm_err: 'The language model service is not responding; the answer above still stands.', conv: 'Conversation'
    },
    ja: {
      lab_title: 'インテリジェンス・センター', lab_lead: '区画について質問してください。各回答には、推奨、その根拠となる記録、使用したデータ、信頼度、欠けている情報を示します。',
      ctx: '区画の状況', ask: '質問の例', ph: 'この区画について質問してください…', send: '送信',
      mode_rules: '回答は記録と区画プロファイルから構成します（日本語・英語・フランス語・アラビア語で自由に質問できます）。言語モデルは接続されていません。Claudeを有効にするにはbackend/README.mdを参照してください。',
      mode_llm: '取得した記録のみをもとに言語モデルが文章化。数値は検証済み。',
      s_reco: '推奨', s_expl: '説明', s_rec: '技術記録', s_data: '使用したデータ', s_conf: '信頼度',
      s_miss: '欠けている情報', s_act: '行動', s_llm: '文章化（言語モデル）',
      q1: 'ここで使えそうな日本の技術は？', q2: 'ジェスールをこの区画に合わせるには？', q3: 'この区画の水の制約は？',
      q4: '営農型太陽光はここに向いていますか？', q5: 'GAIAはなぜ日本の棚田を除外したのですか？', q6: 'おすすめをアラビア語で説明して。', q7: '足りない情報は？',
      k_rain: '降水量', k_slope: '傾斜', k_water: '水', k_crop: '作物', k_ghi: '日射',
      insufficient: '根拠不足', insufficient_p: '推測せずにこの質問に答えられる記録やデータがありません。質問の例を試すか、ライブラリに技術を追加してください。',
      none_missing: '欠けている重要な情報はありません。',
      llm_block: 'モデルの文章に、提供したデータにない数値が含まれていたため表示を止めました。',
      llm_err: '言語モデルのサービスが応答しません。上の回答はそのまま有効です。', conv: '会話'
    }
  });
  G.mountShell('lab');

  var app = document.getElementById('app');
  var thread = [];        // [{ q, intent, lang }]
  var lastIntent = null;

  /* ---------------------------------------------------------- intents */
  var NAMES = [
    ['tn-jessour', /jessour|جسور|ジェスール/i], ['tn-tabia', /tabia|طابية|タビア/i], ['tn-meskat', /meskat|مسقاة|メスカット/i],
    ['tn-dry-stone-basins', /cuvette|basin|pierre s[eè]che|أحواض|水受け|石垣/i], ['tn-oasis', /oasis|واحة|オアシス/i], ['tn-cistern', /citerne|cistern|majel|fesguia|خزان|貯水槽|タンク/i],
    ['x-mulch', /paill|mulch|تغطية|マルチ|剪定/i], ['jp-tanada', /terrasse|tanada|terrace|棚田|مدرج|テラス/i], ['jp-canal-turn', /tour d.eau|canal|okuizumo|دور الماء|水番|水路|奥出雲/i],
    ['jp-solar-sharing', /solar sharing|agrivolta|panneau|ضوئي|شمسي|ソーラーシェアリング|営農型|太陽光パネル/i], ['jp-satoyama-layers', /satoyama|ساتوياما|里山/i]
  ];
  var R = window.GAIA_RETRIEVAL;
  function namedRecord(q) { for (var i = 0; i < NAMES.length; i++) if (NAMES[i][1].test(q)) return NAMES[i][0]; return null; }
  function detect(q0) {
    var q = q0 + ' ' + R.norm(q0);
    var an = R.analyse(q0, KB.records);
    var rec = namedRecord(q) || an.named[0] || null;
    if (/arabe|arabic|عرب|アラビア/i.test(q)) return { kind: 'arabic' };
    if (/manqu|missing|ناقص|نقص|足りな|不足|欠け/i.test(q)) return { kind: 'missing' };
    if (/pourquoi|why|rejet|écart|ecart|refus|ruled out|لماذا|استبعد|なぜ|どうして|理由|除外/i.test(q)) return { kind: 'why', rec: rec };
    if (an.facets.length) return { kind: 'facet', facets: an.facets, rec: rec, an: an };
    if (/agrivolta|solar sharing|panneau|ضوئي|営農型|ソーラー/i.test(q)) return { kind: 'record', rec: 'jp-solar-sharing' };
    if (/adapt|كيّف|كيف أكيف|تكييف|合わせ|調整/i.test(q) && rec) return { kind: 'record', rec: rec };
    if (rec) return { kind: 'record', rec: rec };
    if (/japon|japan|ياب|日本/i.test(q)) return { kind: 'origin', origin: 'jp' };
    if (/tunisi|تونس|チュニジア/i.test(q)) return { kind: 'origin', origin: 'tn' };
    if (/recommand|conseil|quoi faire|meilleur|best|suggest|توصي|أفضل|انصح|おすすめ|推奨|最適|何をすべき/i.test(q)) return { kind: 'best' };
    if (/\b(eau|water|irrigation)\b|ماء|مياه|سقي|\bالري\b|水|灌漑/i.test(q) && !an.parcelTopics.filter(function (k) { return k !== 'water' && k !== 'et0' && k !== 'rain'; }).length) return { kind: 'water' };
    if (an.parcelTopics.length) return { kind: 'facts', an: an };
    if (an.hits.length && an.hits[0].score >= 2) return { kind: 'search', an: an };
    return { kind: 'unknown', an: an };
  }

  /* ---------------------------------------------------------- evidence helpers */
  // W(L, { fr, ar, en, ja }): the answer's wording in its language (French when missing)
  function W(L, o) { return o[L] !== undefined ? o[L] : o.fr; }
  var VERDICT = {
    ar: { feasible: 'ممكنة', adapt: 'ممكنة مع التكييف', insufficient: 'أدلة غير كافية', rejected: 'غير موصى بها' },
    en: { feasible: 'Feasible', adapt: 'Feasible with adaptation', insufficient: 'Not enough evidence', rejected: 'Not recommended' },
    ja: { feasible: '実施可能', adapt: '調整すれば実施可能', insufficient: '根拠不足', rejected: '推奨しない' }
  };
  function verdictText(v, L) { return VERDICT[L] ? VERDICT[L][v] : t(v === 'feasible' ? 'verdict_ok' : v === 'adapt' ? 'verdict_adapt' : v === 'insufficient' ? 'verdict_unk' : 'verdict_no'); }
  function nameOf(r, L) { return L === 'ar' && r.name_ar ? r.name_ar : r.name; }
  function sep(L) { return L === 'ja' ? '：' : L === 'fr' ? ' : ' : ': '; }
  function dataUsed(dna, paths) {
    var out = [], seen = {};
    paths.forEach(function (p) {
      var f = D.fieldAt(dna, p); if (!f || !f.source || seen[f.source]) return;
      seen[f.source] = 1; out.push({ label: G.tr(f.source) + (f.period ? ' (' + f.period + ')' : ''), url: f.url || null });
    });
    return out;
  }
  function confidence(dna, results, L) {
    var lowData = dna.quality.coreMissing.length > 0;
    var prov = results.some(function (r) { return r.provisional; });
    var draft = results.some(function (r) { return r.record.review.status !== 'validated'; });
    var level = lowData || prov ? 'low' : 'medium';
    var why = [
      lowData ? W(L, { fr: 'données essentielles manquantes', ar: 'بيانات أساسية ناقصة', en: 'essential data missing', ja: '重要なデータが不足' })
        : W(L, { fr: 'climat issu de réanalyse régionale', ar: 'بيانات مناخية جهوية (إعادة تحليل)', en: 'climate from regional reanalysis', ja: '気候は地域再解析データ' }),
      prov ? W(L, { fr: 'seuils provisoires', ar: 'عتبات مؤقتة', en: 'provisional thresholds', ja: '暫定的なしきい値' }) : null,
      draft ? W(L, { fr: 'fiche non validée par un expert', ar: 'بطاقة غير مصادق عليها', en: 'record not validated by an expert', ja: '専門家未検証の記録' }) : null
    ];
    return { level: level, why: why.filter(Boolean).join(' · ') };
  }
  function noteOf(dna, p) { var f = D.fieldAt(dna, p); return G.fieldLabel(p) + (f && f.note ? ' — ' + G.tr(f.note) : ''); }
  function missingFor(dna, results) {
    var paths = {};
    results.forEach(function (r) { r.unknown.forEach(function (x) { paths[x.cond.field] = 1; }); });
    return Object.keys(paths).map(function (p) { return noteOf(dna, p); });
  }

  /* ---------------------------------------------------------- answer builders */
  function answer(intent, dna, L) {
    var all = E.evaluateAll(dna);
    var S = sep(L);
    var get = function (id) { return all.filter(function (r) { return r.record.id === id; })[0]; };
    var a = { records: [], data: [], actions: [], missing: [], expl: [] };

    if (intent.kind === 'arabic') {
      return answer(lastIntent && lastIntent.kind !== 'arabic' ? lastIntent : { kind: 'best' }, dna, 'ar');
    }

    if (intent.kind === 'best' || intent.kind === 'origin') {
      var pool = all.filter(function (r) { return r.verdict !== 'rejected' && (!intent.origin || r.record.origin === intent.origin); });
      if (!pool.length) {
        a.title = W(L, { fr: 'Aucune technique retenue', ar: 'لا توجد تقنية مناسبة', en: 'No practice retained', ja: '該当する技術はありません' });
        a.reco = W(L, { fr: 'Aucune technique de cette origine ne remplit ses conditions obligatoires sur cette parcelle.', ar: 'لم تُستوفَ شروط أي تقنية من هذا الأصل لهذه القطعة.', en: 'No practice of this origin meets its mandatory conditions on this plot.', ja: 'この区画では、この出自の技術はどれも必須条件を満たしていません。' });
        a.expl = all.filter(function (r) { return !intent.origin || r.record.origin === intent.origin; }).map(function (r) {
          return nameOf(r.record, L) + S + r.hardFails.map(E.describe).join(L === 'ja' ? '、' : ' ; ');
        });
        a.records = [];
      } else {
        var top = pool[0];
        a.title = intent.origin === 'jp'
          ? W(L, { fr: 'Techniques japonaises possibles ici', ar: 'تقنيات يابانية ممكنة هنا', en: 'Japanese practices possible here', ja: 'ここで使えそうな日本の技術' })
          : W(L, { fr: 'Technique la mieux adaptée', ar: 'أفضل تقنية لهذه القطعة', en: 'Best-suited practice', ja: '最も適した技術' });
        a.reco = nameOf(top.record, L) + ' — ' + verdictText(top.verdict, L) + (top.score !== null ? ' (' + fmt(top.score * 100) + ' %)' : '');
        a.expl = pool.map(function (r) {
          return nameOf(r.record, L) + S + verdictText(r.verdict, L) + (r.adaptation ? W(L, { fr: ' — adaptation : ', ar: ' — تكييف: ', en: ' — adaptation: ', ja: ' — 調整：' }) + r.adaptation.text : '');
        });
        a.records = pool.slice(0, 3).map(function (r) { return r.record; });
        a.actions = top.record.actions.slice();
      }
      a.results = intent.origin ? all.filter(function (r) { return r.record.origin === intent.origin; }) : all;
      a.data = dataUsed(dna, ['climate.rain_mm', 'terrain.slope_pct', 'water.source', 'crop']);
    }

    else if (intent.kind === 'record' || intent.kind === 'why') {
      var id = intent.rec || (intent.kind === 'why' ? (all.filter(function (r) { return r.verdict === 'rejected'; })[0] || {}).record && all.filter(function (r) { return r.verdict === 'rejected'; })[0].record.id : null);
      var r = id ? get(id) : null;
      if (!r) return insufficient(L);
      a.title = nameOf(r.record, L) + ' — ' + verdictText(r.verdict, L);
      a.records = [r.record];
      a.results = [r];
      if (r.verdict === 'rejected') {
        a.reco = W(L, { fr: 'Technique non recommandée sur cette parcelle.', ar: 'لا يُنصح بهذه التقنية على هذه القطعة.', en: 'Practice not recommended on this plot.', ja: 'この区画ではこの技術を推奨しません。' });
        a.expl = r.hardFails.map(function (x) { return E.describe(x) + ' — ' + x.cond.why; });
        var alt = all.filter(function (x) { return x.verdict !== 'rejected' && x.record.families.some(function (f) { return r.record.families.indexOf(f) !== -1; }); })[0];
        if (alt) { a.expl.push(W(L, { fr: 'Alternative possible : ', ar: 'بديل ممكن: ', en: 'Possible alternative: ', ja: '代わりの候補：' }) + nameOf(alt.record, L) + (L === 'ja' ? '（' + verdictText(alt.verdict, L) + '）。' : ' (' + verdictText(alt.verdict, L) + ').')); a.actions = alt.record.actions.slice(); a.records.push(alt.record); }
      } else {
        a.reco = r.adaptation ? r.adaptation.text : W(L, { fr: 'Faisable telle quelle.', ar: 'ممكنة كما هي.', en: 'Feasible as it is.', ja: 'そのまま実施できます。' });
        a.expl = r.checks.filter(function (x) { return x.result === 'pass'; }).map(E.describe);
        if (r.provisional) a.expl.push(W(L, { fr: 'La fiche contient au moins un seuil provisoire.', ar: 'تحتوي البطاقة على عتبة مؤقتة.', en: 'The record contains at least one provisional threshold.', ja: 'この記録には暫定的なしきい値が含まれます。' }));
        a.actions = r.record.actions.slice();
      }
      if (id === 'jp-solar-sharing') {
        var ghi = D.value(dna, 'solar.ghi_kwh');
        a.expl.push(W(L, { fr: 'Rayonnement annuel moyen : ', ar: 'الإشعاع الشمسي السنوي: ', en: 'Mean annual radiation: ', ja: '年平均日射量：' }) + (ghi === null ? W(L, { fr: 'indisponible', ar: 'غير متاح', en: 'unavailable', ja: '取得不可' }) : fmt(ghi, 2) + ' ' + W(L, { fr: 'kWh/m²/j', ar: 'kWh/m²/j', en: 'kWh/m²/day', ja: 'kWh/m²/日' })) + (L === 'ja' ? '。' : '.'));
        a.expl.push(W(L, { fr: 'Sans quota d’eau, le pompage solaire encourage le surpompage : voir Eau & énergie.', ar: 'بلا حصة ماء، يشجع الضخ الشمسي على الإفراط في الضخ.', en: 'Without a water quota, solar pumping encourages over-pumping: see Water & energy.', ja: '水の割当量がないと、太陽光揚水は過剰揚水を招きます。「水とエネルギー」を参照してください。' }));
        a.data = dataUsed(dna, ['solar.ghi_kwh', 'energy.pump']);
      } else {
        a.data = dataUsed(dna, r.checks.map(function (x) { return x.cond.field; }));
      }
    }

    else if (intent.kind === 'water') {
      var rain = D.value(dna, 'climate.rain_mm'), et0 = D.value(dna, 'climate.et0_mm'), src = D.value(dna, 'water.source');
      var mmy = W(L, { fr: ' mm/an', ar: ' mm/an', en: ' mm/yr', ja: ' mm/年' });
      a.title = W(L, { fr: 'Contraintes en eau', ar: 'قيود الماء', en: 'Water constraints', ja: '水の制約' });
      if (rain === null || et0 === null) { a.reco = W(L, { fr: 'Déficit non calculable : données climatiques indisponibles.', ar: 'تعذّر حساب العجز المائي: البيانات المناخية غير متاحة.', en: 'Deficit cannot be calculated: climate data unavailable.', ja: '気候データがないため、水の不足量を計算できません。' }); }
      else {
        var deficit = fmt(et0 - rain);
        a.reco = W(L, { fr: 'La demande climatique dépasse la pluie de ' + deficit + mmy + ' environ.', ar: 'الطلب المناخي يفوق الأمطار بـ ' + deficit + mmy + ' تقريباً.', en: 'Climatic demand exceeds rainfall by about ' + deficit + mmy + '.', ja: '気候による水の需要が降水量を約' + deficit + mmy + '上回っています。' });
        a.expl.push(W(L, { fr: 'Pluie : ', ar: 'الأمطار: ', en: 'Rainfall: ', ja: '降水量：' }) + fmt(rain) + mmy + (L === 'ja' ? '、' : ' ; ') + 'ET0' + S + fmt(et0) + mmy + (L === 'ja' ? '。' : '.'));
        a.expl.push(W(L, { fr: 'ET0 est une référence : le besoin réel de la culture se calcule avec son coefficient Kc (page Eau & énergie).', ar: 'ET0 هو تبخر مرجعي؛ حاجة الشجرة الفعلية تُحسب بمعامل الزراعة في صفحة الماء والطاقة.', en: 'ET0 is a reference: the crop’s real need is calculated with its coefficient Kc (Water & energy page).', ja: 'ET0は基準値です。作物の実際の必要水量は作物係数Kcで計算します（「水とエネルギー」ページ）。' }));
      }
      a.expl.push(W(L, { fr: "Source d'eau : ", ar: 'مصدر الماء: ', en: 'Water source: ', ja: '水源：' }) + (src ? E.valueLabel(src) : W(L, { fr: 'non renseignée', ar: 'غير مصرّح به', en: 'not entered', ja: '未入力' })) + (L === 'ja' ? '。' : '.'));
      a.expl.push(W(L, { fr: "En Tunisie, l'irrigation dépend largement des nappes : tout pompage supplémentaire doit rester dans un quota.", ar: 'في تونس يأتي جزء كبير من مياه الري من المائدة المائية؛ أي ضخ إضافي يجب أن يبقى ضمن حصة.', en: 'In Tunisia irrigation depends largely on groundwater: any extra pumping must stay within a quota.', ja: 'チュニジアの灌漑は地下水に大きく依存しています。追加の揚水はすべて割当量の範囲内に収める必要があります。' }));
      a.records = ['tn-jessour', 'tn-meskat', 'x-mulch'].map(KB.get);
      a.actions = W(L, {
        fr: ['Calculer le besoin mensuel dans Eau & énergie.', 'Fixer un quota de pompage mensuel.', "Réduire l'évaporation par le paillage."],
        ar: ['احسب الحاجة الشهرية في صفحة الماء والطاقة.', 'حدّد حصة ضخ شهرية.', 'قلّل التبخر بالتغطية.'],
        en: ['Calculate the monthly need in Water & energy.', 'Set a monthly pumping quota.', 'Cut evaporation with mulch.'],
        ja: ['「水とエネルギー」で月ごとの必要水量を計算する。', '月ごとの揚水割当量を決める。', 'マルチングで蒸発を減らす。']
      });
      a.data = dataUsed(dna, ['climate.rain_mm', 'climate.et0_mm', 'water.source']);
      a.results = all.filter(function (r) { return ['tn-jessour', 'tn-meskat', 'x-mulch'].indexOf(r.record.id) !== -1; });
    }

    else if (intent.kind === 'missing') {
      a.title = W(L, { fr: 'Informations manquantes', ar: 'المعلومات الناقصة', en: 'Missing information', ja: '欠けている情報' });
      var m = dna.quality.missing;
      var core = dna.quality.coreMissing.map(G.fieldLabel).join(', ');
      a.reco = m.length ? W(L, {
        fr: m.length + ' champs manquants. Les plus importants : ' + (core || 'aucun champ essentiel'),
        ar: m.length + ' حقول ناقصة. الأهم: ' + (core || 'لا شيء أساسي'),
        en: m.length + ' fields missing. The most important: ' + (core || 'no essential field'),
        ja: m.length + '項目が不足しています。最も重要なもの：' + (core || '重要な項目はありません')
      }) : t('none_missing');
      a.expl = m.map(function (p) { return noteOf(dna, p); });
      a.actions = W(L, {
        fr: ['Compléter les champs dans Land Intelligence.', 'Faire mesurer le sol (texture, profondeur) par un technicien.', 'Reconstruire le profil.'],
        ar: ['أكمل الحقول في صفحة ذكاء الأرض.', 'اطلب من مهندس فلاحي قياس التربة.', 'أعد بناء الملف.'],
        en: ['Fill in the fields in Land Intelligence.', 'Have a technician measure the soil (texture, depth).', 'Rebuild the profile.'],
        ja: ['ランド・インテリジェンスで項目を入力する。', '技術者に土壌（土性、深さ）を測ってもらう。', 'プロファイルを作り直す。']
      });
      a.results = [];
    }

    else if (intent.kind === 'facet') {
      var ids = intent.rec ? [intent.rec] : intent.an.hits.filter(function (h) { return h.score >= 1.5; }).slice(0, 3).map(function (h) { return h.id; });
      if (!ids.length) ids = all.filter(function (r) { return r.verdict === 'feasible' || r.verdict === 'adapt'; }).slice(0, 3).map(function (r) { return r.record.id; });
      if (!ids.length) return insufficient(L);
      var FACET_KEY = { cost: 'cost', risk: 'risks', materials: 'materials', actors: 'actors', regulation: 'regulation' };
      var FACET_LABEL = W(L, {
        fr: { cost: 'Coût', risk: 'Risques', materials: 'Matériaux', actors: 'Acteurs et appuis', regulation: 'Réglementation', actions: 'Étapes', sources: 'Sources' },
        ar: { cost: 'التكلفة', risk: 'المخاطر', materials: 'المواد', actors: 'الفاعلون', regulation: 'التنظيمات', actions: 'الخطوات', sources: 'المصادر' },
        en: { cost: 'Cost', risk: 'Risks', materials: 'Materials', actors: 'Actors and support', regulation: 'Regulation', actions: 'Steps', sources: 'Sources' },
        ja: { cost: 'コスト', risk: 'リスク', materials: '資材', actors: '関係者と支援', regulation: '規制', actions: '手順', sources: '出典' }
      });
      var facetText = function (rec, f) {
        if (f === 'actions') return (rec.actions || []).join(L === 'ja' ? ' ' : ' ; ');
        if (f === 'sources') return rec.sources.map(function (x) { return x.label + (x.verified ? '' : W(L, { fr: ' (lien à vérifier)', ar: ' (رابط للتحقق)', en: ' (link to check)', ja: '（リンク要確認）' })); }).join(' ; ');
        return rec[FACET_KEY[f]] || '';
      };
      var fs = intent.facets;
      var rs = ids.map(get).filter(Boolean);
      a.title = fs.map(function (f) { return FACET_LABEL[f]; }).join(' · ') + ' — ' + rs.map(function (r) { return nameOf(r.record, L); }).join(', ');
      a.reco = facetText(rs[0].record, fs[0]) || W(L, { fr: 'La fiche ne donne pas cette information.', ar: 'البطاقة لا تذكر هذه المعلومة.', en: 'The record does not give this information.', ja: '記録にこの情報はありません。' });
      rs.forEach(function (r, i) {
        fs.forEach(function (f, j) {
          if (i === 0 && j === 0) return;
          a.expl.push(nameOf(r.record, L) + ' — ' + FACET_LABEL[f] + S + (facetText(r.record, f) || W(L, { fr: 'non précisé dans la fiche', ar: 'غير مذكور في البطاقة', en: 'not given in the record', ja: '記録に記載なし' })));
        });
        a.expl.push(nameOf(r.record, L) + ' — ' + W(L, { fr: 'pour cette parcelle : ', ar: 'لهذه القطعة: ', en: 'for this plot: ', ja: 'この区画では：' }) + verdictText(r.verdict, L) + (L === 'ja' ? '。' : '.'));
      });
      a.records = rs.map(function (r) { return r.record; });
      a.results = rs;
      a.actions = fs.indexOf('actions') !== -1 ? [] : rs[0].record.actions.slice();
      a.data = dataUsed(dna, rs[0].checks.map(function (x) { return x.cond.field; }));
    }

    else if (intent.kind === 'facts') {
      var FL = W(L, {
        fr: { 'soil.texture': 'Texture du sol', 'soil.clay_pct': 'Argile 0–30 cm', 'soil.soc': 'Carbone organique', 'climate.rain_mm': 'Pluie annuelle', 'climate.tmax_hot': 'Max. du mois le plus chaud', 'climate.tmin_cold': 'Min. du mois le plus froid', 'climate.et0_mm': 'Évapotranspiration de référence', 'terrain.slope_pct': 'Pente', 'terrain.elev_m': 'Altitude', 'terrain.aspect_deg': 'Orientation', 'solar.ghi_kwh': 'Rayonnement solaire', 'energy.pump': 'Pompage', 'water.source': "Source d'eau", 'water.well_depth_m': 'Profondeur du puits', 'crop': 'Culture', 'area_ha': 'Surface' },
        ar: { 'soil.texture': 'قوام التربة', 'soil.clay_pct': 'الطين 0–30 سم', 'soil.soc': 'الكربون العضوي', 'climate.rain_mm': 'الأمطار السنوية', 'climate.tmax_hot': 'أقصى حرارة صيفية', 'climate.tmin_cold': 'أدنى حرارة شتوية', 'climate.et0_mm': 'التبخر النتحي المرجعي', 'terrain.slope_pct': 'الانحدار', 'terrain.elev_m': 'الارتفاع', 'terrain.aspect_deg': 'الاتجاه', 'solar.ghi_kwh': 'الإشعاع الشمسي', 'energy.pump': 'الضخ', 'water.source': 'مصدر الماء', 'water.well_depth_m': 'عمق البئر', 'crop': 'الزراعة', 'area_ha': 'المساحة' },
        en: { 'soil.texture': 'Soil texture', 'soil.clay_pct': 'Clay 0–30 cm', 'soil.soc': 'Organic carbon', 'climate.rain_mm': 'Annual rainfall', 'climate.tmax_hot': 'Max. of the hottest month', 'climate.tmin_cold': 'Min. of the coldest month', 'climate.et0_mm': 'Reference evapotranspiration', 'terrain.slope_pct': 'Slope', 'terrain.elev_m': 'Elevation', 'terrain.aspect_deg': 'Aspect', 'solar.ghi_kwh': 'Solar radiation', 'energy.pump': 'Pumping', 'water.source': 'Water source', 'water.well_depth_m': 'Well depth', 'crop': 'Crop', 'area_ha': 'Area' },
        ja: { 'soil.texture': '土性', 'soil.clay_pct': '粘土 0–30 cm', 'soil.soc': '有機炭素', 'climate.rain_mm': '年間降水量', 'climate.tmax_hot': '最暑月の最高気温', 'climate.tmin_cold': '最寒月の最低気温', 'climate.et0_mm': '基準蒸発散量', 'terrain.slope_pct': '傾斜', 'terrain.elev_m': '標高', 'terrain.aspect_deg': '斜面の向き', 'solar.ghi_kwh': '日射量', 'energy.pump': '揚水', 'water.source': '水源', 'water.well_depth_m': '井戸の深さ', 'crop': '作物', 'area_ha': '面積' }
      });
      var TX = W(L, { fr: { sandy: 'sableux', loamy: 'limoneux', clayey: 'argileux' }, ar: { sandy: 'رملية', loamy: 'طميية', clayey: 'طينية' }, en: { sandy: 'sandy', loamy: 'loamy', clayey: 'clayey' }, ja: { sandy: '砂質', loamy: 'ローム質', clayey: '粘土質' } });
      var confW = W(L, { fr: 'confiance ', ar: 'ثقة ', en: 'confidence ', ja: '信頼度 ' });
      var show = function (p) {
        var f = D.fieldAt(dna, p);
        if (!f || f.status !== 'ok' || f.value === null) return { p: p, ok: false, text: FL[p] + S + W(L, { fr: 'indisponible', ar: 'غير متاح', en: 'unavailable', ja: '取得不可' }) + (f && f.note ? ' — ' + G.tr(f.note) : '') };
        var v = f.value;
        var txt = typeof v === 'number' ? fmt(v, p === 'terrain.slope_pct' || p === 'solar.ghi_kwh' ? (p === 'solar.ghi_kwh' ? 2 : 1) : 0) + (f.unit ? ' ' + G.tr(f.unit) : '')
          : Array.isArray(v) ? v.join(', ') : (TX[v] || E.valueLabel(v));
        return { p: p, ok: true, text: FL[p] + S + txt + ' (' + G.tr(f.source) + (f.confidence ? ', ' + confW + t('conf_' + f.confidence) : '') + ')' };
      };
      var rows = intent.an.fields.map(show);
      var okRows = rows.filter(function (x) { return x.ok; });
      a.title = W(L, { fr: 'Ce que disent les données de votre parcelle', ar: 'ما تقوله بيانات قطعتك', en: 'What your plot’s data says', ja: '区画のデータからわかること' });
      a.reco = okRows.length ? okRows[0].text : rows[0].text;
      a.expl = rows.slice(1).map(function (x) { return x.text; });
      var lowSoil = intent.an.fields.some(function (p) { var f = D.fieldAt(dna, p); return p.indexOf('soil.') === 0 && f && f.confidence === 'low'; });
      if (lowSoil) a.expl.push(W(L, { fr: 'Les valeurs de sol sont régionales et approximatives, pas une mesure de la parcelle : une analyse de sol est conseillée.', ar: 'قيم التربة جهوية تقريبية وليست قياساً للقطعة: يُنصح بتحليل التربة.', en: 'The soil values are regional and approximate, not a measurement of the plot: a soil analysis is advised.', ja: '土壌の値は地域のおおよその値で、区画の実測ではありません。土壌分析をおすすめします。' }));
      var fam = intent.an.families;
      var rel = all.filter(function (r) { return r.verdict !== 'rejected' && (!fam.length || r.record.families.some(function (f) { return fam.indexOf(f) !== -1; })); }).slice(0, 3);
      if (rel.length) a.expl.push(W(L, { fr: 'Techniques liées possibles ici : ', ar: 'تقنيات ذات صلة ممكنة هنا: ', en: 'Related practices possible here: ', ja: 'ここで可能な関連技術：' }) + rel.map(function (r) { return nameOf(r.record, L) + ' (' + verdictText(r.verdict, L) + ')'; }).join(', ') + (L === 'ja' ? '。' : '.'));
      a.records = rel.map(function (r) { return r.record; });
      a.results = rel;
      a.actions = rel.length ? rel[0].record.actions.slice() : [];
      a.data = dataUsed(dna, intent.an.fields);
      a.missing = rows.filter(function (x) { return !x.ok; }).map(function (x) { return x.p; });
    }

    else if (intent.kind === 'search') {
      var top3 = intent.an.hits.filter(function (h, i) { return h.score >= 2 || i === 0; }).slice(0, 3).map(function (h) { return get(h.id); }).filter(Boolean);
      a.title = W(L, { fr: 'Ce que disent les fiches', ar: 'ما تقوله البطاقات', en: 'What the records say', ja: '記録からわかること' });
      a.reco = nameOf(top3[0].record, L) + ' — ' + top3[0].record.summary;
      a.expl = top3.map(function (r) { return nameOf(r.record, L) + S + verdictText(r.verdict, L) + W(L, { fr: ' pour cette parcelle', ar: ' لهذه القطعة', en: ' for this plot', ja: '（この区画）' }) + (r.adaptation ? ' — ' + r.adaptation.text : '') + (L === 'ja' ? '。' : '.'); });
      top3.slice(1).forEach(function (r) { a.expl.push(nameOf(r.record, L) + ' — ' + r.record.summary); });
      a.records = top3.map(function (r) { return r.record; });
      a.results = top3;
      a.actions = top3[0].record.actions.slice();
      a.data = dataUsed(dna, top3[0].checks.map(function (x) { return x.cond.field; }));
    }

    else return insufficient(L);

    var res = a.results || [];
    a.conf = confidence(dna, res.length ? res : all, L);
    a.missing = (a.missing && a.missing.length ? a.missing.map(function (p) { return noteOf(dna, p); }) : []).concat(missingFor(dna, res)).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
    a.lang = L;
    return a;
  }
  function insufficient(L) {
    return {
      title: W(L, { fr: 'Preuves insuffisantes', ar: 'أدلة غير كافية', en: 'Not enough evidence', ja: '根拠不足' }),
      reco: W(L, { fr: 'GAIA ne peut pas répondre sans inventer.', ar: 'لا أستطيع الإجابة دون اختلاق.', en: 'GAIA cannot answer without inventing.', ja: 'GAIAは推測で答えることはしません。' }),
      expl: [W(L, {
        fr: "Aucune fiche ni donnée de la parcelle ne couvre cette question. GAIA sait répondre sur : le sol, la pluie, la pente, le soleil, le pompage, la surface, et le coût, les risques, les acteurs ou les étapes d'une technique (jessour, tabia, meskat, oasis, citerne, paillage, tanada, solar sharing…).",
        ar: 'لا توجد بطاقة ولا بيانات تخص هذا السؤال. يمكنك السؤال عن: التربة، الأمطار، الانحدار، الشمس، الضخ، تكلفة أو مخاطر تقنية (الجسور، الطابية، المسقاة، الواحة…).',
        en: 'No record and no plot data cover this question. GAIA can answer about: soil, rainfall, slope, sun, pumping, area, and the cost, risks, actors or steps of a practice (jessour, tabia, meskat, oasis, cistern, mulching, tanada, solar sharing…).',
        ja: 'この質問に対応する記録も区画データもありません。GAIAが答えられるのは、土壌・降水量・傾斜・日射・揚水・面積と、各技術（ジェスール、タビア、メスカット、オアシス、貯水槽、マルチング、棚田、ソーラーシェアリングなど）のコスト・リスク・関係者・手順です。'
      })],
      records: [], data: [], actions: [], missing: [], conf: { level: 'low', why: W(L, { fr: 'aucune preuve', ar: 'لا توجد أدلة', en: 'no evidence', ja: '根拠なし' }) }, lang: L, insufficient: true };
  }

  /* ---------------------------------------------------------- render */
  var SEC = {
    fr: { s_reco: 'Recommandation', s_expl: 'Explication', s_rec: 'Fiche technique', s_data: 'Données utilisées', s_conf: 'Confiance', s_miss: 'Informations manquantes', s_act: 'Actions' },
    ar: { s_reco: 'التوصية', s_expl: 'الشرح', s_rec: 'البطاقة التقنية', s_data: 'البيانات المستعملة', s_conf: 'درجة الثقة', s_miss: 'معلومات ناقصة', s_act: 'الخطوات' },
    en: { s_reco: 'Recommendation', s_expl: 'Explanation', s_rec: 'Technical record', s_data: 'Data used', s_conf: 'Confidence', s_miss: 'Missing information', s_act: 'Actions' },
    ja: { s_reco: '推奨', s_expl: '説明', s_rec: '技術記録', s_data: '使用したデータ', s_conf: '信頼度', s_miss: '欠けている情報', s_act: '行動' }
  };
  function sec(title, body) { return el('div', { class: 'sec' }, [el('h4', null, [title])].concat(body)); }
  function renderAnswer(a) {
    var L = a.lang, T = function (k) { return (SEC[L] || SEC.fr)[k]; };
    var box = el('article', { class: 'ans', dir: L === 'ar' ? 'rtl' : 'ltr', lang: L }, [
      el('h3', null, [a.title]),
      sec(T('s_reco'), [el('p', { class: 'reco' }, [a.reco])]),
      a.expl.length ? sec(T('s_expl'), [el('ul', null, a.expl.map(function (x) { return el('li', null, [x]); }))]) : null,
      a.records.length ? sec(T('s_rec'), [el('ul', null, a.records.filter(Boolean).map(function (r) {
        return el('li', null, [el('a', { href: 'library.html#' + r.id }, [nameOf(r, L)]), ' — ', r.sources.map(function (s) { return s.label; }).join(' ; ')]);
      }))]) : null,
      a.data.length ? sec(T('s_data'), [el('ul', null, a.data.map(function (d) { return el('li', null, [d.url ? el('a', { href: d.url, target: '_blank', rel: 'noopener' }, [d.label]) : d.label]); }))]) : null,
      sec(T('s_conf'), [el('p', null, [G.confBadge(a.conf.level), ' ', a.conf.why])]),
      a.missing.length ? sec(T('s_miss'), [el('ul', null, a.missing.map(function (m) { return el('li', null, [m]); }))]) : null,
      a.actions.length ? sec(T('s_act'), [el('ol', null, a.actions.map(function (x) { return el('li', null, [x]); }))]) : null,
      L === 'ar' && a.records.length ? el('p', { class: 'small muted', style: 'margin-top:10px' }, ['تفاصيل البطاقات مكتوبة بالفرنسية؛ الترجمة الكاملة في انتظار المصادقة.']) : null
    ]);
    return box;
  }

  /* ---------------------------------------------------------- optional LLM */
  function withLLM(q, a, dna, holder) {
    var ep = G.CONFIG.assistantEndpoint; if (!ep) return;
    var prof = {};
    D.walk(dna).forEach(function (x) { if (x.f && x.f.status === 'ok' && x.f.value !== null && typeof x.f.value !== 'object') prof[x.path] = { value: x.f.value, unit: x.f.unit || null, source: x.f.source || null, confidence: x.f.confidence || null }; });
    var recs = a.records.length ? a.records : KB.records; // nothing retrieved: let the model look at every record, and say so if none applies
    var verdicts = E.evaluateAll(dna).map(function (r) { return { id: r.record.id, verdict: r.verdict, score: r.score }; });
    var payload = { question: q, lang: R.lang(q) === 'en' ? 'en' : a.lang, answer: { title: a.title, reco: a.reco, expl: a.expl, actions: a.actions, missing: a.missing, insufficient: !!a.insufficient }, profile: prof, verdicts: verdicts, records: recs };
    var wait = el('p', { class: 'small muted', style: 'margin-top:10px' }, [el('span', { class: 'gp-spin' }), ' …']);
    holder.appendChild(wait);
    fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (res) {
        wait.remove();
        var text = String(res.text || '');
        if (!text) { holder.appendChild(G.note('info', t('llm_err'))); return; }
        var evidence = JSON.stringify(payload);
        var nums = text.match(/\d+(?:[.,]\d+)?/g) || [];
        var bad = nums.filter(function (n) { return evidence.indexOf(n.replace(',', '.')) === -1 && evidence.indexOf(n) === -1; });
        holder.appendChild(bad.length ? G.note('err', t('llm_block')) : el('div', { class: 'sec' }, [el('h4', null, [t('s_llm')]), el('p', null, [text])]));
      })
      .catch(function () { wait.remove(); holder.appendChild(G.note('info', t('llm_err'))); });
  }

  /* ---------------------------------------------------------- page */
  function ask(q) {
    var p = G.getParcel(); if (!p || !p.dna) return;
    var intent = detect(q);
    var L = intent.kind === 'arabic' || R.lang(q) === 'ar' ? 'ar' : G.lang();
    var a = answer(intent, p.dna, L);
    if (intent.kind !== 'arabic') lastIntent = intent;
    var threadBox = document.getElementById('thread');
    threadBox.appendChild(el('div', { class: 'q' }, [q]));
    var card = renderAnswer(a);
    threadBox.appendChild(card);
    withLLM(q, a, p.dna, card);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render() {
    var p = G.getParcel();
    if (!p || !p.dna) { G.needParcel(app); return; }
    var dna = p.dna, V = function (k) { return D.value(dna, k); };
    G.clear(app);
    var ctx = el('aside', { class: 'ctx' }, [
      el('div', { class: 'gp-card' }, [
        el('p', { class: 'eyebrow' }, [t('ctx')]),
        el('p', { style: 'font-weight:600;margin-top:4px' }, [p.name || (fmt(p.lat, 4) + ', ' + fmt(p.lon, 4))]),
        el('div', { class: 'kvs' }, [
          el('div', null, [t('k_rain'), el('b', null, [V('climate.rain_mm') === null ? '—' : fmt(V('climate.rain_mm')) + ' ' + t('u_mm_yr')])]),
          el('div', null, [t('k_slope'), el('b', null, [V('terrain.slope_pct') === null ? '—' : fmt(V('terrain.slope_pct'), 1) + ' %'])]),
          el('div', null, [t('k_water'), el('b', null, [V('water.source') ? E.valueLabel(V('water.source')) : '—'])]),
          el('div', null, [t('k_crop'), el('b', null, [V('crop') ? E.valueLabel(V('crop')) : '—'])]),
          el('div', null, [t('k_ghi'), el('b', null, [V('solar.ghi_kwh') === null ? '—' : fmt(V('solar.ghi_kwh'), 2) + ' ' + t('u_kwh_day')])])
        ]),
        el('a', { class: 'small', href: 'land.html', style: 'display:inline-block;margin-top:10px' }, [t('nav_land') + ' →'])
      ]),
      el('div', { class: 'gp-card' }, [el('p', { class: 'eyebrow' }, [t('ask')]),
        el('div', { class: 'qs', style: 'margin-top:8px' }, ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'].map(function (k) {
          return el('button', { type: 'button', onclick: function () { ask(t(k)); } }, [t(k)]);
        }))])
    ]);
    var main = el('section', { 'aria-label': t('conv') }, [
      el('div', { id: 'thread', class: 'thread', 'aria-live': 'polite' }),
      el('div', { class: 'composer' }, [
        el('form', { onsubmit: function (e) { e.preventDefault(); var i = document.getElementById('qin'); var v = i.value.trim(); if (v) { ask(v); i.value = ''; } } }, [
          el('label', { for: 'qin', class: 'sr' }, [t('ph')]),
          el('input', { id: 'qin', type: 'text', placeholder: t('ph'), autocomplete: 'off' }),
          el('button', { class: 'gp-btn primary', type: 'submit' }, [t('send')])
        ]),
        el('p', { class: 'mode' }, [G.pill(G.CONFIG.assistantEndpoint ? 'live' : 'plan', G.CONFIG.assistantEndpoint ? 'LLM' : 'LLM —'), G.CONFIG.assistantEndpoint ? t('mode_llm') : t('mode_rules')])
      ])
    ]);
    app.appendChild(el('div', { class: 'lab' }, [ctx, main]));
  }

  render();
  G.onLang(render);
}());
