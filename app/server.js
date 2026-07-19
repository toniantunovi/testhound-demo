'use strict';

/**
 * Acme Shop storefront for the TestHound demo.
 *
 * Zero dependencies (Node built-in http + crypto only). Implements a small but
 * complete storefront so every manual test case in ./testhound has a real flow
 * to run against:
 *
 *   GET  /                landing (precondition surface)
 *   GET  /login           login form (labelled email + password fields)
 *   POST /login           validates credentials, sets a session cookie, 302 -> /dashboard
 *   GET  /dashboard       requires the session cookie, else 302 -> /login
 *   POST /logout          clears the auth session (keeps the anonymous cart)
 *   GET  /products        product grid
 *   GET  /product/:id     product detail with "Add to cart"
 *   POST /cart/add        add / increment a line item, 302 back to the product
 *   POST /cart/remove     remove a line item, 302 back to the cart
 *   GET  /cart            cart with line items, tax region selector, totals
 *   GET  /search?q=       product search by title
 *   GET  /profile         profile form (display name)
 *   POST /profile         save the display name, 302 -> /profile
 *
 * State (cart, chosen tax region, display name) is per browser, keyed by an
 * anonymous `acme_sid` cookie that is independent of auth. That keeps parallel
 * Playwright workers isolated from one another and lets the cart survive a
 * logout / login (TC-0010).
 *
 * Valid login credentials come from the environment so nothing is baked into
 * source: ACME_EMAIL, ACME_PASSWORD (demo defaults below for the showcase).
 */

const http = require('http');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const VALID_EMAIL = process.env.ACME_EMAIL || 'demo@acme.example';
const VALID_PASSWORD = process.env.ACME_PASSWORD || 'demo1234';
const SESSION_COOKIE = 'acme_session';
const SESSION_VALUE = 'ok';
const SID_COOKIE = 'acme_sid';

// Prices are integer cents to avoid floating-point drift.
const PRODUCTS = [
  { id: 'blue-mug', title: 'Blue Mug', price: 1200, blurb: 'A calm ceramic mug in cobalt blue.' },
  { id: 'red-mug', title: 'Red Mug', price: 1200, blurb: 'The same mug, in a confident red.' },
  { id: 'travel-mug', title: 'Travel Mug', price: 1850, blurb: 'Insulated stainless steel, spill-proof lid.' },
  { id: 'notebook', title: 'Notebook', price: 600, blurb: 'Dotted A5 notebook, 120 gsm paper.' },
  { id: 'gel-pen', title: 'Gel Pen', price: 325, blurb: 'Smooth 0.5mm black gel pen.' },
];

// Tax regions. Rate is a fraction applied to the subtotal.
const TAX_REGIONS = [
  { id: '', label: 'Select a region', rate: 0 },
  { id: 'OR', label: 'Oregon (no sales tax)', rate: 0 },
  { id: 'CA', label: 'California (8.25%)', rate: 0.0825 },
  { id: 'NY', label: 'New York (8.875%)', rate: 0.08875 },
];

const productById = (id) => PRODUCTS.find((p) => p.id === id);
const regionById = (id) => TAX_REGIONS.find((r) => r.id === id) || TAX_REGIONS[0];

// --- per-session state -----------------------------------------------------

/** sid -> { cart: [{id, qty}], region: string, displayName: string } */
const sessions = new Map();

function getSession(sid) {
  let s = sessions.get(sid);
  if (!s) {
    s = { cart: [], region: '', displayName: '' };
    sessions.set(sid, s);
  }
  return s;
}

const cartCount = (session) => session.cart.reduce((n, l) => n + l.qty, 0);

function money(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// --- rendering -------------------------------------------------------------

function layout(title, body, { session } = {}) {
  const count = session ? cartCount(session) : 0;
  const displayName = session && session.displayName ? session.displayName : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · Acme Shop</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; margin: 0; background: #f5f6f8; color: #14181f; }
    header { background: #1f2933; color: #fff; padding: 14px 24px; display: flex; align-items: center; gap: 16px; }
    header .brand { font-weight: 700; letter-spacing: .3px; font-size: 18px; text-decoration: none; color: #fff; }
    header nav { display: flex; gap: 16px; margin-left: auto; align-items: center; font-size: 14px; }
    header nav a { color: #cdd5df; text-decoration: none; }
    header nav a:hover { color: #fff; }
    .greeting { color: #9aa5b1; font-size: 14px; }
    .cart-link { position: relative; }
    .badge { display: inline-block; min-width: 20px; text-align: center; padding: 1px 6px; margin-left: 4px;
             background: #3b6ef5; color: #fff; border-radius: 999px; font-size: 12px; font-weight: 700; }
    main { max-width: 720px; margin: 40px auto; padding: 0 20px; }
    .card { background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 6px 24px rgba(0,0,0,.08); }
    .narrow { max-width: 420px; }
    h1 { margin-top: 0; font-size: 22px; }
    label { display: block; margin: 16px 0 6px; font-weight: 600; font-size: 14px; }
    input, select { width: 100%; padding: 10px 12px; border: 1px solid #cbd2d9; border-radius: 8px;
             font-size: 15px; background: #fff; color: #14181f; }
    button { margin-top: 16px; padding: 10px 16px; border: 0; border-radius: 8px; background: #3b6ef5;
             color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; }
    button.secondary { background: #e4e7eb; color: #1f2933; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .tile { background: #fff; padding: 18px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.06); }
    .tile h2 { font-size: 17px; margin: 0 0 4px; }
    .price { font-weight: 700; }
    .muted { color: #667085; font-size: 14px; }
    .error { margin-top: 16px; color: #b42318; font-size: 14px; }
    .toast { margin-bottom: 20px; padding: 12px 16px; background: #ecfdf3; border: 1px solid #abefc6;
             color: #067647; border-radius: 8px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #eaecf0; font-size: 15px; }
    tfoot td { border-bottom: 0; }
    .totals td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
    a { color: #3b6ef5; }
  </style>
</head>
<body>
  <header data-testid="site-header">
    <a class="brand" href="/" data-testid="brand">Acme Shop</a>
    ${displayName ? `<span class="greeting" data-testid="header-display-name">Hi, ${escapeHtml(displayName)}</span>` : ''}
    <nav>
      <a href="/products" data-testid="nav-products">Products</a>
      <a href="/search" data-testid="nav-search">Search</a>
      <a href="/profile" data-testid="nav-profile">Profile</a>
      <a class="cart-link" href="/cart" data-testid="cart-link">Cart<span class="badge" data-testid="cart-badge">${count}</span></a>
    </nav>
  </header>
  <main>${body}</main>
</body>
</html>`;
}

function loginPage({ error } = {}) {
  return layout('Log in', `
    <div class="card narrow">
      <h1>Log in</h1>
      <p class="muted">Welcome back to the Acme Shop storefront.</p>
      <form method="POST" action="/login" data-testid="login-form">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="username"
               data-testid="login-email" required />

        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password"
               data-testid="login-password" required />

        ${error ? `<p class="error" role="alert" data-testid="login-error">${escapeHtml(error)}</p>` : ''}

        <button type="submit" data-testid="login-submit">Log in</button>
      </form>
    </div>`);
}

function dashboardPage(session) {
  return layout('Dashboard', `
    <div class="card" data-testid="dashboard">
      <h1>Dashboard</h1>
      <p class="muted">You are signed in to Acme Shop.</p>
      <form method="POST" action="/logout">
        <button type="submit" class="secondary" data-testid="logout">Log out</button>
      </form>
    </div>`, { session });
}

function landingPage(session) {
  return layout('Storefront', `
    <div class="card">
      <h1>Acme Shop</h1>
      <p class="muted">The Acme Shop storefront.</p>
      <p><a href="/products" data-testid="nav-products-cta">Browse products</a> · <a href="/login" data-testid="nav-login">Log in</a></p>
    </div>`, { session });
}

function productsPage(session, items = PRODUCTS, { heading = 'Products' } = {}) {
  const tiles = items.map((p) => `
    <div class="tile" data-testid="product-tile" data-product-id="${p.id}">
      <h2><a href="/product/${p.id}" data-testid="product-link">${escapeHtml(p.title)}</a></h2>
      <p class="price" data-testid="product-price">${money(p.price)}</p>
    </div>`).join('');
  return layout(heading, `
    <h1>${escapeHtml(heading)}</h1>
    <div class="grid" data-testid="product-grid">${tiles || '<p class="muted">No products.</p>'}</div>`,
  { session });
}

function productPage(session, product, { added } = {}) {
  return layout(product.title, `
    ${added ? '<div class="toast" role="status" data-testid="toast">Added to cart</div>' : ''}
    <div class="card" data-testid="product-detail" data-product-id="${product.id}">
      <h1 data-testid="product-title">${escapeHtml(product.title)}</h1>
      <p class="muted">${escapeHtml(product.blurb)}</p>
      <p class="price" data-testid="product-price">${money(product.price)}</p>
      <form method="POST" action="/cart/add">
        <input type="hidden" name="id" value="${product.id}" />
        <button type="submit" data-testid="product-add-to-cart">Add to cart</button>
      </form>
    </div>`, { session });
}

function cartPage(session) {
  const lines = session.cart
    .map((line) => ({ line, product: productById(line.id) }))
    .filter((x) => x.product);

  if (lines.length === 0) {
    return layout('Cart', `
      <h1>Your cart</h1>
      <div class="card" data-testid="cart-empty">
        <p class="muted">Your cart is empty.</p>
        <p><a href="/products" data-testid="browse-products">Browse products</a></p>
      </div>`, { session });
  }

  const subtotal = lines.reduce((sum, { line, product }) => sum + product.price * line.qty, 0);
  const region = regionById(session.region);
  const tax = Math.round(subtotal * region.rate);
  const total = subtotal + tax;

  const rows = lines.map(({ line, product }) => `
    <tr data-testid="cart-item" data-product-id="${product.id}">
      <td data-testid="cart-item-title">${escapeHtml(product.title)}</td>
      <td data-testid="cart-item-qty">${line.qty}</td>
      <td data-testid="cart-item-price">${money(product.price * line.qty)}</td>
      <td>
        <form method="POST" action="/cart/remove">
          <input type="hidden" name="id" value="${product.id}" />
          <button type="submit" class="secondary" data-testid="cart-remove" aria-label="Remove ${escapeHtml(product.title)}">Remove</button>
        </form>
      </td>
    </tr>`).join('');

  const regionOptions = TAX_REGIONS.map((r) =>
    `<option value="${r.id}"${r.id === session.region ? ' selected' : ''}>${escapeHtml(r.label)}</option>`).join('');

  return layout('Cart', `
    <h1>Your cart</h1>
    <div class="card">
      <table data-testid="cart-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <form method="GET" action="/cart">
        <label for="region">Tax region</label>
        <select id="region" name="region" data-testid="tax-region">${regionOptions}</select>
        <button type="submit" class="secondary" data-testid="apply-tax">Apply</button>
      </form>

      <table class="totals">
        <tfoot>
          <tr><td>Subtotal</td><td data-testid="cart-subtotal">${money(subtotal)}</td></tr>
          <tr><td>Tax</td><td data-testid="cart-tax">${money(tax)}</td></tr>
          <tr><td><strong>Total</strong></td><td data-testid="cart-total"><strong>${money(total)}</strong></td></tr>
        </tfoot>
      </table>
    </div>`, { session });
}

function searchPage(session, query) {
  const q = (query || '').trim();
  const results = q
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
    : [];
  const resultTiles = results.map((p) => `
    <li class="tile" data-testid="search-result" data-product-id="${p.id}">
      <a href="/product/${p.id}" data-testid="product-link">${escapeHtml(p.title)}</a>
      <span class="price">${money(p.price)}</span>
    </li>`).join('');

  return layout('Search', `
    <h1>Search</h1>
    <div class="card">
      <form method="GET" action="/search" role="search">
        <label for="q">Search products</label>
        <input id="q" name="q" type="search" value="${escapeHtml(q)}"
               placeholder="Try &quot;mug&quot;" data-testid="search-input" />
        <button type="submit" data-testid="search-submit">Search</button>
      </form>
      ${q ? `<ul data-testid="search-results" style="list-style:none;padding:0;display:grid;gap:12px;margin-top:20px;">
        ${resultTiles || '<li class="muted" data-testid="search-empty">No products match your search.</li>'}
      </ul>` : ''}
    </div>`, { session });
}

function profilePage(session, { saved } = {}) {
  return layout('Profile', `
    ${saved ? '<div class="toast" role="status" data-testid="toast">Profile saved</div>' : ''}
    <div class="card narrow">
      <h1>Profile</h1>
      <p class="muted">Set the display name shown in the header.</p>
      <form method="POST" action="/profile" data-testid="profile-form">
        <label for="displayName">Display name</label>
        <input id="displayName" name="displayName" type="text"
               value="${escapeHtml(session.displayName || '')}" data-testid="profile-display-name" />
        <button type="submit" data-testid="profile-save">Save</button>
      </form>
    </div>`, { session });
}

// --- request plumbing ------------------------------------------------------

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header.split(';').map((c) => c.trim()).filter(Boolean).map((c) => {
      const i = c.indexOf('=');
      return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
    }),
  );
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => resolve(new URLSearchParams(data)));
  });
}

function send(res, status, html, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const cookies = parseCookies(req);
  const isAuthed = cookies[SESSION_COOKIE] === SESSION_VALUE;

  // Every browser gets a stable anonymous session id so per-session state
  // (cart, tax region, display name) is isolated across parallel test workers.
  let sid = cookies[SID_COOKIE];
  const extraHeaders = {};
  if (!sid) {
    sid = crypto.randomUUID();
    extraHeaders['Set-Cookie'] = `${SID_COOKIE}=${sid}; Path=/; SameSite=Lax`;
  }
  const session = getSession(sid);
  const html = (status, markup, headers = {}) => send(res, status, markup, { ...extraHeaders, ...headers });
  const redirect = (location, headers = {}) => send(res, 302, '', { ...extraHeaders, ...headers, Location: location });

  // --- landing / auth (unchanged behavior) ---
  if (req.method === 'GET' && path === '/') {
    return html(200, landingPage(session));
  }

  if (req.method === 'GET' && path === '/login') {
    return html(200, loginPage());
  }

  if (req.method === 'POST' && path === '/login') {
    const body = await readBody(req);
    const email = (body.get('email') || '').trim();
    const password = body.get('password') || '';
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      return html(302, '', {
        'Set-Cookie': `${SESSION_COOKIE}=${SESSION_VALUE}; Path=/; HttpOnly; SameSite=Lax`,
        Location: '/dashboard',
      });
    }
    return html(401, loginPage({ error: 'Invalid email or password.' }));
  }

  if (req.method === 'GET' && path === '/dashboard') {
    if (!isAuthed) return redirect('/login');
    return html(200, dashboardPage(session));
  }

  if (req.method === 'POST' && path === '/logout') {
    // Clears the auth session only; the anonymous cart (keyed by acme_sid) survives.
    return html(302, '', {
      'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0`,
      Location: '/login',
    });
  }

  // --- products ---
  if (req.method === 'GET' && path === '/products') {
    return html(200, productsPage(session));
  }

  if (req.method === 'GET' && path.startsWith('/product/')) {
    const product = productById(path.slice('/product/'.length));
    if (!product) return html(404, layout('Not found', '<div class="card"><h1>404</h1><p class="muted">No such product.</p></div>', { session }));
    return html(200, productPage(session, product, { added: url.searchParams.get('added') === '1' }));
  }

  // --- cart ---
  if (req.method === 'POST' && path === '/cart/add') {
    const body = await readBody(req);
    const id = body.get('id') || '';
    const product = productById(id);
    if (product) {
      const line = session.cart.find((l) => l.id === id);
      if (line) line.qty += 1;
      else session.cart.push({ id, qty: 1 });
      return redirect(`/product/${id}?added=1`);
    }
    return redirect('/products');
  }

  if (req.method === 'POST' && path === '/cart/remove') {
    const body = await readBody(req);
    const id = body.get('id') || '';
    session.cart = session.cart.filter((l) => l.id !== id);
    return redirect('/cart');
  }

  if (req.method === 'GET' && path === '/cart') {
    if (url.searchParams.has('region')) {
      session.region = regionById(url.searchParams.get('region')).id;
    }
    return html(200, cartPage(session));
  }

  // --- search ---
  if (req.method === 'GET' && path === '/search') {
    return html(200, searchPage(session, url.searchParams.get('q')));
  }

  // --- profile ---
  if (req.method === 'GET' && path === '/profile') {
    return html(200, profilePage(session, { saved: url.searchParams.get('saved') === '1' }));
  }

  if (req.method === 'POST' && path === '/profile') {
    const body = await readBody(req);
    session.displayName = (body.get('displayName') || '').trim();
    return redirect('/profile?saved=1');
  }

  return html(404, layout('Not found', '<div class="card"><h1>404</h1><p class="muted">Nothing here.</p></div>', { session }));
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Acme Shop demo running at http://localhost:${PORT}`);
});
