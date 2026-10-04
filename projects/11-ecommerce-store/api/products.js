const CATALOG = require('./_catalog');

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const id = (req.query.id || '').toString();
  if (id) {
    const product = CATALOG.find((p) => p.id === id);
    if (!product) {
      res.status(404).json({ error: 'product not found' });
      return;
    }
    res.status(200).json(product);
    return;
  }

  const category = (req.query.category || '').toString();
  const q = (req.query.q || '').toString().toLowerCase().trim();

  let results = CATALOG;
  if (category && category !== 'All') {
    results = results.filter((p) => p.category === category);
  }
  if (q) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    products: results,
    categories: ['All', ...Array.from(new Set(CATALOG.map((p) => p.category)))],
  });
};
