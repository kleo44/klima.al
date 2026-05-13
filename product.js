/* KLIMA.AL — Product detail page renderer + hydrator.
   Two modes:
   (a) PRE-RENDERED — when /product/<slug>.html exists, it ships with all
       content already in the HTML + a <script id="productData"> JSON block.
       We just attach interactive handlers.
   (b) DYNAMIC — legacy /product.html?id=<slug>; we fetch catalog.json
       and render the article from scratch. */

(async function () {
  const loadingEl = document.getElementById('productLoading');
  const errorEl   = document.getElementById('productError');
  const detailEl  = document.getElementById('productDetail');
  const dataEl    = document.getElementById('productData');

  // PRE-RENDERED mode: product data baked into the page
  if (dataEl && detailEl && !detailEl.innerHTML.trim().startsWith('<')) {
    // detailEl exists but empty — fall through to dynamic path
  }
  if (dataEl) {
    try {
      const product = JSON.parse(dataEl.textContent);
      hydratePrerendered(product);
      return;
    } catch (e) {
      console.warn('Bad productData JSON, falling back', e);
    }
  }

  // DYNAMIC mode
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { setNoIndex(); return showError(); }

  let catalog;
  try {
    const res = await fetch('catalog.json');
    if (!res.ok) throw new Error('catalog ' + res.status);
    catalog = await res.json();
  } catch (e) {
    return showError();
  }

  const product = catalog.products?.find(p => p.id === id || p.slug === id);
  if (!product) { setNoIndex(); return showError(); }

  loadingEl && (loadingEl.style.display = 'none');
  detailEl && (detailEl.style.display = 'block');
  const titleEl = document.querySelector('title');
  if (titleEl) {
    titleEl.dataset.sqTitle = `${product.title} – Klima.Al`;
    titleEl.dataset.enTitle = `${product.title} – Klima.Al`;
  }
  document.title = `${product.title} – Klima.Al`;
  updateMeta(product);

  function renderAll() {
    detailEl.innerHTML = renderProduct(product, catalog);
    wireGallery();
    wireAddToCart(product);
    wireSizeSelector(product);
    renderStickyCta(product);
    if (typeof setLang === 'function') setLang(localStorage.getItem('klima-lang') || 'sq');
  }
  renderAll();
  document.querySelectorAll('.lb').forEach(b => b.addEventListener('click', () => setTimeout(renderAll, 0)));

  function showError() {
    loadingEl && (loadingEl.style.display = 'none');
    errorEl   && (errorEl.style.display = 'block');
  }
})();

function hydratePrerendered(product) {
  wireGallery();
  wireAddToCart(product);
  wireSizeSelector(product);
  renderStickyCta(product);
  if (typeof syncFavHearts === 'function') syncFavHearts();
  if (typeof setLang === 'function') setLang(localStorage.getItem('klima-lang') || 'sq');
}

function renderStickyCta(product) {
  document.getElementById('prodStickyCta')?.remove();
  const priceText = product.price_text || product.price || 'Me kërkesë';
  const isOnRequest = !product.price_text && !product.price;
  const bar = document.createElement('div');
  bar.id = 'prodStickyCta';
  bar.className = 'prod-sticky-cta';
  bar.innerHTML = `
    <div class="psc-price">
      <span class="psc-price-lbl" data-sq="Çmim" data-en="Price">Çmim</span>
      <strong class="psc-price-val ${isOnRequest ? 'on-request' : ''}"${isOnRequest ? ' data-sq="Me kërkesë" data-en="On request"' : ''}>${escapeHtml(priceText)}</strong>
    </div>
    <button class="btn btn-red" id="prodStickyAtc" data-sq="Shto në Shportë" data-en="Add to Cart">Shto në Shportë</button>
  `;
  document.body.appendChild(bar);
  bar.querySelector('#prodStickyAtc').addEventListener('click', () => {
    document.getElementById('prodAtc')?.click();
  });
}

function updateMeta(product) {
  const desc = (product.description_sq || product.description || '').slice(0, 200) ||
               `${product.title} — Mitsubishi Heavy Industries. Çmim dhe specifikime në Klima.Al.`;
  const img = product.hero_image || 'https://klimaal.com/hero-mitsubishi.jpg';
  const title = `${product.title} – Klima.Al`;
  const url = `https://klimaal.com/product/${encodeURIComponent(product.id)}.html`;
  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:image', img);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setMeta('name', 'twitter:image', img);
  const canon = document.getElementById('prodCanonical');
  if (canon) canon.setAttribute('href', url);
  injectProductJsonLd(product, url, img, desc);
}

function injectProductJsonLd(product, url, img, desc) {
  document.getElementById('productJsonLd')?.remove();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: img,
    description: desc,
    sku: product.model_code || product.id,
    brand: { '@type': 'Brand', name: product.brand_label || 'Mitsubishi Heavy Industries' },
    category: product.category
  };
  if (product.model_code) data.mpn = product.model_code;
  // Only emit Offer when a real price exists. For "Me kërkesë" products,
  // emit no offer at all rather than a fake $0/InStock which Google flags as Free.
  if (product.price_text) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: /€/.test(product.price_text) ? 'EUR' : 'ALL',
      price: String(product.price_text).replace(/[^\d.]/g, ''),
      availability: 'https://schema.org/InStock',
      url
    };
  }
  const s = document.createElement('script');
  s.id = 'productJsonLd';
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);

  injectBreadcrumb(product);
}

function injectBreadcrumb(product) {
  document.getElementById('breadcrumbJsonLd')?.remove();
  const catLabels = {
    residential: 'Kondicionerë Mural',
    multisplit:  'Sisteme Multi-Split',
    floor:       'Sisteme Dysheme'
  };
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type':'ListItem', position:1, name:'Kreu',      item:'https://klimaal.com/' },
      { '@type':'ListItem', position:2, name:catLabels[product.category] || 'Produkte', item:`https://klimaal.com/produkte/${product.category}.html` },
      { '@type':'ListItem', position:3, name:product.title }
    ]
  };
  const s = document.createElement('script');
  s.id = 'breadcrumbJsonLd';
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function setNoIndex() {
  let m = document.querySelector('meta[name="robots"]');
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute('name', 'robots');
    document.head.appendChild(m);
  }
  m.setAttribute('content', 'noindex,nofollow');
}

function setMeta(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderProduct(p, catalog) {
  const images = [p.hero_image, ...(p.gallery_images || [])].filter(Boolean);
  const hasMulti = images.length > 1;
  const priceText = p.price_text || p.price || 'Me kërkesë';
  const isOnRequest = !p.price_text && !p.price;
  const lang = localStorage.getItem('klima-lang') || 'sq';
  const description = (lang === 'sq' ? (p.description_sq || p.description_en) : (p.description_en || p.description_sq)) || p.description;
  const features    = (lang === 'sq' ? (p.features_sq    || p.features_en)    : (p.features_en    || p.features_sq))    || p.features || [];
  const descSq      = p.description_sq || description;
  const descEn      = p.description_en || description;

  const sizes = p.sizes || (Array.isArray(p.specs) && p.specs.length > 1 ? p.specs.map(s => ({ label: (s.capacity_kw ? s.capacity_kw + ' kW' : s.model) || '', model: s.model })) : null);

  const breadcrumbCat = catalog.categories?.[p.category]?.label_sq || p.category || 'Produkte';

  return `
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="index.html">Kreu</a>
      <span>›</span>
      <a href="produkte/${encodeURIComponent(p.category)}.html">${escapeHtml(breadcrumbCat)}</a>
      <span>›</span>
      <span class="crumb-current">${escapeHtml(p.title)}</span>
    </nav>

    <div class="prod-grid">
      <div class="prod-gallery">
        <div class="prod-hero" id="prodHero">
          ${images.length
            ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(p.title)}" id="prodHeroImg" />`
            : `<div class="prod-hero-placeholder">${escapeHtml(p.title)}</div>`}
        </div>
        ${hasMulti ? `
          <div class="prod-thumbs">
            ${images.map((src, i) => `
              <button class="prod-thumb${i === 0 ? ' active' : ''}" data-src="${escapeHtml(src)}" aria-label="Image ${i + 1}">
                <img src="${escapeHtml(src)}" alt="" loading="lazy" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="prod-info">
        ${p.brand_label ? `<span class="prod-brand">${escapeHtml(p.brand_label)}</span>` : `<span class="prod-brand">Mitsubishi Heavy Industries</span>`}
        <h1 class="prod-title">${escapeHtml(p.title)}</h1>
        ${p.subtitle ? `<p class="prod-sub">${escapeHtml(p.subtitle)}</p>` : ''}

        ${features && features.length ? `
          <ul class="prod-features">
            ${features.slice(0, 5).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
        ` : ''}

        ${sizes && sizes.length > 1 ? `
          <div class="prod-sizes">
            <span class="prod-sizes-lbl">Modeli:</span>
            <div class="prod-sizes-row" id="prodSizes">
              ${sizes.map((s, i) => `
                <button class="prod-size-btn${i === 0 ? ' active' : ''}"
                        data-idx="${i}"
                        data-model="${escapeHtml(s.model || '')}"
                        data-label="${escapeHtml(s.label || s.model || '')}">
                  ${escapeHtml(s.label || s.model || '')}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="prod-price-row">
          <div class="prod-price-block">
            <span class="prod-price-lbl">Çmim</span>
            <strong class="prod-price ${isOnRequest ? 'on-request' : ''}" id="prodPrice">${escapeHtml(priceText)}</strong>
          </div>
          <button class="btn btn-red prod-atc" id="prodAtc"
                  data-sq="Shto në Shportë" data-en="Add to Cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:-3px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Shto në Shportë
          </button>
          <button class="prod-fav" type="button" data-id="${escapeHtml(p.id)}" aria-label="Shto te të preferuarat" aria-pressed="false" title="Shto te të preferuarat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        ${p.brochure_url ? `
          <a href="${escapeHtml(p.brochure_url)}" target="_blank" class="prod-brochure">
            📄 <span data-sq="Skedë teknike (PDF)" data-en="Technical brochure (PDF)">Skedë teknike (PDF)</span>
          </a>
        ` : ''}
      </div>
    </div>

    ${description ? `
      <section class="prod-section">
        <h2 data-sq="Përshkrimi" data-en="Description">Përshkrimi</h2>
        <div class="prod-desc">${description.split(/\n\n+/).map(para => `<p>${escapeHtml(para)}</p>`).join('')}</div>
      </section>
    ` : ''}

    ${Array.isArray(p.specs) && p.specs.length ? renderSpecsTable(p.specs) : ''}

    <div class="prod-back">
      <a href="produkte/${encodeURIComponent(p.category)}.html">← <span data-sq="Kthehu te kategoria" data-en="Back to category">Kthehu te kategoria</span></a>
    </div>
  `;
}

function renderSpecsTable(specs) {
  const allKeys = [...new Set(specs.flatMap(s => Object.keys(s)))];
  const colKeys = allKeys.filter(k => k !== 'model');
  const labels = {
    capacity_kw: 'Fuqi (kW)',
    cooling_input_w: 'Konsum ftohjeje (W)',
    heating_input_w: 'Konsum ngrohjeje (W)',
    energy_class_cool: 'Klasa energjie (ftohje)',
    energy_class_heat: 'Klasa energjie (ngrohje)',
    seer: 'SEER',
    scop: 'SCOP',
    noise_db: 'Zhurma (dB)',
    weight_kg: 'Pesha (kg)',
    dimensions_mm: 'Dimensionet (mm)',
    refrigerant: 'Refrigjerant',
    voltage: 'Voltazhi',
    temperature_range: 'Brezi i temperaturës'
  };
  return `
    <section class="prod-section">
      <h2 data-sq="Specifikime" data-en="Specifications">Specifikime</h2>
      <div class="prod-specs-wrap">
        <table class="prod-specs">
          <thead>
            <tr>
              <th>Modeli</th>
              ${colKeys.map(k => `<th>${escapeHtml(labels[k] || k.replace(/_/g, ' '))}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${specs.map(row => `
              <tr>
                <td><strong>${escapeHtml(row.model || '—')}</strong></td>
                ${colKeys.map(k => `<td>${escapeHtml(row[k] != null ? row[k] : '—')}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function wireGallery() {
  const heroImg = document.getElementById('prodHeroImg');
  const thumbs = document.querySelectorAll('.prod-thumb');
  thumbs.forEach(t => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      if (heroImg) heroImg.src = t.dataset.src;
    });
  });
}

function wireSizeSelector(product) {
  const btns = document.querySelectorAll('.prod-size-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function wireAddToCart(product) {
  const favBtn = document.querySelector('.prod-fav');
  if (favBtn && typeof toggleFav === 'function') {
    favBtn.addEventListener('click', () => {
      toggleFav(product.id, {
        title: product.title,
        subtitle: product.series_label || product.brand_label,
        image: product.hero_image,
        price_text: product.price_text || null
      });
    });
  }
  if (typeof syncFavHearts === 'function') syncFavHearts();

  const btn = document.getElementById('prodAtc');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const activeSize = document.querySelector('.prod-size-btn.active');
    let title = product.title;
    let suffix = '';
    if (activeSize) {
      suffix = ' — ' + (activeSize.dataset.label || activeSize.dataset.model);
      title = product.title + suffix;
    }
    const id = product.id + (activeSize ? '__' + (activeSize.dataset.model || activeSize.dataset.idx) : '');
    if (typeof addToCart === 'function') {
      addToCart({
        id,
        title,
        subtitle: product.subtitle || product.brand_label || '',
        image: product.hero_image,
        price_text: product.price_text || product.price || null
      });
    }
  });
}
