const state = require('./_store');

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'doing', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

module.exports = (req, res) => {
  const board = COLUMNS.map((col) => ({
    ...col,
    cards: state.cards.filter((c) => c.column === col.id),
  }));
  res.status(200).json(board);
};
