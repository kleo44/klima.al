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

/* ── Promo bar close ──────────────────────────────── */
const promoBar = document.getElementById('promoBar');
document.getElementById('promoClose').addEventListener('click', () => {
  promoBar.style.maxHeight = promoBar.offsetHeight + 'px';
  promoBar.style.overflow  = 'hidden';
  promoBar.style.transition = 'max-height .4s ease, padding .4s ease, opacity .3s ease';
  requestAnimationFrame(() => {
    promoBar.style.maxHeight = '0';
    promoBar.style.padding   = '0';
    promoBar.style.opacity   = '0';
  });
});

/* ── Sticky header shadow ─────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

/* ── Hamburger ────────────────────────────────────── */
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
burger.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); }));

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
const cards = document.querySelectorAll('.pc');

function filterCards(filter) {
  cards.forEach(c => {
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

/* ── Contact form ─────────────────────────────────── */
const form     = document.getElementById('cForm');
const fSuccess = document.getElementById('fSuccess');

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

/* ── Scroll to top ────────────────────────────────── */
const sTop = document.getElementById('sTop');
window.addEventListener('scroll', () => sTop.classList.toggle('show', window.scrollY > 400));
sTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
