const form = document.getElementById('form');
const urlInput = document.getElementById('url');
const result = document.getElementById('result');
const shortLink = document.getElementById('short-link');
const errorBox = document.getElementById('error');
const list = document.getElementById('list');

async function loadStats() {
  const res = await fetch('/api/stats');
  const links = await res.json();
  list.innerHTML = '';
  if (!links.length) {
    list.innerHTML = '<p class="empty">No links yet. Shorten one above.</p>';
    return;
  }
  for (const link of links) {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <span class="orig"></span>
      <a class="short" target="_blank" rel="noopener"></a>
      <span class="clicks"></span>
    `;
    row.querySelector('.orig').textContent = link.url;
    const a = row.querySelector('.short');
    a.href = link.shortUrl;
    a.textContent = `/${link.code}`;
    row.querySelector('.clicks').textContent = `${link.clicks} click${link.clicks === 1 ? '' : 's'}`;
    list.appendChild(row);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.textContent = '';
  result.classList.remove('show');

  const res = await fetch('/api/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: urlInput.value.trim() }),
  });
  const data = await res.json();

  if (!res.ok) {
    errorBox.textContent = data.error || 'Something went wrong.';
    return;
  }

  shortLink.href = data.shortUrl;
  shortLink.textContent = data.shortUrl;
  result.classList.add('show');
  urlInput.value = '';
  loadStats();
});

loadStats();
