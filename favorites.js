/* KLIMA.AL — Favorites + Compare (localStorage) */

const FAV_KEY = 'klima-favorites';

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch { return []; }
}
function saveFavs(ids) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  updateFavBadge();
  renderFavDrawer();
  syncFavHearts();
}
function isFav(id) { return loadFavs().includes(id); }

function toggleFav(id, productMeta) {
  const ids = loadFavs();
  const idx = ids.indexOf(id);
  if (idx >= 0) {
    ids.splice(idx, 1);
    // remove cached meta
    const cache = loadFavCache();
    delete cache[id];
    saveFavCache(cache);
  } else {
    if (ids.length >= 4) {
      flashFavToast(localStorage.getItem('klima-lang') === 'en'
        ? 'You can compare up to 4 products. Remove one first.'
        : 'Mund të krahasosh deri 4 produkte. Hiq një së pari.');
      return;
    }
    ids.push(id);
    if (productMeta) {
      const cache = loadFavCache();
      cache[id] = productMeta;
      saveFavCache(cache);
    }
  }
  saveFavs(ids);
}

const FAV_CACHE_KEY = 'klima-favorites-cache';
function loadFavCache() {
  try { return JSON.parse(localStorage.getItem(FAV_CACHE_KEY)) || {}; }
  catch { return {}; }
}
function saveFavCache(c) { localStorage.setItem(FAV_CACHE_KEY, JSON.stringify(c)); }

function updateFavBadge() {
  const badge = document.getElementById('favBadge');
  if (!badge) return;
  const count = loadFavs().length;
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}

function flashFavToast(msg) {
  let el = document.getElementById('favToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'favToast';
    el.className = 'fav-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(flashFavToast._t);
  flashFavToast._t = setTimeout(() => el.classList.remove('show'), 2400);
}

function openFavDrawer() {
  document.getElementById('favDrawer')?.classList.add('open');
  document.getElementById('favBackdrop')?.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('favClose')?.focus(), 50);
}
function closeFavDrawer() {
  document.getElementById('favDrawer')?.classList.remove('open');
  document.getElementById('favBackdrop')?.classList.remove('show');
  document.body.style.overflow = '';
}

function escFav(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderFavDrawer() {
  const list = document.getElementById('favList');
  const empty = document.getElementById('favEmpty');
  const cmpBtn = document.getElementById('favCompareBtn');
  if (!list) return;
  const ids = loadFavs();
  const cache = loadFavCache();
  if (ids.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (cmpBtn) cmpBtn.disabled = true;
    return;
  }
  if (empty) empty.style.display = 'none';
  if (cmpBtn) cmpBtn.disabled = ids.length < 2;
  list.innerHTML = ids.map(id => {
    const p = cache[id] || { title: id };
    return `
      <div class="fav-item" data-id="${escFav(id)}">
        <a class="fav-item-link" href="product/${encodeURIComponent(id)}.html">
          <div class="fav-item-img">
            ${p.image ? `<img src="${escFav(p.image)}" alt="" loading="lazy" />` : ''}
          </div>
          <div class="fav-item-body">
            <div class="fav-item-name">${escFav(p.title)}</div>
            ${p.subtitle ? `<div class="fav-item-sub">${escFav(p.subtitle)}</div>` : ''}
            ${p.price_text ? `<div class="fav-item-price">${escFav(p.price_text)}</div>` : ''}
          </div>
        </a>
        <button class="fav-item-rm" aria-label="Hiq nga të preferuarat" data-id="${escFav(id)}">×</button>
      </div>
    `;
  }).join('');
  list.querySelectorAll('.fav-item-rm').forEach(b => {
    b.addEventListener('click', e => { e.preventDefault(); toggleFav(b.dataset.id); });
  });
}

function syncFavHearts() {
  const ids = new Set(loadFavs());
  document.querySelectorAll('.pc-fav, .prod-fav, .fav-heart').forEach(btn => {
    const id = btn.dataset.id;
    if (id) btn.classList.toggle('is-fav', ids.has(id));
    btn.setAttribute('aria-pressed', String(ids.has(id)));
  });
}

function buildCompareUrl() {
  const ids = loadFavs();
  if (ids.length < 2) return null;
  return `compare.html?ids=${ids.map(encodeURIComponent).join(',')}`;
}

function injectFavUI() {
  const headerRight = document.querySelector('.header-right');
  if (!headerRight || document.getElementById('favBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'favBtn';
  btn.className = 'fav-btn';
  btn.setAttribute('aria-label', 'Të preferuarat');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span class="fav-badge" id="favBadge">0</span>';
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) headerRight.insertBefore(btn, cartBtn);
  else headerRight.appendChild(btn);

  const backdrop = document.createElement('div');
  backdrop.id = 'favBackdrop';
  backdrop.className = 'fav-backdrop';
  document.body.appendChild(backdrop);

  const drawer = document.createElement('aside');
  drawer.id = 'favDrawer';
  drawer.className = 'fav-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Të preferuarat');
  drawer.innerHTML = `
    <div class="fav-head">
      <h3 data-sq="Të Preferuarat" data-en="Favorites">Të Preferuarat</h3>
      <button class="fav-close" id="favClose" aria-label="Mbyll">×</button>
    </div>
    <div class="fav-body">
      <div class="fav-list" id="favList"></div>
      <p class="fav-empty" id="favEmpty"
         data-sq="Asnjë produkt i shtuar. Klikoni zemrën në ndonjë produkt për ta krahasuar më vonë."
         data-en="No products yet. Tap the heart on any product to compare later.">
        Asnjë produkt i shtuar. Klikoni zemrën në ndonjë produkt për ta krahasuar më vonë.
      </p>
    </div>
    <div class="fav-foot">
      <button class="btn btn-red fav-compare" id="favCompareBtn" disabled
              data-sq="Krahasoni produktet" data-en="Compare products">Krahasoni produktet</button>
      <p class="fav-hint" data-sq="Shto deri 4 produkte për krahasim."
         data-en="Add up to 4 products to compare.">Shto deri 4 produkte për krahasim.</p>
    </div>
  `;
  document.body.appendChild(drawer);

  btn.addEventListener('click', openFavDrawer);
  document.getElementById('favClose').addEventListener('click', closeFavDrawer);
  backdrop.addEventListener('click', closeFavDrawer);
  document.getElementById('favCompareBtn').addEventListener('click', () => {
    const url = buildCompareUrl();
    if (url) location.href = url;
  });
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') closeFavDrawer();
    if (e.key === 'Tab') {
      const focusable = drawer.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  updateFavBadge();
  renderFavDrawer();
}

document.addEventListener('DOMContentLoaded', () => {
  injectFavUI();
  syncFavHearts();
});

// Re-sync hearts whenever new product cards appear (home/category render)
window.addEventListener('klima-products-rendered', () => syncFavHearts());

window.klimaFavorites = { toggle: toggleFav, isFav, list: loadFavs, open: openFavDrawer };
