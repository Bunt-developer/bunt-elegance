#!/usr/bin/env node
/**
 * Generates one private, unlisted authenticity page per artwork:  a/<uuid>/index.html
 *
 *   node tools/generate-certificates.mjs
 *
 * - Artwork data is read from assets/js/data.js (single source of truth).
 * - Each artwork gets a random UUID v4 the first time it is seen. The mapping is stored in
 *   private/nfc-links.json (git-ignored, never published) and is reused on every run,
 *   so an NFC link never changes once written to a card.
 * - private/nfc-links.csv is rewritten with artwork -> URL for programming the NFC cards.
 * - The pages are noindex, are not in sitemap.xml and are not linked from anywhere on the site.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://buntelegance.com";
const MAP_FILE = path.join(ROOT, "private", "nfc-links.json");
const CSV_FILE = path.join(ROOT, "private", "nfc-links.csv");

// --- load BE data (data.js is a browser script that fills a global `BE`)
const ctx = { window: {}, console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/js/data.js"), "utf8") + "\n;this.BE = BE;", ctx);
const BE = ctx.BE;

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// --- stable uuid mapping
fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });
const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
for (const a of BE.artworks) if (!map[a.id]) map[a.id] = randomUUID();
fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");

const known = new Set(BE.artworks.map((a) => a.id));
for (const id of Object.keys(map)) if (!known.has(id)) console.warn(`! ${id} is in nfc-links.json but not in data.js (page left untouched)`);

const row = (k, v) => (v ? `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>` : "");

function page(a, uuid) {
  const cat = BE.categories.find((c) => c.id === a.category);
  const img = a.images[0];
  const hasExt = /\.\w+$/.test(img);
  const full = "../../" + (hasExt ? img : img + ".webp");
  const sm = "../../" + (hasExt ? img : img + "-sm.webp");
  const ratio = a.size ? `${a.size.w} / ${a.size.h}` : "4 / 5";
  const title = `Certificate of Authenticity — ${a.name} | BUNT ELEGANCE`;
  const desc = `Authenticity record for ${a.name} (${a.archiveId}), an original by BUNT ELEGANCE.`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="noindex, nofollow, noarchive, noimageindex">
  <meta name="referrer" content="no-referrer">
  <meta name="theme-color" content="#1a1816">
  <link rel="icon" href="../../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../../favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="../../apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body class="cert-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="cert-header">
    <a href="../../index.html" aria-label="BUNT ELEGANCE — website"><img src="../../assets/img/logo/logo.svg" alt="BUNT ELEGANCE — Art that defines your space" width="160" height="80"></a>
  </header>
  <main id="main">
    <section class="cert">
      <div class="container cert__inner">
        <figure class="cert__media frame" style="aspect-ratio:${ratio}">
          <img src="${esc(sm)}" srcset="${esc(sm)} 720w, ${esc(full)} 1600w" sizes="(min-width:900px) 45vw, 92vw" alt="${esc(a.name)} — original artwork by BUNT ELEGANCE" fetchpriority="high" decoding="async">
        </figure>
        <div class="cert__body">
          <span class="eyebrow">Certificate of Authenticity</span>
          <h1 class="h2">${esc(a.name)}</h1>
          <p class="cert__seal"><span aria-hidden="true">&#10003;</span> Authentic original by BUNT ELEGANCE</p>
          <dl class="cert__specs">
            ${row("Certificate no.", a.archiveId)}
            ${row("Title", a.name)}
            ${row("Year", a.year)}
            ${row("Collection", a.collection)}
            ${row("Category", cat && cat.name)}
            ${row("Form", a.form)}
            ${row("Medium", a.medium)}
            ${row("Frame", a.frame)}
            ${row("Dimensions", a.dimensions)}
            ${row("Edition", [a.edition, a.editionNote].filter(Boolean).join(" — "))}
          </dl>
          <p class="cert__note">This page confirms that the artwork named above was handcrafted by BUNT ELEGANCE and is accompanied by a Certificate of Authenticity. Please keep this link and your physical certificate card safe, and share the link only with people you trust.</p>
          <p class="cert__note">Questions about this artwork? Write to <a href="mailto:${esc(BE.config.email)}?subject=${encodeURIComponent("Authenticity enquiry — " + a.archiveId)}">${esc(BE.config.email)}</a>.</p>
        </div>
      </div>
    </section>
  </main>
  <footer class="cert-footer">
    <p>&copy; ${new Date().getFullYear()} BUNT ELEGANCE &middot; ${esc(BE.config.tagline)}</p>
  </footer>
</body>
</html>
`;
}

const csv = ["artwork_id,title,url"];
for (const a of BE.artworks) {
  const uuid = map[a.id];
  const dir = path.join(ROOT, "a", uuid);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(a, uuid));
  const url = `${ORIGIN}/a/${uuid}/`;
  csv.push(`${a.id},"${a.name.replace(/"/g, '""')}",${url}`);
  console.log(`${a.id}  ${a.name.padEnd(26)} ${url}`);
}
fs.writeFileSync(CSV_FILE, csv.join("\n") + "\n");
console.log(`\nWrote ${BE.artworks.length} pages in a/ and private/nfc-links.csv`);
