/* ==========================================================================
   BUNT ELEGANCE — Certificate of Authenticity renderer (one shared template)
   Each private page a/<uuid>/index.html only carries its artwork data as JSON
   (<script type="application/json" id="cert-data">) — the layout lives here and in
   style.css (.cert-* / .cs-*), so every certificate is identical by construction.
   The certificate is two fixed A4-portrait pages; on screen it is scaled to fit,
   in print it is output 1:1, so "Print → Save as PDF" is the same on every device.
   ========================================================================== */
(function () {
  "use strict";
  var W = 793, H = 1122, GAP = 24; // A4 portrait at 96dpi; two pages
  var root = document.getElementById("cert-root");
  var raw = document.getElementById("cert-data");
  if (!root || !raw) return;
  var d;
  try { d = JSON.parse(raw.textContent); } catch (e) { return; }

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var title = function (s) { return String(s || "").replace(/\b([a-z])/g, function (m) { return m.toUpperCase(); }); };
  var row = function (k, v) { return "<div><dt>" + esc(k) + "</dt><dd>" + esc(v || "—") + "</dd></div>"; };
  var ICON = {
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  var base = "../../";
  var frame = title(d.frame) + (/frame/i.test(d.frame) ? "" : " Frame");
  var edition = d.edition === "Original" && !d.editionNote ? "Original" : [d.edition, d.editionNote].filter(Boolean).join(" — ");
  var dims = String(d.dimensions || "").replace(/inches/i, "Inches");
  var name = d.name.toUpperCase();
  var logo = function (h) { return '<img class="cs-logo" style="height:' + h + 'px" src="' + base + 'assets/img/logo/logo.svg" alt="BUNT ELEGANCE — Art that defines your space" width="' + h * 2 + '" height="' + h + '">'; };
  var photo = function (src, cls, alt) { return '<img class="' + cls + '" src="' + esc(base + src) + '" alt="' + esc(alt) + '" decoding="async">'; };
  var imgs = d.images || [];

  root.innerHTML =
    '<div class="cert-ui">' +
      '<h1 class="cert-ui__title">' + esc(d.name) + " <span>&middot; " + esc(d.archiveId) + "</span></h1>" +
      '<div class="cert-ui__actions"><button class="btn" type="button" id="cert-print">Print / Save as PDF</button></div>' +
      '<p class="cert-ui__hint">Choose “Save as PDF” in the print dialog. The certificate is two A4 pages and looks the same on every device.</p>' +
    "</div>" +
    '<div class="cert-stage"><div class="cert-sheets">' +
      /* ---- page 1 ---- */
      '<article class="cs-page" aria-label="Certificate of Authenticity — page 1">' +
        '<header class="cs-head">' + logo(118) + '<span class="cs-rule"></span><h2 class="cs-title">Certificate of Authenticity</h2><p class="cs-sub">A Bunt Elegance Original</p></header>' +
        '<section class="cs-main">' +
          (imgs[0] ? photo(imgs[0], "cs-hero", d.name + " — original artwork by BUNT ELEGANCE") : "") +
          '<dl class="cs-specs">' +
            row("Artwork Title", name) + row("Artwork ID", d.archiveId) + row("Edition", edition.toUpperCase()) +
            row("Year of Creation", d.year) + row("Artwork Type", d.type) + row("Medium Used", d.medium) +
            row("Artwork Dimensions", dims) + row("Frame Details", frame) +
          "</dl>" +
        "</section>" +
        '<section class="cs-thumbs">' + imgs.slice(1, 4).map(function (s, i) { return photo(s, "cs-thumb", d.name + " — view " + (i + 2)); }).join("") + "</section>" +
        '<p class="cs-tag">An original work. A distinctive expression. A lasting legacy.</p>' +
      "</article>" +
      /* ---- page 2 ---- */
      '<article class="cs-page" aria-label="Certificate of Authenticity — page 2">' +
        '<header class="cs-head cs-head--lg">' + logo(190) + '<span class="cs-rule"></span><h2 class="cs-title">Authenticity Statement</h2></header>' +
        '<section class="cs-statement">' +
          "<p>This certificate confirms that “" + esc(name) + "” is an authentic original artwork created and issued by BUNT ELEGANCE.</p>" +
          "<p>The artwork is an original textured abstract composition, created as part of the " + esc(d.name) + " Collection. Each artwork is individually documented by BUNT ELEGANCE with a unique Artwork ID and Certificate of Authenticity number.</p>" +
          "<p>This certificate accompanies the artwork as an official record of its authenticity and provenance at the time of issue.</p>" +
        "</section>" +
        '<section class="cs-sign">' +
          '<div><span class="cs-label">Artist</span><b>' + esc(d.artist) + "</b></div>" +
          '<div><span class="cs-label">Issued by</span><b>' + esc(d.issuedBy) + "</b></div>" +
          '<div><span class="cs-label">Certificate No.</span><b>' + esc(d.certNo) + "</b></div>" +
          '<div><span class="cs-label">Date of Issue</span><b>' + esc(d.issuedOn || "—") + "</b></div>" +
        "</section>" +
        '<footer class="cs-foot"><span>' + ICON.web + esc(d.contact.website) + "</span><span>" + ICON.phone + esc(d.contact.phone) + "</span><span>" + ICON.mail + esc(d.contact.email) + "</span></footer>" +
      "</article>" +
    "</div></div>";

  var stage = root.querySelector(".cert-stage"), sheet = root.querySelector(".cert-sheets");
  function fit() {
    var k = Math.min(1, stage.clientWidth / W);
    sheet.style.transform = "scale(" + k + ")";
    stage.style.height = Math.round((2 * H + GAP) * k) + "px";
  }
  stage.classList.add("is-scaled");
  fit();
  window.addEventListener("resize", fit);
  document.getElementById("cert-print").addEventListener("click", function () { window.print(); });
})();
