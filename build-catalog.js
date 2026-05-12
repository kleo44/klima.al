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
  from('dc-inverter-hyper-outdoor-units-8-0-kw',  { id: 'multi-8kw-outdoor',   title: 'Multi-Split 8 kW (3–4 Dhoma)', model_code: 'SCM 80 ZS-W', capacity_kw: 8.0, series_label: 'SCM 80 ZS-W · R32', price_text: '72 400 L' }),
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

// Generate sitemap.xml
const SITE = 'https://klima-al.vercel.app';
const today = new Date().toISOString().slice(0, 10);
const staticPages = [
  { loc: '/',              prio: '1.0', freq: 'weekly' },
  { loc: '/produkte.html?cat=residential', prio: '0.9', freq: 'weekly' },
  { loc: '/produkte.html?cat=multisplit',  prio: '0.9', freq: 'weekly' },
  { loc: '/produkte.html?cat=floor',       prio: '0.9', freq: 'weekly' },
  { loc: '/materiale.html', prio: '0.7', freq: 'monthly' }
];
const productUrls = products.map(p => ({
  loc: `/product.html?id=${encodeURIComponent(p.id)}`,
  prio: '0.8',
  freq: 'monthly'
}));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...productUrls].map(u => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`Wrote sitemap.xml — ${staticPages.length + productUrls.length} URLs`);
