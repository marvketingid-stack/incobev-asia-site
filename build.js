/* Static assembler — stitches shared partials into each page and copies assets.
 * This is the "shared partials" layer required by Phase 1: the 6 pages no
 * longer each carry their own copy of the <head>, header/nav, or footer.
 *
 * Usage: node build.js   (run before the Tailwind CLI, which scans ./dist)
 */
const fs = require('fs');
const path = require('path');

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
  'contact-us.html': {
    active: 'contact',
    title: 'Contact Us — IncoBev Asia',
    desc: 'Connect with IncoBev Asia. Regional headquarters at 402 North Bridge Road, Singapore. Email hello@incobev.asia.',
  },
};

const NAV_KEYS = ['home', 'about', 'brands', 'solutions', 'sustainability', 'contact'];

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
  const body = read(bodyPath);
  fs.writeFileSync(path.join(DIST, fileName), assemble(fileName, meta, body));
  count++;
  console.log('  ✓', fileName);
}

// Copy JS
copyDir(path.join(SRC, 'js'), path.join(DIST, 'assets', 'js'));
// Copy images / logos / certs
const assetsSrc = path.join(ROOT, 'assets');
if (fs.existsSync(assetsSrc)) copyDir(assetsSrc, path.join(DIST, 'assets'));

console.log(`\nAssembled ${count} pages -> dist/`);
