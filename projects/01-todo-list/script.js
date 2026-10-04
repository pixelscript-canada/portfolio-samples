const list = document.getElementById('list');
const form = document.getElementById('form');
const titleInput = document.getElementById('title');

async function load() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  render(todos);
}

function render(todos) {
  list.innerHTML = '';
  if (!todos.length) {
    list.innerHTML = '<p class="empty">No tasks yet. Add one above.</p>';
    return;
  }
  for (const todo of todos) {
    const item = document.createElement('div');
    item.className = 'item' + (todo.done ? ' done' : '');
    item.innerHTML = `
      <input type="checkbox" ${todo.done ? 'checked' : ''}>
      <span class="title"></span>
      <button class="icon" title="Delete">✕</button>
    `;
    item.querySelector('span.title').textContent = todo.title;
    item.querySelector('input').addEventListener('change', () => toggle(todo.id));
    item.querySelector('button').addEventListener('click', () => remove(todo.id));
    list.appendChild(item);
  }
}

async function toggle(id) {
  await fetch(`/api/todos?id=${encodeURIComponent(id)}`, { method: 'PATCH' });
  load();
}

async function remove(id) {
  await fetch(`/api/todos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  load();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  titleInput.value = '';
  load();
});

load();
