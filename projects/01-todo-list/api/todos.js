let todos = [
  { id: '1', title: 'Write the project README', done: true },
  { id: '2', title: 'Wire up the API', done: false },
  { id: '3', title: 'Ship the demo', done: false },
];

function nextId() {
  return (Math.max(0, ...todos.map((t) => Number(t.id) || 0)) + 1).toString();
}

module.exports = (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    res.status(200).json(todos);
    return;
  }

  if (method === 'POST') {
    const title = (req.body && req.body.title || '').toString().trim();
    if (!title) {
      res.status(400).json({ error: 'title is required' });
      return;
    }
    const todo = { id: nextId(), title, done: false };
    todos.push(todo);
    res.status(201).json(todo);
    return;
  }

  if (method === 'PATCH') {
    const id = (req.query.id || '').toString();
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    if (req.body && typeof req.body.title === 'string' && req.body.title.trim()) {
      todo.title = req.body.title.trim();
    }
    if (req.body && typeof req.body.done === 'boolean') {
      todo.done = req.body.done;
    } else {
      todo.done = !todo.done;
    }
    res.status(200).json(todo);
    return;
  }

  if (method === 'DELETE') {
    const id = (req.query.id || '').toString();
    const before = todos.length;
    todos = todos.filter((t) => t.id !== id);
    if (todos.length === before) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
};
