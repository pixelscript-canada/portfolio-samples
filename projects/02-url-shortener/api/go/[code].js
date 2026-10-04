const store = globalThis.__urlStore || (globalThis.__urlStore = new Map());

module.exports = (req, res) => {
  const { code } = req.query;
  const entry = store.get(code);

  if (!entry) {
    res.status(404).send('Short link not found (it may have expired — demo storage is in-memory).');
    return;
  }

  entry.clicks += 1;
  res.writeHead(302, { Location: entry.url });
  res.end();
};
