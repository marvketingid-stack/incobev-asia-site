# TinaCMS setup — Company Highlights editor

This gives the marketing team a dashboard at **`/admin`** to write, preview and
publish Company Highlights articles — no code. Articles are stored as Markdown in
`content/highlights/` and committed to GitHub; Cloudflare rebuilds on publish.

Everything in code is done (branch `feat/tinacms`). The steps below are the
account/connection parts that must be done in the dashboards.

## What's already wired
- Articles moved to `content/highlights/*.md` (one file per article).
- `build.js` reads those Markdown files (grid + detail pages generated as before).
- `tina/config.ts` defines the **Company Highlights** collection (title, category,
  date, summary, image, featured, body).
- `package.json` → `npm run build:cms` builds the admin **and** the site.

## One-time setup (dashboards)

### 1. Create a free Tina Cloud project
1. Go to **https://app.tina.io** and sign up (use the IncoBev / marketing account).
2. **Create a project** → connect it to the GitHub repo
   **`marvketingid-stack/incobev-asia-site`** (authorize the TinaCMS GitHub app).
3. Set the project branch to **`main`**.
4. From the project's **Overview / Tokens**, copy:
   - **Client ID**
   - **Read-only Token**

### 2. Invite the editors
In the Tina Cloud project → **Collaborators**, invite the marketing team by email.
They'll log in with those emails at `incobev.asia/admin` (no GitHub needed).

### 3. Add the keys to Cloudflare Pages
Cloudflare → Pages → `incobev-asia-site` → **Settings → Variables and Secrets**
(Production **and** Preview):

| Name | Type | Value |
|------|------|-------|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Plaintext | the Client ID from step 1 |
| `TINA_TOKEN` | **Secret** | the Read-only Token from step 1 |

### 4. Switch the build command
Cloudflare → Pages → `incobev-asia-site` → **Settings → Build** → change the
**Build command** from `npm run build` to **`npm run build:cms`**.
(Build output stays `dist`.)

### 5. Merge & deploy
Merge branch `feat/tinacms` into `main`. Cloudflare builds with Tina and the admin
goes live at **`https://incobev.asia/admin`**.

## How it works after setup
- Editor opens `incobev.asia/admin` → logs in (email) → edits/creates an article →
  **Save**. Tina commits the Markdown to GitHub → Cloudflare rebuilds → live in
  ~1–2 minutes.
- Images uploaded in the editor are committed to `assets/images/`.
- The article marked **Featured** shows as the large top card; the rest list by date
  (newest first).

## Notes
- Local dev (optional): `npm run tina:dev` runs the site + a local admin at
  `http://localhost:8123/admin` (no Tina Cloud needed for local testing).
- Free tier covers a small team; if editor count/usage grows, Tina Cloud has paid
  plans. Content always stays in your repo, so you're never locked in.
