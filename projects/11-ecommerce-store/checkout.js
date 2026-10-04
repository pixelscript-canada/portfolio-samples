const checkoutEl = document.getElementById('checkout');

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
    checkoutEl.innerHTML = `<p class="empty-state">Your cart is empty. <a href="index.html">Go shopping →</a></p>`;
    return;
  }

  const items = await Promise.all(cart.map(async (entry) => {
    const res = await fetch(`/api/products?id=${encodeURIComponent(entry.id)}`);
    const product = await res.json();
    return { ...entry, product };
  }));
  const t = previewTotals(items);

  checkoutEl.innerHTML = `
    <form id="checkout-form">
      <div class="form-row">
        <div class="form-group"><label>Full name</label><input name="name" required></div>
        <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
      </div>
      <div class="form-group"><label>Shipping address</label><textarea name="address" rows="3" required></textarea></div>
      <div class="form-row">
        <div class="form-group"><label>Card number</label><input value="4242 4242 4242 4242" disabled></div>
        <div class="form-group"><label>Expiry / CVC</label><input value="12/29 · 123" disabled></div>
      </div>
      <p style="font-size:12px;color:var(--muted);margin:-6px 0 18px">This is a demo — payment fields are disabled, no real charge happens. The order itself is a real API call.</p>
      <button type="submit" class="btn primary block">Place order — ${money(t.total)}</button>
      <div class="error-text" id="error"></div>
    </form>
    <div class="summary-card">
      <h3>Order summary</h3>
      ${items.map((i) => `
        <div class="summary-line"><span>${i.product.name} × ${i.qty}</span><span>${money(i.product.price * i.qty)}</span></div>
      `).join('')}
      <div class="summary-line"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : money(t.shipping)}</span></div>
      <div class="summary-line"><span>Estimated tax</span><span>${money(t.tax)}</span></div>
      <div class="summary-line total"><span>Total</span><span>${money(t.total)}</span></div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type=submit]');
    const errorEl = document.getElementById('error');
    errorEl.textContent = '';
    btn.disabled = true;
    btn.textContent = 'Placing order…';

    const payload = {
      items: cart.map((c) => ({ id: c.id, qty: c.qty })),
      customer: {
        name: form.name.value,
        email: form.email.value,
        address: form.address.value,
      },
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Something went wrong.';
      btn.disabled = false;
      btn.textContent = `Place order — ${money(t.total)}`;
      return;
    }

    localStorage.removeItem('luma_cart_v1');
    updateCartBadge();
    renderConfirmation(data);
  });
}

function renderConfirmation(order) {
  document.getElementById('checkout-wrap').innerHTML = `
    <div class="confirmation">
      <div class="check">✓</div>
      <h1>Order confirmed</h1>
      <p class="order-no">Order <strong>${order.id}</strong> — confirmation sent to ${order.customer.email}</p>
      <div class="order-summary">
        ${order.items.map((i) => `
          <div class="summary-line"><span>${i.name} × ${i.qty}</span><span>${money(i.lineTotal)}</span></div>
        `).join('')}
        <div class="summary-line"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : money(order.shipping)}</span></div>
        <div class="summary-line"><span>Tax</span><span>${money(order.tax)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${money(order.total)}</span></div>
      </div>
      <a href="index.html" class="btn primary" style="margin-top:28px">Continue shopping</a>
    </div>
  `;
}

load();
