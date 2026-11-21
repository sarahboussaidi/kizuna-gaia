/* GAIA MOTTAINAI (M6): farm residues and their second life, per crop, with cautions and sources.
   Residues appearing this month (from the crop calendar) are highlighted.
   GAIA gives no tonnages: they depend on the farm, so it does not invent them. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, S = window.GAIA_SEASON;

  G.addStrings({
    fr: {
      mt_title: 'Mottainai', mt_lead: "« Mottainai » : le regret de gaspiller ce qui a encore de la valeur. Ce que votre ferme produit comme résidus, et la seconde vie de chacun.",
      mt_word: 'もったいない', mt_word_p: "Au Japon, « mottainai » se dit devant un objet jeté alors qu'il pouvait encore servir. Dans les oasis et les oliveraies tunisiennes, la même idée existe depuis toujours : la palme fait la clôture, le grignon chauffe le four. GAIA la rend visible, culture par culture.",
      mt_crops: 'Mes cultures', mt_uses: 'Seconde vie', mt_care: 'Attention', mt_now: 'Ce mois-ci',
      mt_tag_soil: 'Sol', mt_tag_energy: 'Énergie', mt_tag_income: 'Revenu', mt_tag_animals: 'Élevage',
      mt_practice: 'Pratique courante, à valider avec un technicien.', mt_noqty: "GAIA n'affiche pas de quantités : elles dépendent de votre ferme. Pesez une fois une remorque de taille ou de palmes et notez-le avec le bouton Kaizen : c'est ainsi que les chiffres deviendront fiables.",
      mt_water_h: 'Et l’eau ?', mt_water_p: "Mottainai vaut aussi pour l'eau : pas une goutte pompée au-delà du besoin de la culture. Voir le quota mensuel dans Eau & énergie.", mt_open_nexus: 'Ouvrir Eau & énergie →'
    },
    ar: {
      mt_title: 'موتايناي', mt_lead: '«موتايناي»: الأسف على تضييع ما لا تزال له قيمة. ما تنتجه ضيعتك من بقايا، والحياة الثانية لكل منها.',
      mt_word: 'もったいない', mt_word_p: 'في اليابان تُقال «موتايناي» أمام شيء رُمي وكان يمكن أن ينفع. وفي الواحات وغابات الزيتون التونسية الفكرة نفسها موجودة منذ القدم: الجريد يصير سياجاً، والفيتورة توقد الفرن. غايا تجعلها مرئية، زراعة بزراعة.',
      mt_crops: 'زراعاتي', mt_uses: 'حياة ثانية', mt_care: 'انتباه', mt_now: 'هذا الشهر',
      mt_tag_soil: 'التربة', mt_tag_energy: 'الطاقة', mt_tag_income: 'دخل', mt_tag_animals: 'الماشية',
      mt_practice: 'ممارسة شائعة، يجب التثبت منها مع تقني.', mt_noqty: 'لا تعرض غايا كميات: فهي تختلف حسب ضيعتك. زِن مرة واحدة حمولة من أغصان التقليم أو الجريد وسجّلها بزر كايزن: هكذا تصبح الأرقام موثوقة.',
      mt_water_h: 'والماء؟', mt_water_p: 'موتايناي يشمل الماء أيضاً: لا قطرة تُضخ فوق حاجة الزراعة. انظر الحصة الشهرية في صفحة الماء والطاقة.', mt_open_nexus: 'فتح الماء والطاقة ←'
    }
  });

  G.mountShell('season');
  var tabs = document.getElementById('tabs'), app = document.getElementById('app');
  var pc = S.parcelCrop();
  var chosen = G.load('gaia.mott.crops', null) || (pc ? [pc] : Object.keys(S.CAL));
  function L() { return G.lang() === 'ar' ? 'ar' : 'fr'; }

  // residues that appear this month, from the crop calendar
  function nowSet() {
    var m = new Date().getMonth(), set = {};
    Object.keys(S.CAL).forEach(function (c) { S.CAL[c].stages.forEach(function (s) { if (s.res && s.m.indexOf(m) !== -1) set[s.res] = true; }); });
    return set;
  }

  function render() {
    G.clear(tabs).appendChild(S.subnav('mott'));
    G.clear(app);
    app.appendChild(el('div', { class: 'ss-hero' }, [
      el('div', null, [el('p', { class: 'eyebrow' }, ['Mottainai · 惜しむ']), el('h2', { lang: 'ja', style: 'font-family:var(--g-jp)' }, [t('mt_word')]), el('p', null, [t('mt_word_p')])]),
      el('div', { class: 'ss-sekki' }, [el('div', { class: 'kj', lang: 'ja' }, ['惜']), el('div', { class: 'me' }, ['oshimu'])])
    ]));
    var chips = el('div', { class: 'ss-choice', role: 'group', 'aria-label': t('mt_crops') }, Object.keys(S.CAL).map(function (c) {
      return el('button', { type: 'button', 'aria-pressed': chosen.indexOf(c) !== -1 ? 'true' : 'false', onclick: function () {
        var i = chosen.indexOf(c);
        if (i === -1) chosen.push(c); else if (chosen.length > 1) chosen.splice(i, 1);
        G.save('gaia.mott.crops', chosen); render();
      } }, [t('crop_' + c)]);
    }));
    app.appendChild(el('section', { class: 'ss-sec' }, [el('h2', null, [t('mt_crops')]), chips]));

    var now = nowSet();
    var keys = Object.keys(S.MOTT).filter(function (k) { return chosen.indexOf(S.MOTT[k].crop) !== -1; });
    keys.sort(function (a, b) { return (now[b] ? 1 : 0) - (now[a] ? 1 : 0); });
    app.appendChild(el('div', { class: 'ss-mott' }, keys.map(function (k) {
      var r = S.MOTT[k], x = r[L()], src = r.src ? S.source(r.src) : null;
      return el('article', { class: 'gp-card' + (now[k] ? ' ss-now' : '') }, [
        el('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between' }, [
          el('span', { class: 'small', style: 'font-weight:700;color:var(--g-gold-ink)' }, [t('crop_' + r.crop)]),
          now[k] ? G.pill('live', t('mt_now')) : null
        ]),
        el('h3', null, [x.name]),
        el('div', { class: 'ss-tags' }, r.tags.map(function (tg) { return el('span', { class: 'ss-tag ' + tg }, [t('mt_tag_' + tg)]); })),
        el('p', { class: 'small', style: 'font-weight:700;margin-top:4px' }, [t('mt_uses')]),
        el('ul', null, x.uses.map(function (u) { return el('li', null, [u]); })),
        el('div', { class: 'ss-care' }, [el('strong', null, [t('mt_care') + ' : ']), x.care]),
        el('p', { class: 'small muted' }, src ? [t('src') + ' : ', src] : [t('mt_practice')])
      ]);
    })));
    app.appendChild(el('div', { style: 'margin-top:16px' }, [G.note('info', t('mt_noqty'))]));
    app.appendChild(el('section', { class: 'gp-card', style: 'margin-top:16px' }, [el('h2', null, [t('mt_water_h')]), el('p', { style: 'margin-top:6px;color:var(--g-ink-2)' }, [t('mt_water_p')]),
      el('a', { href: 'nexus.html', style: 'display:inline-block;margin-top:8px;font-weight:700;font-size:14px' }, [t('mt_open_nexus')])]));
    app.appendChild(el('div', { style: 'margin-top:18px' }, [G.kaizenButton({ kind: 'mottainai', crops: chosen.slice() })]));
  }
  render();
  G.onLang(render);
}());
