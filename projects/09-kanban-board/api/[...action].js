// /api/board and /api/cards are both handled here in one serverless function
// so the card list is a single shared in-memory store — splitting them into
// separate files would put each on its own Lambda with its own memory, and a
// card added via /api/cards would never show up when /api/board is fetched.
const state = require('./_store');

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];
const VALID_COLUMNS = COLUMNS.map((c) => c.id);

function getBoard(req, res) {
  const board = COLUMNS.map((col) => ({
    ...col,
    cards: state.cards.filter((c) => c.column === col.id),
  }));
  res.status(200).json(board);
}

function createCard(req, res) {
  const title = (req.body && req.body.title || '').toString().trim();
  const column = VALID_COLUMNS.includes(req.body && req.body.column) ? req.body.column : 'todo';
  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const card = { id: Date.now().toString(), title, column };
  state.cards.push(card);
  res.status(201).json(card);
}

function updateCard(req, res, id) {
  const card = state.cards.find((c) => c.id === id);
  if (!card) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  if (VALID_COLUMNS.includes(req.body && req.body.column)) {
    card.column = req.body.column;
  }
  res.status(200).json(card);
}

function deleteCard(req, res, id) {
  const before = state.cards.length;
  state.cards = state.cards.filter((c) => c.id !== id);
  if (state.cards.length === before) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.status(204).end();
}

module.exports = (req, res) => {
  const action = req.query['...action'] || [];
  const [segment] = Array.isArray(action) ? action : [action];
  const id = (req.query.id || '').toString();

  if (segment === 'board' && req.method === 'GET') return getBoard(req, res);
  if (segment === 'cards' && req.method === 'POST') return createCard(req, res);
  if (segment === 'cards' && req.method === 'PATCH') return updateCard(req, res, id);
  if (segment === 'cards' && req.method === 'DELETE') return deleteCard(req, res, id);

  res.status(405).json({ error: 'method not allowed' });
};
