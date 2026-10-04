const rowsEl = document.getElementById('rows');
const paginationEl = document.getElementById('pagination');
const searchEl = document.getElementById('search');
const statusEl = document.getElementById('status-filter');

let state = { q: '', status: 'all', sortField: 'joinedAt', sortDir: 'desc', page: 1 };
let debounceTimer = null;

function updateSortArrows() {
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    const arrow = th.querySelector('.arrow');
    if (th.dataset.sort === state.sortField) {
      arrow.textContent = state.sortDir === 'asc' ? '↑' : '↓';
    } else {
      arrow.textContent = '';
    }
  });
}

async function load() {
  const params = new URLSearchParams({
    q: state.q,
    status: state.status,
    sort: `${state.sortField}:${state.sortDir}`,
    page: state.page,
    perPage: 10,
  });
  const res = await fetch(`/api/customers?${params}`);
  const data = await res.json();
  render(data);
}

function render(data) {
  if (!data.customers.length) {
    rowsEl.innerHTML = '<tr><td colspan="6"><p class="empty">No customers match your filters.</p></td></tr>';
  } else {
    rowsEl.innerHTML = data.customers.map((c) => `
      <tr>
        <td>
          <div class="cell-name">${c.name}</div>
          <div class="cell-sub">${c.email}</div>
        </td>
        <td>${c.company}</td>
        <td>${c.plan}</td>
        <td>${c.mrr ? money(c.mrr) : '—'}</td>
        <td><span class="pill ${c.status}">${c.status}</span></td>
        <td class="cell-sub">${c.joinedAt}</td>
      </tr>
    `).join('');
  }

  paginationEl.innerHTML = `
    <span>${data.total} customer${data.total === 1 ? '' : 's'} · page ${data.page} of ${data.totalPages}</span>
    <div class="btns">
      <button type="button" id="prev-page" ${data.page <= 1 ? 'disabled' : ''}>← Prev</button>
      <button type="button" id="next-page" ${data.page >= data.totalPages ? 'disabled' : ''}>Next →</button>
    </div>
  `;
  document.getElementById('prev-page').addEventListener('click', () => { state.page--; load(); });
  document.getElementById('next-page').addEventListener('click', () => { state.page++; load(); });

  updateSortArrows();
}

document.querySelectorAll('th[data-sort]').forEach((th) => {
  th.addEventListener('click', () => {
    const field = th.dataset.sort;
    if (state.sortField === field) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortField = field;
      state.sortDir = 'asc';
    }
    state.page = 1;
    load();
  });
});

searchEl.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    state.q = searchEl.value;
    state.page = 1;
    load();
  }, 250);
});

statusEl.addEventListener('change', () => {
  state.status = statusEl.value;
  state.page = 1;
  load();
});

load();
