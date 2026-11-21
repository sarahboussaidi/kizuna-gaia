/* ==========================================================================
   GAIA KNOWLEDGE CORE — English and Japanese text of the records.

   js/kb.js stays the reference (French). This file holds a translation of the
   readable fields of each record. When the interface is in English or
   Japanese, the fields of GAIA_KB.records are swapped in place, so the
   engine, the AI Lab and the library read them without change; in French and
   Arabic the French text is put back (Arabic keeps the French details, as
   before). Conditions, thresholds and sources are never translated: only the
   words around them. `why` follows the order of `conditions`, `adapt` the
   order of `adaptations`.
   Load after gaia-core.js and kb.js.
   ========================================================================== */
(function (global) {
  'use strict';
  var KB = global.GAIA_KB, G = global.GAIA;
  if (!KB) return;

  var T = {
    en: {
      'tn-jessour': {
        name: 'Jessour',
        summary: 'Earth dams (tabia) across a mountain wadi: they hold back runoff and sediment, which build up a cultivable terrace (olives, figs, cereals).',
        description: 'Each unit (jessr) has a catchment that collects runoff, a terrace that forms as sediment settles (up to 5 m deep near the dam) and a dam 15 to 50 m long and 2 to 5 m high, with a spillway to the unit downstream. Traditional system of the south-east (Medenine, Matmata).',
        why: ['Arid zone, annual rainfall below 250 mm in the WOCAT record.', 'Medium to steep mountain slopes (WOCAT record); the 5 % figure is still to be validated.', 'Designed for rainfed farming: the water comes from runoff.'],
        materials: 'Earth; dry stone to stabilise older dams.',
        cost: 'Set-up: 3,000 TND/ha; upkeep: 900 TND/ha/year (WOCAT record; exchange rate in the record 1 USD = 1.3 TND, so these are old figures).',
        actors: 'Farmers and families; the CRDA when a public programme co-finances (farmer’s share 10 to 50 % according to the record).',
        regulation: 'To validate: works on a wadi and rights to the runoff downstream.',
        risks: 'Less water for users downstream; know-how threatened by rural exodus; copes badly with large floods.',
        actions: ['Inspect the dam and the spillway before the rainy season.', 'Top up the terrace with sediment and repair breaches.', 'Plant or replant olive trees on the deepest part of the terrace.']
      },
      'tn-tabia': {
        name: 'Tabia',
        summary: 'A variant of jessour for gentle ground: an earth dam with two side banks and a spillway, fed by a catchment.',
        description: 'Dams 50 to 150 m long and 1 to 2 m high; cultivated area to catchment ratio of 1:4 in the record (1:6 to 1:20 in general). Built where the slope does not exceed about 3 % (3–5 % class in the record). Documented in north Medenine.',
        why: ['Arid zone, annual rainfall below 250 mm (WOCAT record).', 'Gentle slope: no more than about 3 %, 3–5 % class in the WOCAT record.', 'Runoff harvesting for a rainfed crop.'],
        materials: 'Earth (dam), stone and concrete (spillway), gabions (diversion dam).',
        cost: 'Set-up: 670 TND/ha; upkeep: 200 TND/ha/year (WOCAT record, 1 USD = 1.3 TND).',
        actors: 'Farmers; public programmes with a 10 to 50 % share for the farmer.',
        regulation: 'To validate.',
        risks: 'Can spread at the expense of rangeland; copes badly with long droughts and floods; depends on upkeep.',
        adapt: ['Slope steeper than 5 %: prefer jessour (dams across the wadi) rather than a tabia.'],
        actions: ['Check that the slope stays gentle along the whole planned length.', 'Size the catchment (about 4 times the cultivated area according to the record).', 'Build the stone spillway before the first rainy season.']
      },
      'tn-meskat': {
        name: 'Meskat',
        summary: 'A Sahel system: a prepared catchment upslope sends runoff to a planted plot (often olives) downslope.',
        description: 'Traditional system more than 50 years old in the semi-arid zone. The WOCAT record classes it as water harvesting combined with vegetation cover measures, used in concave positions.',
        why: ['Semi-arid zone (WOCAT record); the record gives no rainfall figure: bounds to validate.', 'A slope is needed for the catchment to run off towards the plot; threshold to validate.', 'Rainfed or mixed supply according to the record.'],
        materials: 'Earth for the banks; the catchment is kept bare and compacted.',
        cost: 'Set-up: 1,400 local currency units (≈ 560 USD at the record’s rate, 1 USD = 2.5); area units not given in the record.',
        actors: 'Farmers; mostly adopted without material incentives according to the record.',
        regulation: 'To validate.',
        risks: 'The record lists no drawback; to complete with an agronomist.',
        actions: ['Mark out the catchment upslope and remove vegetation that slows runoff.', 'Raise the banks around the planted plot.', 'Point the water inlet towards the youngest trees.']
      },
      'tn-dry-stone-basins': {
        name: 'Dry-stone basins around olive trees',
        summary: 'A half-moon dry-stone wall built upslope of each olive tree to hold runoff and let it soak in slowly.',
        description: 'Documented in Oueslatia (Kairouan). Large stones at the base in a shallow trench, crushed stones of 1–2 cm as a filter. Mean rainfall 350 mm (200–400 mm) in the record; maximum slope 35°.',
        why: ['Rainfall of 200 to 400 mm in the WOCAT record.', 'Maximum slope of 35° (≈ 70 %) in the WOCAT record.', 'Used mainly for olive trees.'],
        materials: 'Local stones, crushed stone; sledgehammer, pick, shovel.',
        cost: 'Set-up: 171 TND per basin, tools included (WOCAT record, 3.1 TND/USD).',
        actors: 'Smallholders; possible support from the General Directorate for the Development and Conservation of Agricultural Land.',
        regulation: 'None known on one’s own plot — to validate.',
        risks: 'Labour-intensive and costly to build (main obstacle according to the record).',
        actions: ['Start with the trees in the areas with the strongest runoff.', 'Build the wall on the upslope side of each trunk.', 'Reshape after each ploughing and weed the basin.']
      },
      'tn-oasis': {
        name: 'Three-storey oasis',
        summary: 'Date palms on the top storey, fruit trees in the middle, low crops on the ground: shade from above protects the storeys below.',
        description: 'System of the oases of the Djerid and Gabes. It depends on regular irrigation.',
        why: ['The oasis is an irrigated system.', 'Shade matters most in a hot climate; threshold to validate.', 'Typical crops of the storeys.', 'Oases are irrigated by gravity on flat ground (FAO GIAHS record); the figure is still to be validated.'],
        materials: 'Palm offshoots, fruit seedlings (pomegranate, fig, citrus), vegetable seeds; the existing seguia channels.',
        cost: 'Not costed in the current sources: the cost depends mostly on access to water. Ask the CRDA or the oasis GDA for a quote.',
        actors: 'Farmers, the oasis GDA.',
        regulation: 'Access to water and boreholes: to validate with the CRDA.',
        risks: 'Pressure on aquifers; salinity.',
        actions: ['Map what grows on each storey.', 'Fill in the missing storey (often the middle one).', 'Thin the top storey if the lower storeys lack light.']
      },
      'tn-cistern': {
        name: 'Rainwater harvesting cisterns',
        summary: 'A buried cistern fed by a collection area: it stores winter water for livestock, supplementary irrigation or household use.',
        description: 'Widespread practice in the arid zone. Local names (for example majel, fesguia) and their dimensions are still to be confirmed with a source.',
        why: ['Enough rain is needed to fill the cistern; threshold to validate.', 'Most useful without a network.', 'The collection area must slope so that it runs off towards the cistern; threshold to validate.'],
        materials: 'Masonry or concrete, waterproof render, compacted or cemented collection area, settling basin.',
        cost: 'Not costed in the current sources: depends on the cistern volume. See the CRDA water mobilisation programmes.',
        actors: 'Households, CRDA (water mobilisation programmes).',
        regulation: 'To validate.',
        risks: 'Water quality; upkeep of the collection area.',
        dimNotes: { org: 'Individual or family cistern: no collective organisation required.' },
        actions: ['Estimate the volume you can collect: area × rainfall × runoff coefficient.', 'Clean the collection area before the rains.', 'Keep the stored water for young plants in summer.']
      },
      'x-mulch': {
        name: 'Mulching with pruning residues',
        summary: 'Shred pruning residues and spread them at the foot of the trees to cut evaporation from bare soil (the mottainai principle: waste nothing).',
        description: 'Mulch limits evaporation at the soil surface; FAO-56 covers the effect of mulches on evaporation. Also inspired by the permanent ground cover of Japanese orchards.',
        why: ['Trees that produce pruning residues.', 'The gain is largest where evaporative demand is high (FAO-56, bare soil evaporation); threshold to validate.'],
        materials: 'Shredded pruning residues.',
        cost: 'Labour; a shredder to rent or share.',
        actors: 'Farmer; GDA to share a shredder.',
        regulation: 'None known.',
        risks: 'Do not pile mulch against the trunk; watch the fire risk in summer.',
        dimNotes: { terrain: 'No slope constraint: the mulch goes at the foot of each tree.' },
        actions: ['Shred the residues of the winter pruning.', 'Spread a ring of mulch at the edge of the canopy, not against the trunk.', 'Renew once a year after the first rains.']
      },
      'jp-tanada': {
        name: 'Japanese terraces (tanada)',
        summary: 'Flat steps linked by overflow points: water goes down the slope one level at a time instead of rushing down it.',
        description: 'In Okuizumo, land degraded by iron-sand mining was turned into terraced rice fields held by stone walls and fed by gravity canals. The original version assumes plenty of water for flooding.',
        why: ['A flooded terraced rice field needs a continuous water supply.', 'Terraced rice growing in a humid climate; threshold to validate.', 'Steps only make sense on a slope; threshold to validate.'],
        materials: 'Stone, earth; canals.',
        cost: 'Not costed for Tunisia.',
        actors: 'Village organisations in Japan; in Tunisia, the CRDA and farmers.',
        regulation: 'To validate.',
        risks: 'Direct transfer is impossible in a dry zone.',
        adapt: ['Keep the geometry (flat steps and a controlled overflow point) but without flooding: a dry terrace combined with existing jessour or tabias.'],
        actions: ['Level a 4 m strip along the contour line.', 'Open an overflow sill at the low point of each dam.', 'Mulch the foot of the trees before the rains.']
      },
      'jp-canal-turn': {
        name: 'Published water turn (Okuizumo canals)',
        summary: 'An irrigation order known to everyone, set by a fairness rule, for farms that share the same source.',
        description: 'In Okuizumo, village organisations maintain the canals and water is allocated in an order that follows an old custom meant for fair sharing and avoiding conflict.',
        why: ['A source shared by several farms is needed.'],
        materials: 'None: a shared schedule.',
        cost: 'Low.',
        actors: 'GDA (agricultural development group) or a group of neighbours.',
        regulation: 'The official water allocation must be respected.',
        risks: 'Works only if every member accepts it.',
        dimNotes: { climate: 'No climate constraint: the sharing rule holds in any climate.', terrain: 'No relief constraint: it applies to the existing network.' },
        actions: ['List the farms connected to the same source.', 'Publish the week’s turn.', 'Allow a turn to be swapped with a neighbour under water stress.']
      },
      'jp-solar-sharing': {
        name: 'Solar sharing (agrivoltaics)',
        summary: 'Narrow, raised and spaced panels above a crop: the plot produces electricity and the shade can protect some crops from heat.',
        description: 'Current practice in Japan. In Tunisia, the interest depends on a use for the electricity (pumping, grid) and on the crop’s shade tolerance. Simulate it on the Agrivoltaics page.',
        why: ['Without a pump or a grid connection, the electricity has no use on the farm.', 'Low or shrub crops are easier to cover; shade tolerance still to document.', 'Enough radiation to make spaced panels pay (NASA POWER, annual mean); threshold to validate.', 'Raised structures are easier to anchor on a gentle slope; threshold to validate.'],
        materials: 'Tall structures, panels, inverter or solar pump.',
        cost: 'Prices to enter and date (see Water & energy).',
        actors: 'Approved installer; STEG if grid-connected.',
        regulation: 'Grid connection and permits: to validate.',
        risks: 'Over-pumping if pumping becomes free: always with a quota (see Water & energy).',
        actions: ['Simulate panel height and spacing.', 'Calculate the monthly water quota before sizing.', 'Check the grid connection conditions.']
      },
      'jp-satoyama-layers': {
        name: 'Layered system inspired by satoyama',
        summary: 'Manage the plot as layers that help each other (trees, intercrops, hedges) rather than as a monoculture.',
        description: 'In Japan, satoyama is the band where village, woods and fields are managed as one system. In Tunisia the logic is close to the oasis; in rainfed areas it becomes windbreak hedges and intercrops.',
        why: ['Intercropped layers need a minimum of water; threshold to validate.', 'A main crop is needed to organise the layers around.'],
        materials: 'Hedge plants, seeds.',
        cost: 'Not costed.',
        actors: 'Farmers, neighbours (shared hedges).',
        regulation: 'None known.',
        risks: 'Competition for water between layers if badly sized.',
        dimNotes: { terrain: 'No slope constraint: on a slope, combine with terraces or basins.' },
        actions: ['Take stock of the existing layers.', 'Add a windbreak hedge on the prevailing wind side.', 'Try an intercrop on a small area.']
      }
    },

    ja: {
      'tn-jessour': {
        name: 'ジェスール',
        summary: '山間のワジ（涸れ川）を横切る土の堤（タビア）。流出水と土砂をせき止め、土砂がたまって耕作できる段（オリーブ、イチジク、穀物）ができます。',
        description: '各単位（ジェスル）は、流出水を集める集水域、土砂の堆積でできる段（堤の近くで最大5 mの厚さ）、長さ15〜50 m・高さ2〜5 mの堤と、下流の単位へ水を流す余水吐きからなります。南東部（メドニン、マトマタ）の伝統的なシステムです。',
        why: ['乾燥地帯。WOCATの記録では年間降水量250 mm未満。', '中〜急な山の斜面（WOCATの記録）。5 %という数値は要検証。', '天水農業向けの設計：水は流出水から得ます。'],
        materials: '土。古い堤の補強に空積みの石。',
        cost: '設置：3,000 TND/ha、維持：900 TND/ha/年（WOCATの記録。記録の為替レートは1 USD = 1.3 TNDで、古い数値です）。',
        actors: '農家とその家族。公的プログラムが共同出資する場合はCRDA（記録によると農家負担は10〜50 %）。',
        regulation: '要検証：ワジの改変と、下流の流出水に対する権利。',
        risks: '下流の利用者が使える水が減る。農村からの人口流出でノウハウが失われつつある。大洪水に弱い。',
        actions: ['雨季の前に堤と余水吐きを点検する。', '段に土砂を補い、決壊箇所を補修する。', '段の最も土が深い部分にオリーブを植える、または補植する。']
      },
      'tn-tabia': {
        name: 'タビア',
        summary: '緩やかな土地向けのジェスールの一種。両側に土手を持つ土の堤と余水吐きで、集水域から水を受けます。',
        description: '長さ50〜150 m、高さ1〜2 mの堤。記録では耕作面積と集水域の比は1:4（一般には1:6〜1:20）。傾斜が約3 %を超えない場所に設置（記録では3〜5 %の区分）。メドニン北部で記録されています。',
        why: ['乾燥地帯。年間降水量250 mm未満（WOCATの記録）。', '緩やかな傾斜：約3 %以下、WOCATの記録では3〜5 %の区分。', '天水作物のための流出水の集水。'],
        materials: '土（堤）、石とコンクリート（余水吐き）、蛇籠（分水堤）。',
        cost: '設置：670 TND/ha、維持：200 TND/ha/年（WOCATの記録、1 USD = 1.3 TND）。',
        actors: '農家。農家負担10〜50 %の公的プログラム。',
        regulation: '要検証。',
        risks: '放牧地を犠牲にして広がることがある。長い干ばつや洪水に弱い。維持管理に左右される。',
        adapt: ['傾斜が5 %より急な場合：タビアではなく、ワジを横切る堤であるジェスールを選びます。'],
        actions: ['予定した長さ全体で傾斜が緩やかなことを確認する。', '集水域の大きさを決める（記録によると耕作面積の約4倍）。', '最初の雨季の前に石の余水吐きをつくる。']
      },
      'tn-meskat': {
        name: 'メスカット',
        summary: 'サヘル地方のシステム。上流側に整えた集水域が、下流側の植栽区画（多くはオリーブ）へ流出水を導きます。',
        description: '半乾燥地帯で50年以上続く伝統的なシステム。WOCATの記録では、植生被覆の対策と組み合わせた集水技術に分類され、凹地形で用いられます。',
        why: ['半乾燥地帯（WOCATの記録）。記録に降水量の記載はなく、範囲は要検証。', '集水域から区画へ水が流れるには傾斜が必要。しきい値は要検証。', '記録によると天水または混合の水供給。'],
        materials: '土手用の土。集水域は裸地のまま締め固めます。',
        cost: '設置：現地通貨1,400単位（記録のレート1 USD = 2.5で約560 USD）。面積の単位は記録に記載なし。',
        actors: '農家。記録によると、多くは物的な支援なしで導入されています。',
        regulation: '要検証。',
        risks: '記録に欠点の記載はありません。農業技術者と補う必要があります。',
        actions: ['上流側に集水域を区切り、流れを妨げる植生を取り除く。', '植栽区画のまわりの土手を高くする。', '水の入口を最も若い木に向ける。']
      },
      'tn-dry-stone-basins': {
        name: 'オリーブの木を囲む空積み石の水受け',
        summary: '各オリーブの上流側に半円形の空積み石垣をつくり、流出水をため、ゆっくり浸み込ませます。',
        description: 'ウェスラティア（カイルアン）で記録。浅い溝の底に大きな石を据え、1〜2 cmの砕石でろ過します。記録では平均降水量350 mm（200〜400 mm）、最大傾斜35°。',
        why: ['WOCATの記録では降水量200〜400 mm。', 'WOCATの記録では最大傾斜35°（約70 %）。', '主にオリーブに使われます。'],
        materials: '地元の石、砕石。大ハンマー、つるはし、シャベル。',
        cost: '設置：水受け1基あたり171 TND、道具込み（WOCATの記録、3.1 TND/USD）。',
        actors: '小規模農家。農地開発保全総局の支援を受けられる場合があります。',
        regulation: '自分の区画では既知の規制なし — 要検証。',
        risks: '建設に手間と費用がかかる（記録による主な障壁）。',
        actions: ['流出の最も強い場所にある木から始める。', '各幹の上流側に石垣をつくる。', '耕うんのたびに形を整え、水受けの除草をする。']
      },
      'tn-oasis': {
        name: '三層のオアシス',
        summary: '上層にナツメヤシ、中層に果樹、地面に低い作物。上層の日陰が下の層を守ります。',
        description: 'ジェリドとガベスのオアシスのシステム。定期的な灌漑に依存しています。',
        why: ['オアシスは灌漑システムです。', '日陰の効果は主に暑い気候で大きい。しきい値は要検証。', '各層の代表的な作物。', 'オアシスは平坦な土地で重力灌漑されます（FAO GIAHSの記録）。数値は要検証。'],
        materials: 'ナツメヤシの子株、果樹の苗（ザクロ、イチジク、柑橘）、野菜の種。既存のセギア（用水路）。',
        cost: '現在の出典では算定なし。費用は主に水へのアクセスで決まります。CRDAまたはオアシスのGDAに見積もりを依頼してください。',
        actors: '農家、オアシスのGDA。',
        regulation: '水と井戸の利用：CRDAで要確認。',
        risks: '帯水層への負荷、塩類化。',
        actions: ['各層で何が育っているかを地図にする。', '欠けている層（多くは中層）を補う。', '下層の光が足りなければ上層を間引く。']
      },
      'tn-cistern': {
        name: '雨水をためる貯水槽',
        summary: '集水面から水を受ける地下貯水槽。冬の水を家畜の飲み水、補助灌漑、家庭用にためます。',
        description: '乾燥地帯で広く行われている方法。地元の呼び名（例：マジェル、フェスギア）と寸法は、出典で確認する必要があります。',
        why: ['貯水槽を満たすだけの雨が必要。しきい値は要検証。', '灌漑網がない場合に特に有用。', '集水面は貯水槽へ流れるよう傾斜が必要。しきい値は要検証。'],
        materials: '石積みまたはコンクリート、防水モルタル、締め固めた、またはセメント仕上げの集水面、沈殿槽。',
        cost: '現在の出典では算定なし。貯水槽の容量によります。CRDAの水資源確保プログラムを参照してください。',
        actors: '世帯、CRDA（水資源確保プログラム）。',
        regulation: '要検証。',
        risks: '水質、集水面の維持管理。',
        dimNotes: { org: '個人または家族の貯水槽：共同の組織は不要です。' },
        actions: ['集められる量を見積もる：集水面積 × 降水量 × 流出係数。', '雨の前に集水面を掃除する。', 'ためた水は夏の若い苗のために取っておく。']
      },
      'x-mulch': {
        name: '剪定くずによるマルチング',
        summary: '剪定くずを粉砕して木の根元に敷き、裸地からの蒸発を減らします（もったいない：何も無駄にしない）。',
        description: 'マルチは土壌表面の蒸発を抑えます。FAO-56はマルチが蒸発に与える効果を扱っています。日本の果樹園の常時被覆にも着想を得ています。',
        why: ['剪定くずが出る樹木。', '蒸発需要の高い場所ほど効果が大きい（FAO-56、裸地からの蒸発）。しきい値は要検証。'],
        materials: '粉砕した剪定くず。',
        cost: '人手。粉砕機はレンタルか共有。',
        actors: '農家。粉砕機を共有するためのGDA。',
        regulation: '既知の規制なし。',
        risks: 'マルチを幹に押しつけない。夏の火災の危険に注意。',
        dimNotes: { terrain: '傾斜の制約なし：マルチは各木の根元に敷きます。' },
        actions: ['冬の剪定くずを粉砕する。', '幹に触れないよう、樹冠の外縁に輪状にマルチを敷く。', '最初の雨の後、年に一度敷き直す。']
      },
      'jp-tanada': {
        name: '日本の棚田',
        summary: '越流口でつながった平らな段。水は斜面を一気に流れ下るのではなく、一段ずつ下ります。',
        description: '奥出雲では、砂鉄採取で荒れた土地が、石垣で支えられ重力式の水路で水を引く棚田に生まれ変わりました。元の形は、湛水のための豊富な水を前提としています。',
        why: ['水を張る棚田には連続した水の供給が必要です。', '湿潤な気候での棚田の稲作。しきい値は要検証。', '段は傾斜地でこそ意味があります。しきい値は要検証。'],
        materials: '石、土。水路。',
        cost: 'チュニジアでの算定なし。',
        actors: '日本では集落の組織。チュニジアではCRDAと農家。',
        regulation: '要検証。',
        risks: '乾燥地帯でそのまま移すことはできません。',
        adapt: ['形（平らな段と制御された越流口）は生かし、湛水はしない：既存のジェスールやタビアと組み合わせた乾式テラスにします。'],
        actions: ['等高線に沿って幅4 mの帯を平らにする。', '各堤の最も低い点に越流堰を開ける。', '雨の前に木の根元をマルチで覆う。']
      },
      'jp-canal-turn': {
        name: '公開された水番（奥出雲の水路）',
        summary: '同じ水源を共有する農場のために、公平のルールで決めた、誰もが知る灌漑の順番。',
        description: '奥出雲では集落の組織が水路を維持し、水の配分は、公平な分配と争いの回避のための古い慣習に従った順番で行われます。',
        why: ['複数の農場が共有する水源が必要です。'],
        materials: 'なし：共有のスケジュールのみ。',
        cost: '低い。',
        actors: 'GDA（農業開発グループ）または近隣農家のグループ。',
        regulation: '公式の水の割当を守る必要があります。',
        risks: 'メンバー全員が受け入れた場合にのみ機能します。',
        dimNotes: { climate: '気候の制約なし：分配のルールはどの気候でも有効です。', terrain: '地形の制約なし：既存の水路網に適用します。' },
        actions: ['同じ水源につながる農場を一覧にする。', 'その週の水番を公開する。', '水不足の隣人と順番を交換できるようにする。']
      },
      'jp-solar-sharing': {
        name: 'ソーラーシェアリング（営農型太陽光）',
        summary: '作物の上に、細く高く間隔をあけたパネルを設置。区画で発電し、日陰が一部の作物を暑さから守ります。',
        description: '日本で現在行われている方法。チュニジアでの有用性は、電気の使い道（揚水、系統）と作物の耐陰性によります。営農型太陽光のページでシミュレーションできます。',
        why: ['ポンプも系統接続もなければ、農場で電気の使い道がありません。', '背の低い作物や低木は覆いやすい。耐陰性は要調査。', '間隔をあけたパネルが採算に合うだけの日射量（NASA POWER、年平均）。しきい値は要検証。', '高い架台は緩やかな傾斜の方が固定しやすい。しきい値は要検証。'],
        materials: '高い架台、パネル、インバーターまたは太陽光ポンプ。',
        cost: '価格を入力し、日付を記録してください（水とエネルギーを参照）。',
        actors: '認定施工業者。系統接続の場合はSTEG。',
        regulation: '系統接続と許可：要検証。',
        risks: '揚水が無料になると過剰揚水につながる：必ず割当量とセットで（水とエネルギーを参照）。',
        actions: ['パネルの高さと間隔をシミュレーションする。', '規模を決める前に月ごとの水の割当量を計算する。', '系統接続の条件を確認する。']
      },
      'jp-satoyama-layers': {
        name: '里山に学ぶ多層システム',
        summary: '区画を単一栽培ではなく、互いに助け合う層（樹木、間作、生け垣）として管理します。',
        description: '日本の里山は、集落・林・田畑をひとつのシステムとして管理する地帯です。チュニジアではオアシスの考え方に近く、天水地域では防風生け垣と間作の形になります。',
        why: ['間作の層には最低限の水が必要。しきい値は要検証。', '層を組み立てる中心となる主作物が必要です。'],
        materials: '生け垣の苗、種子。',
        cost: '算定なし。',
        actors: '農家、近隣（共有の生け垣）。',
        regulation: '既知の規制なし。',
        risks: '規模を誤ると層の間で水を奪い合います。',
        dimNotes: { terrain: '傾斜の制約なし：斜面では段々畑や水受けと組み合わせます。' },
        actions: ['今ある層を確認する。', '卓越風の側に防風生け垣を加える。', '狭い面積で間作を試す。']
      }
    }
  };

  // source labels that contain French words (titles of the works stay as published)
  var SRC = {
    en: {
      'FAO GIAHS — Okuizumo System (Japon)': 'FAO GIAHS — Okuizumo System (Japan)', 'FAO GIAHS — Gafsa Oases (Tunisie)': 'FAO GIAHS — Gafsa Oases (Tunisia)',
      'Oweis, Prinz et Hachum (2001), Water harvesting: indigenous knowledge for the future of the drier environments, ICARDA — référence bibliographique': 'Oweis, Prinz and Hachum (2001), Water harvesting: indigenous knowledge for the future of the drier environments, ICARDA — bibliographic reference',
      'FAO-56 (Allen et al., 1998), chapitre 11 : paillis de surface': 'FAO-56 (Allen et al., 1998), chapter 11: surface mulches',
      'MAFF (Japon) — 営農型太陽光発電 (solar sharing) : cadre et lignes directrices': 'MAFF (Japan) — 営農型太陽光発電 (solar sharing): framework and guidelines'
    },
    ja: {
      'FAO GIAHS — Okuizumo System (Japon)': 'FAO GIAHS — 奥出雲（日本）', 'FAO GIAHS — Gafsa Oases (Tunisie)': 'FAO GIAHS — ガフサのオアシス（チュニジア）',
      'Oweis, Prinz et Hachum (2001), Water harvesting: indigenous knowledge for the future of the drier environments, ICARDA — référence bibliographique': 'Oweis, Prinz, Hachum (2001), Water harvesting: indigenous knowledge for the future of the drier environments, ICARDA — 文献',
      'FAO-56 (Allen et al., 1998), chapitre 11 : paillis de surface': 'FAO-56（Allen et al., 1998）第11章：地表マルチ',
      'MAFF (Japon) — 営農型太陽光発電 (solar sharing) : cadre et lignes directrices': '農林水産省 — 営農型太陽光発電：制度とガイドライン'
    }
  };

  var FAM = {
    en: { water: 'Water', energy: 'Energy', agriculture: 'Agriculture', soil: 'Soil conservation' },
    ja: { water: '水', energy: 'エネルギー', agriculture: '農業', soil: '土壌保全' }
  };
  Object.keys(KB.families).forEach(function (f) { KB.families[f].en = FAM.en[f]; KB.families[f].ja = FAM.ja[f]; });

  var FIELDS = ['name', 'summary', 'description', 'materials', 'cost', 'actors', 'regulation', 'risks'];
  // keep the French originals once
  KB.records.forEach(function (r) {
    if (r._fr) return;
    r._fr = { actions: (r.actions || []).slice(), why: r.conditions.map(function (c) { return c.why; }),
      adapt: (r.adaptations || []).map(function (a) { return a.text; }), dimNotes: r.dimNotes ? Object.assign({}, r.dimNotes) : null,
      src: r.sources.map(function (x) { return x.label; }) };
    FIELDS.forEach(function (k) { r._fr[k] = r[k]; });
    r._en = T.en[r.id] || null;
  });

  function apply(l) {
    KB.records.forEach(function (r) {
      var src = (T[l] && T[l][r.id]) || {}, o = r._fr;
      FIELDS.forEach(function (k) { r[k] = src[k] || o[k]; });
      r.actions = (src.actions || o.actions).slice();
      r.conditions.forEach(function (c, i) { c.why = (src.why && src.why[i]) || o.why[i]; });
      (r.adaptations || []).forEach(function (a, i) { a.text = (src.adapt && src.adapt[i]) || o.adapt[i]; });
      r.sources.forEach(function (x, i) { x.label = (SRC[l] && SRC[l][o.src[i]]) || o.src[i]; });
      if (o.dimNotes) r.dimNotes = Object.assign({}, o.dimNotes, src.dimNotes || {});
    });
  }
  KB.applyLang = apply;
  KB.i18n = T; KB.i18nSources = SRC;
  if (G) { apply(G.lang()); G.onLang(apply); }
}(window));
