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

// Brass dial: dull iron at score 0, bright brass at score 4.
const DIAL_COLORS = ['#7a6a55', '#9c8158', '#b8924f', '#c9a23f', '#d8b24a'];
const ARC_LENGTH = 176; // approx length of the M14,70 A56,56 0 0,1 126,70 path

const needleGroup = document.getElementById('needle-group');
const dialFill = document.getElementById('dial-fill');
dialFill.style.strokeDasharray = `${ARC_LENGTH}`;

function setDial(score) {
  const fraction = Math.max(0, Math.min(1, score / 4));
  dialFill.style.strokeDashoffset = `${ARC_LENGTH * (1 - fraction)}`;
  dialFill.style.stroke = DIAL_COLORS[score] || DIAL_COLORS[0];
  const angle = -90 + fraction * 180;
  needleGroup.style.transform = `rotate(${angle}deg)`;
}

async function scorePassword(password) {
  const label = document.getElementById('label');
  const issues = document.getElementById('issues');

  if (!password) {
    setDial(0);
    label.textContent = '—';
    issues.textContent = '';
    return;
  }

  const res = await fetch(`/api/score?password=${encodeURIComponent(password)}`);
  const data = await res.json();
  setDial(data.score);
  label.textContent = `${data.label} · ~${data.bits} bits of entropy`;
  issues.textContent = data.issues.join(' · ');
}

document.getElementById('check').addEventListener('input', (e) => scorePassword(e.target.value));

generate();
