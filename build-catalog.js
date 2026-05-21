/* Build catalog.json from catalog-scraped.json + existing prices.
   Run: node build-catalog.js */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const scraped = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog-scraped.json'), 'utf8'));
const tr = JSON.parse(fs.readFileSync(path.join(ROOT, 'translations-sq.json'), 'utf8'));
const bySlug = Object.fromEntries(scraped.products.map(p => [p.slug, p]));

const categories = {
  residential: { label_sq: 'Kondicionerë Mural', label_en: 'Wall Units' },
  multisplit:  { label_sq: 'Sisteme Multi-Split', label_en: 'Multi-Split Systems' },
  floor:       { label_sq: 'Sisteme Dysheme',    label_en: 'Floor Systems' },
  materiale:   { label_sq: 'Materiale dhe Aksesorë', label_en: 'Materials & Accessories' }
};

// Pull from a scraped entry but override fields per-variant
function from(slug, overrides = {}) {
  const src = bySlug[slug];
  if (!src) throw new Error(`Missing scraped slug: ${slug}`);
  const sq = tr[slug] || {};
  return {
    id: overrides.id || slug,
    slug,
    source_url: src.url,
    category: overrides.category || mapCategory(src.category),
    title: overrides.title || src.title,
    title_sq: overrides.title_sq,
    title_en: overrides.title_en,
    subtitle: overrides.subtitle ?? src.subtitle ?? null,
    hero_image: overrides.hero_image || src.hero_image,
    gallery_images: src.gallery_images || [],
    description:    overrides.description    ?? src.description ?? null,
    description_sq: overrides.description_sq ?? sq.description_sq ?? null,
    description_en: overrides.description_en ?? src.description  ?? null,
    specs: overrides.specs ?? src.specs ?? [],
    price_text: overrides.price_text ?? null,
    brochure_url: src.brochure_url ?? null,
    features:    src.features || [],
    features_sq: sq.features_sq || null,
    features_en: src.features || [],
    brand_label: 'Mitsubishi Heavy Industries',
    capacity_kw: overrides.capacity_kw ?? null,
    model_code: overrides.model_code ?? null,
    series_label: overrides.series_label ?? null
  };
}

function mapCategory(scrapedCat) {
  if (scrapedCat === 'monosplit') return 'residential';
  if (scrapedCat === 'multisplit-indoor' || scrapedCat === 'outdoor-unit') return 'multisplit';
  return scrapedCat;
}

const products = [
  // ── Residential / Wall ────────────────────────────────────────
  // KIREIA mono — 4 size variants share the family detail content
  // but each has size-specific description_sq/title to avoid duplicate-content penalty.
  from('kireia-monosplit-r32', { id: 'kireia-2kw',   title: 'KIREIA 2.0 kW', model_code: 'SRK 20 ZS-WF', capacity_kw: 2.0, series_label: 'SRK 20 ZS-WF · R32', price_text: '44 300 L',
    description_sq: 'Kondicioneri më kompakt i serisë KIREIA — fuqi 2.0 kW (≈ 7000 BTU), ideal për dhoma 12–18 m² si dhoma gjumi ose zyrë e vogël. Inverter R32 me Wi-Fi të integruar dhe nivel zhurme vetëm 21 dB(A) — më e qetë se një bisedë e ngadaltë.',
    description_en: 'The smallest model in the KIREIA range — 2.0 kW (~7000 BTU) for rooms of 12–18 m² such as bedrooms or small offices. R32 inverter with integrated Wi-Fi and just 21 dB(A) of sound — quieter than a whispered conversation.'
  }),
  from('kireia-monosplit-r32', { id: 'kireia-2_5kw', title: 'KIREIA 2.5 kW', model_code: 'SRK 25 ZS-WF', capacity_kw: 2.5, series_label: 'SRK 25 ZS-WF · R32', price_text: '46 400 L',
    description_sq: 'Modeli më i shitur i KIREIA-s. Fuqi 2.5 kW (≈ 9000 BTU) për dhoma 18–25 m². Klasa energjie A+++ në ftohje, ngrohje deri −15 °C dhe Wi-Fi i integruar për kontroll nga aplikacioni Smart M-Air.',
    description_en: 'The KIREIA bestseller. 2.5 kW (~9000 BTU) for rooms of 18–25 m². A+++ cooling class, heating down to −15 °C and integrated Wi-Fi for Smart M-Air app control.'
  }),
  from('kireia-monosplit-r32', { id: 'kireia-3_5kw', title: 'KIREIA 3.5 kW', model_code: 'SRK 35 ZS-WF', capacity_kw: 3.5, series_label: 'SRK 35 ZS-WF · R32', price_text: '51 800 L',
    description_sq: 'Fuqi 3.5 kW (≈ 12000 BTU) për dhoma 25–35 m² si dhoma ndenjeje ose kuzhina të mëdha. Klasa A+++/A++ në ftohje/ngrohje dhe distancë lidhjeje deri 25 m midis njësive.',
    description_en: 'A 3.5 kW (~12000 BTU) unit for rooms of 25–35 m² such as living rooms or larger kitchens. A+++/A++ class for cool/heat and up to 25 m of piping between indoor and outdoor units.'
  }),
  from('kireia-monosplit-r32', { id: 'kireia-5kw',   title: 'KIREIA 5.0 kW', model_code: 'SRK 50 ZS-WF', capacity_kw: 5.0, series_label: 'SRK 50 ZS-WF · R32', price_text: '72 400 L',
    description_sq: 'Modeli më i madh monosplit i KIREIA-s. Fuqi 5.0 kW (≈ 18000 BTU) për hapësira të hapura 35–50 m². Pika kulmore deri 7.1 kW në ftohje dhe 7.5 kW në ngrohje për ditë ekstreme.',
    description_en: 'The largest KIREIA monosplit. 5.0 kW (~18000 BTU) for open spaces of 35–50 m². Peaks at 7.1 kW cooling / 7.5 kW heating for the hottest and coldest days.'
  }),
  // KIREIA Plus
  from('kireia-plus-monosplit-r32', { id: 'kireia-plus', title: 'KIREIA Plus', model_code: 'SRK ZSX-WF', series_label: 'SRK ZSX-WF · R32' }),
  // NEW residential (wall-mounted only — Light Commercial cassette/ceiling/ducted removed per spec)
  from('kireia-smart-monosplit-r32',                        { id: 'kireia-smart',   title: 'KIREIA SMART', model_code: 'SRK ZSP-W', series_label: 'SRK ZSP-W · R32' }),
  from('large-comfort-monosplit-r32',                       { id: 'large-comfort',  title: 'Large Comfort', series_label: 'Wall · R32' }),

  // ── Floor (Console) ──────────────────────────────────────────
  from('primary-heating-console-monosplit-r32', { id: 'floor-3_5kw', title: 'Hyper Inverter Dysheme 3.5 kW', model_code: 'SRF 35 ZS-W', capacity_kw: 3.5, series_label: 'SRF 35 ZS-W · R32', category: 'floor', price_text: '80 100 L' }),

  // ── Multi-Split indoor units (AC heads) come first ───────────
  from('multisplit-kireia-plus-r32',     { id: 'mi-kireia-plus',  title: 'Multi-Split Indoor — KIREIA Plus', series_label: 'SRK ZSX · R32' }),
  from('multisplit-kireia-r32',          { id: 'mi-kireia',       title: 'Multi-Split Indoor — KIREIA',      series_label: 'SRK ZS · R32' }),
  from('multisplit-wall-skm-r32',        { id: 'mi-wall-skm',     title: 'Multi-Split Indoor — Wall SKM',    series_label: 'SKM · R32' }),
  from('multisplit-wall-srk-r32',        { id: 'mi-wall-srk',     title: 'Multi-Split Indoor — Wall SRK',    series_label: 'SRK · R32' }),
  from('multisplit-console-r32',         { id: 'mi-console',      title: 'Multi-Split Indoor — Console',     series_label: 'SRF · R32' }),
  from('multisplit-ceiling-r32',         { id: 'mi-ceiling',      title: 'Multi-Split Indoor — Ceiling',     series_label: 'FDE · R32' }),
  from('multisplit-medium-head-ducted-r32', { id: 'mi-medium-ducted', title: 'Multi-Split Indoor — Medium Ducted', series_label: 'FDUM · R32' }),
  from('multisplit-low-head-ducted-r32-2',  { id: 'mi-low-ducted',    title: 'Multi-Split Indoor — Low Ducted',    series_label: 'SRR · R32' }),
  from('multisplit-compact-cassette-60x60-r32', { id: 'mi-cassette-60', title: 'Multi-Split Indoor — Compact Cassette 60×60', series_label: 'FDTC · R32' }),

  // ── Multi-Split outdoor motors / condensers (after indoor) ───
  from('dc-inverter-hyper-outdoor-units-4-0-kw',  { id: 'multi-4kw-outdoor',   title: 'Multi-Split 4.0 kW',  model_code: 'SCM 40 ZS-W',  capacity_kw: 4.0, series_label: 'SCM 40 ZS-W · R32' }),
  from('dc-inverter-hyper-outdoor-units-4-5-kw',  { id: 'multi-4_5kw-outdoor', title: 'Multi-Split 4.5 kW',  model_code: 'SCM 45 ZS-W',  capacity_kw: 4.5, series_label: 'SCM 45 ZS-W · R32' }),
  from('dc-inverter-hyper-outdoor-units-5-0-kw',  { id: 'multi-5kw-outdoor',   title: 'Multi-Split 5.0 kW',  model_code: 'SCM 50 ZS-W',  capacity_kw: 5.0, series_label: 'SCM 50 ZS-W · R32' }),
  from('dc-inverter-hyper-outdoor-units-6-0-kw',  { id: 'multi-6kw-outdoor',   title: 'Multi-Split 6 kW (2–3 Dhoma)', model_code: 'SCM 60 ZS-W', capacity_kw: 6.0, series_label: 'SCM 60 ZS-W · R32', price_text: '196 800 L' }),
  from('dc-inverter-hyper-outdoor-units-7-1-kw',  { id: 'multi-7_1kw-outdoor', title: 'Multi-Split 7.1 kW',  model_code: 'SCM 71 ZS-W',  capacity_kw: 7.1, series_label: 'SCM 71 ZS-W · R32' }),
  from('dc-inverter-hyper-outdoor-units-8-0-kw',  { id: 'multi-8kw-outdoor',   title: 'Multi-Split 8 kW (3–4 Dhoma)', model_code: 'SCM 80 ZS-W', capacity_kw: 8.0, series_label: 'SCM 80 ZS-W · R32' }),
  from('dc-inverter-hyper-outdoor-units-10-0-kw', { id: 'multi-10kw-outdoor',  title: 'Multi-Split 10 kW',   model_code: 'SCM 100 ZS-W', capacity_kw: 10.0, series_label: 'SCM 100 ZS-W · R32' })
];

const out = {
  _meta: {
    generated: new Date().toISOString().slice(0, 10),
    source_listing: 'https://www.albaelettrica.al/mitsubishi-heavy-industries-residential/',
    products_count: products.length
  },
  categories,
  products
};

fs.writeFileSync(path.join(ROOT, 'catalog.json'), JSON.stringify(out, null, 2));
console.log(`Wrote catalog.json — ${products.length} products`);
console.log('By category:', products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {}));

// ── Pre-render product + category pages ──────────────────
const SITE = 'https://klima-al.com';
const today = new Date().toISOString().slice(0, 10);

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const HEADER_HTML = `<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo">
      <span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span>
    </a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="../index.html"          data-sq="Kreu"      data-en="Home">Kreu</a></li>
        <li class="has-drop">
          <a class="nav-link" href="../index.html#cat" data-sq="Produkte" data-en="Products">Produkte</a>
          <ul class="drop">
            <li><a href="../produkte/residential.html" data-sq="Kondicionerë Mural"    data-en="Wall Units">Kondicionerë Mural</a></li>
            <li><a href="../produkte/multisplit.html"  data-sq="Sisteme Multi-Split"   data-en="Multi-Split Systems">Sisteme Multi-Split</a></li>
            <li><a href="../produkte/floor.html"       data-sq="Sisteme Dysheme" data-en="Floor Systems">Sisteme Dysheme</a></li>
          </ul>
        </li>
        <li><a class="nav-link" href="../materiale.html" data-sq="Materiale dhe Aksesorë" data-en="Materials & Accessories">Materiale dhe Aksesorë</a></li>
        <li><a class="nav-link" href="../index.html#features" data-sq="Teknologji" data-en="Technology">Teknologji</a></li>
        <li><a class="nav-link" href="../index.html#services" data-sq="Shërbime"   data-en="Services">Shërbime</a></li>
        <li><a class="nav-link" href="../index.html#contact"  data-sq="Kontakt"    data-en="Contact">Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-right">
      <a href="tel:+355672549225" class="header-phone">📞 +355 67 254 9225</a>
      <button class="cart-btn" id="cartBtn" aria-label="Shporta">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span class="cart-badge" id="cartBadge">0</span>
      </button>
      <div class="lang-sw">
        <button class="lb lb-active" data-lang="sq">SQ</button>
        <span>|</span>
        <button class="lb" data-lang="en">EN</button>
      </div>
    </div>
    <button class="burger" id="burger" aria-label="Menyja" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="cart-backdrop" id="cartBackdrop"></div>
<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shporta">
  <div class="cart-head">
    <h3 data-sq="Shporta jote" data-en="Your Cart">Shporta jote</h3>
    <button class="cart-close" id="cartClose" aria-label="Mbyll">×</button>
  </div>
  <div class="cart-body">
    <div class="cart-list" id="cartList"></div>
    <p class="cart-empty" id="cartEmpty" data-sq="Shporta është bosh." data-en="Your cart is empty.">Shporta është bosh.</p>
  </div>
  <div class="cart-foot">
    <div class="cart-total-row">
      <span class="cart-total-lbl" data-sq="Total" data-en="Total">Total</span>
      <strong class="cart-total" id="cartTotal"></strong>
    </div>
    <button class="btn btn-red cart-checkout" id="cartCheckout" disabled
            data-sq="Porosit me WhatsApp" data-en="Order via WhatsApp">Porosit me WhatsApp</button>
    <p class="cart-hint" data-sq="Çmimi përfundimtar konfirmohet me ne në WhatsApp."
       data-en="Final price will be confirmed with us via WhatsApp.">
      Çmimi përfundimtar konfirmohet me ne në WhatsApp.
    </p>
  </div>
</aside>`;

const FOOTER_HTML = `<footer class="footer">
  <div class="container footer-top">
    <div class="f-brand">
      <a href="../index.html" class="logo logo-white">
        <span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span>
      </a>
      <p data-sq="Distributor zyrtar Mitsubishi Heavy Industries në Shqipëri."
         data-en="Official Mitsubishi Heavy Industries distributor in Albania.">
        Distributor zyrtar Mitsubishi Heavy Industries në Shqipëri.
      </p>
    </div>
    <div class="f-col">
      <h5 data-sq="Produkte" data-en="Products">Produkte</h5>
      <ul>
        <li><a href="../produkte/residential.html" data-sq="Kondicionerë Mural" data-en="Wall Units">Kondicionerë Mural</a></li>
        <li><a href="../produkte/multisplit.html"  data-sq="Sisteme Multi-Split" data-en="Multi-Split Systems">Sisteme Multi-Split</a></li>
        <li><a href="../produkte/floor.html"       data-sq="Sisteme Dysheme" data-en="Floor Systems">Sisteme Dysheme</a></li>
        <li><a href="../materiale.html" data-sq="Materiale dhe Aksesorë" data-en="Materials &amp; Accessories">Materiale dhe Aksesorë</a></li>
      </ul>
    </div>
    <div class="f-col">
      <h5 data-sq="Kontakt" data-en="Contact">Kontakt</h5>
      <ul>
        <li>📞 +355 67 254 9225</li>
        <li>✉ klimapolaral@gmail.com</li>
        <li>📍 Rr. Jordan Misja, Tiranë</li>
        <li data-sq="🕐 Hën–Sht 10:00–18:00" data-en="🕐 Mon–Sat 10:00–18:00">🕐 Hën–Sht 10:00–18:00</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span data-sq="© 2026 Klima.Al · Të gjitha të drejtat e rezervuara"
            data-en="© 2026 Klima.Al · All rights reserved">© 2026 Klima.Al · Të gjitha të drejtat e rezervuara</span> · <a href="../privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="../kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a>
      <span data-sq="Distributor Zyrtar Mitsubishi Heavy Industries"
            data-en="Official Mitsubishi Heavy Industries Distributor">Distributor Zyrtar Mitsubishi Heavy Industries</span>
    </div>
  </div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>`;

function pageShell({ title, titleSq, titleEn, description, ogImage, canonical, jsonLdScripts = [], dataScript = '', bodyContent }) {
  const sqT = titleSq || title || '';
  const enT = titleEn || title || '';
  const ogT = title || sqT;
  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="${esc(sqT)}" data-en-title="${esc(enT)}">${esc(sqT)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="canonical" href="${esc(canonical)}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(ogT)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(ogT)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />

  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1000" />
  <meta property="article:modified_time" content="${today}" />
  <meta name="last-modified" content="${today}" />
  <link rel="alternate" hreflang="sq-AL" href="${esc(canonical)}" />
  <link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />

  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../style.css" />
  <link rel="preconnect" href="https://www.albaelettrica.al" crossorigin />
  <link rel="preconnect" href="https://www.mitsubishi-termal.it" crossorigin />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media=&#39;all&#39;" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>
${jsonLdScripts.join('\n')}
${dataScript}
</head>
<body>

${HEADER_HTML}

<main id="main">
${bodyContent}
</main>

${FOOTER_HTML}

<script src="../search.js" defer></script>
<script src="../favorites.js" defer></script>
<script src="../cart.js" defer></script>
<script src="../app.js" defer></script>
<script src="../product.js" defer></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>
`;
}

function priceHTML(price_text) {
  const isOnRequest = !price_text;
  const txt = price_text || 'Me kërkesë';
  return `<strong${isOnRequest ? ' data-sq="Me kërkesë" data-en="On request"' : ''} class="prod-price${isOnRequest ? ' on-request' : ''}" id="prodPrice">${esc(txt)}</strong>`;
}

function specsTableHTML(specs) {
  if (!Array.isArray(specs) || !specs.length) return '';
  const allKeys = [...new Set(specs.flatMap(s => Object.keys(s)))];
  const colKeys = allKeys.filter(k => k !== 'model');
  const labels = {
    capacity_kw: 'Fuqi (kW)', cooling_input_w: 'Konsum ftohjeje (W)', heating_input_w: 'Konsum ngrohjeje (W)',
    energy_class_cool: 'Klasa energjie (ftohje)', energy_class_heat: 'Klasa energjie (ngrohje)',
    seer: 'SEER', scop: 'SCOP', noise_db: 'Zhurma (dB)', weight_kg: 'Pesha (kg)',
    dimensions_mm: 'Dimensionet (mm)', refrigerant: 'Refrigerant', voltage: 'Voltazhi',
    temperature_range: 'Brezi i temperaturës'
  };
  return `<section class="prod-section">
    <h2 data-sq="Specifikime" data-en="Specifications">Specifikime</h2>
    <div class="prod-specs-wrap"><table class="prod-specs"><thead><tr>
      <th>Modeli</th>
      ${colKeys.map(k => `<th>${esc(labels[k] || k.replace(/_/g, ' '))}</th>`).join('')}
    </tr></thead><tbody>
      ${specs.map(row => `<tr>
        <td><strong>${esc(row.model || '—')}</strong></td>
        ${colKeys.map(k => `<td>${esc(row[k] != null ? row[k] : '—')}</td>`).join('')}
      </tr>`).join('')}
    </tbody></table></div>
  </section>`;
}

function productPageBody(p, catalog) {
  const images = [p.hero_image, ...(p.gallery_images || [])].filter(Boolean);
  const hasMulti = images.length > 1;
  const features = p.features_sq || p.features || [];
  const description = p.description_sq || p.description || '';
  const catLabels = { residential: 'Kondicionerë Mural', multisplit: 'Sisteme Multi-Split', floor: 'Sisteme Dysheme' };
  const catLabel = catLabels[p.category] || 'Produkte';
  return `<div class="product-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a>
      <span>›</span>
      <a href="../produkte/${p.category}.html">${esc(catLabel)}</a>
      <span>›</span>
      <span class="crumb-current">${esc(p.title)}</span>
    </nav>

    <article class="product-detail" id="productDetail">
      <div class="prod-grid">
        <div class="prod-gallery">
          <div class="prod-hero" id="prodHero">
            ${images.length ? `<img src="${esc(images[0])}" alt="${esc(p.title)}" id="prodHeroImg" fetchpriority="high" />` : `<div class="prod-hero-placeholder">${esc(p.title)}</div>`}
          </div>
          ${hasMulti ? `<div class="prod-thumbs">${images.map((src, i) => `<button class="prod-thumb${i === 0 ? ' active' : ''}" data-src="${esc(src)}" aria-label="Foto ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy" /></button>`).join('')}</div>` : ''}
        </div>
        <div class="prod-info">
          <span class="prod-brand">Mitsubishi Heavy Industries</span>
          <h1 class="prod-title">${esc(p.title)}</h1>
          ${features.length ? `<ul class="prod-features">${features.slice(0,5).map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
          <div class="prod-price-row">
            <div class="prod-price-block">
              <span class="prod-price-lbl" data-sq="Çmim" data-en="Price">Çmim</span>
              ${priceHTML(p.price_text)}
            </div>
            <button class="btn btn-red prod-atc" id="prodAtc" data-sq="Shto në Shportë" data-en="Add to Cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:-3px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Shto në Shportë
            </button>
            <button class="prod-fav" type="button" data-id="${esc(p.id)}" aria-label="Shto te të preferuarat" aria-pressed="false" title="Shto te të preferuarat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>

      ${description ? `<section class="prod-section"><h2 data-sq="Përshkrimi" data-en="Description">Përshkrimi</h2><div class="prod-desc">${description.split(/\n\n+/).map(para => `<p>${esc(para)}</p>`).join('')}</div></section>` : ''}

      ${specsTableHTML(p.specs)}

      <div class="prod-back">
        <a href="../produkte/${p.category}.html">← <span data-sq="Kthehu te kategoria" data-en="Back to category">Kthehu te kategoria</span></a>
      </div>
    </article>
  </div>
</div>`;
}

function productJsonLd(p) {
  const url = `${SITE}/product/${encodeURIComponent(p.id)}.html`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: p.hero_image,
    description: (p.description_sq || p.description || '').slice(0, 500) || p.title,
    sku: p.model_code || p.id,
    brand: { '@type': 'Brand', name: 'Mitsubishi Heavy Industries' },
    manufacturer: { '@type': 'Organization', name: 'Mitsubishi Heavy Industries Thermal Systems', url: 'https://www.mitsubishi-termal.it/' },
    category: p.category,
    dateModified: today
  };
  if (p.model_code) data.mpn = p.model_code;
  if (p.price_text) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: /€/.test(p.price_text) ? 'EUR' : 'ALL',
      price: String(p.price_text).replace(/[^\d.]/g, ''),
      availability: 'https://schema.org/InStock',
      url
    };
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function productBreadcrumbJsonLd(p) {
  const catLabels = { residential: 'Kondicionerë Mural', multisplit: 'Sisteme Multi-Split', floor: 'Sisteme Dysheme' };
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type':'ListItem', position:1, name:'Kreu',     item: `${SITE}/` },
      { '@type':'ListItem', position:2, name: catLabels[p.category] || 'Produkte', item: `${SITE}/produkte/${p.category}.html` },
      { '@type':'ListItem', position:3, name: p.title }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function categoryJsonLd(catKey, list) {
  const catLabels = { residential: 'Kondicionerë Mural', multisplit: 'Sisteme Multi-Split', floor: 'Sisteme Dysheme' };
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catLabels[catKey]} – Klima.Al`,
    url: `${SITE}/produkte/${catKey}.html`,
    inLanguage: 'sq-AL',
    dateModified: today,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/product/${encodeURIComponent(p.id)}.html`,
        name: p.title,
        image: p.hero_image
      }))
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function categoryCardHTML(p) {
  const priceTxt = p.price_text || 'Me kërkesë';
  const isOnRequest = !p.price_text;
  const series = p.series_label || (p.model_code ? `${p.model_code} · R32` : '');
  return `<a class="pc" data-cat="${esc(p.category)}" data-id="${esc(p.id)}" href="../product/${encodeURIComponent(p.id)}.html">
    <span class="pc-fav" role="button" tabindex="0" data-id="${esc(p.id)}" aria-label="Shto te të preferuarat" aria-pressed="false">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </span>
    <div class="pc-img"><img src="${esc(p.hero_image)}" alt="${esc(p.title)}" loading="lazy" /></div>
    <div class="pc-body">
      ${series ? `<p class="pc-series">${esc(series)}</p>` : ''}
      <h3 class="pc-name">${esc(p.title)}</h3>
      ${p.capacity_kw != null ? `<div class="pc-specs"><div><span data-sq="Fuqi" data-en="Capacity">Fuqi</span><strong>${p.capacity_kw} kW</strong></div><div><span>R32</span><strong>✔</strong></div></div>` : ''}
      <div class="pc-foot">
        <div class="pc-price">
          <span data-sq="${isOnRequest ? '' : 'Çmim'}" data-en="${isOnRequest ? '' : 'Price'}">${isOnRequest ? '' : 'Çmim'}</span>
          <strong${isOnRequest ? ' data-sq="Me kërkesë" data-en="On request"' : ''}>${esc(priceTxt)}</strong>
        </div>
        <button class="btn btn-red btn-sm pc-atc" data-id="${esc(p.id)}" data-sq="Shto në Shportë" data-en="Add to Cart">Shto në Shportë</button>
      </div>
    </div>
  </a>`;
}

function categoryPageBody(catKey, list) {
  const catLabels = { residential: { sq: 'Kondicionerë Mural', en: 'Wall Units' }, multisplit: { sq: 'Sisteme Multi-Split', en: 'Multi-Split Systems' }, floor: { sq: 'Sisteme Dysheme', en: 'Floor Systems' } };
  const lbl = catLabels[catKey];
  return `<div class="category-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html" data-sq="Kreu" data-en="Home">Kreu</a>
      <span>›</span>
      <a href="../index.html#cat" data-sq="Kategori" data-en="Categories">Kategori</a>
      <span>›</span>
      <span class="crumb-current">${esc(lbl.sq)}</span>
    </nav>
    <header class="category-head">
      <span class="sec-label" data-sq="Linja Jonë" data-en="Our Range">Linja Jonë</span>
      <h1 data-sq="${esc(lbl.sq)}" data-en="${esc(lbl.en)}">${esc(lbl.sq)}</h1>
      <p class="category-sub" data-sq="${list.length} produkte në këtë kategori" data-en="${list.length} products in this category">${list.length} produkte në këtë kategori</p>
    </header>
    <div class="pg" id="pcGrid" data-prerendered="true">
      ${list.map(categoryCardHTML).join('')}
    </div>
  </div>
</div>`;
}

// Write per-product pages
const PROD_DIR = path.join(ROOT, 'product');
if (!fs.existsSync(PROD_DIR)) fs.mkdirSync(PROD_DIR);
for (const p of products) {
  const html = pageShell({
    title: `${p.title} – Klima.Al`,
    description: (p.description_sq || p.description || `${p.title} — Mitsubishi Heavy Industries. Çmim dhe specifikime në Klima.Al.`).slice(0, 200),
    ogImage: p.hero_image,
    canonical: `${SITE}/product/${encodeURIComponent(p.id)}.html`,
    jsonLdScripts: [productJsonLd(p), productBreadcrumbJsonLd(p)],
    dataScript: `<script id="productData" type="application/json">${JSON.stringify(p).replace(/</g, '\\u003c')}</script>`,
    bodyContent: productPageBody(p, out)
  });
  fs.writeFileSync(path.join(PROD_DIR, `${p.id}.html`), html);
}
console.log(`Wrote ${products.length} product pages to /product/`);

// Write per-category pages
const CAT_DIR = path.join(ROOT, 'produkte');
if (!fs.existsSync(CAT_DIR)) fs.mkdirSync(CAT_DIR);
for (const catKey of ['residential','multisplit','floor']) {
  const list = products.filter(p => p.category === catKey);
  const labels = categories[catKey];
  const html = pageShell({
    titleSq: `${labels.label_sq} – Klima.Al`,
    titleEn: `${labels.label_en} – Klima.Al`,
    description: `${list.length} kondicionerë Mitsubishi Heavy Industries në kategorinë ${labels.label_sq}. R32, garanci 3 vjet, instalim profesional.`,
    ogImage: `${SITE}/hero-mitsubishi.jpg`,
    canonical: `${SITE}/produkte/${catKey}.html`,
    jsonLdScripts: [categoryJsonLd(catKey, list)],
    bodyContent: categoryPageBody(catKey, list)
  });
  fs.writeFileSync(path.join(CAT_DIR, `${catKey}.html`), html);
}
console.log(`Wrote 3 category pages to /produkte/`);

// ── Programmatic per-city × per-room-size landing pages ────────
const CITIES = [
  { slug: 'tirane',  sq: 'Tiranë',  en: 'Tirana'  },
  { slug: 'durres',  sq: 'Durrës',  en: 'Durrës'  },
  { slug: 'vlore',   sq: 'Vlorë',   en: 'Vlorë'   },
  { slug: 'shkoder', sq: 'Shkodër', en: 'Shkodër' },
  { slug: 'elbasan', sq: 'Elbasan', en: 'Elbasan' }
];

// (room size m² → recommended SKU + capacity sentence)
const SIZES = [
  { m2: 10, rec_id: 'kireia-2kw',   kw: 2.0, btu: '7 000',  use: 'dhomë gjumi e vogël' },
  { m2: 15, rec_id: 'kireia-2kw',   kw: 2.0, btu: '7 000',  use: 'dhomë gjumi standarde, zyrë' },
  { m2: 20, rec_id: 'kireia-2_5kw', kw: 2.5, btu: '9 000',  use: 'dhomë gjumi master, dhomë ndenjeje e vogël' },
  { m2: 25, rec_id: 'kireia-3_5kw', kw: 3.5, btu: '12 000', use: 'dhomë ndenjeje, kuzhinë e madhe' },
  { m2: 30, rec_id: 'kireia-3_5kw', kw: 3.5, btu: '12 000', use: 'dhomë ndenjeje e madhe, garsoniere' },
  { m2: 40, rec_id: 'kireia-5kw',   kw: 5.0, btu: '18 000', use: 'sallon i hapur, hapësirë e bashkuar' },
  { m2: 50, rec_id: 'multi-6kw-outdoor', kw: 6.0, btu: '21 000', use: 'apartament 2 dhoma me Multi-Split' },
  { m2: 60, rec_id: 'multi-8kw-outdoor', kw: 8.0, btu: '27 000', use: 'apartament 3–4 dhoma me Multi-Split' }
];

const KOND_DIR = path.join(ROOT, 'kondicioner');
if (!fs.existsSync(KOND_DIR)) fs.mkdirSync(KOND_DIR);

function localFaqJsonLd(city, size, recProduct) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type':'Question', name: `Sa kW kondicioner më duhet për dhomë ${size.m2} m² në ${city.sq}?`, acceptedAnswer:{ '@type':'Answer', text: `Si rregull i thjeshtë: 100 W/m². Për ${size.m2} m² ju duhen rreth ${size.kw} kW (≈ ${size.btu} BTU). Rekomandojmë ${recProduct.title} (${recProduct.model_code || recProduct.id}).` } },
      { '@type':'Question', name: `Sa kushton instalimi në ${city.sq}?`, acceptedAnswer:{ '@type':'Answer', text: `Instalimi standard në ${city.sq} kushton 8 000 – 15 000 L sipas vështirësisë. Vizita në vend është falas.` } },
      { '@type':'Question', name: `A funksionon në dimrin e ${city.sq}?`, acceptedAnswer:{ '@type':'Answer', text: 'Po. Modeli MHI DC Inverter Hyper ruan funksionimin e plotë në ngrohje deri −15 °C — mbi minimumin historik për Shqipërinë.' } }
    ]
  });
}

function localBusinessJsonLd(city) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#business`,
    name: 'Klima.Al',
    url: SITE + '/',
    logo: `${SITE}/favicon.svg`,
    image: `${SITE}/hero-mitsubishi.jpg`,
    description: `Distributor zyrtar Mitsubishi Heavy Industries në Shqipëri me shërbim instalimi në ${city.sq} dhe gjithë vendin.`,
    telephone: '+355672549225',
    email: 'klimapolaral@gmail.com',
    priceRange: '€€',
    areaServed: [
      { '@type':'City', name: 'Tiranë', addressCountry: 'AL' },
      { '@type':'City', name: 'Durrës', addressCountry: 'AL' },
      { '@type':'City', name: 'Vlorë',  addressCountry: 'AL' },
      { '@type':'City', name: 'Shkodër', addressCountry: 'AL' },
      { '@type':'City', name: 'Elbasan', addressCountry: 'AL' },
      { '@type':'Country', name: 'Albania' }
    ],
    address: { '@type':'PostalAddress', streetAddress:'Rr. Jordan Misja', addressLocality:'Tiranë', addressRegion:'Tiranë', postalCode:'1001', addressCountry:'AL' },
    geo: { '@type':'GeoCoordinates', latitude: 41.3343, longitude: 19.8240 },
    openingHoursSpecification: [{
      '@type':'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '10:00', closes: '18:00'
    }],
    aggregateRating: { '@type':'AggregateRating', ratingValue:'5.0', bestRating:'5', ratingCount:'3', reviewCount:'3' },
    sameAs: [
      'https://wa.me/355672549225',
      'https://www.instagram.com/klima.al/',
      'https://www.facebook.com/profile.php?id=61589934023018',
      'https://www.tiktok.com/@klima.al'
    ]
  });
}

function cityPageBody(city, size, recProduct) {
  const priceTxt = recProduct.price_text || 'Me kërkesë';
  return `<div class="local-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a>
      <span>›</span>
      <a href="../produkte/residential.html">Kondicionerë</a>
      <span>›</span>
      <span class="crumb-current">${city.sq} · ${size.m2} m²</span>
    </nav>
    <header class="category-head">
      <span class="sec-label">Udhëzues lokal</span>
      <h1>Kondicioner për dhomë ${size.m2} m² në ${esc(city.sq)}</h1>
      <p class="category-sub">Çfarë fuqie ju duhet, sa kushton, dhe modeli i rekomanduar Mitsubishi Heavy Industries — me instalim në ${esc(city.sq)}.</p>
    </header>

    <section class="local-rec">
      <div class="local-rec-grid">
        <div class="local-rec-text">
          <h2>Fuqia e duhur: ${size.kw} kW (${size.btu} BTU)</h2>
          <p>Për një hapësirë <strong>${size.m2} m²</strong> në ${esc(city.sq)} (${size.use}), si rregull i përgjithshëm <strong>100 W/m²</strong> jep një kondicioner ${size.kw} kW. Ky është një vlerësim i sigurt për tavanet 2.6–2.8 m, izolim normal dhe një orientim diellor mesatar. Për dhoma me drita të mëdha jugore, kuzhinë me sobë të nxehtë, ose tavanet mbi 3 m, hipni një hap.</p>
          <a href="../product/${recProduct.id}.html" class="btn btn-red">Shiko ${esc(recProduct.title)}</a>
          <a href="https://wa.me/355672549225?text=${encodeURIComponent('Përshëndetje, dua një kondicioner për dhomë ' + size.m2 + ' m² në ' + city.sq + '. Cila është oferta?')}" target="_blank" class="btn btn-ghost-dark">Pyet me WhatsApp</a>
        </div>
        <a class="local-rec-card" href="../product/${recProduct.id}.html">
          <div class="local-rec-img"><img src="${esc(recProduct.hero_image)}" alt="${esc(recProduct.title)}" loading="lazy" /></div>
          <div class="local-rec-body">
            <p class="pc-series">${esc(recProduct.series_label || recProduct.model_code || 'Mitsubishi Heavy Industries')}</p>
            <h3>${esc(recProduct.title)}</h3>
            <div class="pc-price"><span>Çmim</span><strong>${esc(priceTxt)}</strong></div>
          </div>
        </a>
      </div>
    </section>

    <section class="local-faq">
      <h2>Pyetje për blerës në ${esc(city.sq)}</h2>
      <details class="faq-item"><summary>Sa kushton instalimi në ${esc(city.sq)}?</summary><div class="faq-a">Instalimi standard në ${esc(city.sq)} kushton tipikisht <strong>8 000 – 15 000 L</strong> (1 njësi e brendshme + 1 e jashtme, deri 4 m gypa). Vizita në vend është falas. ${city.slug === 'tirane' ? '' : 'Përfshin udhëtimin nga Tirana në ' + city.sq + '.'}</div></details>
      <details class="faq-item"><summary>A keni instalues lokal në ${esc(city.sq)}?</summary><div class="faq-a">Po. Ekipi ynë mbulon ${esc(city.sq)} ${city.slug === 'tirane' ? 'çdo ditë jave' : 'me planifikim 2–3 ditë përpara'}. Garancia 3-vjeçare e MHI vlen kudo në Shqipëri.</div></details>
      <details class="faq-item"><summary>Sa zgjat instalimi?</summary><div class="faq-a">Një kondicioner monosplit zakonisht <strong>4–6 orë</strong>. Multi-Split (për 50+ m²) merr 8–12 orë.</div></details>
      <details class="faq-item"><summary>A funksionon në dimrin e ${esc(city.sq)}?</summary><div class="faq-a">Po. ${esc(recProduct.title)} ka teknologji <strong>DC Inverter Hyper</strong> që ruan funksionimin e plotë në ngrohje deri −15 °C — mbi minimumin historik për ${esc(city.sq)}.</div></details>
    </section>

    <section class="local-other">
      <h2>Madhësi të tjera dhomash</h2>
      <div class="local-other-grid">
        ${SIZES.filter(s => s.m2 !== size.m2).map(s => `
          <a href="../kondicioner/${s.m2}m2-${city.slug}.html" class="local-other-tile">
            <strong>${s.m2} m²</strong>
            <span>${s.kw} kW · ${s.btu} BTU</span>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="local-other">
      <h2>Tjera qytete</h2>
      <div class="local-other-grid">
        ${CITIES.filter(c => c.slug !== city.slug).map(c => `
          <a href="../kondicioner/${size.m2}m2-${c.slug}.html" class="local-other-tile">
            <strong>${esc(c.sq)}</strong>
            <span>${size.m2} m² · ${size.kw} kW</span>
          </a>
        `).join('')}
      </div>
    </section>
  </div>
</div>`;
}

let cityPagesWritten = 0;
for (const city of CITIES) {
  for (const size of SIZES) {
    const rec = products.find(p => p.id === size.rec_id) || products[0];
    const html = pageShell({
      titleSq: `Kondicioner për dhomë ${size.m2} m² në ${city.sq} — ${rec.title} | Klima.Al`,
      titleEn: `Air conditioner for ${size.m2} m² room in ${city.en} — ${rec.title} | Klima.Al`,
      description: `${size.kw} kW (${size.btu} BTU) ${rec.title} për dhomë ${size.m2} m² në ${city.sq}. Mitsubishi Heavy Industries, instalim profesional, garanci 3 vjet, R32.`,
      ogImage: rec.hero_image,
      canonical: `${SITE}/kondicioner/${size.m2}m2-${city.slug}.html`,
      jsonLdScripts: [
        `<script type="application/ld+json">${localBusinessJsonLd(city)}</script>`,
        `<script type="application/ld+json">${localFaqJsonLd(city, size, rec)}</script>`
      ],
      bodyContent: cityPageBody(city, size, rec)
    });
    fs.writeFileSync(path.join(KOND_DIR, `${size.m2}m2-${city.slug}.html`), html);
    cityPagesWritten++;
  }
}
console.log(`Wrote ${cityPagesWritten} local landing pages to /kondicioner/`);

// ── Service Areas hub page ──────────────────────────────
function serviceAreasBody() {
  return `<div class="category-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="index.html" data-sq="Kreu" data-en="Home">Kreu</a>
      <span>›</span>
      <span class="crumb-current" data-sq="Zona të mbuluara" data-en="Service Areas">Zona të mbuluara</span>
    </nav>
    <header class="category-head">
      <span class="sec-label" data-sq="Mbulim Kombëtar" data-en="National Coverage">Mbulim Kombëtar</span>
      <h1 data-sq="Instalim kondicioneri në gjithë Shqipërinë" data-en="Air conditioner installation across Albania">Instalim kondicioneri në gjithë Shqipërinë</h1>
      <p class="category-sub" data-sq="Klima.Al ofron shërbim instalimi, mirëmbajtjeje dhe riparimi në 5 qytete kryesore. Zgjidhni qytetin tuaj për udhëzues lokalë sipas madhësisë së dhomës." data-en="Klima.Al offers installation, maintenance and repair across 5 major cities. Pick your city for local guides by room size.">Klima.Al ofron shërbim instalimi, mirëmbajtjeje dhe riparimi në 5 qytete kryesore. Zgjidhni qytetin tuaj për udhëzues lokalë sipas madhësisë së dhomës.</p>
    </header>

    ${CITIES.map(c => `
    <section class="service-city">
      <h2><span class="service-city-name">${esc(c.sq)}</span> <span class="service-city-en">${esc(c.en)}</span></h2>
      <p data-sq="Instalim profesional Mitsubishi Heavy Industries në ${esc(c.sq)} — instalim standard 8 000–15 000 L, vizitë në vend falas." data-en="Professional Mitsubishi Heavy Industries installation in ${esc(c.en)} — standard install 8 000–15 000 L, free site visit.">Instalim profesional Mitsubishi Heavy Industries në ${esc(c.sq)} — instalim standard 8 000–15 000 L, vizitë në vend falas.</p>
      <div class="service-sizes">
        ${SIZES.map(s => `<a href="kondicioner/${s.m2}m2-${c.slug}.html" class="service-size-tile"><strong>${s.m2} m²</strong><span>${s.kw} kW</span></a>`).join('')}
      </div>
    </section>`).join('')}
  </div>
</div>`;
}

const serviceAreasHtml = pageShell({
  titleSq: 'Zona të mbuluara — Instalim kondicioneri në Tiranë, Durrës, Vlorë, Shkodër, Elbasan | Klima.Al',
  titleEn: 'Service Areas — A/C installation in Tirana, Durrës, Vlorë, Shkodër, Elbasan | Klima.Al',
  description: 'Klima.Al ofron instalim, mirëmbajtje dhe riparim kondicionerësh Mitsubishi Heavy Industries në Tiranë, Durrës, Vlorë, Shkodër dhe Elbasan. Udhëzues sipas madhësisë së dhomës (10–60 m²).',
  ogImage: `${SITE}/hero-mitsubishi.jpg`,
  canonical: `${SITE}/zona-te-mbuluara.html`,
  jsonLdScripts: [
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Instalim kondicioneri Mitsubishi Heavy Industries',
      provider: { '@id': `${SITE}/#business` },
      areaServed: CITIES.map(c => ({ '@type': 'City', name: c.sq, addressCountry: 'AL' })),
      serviceType: 'Air conditioner installation',
      dateModified: today
    })}</script>`
  ],
  bodyContent: serviceAreasBody()
}).replace(/href="\.\.\//g, 'href="').replace(/href="\.\.\/favicon\.svg"/g, 'href="favicon.svg"').replace(/href="\.\.\/apple-touch-icon\.png"/g, 'href="apple-touch-icon.png"').replace(/href="\.\.\/manifest\.webmanifest"/g, 'href="manifest.webmanifest"').replace(/href="\.\.\/style\.css"/g, 'href="style.css"').replace(/src="\.\.\//g, 'src="');
fs.writeFileSync(path.join(ROOT, 'zona-te-mbuluara.html'), serviceAreasHtml);
console.log('Wrote service areas hub: zona-te-mbuluara.html');

const staticPages = [
  { loc: '/',                                  prio: '1.0', freq: 'weekly' },
  { loc: '/produkte/residential.html',         prio: '0.9', freq: 'weekly' },
  { loc: '/produkte/multisplit.html',          prio: '0.9', freq: 'weekly' },
  { loc: '/produkte/floor.html',               prio: '0.9', freq: 'weekly' },
  { loc: '/materiale.html',                    prio: '0.7', freq: 'monthly' },
  { loc: '/faq.html',                          prio: '0.8', freq: 'monthly' },
  { loc: '/zona-te-mbuluara.html',             prio: '0.8', freq: 'monthly' },
  { loc: '/kalkulator-energjie.html',          prio: '0.8', freq: 'monthly' },
  { loc: '/krahasime/',                        prio: '0.8', freq: 'monthly' },
  { loc: '/krahasime/kireia-vs-daikin.html',   prio: '0.8', freq: 'monthly' },
  { loc: '/krahasime/kireia-vs-lg.html',       prio: '0.8', freq: 'monthly' },
  { loc: '/krahasime/kireia-vs-samsung.html',  prio: '0.8', freq: 'monthly' },
  { loc: '/blog/',                             prio: '0.7', freq: 'weekly' },
  { loc: '/blog/si-te-zgjedhesh-kondicioner.html',    prio: '0.7', freq: 'monthly' },
  { loc: '/blog/mirembajtja-vjetore-kondicioner.html', prio: '0.7', freq: 'monthly' },
  { loc: '/blog/r32-vs-r410a-shpjeguar.html',         prio: '0.7', freq: 'monthly' },
  { loc: '/privatesia.html',                          prio: '0.3', freq: 'yearly' },
  { loc: '/kushte-perdorimi.html',                    prio: '0.3', freq: 'yearly' }
];
const localPageUrls = CITIES.flatMap(c => SIZES.map(s => ({
  loc: `/kondicioner/${s.m2}m2-${c.slug}.html`,
  prio: '0.6',
  freq: 'monthly'
})));
const productUrls = products.map(p => ({
  loc: `/product/${encodeURIComponent(p.id)}.html`,
  prio: '0.8',
  freq: 'monthly'
}));
const allUrls = [...staticPages, ...productUrls, ...localPageUrls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`Wrote sitemap.xml — ${allUrls.length} URLs`);
