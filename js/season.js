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
      ms_loading: 'Lecture des prévisions…', ms_timeout: 'délai dépassé', ms_wx_err: 'Prévisions indisponibles ({e}). Aucune alerte n’est calculée : GAIA ne devine pas la météo.',
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
      ms_loading: 'قراءة التوقعات…', ms_timeout: 'انتهت المهلة', ms_wx_err: 'التوقعات غير متاحة ({e}). لا يُحسب أي تنبيه: غايا لا تخمّن الطقس.',
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
    },
    en: {
      ms_title: 'My season', ms_lead: "This month on your parcel: what to do, what is coming, and the water used against the crop's need. Only real data, or data you entered.",
      ms_month: 'My season', ms_actions_n: '{n} stages under way for your crop this month.', ms_actions_1: 'One stage under way for your crop this month.', ms_actions_0: 'No major stage this month: a good time to observe and maintain.', ms_no_crop_h: 'Crop not covered by the calendar',
      ms_no_crop: 'The calendar covers olive, date palm, citrus and cereals. Declare your crop in Land Intelligence to see this month’s actions.',
      ms_sekki: 'Japanese season', ms_sekki_next: 'Next: {k} {r}, around {d}',
      ms_todo: 'To do this month', ms_todo_p: 'Stages of the crop calendar under way this month, for your crop.',
      ms_practice: 'Common practice, to check with an extension officer.', ms_water_stage: 'Stage sensitive to water shortage',
      ms_res_h: 'This month’s residue: {r}', ms_res_p: 'Don’t burn it: see its uses in Mottainai.',
      ms_alerts: 'Alerts', ms_alerts_p: 'Computed from Open-Meteo forecasts for your parcel and the normals in your profile (ERA5). Thresholds set by GAIA, to adjust with an extension officer.',
      ms_loading: 'Reading the forecasts…', ms_wx_err: 'Forecasts unavailable ({e}). No alert is computed: GAIA does not guess the weather.', ms_timeout: 'timed out',
      ms_drought_crit: 'Marked drought: {o} mm of rain over 90 days, against {n} mm on average ({p} %). Plan your water and put the sensitive stages first.',
      ms_drought_warn: 'Rain below normal: {o} mm over 90 days, against {n} mm on average ({p} %).',
      ms_drought_ok: 'Rain over the last 90 days in line with normal: {o} mm against {n} mm on average ({p} %).',
      ms_drought_dry: 'Normally dry period (under 20 mm expected in 90 days): no useful comparison.',
      ms_drought_nonorm: 'Rain normals missing from the profile: no comparison possible.',
      ms_rain: 'Rain forecast: {s} mm over 7 days (up to {m} mm on {d}). Hold off irrigating and let the rain do the work.',
      ms_rain_heavy: 'Heavy rain forecast on {d} ({m} mm): check the spillways of the jessour and tabias, erosion risk.',
      ms_heat: 'Strong heat forecast: up to {v} °C on {d}. Water early in the morning or in the evening, and mulch the soil.',
      ms_frost: 'Frost risk: {v} °C on {d}. Protect young plants and citrus.',
      ms_calm: 'No notable event forecast in the next 7 days.',
      tag_crit: 'Critical', tag_warn: 'Warning', tag_info: 'Info', tag_ok: 'Good',
      ms_src_wx: 'Source: Open-Meteo (forecasts and last 92 days) · normals: your GAIA LAND DNA profile.',
      ms_water: 'Water this month', ms_water_p: 'The reference quota is the crop’s need (FAO-56) for one month of average climate. Water used comes from your meter readings: nothing is simulated.',
      ms_quota: 'Reference quota', ms_used: 'Water used', ms_left: 'Left', ms_over: 'Over quota',
      ms_quota_missing: 'Quota cannot be computed: {w}. Complete the Water & energy page.', ms_miss_area: 'area missing', ms_miss_kc: 'crop coefficient missing', ms_miss_clim: 'profile climate unavailable',
      ms_quota_zero: 'This month, average rain covers the crop’s need: irrigation quota is zero.',
      ms_need_two: 'Add one meter reading at the start and another at the end of the period to measure the water used this month.',
      ms_meter_down: 'The latest reading is lower than the previous one: check the entry (was the meter replaced?).',
      ms_add: 'Add a meter reading', ms_date: 'Reading date', ms_index: 'Meter index (m³)', ms_save: 'Save', ms_del: 'Delete',
      ms_readings: 'Your readings', ms_none: 'No readings yet.', ms_local: 'Readings stay on this device. A connected flow meter (IoT box) could fill them in automatically.',
      ms_period: 'from {a} to {b}',
      ms_tech: 'Techniques that suit your parcel', ms_tech_p: 'According to the compatibility engine: feasible, or feasible with adaptation.', ms_tech_none: 'No feasible technique with the current data: see the details in Compatibility.',
      ms_open_engine: 'Open Compatibility →', ms_open_cal: 'See the full calendar →', ms_open_mott: 'Open Mottainai →', ms_open_nexus: 'Open Water & energy →'
    },
    ja: {
      ms_title: 'わたしの季節', ms_lead: '今月のあなたの区画：やるべきこと、これから来るもの、作物の必要量に対する使用水量。実データか、あなたが入力したデータだけを使います。',
      ms_month: 'わたしの季節', ms_actions_n: '今月、あなたの作物で進行中の段階は{n}つです。', ms_actions_1: '今月、あなたの作物で進行中の段階は1つです。', ms_actions_0: '今月は大きな段階はありません。観察と手入れによい時期です。', ms_no_crop_h: 'この作物は暦の対象外です',
      ms_no_crop: '暦はオリーブ、ナツメヤシ、柑橘、穀物に対応しています。土地インテリジェンスで作物を登録すると、今月の作業が表示されます。',
      ms_sekki: '日本の季節', ms_sekki_next: '次は {k}（{r}）、{d}ごろ',
      ms_todo: '今月やること', ms_todo_p: 'あなたの作物について、今月進行中の作物暦の段階です。',
      ms_practice: '一般的な方法です。普及員に確認してください。', ms_water_stage: '水不足に弱い段階',
      ms_res_h: '今月の残さ：{r}', ms_res_p: '燃やさないでください。使い道は「もったいない」で確認できます。',
      ms_alerts: 'アラート', ms_alerts_p: 'あなたの区画のOpen-Meteo予報と、プロファイルの平年値（ERA5）から計算しています。しきい値はGAIAが設定したもので、普及員と調整してください。',
      ms_loading: '予報を読み込み中…', ms_wx_err: '予報を取得できません（{e}）。アラートは計算しません。GAIAは天気を推測しません。', ms_timeout: 'タイムアウト',
      ms_drought_crit: '顕著な干ばつ：90日間の雨量は{o} mm、平年は{n} mm（{p} %）。水の計画を立て、弱い段階を優先してください。',
      ms_drought_warn: '雨が平年より少ない：90日間で{o} mm、平年は{n} mm（{p} %）。',
      ms_drought_ok: '直近90日間の雨は平年並み：{o} mm、平年は{n} mm（{p} %）。',
      ms_drought_dry: '通常は乾いた時期です（90日間の予想が20 mm未満）。比較しても意味がありません。',
      ms_drought_nonorm: 'プロファイルに雨の平年値がないため、比較できません。',
      ms_rain: '雨の予報：7日間で{s} mm（最大は{d}の{m} mm）。灌水を延期し、雨に任せましょう。',
      ms_rain_heavy: '{d}に大雨の予報（{m} mm）：ジェスールとタビアの余水吐を点検してください。侵食のおそれがあります。',
      ms_heat: '強い暑さの予報：{d}に最高{v} °C。早朝か夕方に水やりをし、土をマルチで覆ってください。',
      ms_frost: '霜のおそれ：{d}に{v} °C。若い苗と柑橘を守ってください。',
      ms_calm: '今後7日間に目立った現象の予報はありません。',
      tag_crit: '重大', tag_warn: '注意', tag_info: '情報', tag_ok: '良好',
      ms_src_wx: '出典：Open-Meteo（予報と直近92日）・平年値：あなたのGAIA LAND DNAプロファイル。',
      ms_water: '今月の水', ms_water_p: '基準の割当量は、平均的な気候の1か月における作物の必要水量（FAO-56）です。使用水量はあなたのメーター記録から計算し、何もシミュレーションしません。',
      ms_quota: '基準の割当量', ms_used: '使用水量', ms_left: '残り', ms_over: '超過',
      ms_quota_missing: '割当量を計算できません：{w}。「水とエネルギー」ページを入力してください。', ms_miss_area: '面積がない', ms_miss_kc: '作物係数がない', ms_miss_clim: 'プロファイルの気候が取得できない',
      ms_quota_zero: '今月は平均的な雨で作物の必要量がまかなえます。灌漑の割当量はゼロです。',
      ms_need_two: '今月の使用水量を測るには、期間の始めと終わりにメーターの記録を1つずつ追加してください。',
      ms_meter_down: '最新の記録が前回より小さくなっています。入力を確認してください（メーターを交換しましたか？）。',
      ms_add: 'メーターの記録を追加', ms_date: '記録した日', ms_index: 'メーターの指示値（m³）', ms_save: '保存', ms_del: '削除',
      ms_readings: 'あなたの記録', ms_none: 'まだ記録はありません。', ms_local: '記録はこの端末に保存されます。接続型の流量計（IoT機器）があれば自動で入力できます。',
      ms_period: '{a}から{b}まで',
      ms_tech: 'あなたの区画に合う技術', ms_tech_p: '適合性エンジンによる判定：実施可能、または調整すれば実施可能。', ms_tech_none: '現在のデータで実施可能な技術はありません。詳しくは「適合性」で確認してください。',
      ms_open_engine: '適合性を開く →', ms_open_cal: '暦をすべて見る →', ms_open_mott: 'もったいないを開く →', ms_open_nexus: '水とエネルギーを開く →'
    }
  });

  G.mountShell('season');
  var tabs = document.getElementById('tabs'), app = document.getElementById('app');
  var p = G.getParcel();

  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return o[k] === undefined ? '' : o[k]; }); }
  function L() { return S.lang(); }
  function today() { var d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function dayLabel(iso) { return S.dayMonth(+iso.slice(8, 10), +iso.slice(5, 7) - 1); }
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
    }).catch(function (e) { clearTimeout(timer); wxErr = e.name === 'AbortError' ? 'timeout' : e.message; })
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
        el('p', { class: 'eyebrow' }, [t('ms_month') + ' · ' + (L() === 'ja' ? new Date().getFullYear() + '年' + mNames[mi] : mNames[mi] + ' ' + new Date().getFullYear())]),
        el('h2', null, [(p.name || t('nav_land')) + (crop ? ' · ' + t('crop_' + crop) : '')]),
        el('p', null, [crop ? (stages.length === 0 ? t('ms_actions_0') : stages.length === 1 ? t('ms_actions_1') : fill(t('ms_actions_n'), { n: stages.length })) : t('ms_no_crop')])
      ]),
      el('div', { class: 'ss-sekki' }, [
        el('div', { class: 'eyebrow' }, [t('ms_sekki')]),
        el('div', { class: 'kj', lang: 'ja' }, [sk.kanji]),
        el('div', { class: 'ro' }, [sk.romaji]),
        el('div', { class: 'me' }, [sk[L()]]),
        el('div', { class: 'me', style: 'margin-top:6px' }, [fill(t('ms_sekki_next'), { k: nx[0], r: nx[1], d: S.dayMonth(nx[3], nx[2] - 1) })])
      ])
    ]);
  }

  function todo(crop, stages) {
    var sec = el('section', { class: 'ss-sec', 'aria-labelledby': 'h-todo' }, [el('h2', { id: 'h-todo' }, [t('ms_todo')]), el('p', { class: 'lead' }, [t('ms_todo_p')])]);
    if (!crop) { sec.appendChild(G.note('info', t('ms_no_crop'))); return sec; }
    var list = el('ul', { class: 'ss-list' });
    stages.forEach(function (s) {
      var tx = S.loc(s), src = s.src ? S.source(s.src) : null;
      list.appendChild(el('li', { class: 'ss-item' + (s.w ? ' water' : '') }, [
        el('span', { class: 'ic', 'aria-hidden': 'true' }, [s.w ? '水' : '季']),
        el('div', null, [
          el('h3', null, [tx[0], s.w ? ' ' : null, s.w ? G.pill('adapt', t('ms_water_stage')) : null]),
          el('p', null, [tx[1]]),
          el('p', { class: 'src' }, src ? [t('src') + S.colon(), src] : [t('ms_practice')])
        ])
      ]));
      if (s.res && S.MOTT[s.res]) {
        var r = S.loc(S.MOTT[s.res]);
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
      if (wxErr) { box.appendChild(G.note('err', fill(t('ms_wx_err'), { e: wxErr === 'timeout' ? t('ms_timeout') : wxErr }))); return; }
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
      return el('tr', null, [el('td', null, [L() === 'ja' ? r.date.slice(0, 4) + '年' + dayLabel(r.date) : dayLabel(r.date) + ' ' + r.date.slice(0, 4)]), el('td', { class: 'num' }, [fmt(r.index, 1) + ' m³']),
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
