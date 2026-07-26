# IncoBev Asia — Phase 1 Static Reference Build

A clean, pixel-accurate hardcoded HTML/CSS/JS build of the 6-page IncoBev Asia site,
intended as the reference for a later **manual** WordPress (Elementor Free) port.
This is **not** a WordPress theme — no PHP or theme scaffolding is included, by design.

## What's here

```
incobev-site/
├── src/
│   ├── partials/        head.html · header.html (with mobile drawer) · footer.html  ← single source
│   ├── pages/           index · about-us · our-brands · solutions · sustainability · contact-us
│   ├── css/input.css    Tailwind entry + responsive type/section layers (Spec §7)
│   └── js/              main.js (mobile nav, sticky-shrink, scroll reveal) · contact.js
├── assets/              images/ · logos/ · certs/   (optimized local media)
├── tailwind.config.js   single design-token source (Spec §1–5)
├── build.js             assembles partials → dist/ (+ copies assets & js)
├── serve.js             minimal static preview server
├── process_images.py    image optimization used to generate assets/ (Pillow)
├── BUILD-NOTES.md       content gaps, image placeholders, and spacing/type decisions
└── dist/                ← generated output (open this in a browser)
```

## Build & preview

```bash
npm install
npm run build      # assemble partials + compile purged Tailwind CSS
npm run serve      # preview at http://localhost:8123
```

- `npm run assemble` — only re-stitch partials into `dist/`
- `npm run css` — only recompile `dist/assets/style.css`
- `npm run dev` — assemble once, then watch/rebuild CSS on change

## Key fixes vs. the original source

1. **No Tailwind CDN** — compiled, purged production CSS (~44 KB) via Tailwind CLI.
2. **One config** — all tokens live in `tailwind.config.js` (was duplicated in all 6 files).
3. **Working mobile nav** — real hamburger + slide-in drawer with overlay (source had none).
4. **Shared partials** — head/header/footer are single-sourced and assembled by `build.js`.
5. **Honest contact form** — no fake `setTimeout` success; shows a clearly-labeled
   "not connected" state until a real endpoint is wired (see `src/js/contact.js`).
6. **Local images** — all Google-hosted placeholders replaced with optimized local assets
   (neutral placeholders where no real asset exists — see BUILD-NOTES.md).
7. **Spec §7 responsive values** — 3-step type scale + 120/80/64 section padding.

See `BUILD-NOTES.md` for content gaps and decisions the client should review.
