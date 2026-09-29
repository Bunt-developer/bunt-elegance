# BUNT ELEGANCE — Website

Static luxury e-commerce site for BUNT ELEGANCE. No build step: plain HTML, CSS and JavaScript, ready for GitHub Pages.

## Deploy to GitHub Pages
1. Create a repository and upload **the contents of this `website` folder** to its root (so `index.html` is at the top level).
2. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
3. The site will be live at `https://<username>.github.io/<repo>/` within a minute or two.
4. Custom domain (`www.buntelegance.com`): add it under Settings → Pages → Custom domain, then point a `CNAME` DNS record for `www` to `<username>.github.io`. GitHub will create the `CNAME` file for you.

`.nojekyll` is included so GitHub serves every file as-is.

## Pages
| File | Purpose |
| --- | --- |
| `index.html` | Homepage — all 14 sections |
| `collection.html` | Full collection with medium chips, filters (space, price, availability, collection), search and sort. Supports `?category=`, `?q=`, `?room=` |
| `product.html?id=…` | Product detail — gallery with hover zoom & lightbox, View in Interior, specs, story, certificate, care, shipping, returns, add to cart, enquire |
| `stories.html` | Art Stories + Journal |
| `about.html` | Founders, emblem, brand film |
| `contact.html` | Enquiry form, WhatsApp, FAQ (`?subject=commission` / `collector` pre-selects) |
| `care.html` | Art Care Guide (air pump, microfiber cloth, long soft brush, hard brush) |
| `certificate.html` | Certificate of Authenticity & verification request |
| `shipping.html`, `legal.html`, `404.html` | Client services, privacy/terms, not-found |

## Editing content
Everything catalogue-related lives in **`assets/js/data.js`**:
- `BE.config` — email, WhatsApp number, social links, optional form endpoints.
- `BE.artworks` — add / edit artworks (name, collection, category, price in INR, dimensions, `size` in cm for View in Interior, materials, edition, availability, story, images). Set `price: null` for "Price on request". Set `signature: true` on the artwork shown in the homepage showcase.
- `BE.categories`, `BE.rooms`, `BE.journal`, `BE.viewRooms`.

Images: each image is referenced without extension and must exist as `name.webp` (large) and `name-sm.webp` (≤720 px). Place new images in `assets/img/art/`.

## Forms, cart & checkout
GitHub Pages is static hosting, so there is no server:
- **Cart & wishlist** are stored in the visitor's browser. Checkout sends the order to WhatsApp (or email) so the concierge can confirm and take payment.
- **Contact, enquiry, newsletter, verification forms** open the visitor's email app pre-filled to `buntelegance@gmail.com`. To receive submissions directly, create a free form at Formspree / Getform / Basin and paste its URL into `formEndpoint` (and optionally `newsletterEndpoint`) in `data.js`.
- For online payments later, Razorpay Payment Links or Shopify Buy Button can be added to the cart drawer.

## Logo
`assets/img/logo/logo.svg` is the official logo with its original paths and colours; only the cream background rectangle was removed and the canvas trimmed. `logo-light.svg` is the same artwork in cream for use over dark photography (as in the brand guide). `emblem.svg` is the symbol alone.

## Before launch — replace placeholders
- Prices, edition numbers and availability in `data.js` are illustrative.
- Artwork images are crops from the brand-guide renders; replace with real product photography when available.
- Bedroom, office, hotel-suite, gift-box and View-in-Interior room photos are Unsplash images (free licence) — swap for your own project photography.
- Instagram / Pinterest / Facebook URLs in `data.js` and `index.html` assume the handle `buntelegance`.
- Have `legal.html` and the returns policy reviewed.
