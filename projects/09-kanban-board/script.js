const board = document.getElementById('board');

async function load() {
  const res = await fetch('/api/board');
  render(await res.json());
}

function render(columns) {
  board.innerHTML = '';
  for (const col of columns) {
    const colEl = document.createElement('div');
    colEl.className = 'column';
    colEl.dataset.column = col.id;
    colEl.innerHTML = `
      <h2>${col.label} (${col.cards.length})</h2>
      <div class="cards"></div>
      <div class="add-row">
        <input type="text" placeholder="New card…">
        <button>Add</button>
      </div>
    `;

    const cardsEl = colEl.querySelector('.cards');
    for (const card of col.cards) {
      const cardEl = document.createElement('div');
      cardEl.className = 'card-item';
      cardEl.draggable = true;
      cardEl.dataset.id = card.id;
      cardEl.innerHTML = `<span></span><button title="Delete">✕</button>`;
      cardEl.querySelector('span').textContent = card.title;
      cardEl.querySelector('button').addEventListener('click', () => removeCard(card.id));
      cardEl.addEventListener('dragstart', () => cardEl.classList.add('dragging'));
      cardEl.addEventListener('dragend', () => cardEl.classList.remove('dragging'));
      cardsEl.appendChild(cardEl);
    }

    colEl.addEventListener('dragover', (e) => { e.preventDefault(); colEl.classList.add('drag-over'); });
    colEl.addEventListener('dragleave', () => colEl.classList.remove('drag-over'));
    colEl.addEventListener('drop', (e) => {
      e.preventDefault();
      colEl.classList.remove('drag-over');
      const dragging = document.querySelector('.card-item.dragging');
      if (dragging) moveCard(dragging.dataset.id, col.id);
    });

    const input = colEl.querySelector('input');
    colEl.querySelector('.add-row button').addEventListener('click', async () => {
      const title = input.value.trim();
      if (!title) return;
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, column: col.id }),
      });
      load();
    });

    board.appendChild(colEl);
  }
}

async function moveCard(id, column) {
  await fetch(`/api/cards?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column }),
  });
  load();
}

async function removeCard(id) {
  await fetch(`/api/cards?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  load();
}

load();
