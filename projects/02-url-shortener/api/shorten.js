const store = globalThis.__urlStore || (globalThis.__urlStore = new Map());

function randomCode(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

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

  res.status(201).json({ code, shortUrl: `${proto}://${host}/api/go/${code}` });
};
