const cartPageEl = document.getElementById('cart-page');

function previewTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

async function load() {
  const cart = getCart();
  if (!cart.length) {
    cartPageEl.innerHTML = `
      <div>
        <p class="empty-state" style="padding:40px 0">Your cart is empty.</p>
        <a href="index.html" class="btn primary">Continue shopping</a>
      </div>
      <div></div>
    `;
    return;
  }

  const items = await Promise.all(cart.map(async (entry) => {
    const res = await fetch(`/api/products?id=${encodeURIComponent(entry.id)}`);
    const product = await res.json();
    return { ...entry, product };
  }));

  const rows = items.map((i) => `
    <div class="cart-row" data-id="${i.id}">
      ${productArt(i.product.category, 36)}
      <div class="info">
        <h4>${i.product.name}</h4>
        <div class="muted">${money(i.product.price)} × ${i.qty}</div>
        <button type="button" class="remove" data-remove="${i.id}">Remove</button>
      </div>
      <div class="qty-control">
        <button type="button" data-dec="${i.id}">−</button>
        <span>${i.qty}</span>
        <button type="button" data-inc="${i.id}">+</button>
      </div>
      <div style="font-weight:800;min-width:60px;text-align:right">${money(i.product.price * i.qty)}</div>
    </div>
  `).join('');

  const t = previewTotals(items);

  cartPageEl.innerHTML = `
    <div>${rows}</div>
    <div class="summary-card">
      <h3>Order summary</h3>
      <div class="summary-line"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <div class="summary-line"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : money(t.shipping)}</span></div>
      <div class="summary-line"><span>Estimated tax</span><span>${money(t.tax)}</span></div>
      <div class="summary-line total"><span>Total</span><span>${money(t.total)}</span></div>
      <a href="checkout.html" class="btn primary block" style="margin-top:16px">Checkout</a>
    </div>
  `;

  cartPageEl.querySelectorAll('[data-inc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.inc;
      const item = items.find((i) => i.id === id);
      setQty(id, item.qty + 1);
      load();
    });
  });
  cartPageEl.querySelectorAll('[data-dec]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.dec;
      const item = items.find((i) => i.id === id);
      setQty(id, item.qty - 1);
      load();
    });
  });
  cartPageEl.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.remove);
      load();
    });
  });
}

load();
