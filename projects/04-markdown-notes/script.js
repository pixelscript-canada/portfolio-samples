const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const titleInput = document.getElementById('title');
const saveBtn = document.getElementById('save');
const list = document.getElementById('list');

let debounceTimer = null;

async function renderPreview() {
  const res = await fetch('/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown: editor.value }),
  });
  const data = await res.json();
  preview.innerHTML = data.html;
}

editor.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(renderPreview, 250);
});

async function loadNotes() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  list.innerHTML = notes.map((n) => `
    <div class="card" style="margin-top:10px">
      <strong>${n.title}</strong>
      <div class="preview" style="margin-top:8px">${n.html}</div>
    </div>
  `).join('') || '<p style="color:var(--muted)">No notes saved yet.</p>';
}

saveBtn.addEventListener('click', async () => {
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: titleInput.value, markdown: editor.value }),
  });
  loadNotes();
});

renderPreview();
loadNotes();
