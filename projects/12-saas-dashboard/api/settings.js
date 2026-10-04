const settings = globalThis.__dashSettings || (globalThis.__dashSettings = {
  workspaceName: 'Orbit Analytics',
  timezone: 'America/Toronto',
  weeklyDigest: true,
  theme: 'dark',
});

module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json(settings);
    return;
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    if (typeof body.workspaceName === 'string' && body.workspaceName.trim()) {
      settings.workspaceName = body.workspaceName.trim().slice(0, 60);
    }
    if (typeof body.timezone === 'string' && body.timezone.trim()) {
      settings.timezone = body.timezone.trim();
    }
    if (typeof body.weeklyDigest === 'boolean') {
      settings.weeklyDigest = body.weeklyDigest;
    }
    if (['dark', 'light'].includes(body.theme)) {
      settings.theme = body.theme;
    }
    res.status(200).json(settings);
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
