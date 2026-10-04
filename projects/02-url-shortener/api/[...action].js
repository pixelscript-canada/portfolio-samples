// Every /api/* request is routed through this one serverless function so the
// in-memory link store is shared across shorten/redirect/stats — splitting
// these into separate files would put each on its own Lambda with its own
// memory, and a shortened link would 404 the moment you tried to visit it.
const store = globalThis.__urlStore || (globalThis.__urlStore = new Map());

function randomCode(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function shorten(req, res) {
  const url = (req.body && req.body.url || '').toString().trim();
  let parsed;
  try {
    parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('bad protocol');
  } catch {
    res.status(400).json({ error: 'a valid http(s) URL is required' });
    return;
  }

  let code = randomCode();
  while (store.has(code)) code = randomCode();
  store.set(code, { url: parsed.toString(), clicks: 0, createdAt: new Date().toISOString() });

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  res.status(201).json({ code, shortUrl: `${proto}://${host}/api/go?code=${code}` });
}

function goTo(req, res, code) {
  const entry = store.get(code);
  if (!entry) {
    res.status(404).send('Short link not found (it may have expired — demo storage is in-memory).');
    return;
  }
  entry.clicks += 1;
  res.writeHead(302, { Location: entry.url });
  res.end();
}

function stats(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const links = Array.from(store.entries())
    .map(([code, v]) => ({ code, shortUrl: `${proto}://${host}/api/go?code=${code}`, ...v }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.status(200).json(links);
}

module.exports = (req, res) => {
  const action = req.query['...action'] || [];
  const [segment] = Array.isArray(action) ? action : [action];

  if (segment === 'shorten' && req.method === 'POST') return shorten(req, res);
  if (segment === 'go' && req.query.code) return goTo(req, res, req.query.code.toString());
  if (segment === 'stats') return stats(req, res);

  res.status(404).json({ error: 'not found' });
};
