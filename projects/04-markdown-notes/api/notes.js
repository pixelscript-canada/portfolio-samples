const { renderMarkdown } = require('./_markdown');

let notes = [
  { id: '1', title: 'Welcome', markdown: '# Welcome\n\nType **Markdown** on the left, see it *rendered* on the right.\n\n- Server-side rendering\n- No client library\n\n> Powered by a tiny hand-written parser.' },
];

module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json(notes.map((n) => ({ ...n, html: renderMarkdown(n.markdown) })));
    return;
  }

  if (req.method === 'POST') {
    const title = (req.body && req.body.title || 'Untitled').toString().trim() || 'Untitled';
    const markdown = (req.body && req.body.markdown) || '';
    const note = { id: Date.now().toString(), title, markdown };
    notes.unshift(note);
    res.status(201).json({ ...note, html: renderMarkdown(note.markdown) });
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
