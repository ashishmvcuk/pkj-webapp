/**
 * Horizontal footer ticker: trust line + Google review snippets from js/reviews-data.json.
 * Run `npm run fetch-reviews` with GOOGLE_MAPS_API_KEY to populate `reviews`.
 */
(function () {
  "use strict";

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function truncate(s, max) {
    if (!s) return "";
    s = String(s).trim();
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trim() + "…";
  }

  function buildSegments(data) {
    var t = data.trust || {};
    var segs = [];

    if (t.tagline) {
      segs.push(t.tagline);
    }
    if (t.instagramFollowers) {
      segs.push(t.instagramFollowers + " followers on Instagram");
    }
    if (t.reviewsHeadline) {
      segs.push(
        t.reviewsHeadline + (t.reviewsSubline ? " " + t.reviewsSubline : "")
      );
    }

    (data.reviews || []).forEach(function (r) {
      if (!r.text) return;
      var quote = truncate(r.text, 130);
      var by = r.author || "Google reviewer";
      segs.push("★ " + quote + " — " + by);
    });

    (data.marqueeExtras || []).forEach(function (x) {
      if (x) segs.push(String(x));
    });

    if (!segs.length) {
      segs.push("Pankaj Electronics — Bhopal");
    }
    return segs;
  }

  function pill(text) {
    return el(
      "span",
      "inline-flex max-w-[min(100vw-2rem,36rem)] shrink-0 items-center rounded-full border border-slate-600/90 bg-slate-900 px-4 py-2 text-sm font-medium leading-snug text-slate-200",
      text
    );
  }

  function buildGroup(texts) {
    var g = el("div", "flex shrink-0 items-center gap-8");
    texts.forEach(function (txt) {
      g.appendChild(pill(txt));
    });
    return g;
  }

  function run() {
    var mount = document.getElementById("footer-marquee-mount");
    if (!mount) return;

    var script = document.querySelector('script[src$="footer-marquee.js"]');
    var base = script ? script.src.replace(/footer-marquee\.js.*$/, "") : "";
    var url = base + "reviews-data.json";

    fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("reviews-data load failed");
        return res.json();
      })
      .then(function (data) {
        var texts = buildSegments(data);
        var track = el("div", "footer-marquee-track");
        track.appendChild(buildGroup(texts));
        var g2 = buildGroup(texts);
        g2.setAttribute("aria-hidden", "true");
        track.appendChild(g2);

        mount.innerHTML = "";
        var viewport = el("div", "overflow-hidden py-3");
        viewport.appendChild(track);
        mount.appendChild(viewport);
      })
      .catch(function () {
        mount.innerHTML =
          '<div class="overflow-hidden py-3 text-center text-sm text-slate-500">Trusted in Bhopal · Easy EMI · Sarafa Chowk, Peer Gate</div>';
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
