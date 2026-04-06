(function () {
  "use strict";

  function initReveal() {
    var nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      panel.classList.toggle("hidden", !open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("overflow-hidden", open);
    }

    toggle.addEventListener("click", function () {
      var open = panel.classList.contains("hidden");
      setOpen(open);
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initYear() {
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initGalleryCarousel() {
    var root = document.querySelector("[data-gallery-carousel]");
    if (!root) return;

    var track = root.querySelector("[data-carousel-track]");
    var slides = root.querySelectorAll("[data-carousel-slide]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var announcer = root.querySelector("[data-carousel-announcer]");
    if (!track || !slides.length || !prevBtn || !nextBtn) return;

    var index = 0;
    var timer = null;
    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var intervalMs = 4500;

    function announce() {
      if (!announcer) return;
      announcer.textContent =
        "Slide " + String(index + 1) + " of " + String(slides.length);
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + String(index * 100) + "%)";
      if (dotsWrap) {
        dotsWrap.querySelectorAll("[data-carousel-dot]").forEach(function (dot, di) {
          var on = di === index;
          dot.setAttribute("aria-current", on ? "true" : "false");
          dot.classList.remove(
            "bg-brand-blue",
            "bg-slate-300",
            "h-2.5",
            "w-2.5",
            "h-2",
            "w-2",
            "hover:bg-slate-400"
          );
          if (on) {
            dot.classList.add("bg-brand-blue", "h-2.5", "w-2.5");
          } else {
            dot.classList.add("bg-slate-300", "h-2", "w-2", "hover:bg-slate-400");
          }
        });
      }
      announce();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function startAuto() {
      if (reduced || timer !== null) return;
      timer = window.setInterval(next, intervalMs);
    }

    function stopAuto() {
      if (timer === null) return;
      window.clearInterval(timer);
      timer = null;
    }

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("data-carousel-dot", "");
        dot.setAttribute("aria-label", "Show photo " + String(i + 1));
        dot.className =
          "rounded-full transition focus:outline-none focus:ring-2 focus:ring-brand-blue/40 " +
          (i === 0
            ? "h-2.5 w-2.5 bg-brand-blue"
            : "h-2 w-2 bg-slate-300 hover:bg-slate-400");
        dot.addEventListener("click", function () {
          stopAuto();
          goTo(i);
          startAuto();
        });
        dotsWrap.appendChild(dot);
      });
    }

    prevBtn.addEventListener("click", function () {
      stopAuto();
      prev();
      startAuto();
    });
    nextBtn.addEventListener("click", function () {
      stopAuto();
      next();
      startAuto();
    });

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", function (ev) {
      if (!root.contains(ev.relatedTarget)) startAuto();
    });

    goTo(0);
    startAuto();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAuto();
      else startAuto();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initReveal();
      initNav();
      initYear();
      initGalleryCarousel();
    });
  } else {
    initReveal();
    initNav();
    initYear();
    initGalleryCarousel();
  }
})();
