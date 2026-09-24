# Company Highlights — How to publish an article (self-serve)

All Company Highlights articles are generated from **one file**:

```
src/data/highlights.js
```

Editing that file and re-deploying updates the listing page **and** creates each
article's own page automatically. No page needs to be hand-built.

---

## 1. Where the content lives
`src/data/highlights.js` is a list of articles. Each article is one block:

```js
{
  slug: 'incobev-asia-at-fha-2026',      // URL id — letters/numbers/hyphens, must be unique
  category: 'Events',                     // small tag on the card (Events, Awards, Partnerships, Community, Milestones, News…)
  date: '8 Apr 2026',                     // shown next to the tag
  title: 'IncoBev Asia at FHA 2026',
  excerpt: 'One or two lines shown on the card.',
  image: 'assets/images/group-product.jpg', // thumbnail (see step 3)
  body: '<p>First paragraph…</p><p>Second paragraph…</p>', // the article text
},
```

The **first article in the list is the big featured one** on the left. New
articles are normally added at the **top** so the newest is featured.

## 2. How to add a new article
1. Open `src/data/highlights.js`.
2. Copy an existing block and paste it at the **top** of the list.
3. Change `slug`, `category`, `date`, `title`, `excerpt`, `image`, and `body`.
4. Save.

## 3. How to add / change the thumbnail
1. Put the image file into `assets/images/` (JPG or PNG, ideally ~1200px wide).
2. Set `image:` to `'assets/images/your-file.jpg'`.

## 4. How to set the title / excerpt / content
- `title` — the headline.
- `excerpt` — the short summary on the card.
- `body` — the full article, written as simple HTML paragraphs:
  `'<p>Paragraph one.</p><p>Paragraph two.</p>'`

## 5. How to publish (deploy)
From the project folder:

```bash
npm run build
git add -A
git commit -m "Add highlight: <article title>"
git push
```

Cloudflare Pages rebuilds automatically on push, and the article goes live at
`highlight-<slug>.html` (e.g. `/highlight-incobev-asia-at-fha-2026`). It also
appears on the Company Highlights listing page and in "More Highlights" on other
articles.

> Tip: to **remove** an article, delete its block from `src/data/highlights.js`
> and redeploy. To **reorder / change which one is featured**, move blocks up or
> down (top = featured).
