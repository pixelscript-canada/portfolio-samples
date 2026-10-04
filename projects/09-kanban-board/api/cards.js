const state = require('./_store');
const VALID_COLUMNS = ['todo', 'doing', 'done'];

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const title = (req.body && req.body.title || '').toString().trim();
    const column = VALID_COLUMNS.includes(req.body && req.body.column) ? req.body.column : 'todo';
    if (!title) {
      res.status(400).json({ error: 'title is required' });
      return;
    }
    const card = { id: Date.now().toString(), title, column };
    state.cards.push(card);
    res.status(201).json(card);
    return;
  }

  if (req.method === 'PATCH') {
    const id = (req.query.id || '').toString();
    const card = state.cards.find((c) => c.id === id);
    if (!card) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    if (VALID_COLUMNS.includes(req.body && req.body.column)) {
      card.column = req.body.column;
    }
    res.status(200).json(card);
    return;
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id || '').toString();
    const before = state.cards.length;
    state.cards = state.cards.filter((c) => c.id !== id);
    if (state.cards.length === before) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
