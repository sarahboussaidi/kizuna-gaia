/* ==========================================================================
   GAIA — "Make it easier" panel, on every page (platform and story).
   - bigger text, high contrast, easy-to-read font, bigger buttons, no animation
   - read aloud: the whole page, or "tap to listen" (tap once to hear, twice to open)
   - voice typing: a microphone next to the text field you are typing in
   Settings are remembered on this device ("gaia.a11y"). Works offline except
   voice typing, which uses the browser's own speech service.
   Self-contained: needs no other GAIA script, follows the page language
   (<html lang>) in FR / AR / EN / JA.
   ========================================================================== */
(function () {
  'use strict';
  if (window.GAIA_A11Y) return;

  var KEY = 'gaia.a11y';
  var SIZES = [1, 1.15, 1.3, 1.5];
  var DEF = { size: 0, contrast: false, readable: false, big: false, still: false, tap: false, slow: false, voice: true };
  var S = Object.assign({}, DEF);
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* no storage */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* no storage */ } }

  /* ------------------------------------------------------------ words */
  var W = {
    fr: {
      open: 'Accessibilité : texte, contraste et voix', btn: 'Aide',
      title: 'Rendre GAIA plus facile', intro: 'Choisissez ce qui vous aide. GAIA s\'en souvient sur cet appareil.',
      see: 'Voir', hear: 'Écouter et parler',
      size: 'Taille du texte', contrast: 'Contraste élevé', contrast_d: 'Noir sur blanc, liens soulignés',
      readable: 'Écriture facile à lire', readable_d: 'Lettres simples, plus d\'espace',
      big: 'Gros boutons', big_d: 'Plus facile à toucher',
      still: 'Arrêter les animations', still_d: 'Rien ne bouge sur la page',
      listen: 'Écouter la page', tap: 'Toucher pour écouter', tap_d: 'Touchez un texte pour l\'entendre. Sur un bouton : une fois pour écouter, deux fois pour ouvrir.',
      slow: 'Lire lentement', voice: 'Dicter avec la voix', voice_d: 'Un micro apparaît à côté de la case où vous écrivez.',
      reset: 'Tout remettre comme avant', close: 'Fermer',
      reading: 'Lecture en cours', pause: 'Pause', resume: 'Reprendre', stop: 'Arrêter',
      mic: 'Parler pour écrire', listening: 'Je vous écoute… parlez maintenant', mic_err: 'Le micro ne marche pas ici. Vérifiez l\'autorisation du micro.',
      no_tts: 'La lecture à voix haute n\'existe pas dans ce navigateur.', no_voice: 'Aucune voix française sur cet appareil : la lecture utilise une autre voix.',
      no_stt: 'La dictée n\'existe pas dans ce navigateur (essayez Chrome ou Edge).', again: 'Touchez encore pour ouvrir'
    },
    ar: {
      open: 'إمكانية الوصول: النص والتباين والصوت', btn: 'مساعدة',
      title: 'اجعل غايا أسهل', intro: 'اختر ما يساعدك. يحفظ غايا اختيارك على هذا الجهاز.',
      see: 'الرؤية', hear: 'الاستماع والكلام',
      size: 'حجم الكتابة', contrast: 'تباين عالٍ', contrast_d: 'أسود على أبيض، والروابط مسطّرة',
      readable: 'خط سهل القراءة', readable_d: 'حروف بسيطة ومسافات أكبر',
      big: 'أزرار كبيرة', big_d: 'أسهل للّمس',
      still: 'إيقاف الحركة', still_d: 'لا شيء يتحرك في الصفحة',
      listen: 'استمع إلى الصفحة', tap: 'المس للاستماع', tap_d: 'المس أي نص لتسمعه. على الزر: مرة للاستماع، ومرتين للفتح.',
      slow: 'قراءة بطيئة', voice: 'الكتابة بالصوت', voice_d: 'يظهر ميكروفون بجانب الخانة التي تكتب فيها.',
      reset: 'إرجاع كل شيء كما كان', close: 'إغلاق',
      reading: 'القراءة جارية', pause: 'إيقاف مؤقت', resume: 'متابعة', stop: 'إيقاف',
      mic: 'تكلّم لتكتب', listening: 'أستمع إليك… تكلّم الآن', mic_err: 'الميكروفون لا يعمل هنا. تحقّق من إذن الميكروفون.',
      no_tts: 'القراءة بصوت عالٍ غير متوفرة في هذا المتصفح.', no_voice: 'لا يوجد صوت عربي على هذا الجهاز: القراءة تستعمل صوتًا آخر.',
      no_stt: 'الكتابة بالصوت غير متوفرة في هذا المتصفح (جرّب Chrome أو Edge).', again: 'المس مرة أخرى للفتح'
    },
    en: {
      open: 'Accessibility: text, contrast and voice', btn: 'Help',
      title: 'Make GAIA easier', intro: 'Pick what helps you. GAIA remembers it on this device.',
      see: 'See', hear: 'Listen and speak',
      size: 'Text size', contrast: 'High contrast', contrast_d: 'Black on white, underlined links',
      readable: 'Easy-to-read letters', readable_d: 'Plain letters, more space',
      big: 'Big buttons', big_d: 'Easier to tap',
      still: 'Stop animations', still_d: 'Nothing moves on the page',
      listen: 'Listen to this page', tap: 'Tap to listen', tap_d: 'Tap any text to hear it. On a button: tap once to hear it, twice to open it.',
      slow: 'Read slowly', voice: 'Type with your voice', voice_d: 'A microphone appears next to the box you are typing in.',
      reset: 'Put everything back', close: 'Close',
      reading: 'Reading aloud', pause: 'Pause', resume: 'Resume', stop: 'Stop',
      mic: 'Speak to type', listening: 'Listening… speak now', mic_err: 'The microphone does not work here. Check the microphone permission.',
      no_tts: 'Reading aloud is not available in this browser.', no_voice: 'No English voice on this device: another voice is used.',
      no_stt: 'Voice typing is not available in this browser (try Chrome or Edge).', again: 'Tap again to open'
    },
    ja: {
      open: 'アクセシビリティ：文字・コントラスト・音声', btn: 'ヘルプ',
      title: 'GAIAを使いやすく', intro: '役に立つものを選んでください。この端末に保存されます。',
      see: '見る', hear: '聞く・話す',
      size: '文字の大きさ', contrast: 'ハイコントラスト', contrast_d: '白地に黒、リンクに下線',
      readable: '読みやすい文字', readable_d: 'シンプルな書体、広い行間',
      big: '大きいボタン', big_d: 'タップしやすく',
      still: 'アニメーションを止める', still_d: 'ページの動きをなくす',
      listen: 'このページを聞く', tap: 'タップで読み上げ', tap_d: '文字をタップすると読み上げます。ボタンは1回で読み上げ、2回で開きます。',
      slow: 'ゆっくり読む', voice: '音声で入力', voice_d: '入力中の欄の横にマイクが表示されます。',
      reset: 'すべて元に戻す', close: '閉じる',
      reading: '読み上げ中', pause: '一時停止', resume: '再開', stop: '停止',
      mic: '話して入力', listening: '聞いています…どうぞ話してください', mic_err: 'ここではマイクが使えません。マイクの許可を確認してください。',
      no_tts: 'このブラウザでは読み上げを使えません。', no_voice: 'この端末に日本語の音声がありません。別の音声で読み上げます。',
      no_stt: 'このブラウザでは音声入力を使えません（Chrome または Edge をお試しください）。', again: 'もう一度タップで開きます'
    }
  };
  var SPEECH_LANG = { fr: 'fr-FR', ar: 'ar-SA', en: 'en-US', ja: 'ja-JP' };
  var LISTEN_LANG = { fr: 'fr-FR', ar: 'ar-TN', en: 'en-US', ja: 'ja-JP' };
  function lang() { var l = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase(); return W[l] ? l : 'en'; }
  function t(k) { return W[lang()][k] || W.en[k] || k; }

  /* ------------------------------------------------------------ icons */
  var IC = {
    access: '<circle cx="12" cy="4.5" r="2"/><path d="M4 8.5l8 1.5 8-1.5M12 10v4.5M8.5 21l3.5-6.5 3.5 6.5"/>',
    text: '<path d="M4 18L9 5l5 13M5.8 13.5h6.4M15 18l3-7.5 3 7.5M16 16h4"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    font: '<path d="M5 19V5h9M5 12h7M15 19l3-8 3 8M16 16.5h4"/>',
    hand: '<path d="M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.6 13a1.5 1.5 0 0 1 2.5-1.7L9 14"/>',
    still: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 9v6M14 9v6"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    tap: '<path d="M4 9v6h4l5 4V5L8 9z"/><circle cx="18.5" cy="12" r="2.5"/>',
    slow: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>'
  };
  function svg(name, size) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false');
    s.setAttribute('width', size || 22); s.setAttribute('height', size || 22);
    s.innerHTML = IC[name] || '';
    return s;
  }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /* ------------------------------------------------------------ styles */
  var CSS = [
    /* text size: zoom the page, never GAIA's own controls (they keep their positions) */
    'html.a11y-z body > *:not(.a11y-ui):not(.gp-tip) { zoom: var(--a11y-zoom, 1); }',

    /* the floating button, the panel, the reading bar, the microphone */
    '.a11y-ui, .a11y-ui * { box-sizing: border-box; }',
    'body > .a11y-fab, body > .a11y-bar, body > .a11y-mic, body > .a11y-toast { position: fixed !important; }',
    'body > .a11y-fab { z-index: 950 !important; } body > .a11y-bar { z-index: 960 !important; } body > .a11y-mic { z-index: 970 !important; } body > .a11y-toast { z-index: 980 !important; }',
    '.a11y-fab { position: fixed; inset-inline-end: 16px; bottom: 16px; z-index: 950; display: inline-flex; align-items: center; gap: 8px; min-height: 56px; padding: 0 18px 0 14px; border-radius: 999px; border: 2px solid #fff; background: #1B3A8C; color: #fff; font: 700 16px/1 system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,.35); }',
    '.a11y-fab:hover { background: #142C6B; }',
    '.a11y-fab:focus-visible, .a11y-ui button:focus-visible, .a11y-ui a:focus-visible { outline: 3px solid #FFBF00; outline-offset: 3px; box-shadow: 0 0 0 6px #111; }',
    '.a11y-fab svg { width: 28px; height: 28px; }',
    '@media (max-width: 700px) { html.a11y-z body > .gp-top, html.a11y-z body > header { position: relative !important; } }',
    '@media (max-width: 600px) { .a11y-fab { inset-inline-end: 12px; bottom: 12px; padding: 0 14px 0 12px; } }',
    'html.a11y-reading .a11y-fab { display: none; }',

    '.a11y-panel { width: min(460px, 100vw - 24px); max-height: min(92vh, 860px); padding: 0; border: 0; border-radius: 18px; background: #fff; color: #111; box-shadow: 0 24px 60px rgba(0,0,0,.45); font: 400 17px/1.45 system-ui, -apple-system, "Segoe UI", Tahoma, "IBM Plex Sans Arabic", "Noto Sans JP", sans-serif; overflow: auto; }',
    '.a11y-panel::backdrop { background: rgba(0,0,0,.55); }',
    '.a11y-panel[dir=rtl] { font-family: "IBM Plex Sans Arabic", "Cairo", Tahoma, sans-serif; }',
    '.a11y-hd { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; gap: 12px; padding: 16px 18px; background: #1B3A8C; color: #fff; }',
    '.a11y-panel h2, .a11y-panel h3 { font-family: inherit !important; letter-spacing: 0 !important; line-height: 1.3 !important; }',
    '.a11y-hd h2 { margin: 0; font-size: 21px !important; font-weight: 700 !important; flex: 1; color: #fff !important; }',
    '.a11y-hd svg { flex: none; }',
    '.a11y-x { flex: none; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px; border: 2px solid rgba(255,255,255,.6); background: transparent; color: #fff; cursor: pointer; }',
    '.a11y-bd { padding: 14px 18px 20px; display: grid; gap: 10px; }',
    '.a11y-intro { margin: 0 0 4px; color: #333; }',
    '.a11y-grp { margin: 10px 0 0 !important; font-size: 14px !important; font-weight: 700 !important; color: #444 !important; text-transform: uppercase; letter-spacing: .06em; }',
    '.a11y-panel[dir=rtl] .a11y-grp, .a11y-panel[lang=ja] .a11y-grp { letter-spacing: 0; }',
    '.a11y-big-btn { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 60px; padding: 10px 16px; border-radius: 14px; border: 0; background: #1F5130; color: #fff; font: inherit; font-size: 19px; font-weight: 700; cursor: pointer; }',
    '.a11y-big-btn:hover { background: #17402A; }',
    '.a11y-row { display: flex; align-items: center; gap: 14px; width: 100%; min-height: 60px; padding: 10px 14px; border-radius: 14px; border: 2px solid #C9CDD3; background: #F6F7F9; color: #111; font: inherit; text-align: start; cursor: pointer; }',
    '.a11y-row:hover { border-color: #1B3A8C; }',
    '.a11y-row .ic { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; background: #E3E8F4; color: #1B3A8C; }',
    '.a11y-row .tx { flex: 1; min-width: 0; }',
    '.a11y-row .tx b { display: block; font-size: 17px; }',
    '.a11y-row .tx small { display: block; font-size: 14.5px; color: #444; margin-top: 2px; }',
    '.a11y-sw { flex: none; position: relative; width: 52px; height: 30px; border-radius: 999px; background: #8A9099; transition: background .15s; }',
    '.a11y-sw::after { content: ""; position: absolute; top: 3px; inset-inline-start: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: inset-inline-start .15s; }',
    '.a11y-row[aria-checked=true] { border-color: #1F5130; background: #EAF4EC; }',
    '.a11y-row[aria-checked=true] .a11y-sw { background: #1F5130; }',
    '.a11y-row[aria-checked=true] .a11y-sw::after { inset-inline-start: 25px; }',
    '.a11y-sizes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }',
    '.a11y-sizes button { min-height: 56px; border-radius: 12px; border: 2px solid #C9CDD3; background: #F6F7F9; color: #111; font-family: Georgia, "Times New Roman", serif; font-weight: 700; cursor: pointer; }',
    '.a11y-sizes button[aria-pressed=true] { background: #1B3A8C; border-color: #1B3A8C; color: #fff; }',
    '.a11y-note { margin: 0; padding: 10px 12px; border-radius: 10px; background: #FFF4D6; color: #3D2E00; font-size: 15px; }',
    '.a11y-reset { min-height: 52px; margin-top: 6px; border-radius: 12px; border: 2px solid #1B3A8C; background: #fff; color: #1B3A8C; font: inherit; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }',

    '.a11y-bar { position: fixed; z-index: 960; inset-inline: 12px; bottom: 12px; margin-inline: auto; max-width: 520px; display: none; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px; background: #111; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.4); font: 600 16px/1.3 system-ui, -apple-system, "Segoe UI", Tahoma, "IBM Plex Sans Arabic", sans-serif; }',
    'html.a11y-reading .a11y-bar { display: flex; }',
    '.a11y-bar .lbl { flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }',
    '.a11y-bar button { min-height: 48px; min-width: 48px; padding: 0 14px; display: inline-flex; align-items: center; gap: 8px; border-radius: 12px; border: 2px solid #fff; background: transparent; color: #fff; font: inherit; cursor: pointer; }',
    '.a11y-bar button.stop { background: #fff; color: #111; }',

    '.a11y-speaking { outline: 4px solid #FFBF00 !important; outline-offset: 4px; background-color: rgba(255, 191, 0, .18) !important; border-radius: 4px; }',
    '.a11y-armed { outline: 4px dashed #1B3A8C !important; outline-offset: 3px; }',

    '.a11y-mic { position: fixed; z-index: 970; display: none; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 2px solid #fff; background: #1B3A8C; color: #fff; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,.3); }',
    '.a11y-mic.on { display: flex; }',
    '.a11y-mic.live { background: #B3261E; animation: a11y-pulse 1.2s infinite; }',
    '@keyframes a11y-pulse { 50% { box-shadow: 0 0 0 10px rgba(179,38,30,.25); } }',
    '.a11y-toast { position: fixed; z-index: 980; inset-inline: 12px; top: 12px; margin-inline: auto; max-width: 520px; padding: 14px 16px; border-radius: 14px; background: #111; color: #fff; font: 600 16px/1.35 system-ui, -apple-system, "Segoe UI", Tahoma, "IBM Plex Sans Arabic", sans-serif; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.4); }',
    '.a11y-toast[hidden] { display: none; }',

    /* high contrast */
    'html.a11y-contrast { --g-ivory: #fff; --g-paper: #fff; --g-sand-soft: #F2F2F2; --g-sage-soft: #F2F2F2; --g-ink: #000; --g-ink-2: #111; --g-ink-3: #222; --g-forest: #00331A; --g-forest-2: #00331A; --g-gold: #5C4300; --g-gold-ink: #4A3600; --g-line: #000; --g-line-2: #000; --cream: #fff; --ivory: #fff; --ink: #000; --ink-soft: #111; --ink-mute: #222; }',
    'html.a11y-contrast body { background: #fff !important; color: #000 !important; }',
    'html.a11y-contrast body::before, html.a11y-contrast body::after, html.a11y-contrast .grain { display: none !important; }',
    'html.a11y-contrast main :is(p, td, dd, figcaption, .note) a:not(.gp-btn) { text-decoration: underline !important; text-underline-offset: 3px; }',
    'html.a11y-contrast main .step .num { color: #000 !important; }',
    'html.a11y-contrast .gp-card, html.a11y-contrast .mod, html.a11y-contrast .card, html.a11y-contrast [class*=card] { background: #fff !important; border: 2px solid #000 !important; box-shadow: none !important; }',
    'html.a11y-contrast main p, html.a11y-contrast main li, html.a11y-contrast main td, html.a11y-contrast main th, html.a11y-contrast main label, html.a11y-contrast main small, html.a11y-contrast main .muted, html.a11y-contrast main .lead { color: #000 !important; }',
    'html.a11y-contrast main h1, html.a11y-contrast main h2, html.a11y-contrast main h3, html.a11y-contrast main h4 { color: #000 !important; }',
    'html.a11y-contrast input, html.a11y-contrast select, html.a11y-contrast textarea { background: #fff !important; color: #000 !important; border: 2px solid #000 !important; }',
    'html.a11y-contrast .gp-btn, html.a11y-contrast button:not(.a11y-ui button):not(.a11y-fab) { border: 2px solid currentColor !important; }',
    'html.a11y-contrast .gp-btn.primary, html.a11y-contrast .btn-primary { background: #000 !important; color: #fff !important; }',
    'html.a11y-contrast .gp-top, html.a11y-contrast body > header { background: #000 !important; backdrop-filter: none !important; }',
    'html.a11y-contrast .gp-top a, html.a11y-contrast .gp-top button, html.a11y-contrast .gp-tag { color: #fff !important; }',
    'html.a11y-contrast .gp-word { color: #fff !important; background: none !important; -webkit-text-fill-color: #fff; }',
    'html.a11y-contrast .gp-nav a[aria-current=page], html.a11y-contrast .gp-lang button[aria-pressed=true] { background: #FFE14D !important; color: #000 !important; }',
    'html.a11y-contrast main .hero, html.a11y-contrast main .ss-hero, html.a11y-contrast main .ai-hero { background: #000 !important; }',
    'html.a11y-contrast main :is(.hero, .ss-hero, .ai-hero) :is(h1, h2, h3, p, span, li, a, em, strong, b, small, div) { color: #fff !important; }',
    'html.a11y-contrast main .hero .gp-btn.primary, html.a11y-contrast main .hero .gp-btn.primary * { background: #FFE14D !important; color: #000 !important; }',
    'html.a11y-contrast :focus-visible { outline: 4px solid #FFBF00 !important; outline-offset: 3px !important; box-shadow: 0 0 0 7px #000 !important; }',
    'html.a11y-contrast footer, html.a11y-contrast .gp-foot { background: #000 !important; color: #fff !important; }',
    'html.a11y-contrast footer * { color: #fff !important; }',

    /* easy-to-read letters (never letter-spacing on Arabic: it breaks the joins) */
    'html.a11y-readable { --g-display: "Atkinson Hyperlegible", Verdana, "Segoe UI", system-ui, sans-serif; --g-sans: "Atkinson Hyperlegible", Verdana, "Segoe UI", system-ui, sans-serif; --display: Verdana, "Segoe UI", sans-serif; --sans: Verdana, "Segoe UI", sans-serif; --hand: Verdana, sans-serif; }',
    'html.a11y-readable body, html.a11y-readable body :not(.a11y-ui):not(.a11y-ui *):not(svg):not(svg *) { font-family: "Atkinson Hyperlegible", Verdana, "Segoe UI", system-ui, sans-serif !important; font-style: normal !important; }',
    'html.a11y-readable[lang=ar] body, html.a11y-readable[lang=ar] body :not(.a11y-ui):not(.a11y-ui *):not(svg):not(svg *) { font-family: "IBM Plex Sans Arabic", "Noto Sans Arabic", Tahoma, sans-serif !important; letter-spacing: 0 !important; }',
    'html.a11y-readable[lang=ja] body, html.a11y-readable[lang=ja] body :not(.a11y-ui):not(.a11y-ui *):not(svg):not(svg *) { font-family: "Zen Kaku Gothic New", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif !important; }',
    'html.a11y-readable main p, html.a11y-readable main li, html.a11y-readable main td, html.a11y-readable main label { line-height: 1.75 !important; word-spacing: .08em; }',
    'html.a11y-readable:not([lang=ar]) main p, html.a11y-readable:not([lang=ar]) main li { letter-spacing: .02em; }',
    'html.a11y-readable main h1, html.a11y-readable main h2, html.a11y-readable main h3 { letter-spacing: 0 !important; line-height: 1.25 !important; }',
    'html.a11y-readable main p, html.a11y-readable main li { max-width: 72ch; }',

    /* big buttons */
    'html.a11y-bigbtn .gp-btn, html.a11y-bigbtn main button, html.a11y-bigbtn .gp-nav a, html.a11y-bigbtn .gp-lang button, html.a11y-bigbtn .gp-parcel, html.a11y-bigbtn .gp-acc, html.a11y-bigbtn [role=button], html.a11y-bigbtn [role=tab], html.a11y-bigbtn main select, html.a11y-bigbtn main input:not([type=checkbox]):not([type=radio]):not([type=range]) { min-height: 52px !important; font-size: max(1em, 17px) !important; }',
    'html.a11y-bigbtn .gp-btn, html.a11y-bigbtn main button { padding-inline: 20px !important; }',
    'html.a11y-bigbtn main input[type=checkbox], html.a11y-bigbtn main input[type=radio] { width: 26px; height: 26px; }',
    'html.a11y-bigbtn main a { text-underline-offset: 4px; }',

    /* no motion */
    'html.a11y-still *, html.a11y-still *::before, html.a11y-still *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
    'html.a11y-still .reveal { opacity: 1 !important; transform: none !important; }',
    '@media (prefers-reduced-motion: reduce) { .a11y-mic.live { animation: none; } }',

    /* tap to listen */
    'html.a11y-tap main :is(p, li, h1, h2, h3, h4, td, th, dt, dd, label, figcaption, blockquote) { cursor: help; }',

    '@media print { .a11y-ui { display: none !important; } }'
  ].join('\n');

  /* ------------------------------------------------------------ apply settings */
  var root = document.documentElement;
  function apply() {
    root.classList.toggle('a11y-z', S.size > 0);
    root.style.setProperty('--a11y-zoom', SIZES[S.size] || 1);
    root.classList.toggle('a11y-contrast', !!S.contrast);
    root.classList.toggle('a11y-readable', !!S.readable);
    root.classList.toggle('a11y-bigbtn', !!S.big);
    root.classList.toggle('a11y-still', !!S.still);
    root.classList.toggle('a11y-tap', !!S.tap);
    if (S.readable) loadReadableFont();
  }
  var fontLoaded = false;
  function loadReadableFont() {
    if (fontLoaded) return; fontLoaded = true;
    document.head.appendChild(el('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap' }));
  }

  /* ------------------------------------------------------------ toast */
  var toast, toastTimer;
  function say(msg, ms) {
    if (!toast) { toast = el('div', { class: 'a11y-ui a11y-toast', role: 'status', 'aria-live': 'polite', hidden: true }); document.body.appendChild(toast); }
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.hidden = true; }, ms || 4000);
  }

  /* ------------------------------------------------------------ read aloud */
  var synth = window.speechSynthesis || null;
  var queue = [], qi = 0, current = null, paused = false, warnedVoice = {};
  var READ_SEL = 'h1, h2, h3, h4, h5, p, li, dt, dd, figcaption, blockquote, caption, th, td, label, summary, .gp-btn, .note, [data-read]';

  function visible(n) {
    if (!n.getClientRects().length) return false;
    if (n.closest('[aria-hidden="true"], [hidden], .a11y-ui, .sr-only, .gp-skip, script, style, noscript')) return false;
    var cs = getComputedStyle(n);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  }
  function textOf(n) {
    var lbl = n.matches('button, a, [role=button]') && n.getAttribute('aria-label');
    var s = (lbl || n.innerText || n.textContent || '').replace(/\s+/g, ' ').trim();
    if (!s && n.tagName === 'IMG') s = n.alt || '';
    return s;
  }
  function chunks(s) {
    if (s.length <= 220) return [s];
    var parts = s.match(/[^.!?。！？؟]+[.!?。！？؟]*\s*/g) || [s], out = [], buf = '';
    parts.forEach(function (p) { if ((buf + p).length > 220 && buf) { out.push(buf); buf = p; } else buf += p; });
    if (buf) out.push(buf);
    return out;
  }
  function pickVoice(l) {
    if (!synth) return null;
    var vs = synth.getVoices(), want = SPEECH_LANG[l] || l;
    var exact = vs.filter(function (v) { return v.lang && v.lang.replace('_', '-').toLowerCase() === want.toLowerCase(); });
    var near = vs.filter(function (v) { return v.lang && v.lang.slice(0, 2).toLowerCase() === l; });
    var pool = exact.length ? exact : near;
    if (l === 'ar') { var tn = vs.filter(function (v) { return /^ar[-_]TN/i.test(v.lang); }); if (tn.length) pool = tn; }
    return pool.filter(function (v) { return v.localService; })[0] || pool[0] || null;
  }
  function speakNode(n, onend) {
    if (!synth) { say(t('no_tts')); return; }
    var l = lang(), txt = textOf(n);
    if (!txt) { if (onend) onend(); return; }
    var v = pickVoice(l);
    if (!v && synth.getVoices().length && !warnedVoice[l]) { warnedVoice[l] = 1; say(t('no_voice'), 6000); }
    var parts = chunks(txt), i = 0;
    mark(n);
    (function next() {
      if (i >= parts.length) { unmark(); if (onend) onend(); return; }
      var u = new SpeechSynthesisUtterance(parts[i++]);
      u.lang = (v && v.lang) || SPEECH_LANG[l]; if (v) u.voice = v;
      u.rate = S.slow ? 0.75 : 0.95;
      u.onend = function () { if (current === u) next(); };
      u.onerror = function () { if (current === u) { unmark(); stopReading(); } };
      current = u;
      synth.speak(u);
    }());
  }
  var marked = null;
  function mark(n) {
    unmark(); marked = n; n.classList.add('a11y-speaking');
    var r = n.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight - 90) n.scrollIntoView({ block: 'center', behavior: S.still ? 'auto' : 'smooth' });
  }
  function unmark() { if (marked) marked.classList.remove('a11y-speaking'); marked = null; }

  function readPage() {
    if (!synth) { say(t('no_tts')); return; }
    stopReading();
    var scope = document.querySelector('main') || document.body;
    var all = Array.prototype.slice.call(scope.querySelectorAll(READ_SEL)).filter(visible);
    queue = all.filter(function (n) {
      for (var p = n.parentElement; p && p !== scope; p = p.parentElement) if (p.matches(READ_SEL) && all.indexOf(p) !== -1) return false;
      return textOf(n).length > 1;
    });
    // start from what is on screen when the reader has already scrolled down
    qi = 0;
    for (var k = 0; k < queue.length; k++) { if (queue[k].getBoundingClientRect().bottom > 60) { qi = k; break; } }
    root.classList.add('a11y-reading'); paused = false; updateBar();
    playNext();
  }
  function playNext() {
    if (qi >= queue.length) { stopReading(); return; }
    var n = queue[qi++];
    speakNode(n, function () { if (root.classList.contains('a11y-reading')) playNext(); });
  }
  function stopReading() {
    current = null; queue = []; paused = false;
    if (synth) synth.cancel();
    unmark(); root.classList.remove('a11y-reading');
    if (fab && document.activeElement === document.body) fab.focus();
  }
  function togglePause() {
    if (!synth) return;
    if (paused) { synth.resume(); paused = false; } else { synth.pause(); paused = true; }
    updateBar();
  }

  /* tap to listen: tap text to hear it; on a link or button, tap once to hear, again to open */
  var armed = null, armedAt = 0;
  function onTap(e) {
    if (!S.tap || e.button) return;
    var tgt = e.target;
    if (!(tgt instanceof Element) || tgt.closest('.a11y-ui')) return;
    var act = tgt.closest('a[href], button, [role=button], [role=tab], summary, select, input, textarea');
    if (act) {
      if (act.matches('input, textarea, select')) return;      // typing must stay normal
      if (armed === act && Date.now() - armedAt < 6000) { disarm(); return; } // second tap: go
      e.preventDefault(); e.stopPropagation();
      disarm(); armed = act; armedAt = Date.now(); act.classList.add('a11y-armed');
      stopReading(); speakNode(act); say(t('again'), 2500);
      return;
    }
    var n = tgt.closest(READ_SEL);
    if (!n || !n.closest('main, body')) return;
    stopReading(); speakNode(n);
  }
  function disarm() { if (armed) armed.classList.remove('a11y-armed'); armed = null; }

  /* ------------------------------------------------------------ voice typing */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var mic, micField = null, rec = null;
  var TYPABLE = 'textarea, input:not([type]), input[type=text], input[type=search], input[type=number], input[type=tel], input[type=email], input[type=url]';
  function placeMic() {
    if (!micField || !mic) return;
    var r = micField.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { mic.classList.remove('on'); return; }
    var rtl = getComputedStyle(micField).direction === 'rtl';
    var big = micField.tagName === 'TEXTAREA' && r.height > 70;
    var top = big ? r.bottom - 50 : r.top + (r.height - 44) / 2;
    var left = rtl ? r.left - 50 : r.right + 6;
    if (left + 44 > innerWidth - 4) left = r.right - 50;          // no room outside: sit inside the field's end
    if (left < 4) left = r.left + 6;
    mic.style.top = Math.max(4, top) + 'px'; mic.style.left = left + 'px';
    mic.classList.add('on');
  }
  function onFocusIn(e) {
    var f = e.target;
    if (!S.voice || !SR || !(f instanceof Element) || !f.matches(TYPABLE) || f.readOnly || f.disabled || f.closest('.a11y-ui')) return;
    micField = f;
    mic.setAttribute('aria-label', t('mic')); mic.title = t('mic');
    placeMic();
  }
  function onFocusOut() {
    setTimeout(function () {
      if (rec) return;
      if (document.activeElement !== micField) { mic.classList.remove('on'); micField = null; }
    }, 150);
  }
  function insertText(f, words) {
    if (f.type === 'number') {
      var m = words.replace(/,/g, '.').match(/-?\d+(\.\d+)?/);
      if (!m) return;
      f.value = m[0];
    } else {
      var s = f.selectionStart, en = f.selectionEnd, v = f.value;
      if (typeof s !== 'number') { s = en = v.length; }
      var pre = v.slice(0, s), sep = pre && !/\s$/.test(pre) ? ' ' : '';
      f.value = pre + sep + words + v.slice(en);
      var c = (pre + sep + words).length;
      try { f.setSelectionRange(c, c); } catch (x) { /* not a text field */ }
    }
    f.dispatchEvent(new Event('input', { bubbles: true }));
    f.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function toggleDictation() {
    if (!SR) { say(t('no_stt')); return; }
    if (rec) { rec.stop(); return; }
    var f = micField; if (!f) return;
    rec = new SR();
    rec.lang = LISTEN_LANG[lang()] || 'fr-FR';
    rec.interimResults = false; rec.continuous = false; rec.maxAlternatives = 1;
    rec.onresult = function (ev) {
      var words = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) if (ev.results[i].isFinal) words += ev.results[i][0].transcript;
      if (words.trim()) insertText(f, words.trim());
    };
    rec.onerror = function (ev) { if (ev.error !== 'no-speech' && ev.error !== 'aborted') say(t('mic_err'), 5000); };
    rec.onend = function () { rec = null; mic.classList.remove('live'); mic.setAttribute('aria-pressed', 'false'); f.focus(); };
    try { rec.start(); mic.classList.add('live'); mic.setAttribute('aria-pressed', 'true'); say(t('listening'), 3500); }
    catch (x) { rec = null; say(t('mic_err')); }
  }

  /* ------------------------------------------------------------ panel */
  var fab, panel, bar, barLbl, barPause;
  function switchRow(key, icon, label, desc) {
    var b = el('button', { type: 'button', class: 'a11y-row', role: 'switch', 'aria-checked': String(!!S[key]), 'data-k': key, onclick: function () {
      S[key] = !S[key]; save(); apply(); b.setAttribute('aria-checked', String(!!S[key]));
      if (key === 'tap' && !S[key]) disarm();
      if (key === 'voice' && !S[key] && mic) mic.classList.remove('on');
    } }, [
      el('span', { class: 'ic' }, [svg(icon, 24)]),
      el('span', { class: 'tx' }, [el('b', { text: t(label) }), desc ? el('small', { text: t(desc) }) : null]),
      el('span', { class: 'a11y-sw', 'aria-hidden': 'true' })
    ]);
    return b;
  }
  function buildPanel() {
    var l = lang();
    var sizes = el('div', { class: 'a11y-sizes', role: 'group', 'aria-label': t('size') }, SIZES.map(function (z, i) {
      return el('button', { type: 'button', 'aria-pressed': String(S.size === i), 'aria-label': t('size') + ' ' + Math.round(z * 100) + '%', dir: 'ltr', style: 'font-size:' + (16 + i * 4) + 'px', onclick: function () {
        S.size = i; save(); apply();
        sizes.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
      } }, ['A' + (i ? '+'.repeat(i) : '')]);
    }));
    var notes = [];
    if (!synth) notes.push(el('p', { class: 'a11y-note', text: t('no_tts') }));
    if (!SR) notes.push(el('p', { class: 'a11y-note', text: t('no_stt') }));
    var body = el('div', { class: 'a11y-bd' }, [
      el('p', { class: 'a11y-intro', text: t('intro') }),
      synth ? el('button', { type: 'button', class: 'a11y-big-btn', onclick: function () { panel.close(); readPage(); } }, [svg('speaker', 28), t('listen')]) : null,
      el('h3', { class: 'a11y-grp', text: t('see') }),
      el('div', { class: 'a11y-row', style: 'cursor:default;flex-wrap:wrap' }, [el('span', { class: 'ic' }, [svg('text', 24)]), el('span', { class: 'tx' }, [el('b', { text: t('size') })]), el('div', { style: 'flex-basis:100%' }, [sizes])]),
      switchRow('contrast', 'contrast', 'contrast', 'contrast_d'),
      switchRow('readable', 'font', 'readable', 'readable_d'),
      switchRow('big', 'hand', 'big', 'big_d'),
      switchRow('still', 'still', 'still', 'still_d'),
      el('h3', { class: 'a11y-grp', text: t('hear') }),
      synth ? switchRow('tap', 'tap', 'tap', 'tap_d') : null,
      synth ? switchRow('slow', 'slow', 'slow') : null,
      SR ? switchRow('voice', 'mic', 'voice', 'voice_d') : null
    ].concat(notes).concat([
      el('button', { type: 'button', class: 'a11y-reset', onclick: function () { S = Object.assign({}, DEF); save(); apply(); rebuild(true); } }, [svg('reset', 22), t('reset')])
    ]));
    var p = el('dialog', { class: 'a11y-ui a11y-panel', 'aria-labelledby': 'a11y-title', lang: l, dir: l === 'ar' ? 'rtl' : 'ltr' }, [
      el('div', { class: 'a11y-hd' }, [svg('access', 30), el('h2', { id: 'a11y-title', text: t('title') }),
        el('button', { type: 'button', class: 'a11y-x', 'aria-label': t('close'), onclick: function () { p.close(); } }, [svg('close', 26)])]),
      body
    ]);
    p.addEventListener('click', function (e) { if (e.target === p) p.close(); });     // tap outside closes
    p.addEventListener('close', function () { fab.setAttribute('aria-expanded', 'false'); fab.focus(); });
    return p;
  }
  function rebuild(open) {
    var was = panel && panel.open;
    if (panel) { if (panel.open) panel.close(); panel.remove(); }
    panel = buildPanel(); document.body.appendChild(panel);
    if (open || was) openPanel();
  }
  function openPanel() {
    if (!panel) rebuild();
    if (panel.showModal) panel.showModal(); else panel.setAttribute('open', '');
    fab.setAttribute('aria-expanded', 'true');
    var first = panel.querySelector('.a11y-big-btn, .a11y-row button, .a11y-sizes button'); if (first) first.focus();
  }
  function labelUi() {
    fab.setAttribute('aria-label', t('open')); fab.title = t('open');
    fabTxt.textContent = t('btn');
    fab.setAttribute('lang', lang());
    barLbl.textContent = t('reading'); updateBar();
    bar.querySelector('.stop span').textContent = t('stop');
    bar.setAttribute('lang', lang()); bar.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr');
  }
  function updateBar() {
    if (!barPause) return;
    barPause.replaceChildren(svg(paused ? 'play' : 'pause', 22), el('span', { text: t(paused ? 'resume' : 'pause') }));
  }

  var fabTxt;
  function mount() {
    var st = document.createElement('style'); st.id = 'a11y-css'; st.textContent = CSS; document.head.appendChild(st);
    apply();
    fabTxt = el('span');
    fab = el('button', { type: 'button', class: 'a11y-ui a11y-fab', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', onclick: openPanel }, [svg('access', 28), fabTxt]);
    barLbl = el('span');
    barPause = el('button', { type: 'button', onclick: togglePause });
    bar = el('div', { class: 'a11y-ui a11y-bar', role: 'region', 'aria-label': 'Audio' }, [
      el('span', { class: 'lbl' }, [svg('speaker', 24), barLbl]),
      barPause,
      el('button', { type: 'button', class: 'stop', onclick: stopReading }, [svg('stop', 20), el('span')])
    ]);
    mic = el('button', { type: 'button', class: 'a11y-ui a11y-mic', 'aria-pressed': 'false', onmousedown: function (e) { e.preventDefault(); }, onclick: toggleDictation }, [svg('mic', 24)]);
    document.body.appendChild(fab); document.body.appendChild(bar); document.body.appendChild(mic);
    labelUi();

    document.addEventListener('click', onTap, true);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    addEventListener('scroll', placeMic, { passive: true });
    addEventListener('resize', placeMic);
    // a sticky header must never hide what the keyboard or a link jumps to (WCAG 2.4.11)
    function padTop() {
      var h = document.querySelector('.gp-top, body > header');
      var cs = h && getComputedStyle(h);
      root.style.scrollPaddingTop = cs && (cs.position === 'sticky' || cs.position === 'fixed') ? Math.ceil(h.getBoundingClientRect().height + 12) + 'px' : '';
    }
    padTop(); addEventListener('resize', padTop); setTimeout(padTop, 800);
    addEventListener('pagehide', function () { if (synth) synth.cancel(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('a11y-reading')) stopReading(); });
    if (synth && synth.onvoiceschanged !== undefined) synth.addEventListener('voiceschanged', function () { /* voices ready */ });

    // follow the page language (GAIA's switcher and the story pages both set <html lang>)
    new MutationObserver(function () { stopReading(); labelUi(); if (panel) rebuild(); })
      .observe(root, { attributes: true, attributeFilter: ['lang'] });
  }

  window.GAIA_A11Y = { open: function () { openPanel(); }, read: readPage, stop: stopReading, speak: function (n) { stopReading(); speakNode(n); }, settings: function () { return Object.assign({}, S); } };
  apply();
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
}());
