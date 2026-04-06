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
