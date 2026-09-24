/* Static assembler — stitches shared partials into each page and copies assets.
 * This is the "shared partials" layer required by Phase 1: the 6 pages no
 * longer each carry their own copy of the <head>, header/nav, or footer.
 *
 * Usage: node build.js   (run before the Tailwind CLI, which scans ./dist)
 */
const fs = require('fs');
const path = require('path');
const highlights = require('./src/data/highlights.js');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const read = (p) => fs.readFileSync(p, 'utf8');

const partials = {
  head: read(path.join(SRC, 'partials', 'head.html')),
  header: read(path.join(SRC, 'partials', 'header.html')),
  footer: read(path.join(SRC, 'partials', 'footer.html')),
};

// Per-page metadata + active nav key.
const PAGES = {
  'index.html': {
    active: 'home',
    title: 'IncoBev Asia — Redefining Asia’s Beverage Experience',
    desc: 'IncoBev Asia (Integrated Company of Beverage Asia) is a leading integrated beverage solutions company across Singapore, Malaysia, Thailand and Indonesia.',
  },
  'about-us.html': {
    active: 'about',
    title: 'About Us — IncoBev Asia',
    desc: 'Founded in Singapore in 1994 and backed by six decades of regional heritage, IncoBev Asia is a diversified regional beverage solutions group.',
  },
  'our-brands.html': {
    active: 'brands',
    title: 'Our Brands — IncoBev Asia',
    desc: 'Powered by world-class brands — the equipment, coffee, tea and consumable brands distributed and manufactured by IncoBev Asia across Southeast Asia.',
  },
  'solutions.html': {
    active: 'solutions',
    title: 'Solutions — IncoBev Asia',
    desc: 'Integrated beverage solutions: equipment, consumables, manufacturing, technical expertise and customer success across hospitality, foodservice, workplace and retail.',
  },
  'sustainability.html': {
    active: 'sustainability',
    title: 'Sustainability — IncoBev Asia',
    desc: 'Our 5-pillar sustainability approach and Net-Zero 2030 roadmap — responsible sourcing, responsible operations, circular resource management, people & communities, and shared value creation.',
  },
  'company-highlights.html': {
    active: 'highlights',
    title: 'Company Highlights — IncoBev Asia',
    desc: 'Latest news and milestones from IncoBev Asia — industry events, partnerships, awards and achievements across Southeast Asia.',
  },
  'contact-us.html': {
    active: 'contact',
    title: 'Contact Us — IncoBev Asia',
    desc: 'Connect with IncoBev Asia. Regional headquarters at 402 North Bridge Road, Singapore. Email hello@incobev.asia.',
  },
};

const NAV_KEYS = ['home', 'about', 'brands', 'solutions', 'sustainability', 'highlights', 'contact'];

// Links inside the dark full-screen nav overlay.
const PANEL_BASE =
  'group flex items-center justify-between border-b border-white/10 py-4 text-headline-lg font-bold transition-colors ';
const PANEL_ACTIVE = PANEL_BASE + 'text-secondary-fixed';
const PANEL_INACTIVE = PANEL_BASE + 'text-surface-variant hover:text-surface-bright';

function buildHeader(activeKey) {
  let h = partials.header;
  NAV_KEYS.forEach((k) => {
    h = h.replaceAll(`{{PNAV_${k}}}`, k === activeKey ? PANEL_ACTIVE : PANEL_INACTIVE);
  });
  return h;
}

function assemble(fileName, meta, body) {
  const head = partials.head
    .replaceAll('{{TITLE}}', meta.title)
    .replaceAll('{{DESC}}', meta.desc);
  const header = buildHeader(meta.active);

  let out = body;
  out = out.replace('{{> head}}', head);
  out = out.replace('{{> header}}', header);
  out = out.replace('{{> footer}}', partials.footer);
  return out;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// --- Build ---
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

let count = 0;
for (const [fileName, meta] of Object.entries(PAGES)) {
  const bodyPath = path.join(SRC, 'pages', fileName);
  if (!fs.existsSync(bodyPath)) {
    console.warn('  ! missing page source:', fileName);
    continue;
  }
  let body = read(bodyPath);
  let out = assemble(fileName, meta, body);
  if (fileName === 'company-highlights.html') {
    out = out.replace('<!--HIGHLIGHTS_GRID-->', highlightsGrid());
  }
  fs.writeFileSync(path.join(DIST, fileName), out);
  count++;
  console.log('  ✓', fileName);
}

// Generate one detail page per highlight article.
for (const a of highlights) {
  const meta = {
    active: 'highlights',
    title: `${a.title} — IncoBev Asia`,
    desc: a.excerpt,
  };
  const out = assemble(`highlight-${a.slug}.html`, meta, detailBody(a));
  fs.writeFileSync(path.join(DIST, `highlight-${a.slug}.html`), out);
  console.log('  ✓ highlight-' + a.slug + '.html');
}

// --- Company Highlights: generate the article grid + one detail page each ---
// Content lives in src/data/highlights.js (self-serve; required at the top).
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCard(a, featured) {
  const href = `highlight-${a.slug}.html`;
  if (featured) {
    return `        <a href="${href}" class="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="relative aspect-[16/10] overflow-hidden"><img src="${a.image}" alt="${esc(a.title)}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div>
          <div class="flex flex-1 flex-col p-6 md:p-8">
            <div class="mb-3 flex items-center gap-3 text-label-sm"><span class="rounded-full bg-secondary-container px-3 py-1 font-bold uppercase tracking-wide text-on-secondary-container">${esc(a.category)}</span><span class="text-on-surface-variant">${esc(a.date)}</span></div>
            <h2 class="mb-3 text-headline-lg text-on-surface">${esc(a.title)}</h2>
            <p class="mb-5 text-body-md text-on-surface-variant">${esc(a.excerpt)}</p>
            <span class="mt-auto inline-flex items-center gap-1 font-bold text-primary">Read more <span class="material-symbols-outlined text-[20px] transition group-hover:translate-x-1">arrow_forward</span></span>
          </div>
        </a>`;
  }
  return `          <a href="${href}" class="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition-all hover:-translate-y-1 hover:shadow-lg sm:flex-row">
            <div class="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:w-40 md:w-48"><img src="${a.image}" alt="${esc(a.title)}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div>
            <div class="flex flex-1 flex-col p-5 md:p-6">
              <div class="mb-2 flex items-center gap-2 text-label-sm"><span class="rounded-full bg-secondary-container px-2.5 py-0.5 font-bold uppercase tracking-wide text-on-secondary-container">${esc(a.category)}</span><span class="text-on-surface-variant">${esc(a.date)}</span></div>
              <h3 class="mb-1.5 text-headline-md leading-tight text-on-surface">${esc(a.title)}</h3>
              <p class="text-body-md text-on-surface-variant">${esc(a.excerpt)}</p>
            </div>
          </a>`;
}

function highlightsGrid() {
  const [featured, ...rest] = highlights;
  const restCards = rest.map((a) => highlightCard(a, false)).join('\n');
  return `<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
${highlightCard(featured, true)}
        <div class="flex flex-col gap-6">
${restCards}
        </div>
      </div>`;
}

function detailBody(a) {
  const idx = highlights.indexOf(a);
  const more = highlights.filter((x, i) => i !== idx).slice(0, 3);
  const moreCards = more
    .map(
      (x) => `        <a href="highlight-${x.slug}.html" class="group overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition-all hover:-translate-y-1 hover:shadow-lg">
          <div class="relative aspect-[16/10] overflow-hidden"><img src="${x.image}" alt="${esc(x.title)}" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"></div>
          <div class="p-5"><div class="mb-2 text-label-sm font-bold uppercase tracking-wide text-primary">${esc(x.category)}</div><h3 class="text-headline-md leading-tight text-on-surface">${esc(x.title)}</h3></div>
        </a>`
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
{{> head}}
</head>
<body class="overflow-x-hidden bg-background text-on-surface">
{{> header}}
<main>
  <article class="section">
    <div class="container-page">
      <a href="company-highlights.html" class="mb-8 inline-flex items-center gap-1 text-label-sm font-bold text-primary"><span class="material-symbols-outlined text-[20px]">arrow_back</span> All Highlights</a>
      <div class="mx-auto max-w-3xl">
        <div class="mb-4 flex items-center gap-3 text-label-sm"><span class="rounded-full bg-secondary-container px-3 py-1 font-bold uppercase tracking-wide text-on-secondary-container">${esc(a.category)}</span><span class="text-on-surface-variant">${esc(a.date)}</span></div>
        <h1 class="mb-8 text-display-lg leading-tight text-on-background">${esc(a.title)}</h1>
      </div>
      <div class="mx-auto mb-10 max-w-4xl overflow-hidden rounded-2xl"><img src="${a.image}" alt="${esc(a.title)}" class="w-full object-cover"></div>
      <div class="prose-incobev mx-auto max-w-3xl space-y-5 text-body-lg leading-relaxed text-on-surface-variant">${a.body}</div>
    </div>
  </article>
  <section class="section !pt-0">
    <div class="container-page">
      <h2 class="mb-8 text-headline-lg text-on-surface">More Highlights</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
${moreCards}
      </div>
    </div>
  </section>
</main>
{{> footer}}
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

// Copy JS
copyDir(path.join(SRC, 'js'), path.join(DIST, 'assets', 'js'));
// Copy images / logos / certs
const assetsSrc = path.join(ROOT, 'assets');
if (fs.existsSync(assetsSrc)) copyDir(assetsSrc, path.join(DIST, 'assets'));

// Copy Cloudflare Pages control files (must sit at the output root) if present.
for (const f of ['_headers', '_redirects']) {
  const s = path.join(ROOT, f);
  if (fs.existsSync(s)) fs.copyFileSync(s, path.join(DIST, f));
}

console.log(`\nAssembled ${count} pages -> dist/`);
