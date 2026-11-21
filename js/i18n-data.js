/* ==========================================================================
   GAIA — English and Japanese for data text.

   Land DNA notes, source labels, units and engine wording are produced in
   French by landdna.js, soil-tn.js and engine-core.js (and saved that way in
   the browser). In English and Japanese the pages pass them through GAIA.tr(),
   which looks them up here: exact strings first, then patterns for strings
   built with values. French and Arabic are shown unchanged.
   Load after gaia-core.js.
   ========================================================================== */
(function (global) {
  'use strict';
  var G = global.GAIA;

  /* ---------------------------------------------------------- field labels */
  G.addStrings({
    en: {
      'fld_climate_rain_mm': 'Annual rainfall', 'fld_climate_et0_mm': 'Reference evapotranspiration', 'fld_climate_tmax_hot': 'Max. of the hottest month', 'fld_climate_tmin_cold': 'Min. of the coldest month',
      'fld_terrain_elev_m': 'Elevation', 'fld_terrain_slope_pct': 'Slope', 'fld_terrain_aspect_deg': 'Aspect', 'fld_solar_ghi_kwh': 'Solar radiation',
      'fld_soil_texture': 'Soil texture', 'fld_soil_clay_pct': 'Clay 0–30 cm', 'fld_soil_soc': 'Organic carbon',
      'fld_crop': 'Crop', 'fld_water_source': 'Water source', 'fld_water_well_depth_m': 'Well depth', 'fld_energy_pump': 'Pumping', 'fld_area_ha': 'Area', 'fld_structures': 'Structures',
      u_mm_yr: 'mm/yr', u_kwh_day: 'kWh/m²/day', u_years: 'years', regions: 'Regions',
      v_sandy: 'sandy', v_loamy: 'loamy', v_clayey: 'clayey', v_rainfed: 'rainfed', v_well: 'well', v_network: 'network', v_shared: 'shared source',
      v_olive: 'olive', v_palm: 'date palm', v_citrus: 'citrus', v_cereal: 'cereals', v_veg: 'vegetables', v_other: 'other', v_none: 'none', v_diesel: 'diesel pump', v_grid: 'grid pump', v_solar: 'solar pump'
    },
    ja: {
      'fld_climate_rain_mm': '年間降水量', 'fld_climate_et0_mm': '基準蒸発散量', 'fld_climate_tmax_hot': '最暑月の最高気温', 'fld_climate_tmin_cold': '最寒月の最低気温',
      'fld_terrain_elev_m': '標高', 'fld_terrain_slope_pct': '傾斜', 'fld_terrain_aspect_deg': '斜面の向き', 'fld_solar_ghi_kwh': '日射量',
      'fld_soil_texture': '土性', 'fld_soil_clay_pct': '粘土 0–30 cm', 'fld_soil_soc': '有機炭素',
      'fld_crop': '作物', 'fld_water_source': '水源', 'fld_water_well_depth_m': '井戸の深さ', 'fld_energy_pump': '揚水', 'fld_area_ha': '面積', 'fld_structures': '構造物',
      u_mm_yr: 'mm/年', u_kwh_day: 'kWh/m²/日', u_years: '年', regions: '地域',
      v_sandy: '砂質', v_loamy: 'ローム質', v_clayey: '粘土質', v_rainfed: '天水', v_well: '井戸', v_network: '灌漑網', v_shared: '共同水源',
      v_olive: 'オリーブ', v_palm: 'ナツメヤシ', v_citrus: '柑橘', v_cereal: '穀物', v_veg: '野菜', v_other: 'その他', v_none: 'なし', v_diesel: 'ディーゼルポンプ', v_grid: '系統電力ポンプ', v_solar: '太陽光ポンプ'
    },
    fr: { u_mm_yr: 'mm/an', u_kwh_day: 'kWh/m²/j', u_years: 'ans', regions: 'Régions' },
    ar: { u_mm_yr: 'mm/an', u_kwh_day: 'kWh/m²/j', u_years: 'ans', regions: 'Régions' }
  });

  // coded value (olive, well, sandy…) → word; FR / AR keep the code, as before
  G.valueText = function (v) { var k = 'v_' + v, x = G.t(k); return x === k ? String(v) : x; };

  /* ---------------------------------------------------------- soil zones (js/soil-tn.js) */
  var ZONES = {
    en: {
      'Kroumirie (Aïn Draham), sols forestiers': 'Kroumirie (Ain Draham), forest soils', 'Vallée de la Medjerda (Jendouba, Béja), vertisols': 'Medjerda valley (Jendouba, Beja), vertisols',
      'Plaine de Mateur (Bizerte)': 'Mateur plain (Bizerte)', 'Basse vallée (Tunis, Manouba)': 'Lower valley (Tunis, Manouba)', 'Plaine de Kairouan': 'Kairouan plain',
      'Oueslatia (Kairouan Ouest)': 'Oueslatia (west Kairouan)', 'Hautes steppes (Kasserine)': 'High steppes (Kasserine)', 'Plaine de Sfax': 'Sfax plain',
      'Nefzaoua (Kébili)': 'Nefzaoua (Kebili)', 'Oasis de Gabès': 'Gabes oasis', 'Plaine de la Jeffara (Médenine)': 'Jeffara plain (Medenine)'
    },
    ja: {
      'Kroumirie (Aïn Draham), sols forestiers': 'クルミリー（アイン・ドラハム）、森林土壌', 'Vallée de la Medjerda (Jendouba, Béja), vertisols': 'メジェルダ川流域（ジャンドゥーバ、ベジャ）、バーティソル',
      'Plaine de Mateur (Bizerte)': 'マトゥール平野（ビゼルト）', 'Basse vallée (Tunis, Manouba)': '下流域（チュニス、マヌーバ）', 'Plaine de Kairouan': 'カイルアン平野',
      'Oueslatia (Kairouan Ouest)': 'ウェスラティア（カイルアン西部）', 'Hautes steppes (Kasserine)': '高原ステップ（カスリーヌ）', 'Plaine de Sfax': 'スファックス平野',
      'Nefzaoua (Kébili)': 'ネフザウア（ケビリ）', 'Oasis de Gabès': 'ガベスのオアシス', 'Plaine de la Jeffara (Médenine)': 'ジェファラ平野（メドニン）',
      'Dahar (Tataouine)': 'ダハール（タタウィン）', 'Sahara (Remada, El Borma)': 'サハラ（レマダ、エル・ボルマ）'
    }
  };
  function zone(l, z) { return (ZONES[l] && ZONES[l][z]) || z; }

  function errEN(e) { return e === 'délai dépassé' ? 'timed out' : e === 'réponse vide' ? 'empty response' : e === 'réponse incomplète' ? 'incomplete response' : e === 'paramètre absent' ? 'parameter missing' : e === 'aucune valeur (zone non cartographiée)' ? 'no value (area not mapped)' : e; }
  function errJA(e) { return e === 'délai dépassé' ? 'タイムアウト' : e === 'réponse vide' ? '空の応答' : e === 'réponse incomplète' ? '不完全な応答' : e === 'paramètre absent' ? 'パラメーターなし' : e === 'aucune valeur (zone non cartographiée)' ? '値なし（未地図化の地域）' : e; }

  G.addPhrases({
    en: {
      exact: {
        'mm/an': 'mm/yr', 'kWh/m²/jour': 'kWh/m²/day', 'kWh/m²/j': 'kWh/m²/day',
        'Open-Meteo Historical API (réanalyse ERA5 / ERA5-Land)': 'Open-Meteo Historical API (ERA5 / ERA5-Land reanalysis)',
        'NASA POWER — climatologie, ALLSKY_SFC_SW_DWN': 'NASA POWER — climatology, ALLSKY_SFC_SW_DWN',
        "Déclaré par l'agriculteur": 'Declared by the farmer', "Saisie de l'agriculteur": 'Entered by the farmer', 'Valeur de démonstration': 'Demo value',
        'Référence régionale': 'Regional reference', 'SoilGrids 2.0 (ISRIC), rasters locaux': 'SoilGrids 2.0 (ISRIC), local rasters',
        'Référence régionale GAIA (ordres de grandeur d’après HWSD v2 FAO/IIASA et SoilGrids 2.0)': 'GAIA regional reference (orders of magnitude from HWSD v2 FAO/IIASA and SoilGrids 2.0)',
        'grille globale (≈ 0,5°)': 'global grid (≈ 0.5°)', 'zone agro-écologique': 'agro-ecological zone',
        'ET0 FAO Penman–Monteith calculée par Open-Meteo': 'ET0 FAO Penman–Monteith computed by Open-Meteo',
        'Moyenne des maximales du mois le plus chaud': 'Mean daily maximum of the hottest month', 'Moyenne des minimales du mois le plus froid': 'Mean daily minimum of the coldest month',
        'Terrain presque plat : orientation non significative': 'Almost flat ground: aspect not meaningful', 'Orientation de la pente (0° = nord)': 'Slope aspect (0° = north)',
        'Rayonnement global horizontal, moyenne annuelle': 'Global horizontal irradiance, annual mean',
        'Classe déduite de la teneur en argile et en sable (0–30 cm)': 'Class derived from clay and sand content (0–30 cm)', 'Carbone organique, 0–30 cm': 'Organic carbon, 0–30 cm',
        'Rasters SoilGrids servis localement': 'SoilGrids rasters served locally',
        'Valeur type pré-remplie pour la démo : remplacez-la par la vôtre.': 'Typical value pre-filled for the demo: replace it with your own.',
        'Sans objet : pas de puits déclaré': 'Not applicable: no well declared'
      },
      patterns: [
        [/^Pente moyenne calculée sur ≈ (.+) m à partir de 5 points d’altitude$/, 'Mean slope computed over ≈ $1 m from 5 elevation points'],
        [/^(Open-Meteo|Altitude|NASA POWER) indisponible \((.*)\)$/, function (m) { return (m[1] === 'Altitude' ? 'Elevation' : m[1]) + ' unavailable (' + errEN(m[2]) + ')'; }],
        [/^SoilGrids injoignable \((.*)\) : API REST en pause\.(.*)$/, function (m, tr) { return 'SoilGrids unreachable (' + errEN(m[1]) + '): REST API paused.' + (m[2] ? ' ' + tr(m[2].trim()) : ''); }],
        [/^(.*?) ?Aucune zone de référence à moins de 120 km : faites analyser le sol\.$/, function (m, tr) { return tr(m[1]) + ' No reference zone within 120 km: have the soil analysed.'; }],
        [/^0–30 cm\. (.*)$/, function (m, tr) { return '0–30 cm. ' + tr(m[1]); }],
        [/^Valeur typique de la zone « (.+) » \(≈ (\d+) km\), pas une mesure de la parcelle\. (.*)$/, function (m, tr) { return 'Typical value for the “' + zone('en', m[1]) + '” zone (≈ ' + m[2] + ' km), not a measurement of the plot. ' + tr(m[3]); }],
        [/^(.*) — à saisir dans « Votre exploitation »$/, function (m) {
          var M = { 'Culture non renseignée': 'Crop not entered', "Source d'eau non renseignée": 'Water source not entered', 'Profondeur du puits non renseignée': 'Well depth not entered',
            'Pompage non renseigné': 'Pumping not entered', 'Surface non renseignée': 'Area not entered', 'Ouvrages non renseignés (cochez « Aucun » s’il n’y en a pas)': 'Structures not entered (tick “None” if there are none)', 'Non renseigné': 'Not entered' };
          return (M[m[1]] || m[1]) + ' — enter it under “Your farm”';
        }]
      ]
    },
    ja: {
      exact: {
        'mm/an': 'mm/年', 'kWh/m²/jour': 'kWh/m²/日', 'kWh/m²/j': 'kWh/m²/日',
        'Open-Meteo Historical API (réanalyse ERA5 / ERA5-Land)': 'Open-Meteo Historical API（ERA5／ERA5-Land再解析）',
        'NASA POWER — climatologie, ALLSKY_SFC_SW_DWN': 'NASA POWER — 気候値、ALLSKY_SFC_SW_DWN',
        "Déclaré par l'agriculteur": '農家の申告', "Saisie de l'agriculteur": '農家の入力', 'Valeur de démonstration': 'デモ値',
        'Référence régionale': '地域参照値', 'SoilGrids 2.0 (ISRIC), rasters locaux': 'SoilGrids 2.0（ISRIC）、ローカルラスター',
        'Référence régionale GAIA (ordres de grandeur d’après HWSD v2 FAO/IIASA et SoilGrids 2.0)': 'GAIA地域参照値（HWSD v2 FAO/IIASAとSoilGrids 2.0に基づく概算値）',
        'grille globale (≈ 0,5°)': '全球グリッド（約0.5°）', 'zone agro-écologique': '農業生態ゾーン', '≈ 11–25 km': '約11–25 km',
        'ET0 FAO Penman–Monteith calculée par Open-Meteo': 'Open-Meteoが算出したFAO Penman–MonteithのET0',
        'Moyenne des maximales du mois le plus chaud': '最暑月の日最高気温の平均', 'Moyenne des minimales du mois le plus froid': '最寒月の日最低気温の平均',
        'Terrain presque plat : orientation non significative': 'ほぼ平坦：斜面の向きは意味を持ちません', 'Orientation de la pente (0° = nord)': '斜面の向き（0° = 北）',
        'Rayonnement global horizontal, moyenne annuelle': '水平面全天日射量、年平均',
        'Classe déduite de la teneur en argile et en sable (0–30 cm)': '粘土と砂の含有率から推定した区分（0–30 cm）', 'Carbone organique, 0–30 cm': '有機炭素、0–30 cm',
        'Rasters SoilGrids servis localement': 'ローカル配信のSoilGridsラスター',
        'Valeur type pré-remplie pour la démo : remplacez-la par la vôtre.': 'デモ用に入れた代表値です。ご自身の値に置き換えてください。',
        'Sans objet : pas de puits déclaré': '該当なし：井戸の申告なし'
      },
      patterns: [
        [/^Pente moyenne calculée sur ≈ (.+) m à partir de 5 points d’altitude$/, '標高5点から約$1 mの範囲で算出した平均傾斜'],
        [/^(Open-Meteo|Altitude|NASA POWER) indisponible \((.*)\)$/, function (m) { return (m[1] === 'Altitude' ? '標高データ' : m[1]) + 'を取得できません（' + errJA(m[2]) + '）'; }],
        [/^SoilGrids injoignable \((.*)\) : API REST en pause\.(.*)$/, function (m, tr) { return 'SoilGridsに接続できません（' + errJA(m[1]) + '）：REST APIは停止中です。' + (m[2] ? tr(m[2].trim()) : ''); }],
        [/^(.*?) ?Aucune zone de référence à moins de 120 km : faites analyser le sol\.$/, function (m, tr) { return tr(m[1]) + ' 120 km以内に参照ゾーンがありません。土壌分析を行ってください。'; }],
        [/^0–30 cm\. (.*)$/, function (m, tr) { return '0–30 cm。' + tr(m[1]); }],
        [/^Valeur typique de la zone « (.+) » \(≈ (\d+) km\), pas une mesure de la parcelle\. (.*)$/, function (m, tr) { return '「' + zone('ja', m[1]) + '」ゾーンの代表値（約' + m[2] + ' km）で、区画の実測値ではありません。' + tr(m[3]); }],
        [/^(.*) — à saisir dans « Votre exploitation »$/, function (m) {
          var M = { 'Culture non renseignée': '作物が未入力', "Source d'eau non renseignée": '水源が未入力', 'Profondeur du puits non renseignée': '井戸の深さが未入力',
            'Pompage non renseigné': '揚水方法が未入力', 'Surface non renseignée': '面積が未入力', 'Ouvrages non renseignés (cochez « Aucun » s’il n’y en a pas)': '構造物が未入力（ない場合は「なし」を選択）', 'Non renseigné': '未入力' };
          return (M[m[1]] || m[1]) + ' — 「あなたの農場」で入力してください';
        }]
      ]
    }
  });
}(window));
