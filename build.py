# -*- coding: utf-8 -*-
"""Build the Gaia site as one story in seven chapters.

Run:  python3 build.py

Every page shares the same header, chapter banner, chapter progress,
"next chapter" link and footer, all defined once in this file. Long sections
that were written before (story collage, matcher, community, five
philosophies) are lifted out of the existing pages and reused unchanged.
"""

import io
import os
import re

read = lambda p: io.open(p, encoding='utf-8').read()


def write(path, html):
    io.open(path, 'w', encoding='utf-8').write(html)
    print('wrote', path)


def grab(paths, sid):
    """Pull <section id="sid"> out of the first page that still has it."""
    for p in paths:
        if os.path.exists(p):
            m = re.search(r'<section id="%s".*?</section>' % sid, read(p), re.S)
            if m:
                return m.group(0)
    raise SystemExit('section %s not found in %s' % (sid, paths))


def strip_head(html):
    return re.sub(r'<div class="section-head reveal">.*?</div>\s*', '', html, count=1, flags=re.S)


STORY = strip_head(grab(['story.html'], 'story'))
MATCHER = strip_head(grab(['bridge.html'], 'bridge'))
COMMUNITY = strip_head(grab(['community.html'], 'community'))
FIVE = strip_head(grab(['agriculture.html', 'pillars.html'], 'pillars'))
FIVE = FIVE.replace(
    '<div class="pillars">',
    u'''<div class="section-head reveal">
      <p class="seam left">&#20116;</p>
      <p class="eyebrow">In pictures</p>
      <h2>Five ideas that travel.</h2>
      <p>Each one began in a single country. Each one already has a cousin in the other.</p>
    </div>
    <div class="pillars">''', 1)

# ----------------------------------------------------------------- the book

# key, file, chapter numeral, motif kanji, nav label, one-line hook
CHAPTERS = [
    ('story', 'story.html', u'一', u'物語', 'Story',
     u'Two farmers, two hemispheres, the same question.'),
    ('water', 'water.html', u'二', u'水', 'Water',
     u'One country organised abundance. The other organised scarcity.'),
    ('energy', 'energy.html', u'三', u'陽', 'Energy',
     u'Panels above the crop &mdash; at the right height.'),
    ('agri', 'agriculture.html', u'四', u'土', 'Agriculture',
     u'Satoyama, mottainai, kaizen: ways of deciding.'),
    ('bridge', 'bridge.html', u'五', u'橋', 'Bridge',
     u'Six places where the two traditions touch.'),
    ('ai', 'ai.html', u'六', u'知', 'Engine',
     u'It does not copy. It checks.'),
    ('community', 'community.html', u'七', u'縁', 'Community',
     u'A letter from a field you will never visit.'),
]
INDEX = dict((c[0], i) for i, c in enumerate(CHAPTERS))
TOTAL = len(CHAPTERS)

FONTS = ('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;'
         '0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;700&'
         'family=Caveat:wght@500;600&family=Cairo:wght@400;600&'
         'family=Noto+Serif+JP:wght@400;600&display=swap')

ARROW = (u'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
         u'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         u'<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>')


def nav(current=None):
    links = []
    for key, href, num, kan, label, hook in CHAPTERS:
        mark = u' aria-current="page"' if key == current else u''
        links.append(u'<a class="navlink" href="%s"%s>%s</a>' % (href, mark, label))
    items = []
    for key, href, num, kan, label, hook in CHAPTERS:
        mark = u' aria-current="page"' if key == current else u''
        items.append(u'<a href="%s"%s><span class="k">%s</span>%s</a>' % (href, mark, num, label))
    return (u'<!--nav-->'
            u'<nav class="mainnav" aria-label="Main">\n      %s\n    </nav>\n'
            u'    <details class="navmenu">\n'
            u'      <summary>Chapters</summary>\n'
            u'      <nav class="menu" aria-label="Chapters">\n'
            u'        <a href="index.html"><span class="k">&#24207;</span>Prologue</a>\n'
            u'        %s\n'
            u'        <a href="home.html"><span class="k">&#32080;</span>GAIA platform</a>\n'
            u'      </nav>\n'
            u'    </details>'
            u'<!--/nav-->') % (u'\n      '.join(links), u'\n        '.join(items))


HEAD = u'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#344A38">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="images/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{fonts}" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body class="paper-noise">

<a class="skip" href="#main">Skip to content</a>

<svg class="grain" aria-hidden="true" focusable="false">
  <filter id="grainFilter">
    <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"></feTurbulence>
    <feColorMatrix type="saturate" values="0"></feColorMatrix>
    <feComponentTransfer><feFuncA type="linear" slope="0.38"></feFuncA></feComponentTransfer>
  </filter>
  <rect width="100%" height="100%" filter="url(#grainFilter)"></rect>
</svg>

<header class="nav">
  <div class="wrap nav-inner">
    <a class="brand" href="index.html" aria-label="Gaia, home">
      <span class="hanko" aria-hidden="true">&#32070;</span>
      <span class="brand-word">GAIA</span>
      <span class="jp">&#22823;&#22320;</span>
    </a>
    {nav}
    <a class="btn btn-ghost" href="home.html" style="min-height:44px;padding:0 20px;font-size:14px">Open the platform</a>
  </div>
</header>

<main id="main">
'''

FOOT = u'''</main>

<footer class="footer">
  <div class="wrap">
    <div style="display:flex;align-items:center;gap:16px">
      <span class="hanko lg" aria-hidden="true">&#32070;</span>
      <p class="eyebrow" style="color:var(--sage)">Kizuna 2026 &mdash; Japan &times; Tunisia</p>
    </div>
    <h2 style="margin-top:20px">Two cultures, one connection,<br>a sustainable future.</h2>
    <p style="margin-top:18px;max-width:56ch;color:#CFC9B7">Japan and Tunisia have different landscapes, cultures and farming traditions. They share the same challenge: building a sustainable future.</p>
    <nav aria-label="Footer" style="margin-top:26px;display:flex;flex-wrap:wrap;gap:12px 26px;font-size:14.5px">
      <a href="index.html">&#24207; Prologue</a>
      {foot_links}
      <a href="pillars.html">The pillars at a glance</a>
      <a href="login.html">Sign in</a>
      <a href="home.html">GAIA platform</a>
    </nav>
    <div class="footer-row">
      <p style="flex-grow:1">Team Gaia <span class="jp">&#22823;&#22320;</span> &mdash; Kizuna Challenge 2026, Tunisia &times; Japan</p>
      <p><a href="https://github.com/sarahboussaidi/kizuna-gaia">Source on GitHub</a></p>
      <p lang="ja">&#20108;&#12388;&#12398;&#25991;&#21270;&#12289;&#19968;&#12388;&#12398;&#22823;&#22320;</p>
    </div>
  </div>
</footer>

<script src="js/story-i18n.js"></script>
<script src="app.js"></script>
{extra}</body>
</html>
'''


def page(path, title, desc, body, current=None, extra=u''):
    foot_links = u'\n      '.join(
        u'<a href="%s">%s %s</a>' % (c[1], c[2], c[4]) for c in CHAPTERS)
    html = (HEAD.format(title=title, desc=desc, fonts=FONTS, nav=nav(current))
            + body
            + FOOT.format(foot_links=foot_links, extra=extra))
    write(path, html)


def dots(current):
    idx = INDEX[current]
    out = []
    for i, c in enumerate(CHAPTERS):
        cls = u'now' if i == idx else (u'past' if i < idx else u'')
        cur = u' aria-current="step"' if i == idx else u''
        out.append(u'<a class="%s" href="%s" aria-label="Chapter %d: %s"%s></a>'
                   % (cls, c[1], i + 1, c[4], cur))
    return (u'<div class="dots" aria-label="Chapters">%s<span class="count">Chapter %d of %d</span></div>'
            % (u''.join(out), idx + 1, TOTAL))


def chapter(key, h1, kicker, lede, tone=u''):
    c = CHAPTERS[INDEX[key]]
    dark = u' t-dark' if tone in ('t-water', 't-energy', 't-agri', 't-engine') else u''
    return u'''<section class="chapter %s%s">
  <span class="chapter-wash" aria-hidden="true"></span>
  <div class="wrap chapter-grid">
    <div class="chapter-mark" aria-hidden="true">
      <p class="ch-num" lang="ja">&#31532;%s&#31456;</p>
      <p class="ch-kanji" lang="ja">%s</p>
    </div>
    <div>
      <p class="crumbs"><a href="index.html">Gaia</a> &nbsp;/&nbsp; %s</p>
      <p class="eyebrow">Chapter %s &nbsp;&middot;&nbsp; %s</p>
      <h1>%s</h1>
      <p class="kicker">%s</p>
      <p class="lede">%s</p>
      %s
    </div>
  </div>
</section>
''' % (tone, dark, c[2], c[3], c[4], c[2], c[4], h1, kicker, lede, dots(key))


def next_chapter(key):
    idx = INDEX[key]
    prev = (u'index.html', u'Prologue') if idx == 0 else (CHAPTERS[idx - 1][1], CHAPTERS[idx - 1][4])
    if idx + 1 < TOTAL:
        n = CHAPTERS[idx + 1]
        card = (n[1], n[3], u'Next &middot; chapter %s' % n[2], n[4], n[5])
    else:
        card = (u'login.html', u'&#32080;', u'Epilogue', u'Join the story',
                u'Sign in, describe your first parcel, and write the next chapter yourself.')
    return u'''<section class="next">
  <div class="wrap">
    <a class="next-card reveal" href="%s">
      <span class="next-k" lang="ja" aria-hidden="true">%s</span>
      <span>
        <span class="lbl">%s</span>
        <h2>%s</h2>
        <p>%s</p>
      </span>
      <span class="next-arrow">%s</span>
    </a>
    <a class="prev-link" href="%s">&larr; Previous: %s</a>
  </div>
</section>
''' % (card[0], card[1], card[2], card[3], card[4], ARROW, prev[0], prev[1])


LEGEND = u'''<div class="legend">
  <span class="badge b-live">Working</span>
  <span class="badge b-demo">Demo</span>
  <span class="badge b-soon">Planned</span>
  <p>Every feature carries one of these. Working runs for real; Demo works on sample values; Planned is designed but not built.</p>
</div>'''


def feat(title, badge, cls, text, how):
    return u'''      <article class="feat reveal">
        <div class="top"><h3>%s</h3><span class="badge %s">%s</span></div>
        <p>%s</p>
        <p class="how">%s</p>
      </article>
''' % (title, cls, badge, text, how)


def split(jp_img, jp_alt, jp_title, jp_text, tn_img, tn_alt, tn_title, tn_text):
    return u'''<div class="split">
      <article class="jp-side reveal">
        <img class="split-img" src="images/%s" alt="%s" width="400" height="300" loading="lazy">
        <p class="eyebrow" style="color:var(--sakura-ink)">Japan &nbsp;<span lang="ja">&#26085;&#26412;</span></p>
        <h3>%s</h3>
        <p>%s</p>
      </article>
      <article class="tn-side reveal">
        <img class="split-img" src="images/%s" alt="%s" width="400" height="300" loading="lazy">
        <p class="eyebrow" style="color:var(--terracotta-deep)">Tunisia &nbsp;<span class="ar" lang="ar">&#1578;&#1608;&#1606;&#1587;</span></p>
        <h3>%s</h3>
        <p>%s</p>
      </article>
    </div>''' % (jp_img, jp_alt, jp_title, jp_text, tn_img, tn_alt, tn_title, tn_text)


# ===================================================================== HOME

PETALS = u'<div class="petals" aria-hidden="true">' + u'<i></i>' * 10 + u'</div>'

HERO = u'''<section class="hero" id="top" style="padding-block:0">
  <div class="hero-art" aria-hidden="true"><img src="images/hero-landscape.svg" alt=""></div>
  <div class="hero-veil" aria-hidden="true"></div>
  %s
  <p class="hero-vertical" lang="ja" aria-hidden="true">&#20108;&#12388;&#12398;&#25991;&#21270;&#12289;&#19968;&#12388;&#12398;&#22823;&#22320;</p>

  <div class="hero-content">
    <div class="wrap">
      <p class="eyebrow" style="color:#E6DFCB">Kizuna 2026 &nbsp;&middot;&nbsp; <span class="ar" lang="ar" style="color:#E6DFCB">&#1578;&#1608;&#1606;&#1587;</span> &nbsp;&times;&nbsp; <span lang="ja">&#26085;&#26412;</span></p>
      <h1>GAIA</h1>
      <p class="hero-tag">JAPAN &times; TUNISIA</p>
      <p class="hero-sub">A shared vision for a sustainable future.</p>
      <p class="hero-support">Where Japanese innovation meets Tunisian heritage to reimagine the future of water, energy and agriculture.</p>
      <div class="hero-cta">
        <a class="btn btn-primary" href="#prologue">Explore Gaia</a>
        <a class="btn btn-ghost" href="ai.html">Ask the engine</a>
      </div>
    </div>
  </div>

  <a class="scroll-cue" href="#prologue">Scroll</a>
</section>
''' % PETALS

ENSO = u'''<svg class="enso" viewBox="0 0 300 300" aria-hidden="true">
          <path d="M150 34 C 222 30, 270 86, 268 152 C 266 218, 214 268, 148 266 C 82 264, 34 214, 34 150 C 34 98, 66 58, 112 42"
                fill="none" stroke="#344A38" stroke-width="16" stroke-linecap="round" opacity="0.88"></path>
          <path d="M112 42 C 120 39, 128 37, 134 36" fill="none" stroke="#344A38" stroke-width="7" stroke-linecap="round" opacity="0.5"></path>
          <circle cx="150" cy="150" r="96" fill="#F4D875" opacity="0.22"></circle>
        </svg>'''

PROLOGUE = u'''<section id="prologue">
  <div class="wrap">
    <p class="seam" lang="ja">&#24207;</p>
    <div class="prologue">
      <div class="prologue-art reveal">
        %s
        <span class="enso-kanji" lang="ja" aria-hidden="true">&#32070;</span>
      </div>
      <div class="prologue-text reveal">
        <p class="eyebrow">Prologue &nbsp;&middot;&nbsp; The meaning of kizuna</p>
        <h2>One word for what holds two things together.</h2>
        <p>&#32070; &mdash; <em>kizuna</em> &mdash; is written with the radical for thread, &#31992;. It first meant a tether: the rope that kept an animal tied to its place. Over time it came to mean something gentler &mdash; the bonds between people that are hard to cut.</p>
        <p>Gaia is built on that second meaning. Japan and Tunisia farm different crops, on different soils, under different skies. They share one question: how to keep land fertile, water well used and energy clean for whoever farms it next.</p>
        <div class="gloss">
          <div><span class="g" lang="ja">&#32070;</span><span class="m">kizuna &mdash; bond</span></div>
          <div><span class="g" lang="ja">&#22823;&#22320;</span><span class="m">daichi &mdash; the land, Gaia</span></div>
          <div><span class="g ar" lang="ar" style="font-size:22px">&#1585;&#1575;&#1576;&#1591;&#1577;</span><span class="m">r&#257;bita &mdash; bond, in Arabic</span></div>
        </div>
      </div>
    </div>
  </div>
</section>
''' % ENSO

LANDSCAPES = u'''<section class="tint-ivory">
  <div class="wrap">
    <p class="seam" lang="ja">&#20108;</p>
    <div class="section-head reveal">
      <p class="eyebrow">Two landscapes, one challenge</p>
      <h2>Different skies. The same hillside problem.</h2>
      <p>A terraced valley in rural Japan and a dry slope in southern Tunisia look nothing alike. Both are trying to keep water, soil and a living on a piece of ground that would rather let them go.</p>
    </div>

    <div class="duo">
      <figure class="polaroid tilt-a reveal">
        <span class="tape" aria-hidden="true"></span>
        <img class="ill" src="images/tanada.svg" alt="Illustration of Japanese terraced rice fields on a green hillside" width="400" height="300" loading="lazy">
        <figcaption class="cap">&#26842;&#30000; &mdash; terraces that hold the rain</figcaption>
      </figure>
      <figure class="polaroid tilt-b reveal">
        <span class="tape" aria-hidden="true"></span>
        <img class="ill" src="images/jessour.svg" alt="Illustration of a Tunisian jessour, a stone dike across a dry valley with a fig tree behind it" width="400" height="300" loading="lazy">
        <figcaption class="cap">Jessour &mdash; dikes that catch it</figcaption>
      </figure>
    </div>

    <div class="challenges">
      <a class="challenge reveal" href="water.html">
        <span class="big" lang="ja" aria-hidden="true">&#27700;</span>
        <h3>Water</h3>
        <dl>
          <div><dt class="jpn">Japan</dt><dd>Rain is plentiful and the land is steep: the work is holding it and sharing it fairly.</dd></div>
          <div><dt class="tun">Tunisia</dt><dd>Rain is rare and arrives all at once: the work is catching it before it runs away.</dd></div>
        </dl>
        <span class="more">Chapter &#20108; &rarr;</span>
      </a>
      <a class="challenge reveal" href="energy.html">
        <span class="big" lang="ja" aria-hidden="true">&#38525;</span>
        <h3>Energy</h3>
        <dl>
          <div><dt class="jpn">Japan</dt><dd>Very little spare land, so panels learned to share a field with a crop.</dd></div>
          <div><dt class="tun">Tunisia</dt><dd>Strong sun most of the year, and pumps that need power to move water.</dd></div>
        </dl>
        <span class="more">Chapter &#19977; &rarr;</span>
      </a>
      <a class="challenge reveal" href="agriculture.html">
        <span class="big" lang="ja" aria-hidden="true">&#22303;</span>
        <h3>Agriculture</h3>
        <dl>
          <div><dt class="jpn">Japan</dt><dd>An ageing farming population, and know-how at risk of leaving with it.</dd></div>
          <div><dt class="tun">Tunisia</dt><dd>Centuries of dryland practice, much of it never written down.</dd></div>
        </dl>
        <span class="more">Chapter &#22235; &rarr;</span>
      </a>
    </div>
  </div>
</section>
'''


def scenes():
    out = []
    for key, href, num, kan, label, hook in CHAPTERS:
        out.append(u'''      <div class="scene">
        <a href="%s">
          <span class="row"><span class="k" lang="ja" aria-hidden="true">%s</span><span class="n" lang="ja">&#31532;%s&#31456;</span></span>
          <h3>%s</h3>
          <p>%s</p>
          <span class="go">Read &rarr;</span>
        </a>
      </div>''' % (href, kan, num, label, hook))
    return u'\n'.join(out)


THREAD = u'''<section>
  <div class="wrap">
    <p class="seam" lang="ja">&#19977;</p>
    <div class="section-head reveal">
      <p class="eyebrow">Follow the red thread</p>
      <h2>The story, in seven chapters.</h2>
      <p>In an old East Asian legend, an invisible red thread ties together the people who are meant to meet. Here it runs through seven chapters &mdash; read them in order, or pull on whichever one you need.</p>
    </div>
    <div class="emaki reveal" role="list">
%s
    </div>
    <p class="hint" style="margin-top:6px">Scroll sideways for every chapter.</p>
  </div>
</section>
''' % scenes()

HOW = u'''<section class="tint-forest">
  <div class="wrap">
    <p class="seam" lang="ja" style="color:var(--butter)">&#22235;</p>
    <div class="section-head reveal">
      <p class="eyebrow">How Gaia thinks</p>
      <h2>It does not copy Japan into Tunisia. It checks what survives the journey.</h2>
    </div>
    <div class="steps3">
      <div class="reveal">
        <p class="num" lang="ja">&#19968;</p>
        <h3>You describe your land</h3>
        <p>Slope, soil, rainfall, water source, power, crop &mdash; the way you would describe it to a neighbour.</p>
      </div>
      <div class="reveal">
        <p class="num" lang="ja">&#20108;</p>
        <h3>Gaia tests each practice</h3>
        <p>Every Japanese or Tunisian technique lists what it needs. Gaia rules out the ones your parcel cannot support, and says why.</p>
      </div>
      <div class="reveal">
        <p class="num" lang="ja">&#19977;</p>
        <h3>You get three actions</h3>
        <p>Not a report: the practice that fits, how well it fits, and three things to do in the field this month.</p>
      </div>
    </div>
    <div class="reveal" style="margin-top:clamp(34px,5vw,54px);display:flex;flex-wrap:wrap;gap:12px">
      <a class="btn btn-primary" href="ai.html" style="background:var(--butter);color:#2E2609">Ask the engine</a>
      <a class="btn btn-ghost" href="bridge.html" style="color:var(--cream);border-color:rgba(255,248,233,.5)">See the six connections</a>
    </div>
  </div>
</section>
'''

HONEST = u'''<section>
  <div class="wrap">
    <p class="seam" lang="ja">&#20116;</p>
    <div class="section-head reveal">
      <p class="eyebrow">What is real today</p>
      <h2>A hackathon project, labelled honestly.</h2>
      <p>The technique matcher, the engine&rsquo;s reasoning and the farmer workspace run in your browser on sample values. Everything else is designed, described and marked as planned. Nothing on this site is presented as a field measurement.</p>
    </div>
    %s
  </div>
</section>
''' % LEGEND

EPILOGUE = u'''<section class="tint-ivory">
  <div class="wrap epilogue reveal">
    <span class="hanko lg" aria-hidden="true">&#32080;</span>
    <h2>The rest of the story is written in the field.</h2>
    <p class="lead">Describe your first parcel, follow the actions Gaia gives you, and tell a farmer on the other side of the world what happened.</p>
    <div class="cta">
      <a class="btn btn-primary" href="home.html">Open the platform</a>
      <a class="btn btn-ghost" href="story.html">Start at chapter &#19968;</a>
    </div>
  </div>
</section>
'''

page('index.html',
     u'Gaia &mdash; Japan &times; Tunisia',
     u'Gaia connects Japanese innovation and Tunisian agricultural heritage across water, energy and agriculture. Built for Kizuna 2026.',
     HERO + PROLOGUE + LANDSCAPES + THREAD + HOW + HONEST + EPILOGUE)

# =================================================================== STORY

page('story.html', u'Chapter one: Story &mdash; Gaia',
     u'How a Tunisian jessour and a Japanese terrace turned out to be the same idea.',
     chapter('story', u'Two farmers, two hemispheres, the same question.',
             u'Same rain. Same slope. Two answers.',
             u'How do you keep water on a hillside that wants to let it go? In the south of Tunisia, the answer was carved into the valleys centuries ago. On the slopes of rural Japan, it was carved too &mdash; in a different language, with different hands.')
     + STORY + next_chapter('story'), 'story')

# =================================================================== WATER

WATER = u'''<section>
  <div class="wrap">
    ''' + split(
    'tanada.svg', u'Illustration of Japanese terraced fields fed by water from the hillside',
    u'Water as a shared obligation',
    u'In Japan&rsquo;s terraced valleys, mountain streams feed the fields through community-managed canals. Who waters when is settled by long-standing village custom rather than by whoever opens the gate first, and the canals are cleaned together every year.',
    'jessour.svg', u'Illustration of a Tunisian jessour holding silt and water behind a stone dike',
    u'Water as something you catch',
    u'Jessour and meskat do the opposite job: instead of sharing a reliable flow, they capture a rare one. Low dikes across a dry valley hold back the runoff of a few storms a year, with the silt it carries, and a crop grows in what builds up behind them.') + u'''

    <div class="section-head reveal" style="margin-top:clamp(44px,6vw,76px)">
      <p class="seam left" lang="ja">&#27700;</p>
      <p class="eyebrow">What Gaia builds on it</p>
      <h2>Four water modules.</h2>
    </div>

    <div class="feats">
''' + feat('Traditional Techniques Matching', 'Demo', 'b-demo',
           u'Describe a parcel and Gaia returns the traditional technique &mdash; from either country &mdash; that fits its slope, soil and rainfall.',
           u'Runs in the browser on a hand-written table of documented techniques. Try it in chapter &#20116;.') \
  + feat('Smart Irrigation AI', 'Planned', 'b-soon',
         u'Recommends when and how much to water, from the weather forecast, soil type and crop stage.',
         u'Needs a trained model and a weather feed. Designed, not built.') \
  + feat('Rainwater Intelligence', 'Planned', 'b-soon',
         u'Estimates how much of a coming storm a parcel can actually hold, given its dikes and terraces.',
         u'Needs elevation data per parcel. Designed, not built.') \
  + feat('Water Sharing', 'Planned', 'b-soon',
         u'A published irrigation turn for neighbours on one source, with the right to hand your slot to someone who needs it more.',
         u'Borrowed from the Japanese village turn. Needs accounts and a shared schedule.') + u'''    </div>
    ''' + LEGEND + u'''
  </div>
</section>
'''

page('water.html', u'Chapter two: Water &mdash; Gaia',
     u'Japanese water custom and Tunisian water harvesting, and the four water modules Gaia builds on them.',
     chapter('water', u'Water',
             u'Japanese water wisdom &times; Tunisian water heritage',
             u'One country organised abundance. The other organised scarcity. Both ended up with rules about who gets water and when &mdash; and the rules are the part that travels.',
             't-water')
     + WATER + next_chapter('water'), 'water')

# ================================================================== ENERGY

ENERGY = u'''<section>
  <div class="wrap">
    ''' + split(
    'solar-sharing.svg', u'Illustration of narrow solar panels raised on frames above rows of crops',
    u'Solar sharing',
    u'Japanese growers raise narrow solar panels on frames high above a field, spaced so part of the light still reaches the crop. The land keeps farming while it also makes electricity. The practice took hold in Japan because there is so little land to spare for either use alone.',
    'oasis.svg', u'Illustration of a Tunisian oasis in three layers: palms, fruit trees and vegetables',
    u'Shade as a resource',
    u'The Tunisian oasis already farms in layers: palms on top, fruit trees beneath, vegetables at ground level. The top layer exists to cut the sun. A raised panel is a new version of a very old answer &mdash; one that can also run the pump.') + u'''

    <div class="section-head reveal" style="margin-top:clamp(44px,6vw,76px)">
      <p class="seam left" lang="ja">&#38525;</p>
      <p class="eyebrow">What Gaia builds on it</p>
      <h2>Four energy modules.</h2>
    </div>

    <div class="feats">
''' + feat('Solar Sharing Advisor', 'Planned', 'b-soon',
           u'Works out panel height, spacing and orientation so the shade helps the crop instead of starving it.',
           u'The most original idea in this chapter, and the one that needs real light data per crop.') \
  + feat('Solar Farming AI', 'Planned', 'b-soon',
         u'Estimates what a parcel could produce in electricity alongside its harvest, and what that changes for the farm.',
         u'Needs irradiance data and local tariffs. Designed, not built.') \
  + feat('Smart Pumping', 'Planned', 'b-soon',
         u'Moves pumping to the hours when the panels produce, so water moves on sunlight.',
         u'The simplest to build first: a pump controller and a clock.') \
  + feat('Energy Prediction', 'Planned', 'b-soon',
         u'A short-range forecast of what the installation will produce, so irrigation can be planned around it.',
         u'Shares the weather feed with chapter &#20108;.') + u'''    </div>

    <p class="notice reveal" style="margin-top:28px;max-width:64ch">Nothing in this chapter is measured. No installation exists yet. Gaia describes what the combination would do, not what it has done.</p>
    ''' + LEGEND + u'''
  </div>
</section>
'''

page('energy.html', u'Chapter three: Energy &mdash; Gaia',
     u'Japanese solar sharing and Tunisian sun: four energy modules, honestly labelled.',
     chapter('energy', u'Energy',
             u'Japanese green technology &times; Tunisian solar potential',
             u'Japan put panels above crops because it had no spare land. Tunisia has the sun. The question is not whether to copy the technique, but at what height.',
             't-energy')
     + ENERGY + next_chapter('energy'), 'energy')

# ============================================================= AGRICULTURE

AGRI = u'''<section>
  <div class="wrap">
    ''' + split(
    'satoyama.svg', u'Illustration of woodland, fields and a village meeting with soft boundaries',
    u'A worked landscape',
    u'<span lang="ja">&#37324;&#23665;</span> Satoyama is the band between village and mountain where fields, woodland and homes are managed as one system. <span lang="ja">&#12418;&#12387;&#12383;&#12356;&#12394;&#12356;</span> Mottainai names the regret at wasting something still useful. <span lang="ja">&#25913;&#21892;</span> Kaizen is improvement in small, measured steps. None is a technology; all three are ways of deciding.',
    'olive-grove.svg', u'Illustration of a Tunisian olive grove on terraced ground at golden hour',
    u'The oasis already does this',
    u'The Tunisian oasis is a layered system too, and the olive farm wastes little by habit rather than by doctrine: prunings heat the house, pressing residue gets a second life. The vocabulary is different. The practice overlaps.') + u'''

    <div class="section-head reveal" style="margin-top:clamp(44px,6vw,76px)">
      <p class="seam left" lang="ja">&#22303;</p>
      <p class="eyebrow">What Gaia builds on it</p>
      <h2>Seven agriculture modules.</h2>
    </div>

    <div class="feats">
''' + feat('Knowledge Bridge', 'Demo', 'b-demo',
           u'The heart of the project: a parcel in, a documented technique out, with the reason it fits.',
           u'Working in the browser on a hand-written table. See chapter &#20116;.') \
  + feat('Crop Disease Detection', 'Planned', 'b-soon',
         u'Computer vision on a photo of a leaf, returning the likely disease and what to do next.',
         u'The easiest module to train on open datasets. Not built yet.') \
  + feat('Smart Crop Recommendation', 'Planned', 'b-soon',
         u'What to plant on this parcel, given its soil, water and the coming season.',
         u'Needs local yield records to be worth anything.') \
  + feat('Soil Intelligence', 'Planned', 'b-soon',
         u'Reads soil condition from photographs and a few manual tests, and tracks it across seasons.',
         u'Designed, not built.') \
  + feat(u'Kaizen Farming &nbsp;<span class="jp" lang="ja">&#25913;&#21892;</span>', 'Planned', 'b-soon',
         u'One small improvement a week, measured and confirmed before the next one arrives.',
         u'A tracking problem more than an AI one.') \
  + feat(u'Mottainai AI &nbsp;<span class="jp" lang="ja">&#12418;&#12387;&#12383;&#12356;&#12394;&#12356;</span>', 'Planned', 'b-soon',
         u'Spots what the farm throws away &mdash; water, heat, prunings, unsold harvest &mdash; and proposes a second use.',
         u'Designed, not built.') \
  + feat(u'Satoyama Model &nbsp;<span class="jp" lang="ja">&#37324;&#23665;</span>', 'Planned', 'b-soon',
         u'Models a parcel as layers rather than as one crop, and tunes the balance between them.',
         u'Designed, not built.') + u'''    </div>
    ''' + LEGEND + u'''
  </div>
</section>
'''

page('agriculture.html', u'Chapter four: Agriculture &mdash; Gaia',
     u'Japanese smart agriculture and Tunisian traditional farming: seven modules, honestly labelled.',
     chapter('agri', u'Agriculture',
             u'Japanese smart agriculture &times; Tunisian traditional farming',
             u'Satoyama, mottainai and kaizen are not technologies. They are ways of deciding &mdash; which is exactly why they travel.',
             't-agri')
     + AGRI + FIVE + next_chapter('agri'), 'agri')

# ================================================================== BRIDGE


def conn(title, badge_cls, badge, jp, tn, both, gaia, src=u''):
    src_html = (u'<p class="src">%s</p>' % src) if src else u''
    return u'''  <article class="conn reveal">
    <div class="conn-head">
      <h3>%s</h3>
      <span class="badge %s">%s</span>
    </div>
    <div class="conn-grid">
      <div class="c-jp"><h4>The Japanese approach</h4><p>%s</p></div>
      <div class="c-tn"><h4>The Tunisian counterpart</h4><p>%s</p></div>
      <div class="c-both"><h4>What both can learn</h4><p>%s</p></div>
      <div class="c-gaia"><h4>What Gaia would do with it</h4><p>%s</p></div>
    </div>
    %s
  </article>
''' % (title, badge_cls, badge, jp, tn, both, gaia, src_html)


CONNECTIONS = u'''<section class="tint-ivory">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="seam left" lang="ja">&#27211;</p>
      <p class="eyebrow">Six documented connections</p>
      <h2>Where the two traditions actually touch.</h2>
      <p>Each is a real practice in its own country. What Gaia adds is the pairing &mdash; and an honest note about what is built and what is not.</p>
    </div>

    <div class="conns">
''' + conn(
    u'Okuizumo &nbsp;<span class="jp" lang="ja">&#22885;&#20986;&#38642;</span>', 'b-soon', 'Reference',
    u'In Okuizumo, land left degraded by centuries of iron-sand mining was turned into terraced rice fields held by stone walls and fed by gravity canals from mountain streams. Village organisations keep the canals, and the timing of water allocation follows long-established custom meant to share it fairly and head off conflict.',
    u'Jessour and meskat answer a drier version of the same problem: how to make a slope keep what falls on it. Tunisia has the earthworks; what is rarer is a written turn-taking rule for who waters when.',
    u'Japan shows that the social rule matters as much as the stonework. Tunisia shows the same engineering when water arrives in three storms instead of all season.',
    u'Treat the canal custom as data: a schedule with a fairness rule, publishable to a group of neighbouring farms. That is the Water Sharing module &mdash; designed, not built.',
    u'Source: FAO, Globally Important Agricultural Heritage Systems &mdash; Okuizumo.') \
  + conn(
    u'Solar sharing', 'b-soon', 'Reference',
    u'Panels raised high above a field, spaced so part of the light still reaches the crop, so one plot produces both food and electricity. The approach developed in Japan, where spare land is scarce.',
    u'The oasis grows in three layers for the same reason: the top layer cuts the sun for the ones below. Tunisia has the sunshine Japan does not.',
    u'Japan brings the geometry &mdash; height, spacing, orientation. Tunisia brings the question of how much shade is a gift rather than a cost under a harsher sun.',
    u'A Solar Sharing Advisor that computes spacing for a given crop and latitude. It needs light-response data per crop we do not have, so it stays planned.') \
  + conn(
    u'Satoyama &nbsp;<span class="jp" lang="ja">&#37324;&#23665;</span>', 'b-soon', 'Reference',
    u'The managed band between village and mountain, where woodland, fields and settlement are kept as one system: the forest supplies leaf litter and firewood, the lower slopes food and livestock.',
    u'The Tunisian oasis is layered by the same logic, with palms, fruit trees and ground crops supporting each other instead of competing.',
    u'Both argue against the single-crop plot, and each gives the other a worked example in a completely different climate.',
    u'Model a parcel as layers rather than one crop, and tune the balance. Designed, not built.') \
  + conn(
    u'Society 5.0', 'b-soon', 'Reference',
    u'Japan&rsquo;s national framing of technology as something that should serve a human society &mdash; including an ageing, rural one &mdash; rather than the other way round.',
    u'Tunisian farms are not short of advice; they are short of advice in the right language, on the right device, at the right moment of the season.',
    u'The framing is what transfers: judge a tool by whether the person on the slope can actually use it.',
    u'Why Gaia plans spoken answers in Tunisian Arabic and offline use. Those are design commitments here, not shipped features.') \
  + conn(
    u'NARO', 'b-soon', 'Reference',
    u'Japan&rsquo;s national agriculture and food research organisation, which publishes agricultural research and field results.',
    u'Tunisia has its own agricultural research institutions, and a body of field knowledge that is largely unwritten.',
    u'A shared technique library only works if both sides contribute: one has publications, the other has practice nobody has written down.',
    u'The technique table behind the matcher stands in for that library. We wrote it by hand; it holds no institutional data.') \
  + conn(
    u'Jessour &amp; meskat', 'b-demo', 'In the demo',
    u'The Japanese counterpart is the terrace with its overflow sill: level the ground, then control where the surplus leaves.',
    u'Low dikes across a dry valley catch runoff and silt; a crop grows in what builds up behind them. Meskat gathers water from a prepared catchment upslope.',
    u'Together they give a hillside both storage and a controlled exit &mdash; the catchment holds, the sill decides where the overflow goes.',
    u'The one pairing the demo actually computes: enter a slope, a soil and a rainfall above, and the matcher returns it with three field actions.') + u'''    </div>

    <p class="hint reveal" style="margin-top:26px;max-width:66ch">None of these pairings has been measured in the field, and nothing here is presented as a result. The Okuizumo description follows the FAO heritage listing; the rest are described qualitatively on purpose.</p>
  </div>
</section>
'''

page('bridge.html', u'Chapter five: Knowledge bridge &mdash; Gaia',
     u'Six documented connections between Japanese and Tunisian practice, and a working technique matcher.',
     chapter('bridge', u'Describe your parcel. Meet its twin.',
             u'The knowledge bridge, Japan &times; Tunisia',
             u'Tell Gaia about your land the way you would tell a neighbour. It answers with a technique that already works &mdash; somewhere &mdash; and shows you where the two traditions meet.',
             't-sakura')
     + MATCHER + CONNECTIONS + next_chapter('bridge'), 'bridge')

# =================================================================== ENGINE

ENGINE = re.search(r'<section>\s*<div class="wrap">\s*<div class="engine">.*?</section>',
                   read('ai.html'), re.S).group(0)

page('ai.html', u'Chapter six: The engine &mdash; Gaia',
     u'The Gaia engine checks whether a Japanese practice survives the journey to a Tunisian parcel, and shows its reasoning.',
     chapter('ai', u'It does not copy. It checks.',
             u'The Gaia engine',
             u'A technique that works on a Japanese terrace may fail on a Tunisian slope for reasons that have nothing to do with the technique. The engine&rsquo;s job is to say which, and why.',
             't-engine')
     + ENGINE + next_chapter('ai'), 'ai',
     extra=u'<script src="engine.js"></script>\n')

# ================================================================ COMMUNITY

page('community.html', u'Chapter seven: Community &mdash; Gaia',
     u'Tunisian and Japanese farmers answering each other through Gaia.',
     chapter('community', u'A letter from a field you will never visit.',
             u'<span lang="ja">&#32257;</span> &mdash; en, the ties that bring people together',
             u'Every recommendation Gaia makes came from someone&rsquo;s experience. Farmers on both sides answer each other, each in their own language.')
     + COMMUNITY + next_chapter('community'), 'community')

# ================================================================== PILLARS

PILLARS = u'''<section class="chapter">
  <span class="chapter-wash" aria-hidden="true"></span>
  <div class="wrap chapter-grid">
    <div class="chapter-mark" aria-hidden="true">
      <p class="ch-num" lang="ja">&#38291;</p>
      <p class="ch-kanji" lang="ja">&#19977;</p>
    </div>
    <div>
      <p class="crumbs"><a href="index.html">Gaia</a> &nbsp;/&nbsp; At a glance</p>
      <p class="eyebrow">Interlude &nbsp;&middot;&nbsp; <span lang="ja">&#38291;</span> ma, the pause between</p>
      <h1>Water. Energy. Agriculture.</h1>
      <p class="kicker">The three pillars, on one page.</p>
      <p class="lede">Three challenges both countries face, approached from both sides. Each pillar pairs a Japanese practice with its Tunisian counterpart, then asks what survives the transfer.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="challenges" style="margin-top:0">
      <a class="challenge reveal" href="water.html">
        <span class="big" lang="ja" aria-hidden="true">&#27700;</span>
        <h3>01 &mdash; Water</h3>
        <dl><div><dt class="jpn">Modules</dt><dd>Smart irrigation, rainwater intelligence, water sharing, technique matching.</dd></div></dl>
        <span class="more">Chapter &#20108; &rarr;</span>
      </a>
      <a class="challenge reveal" href="energy.html">
        <span class="big" lang="ja" aria-hidden="true">&#38525;</span>
        <h3>02 &mdash; Energy</h3>
        <dl><div><dt class="jpn">Modules</dt><dd>Solar farming, smart pumping, energy prediction, solar-sharing advisor.</dd></div></dl>
        <span class="more">Chapter &#19977; &rarr;</span>
      </a>
      <a class="challenge reveal" href="agriculture.html">
        <span class="big" lang="ja" aria-hidden="true">&#22303;</span>
        <h3>03 &mdash; Agriculture</h3>
        <dl><div><dt class="jpn">Modules</dt><dd>Disease detection, crop and soil intelligence, kaizen, mottainai, satoyama, knowledge bridge.</dd></div></dl>
        <span class="more">Chapter &#22235; &rarr;</span>
      </a>
    </div>
    ''' + LEGEND + u'''
  </div>
</section>
'''

page('pillars.html', u'The pillars at a glance &mdash; Gaia',
     u'Water, energy and agriculture: the three pillars of Gaia on one page.',
     PILLARS + next_chapter('story').replace('Previous: Prologue', 'Back to the prologue'))

# ======================================== keep login + workspace in step

for path in ('login.html',):
    if not os.path.exists(path):
        continue
    html = read(path)
    if '<!--nav-->' in html:
        html = re.sub(r'<!--nav-->.*?<!--/nav-->', lambda m: nav(), html, flags=re.S)
    else:
        html = re.sub(r'<nav aria-label="Main">.*?</nav>', lambda m: nav(), html, count=1, flags=re.S)
    html = html.replace(FONTS_OLD, FONTS) if 'FONTS_OLD' in globals() else html
    if 'Noto+Serif+JP' not in html:
        html = re.sub(r'href="https://fonts\.googleapis\.com/css2\?[^"]+"', 'href="%s"' % FONTS, html, count=1)
    if 'class="hanko"' not in html and 'class="brand"' in html:
        html = html.replace('<span class="brand-word"',
                            '<span class="hanko" aria-hidden="true">&#32070;</span>\n      <span class="brand-word"', 1)
    if 'js/story-i18n.js' not in html:
        html = html.replace('<script src="app.js"></script>',
                            '<script src="js/story-i18n.js"></script>\n<script src="app.js"></script>', 1)
    io.open(path, 'w', encoding='utf-8').write(html)
    print('patched', path)

print('done')
