/* KLIMA.AL v2 – App JS */

/* ── Language Switch ──────────────────────────────── */
let lang = localStorage.getItem('klima-lang') || 'sq';

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;

  document.querySelectorAll('[data-sq]').forEach(el => {
    const v = l === 'sq' ? el.dataset.sq : el.dataset.en;
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-sq-html]').forEach(el => {
    el.innerHTML = l === 'sq' ? el.dataset.sqHtml : el.dataset.enHtml;
  });
  document.querySelectorAll('[data-sq-ph]').forEach(el => {
    el.placeholder = l === 'sq' ? el.dataset.sqPh : el.dataset.enPh;
  });
  document.querySelectorAll('.lb').forEach(b => b.classList.toggle('lb-active', b.dataset.lang === l));
  // <title> can also be language-aware via data-sq-title / data-en-title
  const titleEl = document.querySelector('title');
  if (titleEl) {
    const tv = l === 'sq' ? titleEl.dataset.sqTitle : titleEl.dataset.enTitle;
    if (tv) titleEl.textContent = tv;
  }
  localStorage.setItem('klima-lang', l);
}

document.querySelectorAll('.lb').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));


/* ── Sticky header shadow ─────────────────────────── */
const header = document.getElementById('header');
if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

/* ── Hamburger ────────────────────────────────────── */
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
if (burger && nav) {
  const setNavState = open => {
    burger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setNavState(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNavState(false)));
}

document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('fb-active'));
    btn.classList.add('fb-active');
    document.querySelectorAll('.pc').forEach(c => {
      const show = btn.dataset.filter === 'all' || c.dataset.cat === btn.dataset.filter;
      c.style.display = show ? '' : 'none';
    });
  });
});

/* ── Product grid (from catalog.json) ─────────────── */
function skeletonCardHTML() {
  return `<div class="pc-skeleton"><div class="skl-img"></div><div class="skl-body"><div class="skl-line short"></div><div class="skl-line med"></div><div class="skl-line"></div><div class="skl-line tall"></div></div></div>`;
}

async function renderHomeProducts() {
  const grid = document.getElementById('pcGrid');
  if (!grid) return;

  // PRE-RENDERED: cards baked in by build-catalog.js
  if (grid.dataset.prerendered === 'true') {
    hydratePrerenderedCategory();
    return;
  }

  grid.innerHTML = Array.from({ length: 6 }, skeletonCardHTML).join('');
  let catalog;
  try {
    const res = await fetch('catalog.json');
    catalog = await res.json();
  } catch (e) {
    grid.innerHTML = '<p style="color:#888;text-align:center;padding:40px">Produktet nuk u ngarkuan.</p>';
    return;
  }

  const allProducts = catalog.products || [];
  const cat = new URLSearchParams(location.search).get('cat');
  const products = cat ? allProducts.filter(p => p.category === cat) : allProducts;

  // Category-page chrome (only present on produkte.html)
  if (cat && catalog.categories && catalog.categories[cat]) {
    const meta = catalog.categories[cat];
    const titleEl  = document.getElementById('catTitle');
    const crumbEl  = document.getElementById('catCrumb');
    const subEl    = document.getElementById('catSub');
    if (titleEl)  { titleEl.dataset.sq = meta.label_sq;  titleEl.dataset.en = meta.label_en;  titleEl.textContent = meta.label_sq; }
    if (crumbEl)  { crumbEl.dataset.sq = meta.label_sq;  crumbEl.dataset.en = meta.label_en;  crumbEl.textContent = meta.label_sq; }
    if (subEl) {
      const subSq = `${products.length} produkte në këtë kategori`;
      const subEn = `${products.length} products in this category`;
      subEl.dataset.sq = subSq; subEl.dataset.en = subEn; subEl.textContent = subSq;
    }
    const docTitle = document.querySelector('title');
    if (docTitle) {
      docTitle.dataset.sqTitle = `${meta.label_sq} – Klima.Al`;
      docTitle.dataset.enTitle = `${meta.label_en} – Klima.Al`;
    }
    document.title = `${(lang === 'sq' ? meta.label_sq : meta.label_en)} – Klima.Al`;
    const canon = document.getElementById('catCanonical');
    if (canon) canon.setAttribute('href', `https://klima-al.vercel.app/produkte/${cat}.html`);
  }

  if (products.length === 0) {
    // Bad ?cat= or empty category — tell crawlers not to index
    if (cat && !catalog.categories?.[cat]) {
      let m = document.querySelector('meta[name="robots"]');
      if (!m) { m = document.createElement('meta'); m.setAttribute('name','robots'); document.head.appendChild(m); }
      m.setAttribute('content', 'noindex,nofollow');
    }
    grid.style.display = 'none';
    const emptyEl = document.getElementById('catEmpty');
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  grid.innerHTML = products.map(p => productCardHTML(p)).join('');
  injectCollectionJsonLd(cat, products, catalog);

  grid.querySelectorAll('.pc-atc').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const product = products.find(x => x.id === id);
      if (!product || typeof addToCart !== 'function') return;
      addToCart({
        id: product.id,
        title: product.title,
        subtitle: product.series_label || product.brand_label,
        image: product.hero_image,
        price_text: product.price_text || null
      });
    });
  });

  grid.querySelectorAll('.pc-fav').forEach(btn => {
    const handler = e => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.id;
      const product = products.find(x => x.id === id);
      if (!product || typeof toggleFav !== 'function') return;
      toggleFav(id, {
        title: product.title,
        subtitle: product.series_label || product.brand_label,
        image: product.hero_image,
        price_text: product.price_text || null
      });
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(e); });
  });

  if (typeof setLang === 'function') setLang(localStorage.getItem('klima-lang') || 'sq');
  window.dispatchEvent(new Event('klima-products-rendered'));
}

function productCardHTML(p) {
  const priceTxt = p.price_text || 'Me kërkesë';
  const isOnRequest = !p.price_text;
  const href = `product/${encodeURIComponent(p.id)}.html`;
  const series = p.series_label || (p.model_code ? `${p.model_code} · R32` : '');
  return `
    <a class="pc" data-cat="${esc(p.category)}" data-id="${esc(p.id)}" href="${href}">
      <span class="pc-fav" role="button" tabindex="0" data-id="${esc(p.id)}" aria-label="Shto te të preferuarat" aria-pressed="false">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </span>
      <div class="pc-img">
        <img src="${esc(p.hero_image)}"
             onerror="this.src='https://placehold.co/320x220/f5f5f5/9b1b2e?text=${encodeURIComponent(p.title)}'"
             alt="${esc(p.title)}" loading="lazy" />
      </div>
      <div class="pc-body">
        ${series ? `<p class="pc-series">${esc(series)}</p>` : ''}
        <h3 class="pc-name">${esc(p.title)}</h3>
        ${p.capacity_kw != null ? `
          <div class="pc-specs">
            <div><span data-sq="Fuqi" data-en="Capacity">Fuqi</span><strong>${p.capacity_kw} kW</strong></div>
            <div><span>R32</span><strong>✔</strong></div>
          </div>
        ` : ''}
        <div class="pc-foot">
          <div class="pc-price">
            <span data-sq="${isOnRequest ? '' : 'Çmim'}" data-en="${isOnRequest ? '' : 'Price'}">${isOnRequest ? '' : 'Çmim'}</span>
            <strong${isOnRequest ? ' data-sq="Me kërkesë" data-en="On request"' : ''}>${esc(priceTxt)}</strong>
          </div>
          <button class="btn btn-red btn-sm pc-atc" data-id="${esc(p.id)}"
                  data-sq="Shto në Shportë" data-en="Add to Cart">Shto në Shportë</button>
        </div>
      </div>
    </a>
  `;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

renderHomeProducts();

/* ── Contact form ─────────────────────────────────── */
const form     = document.getElementById('cForm');
const fSuccess = document.getElementById('fSuccess');

if (form && fSuccess) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalBtn = btn.textContent;
    btn.disabled    = true;
    btn.textContent = lang === 'sq' ? 'Duke dërguar…' : 'Sending…';

    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok || !json.ok) throw new Error(json.error || 'Send failed');

      form.reset();
      fSuccess.classList.remove('error');
      fSuccess.textContent = lang === 'sq'
        ? "✅ Faleminderit! Do t'ju kontaktojmë brenda 2 orësh."
        : '✅ Thank you! We will contact you within 2 hours.';
      fSuccess.classList.add('show');
      setTimeout(() => fSuccess.classList.remove('show'), 5000);
    } catch (err) {
      fSuccess.classList.add('error');
      fSuccess.textContent = lang === 'sq'
        ? `⚠️ Dërgimi dështoi. Na telefono te +355 67 254 9225.`
        : `⚠️ Send failed. Please call us at +355 67 254 9225.`;
      fSuccess.classList.add('show');
      setTimeout(() => fSuccess.classList.remove('show'), 6000);
    } finally {
      btn.disabled = false;
      btn.textContent = originalBtn;
    }
  });
}

/* ── Scroll to top ────────────────────────────────── */
const sTop = document.getElementById('sTop');
if (sTop) {
  window.addEventListener('scroll', () => sTop.classList.toggle('show', window.scrollY > 400));
  sTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Reveal on scroll ─────────────────────────────── */
document.querySelectorAll('.pc, .srv-card, .testi-card, .cat-tile, .feat-img, .feat-text, .stat-item').forEach(el => el.classList.add('reveal'));
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Apply saved language ─────────────────────────── */
setLang(lang);

/* ── Sticky category header (produkte.html) ───────── */
(function () {
  const head = document.querySelector('.category-page .category-head');
  if (!head) return;
  const baseTop = head.getBoundingClientRect().top + window.scrollY;
  window.addEventListener('scroll', () => {
    head.classList.toggle('is-sticky', window.scrollY > baseTop + 40);
  }, { passive: true });
})();

/* ── PWA service worker registration ──────────────── */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

/* ── Lazy-load .cat-tile backgrounds ──────────────── */
(function () {
  const tiles = document.querySelectorAll('.cat-tile[data-bg]');
  if (!tiles.length) return;
  if (!('IntersectionObserver' in window)) {
    tiles.forEach(t => { t.style.setProperty('--bg', `url('${t.dataset.bg}')`); t.classList.add('bg-ready'); });
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target;
      const url = t.dataset.bg;
      const fallback = t.dataset.bgFallback;
      if (!url) { io.unobserve(t); return; }
      const apply = src => {
        t.style.setProperty('--bg', `url('${src}')`);
        t.classList.add('bg-ready');
      };
      const img = new Image();
      img.onload = () => apply(url);
      img.onerror = () => fallback ? apply(fallback) : null;
      img.src = url;
      io.unobserve(t);
    });
  }, { rootMargin: '200px 0px' });
  tiles.forEach(t => io.observe(t));
})();

/* ── Inject CollectionPage / ItemList JSON-LD on category pages ── */
function injectCollectionJsonLd(cat, products, catalog) {
  if (!cat || !catalog.categories?.[cat]) return;
  document.getElementById('collectionJsonLd')?.remove();
  const meta = catalog.categories[cat];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${meta.label_sq} – Klima.Al`,
    url: `https://klima-al.vercel.app/produkte/${cat}.html`,
    inLanguage: 'sq-AL',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://klima-al.vercel.app/product/${encodeURIComponent(p.id)}.html`,
        name: p.title,
        image: p.hero_image
      }))
    }
  };
  const s = document.createElement('script');
  s.id = 'collectionJsonLd';
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

/* ── Mark current-page nav link with aria-current ──── */
(function () {
  const path = location.pathname.replace(/^\/+/, '').split('?')[0] || 'index.html';
  const query = location.search;
  document.querySelectorAll('.nav-link, .nav .drop a').forEach(a => {
    const href = a.getAttribute('href') || '';
    // Ignore in-page anchors (e.g. href="#cat") so the parent Produkte
    // doesn't get marked active on the home page.
    if (href.startsWith('#')) return;
    const hrefPath = href.replace(/^\/+/, '').split('?')[0];
    if (!hrefPath) return;
    if (hrefPath === path || (path === 'produkte.html' && href === 'produkte.html' + query)) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* ── Esc-to-close cart drawer ────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const drawer = document.getElementById('cartDrawer');
  if (drawer?.classList.contains('open') && typeof closeCartDrawer === 'function') closeCartDrawer();
});

/* ── Hydrate pre-rendered category page ──────────────── */
async function hydratePrerenderedCategory() {
  const grid = document.getElementById('pcGrid');
  if (!grid) return;
  let catalog;
  try {
    const res = await fetch('catalog.json');
    catalog = await res.json();
  } catch { catalog = { products: [] }; }
  const map = Object.fromEntries((catalog.products || []).map(p => [p.id, p]));
  grid.querySelectorAll('.pc-atc').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const p = map[btn.dataset.id];
      if (!p || typeof addToCart !== 'function') return;
      addToCart({
        id: p.id, title: p.title,
        subtitle: p.series_label || p.brand_label,
        image: p.hero_image,
        price_text: p.price_text || null
      });
    });
  });
  grid.querySelectorAll('.pc-fav').forEach(btn => {
    const handler = e => {
      e.preventDefault(); e.stopPropagation();
      const p = map[btn.dataset.id];
      if (!p || typeof toggleFav !== 'function') return;
      toggleFav(p.id, {
        title: p.title,
        subtitle: p.series_label || p.brand_label,
        image: p.hero_image,
        price_text: p.price_text || null
      });
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(e); });
  });
  if (typeof syncFavHearts === 'function') syncFavHearts();
  if (typeof setLang === 'function') setLang(localStorage.getItem('klima-lang') || 'sq');
  window.dispatchEvent(new Event('klima-products-rendered'));
}
