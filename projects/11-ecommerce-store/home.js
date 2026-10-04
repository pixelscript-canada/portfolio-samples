const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('grid');

let activeCategory = 'All';
let searchTerm = '';
let debounceTimer = null;

function renderFilters(categories) {
  filtersEl.innerHTML = categories.map((c) => `
    <button type="button" class="chip ${c === activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button>
  `).join('') + `<input type="search" class="search-box" placeholder="Search products…" id="search">`;

  filtersEl.querySelectorAll('.chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      load();
    });
  });

  const search = document.getElementById('search');
  search.value = searchTerm;
  search.addEventListener('input', () => {
    searchTerm = search.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(load, 250);
  });
}

function renderGrid(products) {
  if (!products.length) {
    gridEl.innerHTML = '<p class="empty-state">No products match your search.</p>';
    return;
  }
  gridEl.innerHTML = products.map((p) => `
    <a class="product-card" href="product.html?id=${p.id}">
      <div class="thumb">
        ${p.compareAt ? '<span class="badge">SALE</span>' : ''}
        ${productArt(p.category)}
      </div>
      <div class="cat">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        ${p.compareAt ? `<span class="compare">${money(p.compareAt)}</span>` : ''}
      </div>
      <div class="stars">${stars(p.rating)} <span style="color:var(--muted)">(${p.reviews})</span></div>
    </a>
  `).join('');
}

async function load() {
  const params = new URLSearchParams();
  if (activeCategory !== 'All') params.set('category', activeCategory);
  if (searchTerm) params.set('q', searchTerm);

  const res = await fetch(`/api/products?${params}`);
  const data = await res.json();
  renderFilters(data.categories);
  renderGrid(data.products);
}

load();
