/* ==========================================================================
   BUNT ELEGANCE — Certificate of Authenticity renderer (one shared template)
   Each private page a/<uuid>/index.html only carries its artwork data as JSON
   (<script type="application/json" id="cert-data">) — the layout lives here and in
   style.css (.cert-* / .cs-*), so every certificate is identical by construction.
   The sheet is a fixed A4-landscape design; on screen it is scaled to fit,
   in print it is output 1:1, so "Print → Save as PDF" is the same on every device.
   ========================================================================== */
(function () {
  "use strict";
  var W = 1122, H = 793; // A4 landscape at 96dpi
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
  var lc = function (s) { return s ? s.charAt(0).toLowerCase() + s.slice(1) : ""; };
  var row = function (k, v) { return "<div><dt>" + esc(k) + "</dt><dd>" + esc(v || "—") + "</dd></div>"; };
  var ICON = {
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  var name = d.name.toUpperCase();
  var frame = d.frame && !/frame/i.test(d.frame) ? d.frame + " Frame" : d.frame;
  var edition = d.edition === "Original" && !d.editionNote ? "Original / 1 of 1" : [d.edition, d.editionNote].filter(Boolean).join(" — ");

  root.innerHTML =
    '<div class="cert-ui">' +
      '<h1 class="cert-ui__title">' + esc(d.name) + " <span>&middot; " + esc(d.archiveId) + "</span></h1>" +
      '<div class="cert-ui__actions"><button class="btn" type="button" id="cert-print">Print / Save as PDF</button></div>' +
      '<p class="cert-ui__hint">Choose “Save as PDF” in the print dialog. The certificate prints on one A4 landscape page and looks the same on every device.</p>' +
    "</div>" +
    '<div class="cert-stage"><article class="cert-sheet" aria-label="Certificate of Authenticity for ' + esc(d.name) + '"><div class="cs-frame">' +
      '<header class="cs-head"><img src="../../assets/img/logo/logo.svg" alt="BUNT ELEGANCE — Art that defines your space" width="260" height="130">' +
        '<h2 class="cs-title">Certificate of Authenticity</h2><p class="cs-sub"><span>A Bunt Elegance Original</span></p></header>' +
      '<section class="cs-body"><dl class="cs-specs">' +
        row("Artwork Name / Title", name) + row("Artwork Collection / Series", d.series) + row("Artwork ID / Archive Number", d.archiveId) +
        row("Edition", edition) + row("Year of Creation", d.year) + row("Artwork Type", d.type) +
        row("Medium / Materials Used", d.medium) + row("Artwork Dimensions", d.dimensions) + row("Frame Details", frame) +
      "</dl>" +
      '<div class="cs-statement"><h3>Authenticity Statement</h3>' +
        "<p>This certificate confirms that “" + esc(name) + "” is an authentic original artwork created and issued by <b>BUNT ELEGANCE</b>.</p>" +
        "<p>The artwork is an original handcrafted composition — " + esc(lc(d.form)) + ", on " + esc(lc(d.medium)) + ". Each artwork is individually documented by BUNT ELEGANCE with a unique Artwork ID and Certificate of Authenticity.</p>" +
        "<p>This certificate accompanies the artwork as an official record of its authenticity and provenance at the time of issue.</p></div></section>" +
      '<section class="cs-sign">' +
        '<div class="cs-cell"><span class="cs-label">Artist / Creator</span><b>' + esc(d.artist) + '</b><i class="cs-sig">' + esc(d.signatures[0]) + "</i></div>" +
        '<div class="cs-cell"><span class="cs-label">Issued by</span><b>' + esc(d.issuedBy) + '</b><i class="cs-sig cs-sig--sm">' + d.signatures.map(esc).join(" &nbsp;&nbsp; ") + "</i></div>" +
        '<div class="cs-cell cs-cell--c"><span class="cs-label">Certificate No.</span><b>' + esc(d.certNo) + "</b></div>" +
        '<div class="cs-cell cs-cell--c"><span class="cs-label">Date of Issue</span><b>' + esc(d.issuedOn || "—") + "</b></div>" +
        '<div class="cs-cell cs-cell--c"><span class="cs-label">Collector / Purchaser Name</span><b>' + esc(d.collector || "—") + "</b></div>" +
        '<div class="cs-seal" aria-hidden="true"><img src="../../assets/img/logo/emblem.svg" alt="" width="30" height="34"><b>BUNT ELEGANCE</b><span>Original Artwork</span><span>Certificate of<br>Authenticity</span></div>' +
      "</section>" +
      '<footer class="cs-foot"><span>' + ICON.web + esc(d.contact.website) + "</span><span>" + ICON.phone + esc(d.contact.phone) + "</span><span>" + ICON.mail + esc(d.contact.email) + "</span></footer>" +
    "</div></article></div>";

  var stage = root.querySelector(".cert-stage"), sheet = root.querySelector(".cert-sheet");
  function fit() {
    var k = Math.min(1, stage.clientWidth / W);
    sheet.style.transform = "scale(" + k + ")";
    stage.style.height = Math.round(H * k) + "px";
  }
  stage.classList.add("is-scaled");
  fit();
  window.addEventListener("resize", fit);
  document.getElementById("cert-print").addEventListener("click", function () { window.print(); });
})();
