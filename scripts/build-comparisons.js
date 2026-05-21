// One-shot generator for /krahasime/*.html competitor comparison pages.
// Run: node scripts/build-comparisons.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);
const SITE = 'https://klima-al.com';

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Fact rows are publicly known spec sheet data. Use neutral framing.
const COMPARISONS = [
  {
    slug: 'kireia-vs-daikin',
    competitor: { name: 'Daikin Emura FTXJ-AW', brand: 'Daikin' },
    intro_sq: 'Mitsubishi Heavy Industries KIREIA dhe Daikin Emura janë të dyja kondicionerë premium me dizajn elegant për dhoma të dukshme. Kjo faqe krahason specifikimet zyrtare të të dyja serive: fuqi, efikasitet, zhurmë, çmim dhe garanci.',
    intro_en: 'Mitsubishi Heavy Industries KIREIA and Daikin Emura are both premium wall-mounted A/Cs designed for visible living spaces. This page compares official spec-sheet data: capacity, efficiency, noise, price and warranty.',
    rows: [
      ['Diapazoni i fuqisë', '2.0–8.0 kW (7 modele)', '2.0–5.0 kW (4 modele)'],
      ['Refrigerant', 'R32 (GWP 675)', 'R32 (GWP 675)'],
      ['Klasa energjetike (ftohje)', 'A+++', 'A+++'],
      ['SEER (ftohje)', '8.5–8.7', '8.6–8.7'],
      ['SCOP (ngrohje)', '4.6–5.1', '4.6–5.0'],
      ['Zhurma minimale e brendshme', '21 dB(A) (KIREIA Plus: 19 dB(A))', '19 dB(A)'],
      ['Funksionim deri', '−15 °C (DC Inverter Hyper)', '−15 °C (Bluevolution)'],
      ['Wi-Fi i integruar', '✔ (Smart M-Air)', '✔ (Daikin Onecta — modul opsional në disa modele)'],
      ['Filtër ajri', 'Allergen Clear + Self-Clean', 'Titan Apatit'],
      ['Garanci prodhuesi', '3 vjet pjesë', '5 vjet kompresor / 3 vjet pjesë*'],
      ['Çmim fillestar (Shqipëri, 2.0 kW)', '44 300 L', '≈ 95 000–110 000 L'],
      ['Origjina', 'Fabrika MHI Italy', 'Fabrika Daikin Çeki / Tajlandë'],
    ],
    summary_sq: 'KIREIA dhe Emura janë të barabarta në klasën energjetike (A+++), refrigerantin (R32), dhe diapazonin e dimrit (-15 °C). Avantazhe KIREIA: çmim 50-60% më i ulët për fuqi të krahasueshme, gamë më e gjerë (deri 8 kW), Wi-Fi standard në të gjithë modelet. Avantazhe Emura: zhurmë minimale 19 dB(A) standard (KIREIA Plus arrin të njëjtën, modeli bazë 21 dB(A)), garanci 5-vjeçare për kompresorin.',
    summary_en: 'KIREIA and Emura match on energy class (A+++), refrigerant (R32), and winter range (−15 °C). KIREIA advantages: 50-60% lower price for comparable capacity, wider range (up to 8 kW), Wi-Fi standard on every model. Emura advantages: 19 dB(A) minimum noise as standard (KIREIA Plus matches it, base KIREIA is 21 dB(A)), 5-year compressor warranty.'
  },
  {
    slug: 'kireia-vs-lg',
    competitor: { name: 'LG DualCool S3-Q', brand: 'LG' },
    intro_sq: 'LG DualCool S3-Q është kondicioneri kryesor i LG për tregjet evropiane, i pozicionuar si konkurrent direkt i serive premium japoneze. Krahason ndaj Mitsubishi Heavy Industries KIREIA.',
    intro_en: 'LG DualCool S3-Q is LG\'s flagship A/C for European markets, positioned as a direct rival to premium Japanese series. Comparison vs Mitsubishi Heavy Industries KIREIA.',
    rows: [
      ['Diapazoni i fuqisë', '2.0–8.0 kW', '2.5–6.6 kW'],
      ['Refrigerant', 'R32 (GWP 675)', 'R32 (GWP 675)'],
      ['Klasa energjetike (ftohje)', 'A+++', 'A++ / A+++ (sipas modelit)'],
      ['SEER (ftohje)', '8.5–8.7', '7.0–8.5'],
      ['Zhurma minimale e brendshme', '21 dB(A) (Plus: 19 dB(A))', '19 dB(A)'],
      ['Funksionim deri', '−15 °C', '−15 °C'],
      ['Wi-Fi i integruar', '✔ standard', '✔ standard (LG ThinQ)'],
      ['Inverter', 'DC Inverter Hyper', 'Dual Inverter Compressor'],
      ['Filtër ajri', 'Allergen Clear', 'PM 1.0 + UVnano (modelet premium)'],
      ['Garanci prodhuesi', '3 vjet pjesë', '10 vjet kompresor / 2 vjet pjesë'],
      ['Çmim fillestar (Shqipëri, 2.0–2.5 kW)', '44 300 L', '≈ 55 000–70 000 L'],
      ['Origjina', 'Fabrika MHI Italy', 'Korea e Jugut / Poloni'],
    ],
    summary_sq: 'LG DualCool ofron garanci shumë të gjatë për kompresorin (10 vjet) dhe çmim konkurrues. KIREIA mban avantazh në efikasitet të vërtetuar (SEER më i lartë në diapazonin e mesëm), gamë më të gjerë fuqishë dhe garanci 3 vjet për të gjitha pjesët (jo vetëm kompresorin). UVnano i LG-së është një veçori unike higjenike që MHI nuk e ka.',
    summary_en: 'LG DualCool offers a very long compressor warranty (10 years) and competitive pricing. KIREIA leads on verified efficiency (higher SEER in mid-range), wider capacity range, and a 3-year warranty on all parts (not only compressor). LG\'s UVnano is a unique hygiene feature MHI does not offer.'
  },
  {
    slug: 'kireia-vs-samsung',
    competitor: { name: 'Samsung WindFree AR-NXC', brand: 'Samsung' },
    intro_sq: 'Samsung WindFree AR-NXC ka pozicionim unik: ajër pa rrjedhë direkte mbi përdoruesin. Kjo faqe e krahason me Mitsubishi Heavy Industries KIREIA për shtëpitë në Shqipëri.',
    intro_en: 'Samsung WindFree AR-NXC has a unique positioning: no direct airflow on the occupant. This page compares it with Mitsubishi Heavy Industries KIREIA for Albanian homes.',
    rows: [
      ['Diapazoni i fuqisë', '2.0–8.0 kW', '2.5–7.1 kW'],
      ['Refrigerant', 'R32 (GWP 675)', 'R32 (GWP 675)'],
      ['Klasa energjetike (ftohje)', 'A+++', 'A++ / A+++'],
      ['SEER (ftohje)', '8.5–8.7', '7.0–8.5'],
      ['Zhurma minimale e brendshme', '21 dB(A) (Plus: 19 dB(A))', '23 dB(A)'],
      ['Funksionim deri', '−15 °C (DC Inverter Hyper)', '−15 °C'],
      ['Wi-Fi i integruar', '✔ standard', '✔ standard (SmartThings)'],
      ['Filtër ajri', 'Allergen Clear + Self-Clean', 'Easy Filter Plus + Anti-Bacteria'],
      ['Veçori unike', 'Hyper Heating për dimër ekstrem', 'WindFree — ajër pa rrjedhë direkte'],
      ['Garanci prodhuesi', '3 vjet pjesë', '10 vjet kompresor / 2 vjet pjesë'],
      ['Çmim fillestar (Shqipëri, 2.5 kW)', '46 400 L', '≈ 65 000–80 000 L'],
      ['Origjina', 'Fabrika MHI Italy', 'Korea e Jugut / Tajlandë'],
    ],
    summary_sq: 'Samsung WindFree është unike për teknologjinë e ajrit pa rrjedhë — i përshtatshëm për dhoma gjumi ku rrymat e drejtpërdrejta janë problem. KIREIA është më e qetë (21 dB vs 23 dB), më e fortë në ngrohje dimërore, dhe ka çmim afërsisht 30% më të ulët. Samsung mban garanci më të gjatë për kompresorin (10 vjet).',
    summary_en: 'Samsung WindFree is unique for its no-direct-airflow technology — useful for bedrooms where direct drafts are a problem. KIREIA is quieter (21 vs 23 dB), stronger in winter heating, and roughly 30% cheaper. Samsung holds a longer compressor warranty (10 years).'
  }
];

function buildPage({ slug, competitor, intro_sq, intro_en, rows, summary_sq, summary_en }) {
  const titleSq = `KIREIA vs ${competitor.name} — Krahasim 2026 | Klima.Al`;
  const titleEn = `KIREIA vs ${competitor.name} — 2026 Comparison | Klima.Al`;
  const desc = `Krahasim faktik i ${competitor.name} kundër Mitsubishi Heavy Industries KIREIA: fuqi, efikasitet, zhurmë, garanci, çmim në Shqipëri.`;
  const canonical = `${SITE}/krahasime/${slug}.html`;

  const tableRows = rows.map(([feat, mhi, comp]) =>
    `        <tr><td>${esc(feat)}</td><td><strong>${esc(mhi)}</strong></td><td>${esc(comp)}</td></tr>`
  ).join('\n');

  const compareSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titleSq,
    description: desc,
    author: { '@type': 'Organization', name: 'Klima.Al', '@id': `${SITE}/#business` },
    publisher: { '@type': 'Organization', name: 'Klima.Al', '@id': `${SITE}/#business` },
    datePublished: today,
    dateModified: today,
    inLanguage: 'sq-AL',
    about: [
      { '@type': 'Product', name: 'Mitsubishi Heavy Industries KIREIA', brand: { '@type': 'Brand', name: 'Mitsubishi Heavy Industries' } },
      { '@type': 'Product', name: competitor.name, brand: { '@type': 'Brand', name: competitor.brand } }
    ]
  };

  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="${esc(titleSq)}" data-en-title="${esc(titleEn)}">${esc(titleSq)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="canonical" href="${esc(canonical)}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:title" content="${esc(titleSq)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${SITE}/hero-mitsubishi.jpg" />
  <meta property="article:modified_time" content="${today}" />
  <meta name="last-modified" content="${today}" />

  <link rel="alternate" hreflang="sq-AL" href="${esc(canonical)}" />
  <link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />

  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>

  <script type="application/ld+json">${JSON.stringify(compareSchema)}</script>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="../index.html">Kreu</a></li>
        <li><a class="nav-link" href="../index.html#cat">Produkte</a></li>
        <li><a class="nav-link" href="../materiale.html">Materiale</a></li>
        <li><a class="nav-link" href="../faq.html">Pyetje</a></li>
        <li><a class="nav-link" href="../index.html#contact">Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-right">
      <a href="tel:+355672549225" class="header-phone">📞 +355 67 254 9225</a>
      <button class="cart-btn" id="cartBtn" aria-label="Shporta">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span class="cart-badge" id="cartBadge">0</span>
      </button>
      <div class="lang-sw"><button class="lb lb-active" data-lang="sq">SQ</button><span>|</span><button class="lb" data-lang="en">EN</button></div>
    </div>
    <button class="burger" id="burger" aria-label="Menyja" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="cart-backdrop" id="cartBackdrop"></div>
<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shporta">
  <div class="cart-head"><h3 data-sq="Shporta jote" data-en="Your Cart">Shporta jote</h3><button class="cart-close" id="cartClose" aria-label="Mbyll">×</button></div>
  <div class="cart-body"><div class="cart-list" id="cartList"></div><p class="cart-empty" id="cartEmpty">Shporta është bosh.</p></div>
  <div class="cart-foot"><button class="btn btn-red cart-checkout" id="cartCheckout" disabled>Porosit me WhatsApp</button></div>
</aside>

<main class="category-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a><span>›</span>
      <a href="index.html">Krahasime</a><span>›</span>
      <span class="crumb-current">${esc(competitor.name)}</span>
    </nav>

    <header class="category-head">
      <span class="sec-label" data-sq="Krahasim 2026" data-en="2026 Comparison">Krahasim 2026</span>
      <h1>KIREIA <span style="color:var(--gray);font-weight:600">vs</span> ${esc(competitor.name)}</h1>
      <p class="category-sub" data-sq="${esc(intro_sq)}" data-en="${esc(intro_en)}">${esc(intro_sq)}</p>
    </header>

    <section class="cmp-section" style="margin-top:0">
      <div class="cmp-wrap">
        <table class="cmp-table">
          <thead><tr><th data-sq="Karakteristika" data-en="Feature">Karakteristika</th><th>MHI KIREIA</th><th>${esc(competitor.name)}</th></tr></thead>
          <tbody>
${tableRows}
          </tbody>
        </table>
      </div>
      <p class="cmp-note" data-sq="${esc(summary_sq)}" data-en="${esc(summary_en)}">${esc(summary_sq)}</p>
    </section>

    <section class="team-cta">
      <h2 data-sq="Doni një rekomandim të personalizuar?" data-en="Want a personalized recommendation?">Doni një rekomandim të personalizuar?</h2>
      <p data-sq="Na thoni metratë e dhomës, klimën, dhe buxhetin. Ju themi modelin e duhur — pa shtytje shitjeje."
         data-en="Tell us your room area, climate, and budget. We'll recommend the right model — no sales pressure.">Na thoni metratë e dhomës, klimën, dhe buxhetin. Ju themi modelin e duhur — pa shtytje shitjeje.</p>
      <a href="https://wa.me/355672549225?text=${encodeURIComponent('Përshëndetje, kam pyetje për krahasimin KIREIA vs ' + competitor.name + '.')}" target="_blank" class="btn btn-red">Pyet në WhatsApp</a>
      <a href="../produkte/residential.html" class="btn btn-outline-dark" data-sq="Shiko KIREIA" data-en="Browse KIREIA">Shiko KIREIA</a>
    </section>

    <section style="margin-top:48px;padding-top:32px;border-top:1px solid var(--border-lt,#e5e7eb)">
      <h2 style="font-size:1.4rem;margin-bottom:14px" data-sq="Krahasime të tjera" data-en="Other comparisons">Krahasime të tjera</h2>
      <ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:12px">
        ${COMPARISONS.filter(c => c.slug !== slug).map(c => `<li><a href="${c.slug}.html" class="btn btn-outline-dark btn-sm">KIREIA vs ${esc(c.competitor.name)}</a></li>`).join('')}
      </ul>
    </section>
  </div>
</main>

<footer class="footer">
  <div class="container footer-top"><div class="f-brand"><a href="../index.html" class="logo logo-white"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a></div></div>
  <div class="footer-bottom"><div class="container"><span>© 2026 Klima.Al · <a href="../privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="../kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a></span></div></div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<script src="../search.js" defer></script>
<script src="../favorites.js" defer></script>
<script src="../cart.js" defer></script>
<script src="../app.js" defer></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}

function buildIndex() {
  const canonical = `${SITE}/krahasime/`;
  const titleSq = 'Krahasime kondicionerësh 2026 — KIREIA vs Daikin, LG, Samsung | Klima.Al';
  const titleEn = '2026 A/C comparisons — KIREIA vs Daikin, LG, Samsung | Klima.Al';
  const desc = 'Krahasime faktike krah-për-krah midis Mitsubishi Heavy Industries KIREIA dhe konkurrentëve premium: Daikin Emura, LG DualCool, Samsung WindFree. Specifikime, çmime, garanci.';

  const cards = COMPARISONS.map(c => `
        <a class="cmp-hub-card" href="${c.slug}.html">
          <span class="cmp-hub-label">KIREIA vs</span>
          <h2>${esc(c.competitor.name)}</h2>
          <p>${esc(c.intro_sq.split('.')[0] + '.')}</p>
          <span class="cmp-hub-readmore" data-sq="Shiko krahasimin →" data-en="View comparison →">Shiko krahasimin →</span>
        </a>`).join('');

  return `<!DOCTYPE html>
<html lang="sq">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-sq-title="${esc(titleSq)}" data-en-title="${esc(titleEn)}">${esc(titleSq)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="theme-color" content="#0e1c2f" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Klima.Al" />
  <meta property="og:locale" content="sq_AL" />
  <meta property="og:locale:alternate" content="en_AL" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${esc(titleSq)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${SITE}/hero-mitsubishi.jpg" />
  <meta property="article:modified_time" content="${today}" />
  <meta name="last-modified" content="${today}" />
  <link rel="alternate" hreflang="sq-AL" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${canonical}" />
  <link rel="manifest" href="../manifest.webmanifest" />
  <link rel="stylesheet" href="../style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" /></noscript>
</head>
<body>

<header class="header" id="header">
  <div class="container header-inner">
    <a href="../index.html" class="logo"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a>
    <nav class="nav" id="nav">
      <ul class="nav-list">
        <li><a class="nav-link" href="../index.html">Kreu</a></li>
        <li><a class="nav-link" href="../index.html#cat">Produkte</a></li>
        <li><a class="nav-link" href="../materiale.html">Materiale</a></li>
        <li><a class="nav-link" href="../faq.html">Pyetje</a></li>
        <li><a class="nav-link" href="../index.html#contact">Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-right">
      <a href="tel:+355672549225" class="header-phone">📞 +355 67 254 9225</a>
      <button class="cart-btn" id="cartBtn" aria-label="Shporta"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><span class="cart-badge" id="cartBadge">0</span></button>
      <div class="lang-sw"><button class="lb lb-active" data-lang="sq">SQ</button><span>|</span><button class="lb" data-lang="en">EN</button></div>
    </div>
    <button class="burger" id="burger" aria-label="Menyja" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="cart-backdrop" id="cartBackdrop"></div>
<aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Shporta">
  <div class="cart-head"><h3 data-sq="Shporta jote" data-en="Your Cart">Shporta jote</h3><button class="cart-close" id="cartClose" aria-label="Mbyll">×</button></div>
  <div class="cart-body"><div class="cart-list" id="cartList"></div><p class="cart-empty" id="cartEmpty" data-sq="Shporta është bosh." data-en="Your cart is empty.">Shporta është bosh.</p></div>
  <div class="cart-foot"><button class="btn btn-red cart-checkout" id="cartCheckout" disabled data-sq="Porosit me WhatsApp" data-en="Order via WhatsApp">Porosit me WhatsApp</button></div>
</aside>

<main class="category-page">
  <div class="container">
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="../index.html">Kreu</a><span>›</span>
      <span class="crumb-current" data-sq="Krahasime" data-en="Comparisons">Krahasime</span>
    </nav>
    <header class="category-head">
      <span class="sec-label" data-sq="Krahasime 2026" data-en="2026 comparisons">Krahasime 2026</span>
      <h1 data-sq="KIREIA krah për krah me konkurrencën" data-en="KIREIA side-by-side with the competition">KIREIA krah për krah me konkurrencën</h1>
      <p class="category-sub" data-sq="Krahasime faktike, të bazuara në fletë specifikimesh zyrtare të prodhuesve. Asnjë spinner shitjeje — vetëm numra."
         data-en="Factual comparisons based on official manufacturer spec sheets. No sales spin — just numbers.">Krahasime faktike, të bazuara në fletë specifikimesh zyrtare të prodhuesve. Asnjë spinner shitjeje — vetëm numra.</p>
    </header>

    <div class="cmp-hub-grid">${cards}
    </div>
  </div>
</main>

<footer class="footer">
  <div class="container footer-top"><div class="f-brand"><a href="../index.html" class="logo logo-white"><span class="logo-k">KLIMA</span><span class="logo-dot">.</span><span class="logo-al">AL</span></a></div></div>
  <div class="footer-bottom"><div class="container"><span>© 2026 Klima.Al · <a href="../privatesia.html" data-sq="Privatësia" data-en="Privacy">Privatësia</a> · <a href="../kushte-perdorimi.html" data-sq="Kushtet" data-en="Terms">Kushtet</a></span></div></div>
</footer>

<a href="https://wa.me/355672549225" target="_blank" class="whatsapp-float" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>

<script src="../search.js" defer></script>
<script src="../favorites.js" defer></script>
<script src="../cart.js" defer></script>
<script src="../app.js" defer></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
</body>
</html>`;
}

const OUT = path.join(ROOT, 'krahasime');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);
fs.writeFileSync(path.join(OUT, 'index.html'), buildIndex());
for (const c of COMPARISONS) {
  fs.writeFileSync(path.join(OUT, `${c.slug}.html`), buildPage(c));
}
console.log(`Wrote /krahasime/index.html + ${COMPARISONS.length} comparison pages`);
