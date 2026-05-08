/* KLIMA.AL — Product detail page renderer */

(async function () {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const loadingEl = document.getElementById('productLoading');
  const errorEl = document.getElementById('productError');
  const detailEl = document.getElementById('productDetail');

  if (!id) return showError();

  let catalog;
  try {
    const res = await fetch('catalog.json');
    if (!res.ok) throw new Error('catalog ' + res.status);
    catalog = await res.json();
  } catch (e) {
    return showError();
  }

  const product = catalog.products?.find(p => p.id === id || p.slug === id);
  if (!product) return showError();

  loadingEl.style.display = 'none';
  detailEl.style.display = 'block';
  document.title = `${product.title} – Klima.Al`;

  detailEl.innerHTML = renderProduct(product, catalog);
  wireGallery();
  wireAddToCart(product);
  wireSizeSelector(product);

  // Re-apply language
  if (typeof setLang === 'function') {
    setLang(localStorage.getItem('klima-lang') || 'sq');
  }

  function showError() {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
})();

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

  const sizes = p.sizes || (Array.isArray(p.specs) && p.specs.length > 1 ? p.specs.map(s => ({ label: (s.capacity_kw ? s.capacity_kw + ' kW' : s.model) || '', model: s.model })) : null);

  const breadcrumbCat = catalog.categories?.[p.category]?.label_sq || p.category || 'Produkte';

  return `
    <nav class="prod-crumbs" aria-label="Breadcrumb">
      <a href="index.html">Kreu</a>
      <span>›</span>
      <a href="produkte.html?cat=${encodeURIComponent(p.category)}">${escapeHtml(breadcrumbCat)}</a>
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

        ${p.features && p.features.length ? `
          <ul class="prod-features">
            ${p.features.slice(0, 5).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
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
        </div>

        ${p.brochure_url ? `
          <a href="${escapeHtml(p.brochure_url)}" target="_blank" class="prod-brochure">
            📄 <span data-sq="Skedë teknike (PDF)" data-en="Technical brochure (PDF)">Skedë teknike (PDF)</span>
          </a>
        ` : ''}
      </div>
    </div>

    ${p.description ? `
      <section class="prod-section">
        <h2 data-sq="Përshkrimi" data-en="Description">Përshkrimi</h2>
        <div class="prod-desc">${p.description.split(/\n\n+/).map(para => `<p>${escapeHtml(para)}</p>`).join('')}</div>
      </section>
    ` : ''}

    ${Array.isArray(p.specs) && p.specs.length ? renderSpecsTable(p.specs) : ''}

    <div class="prod-back">
      <a href="produkte.html?cat=${encodeURIComponent(p.category)}">← <span data-sq="Kthehu te kategoria" data-en="Back to category">Kthehu te kategoria</span></a>
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
