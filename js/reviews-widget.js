/**
 * Loads js/reviews-data.json (same directory as this script) and renders summary + review cards.
 * Run `npm run fetch-reviews` with GOOGLE_MAPS_API_KEY to refresh review snippets (Places API, max 5).
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function starsRow(rating) {
    var pct = Math.min(100, Math.max(0, (rating / 5) * 100));
    var wrap = el("div", "relative inline-block text-3xl leading-none text-amber-500");
    wrap.setAttribute("aria-label", String(rating) + " out of 5 stars");
    var bg = el("span", "select-none opacity-25");
    bg.textContent = "★★★★★";
    var fg = el(
      "span",
      "absolute left-0 top-0 overflow-hidden whitespace-nowrap select-none"
    );
    fg.style.width = pct + "%";
    fg.textContent = "★★★★★";
    wrap.appendChild(bg);
    wrap.appendChild(fg);
    return wrap;
  }

  function renderReviewCard(r) {
    var card = el(
      "article",
      "rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm"
    );
    var head = el("div", "mb-2 flex flex-wrap items-center justify-between gap-2");
    var author = el("p", "font-semibold text-slate-900", r.author || "Google user");
    head.appendChild(author);
    if (typeof r.rating === "number") {
      var sr = el("div", "text-sm font-medium text-amber-600");
      sr.textContent = String(r.rating) + " / 5";
      head.appendChild(sr);
    }
    card.appendChild(head);
    if (r.relativeTime) {
      card.appendChild(el("p", "mb-2 text-xs text-slate-500", r.relativeTime));
    }
    if (r.text) {
      var p = el("p", "text-sm leading-relaxed text-slate-700");
      p.textContent = r.text;
      card.appendChild(p);
    }
    return card;
  }

  function run() {
    var root = document.getElementById("reviews-root");
    if (!root) return;

    var script = document.querySelector('script[src$="reviews-widget.js"]');
    var base = script ? script.src.replace(/reviews-widget\.js.*$/, "") : "";
    var url = base + "reviews-data.json";

    fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("reviews-data load failed");
        return res.json();
      })
      .then(function (data) {
        root.innerHTML = "";

        var agg = data.aggregateRating || {};
        var rv = agg.ratingValue;
        var rc = agg.reviewCount;

        var summary = el("div", "mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm");
        var row = el("div", "flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8");
        var score = el("div", "text-center");
        score.appendChild(el("p", "text-4xl font-bold text-amber-600", String(rv)));
        score.appendChild(el("p", "text-sm text-slate-600", "out of 5"));
        row.appendChild(score);
        var mid = el("div", "text-center");
        mid.appendChild(starsRow(rv));
        mid.appendChild(
          el(
            "p",
            "mt-2 text-lg font-semibold text-slate-900",
            String(rc) + " reviews"
          )
        );
        mid.appendChild(el("p", "text-sm text-slate-600", "Google Maps"));
        row.appendChild(mid);
        summary.appendChild(row);

        var disc = el("div", "mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500");
        disc.appendChild(el("p", "mb-1", data.disclaimerEn || ""));
        disc.appendChild(el("p", "font-medium text-slate-600", data.disclaimerHi || ""));
        summary.appendChild(disc);
        root.appendChild(summary);

        var list = data.reviews;
        if (list && list.length) {
          var h3 = el(
            "h3",
            "mb-4 text-lg font-bold text-slate-900",
            "Recent reviews (sample)"
          );
          root.appendChild(h3);
          var grid = el("div", "grid gap-4 md:grid-cols-2");
          list.forEach(function (r) {
            grid.appendChild(renderReviewCard(r));
          });
          root.appendChild(grid);

          var attr = el(
            "p",
            "mt-6 text-center text-xs text-slate-500",
            data.attributionEn || ""
          );
          root.appendChild(attr);
        } else {
          root.appendChild(
            el(
              "p",
              "mb-6 text-center text-slate-600",
              "Open Google Maps to read all customer reviews."
            )
          );
        }

        var mapsUrl = data.googleMapsUrl;
        if (mapsUrl) {
          var a = el(
            "a",
            "inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          );
          a.href = mapsUrl;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = "सभी समीक्षाएँ Google पर";
          var wrap = el("div", "text-center");
          wrap.appendChild(a);
          root.appendChild(wrap);
        }
      })
      .catch(function () {
        root.innerHTML =
          '<p class="text-center text-slate-600">Could not load review data. <a class="font-semibold text-brand-blue underline" href="https://www.google.com/maps/search/?api=1&query=Shop+36+Pankaj+Electronics+Bhopal+462001">View on Google Maps</a></p>';
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
