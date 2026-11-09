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
 * - Each page only carries its artwork data (JSON). The certificate layout is one shared template:
 *   assets/js/certificate.js + the .cert-/.cs- rules in assets/css/style.css. No PDFs are stored;
 *   visitors use Print -> Save as PDF (fixed A4-landscape print layout, same on every device).
 * - Per-certificate sale details (collector name, date of issue) can be added in the git-ignored
 *   private/certificate-details.json:  { "BE-2026-004": { "collector": "Name", "issuedOn": "27 / 09 / 2026" } }
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

const SIGNERS = {
  artist: "Dr. Jeni Bhadja",
  issuedBy: "Dr. Jeni Bhadja & Anand Bhadja",
  signatures: ["Jeni Bhadja", "Anand Bhadja"],
};
const DETAILS_FILE = path.join(ROOT, "private", "certificate-details.json");
const details = fs.existsSync(DETAILS_FILE) ? JSON.parse(fs.readFileSync(DETAILS_FILE, "utf8")) : {};

/** Data handed to the shared template — everything the page needs, nothing else. */
function certData(a) {
  const cat = BE.categories.find((c) => c.id === a.category);
  const d = details[a.id] || {};
  return {
    name: a.name, archiveId: a.archiveId, certNo: `COA-${a.archiveId}`,
    series: a.series || a.collection, edition: a.edition, editionNote: a.editionNote || "",
    year: a.year, type: cat && cat.name, medium: a.medium, dimensions: a.dimensions,
    frame: a.frame, form: a.form,
    artist: SIGNERS.artist, issuedBy: SIGNERS.issuedBy, signatures: SIGNERS.signatures,
    issuedOn: d.issuedOn || "", collector: d.collector || "",
    contact: { website: "www." + BE.config.website, phone: "+" + BE.config.whatsapp.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2$3"), email: BE.config.email },
  };
}

/** Thin shell: head/meta + data + shared renderer. */
function page(a) {
  const title = `Certificate of Authenticity — ${a.name} | BUNT ELEGANCE`;
  const desc = `Certificate of Authenticity for ${a.name} (${a.archiveId}), an original by BUNT ELEGANCE.`;
  const json = JSON.stringify(certData(a)).replace(/</g, "\\u003c");
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
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body class="cert-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main" class="cp-wrap"><div id="cert-root"><noscript><p class="cert-ui__hint">Please enable JavaScript to view this certificate. ${esc(a.name)} &middot; ${esc(a.archiveId)}.</p></noscript></div></main>
  <script type="application/json" id="cert-data">${json}</script>
  <script src="../../assets/js/certificate.js"></script>
</body>
</html>
`;
}

const csv = ["artwork_id,title,url"];
for (const a of BE.artworks) {
  const uuid = map[a.id];
  const dir = path.join(ROOT, "a", uuid);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(a));
  const url = `${ORIGIN}/a/${uuid}/`;
  csv.push(`${a.id},"${a.name.replace(/"/g, '""')}",${url}`);
  console.log(`${a.id}  ${a.name.padEnd(26)} ${url}`);
}
fs.writeFileSync(CSV_FILE, csv.join("\n") + "\n");
console.log(`\nWrote ${BE.artworks.length} pages in a/ and private/nfc-links.csv`);
