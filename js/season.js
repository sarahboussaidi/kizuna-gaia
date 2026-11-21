/* GAIA MA SAISON (M6): this month's actions, real-weather alerts, water used vs quota.
   Real data only: the parcel profile, Open-Meteo forecasts, and meter readings the farmer types in.
   Nothing is simulated on this page; when a source is missing, the page says so. */
(function () {
  'use strict';
  var G = window.GAIA, el = G.el, t = G.t, fmt = G.fmt, D = window.GAIA_DNA, S = window.GAIA_SEASON, N = window.GAIA_NEXUS;

  G.addStrings({
    fr: {
      ms_title: 'Ma saison', ms_lead: "Ce mois-ci sur votre parcelle : quoi faire, ce qui arrive, et l'eau utilisée face au besoin de la culture. Uniquement des données réelles ou saisies par vous.",
      ms_month: 'Ma saison', ms_actions_n: '{n} étapes en cours pour votre culture ce mois-ci.', ms_actions_1: 'Une étape en cours pour votre culture ce mois-ci.', ms_actions_0: 'Pas d’étape majeure ce mois-ci : un bon moment pour observer et entretenir.', ms_no_crop_h: 'Culture non prise en charge par le calendrier',
      ms_no_crop: "Le calendrier couvre l'olivier, le palmier dattier, les agrumes et les céréales. Déclarez votre culture dans Land Intelligence pour voir les actions du mois.",
      ms_sekki: 'Saison japonaise', ms_sekki_next: 'Ensuite : {k} {r}, vers le {d}',
      ms_todo: 'À faire ce mois-ci', ms_todo_p: 'Étapes du calendrier cultural en cours ce mois-ci, pour votre culture.',
      ms_practice: 'Pratique courante, à valider par un technicien.', ms_water_stage: "Stade sensible au manque d'eau",
      ms_res_h: 'Résidu de ce mois : {r}', ms_res_p: 'Ne le brûlez pas : voir ses usages dans Mottainai.',
      ms_alerts: 'Alertes', ms_alerts_p: 'Calculées sur les prévisions Open-Meteo pour votre parcelle et sur les normales de votre profil (ERA5). Seuils fixés par GAIA, à ajuster avec un technicien.',
      ms_loading: 'Lecture des prévisions…', ms_wx_err: 'Prévisions indisponibles ({e}). Aucune alerte n’est calculée : GAIA ne devine pas la météo.',
      ms_drought_crit: 'Sécheresse marquée : {o} mm de pluie sur 90 jours, pour {n} mm en moyenne ({p} %). Planifiez votre eau et priorisez les stades sensibles.',
      ms_drought_warn: 'Pluie en dessous de la normale : {o} mm sur 90 jours, pour {n} mm en moyenne ({p} %).',
      ms_drought_ok: 'Pluie des 90 derniers jours conforme à la normale : {o} mm pour {n} mm en moyenne ({p} %).',
      ms_drought_dry: 'Période normalement sèche (moins de 20 mm attendus en 90 jours) : pas de comparaison utile.',
      ms_drought_nonorm: 'Normales de pluie absentes du profil : comparaison impossible.',
      ms_rain: 'Pluie prévue : {s} mm sur 7 jours (maximum {m} mm le {d}). Reportez l’arrosage et laissez la pluie travailler.',
      ms_rain_heavy: 'Forte pluie prévue le {d} ({m} mm) : vérifiez les déversoirs des jessour et des tabias, risque d’érosion.',
      ms_heat: 'Chaleur forte prévue : jusqu’à {v} °C le {d}. Arrosez tôt le matin ou le soir, paillez le sol.',
      ms_frost: 'Risque de gel : {v} °C le {d}. Protégez les jeunes plants et les agrumes.',
      ms_calm: 'Pas d’événement marquant prévu dans les 7 prochains jours.',
      tag_crit: 'Critique', tag_warn: 'Attention', tag_info: 'Info', tag_ok: 'Bon',
      ms_src_wx: 'Source : Open-Meteo (prévisions et 92 derniers jours) · normales : votre profil GAIA LAND DNA.',
      ms_water: 'Eau ce mois-ci', ms_water_p: 'Le quota de référence est le besoin de la culture (FAO-56) pour un mois au climat moyen. L’eau utilisée vient de vos relevés de compteur : rien n’est simulé.',
      ms_quota: 'Quota de référence', ms_used: 'Eau utilisée', ms_left: 'Reste', ms_over: 'Dépassement',
      ms_quota_missing: 'Quota non calculable : {w}. Complétez la page Eau & énergie.', ms_miss_area: 'surface manquante', ms_miss_kc: 'coefficient cultural manquant', ms_miss_clim: 'climat du profil indisponible',
      ms_quota_zero: 'Ce mois-ci, la pluie moyenne couvre le besoin de la culture : quota d’irrigation nul.',
      ms_need_two: 'Ajoutez un relevé du compteur au début et un autre en fin de période pour mesurer l’eau utilisée ce mois-ci.',
      ms_meter_down: 'Le dernier relevé est inférieur au précédent : vérifiez la saisie (compteur remplacé ?).',
      ms_add: 'Ajouter un relevé de compteur', ms_date: 'Date du relevé', ms_index: 'Index du compteur (m³)', ms_save: 'Enregistrer', ms_del: 'Supprimer',
      ms_readings: 'Vos relevés', ms_none: 'Aucun relevé pour le moment.', ms_local: 'Les relevés restent sur cet appareil. Un débitmètre connecté (boîtier IoT) pourra les remplir automatiquement.',
      ms_period: 'du {a} au {b}',
      ms_tech: 'Techniques compatibles avec votre parcelle', ms_tech_p: 'Selon le moteur de compatibilité : faisables ou faisables avec adaptation.', ms_tech_none: 'Aucune technique faisable avec les données actuelles : voir le détail dans Compatibilité.',
      ms_open_engine: 'Ouvrir Compatibilité →', ms_open_cal: 'Voir le calendrier complet →', ms_open_mott: 'Ouvrir Mottainai →', ms_open_nexus: 'Ouvrir Eau & énergie →'
    },
    ar: {
      ms_title: 'موسمي', ms_lead: 'هذا الشهر في قطعتك: ماذا تفعل، ماذا سيحدث، والماء المستعمل مقارنة بحاجة الزراعة. بيانات حقيقية فقط أو مما تُدخله أنت.',
      ms_month: 'موسمي', ms_actions_n: '{n} مراحل جارية لزراعتك هذا الشهر.', ms_actions_1: 'مرحلة واحدة جارية لزراعتك هذا الشهر.', ms_actions_0: 'لا مرحلة كبرى هذا الشهر: وقت مناسب للملاحظة والصيانة.', ms_no_crop_h: 'الزراعة غير مشمولة بالرزنامة',
      ms_no_crop: 'تشمل الرزنامة الزيتون ونخيل التمر والقوارص والحبوب. صرّح بزراعتك في صفحة ذكاء الأرض لرؤية أعمال الشهر.',
      ms_sekki: 'الفصل الياباني', ms_sekki_next: 'بعده: {k} {r}، حوالي {d}',
      ms_todo: 'أعمال هذا الشهر', ms_todo_p: 'مراحل الرزنامة الفلاحية الجارية هذا الشهر لزراعتك.',
      ms_practice: 'ممارسة شائعة، يجب التثبت منها مع تقني.', ms_water_stage: 'مرحلة حساسة لنقص الماء',
      ms_res_h: 'بقايا هذا الشهر: {r}', ms_res_p: 'لا تحرقها: انظر استعمالاتها في موتايناي.',
      ms_alerts: 'التنبيهات', ms_alerts_p: 'محسوبة من توقعات Open-Meteo لقطعتك ومن المعدلات في ملفك (ERA5). العتبات حددتها غايا، تُعدّل مع تقني.',
      ms_loading: 'قراءة التوقعات…', ms_wx_err: 'التوقعات غير متاحة ({e}). لا يُحسب أي تنبيه: غايا لا تخمّن الطقس.',
      ms_drought_crit: 'جفاف واضح: {o} مم من المطر في 90 يوماً مقابل {n} مم في المعدل ({p}٪). خطّط لمائك وأعطِ الأولوية للمراحل الحساسة.',
      ms_drought_warn: 'أمطار دون المعدل: {o} مم في 90 يوماً مقابل {n} مم في المعدل ({p}٪).',
      ms_drought_ok: 'أمطار الأيام التسعين الأخيرة في المعدل: {o} مم مقابل {n} مم ({p}٪).',
      ms_drought_dry: 'فترة جافة عادة (أقل من 20 مم متوقعة في 90 يوماً): لا مقارنة مفيدة.',
      ms_drought_nonorm: 'معدلات المطر غير موجودة في الملف: المقارنة غير ممكنة.',
      ms_rain: 'أمطار متوقعة: {s} مم في 7 أيام (أقصاها {m} مم يوم {d}). أجّل السقي ودع المطر يعمل.',
      ms_rain_heavy: 'أمطار غزيرة متوقعة يوم {d} ({m} مم): تفقّد مصارف الجسور والطوابي، خطر انجراف.',
      ms_heat: 'حرارة شديدة متوقعة: حتى {v} °م يوم {d}. اسقِ صباحاً باكراً أو مساءً وغطِّ التربة.',
      ms_frost: 'خطر صقيع: {v} °م يوم {d}. احمِ الشتلات الصغيرة والقوارص.',
      ms_calm: 'لا حدث بارز متوقع في الأيام السبعة القادمة.',
      tag_crit: 'حرج', tag_warn: 'انتباه', tag_info: 'معلومة', tag_ok: 'جيد',
      ms_src_wx: 'المصدر: Open-Meteo (توقعات وآخر 92 يوماً) · المعدلات: ملف GAIA LAND DNA الخاص بك.',
      ms_water: 'الماء هذا الشهر', ms_water_p: 'الحصة المرجعية هي حاجة الزراعة (FAO-56) لشهر بمناخ متوسط. الماء المستعمل من قراءات عدّادك: لا شيء محاكى.',
      ms_quota: 'الحصة المرجعية', ms_used: 'الماء المستعمل', ms_left: 'المتبقي', ms_over: 'تجاوز',
      ms_quota_missing: 'لا يمكن حساب الحصة: {w}. أكمل صفحة الماء والطاقة.', ms_miss_area: 'المساحة ناقصة', ms_miss_kc: 'المعامل الزراعي ناقص', ms_miss_clim: 'مناخ الملف غير متاح',
      ms_quota_zero: 'هذا الشهر يغطي المطر المتوسط حاجة الزراعة: حصة السقي صفر.',
      ms_need_two: 'أضف قراءة للعداد في بداية الفترة وأخرى في نهايتها لقياس الماء المستعمل هذا الشهر.',
      ms_meter_down: 'القراءة الأخيرة أقل من السابقة: تحقّق من الإدخال (هل تغيّر العداد؟).',
      ms_add: 'إضافة قراءة للعداد', ms_date: 'تاريخ القراءة', ms_index: 'رقم العداد (م³)', ms_save: 'حفظ', ms_del: 'حذف',
      ms_readings: 'قراءاتك', ms_none: 'لا قراءات بعد.', ms_local: 'تبقى القراءات على هذا الجهاز. يمكن لعداد تدفق متصل (جهاز إنترنت الأشياء) ملؤها آلياً.',
      ms_period: 'من {a} إلى {b}',
      ms_tech: 'التقنيات الملائمة لقطعتك', ms_tech_p: 'حسب محرّك التوافق: ممكنة أو ممكنة مع تكييف.', ms_tech_none: 'لا تقنية ممكنة بالبيانات الحالية: انظر التفاصيل في صفحة التوافق.',
      ms_open_engine: 'فتح التوافق ←', ms_open_cal: 'رؤية الرزنامة كاملة ←', ms_open_mott: 'فتح موتايناي ←', ms_open_nexus: 'فتح الماء والطاقة ←'
    }
  });

  G.mountShell('season');
  var tabs = document.getElementById('tabs'), app = document.getElementById('app');
  var p = G.getParcel();

  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] === undefined ? '' : o[k]; }); }
  function L() { return G.lang() === 'ar' ? 'ar' : 'fr'; }
  function today() { var d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function dayLabel(iso) { var m = G.t('months'); return (+iso.slice(8, 10)) + ' ' + m[+iso.slice(5, 7) - 1]; }
  function dim(y, m) { return new Date(y, m + 1, 0).getDate(); }

  /* ------------------------------------------------ weather (live, cached for the session) */
  var WX = null, wxErr = null, wxPending = false;
  function loadWeather(done) {
    if (WX || wxErr) { done(); return; }
    if (wxPending) return;
    wxPending = true;
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + p.lat.toFixed(3) + '&longitude=' + p.lon.toFixed(3) +
      '&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&past_days=92&forecast_days=7&timezone=auto';
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    fetch(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
      clearTimeout(timer); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json();
    }).then(function (j) {
      var d = j.daily;
      WX = d.time.map(function (date, i) { return { date: date, rain: d.precipitation_sum[i], tmax: d.temperature_2m_max[i], tmin: d.temperature_2m_min[i] }; });
    }).catch(function (e) { clearTimeout(timer); wxErr = e.name === 'AbortError' ? 'délai dépassé' : e.message; })
      .then(function () { wxPending = false; done(); });
  }

  function alerts() {
    var out = [], now = today(), cm = p.dna.climateMonthly;
    var past = WX.filter(function (d) { return d.date < now; }).slice(-90);
    var next = WX.filter(function (d) { return d.date >= now; });
    // 1. drought: observed rain over the last 90 days vs the parcel's ERA5 normals for the same days
    if (cm && cm.rain && cm.rain.every(function (v) { return v !== null; })) {
      var obs = 0, norm = 0;
      past.forEach(function (d) {
        var y = +d.date.slice(0, 4), m = +d.date.slice(5, 7) - 1;
        obs += d.rain || 0; norm += cm.rain[m] / dim(y, m);
      });
      var o = { o: fmt(obs, 0), n: fmt(norm, 0), p: norm > 0 ? fmt(100 * obs / norm, 0) : '—' };
      if (norm < 20) out.push(['info', t('ms_drought_dry')]);
      else if (obs / norm < 0.5) out.push(['crit', fill(t('ms_drought_crit'), o)]);
      else if (obs / norm < 0.8) out.push(['warn', fill(t('ms_drought_warn'), o)]);
      else out.push(['ok', fill(t('ms_drought_ok'), o)]);
    } else out.push(['info', t('ms_drought_nonorm')]);
    // 2. rain, heat and frost coming in the next 7 days
    var sum = 0, max = null, hot = null, cold = null, events = 0;
    next.forEach(function (d) {
      sum += d.rain || 0;
      if (d.rain !== null && (!max || d.rain > max.rain)) max = d;
      if (d.tmax !== null && (!hot || d.tmax > hot.tmax)) hot = d;
      if (d.tmin !== null && (!cold || d.tmin < cold.tmin)) cold = d;
    });
    if (max && max.rain >= 20) { out.push(['warn', fill(t('ms_rain_heavy'), { d: dayLabel(max.date), m: fmt(max.rain, 0) })]); events++; }
    if (sum >= 10) { out.push(['info', fill(t('ms_rain'), { s: fmt(sum, 0), m: fmt(max.rain, 0), d: dayLabel(max.date) })]); events++; }
    if (hot && hot.tmax >= 40) { out.push(['warn', fill(t('ms_heat'), { v: fmt(hot.tmax, 0), d: dayLabel(hot.date) })]); events++; }
    if (cold && cold.tmin <= 0) { out.push(['warn', fill(t('ms_frost'), { v: fmt(cold.tmin, 0), d: dayLabel(cold.date) })]); events++; }
    if (!events) out.push(['ok', t('ms_calm')]);
    return out;
  }

  /* ------------------------------------------------ meter readings (farmer input, on device) */
  var KEY = 'gaia.season.meter', pkey = p ? (p.lat.toFixed(4) + ',' + p.lon.toFixed(4)) : '';
  function readings() { var all = G.load(KEY, {}); return (all[pkey] || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }); }
  function storeReadings(list) { var all = G.load(KEY, {}); all[pkey] = list; G.save(KEY, all); }

  function usedThisMonth(list) {
    var now = today(), first = now.slice(0, 8) + '01';
    var before = list.filter(function (r) { return r.date < first; });
    var inMonth = list.filter(function (r) { return r.date >= first && r.date <= now; });
    var start = before.length ? before[before.length - 1] : inMonth[0];
    var end = inMonth.length ? inMonth[inMonth.length - 1] : null;
    if (!start || !end || start === end) return { status: 'need' };
    var v = end.index - start.index;
    if (v < 0) return { status: 'down' };
    return { status: 'ok', m3: v, from: start.date, to: end.date };
  }

  function quotaThisMonth() {
    var dna = p.dna, cm = dna.climateMonthly, m = new Date().getMonth();
    var saved = G.load('gaia.nexus.inputs', null), sv = saved && saved.parcelAt === dna.builtAt ? saved.values : {};
    var crop = D.value(dna, 'crop'), cropDef = N.CROPS[crop] || null;
    var area = parseFloat(sv.area) || D.value(dna, 'area_ha') || null;
    var kc = parseFloat(sv.kc) || (cropDef ? cropDef.kc : null);
    var months = sv.months || (cropDef ? cropDef.months : null);
    var ea = parseFloat(sv.ea) || N.EFFICIENCY.drip;
    var miss = [];
    if (!cm || !cm.et0 || !cm.rain) miss.push(t('ms_miss_clim'));
    if (!(kc > 0)) miss.push(t('ms_miss_kc'));
    if (!(area > 0)) miss.push(t('ms_miss_area'));
    if (miss.length) return { missing: miss };
    var r = N.compute({ et0: cm.et0, rain: cm.rain, kc: kc, months: months, area_ha: area, ea: ea });
    return { m3: r.months[m].vol || 0, on: r.months[m].on };
  }

  /* ------------------------------------------------ render */
  function hero(crop, stages) {
    var sk = S.sekki(new Date()), nx = sk.next, mNames = G.t('months'), mi = new Date().getMonth();
    return el('section', { class: 'ss-hero' }, [
      el('div', null, [
        el('p', { class: 'eyebrow' }, [t('ms_month') + ' · ' + mNames[mi] + ' ' + new Date().getFullYear()]),
        el('h2', null, [(p.name || t('nav_land')) + (crop ? ' · ' + t('crop_' + crop) : '')]),
        el('p', null, [crop ? (stages.length === 0 ? t('ms_actions_0') : stages.length === 1 ? t('ms_actions_1') : fill(t('ms_actions_n'), { n: stages.length })) : t('ms_no_crop')])
      ]),
      el('div', { class: 'ss-sekki' }, [
        el('div', { class: 'eyebrow' }, [t('ms_sekki')]),
        el('div', { class: 'kj', lang: 'ja' }, [sk.kanji]),
        el('div', { class: 'ro' }, [sk.romaji]),
        el('div', { class: 'me' }, [sk[L()]]),
        el('div', { class: 'me', style: 'margin-top:6px' }, [fill(t('ms_sekki_next'), { k: nx[0], r: nx[1], d: nx[3] + ' ' + mNames[nx[2] - 1] })])
      ])
    ]);
  }

  function todo(crop, stages) {
    var sec = el('section', { class: 'ss-sec', 'aria-labelledby': 'h-todo' }, [el('h2', { id: 'h-todo' }, [t('ms_todo')]), el('p', { class: 'lead' }, [t('ms_todo_p')])]);
    if (!crop) { sec.appendChild(G.note('info', t('ms_no_crop'))); return sec; }
    var list = el('ul', { class: 'ss-list' });
    stages.forEach(function (s) {
      var tx = s[L()], src = s.src ? S.source(s.src) : null;
      list.appendChild(el('li', { class: 'ss-item' + (s.w ? ' water' : '') }, [
        el('span', { class: 'ic', 'aria-hidden': 'true' }, [s.w ? '水' : '季']),
        el('div', null, [
          el('h3', null, [tx[0], s.w ? ' ' : null, s.w ? G.pill('adapt', t('ms_water_stage')) : null]),
          el('p', null, [tx[1]]),
          el('p', { class: 'src' }, src ? [t('src') + ' : ', src] : [t('ms_practice')])
        ])
      ]));
      if (s.res && S.MOTT[s.res]) {
        var r = S.MOTT[s.res][L()];
        list.appendChild(el('li', { class: 'ss-item res' }, [
          el('span', { class: 'ic', 'aria-hidden': 'true' }, ['惜']),
          el('div', null, [el('h3', null, [fill(t('ms_res_h'), { r: r.name })]), el('p', null, [t('ms_res_p')]), el('a', { href: 'mottainai.html', class: 'src' }, [t('ms_open_mott')])])
        ]));
      }
    });
    sec.appendChild(list);
    sec.appendChild(el('p', { class: 'small', style: 'margin-top:8px' }, [t('to_validate') + ' ', el('a', { href: 'calendar.html' }, [t('ms_open_cal')])]));
    return sec;
  }

  function alertsSec() {
    var box = el('div');
    var sec = el('section', { class: 'ss-sec', 'aria-labelledby': 'h-al' }, [el('h2', { id: 'h-al' }, [t('ms_alerts')]), el('p', { class: 'lead' }, [t('ms_alerts_p')]), box]);
    function draw() {
      G.clear(box);
      if (wxErr) { box.appendChild(G.note('err', fill(t('ms_wx_err'), { e: wxErr }))); return; }
      if (!WX) { box.appendChild(G.note('info', t('ms_loading'))); return; }
      var cls = { crit: 'critical', warn: 'warning', info: 'info', ok: 'good' };
      box.appendChild(el('ul', { class: 'ss-list', 'aria-live': 'polite' }, alerts().map(function (a) {
        return el('li', { class: 'ss-al ' + cls[a[0]] }, [el('span', { class: 'tag' }, [t('tag_' + a[0])]), el('span', { class: 'txt' }, [a[1]])]);
      })));
      box.appendChild(el('p', { class: 'small muted', style: 'margin-top:8px' }, [t('ms_src_wx')]));
    }
    draw();
    loadWeather(draw);
    return sec;
  }

  function waterSec() {
    var sec = el('section', { class: 'ss-sec', 'aria-labelledby': 'h-wa' }, [el('h2', { id: 'h-wa' }, [t('ms_water')]), el('p', { class: 'lead' }, [t('ms_water_p')])]);
    var card = el('div', { class: 'gp-card', style: 'margin-top:12px' });
    var q = quotaThisMonth(), list = readings(), u = usedThisMonth(list);
    if (q.missing) card.appendChild(G.note('info', fill(t('ms_quota_missing'), { w: q.missing.join(', ') })));
    var kv = el('div', { class: 'ss-kv' });
    kv.appendChild(el('div', null, [el('div', { class: 'lab' }, [t('ms_quota')]), el('div', { class: 'v' }, [q.missing ? '—' : fmt(q.m3, 0) + ' m³'])]));
    kv.appendChild(el('div', null, [el('div', { class: 'lab' }, [t('ms_used')]), el('div', { class: 'v' }, [u.status === 'ok' ? fmt(u.m3, 0) + ' m³' : '—'])]));
    if (!q.missing && u.status === 'ok') {
      var diff = q.m3 - u.m3;
      kv.appendChild(el('div', null, [el('div', { class: 'lab' }, [t(diff >= 0 ? 'ms_left' : 'ms_over')]), el('div', { class: 'v', style: diff < 0 ? 'color:var(--s-no)' : '' }, [fmt(Math.abs(diff), 0) + ' m³'])]));
    }
    card.appendChild(kv);
    if (!q.missing && u.status === 'ok' && q.m3 > 0) {
      var share = u.m3 / q.m3, fillEl = el('span', { class: 'fill' + (share > 1 ? ' over' : share > 0.85 ? ' near' : '') });
      fillEl.style.width = Math.min(100, share * 100) + '%';
      card.appendChild(el('div', { class: 'ss-meter', role: 'img', 'aria-label': fmt(share * 100, 0) + ' %' }, [fillEl]));
      card.appendChild(el('p', { class: 'small muted' }, [fill(t('ms_period'), { a: dayLabel(u.from), b: dayLabel(u.to) })]));
    }
    if (!q.missing && q.m3 === 0) card.appendChild(G.note('ok', t('ms_quota_zero')));
    if (u.status === 'need') card.appendChild(G.note('info', t('ms_need_two')));
    if (u.status === 'down') card.appendChild(G.note('err', t('ms_meter_down')));

    // add a reading
    var dIn = el('input', { id: 'ms-d', type: 'date', value: today(), max: today(), required: true });
    var iIn = el('input', { id: 'ms-i', type: 'number', min: '0', step: 'any', inputmode: 'decimal', required: true });
    var form = el('form', { style: 'margin-top:16px', onsubmit: function (e) {
      e.preventDefault();
      var v = parseFloat(String(iIn.value).replace(',', '.'));
      if (!dIn.value || isNaN(v) || v < 0) return;
      var l = readings().filter(function (r) { return r.date !== dIn.value; }); l.push({ date: dIn.value, index: v });
      storeReadings(l); render();
    } }, [
      el('h3', null, [t('ms_add')]),
      el('div', { class: 'gp-row', style: 'margin-top:8px;align-items:end' }, [
        el('div', { class: 'gp-field' }, [el('label', { for: 'ms-d' }, [t('ms_date')]), dIn]),
        el('div', { class: 'gp-field' }, [el('label', { for: 'ms-i' }, [t('ms_index')]), iIn]),
        el('div', null, [el('button', { type: 'submit', class: 'gp-btn primary' }, [t('ms_save')])])
      ])
    ]);
    card.appendChild(form);
    card.appendChild(el('h3', { style: 'margin-top:16px' }, [t('ms_readings')]));
    if (!list.length) card.appendChild(el('p', { class: 'small muted' }, [t('ms_none')]));
    else card.appendChild(el('div', { class: 'gp-table-wrap' }, [el('table', { class: 'gp-table' }, [el('tbody', null, list.slice().reverse().map(function (r) {
      return el('tr', null, [el('td', null, [dayLabel(r.date) + ' ' + r.date.slice(0, 4)]), el('td', { class: 'num' }, [fmt(r.index, 1) + ' m³']),
        el('td', { class: 'num' }, [el('button', { type: 'button', class: 'gp-btn ghost sm', onclick: function () { storeReadings(readings().filter(function (x) { return x.date !== r.date; })); render(); } }, [t('ms_del')])])]);
    }))])]));
    card.appendChild(el('p', { class: 'small muted', style: 'margin-top:8px' }, [t('ms_local')]));
    card.appendChild(el('a', { href: 'nexus.html', class: 'small', style: 'display:inline-block;margin-top:6px;font-weight:700' }, [t('ms_open_nexus')]));
    sec.appendChild(card);
    return sec;
  }

  function techSec() {
    var sec = el('section', { class: 'ss-sec', 'aria-labelledby': 'h-te' }, [el('h2', { id: 'h-te' }, [t('ms_tech')]), el('p', { class: 'lead' }, [t('ms_tech_p')])]);
    if (!window.GAIA_ENGINE || !window.GAIA_KB) return sec;
    var res = window.GAIA_ENGINE.evaluateAll(p.dna).filter(function (r) { return r.verdict === 'feasible' || r.verdict === 'adapt'; });
    if (!res.length) { sec.appendChild(G.note('info', t('ms_tech_none'))); }
    else sec.appendChild(el('ul', { class: 'ss-list' }, res.slice(0, 5).map(function (r) {
      var name = L() === 'ar' && r.record.name_ar ? r.record.name_ar : r.record.name;
      return el('li', { class: 'ss-item' }, [el('span', { class: 'ic', 'aria-hidden': 'true' }, [r.record.origin === 'jp' ? '日' : r.record.origin === 'tn' ? '地' : '橋']),
        el('div', null, [el('h3', null, [name, ' ', G.pill(r.verdict, t('verdict_' + (r.verdict === 'feasible' ? 'ok' : 'adapt')))])])]);
    })));
    sec.appendChild(el('a', { href: 'engine.html', class: 'small', style: 'display:inline-block;margin-top:8px;font-weight:700' }, [t('ms_open_engine')]));
    return sec;
  }

  function render() {
    G.clear(tabs).appendChild(S.subnav('season'));
    if (!p || !p.dna) { G.needParcel(app); return; }
    var crop = S.parcelCrop(), stages = crop ? S.stagesIn(crop, new Date().getMonth()) : [];
    G.clear(app);
    [hero(crop, stages), todo(crop, stages), alertsSec(), waterSec(), techSec()].forEach(function (n) { app.appendChild(n); });
    app.appendChild(el('div', { style: 'margin-top:22px' }, [G.kaizenButton({ kind: 'season', page: 'season', month: new Date().getMonth() + 1, crop: crop, lat: p.lat, lon: p.lon })]));
  }
  render();
  G.onLang(render);
}());
