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
  burger.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); }));
}

/* ── Category tiles → filter products ────────────── */
document.querySelectorAll('.cat-tile[data-filter-target]').forEach(tile => {
  tile.addEventListener('click', e => {
    e.preventDefault();
    const target = tile.dataset.filterTarget;
    // Activate the matching filter button
    document.querySelectorAll('.fb').forEach(b => b.classList.toggle('fb-active', b.dataset.filter === target));
    filterCards(target);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Product filter ───────────────────────────────── */
function filterCards(filter) {
  document.querySelectorAll('.pc').forEach(c => {
    const show = filter === 'all' || c.dataset.cat === filter;
    c.style.display = show ? '' : 'none';
    if (show) c.style.animation = 'fadeIn .35s ease forwards';
  });
}

document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('fb-active'));
    btn.classList.add('fb-active');
    filterCards(btn.dataset.filter);
  });
});

/* ── Home product grid (from catalog.json) ─────────── */
async function renderHomeProducts() {
  const grid = document.getElementById('pcGrid');
  if (!grid) return;
  let catalog;
  try {
    const res = await fetch('catalog.json');
    catalog = await res.json();
  } catch (e) {
    grid.innerHTML = '<p style="color:#888;text-align:center;padding:40px">Produktet nuk u ngarkuan.</p>';
    return;
  }
  const products = catalog.products || [];
  grid.innerHTML = products.map(p => productCardHTML(p)).join('');

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

  if (typeof setLang === 'function') setLang(localStorage.getItem('klima-lang') || 'sq');
}

function productCardHTML(p) {
  const priceTxt = p.price_text || 'Me kërkesë';
  const isOnRequest = !p.price_text;
  const href = `product.html?id=${encodeURIComponent(p.id)}`;
  const series = p.series_label || (p.model_code ? `${p.model_code} · R32` : '');
  return `
    <a class="pc" data-cat="${esc(p.category)}" data-id="${esc(p.id)}" href="${href}">
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
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = lang === 'sq' ? 'Duke dërguar…' : 'Sending…';
    setTimeout(() => {
      btn.disabled    = false;
      btn.textContent = lang === 'sq' ? 'Dërgo Kërkesën →' : 'Send Request →';
      form.reset();
      fSuccess.textContent = lang === 'sq'
        ? "✅ Faleminderit! Do t'ju kontaktojmë brenda 2 orësh."
        : '✅ Thank you! We will contact you within 2 hours.';
      fSuccess.classList.add('show');
      setTimeout(() => fSuccess.classList.remove('show'), 5000);
    }, 1200);
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
