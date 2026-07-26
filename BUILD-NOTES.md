# BUILD-NOTES — IncoBev Asia Phase 1 Rebuild

Reference build for the manual WordPress (Elementor Free) port. All body copy, brand names,
stats, and contact details come from the corporate-profile PDF; structure/spacing come from the
hardcode source + Design-Build-Spec. This file flags everything a human should review before the
port, per the three required categories.

---

## A. Content gaps — where the corporate profile PDF didn't cover something the hardcode needed

> These used a clearly-labeled placeholder or a documented substitution rather than reusing the
> old fictional mockup copy. **Needs client input** where marked.

1. **Leadership / executive roster — NO SOURCE FOUND → needs client input.**
   The source About page had a "Leadership Team" section with three fictional people (David Chen,
   Dr. Sarah Lim, Marcus Tan) plus photos and quotes. The PDF contains **no** leadership names,
   titles, bios, or headshots. That section was rebuilt as **"Centralised Management"** — the five
   real functional teams from the profile (Supply Chain, Technical, Customer Success, Commercial,
   Marketing, p.32) — with one card explicitly stating *"Leadership Team profiles to be provided by
   the client."* No fictional names or photos were carried over.

2. **Main phone number — NO SOURCE FOUND → needs client input.**
   The profile gives the address, `hello@incobev.asia`, and `www.incobev.asia`, but **no phone
   number**. The source's placeholder numbers (`+65 6XXX XXXX`, `+65 6789 0000`) were **removed**,
   not reused. Footer/contact show email + address + website only.

3. **Social media handles — NO SOURCE FOUND → needs client input.**
   No LinkedIn/social URLs in the profile. Footer social icons link to `#` (the Website and Email
   icons are real). Wire real URLs when available.

4. **Street addresses for Malaysia / Thailand / Indonesia — partial → needs client input.**
   Only the **Singapore HQ** full address is real: *402, North Bridge Road, #03-00, Singapore
   177822*. The profile gives only city-level for the rest (Kuala Lumpur, Penang, Bangkok, Jakarta,
   Bali). The Contact page regional cards therefore show city-level detail for those three.

5. **Per-brand descriptor sentences — general brand facts, not from the PDF → confirm wording.**
   The profile lists the brands (as logos, p.13–14) but gives no one-line descriptor per brand. The
   short descriptors on Our Brands (e.g. "Swiss fully-automatic coffee systems," "Italian espresso
   heritage") are widely-known, public facts about each manufacturer — **not** invented marketing
   and **not** from the mockup. Please confirm accuracy/wording and territory rights.

6. **IncoBev Asia master logo — NO SOURCE FOUND → needs client input.** (also an image gap, see B1)

### Fictional mockup content that was removed (not reused as if real)
All of the following from the source were treated as placeholder and dropped: *Botanica Spark,
Ancestral Brews, Vigor Root* (fake product brands); *David Chen, Dr. Sarah Lim, Marcus Tan* (fake
people); and every fabricated stat — *40% waste reduction, 45% energy reduction, 94% recycled
water, 68% solar, 0% waste to landfill, 12M/1.2M trees planted, 20+ years, 500+ partnerships, 12
markets, "founded 2005," "Root for Asia," EV-fleet claims.* They were replaced with **real figures
from the profile**: 40M cups/yr in 20+ countries, 1,500+ machines deployed, 8 technical centres, 6
showrooms, 60+ years (since 1963), founded 1994; and real ESG figures — EcoVadis Bronze (top 35%
globally), 1,000-tree 2026 target, 3,050 consumers engaged, 753.5 training hours, 47.8% female
workforce, 50% female in management.

### Structural adaptations (section order/layout preserved, content re-mapped)
- **Home hero** was sustainability-themed in the source ("Building a Sustainable Future"). Section
  order/layout is preserved, but content is re-populated to the real company positioning
  ("Redefining Asia's Beverage Experience"). The later Home sections (metrics, certifications,
  net-zero roadmap, climate banner) are kept and populated with the company's **real** ESG content.
- **Home "Sustainability Pillars" (3 bento cards)** → repurposed to **"Our Expertise & Excellence"**
  (Technical Capabilities / Beverage Expertise / Regional Infrastructure, profile p.15–17), keeping
  the 3-card layout.
- **Sustainability page pillars**: the source had 4 bento tiles; the real model is **5 pillars**
  (Responsible Sourcing, Responsible Operations, Circular Resource Management, People &
  Communities, Shared Value Creation), so the bento was extended to 5 tiles using the same card
  pattern.
- **About timeline**: source had 4 generic (fake) nodes. The real history spans ~16 milestones
  (1963–2026); these were condensed into **4 era groupings** to fit the 4-node layout — Origins
  (1963–1991), Group Foundation (1994–2012), Premium Expansion (2017–2022), IncoBev Asia
  (2024–2026).

---

## B. Images — what was sourced locally vs. placeholder

All external `lh3.googleusercontent.com` placeholders were removed. Images were optimized locally
with Pillow (`process_images.py`): photos → max-1600px progressive JPEG; logos → max-420px PNG.

**Real assets used** (from `Assets/` and `Logo asset/`): coffee/latte photography, Schaerer/C8
equipment shots, hospitality & foodservice interiors, coffee-shop and sustainability photography;
20 real brand logos (Franke, Schaerer, La Marzocco, Sanremo, La San Marco, Reneka, Bravilor,
Fiorenzato, Zummo, Hario, Cafetto, Suzuki, Kaffa Kaldi, Robert Timms, Goodman, Tea Forté, Gifel
Tea, Metz Tea, Mist Valley, Oatbedient); real certification marks (ISO 14001, bizSAFE Level 3,
EcoVadis, Champion of Good, Halal — the Halal `.avif` was converted to PNG).

**Placeholders used (flag for client):**

1. **IncoBev Asia master logo — NOT PROVIDED.** `Logo asset/` and `Assets/` contain only
   sub-brand logos (plus a `LINK_logo.pdf`). The header and footer use a **text logotype**
   ("IncoBev Asia") with a coffee icon. → **Supply the real IncoBev Asia logo** (SVG/PNG) to drop
   into `src/partials/header.html` and `footer.html`.

2. **Southeast Asia map — NOT PROVIDED.** No map asset exists. A **neutral abstract SVG
   placeholder** (`assets/images/sea-map-placeholder.svg`) was created — explicitly labeled
   *"illustrative placeholder"* and geographically approximate. Used on Home (Regional Footprint)
   and Contact (Regional Presence). → Replace with a real/branded map when available.

3. **Leadership portraits — NOT PROVIDED.** No portrait placeholders were used; the section was
   reworked instead (see A1).

**Available but unused** (can be swapped in during the WP build): product videos (`.mp4`), the
large `.tif` originals, additional Franke Mytico interior shots, and several sub-brand logos that
had no featured slot (e.g. KaffaMix, KaffaPro, Twinkle, Zero Hero, StirUp, II Doge Syrups, Cafeva).

---

## C. Spacing / typography decisions not fully specified

1. **Section padding** standardized to **120 / 80 / 64px** (desktop / tablet / mobile) everywhere
   via the `.section` class, superseding the source's inconsistent 100px/120px mix (Spec §7).

2. **Type scale** implemented as **fixed per-breakpoint steps** (not `clamp()`), per Spec §7. The
   Tailwind `fontSize` tokens (Spec §1–5) carry the desktop size; `src/css/input.css` steps the
   font-size down at tablet (`max-width:1023px`) and mobile (`max-width:767px`). Verified in-browser:
   display-lg 56→40→32, headline-xl 40→32→28, headline-lg 32→28→24, headline-md 24→24→20, body-lg
   18→18→16. **body-md stays 16px** and **label-sm stays 14px** at all widths (spec floors).

3. **Grid gutter** — Spec §7 gives mobile as "16–20px"; chose **20px** (`gap-5 md:gap-6 lg:gap-8`)
   for the responsive `.grid-gutter` used on the brand-logo grids. Feature/content grids that the
   source built at a fixed 32px gutter were kept at `gap-8` for visual parity.

4. **Border radius** — kept the source's large arbitrary radii for parity: `rounded-[2rem]` (32px)
   for hero/feature imagery and expertise cards, `rounded-[40px]` for the dark CTA banners,
   `rounded-2xl/3xl` for standard cards. Base radius tokens (4/8/12px, full) match Spec §4.

5. **Nav** — height 80px, shrinking to 64px on scroll (`main.js`), replicating the source behavior.
   The **mobile drawer is new work** (the source had none): hamburger < `lg`, slide-in drawer with
   dimmed overlay, Esc-to-close, scroll-lock, and auto-close on resize to desktop.

6. **Scroll-reveal** is progressive enhancement only: elements already in view render immediately,
   an IntersectionObserver reveals the rest on scroll, and a 2.5s failsafe (plus a no-JS fallback)
   guarantees content is **never** left hidden.

7. **Dark mode** — `darkMode: 'class'` is retained in the config, but the design is light-only, so
   per-page `dark:` utility clutter from the source was dropped. The inverse-surface tokens still
   power the dark footer and CTA sections. No dark-mode toggle was built (out of scope).

---

## D. Contact form status

The fake `setTimeout` "success" was removed. The form (`src/js/contact.js`) ships **not connected**
(`data-configured="false"`) and, on submit, shows an honest notice + a `mailto:hello@incobev.asia`
fallback — it never claims a message was sent. To activate: set the form's `data-endpoint` to a real
POST URL (Formspree / Fluent Forms / custom REST handler) and `data-configured="true"`. The PRD's
open question — *"what's the real form destination?"* — must be answered first.
