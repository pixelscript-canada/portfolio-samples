const store = globalThis.__urlStore || (globalThis.__urlStore = new Map());

module.exports = (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  const links = Array.from(store.entries())
    .map(([code, v]) => ({ code, shortUrl: `${proto}://${host}/api/go/${code}`, ...v }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  res.status(200).json(links);
};
