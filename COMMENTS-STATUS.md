# Client Comments — Implementation Status

Tracks `ConsolidatedComments_IBAsia.md` (client review, 14 Aug). Site: https://incobev-asia.netlify.app/

## ✅ Done in this pass

| Comment | What was built |
|---|---|
| Top sticky menu redesign | Nav rebuilt to the WMF pattern: **centered logo**, inline category links removed, **"Partner With Us" button replaced with a hamburger** that opens a **dark full-screen overlay** listing the 6 pages. Applies site-wide (shared header partial). |
| Regional Footprint — split entries | The 3 grouped cards are now **6 individual location cards**: Singapore (HQ), Kuala Lumpur, Penang, Bangkok, Jakarta, Bali. |
| Regional Scale — count-up | Added **count-up animation** on the 4 stats (40M, 1,500+, 8, 60+), fired on scroll-in, respects reduced-motion. |
| Solutions — remove CTA | Deleted the "Ready to elevate your beverage programme?" dark CTA banner. |
| Move People & Communities | Removed the P&C stats block from **About Us**; the figures (47.8% female workforce, 50% female in management, 753.5 training hrs, 3,050 consumers) now live on the **Sustainability** impact section (Pillar 4 context). |

## ✅ Done in pass 2 (from annotated screenshots)

| Comment | What was built |
|---|---|
| Homepage footprint — **flag icons** | Neutral icons replaced with real **country flags** (SG / MY / TH / ID, MIT-licensed flag-icons, bundled locally) on the 6 location cards. |
| Our Brands **banner** | Rebuilt to the WMF pattern: **background image**, old "Interested in Our Brand Portfolio?" header removed, **"Partner with IncoBev Asia"** promoted to header, "Get in Touch" CTA. (Final bg image still TBC — using `people.jpg` placeholder.) |
| Sustainability **tabbed pillars** | The 5 Pillars are now an **interactive tabbed layout** (OCBC-style): clicking a pillar opens its detail panel with a visual + key points. (Final per-pillar imagery still TBC — using existing photography.) |

## ✅ Done in pass 3 (24 Aug comments + client-supplied assets)

| Comment | What was built |
|---|---|
| #4 Ecosystem section video | The two static images replaced with the **looping IncoBev wave-motif video** (client-supplied) — autoplay, muted, loop, with a poster frame. |
| #4 Certifications logos | Icon badges replaced with the **6 real certification logos** supplied by client: ISO 22000, FSSC 22000, ISO 14001, bizSAFE Level 3, EcoVadis, Champion of Good (Home + Sustainability). |
| #5 About Us — Heritage visual | Hero image swapped to the client-supplied **"Six Decades of Beverage Heritage"** banner. |
| #5 About Us — wave visual + rename | "Our Heritage" section image swapped to the client-supplied **wave-motif** image; section renamed **"Our Heritage" → "Our Evolution"**. |
| #8 Solutions — 4 segments | Icons/blurbs removed; all 4 cards now use the **uniform image-card treatment** (like Hotels & Resorts); **"Corporate Offices" → "Workspaces"**. *(Placeholder photos — final SharePoint images pending.)* |
| #9 Solutions — Core Capabilities | Icons removed; each card now has a **blended, semi-transparent background image**. *(Placeholder photos — final SharePoint images pending.)* |

## 🟡 Blocked / TBC — awaiting asset or decision (stubbed with inline `TODO` comments)

**Note:** the SharePoint download links in the comment doc require IncoFood login — I can't fetch them
here. Where the client dropped the actual files into the project folder (ecosystem video, cert logos,
About Us visuals) they are now used. The items below are still on SharePoint only, or need a decision:

| # | Item | Needs | Where stubbed |
|---|---|---|---|
| 1 | Hero background video | Actual video file (concept only given: rotating globe + flag/market). | `index.html` hero — TODO; static image kept. |
| 2 | Flag icons (hero + footprint) | Confirmed icon set + full city list. | `index.html` footprint — TODO; neutral icons kept. |
| 3 | "Replace visuals" | Final images for: Home ecosystem section, About Us hero, About Us heritage, Solutions segment cards. | current images kept in place. |
| 4 | Regional Scale background visual | A chosen stock image. | dark section kept as-is. |
| 5 | Certification logos | Official files for ISO 22000/FSSC 22000 & Rainforest Alliance (others already integrated). | `index.html` certs — TODO. |
| 6 | Sustainability Report 2025 PDF | The PDF file (for the gated download). | not built — see #7 note below. |
| 7 | Sustainability page redesign (5 Pillars → tabbed, OCBC-style) | **Client-flagged TBC** — final IA/content per tab + sign-off. | `sustainability.html` — TODO; inline bento kept. |
| 8 | About Us gap after P&C move | Direction on what replaces the removed block (or leave shorter). | `about-us.html` — TODO; page currently shorter. |
| 9 | Solutions "Add visual" (Core Capabilities) | What the visual should depict. | section kept text-only. |

## ⚠️ Needs clarification (not built — would require guessing)

- **Our Brands header change** (comment marked READY): *"remove the current header and promote the 'Partner with [Brand]' sub-header to be the main header."* Our current Our Brands page has no "Partner with [Brand]" sub-header — the comment appears to reference a different layout than what's built. **Please clarify** which header/section this refers to (or share the reference screenshot) before I change it. The related WMF "Let's talk about your coffee business" banner + background image is also blocked on the background image (comment #3/CTA).

## Gated Sustainability Report form (comment #6)
The form *logic* is marked READY but the actual PDF is missing. Rather than build a form that gates a
non-existent file (and risk a fake "download"), this is left for when the PDF is provided — same honesty
principle as the contact form. Flagged, not stubbed with fake success.
