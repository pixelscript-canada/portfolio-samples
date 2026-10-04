const lengthInput = document.getElementById('length');
const lengthVal = document.getElementById('length-val');
const output = document.getElementById('output');

lengthInput.addEventListener('input', () => { lengthVal.textContent = lengthInput.value; });

async function generate() {
  const params = new URLSearchParams({
    length: lengthInput.value,
    upper: document.getElementById('upper').checked ? '1' : '0',
    numbers: document.getElementById('numbers').checked ? '1' : '0',
    symbols: document.getElementById('symbols').checked ? '1' : '0',
  });
  const res = await fetch(`/api/generate?${params}`);
  const data = await res.json();
  output.value = data.password;
  scorePassword(data.password);
}

document.getElementById('generate').addEventListener('click', generate);

document.getElementById('copy').addEventListener('click', async () => {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
});

const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#22c55e'];

async function scorePassword(password) {
  const fill = document.getElementById('fill');
  const label = document.getElementById('label');
  const issues = document.getElementById('issues');

  if (!password) {
    fill.style.width = '0%';
    label.textContent = '';
    issues.textContent = '';
    return;
  }

  const res = await fetch(`/api/score?password=${encodeURIComponent(password)}`);
  const data = await res.json();
  fill.style.width = `${(data.score / 4) * 100}%`;
  fill.style.background = COLORS[data.score];
  label.textContent = `${data.label} · ~${data.bits} bits of entropy`;
  issues.textContent = data.issues.join(' · ');
}

document.getElementById('check').addEventListener('input', (e) => scorePassword(e.target.value));

generate();
