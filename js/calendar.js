/* GAIA CALENDRIER CULTURAL (M6): the year's stages for olive, date palm, citrus and cereals,
   crossed with the parcel's own climate (ERA5 normals from GAIA LAND DNA):
   monthly rain, net irrigation need (Kc × ET0 − effective rain, FAO-56), heat and frost months. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, S = window.GAIA_SEASON, N = window.GAIA_NEXUS;

  G.addStrings({
    fr: {
      cl_title: 'Calendrier cultural', cl_lead: "Les grandes étapes de l'année pour l'olivier, le palmier dattier, les agrumes et les céréales, croisées avec la pluie et le besoin en eau de votre parcelle.",
      cl_crop: 'Culture', cl_year: "L'année de la culture", cl_sekki_row: 'Sekki 節気',
      cl_clim: 'Le climat de votre parcelle', cl_rain: 'Pluie (mm)', cl_need: 'Besoin net (mm)', cl_flags: 'Chaleur / gel',
      cl_clim_p: 'Moyennes ERA5 de votre profil. Besoin net = Kc × ET0 − pluie efficace (FAO-56, méthode USDA-SCS), Kc moyen de la culture à vérifier : le mois le plus bleu est celui où l’irrigation pèse le plus.',
      cl_noparcel: 'Choisissez une parcelle pour croiser le calendrier avec son climat. Le calendrier général reste affiché.',
      cl_noclim: 'Climat du profil indisponible : seul le calendrier général est affiché.',
      lg_stage: 'Étape', lg_water: "Étape sensible au manque d'eau", lg_now: 'Mois en cours', lg_heat: 'Chaleur ≥ 35 °C (moyenne des max.)', lg_frost: 'Gel possible (moyenne des min. ≤ 2 °C)',
      cl_details: 'Les étapes en détail', cl_months: 'Mois', cl_practice: 'Pratique courante, à valider par un technicien.',
      cl_sekki_p: 'La ligne des sekki montre les 24 « termes solaires » du calendrier agricole japonais : deux par mois, qui suivent le soleil comme les travaux des champs.'
    },
    ar: {
      cl_title: 'الرزنامة الفلاحية', cl_lead: 'المراحل الكبرى للسنة في الزيتون ونخيل التمر والقوارص والحبوب، مع أمطار قطعتك وحاجتها للماء.',
      cl_crop: 'الزراعة', cl_year: 'سنة الزراعة', cl_sekki_row: 'سيكّي 節気',
      cl_clim: 'مناخ قطعتك', cl_rain: 'المطر (مم)', cl_need: 'الحاجة الصافية (مم)', cl_flags: 'حرارة / صقيع',
      cl_clim_p: 'معدلات ERA5 من ملفك. الحاجة الصافية = Kc × ET0 − المطر الفعّال (FAO-56، طريقة USDA-SCS)، والمعامل Kc يجب التثبت منه: الشهر الأكثر زرقة هو الذي يثقل فيه السقي.',
      cl_noparcel: 'اختر قطعة لربط الرزنامة بمناخها. تبقى الرزنامة العامة معروضة.',
      cl_noclim: 'مناخ الملف غير متاح: تُعرض الرزنامة العامة فقط.',
      lg_stage: 'مرحلة', lg_water: 'مرحلة حساسة لنقص الماء', lg_now: 'الشهر الحالي', lg_heat: 'حرارة ≥ 35 °م (معدل القصوى)', lg_frost: 'صقيع محتمل (معدل الدنيا ≤ 2 °م)',
      cl_details: 'المراحل بالتفصيل', cl_months: 'الأشهر', cl_practice: 'ممارسة شائعة، يجب التثبت منها مع تقني.',
      cl_sekki_p: 'سطر السيكّي يبيّن «المصطلحات الشمسية» الأربعة والعشرين في الرزنامة الفلاحية اليابانية: اثنان في كل شهر، تتبع الشمس كما تتبعها أشغال الحقول.'
    },
    en: {
      cl_title: 'Crop calendar', cl_lead: 'The main stages of the year for olive, date palm, citrus and cereals, set against the rain and water need of your parcel.',
      cl_crop: 'Crop', cl_year: 'The crop’s year', cl_sekki_row: 'Sekki 節気',
      cl_clim: 'Your parcel’s climate', cl_rain: 'Rain (mm)', cl_need: 'Net need (mm)', cl_flags: 'Heat / frost',
      cl_clim_p: 'ERA5 averages from your profile. Net need = Kc × ET0 − effective rain (FAO-56, USDA-SCS method), with an average crop Kc to check: the bluest month is the one where irrigation weighs most.',
      cl_noparcel: 'Choose a parcel to set the calendar against its climate. The general calendar stays on screen.',
      cl_noclim: 'Profile climate unavailable: only the general calendar is shown.',
      lg_stage: 'Stage', lg_water: 'Stage sensitive to water shortage', lg_now: 'Current month', lg_heat: 'Heat ≥ 35 °C (mean of max.)', lg_frost: 'Frost possible (mean of min. ≤ 2 °C)',
      cl_details: 'The stages in detail', cl_months: 'Months', cl_practice: 'Common practice, to check with an extension officer.',
      cl_sekki_p: 'The sekki row shows the 24 “solar terms” of the Japanese farming calendar: two a month, following the sun as the field work does.'
    },
    ja: {
      cl_title: '作物暦', cl_lead: 'オリーブ、ナツメヤシ、柑橘、穀物の一年の主な段階を、あなたの区画の雨と必要水量に重ねて示します。',
      cl_crop: '作物', cl_year: '作物の一年', cl_sekki_row: '二十四節気',
      cl_clim: 'あなたの区画の気候', cl_rain: '雨量（mm）', cl_need: '純必要水量（mm）', cl_flags: '暑さ／霜',
      cl_clim_p: 'プロファイルのERA5平均値。純必要水量 = Kc × ET0 − 有効雨量（FAO-56、USDA-SCS法）。作物の平均Kcは要確認です。最も青い月が、灌漑の負担が最も大きい月です。',
      cl_noparcel: '区画を選ぶと、暦をその気候と重ねて表示します。一般的な暦はそのまま表示されます。',
      cl_noclim: 'プロファイルの気候が取得できないため、一般的な暦だけを表示しています。',
      lg_stage: '段階', lg_water: '水不足に弱い段階', lg_now: '今月', lg_heat: '暑さ ≥ 35 °C（最高気温の平均）', lg_frost: '霜のおそれ（最低気温の平均 ≤ 2 °C）',
      cl_details: '各段階の詳細', cl_months: '月', cl_practice: '一般的な方法です。普及員に確認してください。',
      cl_sekki_p: '節気の行は、日本の農事暦の「二十四節気」を示します。ひと月に二つ、畑仕事と同じように太陽の動きに従います。'
    }
  });

  G.mountShell('season');
  var tabs = document.getElementById('tabs'), app = document.getElementById('app');
  var p = G.getParcel();
  var crop = S.parcelCrop() || 'olive';


  function grid() {
    var months = G.t('months'), now = new Date().getMonth(), c = S.CAL[crop];
    var g = el('div', { class: 'ss-cal', role: 'table', 'aria-label': t('cl_year') });
    g.appendChild(el('div', { role: 'columnheader' }));
    months.forEach(function (m, i) { g.appendChild(el('div', { class: 'hd' + (i === now ? ' now' : ''), role: 'columnheader' }, [m])); });
    // sekki row: the two solar terms that start in each month
    g.appendChild(el('div', { class: 'nm', style: 'font-weight:500;color:var(--g-ink-3);font-size:12px' }, [t('cl_sekki_row')]));
    for (var i = 0; i < 12; i++) {
      var two = S.SEKKI.filter(function (s) { return s[2] === i + 1; });
      var cell = el('div', { class: 'clim', lang: 'ja', style: 'font-family:var(--g-jp);font-size:11px;color:var(--g-gold-ink)' }, [two.map(function (s) { return s[0]; }).join(' ')]);
      G.bindTip(cell, two.map(function (s) { return s[0] + ' ' + s[1] + ' (' + s[3] + '/' + s[2] + ') · ' + S.meaning(s); }).join(' — '));
      g.appendChild(cell);
    }
    g.appendChild(el('div', { class: 'row-sep' }));
    c.stages.forEach(function (s) {
      g.appendChild(el('div', { class: 'nm', role: 'rowheader' }, [S.loc(s)[0]]));
      for (var m = 0; m < 12; m++) {
        var on = s.m.indexOf(m) !== -1;
        var cell = el('div', { class: 'c' + (on ? ' on' : '') + (on && s.w ? ' water' : '') + (m === now ? ' now' : ''), role: 'cell' });
        if (on) G.bindTip(cell, S.loc(s)[0] + ' · ' + months[m]);
        g.appendChild(cell);
      }
    });
    // climate rows
    var cm = p && p.dna ? p.dna.climateMonthly : null;
    if (cm && cm.rain && cm.et0) {
      g.appendChild(el('div', { class: 'row-sep' }));
      var need = cm.et0.map(function (e, m) { var pe = N.effectiveRain(cm.rain[m]); return e === null || pe === null ? null : Math.max(0, c.kc * e - pe); });
      var maxNeed = Math.max.apply(null, need.filter(function (v) { return v !== null; }).concat([1]));
      g.appendChild(el('div', { class: 'nm' }, [t('cl_rain')]));
      cm.rain.forEach(function (v) { g.appendChild(el('div', { class: 'clim' }, [v === null ? '—' : fmt(v, 0)])); });
      g.appendChild(el('div', { class: 'nm' }, [t('cl_need')]));
      need.forEach(function (v, m) {
        var cell = el('div', { class: 'clim', style: v === null ? '' : 'background:rgba(47,90,117,' + (0.08 + 0.6 * v / maxNeed).toFixed(2) + ');color:' + (v / maxNeed > 0.55 ? '#fff' : 'var(--g-ink)') }, [v === null ? '—' : fmt(v, 0)]);
        if (v !== null) G.bindTip(cell, months[m] + ' · ' + t('cl_need') + S.colon() + fmt(v, 0) + ' mm');
        g.appendChild(cell);
      });
      g.appendChild(el('div', { class: 'nm' }, [t('cl_flags')]));
      for (var k = 0; k < 12; k++) {
        var f = [];
        if (cm.tmax && cm.tmax[k] !== null && cm.tmax[k] >= 35) f.push('☀');
        if (cm.tmin && cm.tmin[k] !== null && cm.tmin[k] <= 2) f.push('❄');
        g.appendChild(el('div', { class: 'clim', style: 'font-size:14px' }, [f.join(' ')]));
      }
    }
    return g;
  }

  function legend() {
    var it = function (bg, k) { var i = el('i'); i.style.background = bg; return el('span', null, [i, t(k)]); };
    return el('div', { class: 'ss-legend' }, [it('var(--g-sage)', 'lg_stage'), it('#7FA3BC', 'lg_water'),
      el('span', null, [el('i', { style: 'outline:2px solid var(--g-gold);outline-offset:-2px;background:var(--g-ivory)' }), t('lg_now')]),
      el('span', null, ['☀ ' + t('lg_heat')]), el('span', null, ['❄ ' + t('lg_frost')])]);
  }

  function details() {
    var months = G.t('months');
    return el('ul', { class: 'ss-list' }, S.CAL[crop].stages.map(function (s) {
      var src = s.src ? S.source(s.src) : null;
      return el('li', { class: 'ss-item' + (s.w ? ' water' : '') }, [
        el('span', { class: 'ic', 'aria-hidden': 'true' }, [s.w ? '水' : '暦']),
        el('div', null, [
          el('h3', null, [S.loc(s)[0]]),
          el('p', { class: 'small', style: 'margin-top:2px;font-weight:600;color:var(--g-gold-ink)' }, [s.m.map(function (m) { return months[m]; }).join(' · ')]),
          el('p', null, [S.loc(s)[1]]),
          el('p', { class: 'src' }, src ? [t('src') + S.colon(), src] : [t('cl_practice')])
        ])
      ]);
    }));
  }

  function render() {
    G.clear(tabs).appendChild(S.subnav('cal'));
    G.clear(app);
    var sel = el('select', { id: 'cl-crop', onchange: function (e) { crop = e.target.value; render(); } }, Object.keys(S.CAL).map(function (k) {
      return el('option', { value: k, selected: k === crop ? 'selected' : null }, [t('crop_' + k)]);
    }));
    app.appendChild(el('div', { class: 'gp-field', style: 'max-width:320px' }, [el('label', { for: 'cl-crop' }, [t('cl_crop')]), sel]));
    if (!p || !p.dna) app.appendChild(el('div', { style: 'margin-top:12px' }, [G.note('info', t('cl_noparcel'))]));
    else if (!p.dna.climateMonthly) app.appendChild(el('div', { style: 'margin-top:12px' }, [G.note('info', t('cl_noclim'))]));
    app.appendChild(el('section', { class: 'ss-sec' }, [
      el('h2', null, [t('cl_year') + ' · ' + t('crop_' + crop)]),
      el('div', { class: 'gp-card gp-table-wrap', style: 'margin-top:12px' }, [grid()]),
      legend(),
      p && p.dna && p.dna.climateMonthly ? el('p', { class: 'small muted', style: 'margin-top:8px' }, [t('cl_clim_p')]) : null,
      el('p', { class: 'small muted', style: 'margin-top:6px' }, [t('cl_sekki_p')])
    ]));
    app.appendChild(el('section', { class: 'ss-sec' }, [el('h2', null, [t('cl_details')]), details(),
      el('p', { class: 'small', style: 'margin-top:10px' }, [t('to_validate')])]));
    app.appendChild(el('div', { style: 'margin-top:22px' }, [G.kaizenButton({ kind: 'calendar', crop: crop })]));
  }
  render();
  G.onLang(render);
}());
