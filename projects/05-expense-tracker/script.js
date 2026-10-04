const form = document.getElementById('form');
const errorBox = document.getElementById('error');

function render(data) {
  document.getElementById('total').innerHTML = `$${data.total.toFixed(2)}<span>Total spent</span>`;

  const cats = document.getElementById('categories');
  cats.innerHTML = data.categories.map((c) => `
    <div class="bar-row">
      <div class="bar-label"><span>${c.category}</span><span>$${c.amount.toFixed(2)} · ${c.pct}%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${c.pct}%"></div></div>
    </div>
  `).join('') || '<p style="color:var(--muted)">No expenses yet.</p>';

  const list = document.getElementById('list');
  list.innerHTML = data.expenses.slice().reverse().map((e) => `
    <div class="item">
      <span class="label">${e.label}</span>
      <span class="cat">${e.category}</span>
      <span class="amt">$${e.amount.toFixed(2)}</span>
      <button class="icon" data-id="${e.id}" title="Delete">✕</button>
    </div>
  `).join('') || '<p class="empty" style="color:var(--muted)">No expenses yet.</p>';

  list.querySelectorAll('button.icon').forEach((btn) => {
    btn.addEventListener('click', () => removeExpense(btn.dataset.id));
  });
}

async function load() {
  const res = await fetch('/api/expenses');
  render(await res.json());
}

async function removeExpense(id) {
  const res = await fetch(`/api/expenses?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  render(await res.json());
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.textContent = '';
  const label = document.getElementById('label').value.trim();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value.trim() || 'Other';

  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, amount, category }),
  });
  const data = await res.json();
  if (!res.ok) {
    errorBox.textContent = data.error || 'Something went wrong.';
    return;
  }
  form.reset();
  document.getElementById('category').value = 'Other';
  render(data);
});

load();
