/* ==========================================================================
   BUNT ELEGANCE — site behaviour
   Layout injection, cart & wishlist, search, forms, motion, page renderers.
   ========================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const C = BE.config;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const page = document.body.dataset.page || '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = new Intl.NumberFormat(C.locale, { style: 'currency', currency: C.currency, maximumFractionDigits: 0 });
  const price = v => (v == null ? 'Price on request' : money.format(v));
  const params = new URLSearchParams(location.search);

  /* ---------- Icons ---------- */
  const I = {
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.4-6 8-6s6.8 2 8 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h12"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 22 10" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 5h21M16.5 .5 21 5l-4.5 4.5"/></svg>',
    arrowL: '<svg class="arrow" viewBox="0 0 22 10" fill="none" stroke="currentColor" stroke-width="1"><path d="M22 5H1M5.5 .5 1 5l4.5 4.5"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10.5 20.5 12 13m0 0c-1.6 0-2.5-1.2-2.5-2.8A3.2 3.2 0 0 1 12.8 7c2 0 3.2 1.4 3.2 3.2 0 2.2-1.2 3.8-2.8 3.8-.6 0-1.2-.4-1.2-1z"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>',
    room: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V5h14v16"/><rect x="8" y="8" width="8" height="5"/><path d="M7 21v-3h10v3"/></svg>',
    cert: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="13" rx="1"/><path d="M8 7h8M8 10h5"/><circle cx="15" cy="17" r="3"/><path d="m13.5 19.5-.5 2.5 2-1 2 1-.5-2.5"/></svg>',
    ship: '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    ret: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/></svg>',
  };
  const wishIcon = I.heart;

  /* ---------- Storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('be:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('be:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  let cart = store.get('cart', []);          // [{id, qty}]
  let wish = store.get('wish', []);          // [id]
  cart = cart.filter(i => BE.findArtwork(i.id));
  wish = wish.filter(id => BE.findArtwork(id));

  /* ---------- Image helper ---------- */
  function img(src, alt, o = {}) {
    const sizes = o.sizes || '(min-width: 1000px) 50vw, 100vw';
    return `<img src="${src}-sm.webp" srcset="${src}-sm.webp 720w, ${src}.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${o.cls ? ` class="${o.cls}"` : ''}>`;
  }

  /* ---------- Layout: header ---------- */
  const NAV = [
    ['home', 'index.html', 'Home'], ['collection', 'collection.html', 'Collection'], ['artworks', 'collection.html?view=all', 'Artworks'],
    ['stories', 'stories.html', 'Art Stories'], ['about', 'about.html', 'About'], ['journal', 'stories.html#journal', 'Journal'], ['contact', 'contact.html', 'Contact'],
  ];
  const navLink = ([id, href, label]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`;

  function renderHeader() {
    const h = $('#site-header'); if (!h) return;
    h.className = 'site-header' + (document.body.dataset.header === 'transparent' ? ' is-transparent' : '');
    h.innerHTML = `
      <div class="container header-inner">
        <div class="header-left">
          <button class="icon-btn menu-toggle" data-open="menu" aria-label="Open menu">${I.menu}</button>
          <nav class="nav" aria-label="Primary">${NAV.slice(0, 4).map(navLink).join('')}</nav>
        </div>
        <a class="brand" href="index.html" aria-label="BUNT ELEGANCE — home">
          <img class="logo-dark" src="assets/img/logo/logo.svg" alt="BUNT ELEGANCE — Art that defines your space" width="160" height="80">
          <img class="logo-light" src="assets/img/logo/logo-light.svg" alt="" aria-hidden="true" width="160" height="80">
        </a>
        <div class="header-right">
          <nav class="nav" aria-label="Secondary">${NAV.slice(4).map(navLink).join('')}</nav>
          <button class="icon-btn" data-open="search" aria-label="Search">${I.search}</button>
          <button class="icon-btn hide-mobile" data-open="account" aria-label="Account">${I.user}</button>
          <button class="icon-btn hide-mobile" data-open="wish" aria-label="Wishlist">${I.heart}<span class="count" data-count="wish"></span></button>
          <button class="icon-btn" data-open="cart" aria-label="Shopping cart">${I.bag}<span class="count" data-count="cart"></span></button>
        </div>
      </div>`;
  }

  /* ---------- Layout: footer & global UI ---------- */
  function renderFooter() {
    const f = $('#site-footer'); if (!f) return;
    const links = [['collection.html', 'Collection'], ['about.html', 'About'], ['contact.html', 'Contact'], ['shipping.html', 'Shipping'],
      ['shipping.html#returns', 'Returns'], ['legal.html#privacy', 'Privacy'], ['legal.html#terms', 'Terms'], ['care.html', 'Care Guide'], ['certificate.html', 'Certificate of Authenticity']];
    f.className = 'site-footer';
    f.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="assets/img/logo/logo-light.svg" alt="BUNT ELEGANCE — Art that defines your space" width="220" height="110" loading="lazy">
            <p>Collectible, handcrafted statement wall art — created in India for modern spaces around the world.</p>
            <div class="socials">
              <a href="${C.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
              <a href="${C.social.pinterest}" target="_blank" rel="noopener" aria-label="Pinterest">${I.pin}</a>
              <a href="${C.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
              <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa.replace('<svg', '<svg style="fill:#f6f1ea;stroke:none"')}</a>
            </div>
          </div>
          <div>
            <p class="footer-title">Explore</p>
            <nav class="footer-links" aria-label="Footer">${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav>
          </div>
          <div>
            <p class="footer-title">Contact</p>
            <div class="footer-contact">
              <a href="mailto:${C.email}">Email: ${C.email}</a>
              <a href="https://${C.website}" rel="noopener">Website: ${C.website}</a>
              <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp: ${C.phoneDisplay}</a>
            </div>
          </div>
        </div>
        <div class="footer-word" aria-hidden="true">BUNT ELEGANCE</div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} BUNT ELEGANCE. All rights reserved.</span>
          <span>ART THAT DEFINES YOUR SPACE</span>
        </div>
      </div>`;
  }

  function renderGlobalUI() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="overlay" data-close></div>
      <div class="mobile-menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="mobile-menu__top">
          <img src="assets/img/logo/logo-light.svg" alt="BUNT ELEGANCE" width="96" height="48">
          <button class="close-btn" data-close aria-label="Close menu">${I.close}</button>
        </div>
        <nav aria-label="Mobile">${NAV.map(navLink).join('')}</nav>
        <div class="mobile-menu__foot caps">
          <button data-open="wish">Wishlist</button><button data-open="account">Account</button>
          <a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${C.email}">Email</a>
        </div>
      </div>

      <div class="search-panel" id="search" role="dialog" aria-modal="true" aria-label="Search">
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="eyebrow">Search the collection</span><button class="close-btn" data-close aria-label="Close search">${I.close}</button></div>
          <form role="search" action="collection.html">
            <label class="sr-only" for="q">Search artworks, collections and mediums</label>
            <input id="q" name="q" type="search" placeholder="Artwork, collection or medium" autocomplete="off">
            <button class="icon-btn" aria-label="Submit search">${I.search}</button>
          </form>
          <div class="suggest">${['Texture Art', 'Botanica', 'Diptych', 'Wooden Art', 'Living Room', 'Commission'].map(s => `<button class="chip" data-suggest="${s}">${s}</button>`).join('')}</div>
          <div class="search-results" id="search-results" aria-live="polite"></div>
        </div>
      </div>

      <aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="drawer__head"><h2 id="cart-title">Your Collection</h2><button class="close-btn" data-close aria-label="Close cart">${I.close}</button></div>
        <div class="drawer__body" id="cart-body"></div>
        <div class="drawer__foot" id="cart-foot"></div>
      </aside>

      <aside class="drawer" id="wish" role="dialog" aria-modal="true" aria-labelledby="wish-title">
        <div class="drawer__head"><h2 id="wish-title">Wishlist</h2><button class="close-btn" data-close aria-label="Close wishlist">${I.close}</button></div>
        <div class="drawer__body" id="wish-body"></div>
      </aside>

      <div class="modal" id="account" role="dialog" aria-modal="true" aria-labelledby="acc-title">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__box">
          <button class="close-btn modal__close" data-close aria-label="Close">${I.close}</button>
          <span class="eyebrow">Collector Account</span>
          <h2 id="acc-title" class="h3" style="margin:18px 0 14px">Private accounts are opening soon.</h2>
          <p class="muted">Leave your email and we will send a personal invitation — with your order history, certificates and Collector Privilege benefits in one place.</p>
          <form class="form-grid" data-form="account" style="margin-top:28px">
            <div class="field"><label for="acc-email">Email</label><input id="acc-email" name="email" type="email" required autocomplete="email"></div>
            <button class="btn" type="submit">Request invitation</button>
            <p class="form-status" role="status"></p>
          </form>
        </div>
      </div>

      <div class="modal" id="enquire" role="dialog" aria-modal="true" aria-labelledby="enq-title">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__box">
          <button class="close-btn modal__close" data-close aria-label="Close">${I.close}</button>
          <span class="eyebrow">Private Enquiry</span>
          <h2 id="enq-title" class="h3" style="margin:18px 0 8px">Enquire about <span data-enq-name>an artwork</span></h2>
          <p class="muted small">Our art concierge replies personally, usually within one working day.</p>
          <form class="form-grid" data-form="enquiry" style="margin-top:26px">
            <input type="hidden" name="artwork">
            <div class="field"><label for="enq-name">Name</label><input id="enq-name" name="name" required autocomplete="name"></div>
            <div class="field"><label for="enq-contact">Email or phone</label><input id="enq-contact" name="contact" required></div>
            <div class="field"><label for="enq-msg">Message</label><textarea id="enq-msg" name="message" rows="3"></textarea></div>
            <div class="btn-row"><button class="btn" type="submit">Send enquiry</button><button class="btn btn--ghost" type="button" data-wa-enquiry>${I.wa.replace('<svg', '<svg width="16" height="16" fill="currentColor"')} WhatsApp</button></div>
            <p class="form-status" role="status"></p>
          </form>
        </div>
      </div>

      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <button class="close-btn" data-close aria-label="Close">${I.close}</button>
        <button class="lb-nav lb-prev" aria-label="Previous image">${I.arrowL}</button>
        <img alt="">
        <button class="lb-nav lb-next" aria-label="Next image">${I.arrow}</button>
        <p class="lb-cap"></p>
      </div>

      <a class="wa-float" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent('Hello BUNT ELEGANCE, I would like to know more about your artworks.')}" target="_blank" rel="noopener" aria-label="Enquire on WhatsApp">${I.wa}<span>Enquire</span></a>
      <div class="toast" role="status" aria-live="polite"><span></span></div>`;
    document.body.append(...wrap.children);
  }

  /* ---------- Panels (open / close / focus) ---------- */
  let openPanel = null, lastFocus = null;
  const overlay = () => $('.overlay');
  function open(id) {
    if (openPanel) close(true);
    const el = document.getElementById(id); if (!el) return;
    lastFocus = document.activeElement;
    openPanel = el;
    el.classList.add('is-open');
    if (el.classList.contains('drawer') || id === 'search') overlay().classList.add('is-on');
    document.body.style.overflow = 'hidden';
    if (id === 'cart') renderCart();
    if (id === 'wish') renderWish();
    updateHeader();
    setTimeout(() => { const f = id === 'search' ? $('#q') : $('input, button, a', el); f && f.focus({ preventScroll: true }); }, 350);
  }
  function close(silent) {
    if (!openPanel) return;
    openPanel.classList.remove('is-open');
    overlay().classList.remove('is-on');
    if (openPanel.id === 'lightbox') openPanel.querySelector('img').removeAttribute('src');
    openPanel = null;
    document.body.style.overflow = '';
    updateHeader();
    if (!silent && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); open(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) { e.preventDefault(); close(); }
  });
  document.addEventListener('keydown', e => {
    if (!openPanel) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = $$('a[href], button:not([disabled]), input, select, textarea', openPanel).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg, action) {
    const t = $('.toast');
    t.innerHTML = `<span>${esc(msg)}</span>${action ? `<a href="#" data-open="${action[1]}">${action[0]}</a>` : ''}`;
    t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3600);
  }

  /* ---------- Cart & wishlist ---------- */
  function counts() {
    const n = cart.reduce((s, i) => s + i.qty, 0);
    $$('[data-count="cart"]').forEach(el => { el.textContent = n; el.classList.toggle('has', n > 0); });
    $$('[data-count="wish"]').forEach(el => { el.textContent = wish.length; el.classList.toggle('has', wish.length > 0); });
    $$('[data-wish]').forEach(b => { const on = wish.includes(b.dataset.wish); b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }
  function addToCart(id) {
    const a = BE.findArtwork(id); if (!a) return;
    if (a.price == null) { enquire(id); return; }
    const line = cart.find(i => i.id === id);
    if (line) line.qty += 1; else cart.push({ id, qty: 1 });
    store.set('cart', cart); counts();
    open('cart');
  }
  function toggleWish(id) {
    const i = wish.indexOf(id);
    if (i > -1) wish.splice(i, 1); else wish.push(id);
    store.set('wish', wish); counts();
    const a = BE.findArtwork(id);
    toast(i > -1 ? `${a.name} removed from wishlist` : `${a.name} saved to wishlist`, i > -1 ? null : ['View', 'wish']);
  }
  function orderText() {
    const lines = cart.map(i => { const a = BE.findArtwork(i.id); return `• ${a.name} (${a.collection}) × ${i.qty} — ${price(a.price * i.qty)}`; });
    const total = cart.reduce((s, i) => s + BE.findArtwork(i.id).price * i.qty, 0);
    return `Hello BUNT ELEGANCE, I would like to acquire:\n${lines.join('\n')}\nSubtotal: ${price(total)}\n\nPlease confirm availability, shipping and payment details.`;
  }
  function renderCart() {
    const body = $('#cart-body'), foot = $('#cart-foot');
    if (!cart.length) {
      body.innerHTML = `<div class="empty-state"><h3>Your collection is empty</h3><p>Discover works created to define a space.</p><a class="btn" href="collection.html">Explore the collection</a></div>`;
      foot.innerHTML = ''; return;
    }
    body.innerHTML = cart.map(i => {
      const a = BE.findArtwork(i.id);
      return `<div class="line-item">
        <a class="line-item__img" href="product.html?id=${a.id}"><img src="${a.images[0]}-sm.webp" alt="${esc(a.name)}" loading="lazy"></a>
        <div><h3><a href="product.html?id=${a.id}">${esc(a.name)}</a></h3><p class="meta">${esc(a.collection)} · ${esc(a.dimensions)}</p>
          <div class="qty"><button data-qty="-1" data-id="${a.id}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="1" data-id="${a.id}" aria-label="Increase quantity">+</button></div>
          <div><button class="remove" data-remove="${a.id}">Remove</button></div></div>
        <div class="small">${price(a.price * i.qty)}</div></div>`;
    }).join('');
    const total = cart.reduce((s, i) => s + BE.findArtwork(i.id).price * i.qty, 0);
    foot.innerHTML = `
      <div class="subtotal"><span class="caps">Subtotal</span><strong>${price(total)}</strong></div>
      <p class="fine">Insured shipping, packaging and Certificate of Authenticity included. Our art concierge confirms availability and arranges secure payment personally.</p>
      <a class="btn btn--block" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent(orderText())}">Complete via WhatsApp</a>
      <a class="btn btn--ghost btn--block" href="mailto:${C.email}?subject=${encodeURIComponent('Artwork order request')}&body=${encodeURIComponent(orderText())}">Request invoice by email</a>`;
  }
  function renderWish() {
    const body = $('#wish-body');
    if (!wish.length) { body.innerHTML = `<div class="empty-state"><h3>Nothing saved yet</h3><p>Tap the heart on any artwork to keep it here.</p><a class="btn" href="collection.html">Browse artworks</a></div>`; return; }
    body.innerHTML = wish.map(id => {
      const a = BE.findArtwork(id);
      return `<div class="line-item">
        <a class="line-item__img" href="product.html?id=${a.id}"><img src="${a.images[0]}-sm.webp" alt="${esc(a.name)}" loading="lazy"></a>
        <div><h3><a href="product.html?id=${a.id}">${esc(a.name)}</a></h3><p class="meta">${esc(a.collection)} · ${price(a.price)}</p>
          <div style="display:flex;gap:18px"><button class="remove" data-add="${a.id}" style="color:var(--ink)">${a.price == null ? 'Enquire' : 'Add to cart'}</button><button class="remove" data-wish-remove="${a.id}">Remove</button></div></div><span></span></div>`;
    }).join('');
  }
  document.addEventListener('click', e => {
    const t = e.target;
    const q = t.closest('[data-qty]');
    if (q) { const l = cart.find(i => i.id === q.dataset.id); l.qty = Math.max(1, l.qty + +q.dataset.qty); store.set('cart', cart); counts(); renderCart(); return; }
    const r = t.closest('[data-remove]');
    if (r) { cart = cart.filter(i => i.id !== r.dataset.remove); store.set('cart', cart); counts(); renderCart(); return; }
    const w = t.closest('[data-wish]');
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(w.dataset.wish); return; }
    const wr = t.closest('[data-wish-remove]');
    if (wr) { wish = wish.filter(id => id !== wr.dataset.wishRemove); store.set('wish', wish); counts(); renderWish(); return; }
    const ad = t.closest('[data-add]');
    if (ad) { e.preventDefault(); addToCart(ad.dataset.add); return; }
    const en = t.closest('[data-enquire]');
    if (en) { e.preventDefault(); enquire(en.dataset.enquire); return; }
    const sg = t.closest('[data-suggest]');
    if (sg) { $('#q').value = sg.dataset.suggest; runSearch(); return; }
  });

  /* ---------- Enquiry ---------- */
  function enquire(id) {
    const a = id ? BE.findArtwork(id) : null;
    const m = $('#enquire');
    $('[data-enq-name]', m).textContent = a ? a.name : 'an artwork';
    m.querySelector('[name=artwork]').value = a ? `${a.name} — ${a.collection}` : '';
    m.querySelector('[name=message]').value = a ? `I am interested in ${a.name} (${a.dimensions}). Please share availability and details.` : '';
    open('enquire');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wa-enquiry]'); if (!b) return;
    const f = b.closest('form'); const d = Object.fromEntries(new FormData(f));
    const text = `Hello BUNT ELEGANCE,\n${d.artwork ? `Artwork: ${d.artwork}\n` : ''}${d.message || ''}\n— ${d.name || ''} ${d.contact || ''}`;
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  /* ---------- Forms ---------- */
  const FORM_SUBJECT = { newsletter: 'Newsletter subscription', account: 'Collector account invitation', enquiry: 'Artwork enquiry', contact: 'Website enquiry', verify: 'Certificate verification request', collector: 'Collector Privilege request' };
  document.addEventListener('submit', async e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const kind = f.dataset.form, data = Object.fromEntries(new FormData(f));
    const status = $('.form-status', f) || $('.form-note', f.parentElement);
    const endpoint = kind === 'newsletter' || kind === 'account' ? (C.newsletterEndpoint || C.formEndpoint) : C.formEndpoint;
    const subject = `${FORM_SUBJECT[kind] || 'Website form'}${data.subject ? ' — ' + data.subject : ''}`;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ _subject: subject, form: kind, ...data }) });
        if (!res.ok) throw new Error(res.status);
        f.reset(); if (status) status.textContent = kind === 'newsletter' ? 'Welcome to the world of BUNT ELEGANCE.' : 'Thank you — our concierge will be in touch shortly.';
        return;
      } catch (err) { /* fall through to email */ }
    }
    const body = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`).join('\n');
    location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = 'Your email app has opened with your message — press send to complete.';
  });

  /* ---------- Search ---------- */
  function matches(a, q) {
    const cat = BE.findCategory(a.category);
    const hay = [a.name, a.collection, a.format, a.materials, a.palette, cat && cat.name, a.status, ...a.rooms.map(r => (BE.rooms.find(x => x.id === r) || {}).name)].join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w) || (w === 'commission' && a.status === 'commission'));
  }
  function runSearch() {
    const q = $('#q').value.trim(), out = $('#search-results');
    if (!q) { out.innerHTML = ''; return; }
    const res = BE.artworks.filter(a => matches(a, q));
    const cats = BE.categories.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
    out.innerHTML = (cats.length ? `<div style="grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap">${cats.map(c => `<a class="chip" href="collection.html?category=${c.id}">${c.name}</a>`).join('')}</div>` : '') +
      (res.length ? res.slice(0, 8).map(a => artCard(a, { compact: true })).join('') : `<p class="muted" style="grid-column:1/-1">No artworks match “${esc(q)}”. <a class="link" href="contact.html?subject=commission">Commission a piece ${I.arrow}</a></p>`);
    counts();
  }
  document.addEventListener('input', e => { if (e.target.id === 'q') runSearch(); });

  /* ---------- Art card ---------- */
  function artCard(a, o = {}) {
    const cat = BE.findCategory(a.category);
    const tag = a.status === 'commission' ? 'Commission' : /1 of 1/.test(a.edition) ? 'Original' : 'Limited Edition';
    return `<article class="art-card${o.reveal ? ' reveal' : ''}"${o.delay ? ` style="--d:${o.delay}s"` : ''}>
      <a href="product.html?id=${a.id}" aria-label="${esc(a.name)} — view artwork">
        <div class="art-card__media">
          <span class="art-card__tag">${tag}</span>
          <div class="mat">${img(a.images[0], `${a.name}, ${cat ? cat.name : ''} by BUNT ELEGANCE`, { sizes: '(min-width: 1000px) 33vw, 50vw' })}</div>
          ${a.images[2] || a.images[1] ? img(a.images[2] || a.images[1], `${a.name} in an interior`, { cls: 'alt', sizes: '(min-width: 1000px) 33vw, 50vw' }) : ''}
          <span class="art-card__cta">View artwork</span>
        </div>
      </a>
      <button class="wish-btn" data-wish="${a.id}" aria-label="Save ${esc(a.name)} to wishlist" aria-pressed="false">${wishIcon}</button>
      <div class="art-card__info">
        <div><h3 class="art-card__name"><a href="product.html?id=${a.id}">${esc(a.name)}</a></h3><p class="art-card__coll">${esc(a.collection)}</p></div>
        <p class="art-card__price">${price(a.price)}</p>
        ${o.compact ? '' : `<a class="link art-card__view" href="product.html?id=${a.id}">View artwork ${I.arrow}</a>`}
      </div>
    </article>`;
  }

  /* ---------- Generative medium motifs (SVG) ---------- */
  function rng(seed) { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function motif(id, seed = 7) {
    const r = rng(seed * 97 + id.length * 13), W = 300, H = 400; let g = '';
    const n = v => v.toFixed(1);
    switch (id) {
      case 'texture': for (let i = 0; i < 22; i++) { const y = 10 + i * 18; g += `<path d="M-20 ${y} C 70 ${n(y - 26 + r() * 20)} 170 ${n(y + 30 - r() * 16)} 320 ${n(y - 6)}" stroke-width="${n(.5 + r() * 1.2)}"/>`; } break;
      case 'wooden': for (let i = 1; i < 26; i++) { const rr = i * 17 + r() * 5; g += `<ellipse cx="${n(170 + r() * 4)}" cy="420" rx="${n(rr * 1.15)}" ry="${n(rr * .92)}" stroke-width="${n(.4 + r() * .9)}"/>`; } break;
      case 'thread': { const pts = []; for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; pts.push([150 + Math.cos(t) * 118, 190 + Math.sin(t) * 118]); }
        for (let i = 0; i < 40; i++) { const p = pts[i], q = pts[(i * 13 + 7) % 40]; g += `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" stroke-width=".5"/>`; }
        pts.forEach(p => { g += `<circle cx="${n(p[0])}" cy="${n(p[1])}" r="1.4" fill="currentColor"/>`; }); break; }
      case 'glass': for (let i = 0; i < 6; i++) { g += `<rect x="${n(40 + r() * 120)}" y="${n(40 + r() * 190)}" width="${n(90 + r() * 70)}" height="${n(120 + r() * 80)}" transform="rotate(${n(-18 + r() * 36)} 150 200)" fill="currentColor" fill-opacity="${n(.04 + r() * .08)}" stroke-width=".6"/>`; } break;
      case 'stone': for (let i = 0; i < 9; i++) { const cx = 40 + r() * 220, cy = 40 + r() * 320, w = 30 + r() * 50, h = 20 + r() * 36;
        g += `<path d="M${n(cx - w)} ${n(cy)} C ${n(cx - w)} ${n(cy - h * 1.3)} ${n(cx + w)} ${n(cy - h * 1.2)} ${n(cx + w)} ${n(cy)} S ${n(cx - w * .8)} ${n(cy + h * 1.3)} ${n(cx - w)} ${n(cy)}Z" fill="currentColor" fill-opacity="${n(.05 + r() * .1)}" stroke-width=".7"/>`; } break;
      case '3d': for (let row = 0; row < 9; row++) for (let col = 0; col < 6; col++) { const x = col * 56 + (row % 2) * 28 - 10, y = row * 48 - 10, s = 28;
        g += `<path d="M${x} ${y + s * .5} L${x + s} ${y} L${x + s * 2} ${y + s * .5} L${x + s} ${y + s}Z" fill="currentColor" fill-opacity=".12" stroke-width=".5"/><path d="M${x} ${y + s * .5} V${y + s * 1.5} L${x + s} ${y + s * 2} V${y + s}" fill="currentColor" fill-opacity=".04" stroke-width=".5"/>`; } break;
      case 'painting': for (let i = 0; i < 7; i++) { const y = 40 + r() * 320; g += `<path d="M${n(-20 + r() * 40)} ${n(y)} Q ${n(150 + r() * 60 - 30)} ${n(y - 80 + r() * 160)} ${n(290 + r() * 40)} ${n(y - 40 + r() * 80)}" stroke-width="${n(8 + r() * 30)}" stroke-opacity="${n(.08 + r() * .2)}" stroke-linecap="round"/>`; } break;
      case 'paper': { const P = []; for (let y = 0; y <= 5; y++) for (let x = 0; x <= 4; x++) P.push([x * 75 + (y % 2 ? 0 : 20) - 10 + r() * 16, y * 80 + r() * 20]);
        for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) { const a = P[y * 5 + x], b = P[y * 5 + x + 1], c = P[(y + 1) * 5 + x], d = P[(y + 1) * 5 + x + 1];
          g += `<path d="M${n(a[0])} ${n(a[1])} L${n(b[0])} ${n(b[1])} L${n(c[0])} ${n(c[1])}Z" fill="currentColor" fill-opacity="${n(.03 + r() * .14)}" stroke-width=".5"/><path d="M${n(b[0])} ${n(b[1])} L${n(d[0])} ${n(d[1])} L${n(c[0])} ${n(c[1])}Z" fill="currentColor" fill-opacity="${n(.03 + r() * .14)}" stroke-width=".5"/>`; } break; }
      case 'coal': for (let i = 0; i < 16; i++) { const cx = r() * W, cy = r() * H, s = 18 + r() * 40; let d = ''; for (let k = 0; k < 5; k++) { const t = k / 5 * Math.PI * 2 + r(); d += `${k ? 'L' : 'M'}${n(cx + Math.cos(t) * s * (0.6 + r() * .6))} ${n(cy + Math.sin(t) * s * (0.6 + r() * .6))}`; }
        g += `<path d="${d}Z" fill="#000" fill-opacity=".35" stroke-width=".6"/>`; } break;
      case 'sand': for (let i = 0; i < 900; i++) { const x = r() * W, base = 200 + Math.sin(x / 38) * 40; const y = base + (r() - .2) * 220 * r(); g += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(.4 + r() * .9)}" fill="currentColor" stroke="none"/>`; }
        for (let i = 0; i < 5; i++) { const y = 150 + i * 44; g += `<path d="M-10 ${y} C 80 ${y - 30} 200 ${y + 30} 310 ${y - 10}" stroke-width=".5"/>`; } break;
      case 'straw': for (let row = 0; row < 20; row++) for (let col = 0; col < 8; col++) { const x = col * 40 - 10, y = row * 22, dir = (col % 2 ? 1 : -1);
        g += `<line x1="${x}" y1="${y}" x2="${x + 36}" y2="${y + dir * 16 + 16}" stroke-width=".6"/>`; } break;
      case 'thermocol': for (let y = 10; y < H; y += 22) for (let x = (y / 22 % 2) * 11 + 6; x < W; x += 22) { const rr = 3 + r() * 7; g += `<circle cx="${n(x + r() * 4)}" cy="${n(y + r() * 4)}" r="${n(rr)}" stroke-width=".6" fill="currentColor" fill-opacity="${n(r() * .08)}"/>`; } break;
    }
    return `<svg class="motif" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" aria-hidden="true">${g}</svg>`;
  }

  function mediumCards(target) {
    target.innerHTML = BE.categories.map((c, i) => {
      const count = BE.artworks.filter(a => a.category === c.id).length;
      return `<a class="medium-card reveal" style="--d:${(i % 4) * .08}s" href="collection.html?category=${c.id}">
        ${motif(c.id, i + 3)}
        <span class="medium-card__num">${String(i + 1).padStart(2, '0')}</span>
        <div><h3 class="medium-card__name">${c.name}</h3><p class="medium-card__line">${c.line}</p>
          <div class="medium-card__foot"><span>${count ? `${count} work${count > 1 ? 's' : ''}` : 'By commission'}</span>${I.arrow}</div></div>
      </a>`;
    }).join('');
  }

  /* ---------- Header state on scroll ---------- */
  const header = () => $('#site-header');
  function updateHeader() {
    const h = header(); if (!h) return;
    const y = window.scrollY;
    const transparentPage = document.body.dataset.header === 'transparent';
    h.classList.toggle('is-transparent', transparentPage && y < 60 && !(openPanel && openPanel.classList.contains('search-panel')));
    h.classList.toggle('is-condensed', y > 60);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals(root = document) {
    const els = $$('.reveal, .reveal-img, .unbox', root).filter(el => !el.classList.contains('is-in'));
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-in')); return; }
    io = io || new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Hero slideshow ---------- */
  function hero() {
    const slides = $$('.hero__slide'); if (slides.length < 2) return;
    const dots = $('.hero__dots'), cap = $('.hero__meta .caption');
    dots.innerHTML = slides.map((_, i) => `<button aria-label="Show image ${i + 1}"${i ? '' : ' class="is-active"'}></button>`).join('');
    let i = 0, t;
    const go = n => {
      slides[i].classList.remove('is-active'); dots.children[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      void dots.children[i].offsetWidth; dots.children[i].classList.add('is-active');
      if (cap) cap.textContent = slides[i].dataset.caption || '';
      clearTimeout(t); t = setTimeout(() => go(i + 1), 7000);
    };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go([...dots.children].indexOf(b)); });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) t = setTimeout(() => go(1), 7000);
  }

  /* ---------- Lightbox ---------- */
  let lbSet = [], lbI = 0;
  function lightbox(set, i) {
    lbSet = set; lbI = i; showLb(); open('lightbox');
  }
  function showLb() {
    const lb = $('#lightbox'), it = lbSet[lbI];
    const im = $('img', lb); im.src = it.src + '.webp'; im.alt = it.alt || '';
    $('.lb-cap', lb).textContent = it.alt || '';
    $$('.lb-nav', lb).forEach(b => { b.hidden = lbSet.length < 2; });
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.lb-prev')) { lbI = (lbI - 1 + lbSet.length) % lbSet.length; showLb(); }
    if (e.target.closest('.lb-next')) { lbI = (lbI + 1) % lbSet.length; showLb(); }
    const z = e.target.closest('[data-lightbox]');
    if (z) {
      const group = $$(`[data-lightbox="${z.dataset.lightbox}"]`);
      lightbox(group.map(g => ({ src: g.dataset.src, alt: g.dataset.alt })), group.indexOf(z));
    }
  });
  document.addEventListener('keydown', e => {
    if (!openPanel || openPanel.id !== 'lightbox' || lbSet.length < 2) return;
    if (e.key === 'ArrowLeft') { lbI = (lbI - 1 + lbSet.length) % lbSet.length; showLb(); }
    if (e.key === 'ArrowRight') { lbI = (lbI + 1) % lbSet.length; showLb(); }
  });

  /* ---------- Small interactions ---------- */
  function trackNav() {
    $$('[data-track]').forEach(nav => {
      const tr = document.getElementById(nav.dataset.track);
      nav.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; tr.scrollBy({ left: (+b.dataset.dir) * tr.clientWidth * .6, behavior: 'smooth' }); });
    });
  }
  function tiltCards() {
    if (matchMedia('(hover: none)').matches) return;
    $$('[data-tilt]').forEach(card => {
      const stage = card.parentElement;
      stage.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${(x - .5) * 16}deg`); card.style.setProperty('--rx', `${(.5 - y) * 12}deg`);
        card.style.setProperty('--mx', `${x * 100}%`); card.style.setProperty('--my', `${y * 100}%`);
      });
      stage.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }
  function lazyVideo() {
    $$('video[data-autoplay]').forEach(v => {
      if (!('IntersectionObserver' in window)) return;
      new IntersectionObserver(([en]) => { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: .3 }).observe(v);
    });
  }

  /* ======================================================================
     Page renderers
     ====================================================================== */
  function initHome() {
    const feat = $('#featured-grid');
    if (feat) feat.innerHTML = BE.artworks.filter(a => a.featured).slice(0, 6).map((a, i) => artCard(a, { reveal: true, delay: (i % 2) * .12 })).join('');
    const med = $('#medium-grid'); if (med) mediumCards(med);
    const sig = BE.artworks.find(a => a.signature);
    const sc = $('#showcase');
    if (sc && sig) {
      $('[data-sig-img]', sc).innerHTML = img(sig.images[0], `${sig.name} — signature artwork by BUNT ELEGANCE`, { sizes: '(min-width: 1100px) 1100px, 100vw' });
      $('[data-sig-story]', sc).textContent = sig.story;
      $('[data-sig-specs]', sc).innerHTML = [['Collection', sig.collection], ['Medium', BE.findCategory(sig.category).name + ' · ' + sig.format], ['Materials', sig.materials], ['Dimensions', `${sig.dimensions} · ${sig.depth}`], ['Edition', `${sig.edition} — ${sig.editionNote}`]]
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
      $('[data-sig-price]', sc).textContent = price(sig.price);
      $$('[data-sig-add]', sc).forEach(b => { b.dataset.add = sig.id; });
      $$('[data-sig-enq]', sc).forEach(b => { b.dataset.enquire = sig.id; });
      $$('[data-sig-link]', sc).forEach(b => { b.href = `product.html?id=${sig.id}`; });
    }
    const st = $('#stories-list');
    if (st) st.innerHTML = BE.stories.slice(0, 3).map((s, i) => storyBlock(BE.findArtwork(s.id), i)).join('');
  }

  function storyBlock(a, i) {
    return `<article class="story" id="story-${a.id}">
      <a class="frame story__media reveal-img" href="product.html?id=${a.id}">${img(a.images[2] || a.images[0], `${a.name} installed in an interior`, { sizes: '(min-width: 900px) 55vw, 100vw' })}</a>
      <div class="reveal">
        <span class="story__num">Story ${String(i + 1).padStart(2, '0')} — ${esc(a.collection)}</span>
        <h3 class="story__title">${esc(a.name)}</h3>
        <p class="story__text">${esc(a.story)}</p>
        <a class="link story__more" href="stories.html#story-${a.id}">Read the story ${I.arrow}</a>
      </div>
    </article>`;
  }

  function initStories() {
    const st = $('#stories-list');
    if (st) st.innerHTML = BE.stories.map((s, i) => {
      const a = BE.findArtwork(s.id);
      return storyBlock(a, i).replace(`href="stories.html#story-${a.id}">Read the story`, `href="product.html?id=${a.id}">View the artwork`);
    }).join('');
    const jg = $('#journal-grid');
    if (jg) jg.innerHTML = BE.journal.map((j, i) => `<a class="journal-card reveal" style="--d:${i * .1}s" href="#${j.id}">
      <div class="frame">${img(j.image, j.title, { sizes: '(min-width: 800px) 33vw, 100vw' })}</div>
      <span class="tag">${j.tag} · ${j.read}</span><h3>${esc(j.title)}</h3><p>${esc(j.body[0])}</p></a>`).join('');
    const ja = $('#journal-articles');
    if (ja) ja.innerHTML = BE.journal.map(j => `<article class="article" id="${j.id}">
      <div class="frame reveal-img">${img(j.image, j.title, { sizes: '(min-width: 900px) 40vw, 100vw' })}</div>
      <div class="prose reveal"><span class="eyebrow">${j.tag} · ${j.read}</span><h2 style="margin-top:18px">${esc(j.title)}</h2>${j.body.map(p => `<p>${esc(p)}</p>`).join('')}</div>
    </article>`).join('');
  }

  /* ---------- Collection ---------- */
  function initCollection() {
    const grid = $('#product-grid'); if (!grid) return;
    const state = { category: params.get('category') || 'all', room: params.get('room') || 'all', price: params.get('price') || 'all', avail: params.get('avail') || 'all', collection: params.get('collection') || 'all', q: params.get('q') || '', sort: params.get('sort') || 'featured' };
    const chips = $('#cat-chips');
    chips.innerHTML = [['all', 'All works'], ...BE.categories.map(c => [c.id, c.name])].map(([id, n]) => `<button class="chip" data-cat="${id}">${n}</button>`).join('');
    const collections = [...new Set(BE.artworks.map(a => a.collection))];
    const group = (key, opts) => opts.map(([v, l]) => `<button class="chip" data-f="${key}" data-v="${v}">${l}</button>`).join('');
    $('#f-room').innerHTML = group('room', [['all', 'All spaces'], ...BE.rooms.map(r => [r.id, r.name])]);
    $('#f-price').innerHTML = group('price', [['all', 'Any price'], ['u75', 'Under ₹75,000'], ['75-125', '₹75,000 – ₹1,25,000'], ['o125', 'Above ₹1,25,000'], ['request', 'Price on request']]);
    $('#f-avail').innerHTML = group('avail', [['all', 'All'], ['available', 'Available now'], ['made-to-order', 'Made to order'], ['commission', 'By commission']]);
    $('#f-coll').innerHTML = group('collection', [['all', 'All collections'], ...collections.map(c => [c, c])]);
    const qIn = $('#collection-q'); qIn.value = state.q;
    $('#sort').value = state.sort;

    const priceOk = (a, p) => p === 'all' || (p === 'request' ? a.price == null : a.price != null && (p === 'u75' ? a.price < 75000 : p === '75-125' ? a.price >= 75000 && a.price <= 125000 : a.price > 125000));
    function render() {
      let list = BE.artworks.filter(a =>
        (state.category === 'all' || a.category === state.category) &&
        (state.room === 'all' || a.rooms.includes(state.room)) &&
        priceOk(a, state.price) &&
        (state.avail === 'all' || a.status === state.avail) &&
        (state.collection === 'all' || a.collection === state.collection) &&
        (!state.q || matches(a, state.q)));
      const P = a => a.price == null ? Infinity : a.price;
      if (state.sort === 'price-asc') list.sort((a, b) => P(a) - P(b));
      if (state.sort === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
      if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      const cat = BE.findCategory(state.category);
      $('#results-count').textContent = `${list.length} ${list.length === 1 ? 'work' : 'works'}${cat ? ' in ' + cat.name : ''}${state.q ? ` for “${state.q}”` : ''}`;
      $('#coll-title').textContent = cat ? cat.name : 'The Collection';
      $('#coll-line').textContent = cat ? `${cat.line}. Every piece is handcrafted, finished and presented by the BUNT ELEGANCE studio.` : 'Collectible, handcrafted statement works — texture, relief, wood and mixed media — created to define the character of a space.';
      const commission = `<div class="commission-card reveal"><div><span class="eyebrow light eyebrow--plain">Private Commission</span><h3>${cat && !list.length ? `${cat.name} is created by commission` : 'A work made for your wall alone'}</h3><p>Share your space, its light and its dimensions. Our studio will propose sketches, materials and a palette.</p><a class="btn btn--light" href="contact.html?subject=commission${cat ? '&medium=' + encodeURIComponent(cat.name) : ''}">Begin a commission</a></div></div>`;
      grid.innerHTML = list.map((a, i) => artCard(a, { reveal: true, delay: (i % 3) * .08 })).join('') + commission;
      $$('[data-cat]').forEach(b => b.classList.toggle('is-on', b.dataset.cat === state.category));
      $$('[data-f]').forEach(b => b.classList.toggle('is-on', state[b.dataset.f] === b.dataset.v));
      const active = ['room', 'price', 'avail', 'collection'].filter(k => state[k] !== 'all').length;
      $('#filter-count').textContent = active ? `(${active})` : '';
      const u = new URLSearchParams(); Object.entries(state).forEach(([k, v]) => { if (v && v !== 'all' && !(k === 'sort' && v === 'featured')) u.set(k, v); });
      history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
      counts(); observeReveals(grid);
    }
    chips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.category = b.dataset.cat; render(); });
    $('#filter-panel').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; state[b.dataset.f] = b.dataset.v; render(); });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
    qIn.addEventListener('input', () => { state.q = qIn.value.trim(); render(); });
    $('#filter-toggle').addEventListener('click', e => { const p = $('#filter-panel'); p.hidden = !p.hidden; e.currentTarget.setAttribute('aria-expanded', !p.hidden); });
    $('#clear-filters').addEventListener('click', () => { Object.assign(state, { category: 'all', room: 'all', price: 'all', avail: 'all', collection: 'all', q: '' }); qIn.value = ''; render(); });
    render();
    const on = $('.chip.is-on', chips); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  /* ---------- Product ---------- */
  function initProduct() {
    const root = $('#pdp'); if (!root) return;
    const a = BE.findArtwork(params.get('id')) || BE.artworks[0];
    const cat = BE.findCategory(a.category);
    document.title = `${a.name} — ${a.collection} | BUNT ELEGANCE`;
    const md = $('meta[name=description]'); if (md) md.content = `${a.name}: ${a.excerpt} ${cat.name}, ${a.dimensions}. ${a.edition}. Handcrafted statement wall art by BUNT ELEGANCE.`;
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: a.name, description: a.story, brand: { '@type': 'Brand', name: 'BUNT ELEGANCE' }, category: cat.name,
      image: a.images.map(s => new URL(s + '.webp', location.href).href), material: a.materials,
      offers: a.price == null ? undefined : { '@type': 'Offer', price: a.price, priceCurrency: C.currency, availability: a.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', url: location.href } });
    document.head.appendChild(ld);

    const labels = ['The artwork', 'Detail', 'In the interior'];
    const shots = a.images.map((s, i) => ({ src: s, alt: `${a.name} — ${a.images.length === 2 && i === 1 ? 'in context' : labels[i]}` }));
    const mto = a.status !== 'available';
    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="collection.html">Collection</a><span>/</span><a href="collection.html?category=${cat.id}">${cat.name}</a><span>/</span><span aria-current="page">${esc(a.name)}</span></nav>
      <div class="pdp__grid">
        <div class="gallery">
          <div class="gallery__thumbs" role="tablist" aria-label="Artwork images">
            ${shots.map((s, i) => `<button role="tab" aria-selected="${!i}" class="${i ? '' : 'is-on'}" data-shot="${i}" aria-label="${esc(s.alt)}"><img src="${s.src}-sm.webp" alt="" loading="lazy"></button>`).join('')}
          </div>
          <div class="gallery__main" id="gallery-main" tabindex="0" aria-label="Open image viewer">
            <img id="gallery-img" src="${shots[0].src}.webp" alt="${esc(shots[0].alt)}" fetchpriority="high">
            <div class="zoom-lens" id="zoom-lens"></div>
            <span class="gallery__hint">Hover to zoom · Click to enlarge</span>
          </div>
        </div>
        <div class="pdp__info">
          <span class="eyebrow">${esc(a.collection)} · ${cat.name}</span>
          <h1>${esc(a.name)}</h1>
          <p class="lead muted">${esc(a.excerpt)}</p>
          <p class="pdp__price">${price(a.price)}</p>
          <p class="tax-note">${a.price == null ? 'Quoted on your dimensions and materials.' : 'Inclusive of taxes · Insured shipping across India included.'}</p>
          <p class="avail${mto ? ' mto' : ''}">${esc(a.availability)}</p>
          <dl class="pdp__specs">
            <div><dt>Format</dt><dd>${esc(a.format)}</dd></div>
            <div><dt>Dimensions</dt><dd>${esc(a.dimensions)}<br><span class="muted small">${esc(a.depth)}</span></dd></div>
            <div><dt>Materials</dt><dd>${esc(a.materials)}</dd></div>
            <div><dt>Edition</dt><dd>${esc(a.edition)}<br><span class="muted small">${esc(a.editionNote)}</span></dd></div>
          </dl>
          <div class="pdp__actions">
            ${a.price == null ? `<button class="btn" data-enquire="${a.id}">Begin commission</button>` : `<button class="btn" data-add="${a.id}">Add to cart</button>`}
            <button class="wish-lg" data-wish="${a.id}" aria-label="Save to wishlist" aria-pressed="false">${wishIcon}</button>
            <button class="btn btn--ghost" data-enquire="${a.id}">Enquire</button>
          </div>
          <button class="vii-btn" data-vii>${I.room} View in interior</button>
          <div class="assurances">
            <div>${I.cert}Certificate of Authenticity</div><div>${I.ship}Insured, crated delivery</div><div>${I.ret}7-day return window</div>
          </div>
          <div class="accordion">
            <details open><summary>Artwork story</summary><div class="acc-body"><p>${esc(a.story)}</p></div></details>
            <details><summary>Craftsmanship</summary><div class="acc-body"><p>Every surface is built by hand in layers — sculpted, dried, refined and sealed over several days. Metallic accents are applied individually and burnished to catch raking light.</p><ul><li>Archival, low-VOC mediums and fade-resistant pigments</li><li>Hand-finished float frame, mitred and sealed</li><li>Signed by the studio on the reverse</li></ul></div></details>
            <details><summary>Certificate of Authenticity</summary><div class="acc-body"><p>${/Unique|1 of 1|Limited/.test(a.edition) ? 'This work is accompanied by a numbered Certificate of Authenticity recording the title, edition number, dimensions, materials, date and studio signature.' : 'Eligible works are accompanied by a Certificate of Authenticity.'} A QR code on the certificate links to our verification page; NFC tags are embedded where applicable.</p><p><a class="link" href="certificate.html">About our certificates ${I.arrow}</a></p></div></details>
            <details><summary>Care instructions</summary><div class="acc-body"><ul><li>Remove dust from the textured surface with a hand air pump.</li><li>Use a long, soft brush for gentle surface dusting.</li><li>Wipe the frame with a dry microfiber cloth.</li><li>Use a hard brush only on the frame, where appropriate.</li><li>Keep away from direct sunlight, water and humidity.</li></ul><p><a class="link" href="care.html">Full care guide ${I.arrow}</a></p></div></details>
            <details><summary>Shipping</summary><div class="acc-body"><p>Complimentary insured shipping across India in a custom crate with corner protection. International delivery is available on request and quoted individually. Dispatch timelines are shown under availability.</p><p><a class="link" href="shipping.html">Shipping details ${I.arrow}</a></p></div></details>
            <details><summary>Returns</summary><div class="acc-body"><p>Ready-to-ship works may be returned within 7 days of delivery in original packaging and condition. Made-to-order and commissioned works are final sale. Transit damage is covered in full.</p><p><a class="link" href="shipping.html#returns">Returns policy ${I.arrow}</a></p></div></details>
          </div>
        </div>
      </div>`;

    // gallery + zoom
    let cur = 0;
    const main = $('#gallery-main'), gi = $('#gallery-img'), lens = $('#zoom-lens');
    const setShot = i => {
      cur = i; gi.style.opacity = 0;
      setTimeout(() => { gi.src = shots[i].src + '.webp'; gi.alt = shots[i].alt; gi.classList.toggle('cover', i > 0); gi.style.opacity = 1; }, 180);
      lens.style.backgroundImage = `url(${shots[i].src}.webp)`;
      $$('[data-shot]').forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-selected', k === i); });
    };
    lens.style.backgroundImage = `url(${shots[0].src}.webp)`;
    $('.gallery__thumbs').addEventListener('click', e => { const b = e.target.closest('[data-shot]'); if (b) setShot(+b.dataset.shot); });
    if (matchMedia('(hover: hover)').matches) {
      main.addEventListener('pointerenter', () => lens.classList.add('on'));
      main.addEventListener('pointerleave', () => lens.classList.remove('on'));
      main.addEventListener('pointermove', e => { const r = main.getBoundingClientRect(); lens.style.backgroundPosition = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; });
    } else { $('.gallery__hint').textContent = 'Tap to enlarge'; }
    main.addEventListener('click', () => lightbox(shots, cur));
    main.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lightbox(shots, cur); } });

    // related
    const rel = $('#related');
    if (rel) rel.innerHTML = BE.artworks.filter(x => x.id !== a.id).sort((x, y) => (y.category === a.category) - (x.category === a.category) || (y.collection === a.collection) - (x.collection === a.collection)).slice(0, 3).map((x, i) => artCard(x, { reveal: true, delay: i * .1 })).join('');

    // sticky mobile buy bar
    const sb = $('#sticky-buy');
    if (sb) {
      sb.innerHTML = `<div class="t"><b>${esc(a.name)}</b><span>${price(a.price)}</span></div>${a.price == null ? `<button class="btn" data-enquire="${a.id}">Enquire</button>` : `<button class="btn" data-add="${a.id}">Add to cart</button>`}`;
      const target = $('.pdp__actions');
      new IntersectionObserver(([en]) => { const on = !en.isIntersecting && en.boundingClientRect.top < 0; sb.classList.toggle('is-on', on); document.body.classList.toggle('has-sticky', on); }).observe(target);
    }
    viewInInterior(a);
  }

  /* ---------- View in interior ---------- */
  function viewInInterior(a) {
    const m = $('#vii'); if (!m) return;
    let room = BE.viewRooms[0], scale = 1, pos = null;
    const stage = $('.vii__stage', m), art = $('.vii__art', m);
    art.innerHTML = `<img src="${a.images[0]}.webp" alt="${esc(a.name)} placed on the wall" draggable="false">`;
    $('[data-vii-name]', m).textContent = a.name;
    $('[data-vii-size]', m).textContent = a.dimensions;
    const req = $('.vii__panel .btn', m);
    req.removeAttribute('data-open'); req.removeAttribute('data-close'); req.dataset.enquire = a.id;
    $('#vii-rooms').innerHTML = BE.viewRooms.map((r, i) => `<button class="chip${i ? '' : ' is-on'}" data-room="${r.id}">${r.name}</button>`).join('');
    function draw() {
      const roomImg = $('img.room', stage);
      stage.classList.toggle('gallery-wall', !room.src);
      if (room.src) { roomImg.hidden = false; roomImg.src = room.src + '.webp'; roomImg.alt = `${room.name} interior`; } else roomImg.hidden = true;
      art.style.width = Math.min(90, a.size.w * room.cmToPct * scale) + '%';
      art.style.left = (pos ? pos.x : room.x) + '%';
      art.style.bottom = (pos ? pos.b : room.bottom) + '%';
    }
    $('#vii-rooms').addEventListener('click', e => { const b = e.target.closest('[data-room]'); if (!b) return; room = BE.viewRooms.find(r => r.id === b.dataset.room); pos = null; $$('[data-room]', m).forEach(x => x.classList.toggle('is-on', x === b)); draw(); });
    $('#vii-scale').addEventListener('input', e => { scale = +e.target.value; draw(); });
    // drag to reposition
    let drag = null;
    art.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, l: parseFloat(art.style.left), b: parseFloat(art.style.bottom) }; art.setPointerCapture(e.pointerId); art.style.transition = 'none'; art.style.cursor = 'grabbing'; });
    art.addEventListener('pointermove', e => {
      if (!drag) return; const r = stage.getBoundingClientRect();
      pos = { x: Math.max(5, Math.min(95, drag.l + (e.clientX - drag.x) / r.width * 100)), b: Math.max(0, Math.min(80, drag.b - (e.clientY - drag.y) / r.height * 100)) };
      art.style.left = pos.x + '%'; art.style.bottom = pos.b + '%';
    });
    art.addEventListener('pointerup', () => { drag = null; art.style.transition = ''; art.style.cursor = ''; });
    document.addEventListener('click', e => { if (e.target.closest('[data-vii]')) { draw(); open('vii'); } });
  }

  /* ---------- Contact page pre-fill ---------- */
  function initContact() {
    const f = $('#contact-form'); if (!f) return;
    const s = params.get('subject'), art = params.get('artwork'), med = params.get('medium');
    const map = { commission: 'Private commission', collector: 'Collector Privilege', trade: 'Trade & interior designers', verify: 'Certificate verification' };
    if (s && map[s]) f.subject.value = map[s];
    if (art) { const a = BE.findArtwork(art); if (a) f.message.value = `I am interested in ${a.name}.`; }
    if (med) f.message.value = `I would like to commission a piece in ${med}.`;
  }

  /* ---------- Boot ---------- */
  renderHeader(); renderFooter(); renderGlobalUI();
  if (page === 'home') initHome();
  if (page === 'collection') initCollection();
  if (page === 'product') initProduct();
  if (page === 'stories') initStories();
  if (page === 'contact') initContact();
  const medOnly = $('#medium-grid'); if (medOnly && !medOnly.children.length) mediumCards(medOnly);
  counts(); updateHeader(); hero(); trackNav(); tiltCards(); lazyVideo(); observeReveals();
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => t.scrollIntoView(), 60); }

  BE.ui = { open, close, toast, addToCart, enquire };
})();
