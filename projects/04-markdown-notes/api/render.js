const { renderMarkdown } = require('./_markdown');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }
  const markdown = (req.body && req.body.markdown) || '';
  res.status(200).json({ html: renderMarkdown(markdown) });
};
