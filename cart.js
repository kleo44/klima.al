/* KLIMA.AL — Cart (localStorage + WhatsApp checkout) */

const CART_KEY = 'klima-cart';
const WA_NUMBER = '355672549225';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
  renderCartDrawer();
}

function getCartCount() {
  return loadCart().reduce((sum, it) => sum + (it.qty || 1), 0);
}

function addToCart(item) {
  const items = loadCart();
  const existing = items.find(it => it.id === item.id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else items.push({ ...item, qty: 1 });
  saveCart(items);
  flashCartBadge();
  showCartToast(item);
}

function showCartToast(item) {
  const lang = localStorage.getItem('klima-lang') || 'sq';
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="cart-toast-icon">✓</div>
    <div class="cart-toast-body">
      <div class="cart-toast-line1">${lang === 'sq' ? 'Shtuar në shportë' : 'Added to cart'}</div>
      <div class="cart-toast-line2">${escapeHtml(item.title)}</div>
    </div>
    <button class="cart-toast-view" type="button">${lang === 'sq' ? 'Shiko' : 'View'}</button>
  `;
  toast.querySelector('.cart-toast-view').onclick = () => { hideCartToast(); openCartDrawer(); };
  toast.classList.add('show');
  clearTimeout(showCartToast._t);
  showCartToast._t = setTimeout(hideCartToast, 2800);
}
function hideCartToast() {
  document.getElementById('cartToast')?.classList.remove('show');
}

function removeFromCart(id) {
  saveCart(loadCart().filter(it => it.id !== id));
}

function setQty(id, qty) {
  const items = loadCart();
  const item = items.find(it => it.id === id);
  if (!item) return;
  if (qty <= 0) removeFromCart(id);
  else { item.qty = qty; saveCart(items); }
}

function clearCart() { saveCart([]); }

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

function flashCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.classList.remove('flash');
  void badge.offsetWidth;
  badge.classList.add('flash');
}

let __cartLastFocus = null;
function openCartDrawer() {
  __cartLastFocus = document.activeElement;
  const d = document.getElementById('cartDrawer');
  d?.classList.add('open');
  document.getElementById('cartBackdrop')?.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('cartClose')?.focus(), 50);
}
function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartBackdrop')?.classList.remove('show');
  document.body.style.overflow = '';
  if (__cartLastFocus && typeof __cartLastFocus.focus === 'function') {
    setTimeout(() => __cartLastFocus.focus(), 50);
  }
}

// Focus trap inside the cart drawer
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const drawer = document.getElementById('cartDrawer');
  if (!drawer?.classList.contains('open')) return;
  const focusable = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

function priceToNumber(priceText) {
  if (!priceText) return null;
  const m = String(priceText).replace(/[\s ]/g, '').match(/([\d.,]+)/);
  if (!m) return null;
  return parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
}

function formatPrice(n, suffix) {
  return n.toLocaleString('sq-AL', { maximumFractionDigits: 0 }).replace(/,/g, ' ') + ' ' + (suffix || 'L');
}

function getCartTotal() {
  const items = loadCart();
  let total = 0;
  let hasOnRequest = false;
  let suffix = 'L';
  for (const it of items) {
    const n = priceToNumber(it.price_text);
    if (n == null) hasOnRequest = true;
    else {
      total += n * (it.qty || 1);
      if (String(it.price_text).includes('€')) suffix = '€';
    }
  }
  return { total, hasOnRequest, suffix };
}

function renderCartDrawer() {
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');
  const empty = document.getElementById('cartEmpty');
  const checkoutBtn = document.getElementById('cartCheckout');
  if (!list) return;

  const items = loadCart();
  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (totalEl) totalEl.textContent = '';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  if (empty) empty.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;

  list.innerHTML = items.map(it => `
    <div class="cart-item" data-id="${escapeHtml(it.id)}">
      <div class="cart-item-img">
        ${it.image ? `<img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" loading="lazy" />` : ''}
      </div>
      <div class="cart-item-body">
        <div class="cart-item-name">${escapeHtml(it.title)}</div>
        ${it.subtitle ? `<div class="cart-item-sub">${escapeHtml(it.subtitle)}</div>` : ''}
        <div class="cart-item-price">${escapeHtml(it.price_text || 'Me kërkesë')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="cart-qty-btn" data-act="dec" aria-label="Zvogëlo sasinë">−</button>
        <span class="cart-qty-num">${it.qty || 1}</span>
        <button class="cart-qty-btn" data-act="inc" aria-label="Rrit sasinë">+</button>
      </div>
      <button class="cart-item-rm" data-act="rm" aria-label="Hiq nga shporta">×</button>
    </div>
  `).join('');

  const { total, hasOnRequest, suffix } = getCartTotal();
  if (totalEl) {
    if (total === 0 && hasOnRequest) totalEl.textContent = 'Me kërkesë';
    else if (hasOnRequest) totalEl.textContent = formatPrice(total, suffix) + ' + Me kërkesë';
    else totalEl.textContent = formatPrice(total, suffix);
  }

  list.querySelectorAll('.cart-item').forEach(el => {
    const id = el.dataset.id;
    el.querySelector('[data-act="inc"]').onclick = () => {
      const item = loadCart().find(it => it.id === id);
      if (item) setQty(id, (item.qty || 1) + 1);
    };
    el.querySelector('[data-act="dec"]').onclick = () => {
      const item = loadCart().find(it => it.id === id);
      if (item) setQty(id, (item.qty || 1) - 1);
    };
    el.querySelector('[data-act="rm"]').onclick = () => removeFromCart(id);
  });
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function checkoutWhatsApp() {
  const items = loadCart();
  if (items.length === 0) return;
  const lang = localStorage.getItem('klima-lang') || 'sq';

  const lines = items.map(it => {
    const qty = it.qty || 1;
    const price = it.price_text || (lang === 'sq' ? 'Me kërkesë' : 'On request');
    return `• ${qty}× ${it.title} — ${price}`;
  });

  const { total, hasOnRequest, suffix } = getCartTotal();
  let totalLine;
  if (total === 0 && hasOnRequest) totalLine = lang === 'sq' ? 'Total: Me kërkesë' : 'Total: On request';
  else if (hasOnRequest) totalLine = (lang === 'sq' ? 'Total: ' : 'Total: ') + formatPrice(total, suffix) + (lang === 'sq' ? ' + Me kërkesë' : ' + on request');
  else totalLine = (lang === 'sq' ? 'Total: ' : 'Total: ') + formatPrice(total, suffix);

  const greeting = lang === 'sq'
    ? 'Përshëndetje Klima.Al, dëshiroj të porosis këto produkte:'
    : 'Hello Klima.Al, I would like to order these products:';

  const msg = [greeting, '', ...lines, '', totalLine].join('\n');
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  // Clear cart + show success state so the user knows the order was sent
  clearCart();
  showCheckoutSuccess(lang);
}

function showCheckoutSuccess(lang) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const list = document.getElementById('cartList');
  const empty = document.getElementById('cartEmpty');
  if (empty) empty.style.display = 'none';
  if (list) list.innerHTML = `
    <div class="cart-success" role="status" aria-live="polite">
      <div class="cart-success-icon">✓</div>
      <h4>${lang === 'sq' ? 'Mesazhi u dërgua' : 'Message sent'}</h4>
      <p>${lang === 'sq' ? 'Do t\\'ju kontaktojmë në WhatsApp brenda pak minutash. Faleminderit!' : 'We\\'ll reply on WhatsApp shortly. Thank you!'}</p>
      <a href="index.html#cat" class="btn btn-red">${lang === 'sq' ? 'Vazhdo blerjet' : 'Continue shopping'}</a>
    </div>
  `;
}

function wireMaterialeRows() {
  document.querySelectorAll('.cat-row').forEach(row => {
    if (row.querySelector('.cat-row-atc')) return;
    const nameEl  = row.querySelector('.cat-row-name');
    const priceEl = row.querySelector('.cat-row-price');
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    const priceText = priceEl ? priceEl.textContent.trim() : null;
    const id = 'mat-' + name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

    const btn = document.createElement('button');
    btn.className = 'atc-btn atc-sm cat-row-atc';
    btn.setAttribute('data-sq', '+ Shportë');
    btn.setAttribute('data-en', '+ Cart');
    btn.textContent = '+ Shportë';
    btn.addEventListener('click', e => {
      e.preventDefault();
      addToCart({ id, title: name, price_text: priceText, image: null });
    });
    row.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cartClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartBackdrop')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartCheckout')?.addEventListener('click', checkoutWhatsApp);
  wireMaterialeRows();
  updateCartBadge();
  renderCartDrawer();
});

window.klimaCart = { add: addToCart, remove: removeFromCart, count: getCartCount, open: openCartDrawer };
