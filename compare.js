/* KLIMA.AL — Compare page (?ids=a,b,c) */

(async function () {
  const grid = document.getElementById('compareGrid');
  const empty = document.getElementById('compareEmpty');
  if (!grid) return;

  let catalog;
  try {
    const res = await fetch('catalog.json');
    catalog = await res.json();
  } catch {
    grid.innerHTML = '<p>Produktet nuk u ngarkuan.</p>';
    return;
  }

  const params = new URLSearchParams(location.search);
  // Initial ids from query string OR from favorites list
  let initialIds = (params.get('ids') || '').split(',').map(s => s.trim()).filter(Boolean);
  if (initialIds.length === 0 && typeof loadFavs === 'function') initialIds = loadFavs();

  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function render(ids) {
    const products = ids
      .map(id => catalog.products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 4);

    if (products.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }
    grid.style.display = '';
    if (empty) empty.style.display = 'none';

    const cat = catalog.categories || {};
    const lang = localStorage.getItem('klima-lang') || 'sq';

    const rows = [
      { key: 'category',    label_sq: 'Kategoria',    label_en: 'Category' },
      { key: 'model_code',  label_sq: 'Modeli',       label_en: 'Model' },
      { key: 'capacity_kw', label_sq: 'Fuqi (kW)',    label_en: 'Capacity (kW)', suffix: ' kW' },
      { key: 'price_text',  label_sq: 'Çmim',         label_en: 'Price', fallback: 'Me kërkesë' },
      { key: '__features',  label_sq: 'Veçoritë',     label_en: 'Features' }
    ];

    function val(p, key) {
      if (key === 'category') return cat[p.category]?.[`label_${lang}`] || p.category;
      if (key === '__features') {
        const feats = lang === 'sq' ? (p.features_sq || p.features_en) : (p.features_en || p.features_sq);
        if (!feats || !feats.length) return '—';
        return '<ul class="cmp-feat-list">' + feats.slice(0, 5).map(f => `<li>${esc(f)}</li>`).join('') + '</ul>';
      }
      const v = p[key];
      return v == null ? '—' : v;
    }

    const cardCols = products.map(p => `
      <div class="cmp-col">
        <a class="cmp-card" href="product/${encodeURIComponent(p.id)}.html">
          <div class="cmp-img">
            <img src="${esc(p.hero_image)}" alt="${esc(p.title)}" loading="lazy"
                 onerror="this.src='https://placehold.co/300x220/f5f5f5/9b1b2e?text=${encodeURIComponent(p.title)}'" />
          </div>
          <h3 class="cmp-title">${esc(p.title)}</h3>
        </a>
        <button class="cmp-rm" data-id="${esc(p.id)}" aria-label="Hiq nga krahasimi">×</button>
        <button class="btn btn-red cmp-atc" data-id="${esc(p.id)}"
                data-sq="Shto në Shportë" data-en="Add to Cart">Shto në Shportë</button>
      </div>
    `).join('');

    const specRows = rows.map(r => `
      <div class="cmp-row">
        <div class="cmp-row-lbl" data-sq="${esc(r.label_sq)}" data-en="${esc(r.label_en)}">${esc(r.label_sq)}</div>
        ${products.map(p => {
          let v = val(p, r.key);
          if (typeof v === 'number' && r.suffix) v = v + r.suffix;
          if (r.key === 'price_text' && (v == null || v === '—')) v = r.fallback;
          if (r.key === '__features') return `<div class="cmp-row-cell">${v}</div>`;
          return `<div class="cmp-row-cell">${esc(v)}</div>`;
        }).join('')}
      </div>
    `).join('');

    grid.style.setProperty('--cols', products.length);
    grid.innerHTML = `
      <div class="cmp-head">${cardCols}</div>
      <div class="cmp-table">${specRows}</div>
    `;

    grid.querySelectorAll('.cmp-rm').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      if (typeof toggleFav === 'function') toggleFav(b.dataset.id);
      // Re-render in place from the freshly-saved favorites list — no full reload.
      const nextIds = (typeof loadFavs === 'function') ? loadFavs() : ids.filter(id => id !== b.dataset.id);
      render(nextIds);
    }));

    grid.querySelectorAll('.cmp-atc').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      const product = products.find(x => x.id === b.dataset.id);
      if (product && typeof addToCart === 'function') {
        addToCart({
          id: product.id,
          title: product.title,
          subtitle: product.series_label || product.brand_label,
          image: product.hero_image,
          price_text: product.price_text || null
        });
      }
    }));

    if (typeof setLang === 'function') setLang(lang);
    window.dispatchEvent(new Event('klima-products-rendered'));
  }

  render(initialIds);
})();
