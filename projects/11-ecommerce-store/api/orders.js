const CATALOG = require('./_catalog');

// In-memory order store — resets on cold start, same tradeoff used across
// this repo's demos. Prices are always recomputed server-side from the
// catalog below; the client only ever sends product ids and quantities,
// never prices, so there's nothing to tamper with in the request.
const orders = globalThis.__orders || (globalThis.__orders = new Map());

function nextOrderNumber() {
  const n = (orders.size + 1).toString().padStart(5, '0');
  return `LM-${n}`;
}

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const items = Array.isArray(req.body && req.body.items) ? req.body.items : [];
    const customer = (req.body && req.body.customer) || {};

    if (!items.length) {
      res.status(400).json({ error: 'cart is empty' });
      return;
    }
    if (!customer.name || !customer.email || !customer.address) {
      res.status(400).json({ error: 'name, email and address are required' });
      return;
    }

    const lineItems = [];
    for (const item of items) {
      const product = CATALOG.find((p) => p.id === item.id);
      if (!product) {
        res.status(400).json({ error: `unknown product: ${item.id}` });
        return;
      }
      const qty = Math.max(1, Math.min(20, parseInt(item.qty, 10) || 1));
      lineItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty,
        lineTotal: Math.round(product.price * qty * 100) / 100,
      });
    }

    const subtotal = Math.round(lineItems.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100;
    const shipping = subtotal >= 100 ? 0 : 8;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const order = {
      id: nextOrderNumber(),
      customer: { name: customer.name, email: customer.email, address: customer.address },
      items: lineItems,
      subtotal,
      shipping,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };
    orders.set(order.id, order);

    res.status(201).json(order);
    return;
  }

  if (req.method === 'GET') {
    const id = (req.query.id || '').toString();
    const order = orders.get(id);
    if (!order) {
      res.status(404).json({ error: 'order not found' });
      return;
    }
    res.status(200).json(order);
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
