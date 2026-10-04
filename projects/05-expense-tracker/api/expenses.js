let expenses = [
  { id: '1', label: 'Groceries', amount: 64.2, category: 'Food' },
  { id: '2', label: 'Bus pass', amount: 45, category: 'Transport' },
  { id: '3', label: 'Netflix', amount: 15.99, category: 'Subscriptions' },
];

function withStats(items) {
  const total = items.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  for (const e of items) {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }
  const categories = Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      pct: total ? Math.round((amount / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { expenses: items, total: Math.round(total * 100) / 100, categories };
}

module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json(withStats(expenses));
    return;
  }

  if (req.method === 'POST') {
    const label = (req.body && req.body.label || '').toString().trim();
    const amount = Number(req.body && req.body.amount);
    const category = (req.body && req.body.category || 'Other').toString().trim() || 'Other';
    if (!label || !Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: 'label and a positive amount are required' });
      return;
    }
    expenses.push({ id: Date.now().toString(), label, amount, category });
    res.status(201).json(withStats(expenses));
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || '').toString();
    expenses = expenses.filter((e) => e.id !== id);
    res.status(200).json(withStats(expenses));
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
