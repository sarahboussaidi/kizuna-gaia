/* ==========================================================================
   GAIA AI Lab — retrieval over the knowledge records and the parcel profile.

   No model, no network: questions in French, Arabic, English or Japanese are
   normalised (accents, Arabic letter forms, light stemming), matched against
   a multilingual topic lexicon and scored against every record's text
   (exact, prefix and one-typo fuzzy matches). The Lab turns the result into
   an answer built only from records and Land DNA values.
   ========================================================================== */
(function (global) {
  'use strict';

  function norm(s) {
    return String(s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')          // latin accents
      .replace(/[ً-ٰٟـ]/g, '')                 // Arabic diacritics, tatweel
      .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
      .replace(/[’'`]/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  var STOP = {};
  ('le la les un une des de du d l et ou a au aux en dans sur pour par avec sans ce cette ces est sont etre il elle on je tu nous vous ils elles mon ma mes ton ta tes son sa ses notre votre leur quel quelle quels quelles que qui quoi est ce y ne pas plus moins tres peut peux puis faut il si se s qu c j m n t ' +
   'the a an of to in on for with is are be can do does what which how my this that it and or at as by from me i we you your our any there ' +
   'في من على الى عن ما ماذا هل هذه هذا التي الذي و او مع ان لا كيف ' +
   'parcelle terrain ici gaia parcel plot here قطعه ارض هنا').split(' ').forEach(function (w) { if (w) STOP[w] = 1; });

  function stem(w) {
    if (/^[؀-ۿ]+$/.test(w)) {
      if (w.length > 4 && /^(وال|بال|فال|كال|لل)/.test(w)) w = w.slice(3);
      else if (w.length > 3 && w.indexOf('ال') === 0) w = w.slice(2);
      if (w.length > 5 && /ات$/.test(w)) w = w.slice(0, -2);
      return w;
    }
    if (w.length > 4) w = w.replace(/(ements|ement|ations|ation|ages|age|ments|ment|euses|euse|eurs|eur|ing|ies|es|s|e)$/, '');
    return w;
  }
  function tokens(s) {
    return norm(s).split(' ').filter(function (w) { return w && !STOP[w] && (w.length > 1 || /\d/.test(w)); });
  }

  // one-typo tolerance for words of 5+ letters
  function near(a, b) {
    if (a === b) return true;
    if (a.length < 6 || b.length < 6 || Math.abs(a.length - b.length) > 1) return false;
    var i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }

  /* ---------------------------------------------------------- topics (FR / AR / EN) */
  var TOPICS = {
    cost: 'cout couts prix cher chere budget tnd dinar dinars investissement rentable rentabilite financer cost price expensive cheap afford تكلفه كلفه سعر ثمن تمويل ميزانيه',
    risk: 'risque risques danger inconvenient inconvenients probleme problemes limite limites echec risk risks drawback downside problem مخاطر خطر عيوب مشاكل سلبيات',
    materials: 'materiau materiaux materiel pierre pierres outil outils beton terre material materials tools stone مواد حجاره ادوات',
    actors: 'acteur acteurs aider aident aidez crda gda partenaire partenaires aide aides subvention subventions cooperative groupement voisin voisins who actor partner subsidy support cooperative دعم شريك منحه تعاونيه مجمع',
    regulation: 'loi lois reglement reglementation autorisation autorisations permis legal legalement droit droits regulation permit law legal قانون ترخيص رخصه تنظيم',
    actions: 'comment etape etapes faire commencer installer construire mettre planter entretenir entretien how steps build start install maintain كيف خطوات ابدا بناء تركيب صيانه',
    soil: 'sol sols argile argileux sable sableux limon limoneux texture carbone matiere organique fertilite soil clay sand loam carbon organic تربه طين رمل كربون خصوبه',
    rain: 'pluie pluies precipitation precipitations pluviometrie secheresse aride rain rainfall drought arid مطر امطار جفاف تساقطات',
    heat: 'temperature temperatures chaleur chaud froid gel canicule heat hot cold frost حراره برد صقيع',
    et0: 'evapotranspiration evaporation et0 etp demande climatique evaporative تبخر',
    slope: 'pente pentes relief altitude elevation colline montagne plat inclinaison slope steep flat hill elevation انحدار ارتفاع جبل منحدر',
    solar: 'soleil solaire rayonnement ensoleillement irradiation panneau panneaux photovoltaique pv sun solar radiation panel panels شمس شمسي اشعاع الواح',
    energy: 'energie electricite kwh diesel gasoil steg reseau electrique energy electricity grid fuel طاقه كهرباء ديزل',
    pump: 'pompe pompes pompage puits forage nappe nappes aquifere surpompage pump pumping well borehole groundwater aquifer مضخه بئر ضخ ابار مائده جوفيه',
    water: 'eau eaux irrigation irriguer arroser arrosage besoin quota water irrigate watering ماء مياه ري سقي',
    crop: 'culture cultures olivier oliviers olive palmier palmiers datte dattes dattier agrume agrumes cereale cereales ble orge legume legumes maraichage figuier arbre arbres crop crops tree trees wheat dates vegetables زيتون نخيل تمر قوارص حبوب خضر اشجار زراعه',
    area: 'surface superficie hectare hectares taille area size hectare مساحه هكتار',
    sources: 'source sources reference references preuve preuves fiable etude etudes wocat fao evidence study مصدر مصادر مرجع دليل',
    confidence: 'confiance certain sur fiabilite incertitude confidence sure reliable ثقه',
    shade: 'ombre ombrage abri shade shading ظل',
    erosion: 'erosion ruissellement crue crues sediment sediments inondation runoff flood انجراف سيول فيضان'
  };
  // Japanese is not split by spaces: topics are found by keyword inclusion instead.
  var JA_TOPICS = {
    cost: 'コスト 費用 価格 値段 いくら 予算 投資 採算', risk: 'リスク 危険 欠点 問題 デメリット', materials: '資材 材料 道具',
    actors: '支援 協力 パートナー 関係者 補助 組合', regulation: '規制 法律 許可', actions: 'どうやって 手順 方法 始め方 作り方 設置 維持',
    soil: '土壌 粘土 砂質 有機 肥沃', rain: '雨 降水 干ばつ 乾燥', heat: '気温 暑さ 寒さ 霜 高温', et0: '蒸発', slope: '傾斜 斜面 標高 平坦',
    solar: '日射 太陽 日照 パネル', energy: 'エネルギー 電気 電力 ディーゼル 軽油', pump: 'ポンプ 揚水 井戸 地下水 帯水層',
    water: '灌漑 水やり 割当', crop: '作物 オリーブ ナツメヤシ 柑橘 穀物 野菜 小麦 果樹', area: '面積 広さ ヘクタール',
    sources: '出典 根拠 文献 情報源', confidence: '信頼 確か', shade: '日陰', erosion: '侵食 流出 洪水 土砂'
  };
  var CJK = /[\u3040-\u30ff\u4e00-\u9fff]/;
  var TOPIC_STEMS = {};
  Object.keys(TOPICS).forEach(function (k) { TOPIC_STEMS[k] = TOPICS[k].split(' ').map(function (w) { return stem(norm(w)); }); });

  // which Land DNA fields answer a topic about the parcel
  var TOPIC_FIELDS = {
    soil: ['soil.texture', 'soil.clay_pct', 'soil.soc'], rain: ['climate.rain_mm'], heat: ['climate.tmax_hot', 'climate.tmin_cold'],
    et0: ['climate.et0_mm', 'climate.rain_mm'], slope: ['terrain.slope_pct', 'terrain.elev_m', 'terrain.aspect_deg'],
    solar: ['solar.ghi_kwh'], energy: ['energy.pump', 'solar.ghi_kwh'], pump: ['water.source', 'water.well_depth_m', 'energy.pump'],
    water: ['water.source', 'climate.rain_mm', 'climate.et0_mm'], crop: ['crop'], area: ['area_ha'], erosion: ['terrain.slope_pct', 'climate.rain_mm']
  };
  // which record families a topic points to
  var TOPIC_FAMILIES = { soil: ['soil'], erosion: ['soil', 'water'], rain: ['water'], water: ['water'], et0: ['water'], pump: ['water', 'energy'], solar: ['energy'], energy: ['energy'], shade: ['energy', 'agriculture'], crop: ['agriculture'] };
  var FACETS = ['cost', 'risk', 'materials', 'actors', 'regulation', 'actions', 'sources'];

  /* ---------------------------------------------------------- record index */
  var INDEX = null;
  function indexOf(records) {
    if (INDEX && INDEX.records === records) return INDEX;
    INDEX = { records: records, docs: records.map(function (r) {
      var bag = {};
      var add = function (text, w) { tokens(text).forEach(function (tk) { var s = stem(tk); bag[s] = Math.max(bag[s] || 0, w); }); };
      // index the French reference text (js/kb.js) and, when loaded, the English translation (js/kb-i18n.js):
      // the interface may have swapped the readable fields to another language
      var S = r._fr || r, En = r._en || {};
      var adapt = r._fr ? r._fr.adapt : (r.adaptations || []).map(function (a) { return a.text; });
      add(S.name + ' ' + (En.name || '') + ' ' + (r.name_ar || '') + ' ' + (r.jp || '') + ' ' + r.id.replace(/^(tn|jp|x)-/, '').replace(/-/g, ' '), 4);
      add(S.summary + ' ' + (En.summary || ''), 2);
      add([S.description, S.materials, S.cost, S.actors, S.regulation, S.risks, En.description, En.materials, En.cost, En.actors, En.regulation, En.risks].concat(S.actions || []).concat(En.actions || []).concat(adapt).filter(Boolean).join(' '), 1);
      (r.families || []).forEach(function (f) { bag['fam:' + f] = 1; });
      return { id: r.id, bag: bag };
    }) };
    return INDEX;
  }

  function analyse(question, records) {
    var qt = tokens(question), qs = qt.map(stem);
    var topics = {};
    qs.forEach(function (s, i) {
      Object.keys(TOPIC_STEMS).forEach(function (k) {
        if (TOPIC_STEMS[k].some(function (t) { return t === s || near(t, s) || (s.length >= 5 && t.length >= 5 && (t.indexOf(s) === 0 || s.indexOf(t) === 0)); })) topics[k] = (topics[k] || 0) + 1;
      });
      if (qt[i] === 'et0') topics.et0 = 1;
    });
    if (CJK.test(question)) Object.keys(JA_TOPICS).forEach(function (k) {
      if (JA_TOPICS[k].split(' ').some(function (w) { return question.indexOf(w) !== -1; })) topics[k] = (topics[k] || 0) + 1;
    });
    var idx = indexOf(records);
    var hits = idx.docs.map(function (d) {
      var score = 0, matched = [];
      qs.forEach(function (s) {
        var best = 0;
        if (d.bag[s]) best = d.bag[s];
        else Object.keys(d.bag).forEach(function (k) {
          if (k.indexOf('fam:') === 0) return;
          if ((s.length >= 5 && k.indexOf(s) === 0) || near(k, s)) best = Math.max(best, d.bag[k] * 0.7);
        });
        if (best) { score += best; matched.push(s); }
      });
      Object.keys(topics).forEach(function (k) { (TOPIC_FAMILIES[k] || []).forEach(function (f) { if (d.bag['fam:' + f]) score += 0.5; }); });
      return { id: d.id, score: score, matched: matched, named: score >= 2.5 && matched.some(function (s) { return d.bag[s] === 4 || Object.keys(d.bag).some(function (k) { return d.bag[k] === 4 && near(k, s); }); }) };
    }).filter(function (h) { return h.score > 0; }).sort(function (a, b) { return b.score - a.score; });
    var keys = Object.keys(topics);
    return {
      tokens: qs, topics: keys,
      facets: keys.filter(function (k) { return FACETS.indexOf(k) !== -1; }),
      parcelTopics: keys.filter(function (k) { return TOPIC_FIELDS[k]; }),
      fields: keys.reduce(function (acc, k) { (TOPIC_FIELDS[k] || []).forEach(function (f) { if (acc.indexOf(f) === -1) acc.push(f); }); return acc; }, []),
      families: keys.reduce(function (acc, k) { (TOPIC_FAMILIES[k] || []).forEach(function (f) { if (acc.indexOf(f) === -1) acc.push(f); }); return acc; }, []),
      hits: hits,
      named: hits.filter(function (h) { return h.named; }).map(function (h) { return h.id; })
    };
  }

  function lang(q) {
    if (/[؀-ۿ]/.test(q)) return 'ar';
    if (CJK.test(q)) return 'ja';
    var t = ' ' + norm(q) + ' ';
    var en = (t.match(/ (the|what|which|how|why|is|are|can|my|should|does|water|soil|cost|best) /g) || []).length;
    var fr = (t.match(/ (le|la|les|quel|quelle|quels|comment|pourquoi|est|mon|ma|mes|des|du|eau|sol|cout) /g) || []).length;
    return en > fr ? 'en' : 'fr';
  }

  global.GAIA_RETRIEVAL = { norm: norm, tokens: tokens, stem: stem, near: near, analyse: analyse, lang: lang, TOPIC_FIELDS: TOPIC_FIELDS, FACETS: FACETS };
}(typeof window !== 'undefined' ? window : this));
