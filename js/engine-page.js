/* Compatibility engine page. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, E = window.GAIA_ENGINE;

  G.addStrings({
    fr: {
      e_title: 'Moteur de compatibilité',
      e_lead: 'Chaque technique est testée sur six dimensions. Une condition obligatoire non remplie écarte la technique, sauf si sa fiche prévoit une adaptation.',
      e_parcel: 'Parcelle évaluée', e_change: 'Changer de parcelle',
      e_n_ok: 'faisables', e_n_adapt: 'avec adaptation', e_n_no: 'non recommandées',
      f_all: 'Toutes', f_jp: 'Origine Japon', f_tn: 'Origine Tunisie',
      why_ok: 'Pourquoi elle convient', what_adapt: 'Ce qui doit être adapté', why_no: 'Pourquoi elle est écartée', actions: 'Trois actions',
      sources: 'Sources', not_eval: 'Non évalué faute de donnée', score: 'Correspondance',
      score_m: 'Part pondérée des conditions secondaires remplies. Affichée seulement si toutes ont pu être évaluées.',
      no_score: 'Pas de score : une condition secondaire n’a pas pu être évaluée.',
      provisional: 'Au moins un seuil de cette fiche est provisoire et doit être validé par un agronome.',
      draft: 'Fiche en brouillon, non validée par un expert', rejected_list: 'Techniques écartées pour cette parcelle',
      to_check: 'À vérifier', mat_cost: 'Coût', mat: 'Matériaux', actors: 'Acteurs locaux', reg: 'Réglementation',
      open_rec: 'Ouvrir la fiche', none_dim: '—',
      e_note: "Ces verdicts viennent de règles explicites appliquées au profil de la parcelle. Ils ne remplacent pas l'avis d'un agronome.",
      e_core_missing: 'Données essentielles manquantes : {f}. Les verdicts qui en dépendent restent « non évalué ».', e_filter: 'Filtre'
    },
    ar: {
      e_title: 'محرك التوافق',
      e_lead: 'تُختبر كل تقنية على ستة أبعاد. إذا لم يُستوفَ شرط إلزامي تُستبعد التقنية، إلا إذا نصّت بطاقتها على تكييف.',
      e_parcel: 'القطعة المقيّمة', e_change: 'تغيير القطعة',
      e_n_ok: 'ممكنة', e_n_adapt: 'مع التكييف', e_n_no: 'غير موصى بها',
      f_all: 'الكل', f_jp: 'من اليابان', f_tn: 'من تونس',
      why_ok: 'لماذا تناسب', what_adapt: 'ما يجب تكييفه', why_no: 'سبب الاستبعاد', actions: 'ثلاث خطوات',
      sources: 'المصادر', not_eval: 'لم يُقيَّم لنقص البيانات', score: 'نسبة التوافق',
      score_m: 'النسبة الموزونة للشروط الثانوية المستوفاة، تُعرض فقط إذا أمكن تقييمها كلها.',
      no_score: 'لا توجد نسبة: تعذّر تقييم أحد الشروط الثانوية.',
      provisional: 'عتبة واحدة على الأقل في هذه البطاقة مؤقتة ويجب أن يصادق عليها مهندس فلاحي.',
      draft: 'بطاقة مسودة غير مصادق عليها', rejected_list: 'التقنيات المستبعدة لهذه القطعة',
      to_check: 'للتحقق', mat_cost: 'التكلفة', mat: 'المواد', actors: 'الفاعلون المحليون', reg: 'التنظيمات',
      open_rec: 'فتح البطاقة', none_dim: '—',
      e_note: 'هذه الأحكام ناتجة عن قواعد صريحة مطبّقة على ملف القطعة، ولا تعوّض رأي مهندس فلاحي.',
      e_core_missing: 'Données essentielles manquantes : {f}. Les verdicts qui en dépendent restent « non évalué ».', e_filter: 'Filtre'
    },
    en: {
      e_title: 'Compatibility engine',
      e_lead: 'Each practice is tested on six dimensions. A mandatory condition that is not met rules the practice out, unless its record provides an adaptation.',
      e_parcel: 'Plot assessed', e_change: 'Change plot',
      e_n_ok: 'feasible', e_n_adapt: 'with adaptation', e_n_no: 'not recommended',
      f_all: 'All', f_jp: 'From Japan', f_tn: 'From Tunisia',
      why_ok: 'Why it fits', what_adapt: 'What must be adapted', why_no: 'Why it is ruled out', actions: 'Three actions',
      sources: 'Sources', not_eval: 'Not assessed for lack of data', score: 'Match',
      score_m: 'Weighted share of the secondary conditions met. Shown only when all of them could be assessed.',
      no_score: 'No score: a secondary condition could not be assessed.',
      provisional: 'At least one threshold in this record is provisional and must be validated by an agronomist.',
      draft: 'Draft record, not validated by an expert', rejected_list: 'Practices ruled out for this plot',
      to_check: 'To check', mat_cost: 'Cost', mat: 'Materials', actors: 'Local actors', reg: 'Regulation',
      open_rec: 'Open the record', none_dim: '—',
      e_note: 'These verdicts come from explicit rules applied to the plot profile. They do not replace an agronomist’s advice.',
      e_core_missing: 'Essential data missing: {f}. Verdicts that depend on it stay “not assessed”.', e_filter: 'Filter'
    },
    ja: {
      e_title: '適合性エンジン',
      e_lead: '各技術を6つの観点で検証します。必須条件を満たさない技術は除外されます。ただし、記録に調整方法がある場合は除きます。',
      e_parcel: '評価した区画', e_change: '区画を変更',
      e_n_ok: '実施可能', e_n_adapt: '調整すれば可能', e_n_no: '推奨しない',
      f_all: 'すべて', f_jp: '日本発', f_tn: 'チュニジア発',
      why_ok: '適している理由', what_adapt: '調整が必要な点', why_no: '除外した理由', actions: '3つの行動',
      sources: '出典', not_eval: 'データ不足のため未評価', score: '適合度',
      score_m: '満たした副次条件の加重割合。すべて評価できた場合のみ表示します。',
      no_score: 'スコアなし：評価できない副次条件があります。',
      provisional: 'この記録には暫定的なしきい値が少なくとも1つあり、農業技術者による検証が必要です。',
      draft: '下書きの記録（専門家未検証）', rejected_list: 'この区画で除外した技術',
      to_check: '要確認', mat_cost: 'コスト', mat: '資材', actors: '地域の関係者', reg: '規制',
      open_rec: '記録を開く', none_dim: '—',
      e_note: 'これらの判定は、区画プロファイルに明示的なルールを適用した結果です。農業技術者の助言に代わるものではありません。',
      e_core_missing: '重要なデータが欠けています：{f}。これに依存する判定は「未評価」のままです。', e_filter: '絞り込み'
    }
  });
  G.addStrings({
    fr: { e_missing: 'Ce qui manque pour décider', e_complete: 'Compléter le profil de la parcelle', no_cond: 'Sans contrainte',
      no_cond_tip: 'La fiche ne fixe aucune condition sur cette dimension.', none_passed: 'Aucune condition confirmée pour l’instant : les données de la parcelle manquent pour les vérifier.',
      missing_soft: 'Aucune condition obligatoire ne manque ; les conditions secondaires ci-dessous restent à vérifier.', unknown_tip: 'Donnée manquante : ' },
    ar: { e_missing: 'ما ينقص لاتخاذ القرار', e_complete: 'أكمل ملف القطعة', no_cond: 'بلا قيد',
      no_cond_tip: 'لا تحدد البطاقة أي شرط في هذا البعد.', none_passed: 'لا يوجد شرط مؤكد بعد: تنقص بيانات القطعة للتحقق منها.',
      missing_soft: 'لا ينقص أي شرط إلزامي؛ الشروط الثانوية أدناه تبقى للتحقق.', unknown_tip: 'بيانات ناقصة: ' },
    en: { e_missing: 'What is missing to decide', e_complete: 'Complete the plot profile', no_cond: 'No constraint',
      no_cond_tip: 'The record sets no condition on this dimension.', none_passed: 'No condition confirmed yet: the plot data needed to check them is missing.',
      missing_soft: 'No mandatory condition is missing; the secondary conditions below remain to be checked.', unknown_tip: 'Missing data: ' },
    ja: { e_missing: '判断に足りない情報', e_complete: '区画プロファイルを補う', no_cond: '制約なし',
      no_cond_tip: 'この観点について記録に条件はありません。', none_passed: 'まだ確認できた条件はありません。確認に必要な区画データが不足しています。',
      missing_soft: '必須条件に不足はありません。以下の副次条件は引き続き確認が必要です。', unknown_tip: '欠けているデータ：' }
  });
  G.mountShell('engine');

  var app = document.getElementById('app');
  var filter = 'all';

  function vLabel(v) { return t(v === 'feasible' ? 'verdict_ok' : v === 'adapt' ? 'verdict_adapt' : v === 'insufficient' ? 'verdict_unk' : 'verdict_no'); }
  function dimLabel(d) { return t({ climate: 'dim_climate', terrain: 'dim_terrain', water: 'dim_water', materials: 'dim_materials', org: 'dim_org', reg: 'dim_reg' }[d]); }

  function dimBox(d, info, rec) {
    var st = info.status, txt, ic;
    var notes = (rec && rec.dimNotes) || {};
    if (st === 'pass') { txt = t('pass'); ic = 'ok'; }
    else if (st === 'fail') { txt = t('fail'); ic = 'no'; }
    else if (st === 'partial') { txt = t('pass') + ' / ' + t('fail'); ic = 'adapt'; }
    else if (st === 'unknown') { txt = t('unknown'); ic = 'unk'; }
    else if (st === 'info') { txt = t('to_check'); ic = 'info'; }
    else { txt = t('no_cond'); ic = 'info'; }
    var box = el('div', { class: 'dim ' + st }, [el('b', null, [dimLabel(d)]), el('span', null, [G.icon(ic), txt])]);
    var tip = info.checks.map(function (x) { return (x.result === 'unknown' ? t('unknown_tip') : '') + E.describe(x); }).join(' · ');
    if (!tip && st === 'info' && rec) tip = { materials: rec.materials + ' — ' + rec.cost, org: rec.actors, reg: rec.regulation }[d] || '';
    if (!tip) tip = notes[d] || t('no_cond_tip');
    else if (notes[d]) tip += ' · ' + notes[d];
    if (tip) G.bindTip(box, tip);
    return box;
  }

  function card(r) {
    var rec = r.record, ar = G.lang() === 'ar';
    var name = ar && rec.name_ar ? rec.name_ar : rec.name;
    var head = el('div', { class: 'thead' }, [
      el('span', { class: 'origin ' + rec.origin }, [el('i', { class: 'dot' }), t(rec.origin === 'jp' ? 'origin_jp' : 'origin_tn')]),
      el('h3', null, [name, rec.jp ? el('span', { class: 'jp', lang: 'ja' }, [rec.jp]) : null]),
      G.pill(r.verdict === 'feasible' ? 'ok' : r.verdict === 'adapt' ? 'adapt' : r.verdict === 'insufficient' ? 'unk' : 'no', vLabel(r.verdict))
    ]);

    var scoreBox = null;
    if (r.verdict !== 'rejected') {
      scoreBox = r.score !== null
        ? el('p', { class: 'small', style: 'margin-top:8px' }, [t('score') + ' : ', el('span', { class: 'score' }, [fmt(r.score * 100) + ' %'])])
        : el('p', { class: 'small muted', style: 'margin-top:8px' }, [t('no_score')]);
      if (r.score !== null) G.bindTip(scoreBox, t('score_m'));
    }

    var dims = el('div', { class: 'dims' }, E.DIMS.map(function (d) { return dimBox(d, r.dims[d], rec); }));

    var passed = r.checks.filter(function (x) { return x.result === 'pass'; });
    var cols = [];
    if (r.verdict === 'rejected') {
      cols.push(el('div', null, [el('h4', null, [t('why_no')]), el('ul', null, r.hardFails.map(function (x) {
        return el('li', null, [E.describe(x) + ' — ' + x.cond.why]);
      }))]));
    } else {
      cols.push(el('div', null, [el('h4', null, [t('why_ok')]), passed.length ? el('ul', null, passed.map(function (x) {
        return el('li', null, [E.describe(x)]);
      })) : el('p', { class: 'small muted' }, [t('none_passed')])]));
      if (r.verdict === 'insufficient') {
        var need = r.unknown.filter(function (x) { return x.cond.hard; });
        if (!need.length) need = r.unknown;
        cols.push(el('div', null, [el('h4', null, [t('e_missing')]), el('ul', null, need.map(function (x) {
          return el('li', null, [E.describe(x) + ' — ' + x.cond.why]);
        })), el('a', { class: 'small', href: 'land.html' }, [t('e_complete') + ' →'])]));
      }
      if (r.adaptation) cols.push(el('div', null, [el('h4', null, [t('what_adapt')]), el('p', { class: 'small', style: 'color:var(--g-ink-2)' }, [r.adaptation.text])]));
      if (rec.actions && rec.actions.length) cols.push(el('div', null, [el('h4', null, [t('actions')]), el('ol', null, rec.actions.map(function (a) { return el('li', null, [a]); }))]));
    }
    if (r.unknown.length) cols.push(el('div', null, [el('h4', null, [t('not_eval')]), el('ul', null, r.unknown.map(function (x) { return el('li', null, [E.describe(x)]); }))]));

    var more = el('details', { class: 'gp-more' }, [
      el('summary', null, [t('to_check') + ' : ' + t('dim_materials') + ', ' + t('dim_org') + ', ' + t('dim_reg')]),
      el('div', { class: 'tcols', style: 'margin-top:4px' }, [
        el('div', null, [el('h4', null, [t('mat')]), el('p', { class: 'small' }, [rec.materials || '—']), el('h4', { style: 'margin-top:10px' }, [t('mat_cost')]), el('p', { class: 'small' }, [rec.cost || '—'])]),
        el('div', null, [el('h4', null, [t('actors')]), el('p', { class: 'small' }, [rec.actors || '—'])].concat(rec.dimNotes && rec.dimNotes.org ? [el('p', { class: 'small muted' }, [rec.dimNotes.org])] : [])),
        el('div', null, [el('h4', null, [t('reg')]), el('p', { class: 'small' }, [rec.regulation || '—'])])
      ])
    ]);

    var src = el('div', { style: 'margin-top:14px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:13px' }, [
      el('span', { class: 'muted' }, [t('sources') + ' :'])
    ].concat(rec.sources.map(function (s) {
      return s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener' }, [s.label]) : el('span', { class: 'muted' }, [s.label]);
    })).concat([
      G.pill('demo', t('draft')),
      el('a', { href: 'library.html#' + rec.id }, [t('open_rec') + ' →']),
      G.kaizenButton({ kind: 'recommendation', record: rec.id, verdict: r.verdict, parcel: G.getParcel() ? { lat: G.getParcel().lat, lon: G.getParcel().lon } : null })
    ]));

    return el('article', { class: 'tcard v-' + r.verdict, 'data-origin': rec.origin }, [
      head, scoreBox, r.provisional ? el('p', { class: 'small', style: 'margin-top:8px;color:var(--s-adapt)' }, [t('provisional')]) : null,
      dims, el('div', { class: 'tcols' }, cols), more, src
    ]);
  }

  function render() {
    var p = G.getParcel();
    if (!p || !p.dna) { G.needParcel(app); return; }
    var results = E.evaluateAll(p.dna);
    G.clear(app);

    var count = function (v) { return results.filter(function (r) { return r.verdict === v; }).length; };
    app.appendChild(el('div', { class: 'sum' }, [
      el('div', { class: 'gp-card' }, [el('p', { class: 'eyebrow' }, [t('e_parcel')]),
        el('p', { style: 'font-weight:600;margin-top:4px' }, [p.name || (fmt(p.lat, 4) + ', ' + fmt(p.lon, 4))]),
        el('a', { class: 'small', href: 'land.html' }, [t('e_change')])]),
      el('div', { class: 'gp-card' }, [el('span', { class: 'n' }, [String(count('feasible'))]), ' ', G.pill('ok', t('e_n_ok'))]),
      el('div', { class: 'gp-card' }, [el('span', { class: 'n' }, [String(count('adapt'))]), ' ', G.pill('adapt', t('e_n_adapt'))]),
      el('div', { class: 'gp-card' }, [el('span', { class: 'n' }, [String(count('insufficient'))]), ' ', G.pill('unk', t('verdict_unk'))]),
      el('div', { class: 'gp-card' }, [el('span', { class: 'n' }, [String(count('rejected'))]), ' ', G.pill('no', t('e_n_no'))])
    ]));
    app.appendChild(el('div', { style: 'margin-top:14px' }, [G.note('info', t('e_note'))]));
    if (p.dna.quality.coreMissing.length) {
      app.appendChild(el('div', { style: 'margin-top:10px' }, [G.note('warn', t('e_core_missing').replace('{f}', p.dna.quality.coreMissing.map(G.fieldLabel).join(', ')))]));
    }

    var fbar = el('div', { class: 'filters', role: 'group', 'aria-label': t('e_filter') });
    [['all', 'f_all'], ['jp', 'f_jp'], ['tn', 'f_tn']].forEach(function (f) {
      fbar.appendChild(el('button', { type: 'button', 'aria-pressed': String(filter === f[0]), onclick: function () { filter = f[0]; render(); } }, [t(f[1])]));
    });
    app.appendChild(fbar);

    var list = el('div', { class: 'tech' });
    results.filter(function (r) { return filter === 'all' || r.record.origin === filter; }).forEach(function (r) { list.appendChild(card(r)); });
    app.appendChild(list);
  }

  render();
  G.onLang(render);
}());
