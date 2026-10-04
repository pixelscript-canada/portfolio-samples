function entropyBits(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  if (!pool) return 0;
  return Math.round(password.length * Math.log2(pool));
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  const password = (req.body && req.body.password || '').toString();
  const bits = entropyBits(password);

  let score = 0;
  if (bits >= 28) score = 1;
  if (bits >= 36) score = 2;
  if (bits >= 60) score = 3;
  if (bits >= 90) score = 4;

  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const commonIssues = [];
  if (password.length < 8) commonIssues.push('Shorter than 8 characters');
  if (!/[A-Z]/.test(password)) commonIssues.push('No uppercase letters');
  if (!/[0-9]/.test(password)) commonIssues.push('No numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) commonIssues.push('No symbols');

  res.status(200).json({ bits, score, label: labels[score], issues: commonIssues });
};
