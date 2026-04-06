# Pankaj Electronics — static site

Plain **HTML**, **Tailwind CSS** (built locally), and a small **`js/main.js`** (scroll reveal via `IntersectionObserver`, mobile nav). Animations are CSS transitions plus reveal on scroll; `prefers-reduced-motion` disables motion.

## Develop

```bash
npm install
npm run watch:css
```

Serve the folder with any static server (paths are relative), for example:

```bash
npx --yes serve .
```

Open the printed URL and use **`/index.html`** or the site root as served.

## Production build

```bash
npm run build
```

This writes minified CSS to [`assets/css/styles.css`](assets/css/styles.css). The GitHub Action rebuilds CSS on every deploy, so the committed `assets/css/styles.css` is optional but useful for local preview without running `npm run build`.

## Deploy (GitHub Pages)

Your live URL (project site) is:

**`https://ashishmvcuk.github.io/pkj-webapp/`**

If you see **“There isn’t a GitHub Pages site here”** (404), Pages is not enabled yet or the wrong branch/folder is selected. Use **one** of the methods below.

### Method A — Publish from `main` (simplest, no Action required)

1. Locally: `npm run build` so [`assets/css/styles.css`](assets/css/styles.css) is up to date.
2. Commit and push **everything** the site needs on **`main`**: `index.html`, `assets/`, `categories/`, `images/`, `js/`, and [`.nojekyll`](.nojekyll) (disables Jekyll so static files are served as-is).
3. On GitHub: open **[Settings → Pages](https://github.com/Ashishmvcuk/pkj-webapp/settings/pages)** for **`Ashishmvcuk/pkj-webapp`**.
4. **Build and deployment → Source:** **Deploy from a branch**.
5. **Branch:** **`main`**, **Folder:** **`/ (root)`** → **Save**.
6. Wait **1–3 minutes**, then open **`https://ashishmvcuk.github.io/pkj-webapp/`** again (hard refresh).

**Note:** For a **private** repo, GitHub Pages needs a **paid** plan. Use a **public** repo for free hosting.

### Method B — Publish from `gh-pages` (GitHub Action)

Use this if you prefer CI to build Tailwind and push a clean deploy branch.

1. **Settings → Actions → General → Workflow permissions:** set **Read and write permissions** → **Save**.
2. Push **`main`** so [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs ([JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)).
3. **Settings → Pages:** **Deploy from a branch** → **`gh-pages`** → **`/ (root)`** → **Save** (the `gh-pages` branch must exist after a green workflow run).

### Still 404?

- Confirm you’re in **Settings → Pages** for the repo **`Ashishmvcuk/pkj-webapp`**, not another fork or org.
- **Source** must not be **Disabled**.
- Repo name in the URL is **case-sensitive**: `/pkj-webapp/` must match the repo name exactly.

**GitHub Pages + CSS:** Each page runs a small inline script that sets `<base href>` for navigation and **injects** the stylesheet as `/<repo>/assets/css/styles.css` (repo = first URL path segment). That avoids the browser preload scanner requesting `assets/…` against the wrong path before `<base>` exists, which could make the site look unstyled on [https://ashishmvcuk.github.io/pkj-webapp/](https://ashishmvcuk.github.io/pkj-webapp/).

## Images

- **Hero:** The home page uses a **sharp CSS “flyer”** (no scaled-up bitmap blur). Your uploaded flyer is saved as [`images/hero-banner-original.png`](images/hero-banner-original.png) for reference; replace or edit the hero block in `index.html` if you add a high-res photo later.
- **Category tiles:** [`images/categories/`](images/categories/) — stock photos ([Unsplash](https://unsplash.com/license)), saved in-repo for fast loads. See [`images/categories/ATTRIBUTION.md`](images/categories/ATTRIBUTION.md).
- **Store gallery:** [`images/gallery/`](images/gallery/) — real showroom photos (PNG) used on the home page **Inside our store** section.

**Why not “images from Google”?** Google Image Search results are almost always copyrighted; hotlinking or copying them without permission is risky. For **your real shop photos**, upload them to [Google Business Profile](https://business.google.com/) and optionally pull them with the [Places API (Place Photos)](https://developers.google.com/maps/documentation/places/web-service/place-photos) at build time, or drop files into `images/` and link them in HTML.

## Content

- **Phone:** +91 93930 55583 (update in HTML if it changes.)
- **Instagram:** [pankaj_electronics_bpl](https://www.instagram.com/pankaj_electronics_bpl/)

## Google reviews

- **On the page:** Summary **4.6★ · 267 reviews** plus Google’s disclaimer (*Reviews aren’t verified by Google.*) comes from [`js/reviews-data.json`](js/reviews-data.json), rendered by [`js/reviews-widget.js`](js/reviews-widget.js).
- **Review snippets:** Google’s Places API returns at most **5** reviews per request. To refresh `reviews-data.json` (rating, count, URLs, snippets):

  ```bash
  export GOOGLE_MAPS_API_KEY="your_key"   # Places API enabled
  npm run fetch-reviews
  ```

  Without a key, the site still shows the aggregate summary and a button to open Google Maps.

## Files

| Path | Role |
|------|------|
| `index.html` | Home, services, partners, reviews block, contact, map, JSON-LD (`aggregateRating`) |
| `js/reviews-data.json` | Review summary + optional snippets (update via `fetch-reviews` or by hand) |
| `js/reviews-widget.js` | Loads JSON and renders summary, disclaimer, sample cards |
| `scripts/fetch-google-reviews.mjs` | Optional Places API fetch |
| `categories/*.html` | Category index + example product lists |
| `src/input.css` | Tailwind entry + skip-link + reveal utilities |
| `js/main.js` | Nav toggle, scroll reveal, footer year |
