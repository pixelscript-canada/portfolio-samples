const quotes = require('./_quotes');
const favorites = globalThis.__favIds || (globalThis.__favIds = new Set());

module.exports = (req, res) => {
  if (req.method === 'GET') {
    const list = quotes.filter((q) => favorites.has(q.id));
    res.status(200).json(list);
    return;
  }

  if (req.method === 'POST') {
    const id = (req.body && req.body.id || '').toString();
    if (!quotes.some((q) => q.id === id)) {
      res.status(404).json({ error: 'quote not found' });
      return;
    }
    favorites.add(id);
    res.status(201).json({ ok: true });
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || '').toString();
    favorites.delete(id);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
