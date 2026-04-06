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

On every push to **`main`**, [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs `npm ci`, `npm run build`, then pushes the built folder to the **`gh-pages`** branch (via [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)).

**One-time repo settings**

1. GitHub repo → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. **Branch:** `gh-pages`, **folder:** `/ (root)` → Save

After the first successful workflow run, the site URL is shown on that same **Pages** page, typically `https://<username>.github.io/<repo>/`.

If your default branch is not `main`, edit the `on.push.branches` list in the workflow file.

**GitHub project URL quirk:** Opening `…/pkj-webapp` *without* a trailing slash used to make the browser resolve `assets/…` and `js/…` against the site root (`github.io/assets/…`) instead of under the repo, so CSS/JS 404 and the page looked blank. Each HTML page now sets a `<base href>` from the current path so assets load under `/pkj-webapp/` either way.

**Deploy fails (token / environment):**

1. Repo **Settings → Actions → General** → scroll to **Workflow permissions** → choose **Read and write permissions** → Save. (If this stays “Read repository contents”, the job cannot push to `gh-pages`.)
2. **Pages** should use **Deploy from a branch → `gh-pages` / (root)** — not the separate “GitHub Actions” source that uses the `github-pages` environment (that flow often 404s until fully enabled).
3. Push the latest [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) from this repo so the workflow only pushes the `gh-pages` branch (no `deploy-pages` / `github-pages` environment).

## Images

- **Hero:** [`images/hero-banner.png`](images/hero-banner.png) (your shop creative).
- **Category tiles:** [`images/categories/`](images/categories/) — stock photos ([Unsplash](https://unsplash.com/license)), saved in-repo for fast loads. See [`images/categories/ATTRIBUTION.md`](images/categories/ATTRIBUTION.md).

**Why not “images from Google”?** Google Image Search results are almost always copyrighted; hotlinking or copying them without permission is risky. For **your real shop photos**, upload them to [Google Business Profile](https://business.google.com/) and optionally pull them with the [Places API (Place Photos)](https://developers.google.com/maps/documentation/places/web-service/place-photos) at build time, or drop files into `images/` and link them in HTML.

## Content

- **Phone:** +91 93930 55583 (update in HTML if it changes.)
- **Hero image:** [`images/hero-banner.png`](images/hero-banner.png)
- **Instagram:** [pankaj_electronics_bpl](https://www.instagram.com/pankaj_electronics_bpl/)

## Google reviews

- **On the page:** Summary **4.6★ · 267 reviews** plus Google’s disclaimer (*Reviews aren’t verified by Google.* / Hindi) comes from [`js/reviews-data.json`](js/reviews-data.json), rendered by [`js/reviews-widget.js`](js/reviews-widget.js).
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
