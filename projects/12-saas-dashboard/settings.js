const form = document.getElementById('settings-form');
const digestSwitch = document.getElementById('digest-switch');
const saveNote = document.getElementById('save-note');

let weeklyDigest = true;

digestSwitch.addEventListener('click', () => {
  weeklyDigest = !weeklyDigest;
  digestSwitch.classList.toggle('on', weeklyDigest);
});

async function load() {
  const res = await fetch('/api/settings');
  const s = await res.json();
  document.getElementById('workspaceName').value = s.workspaceName;
  document.getElementById('timezone').value = s.timezone;
  weeklyDigest = s.weeklyDigest;
  digestSwitch.classList.toggle('on', weeklyDigest);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  saveNote.classList.remove('show');

  const payload = {
    workspaceName: document.getElementById('workspaceName').value,
    timezone: document.getElementById('timezone').value,
    weeklyDigest,
  };

  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  document.querySelectorAll('[data-workspace-name]').forEach((el) => { el.textContent = data.workspaceName; });
  saveNote.classList.add('show');
  setTimeout(() => saveNote.classList.remove('show'), 2000);
});

load();
