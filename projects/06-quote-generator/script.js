let current = null;

async function nextQuote() {
  const res = await fetch('/api/quote');
  current = await res.json();
  document.getElementById('text').textContent = `“${current.text}”`;
  document.getElementById('author').textContent = `— ${current.author}`;
}

async function loadFavorites() {
  const res = await fetch('/api/favorites');
  const favs = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = favs.map((q) => `
    <div class="item">
      <span class="t">“${q.text}”</span>
      <span class="a">${q.author}</span>
      <button class="icon" data-id="${q.id}" title="Remove">✕</button>
    </div>
  `).join('') || '<p class="empty">No favorites saved yet.</p>';

  list.querySelectorAll('button.icon').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await fetch(`/api/favorites?id=${encodeURIComponent(btn.dataset.id)}`, { method: 'DELETE' });
      loadFavorites();
    });
  });
}

document.getElementById('next').addEventListener('click', nextQuote);
document.getElementById('fav').addEventListener('click', async () => {
  if (!current) return;
  await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: current.id }),
  });
  loadFavorites();
});

nextQuote();
loadFavorites();
