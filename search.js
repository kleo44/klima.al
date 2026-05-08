/* KLIMA.AL — Header search */

let __klimaSearchCatalog = null;
let __klimaSearchLoading = null;

async function loadSearchCatalog() {
  if (__klimaSearchCatalog) return __klimaSearchCatalog;
  if (__klimaSearchLoading) return __klimaSearchLoading;
  __klimaSearchLoading = (async () => {
    try {
      const res = await fetch('catalog.json');
      const data = await res.json();
      __klimaSearchCatalog = data;
      return data;
    } catch (e) {
      __klimaSearchCatalog = { products: [], categories: {} };
      return __klimaSearchCatalog;
    }
  })();
  return __klimaSearchLoading;
}

function escSearch(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function normalize(s) {
  return String(s ?? '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function searchProducts(query, catalog) {
  const q = normalize(query.trim());
  if (!q) return [];
  const products = catalog.products || [];
  const scored = [];
  for (const p of products) {
    const hay = normalize([p.title, p.model_code, p.series_label, p.id].filter(Boolean).join(' '));
    const idx = hay.indexOf(q);
    if (idx >= 0) {
      let score = 100 - idx;
      if (normalize(p.title).startsWith(q)) score += 50;
      scored.push({ score, product: p });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map(s => s.product);
}

function renderResults(products) {
  const list = document.getElementById('searchResults');
  const empty = document.getElementById('searchEmpty');
  if (!list || !empty) return;
  if (products.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = products.map(p => `
    <a class="search-result" href="product.html?id=${encodeURIComponent(p.id)}">
      <div class="search-result-img">
        ${p.hero_image ? `<img src="${escSearch(p.hero_image)}" alt="" loading="lazy" onerror="this.style.display='none'" />` : ''}
      </div>
      <div class="search-result-body">
        <div class="search-result-name">${escSearch(p.title)}</div>
        <div class="search-result-meta">${escSearch(p.series_label || p.model_code || '')}</div>
      </div>
      <div class="search-result-price">${escSearch(p.price_text || 'Me kërkesë')}</div>
    </a>
  `).join('');
}

function openSearch() {
  document.getElementById('searchModal')?.classList.add('open');
  document.getElementById('searchBackdrop')?.classList.add('show');
  setTimeout(() => document.getElementById('searchInput')?.focus(), 50);
}
function closeSearch() {
  document.getElementById('searchModal')?.classList.remove('open');
  document.getElementById('searchBackdrop')?.classList.remove('show');
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  renderResults([]);
}

function injectSearchUI() {
  const headerRight = document.querySelector('.header-right');
  if (!headerRight || document.getElementById('searchBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'searchBtn';
  btn.className = 'search-btn';
  btn.setAttribute('aria-label', 'Search');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) headerRight.insertBefore(btn, cartBtn);
  else headerRight.appendChild(btn);

  const backdrop = document.createElement('div');
  backdrop.id = 'searchBackdrop';
  backdrop.className = 'search-backdrop';
  document.body.appendChild(backdrop);

  const modal = document.createElement('div');
  modal.id = 'searchModal';
  modal.className = 'search-modal';
  modal.innerHTML = `
    <div class="search-box">
      <div class="search-bar">
        <svg class="search-bar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input id="searchInput" type="search" autocomplete="off" placeholder="Kërko produkte..."
               data-sq-ph="Kërko produkte..." data-en-ph="Search products..." />
        <button class="search-close" id="searchClose" aria-label="Close">×</button>
      </div>
      <div class="search-body">
        <div class="search-results" id="searchResults"></div>
        <p class="search-empty" id="searchEmpty"
           data-sq="Nuk u gjet asnjë produkt." data-en="No products found.">Nuk u gjet asnjë produkt.</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  btn.addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  backdrop.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      openSearch();
    }
  });

  const input = document.getElementById('searchInput');
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(async () => {
      const catalog = await loadSearchCatalog();
      renderResults(searchProducts(input.value, catalog));
    }, 80);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const first = document.querySelector('.search-result');
      if (first) location.href = first.getAttribute('href');
    }
  });

  // initial empty state
  const empty = document.getElementById('searchEmpty');
  empty.textContent = 'Shkruani për të kërkuar produkte...';
  empty.dataset.sq = 'Shkruani për të kërkuar produkte...';
  empty.dataset.en = 'Type to search products...';
}

document.addEventListener('DOMContentLoaded', () => {
  injectSearchUI();
  // pre-warm
  loadSearchCatalog();
});
