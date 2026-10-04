const pdpEl = document.getElementById('pdp');
const params = new URLSearchParams(location.search);
const productId = params.get('id');

let qty = 1;

async function load() {
  if (!productId) {
    pdpEl.innerHTML = '<p class="empty-state">No product specified.</p>';
    return;
  }

  const res = await fetch(`/api/products?id=${encodeURIComponent(productId)}`);
  if (!res.ok) {
    pdpEl.innerHTML = '<p class="empty-state">Product not found.</p>';
    return;
  }
  const p = await res.json();
  document.title = `${p.name} — Luma`;

  pdpEl.innerHTML = `
    <div class="gallery">
      ${productArt(p.category, 160)}
    </div>
    <div class="info">
      <div class="cat">${p.category}</div>
      <h1>${p.name}</h1>
      <div class="price-row">
        <span class="price">${money(p.price)}</span>
        ${p.compareAt ? `<span class="compare">${money(p.compareAt)}</span>` : ''}
      </div>
      <div class="stars">${stars(p.rating)} <span style="color:var(--muted)">(${p.reviews} reviews)</span></div>
      <p class="blurb">${p.description}</p>

      <div class="qty-row">
        <div class="qty-control">
          <button type="button" id="qty-minus">−</button>
          <span id="qty-val">1</span>
          <button type="button" id="qty-plus">+</button>
        </div>
        <button type="button" class="btn primary" id="add-btn">Add to cart</button>
      </div>
      <p class="stock-note ${p.stock < 15 ? 'low' : ''}">
        ${p.stock < 15 ? `Only ${p.stock} left in stock` : 'In stock, ships in 2–3 days'}
      </p>

      <div class="detail-section">
        <h4>Why you'll like it</h4>
        <p class="blurb" style="margin-bottom:0">${p.blurb}</p>
      </div>
    </div>
  `;

  const qtyVal = document.getElementById('qty-val');
  document.getElementById('qty-minus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    qtyVal.textContent = qty;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    qty = Math.min(p.stock, qty + 1);
    qtyVal.textContent = qty;
  });
  document.getElementById('add-btn').addEventListener('click', () => {
    addToCart(p.id, qty);
    const btn = document.getElementById('add-btn');
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = 'Add to cart'; }, 1400);
  });
}

load();
