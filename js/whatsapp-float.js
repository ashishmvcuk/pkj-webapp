/**
 * Fixed WhatsApp button — uses inline styles so it works even when Tailwind
 * does not scan this file for class names.
 */
(function () {
  "use strict";

  var WHATSAPP_DIGITS = "919302204320";
  var WHATSAPP_MESSAGE =
    "Hi Pankaj Electronics! I visited your website. How can you help me?";

  if (document.getElementById("whatsapp-float-btn")) return;

  var a = document.createElement("a");
  a.id = "whatsapp-float-btn";
  a.href =
    "https://wa.me/" +
    WHATSAPP_DIGITS +
    "?text=" +
    encodeURIComponent(WHATSAPP_MESSAGE);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", "Chat on WhatsApp — we are here to help");
  a.title = "Message us on WhatsApp";

  a.style.cssText = [
    "position:fixed",
    "bottom:max(1.25rem,env(safe-area-inset-bottom,0px))",
    "right:max(1.25rem,env(safe-area-inset-right,0px))",
    "z-index:9999",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "width:3.5rem",
    "height:3.5rem",
    "border-radius:9999px",
    "background-color:#25D366",
    "color:#fff",
    "box-shadow:0 10px 25px rgba(5,80,40,0.35)",
    "text-decoration:none",
    "transition:transform 0.15s ease,filter 0.15s ease",
  ].join(";");

  a.addEventListener("mouseenter", function () {
    a.style.transform = "scale(1.06)";
    a.style.filter = "brightness(1.05)";
  });
  a.addEventListener("mouseleave", function () {
    a.style.transform = "";
    a.style.filter = "";
  });
  a.addEventListener("focus", function () {
    a.style.outline = "2px solid #0071BC";
    a.style.outlineOffset = "3px";
  });
  a.addEventListener("blur", function () {
    a.style.outline = "";
    a.style.outlineOffset = "";
  });

  a.innerHTML =
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="display:block">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    "</svg>";

  function mount() {
    document.body.appendChild(a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
