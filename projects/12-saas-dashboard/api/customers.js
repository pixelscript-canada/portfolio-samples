const { generateCustomers } = require('./_customers');

const ALL = generateCustomers();

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const q = (req.query.q || '').toString().toLowerCase().trim();
  const status = (req.query.status || '').toString();
  const sort = (req.query.sort || 'joinedAt:desc').toString();
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const perPage = Math.min(50, Math.max(5, parseInt(req.query.perPage, 10) || 10));

  let rows = ALL;
  if (q) {
    rows = rows.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'all') {
    rows = rows.filter((c) => c.status === status);
  }

  const [field, dir] = sort.split(':');
  const sorted = [...rows].sort((a, b) => {
    let av = a[field];
    let bv = b[field];
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  const total = sorted.length;
  const start = (page - 1) * perPage;
  const pageRows = sorted.slice(start, start + perPage);

  res.status(200).json({
    customers: pageRows,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  });
};
