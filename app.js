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
if (header) {
  let hdrTicking = false;
  window.addEventListener('scroll', () => {
    if (hdrTicking) return;
    hdrTicking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 20);
      hdrTicking = false;
    });
  }, { passive: true });
}

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
    const res = await fetch('/catalog.json');
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
    if (canon) canon.setAttribute('href', `https://klima-al.com/produkte/${cat}.html`);
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
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Honeypot — silently succeed if filled
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) {
      form.reset();
      return;
    }

    const name    = String(data.name    || '').trim();
    const phone   = String(data.phone   || '').trim();
    const email   = String(data.email   || '').trim();
    const product = String(data.product || '').trim();
    const city    = String(data.city    || '').trim();
    const message = String(data.message || '').trim();

    if (!name || !phone) {
      fSuccess.classList.add('error');
      fSuccess.textContent = lang === 'sq'
        ? '⚠️ Emri dhe nr. i telefonit janë të nevojshëm.'
        : '⚠️ Name and phone are required.';
      fSuccess.classList.add('show');
      setTimeout(() => fSuccess.classList.remove('show'), 5000);
      return;
    }

    const greeting = lang === 'sq' ? 'Përshëndetje Klima.Al,' : 'Hello Klima.Al,';
    const lines = [
      greeting,
      '',
      `Emri: ${name}`,
      `Telefoni: ${phone}`,
      email   ? `Email: ${email}`     : null,
      product ? `Produkti: ${product}` : null,
      city    ? `Qyteti: ${city}`     : null,
      message ? `\nMesazh:\n${message}` : null
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/355672549225?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener');

    form.reset();
    fSuccess.classList.remove('error');
    fSuccess.textContent = lang === 'sq'
      ? '✅ WhatsApp u hap me kërkesën tuaj. Klikoni "Send" për ta dërguar.'
      : '✅ WhatsApp opened with your request. Tap "Send" to deliver it.';
    fSuccess.classList.add('show');
    setTimeout(() => fSuccess.classList.remove('show'), 6000);
  });
}

/* ── Scroll to top ────────────────────────────────── */
const sTop = document.getElementById('sTop');
if (sTop) {
  let sTopTicking = false;
  window.addEventListener('scroll', () => {
    if (sTopTicking) return;
    sTopTicking = true;
    requestAnimationFrame(() => {
      sTop.classList.toggle('show', window.scrollY > 400);
      sTopTicking = false;
    });
  }, { passive: true });
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

/* ── Animated stat counters ───────────────────────── */
(function () {
  const items = document.querySelectorAll('.stats-bar .stat-item');
  if (!items.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const originalHTML = el.innerHTML;
    if (/[\/:]/.test(el.textContent)) return;
    const match = el.textContent.match(/\d[\d\s]*/);
    if (!match) return;
    const raw = match[0];
    const target = parseInt(raw.replace(/\s/g, ''), 10);
    if (!Number.isFinite(target) || target < 10 || target > 100000) return;

    const useSpace = /\d\s\d/.test(raw);
    const format = n => useSpace ? n.toLocaleString('fr-FR').replace(/,/g, ' ') : String(n);

    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const cur = Math.round(target * easeOutCubic(t));
      el.innerHTML = originalHTML.replace(raw, format(cur));
      if (t < 1) requestAnimationFrame(tick);
      else el.innerHTML = originalHTML;
    };
    requestAnimationFrame(tick);
  };

  const counter = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const strong = entry.target.querySelector('strong');
      if (!strong || strong.dataset.counted) return;
      strong.dataset.counted = '1';
      animate(strong);
      counter.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  items.forEach(item => counter.observe(item));
})();

/* ── Section eyebrow accent line ──────────────────── */
(function () {
  const labels = document.querySelectorAll('.sec-label');
  if (!labels.length) return;
  if (!('IntersectionObserver' in window)) {
    labels.forEach(l => l.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  labels.forEach(l => io.observe(l));
})();

/* ── Testimonial star fill-in ─────────────────────── */
(function () {
  const cards = document.querySelectorAll('.testi-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const stars = card.querySelector('.testi-stars');
    if (!stars || stars.dataset.split) return;
    const text = stars.textContent.trim();
    if (!/^[★]+$/.test(text)) return;
    stars.textContent = '';
    [...text].forEach(ch => {
      const s = document.createElement('span');
      s.textContent = ch;
      stars.appendChild(s);
    });
    stars.dataset.split = '1';
  });

  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.testi-stars span').forEach(s => s.classList.add('lit'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const spans = e.target.querySelectorAll('.testi-stars span');
      spans.forEach((s, i) => setTimeout(() => s.classList.add('lit'), i * 110));
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  cards.forEach(c => io.observe(c));
})();

/* ── Subtle parallax on feature images ────────────── */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (matchMedia('(max-width: 768px)').matches) return;
  const imgs = document.querySelectorAll('.feat-img img');
  if (!imgs.length) return;

  const active = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) active.add(e.target);
      else active.delete(e.target);
    });
  }, { threshold: 0 });
  imgs.forEach(img => {
    img.style.willChange = 'transform';
    io.observe(img);
  });

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    active.forEach(img => {
      const r = img.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const progress = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
      img.style.transform = `translate3d(0, ${(-progress * 22).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

/* ── Apply saved language ─────────────────────────── */
setLang(lang);

/* ── Sticky category header: disabled (caused scroll feedback loop on mobile) ── */

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
    url: `https://klima-al.com/produkte/${cat}.html`,
    inLanguage: 'sq-AL',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://klima-al.com/product/${encodeURIComponent(p.id)}.html`,
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
    const res = await fetch('/catalog.json');
    if (!res.ok) throw new Error('catalog ' + res.status);
    catalog = await res.json();
  } catch { catalog = { products: [] }; }
  // Bilingual <title> on /produkte/<cat>.html pages
  const catSlug = (location.pathname.match(/\/produkte\/([^\/]+?)\.html$/) || [])[1];
  const catMeta = catSlug && catalog.categories ? catalog.categories[catSlug] : null;
  if (catMeta) {
    const titleEl = document.querySelector('title');
    if (titleEl) {
      titleEl.dataset.sqTitle = `${catMeta.label_sq} – Klima.Al`;
      titleEl.dataset.enTitle = `${catMeta.label_en} – Klima.Al`;
    }
  }
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
