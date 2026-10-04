const state = globalThis.__kanban || (globalThis.__kanban = {
  cards: [
    { id: '1', title: 'Design the API', column: 'done' },
    { id: '2', title: 'Build the board UI', column: 'doing' },
    { id: '3', title: 'Add drag & drop', column: 'doing' },
    { id: '4', title: 'Write the README', column: 'todo' },
    { id: '5', title: 'Deploy demo', column: 'todo' },
  ],
});

module.exports = state;
