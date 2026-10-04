const fromSel = document.getElementById('from');
const toSel = document.getElementById('to');
const amountInput = document.getElementById('amount');
const errorBox = document.getElementById('error');
const result = document.getElementById('result');

async function convert() {
  errorBox.textContent = '';
  result.style.display = 'none';

  const params = new URLSearchParams({
    from: fromSel.value,
    to: toSel.value,
    amount: amountInput.value || '0',
  });
  const res = await fetch(`/api/convert?${params}`);
  const data = await res.json();

  if (!res.ok) {
    errorBox.textContent = data.error || 'Conversion failed.';
    return;
  }

  document.getElementById('amount-out').textContent = `${data.result.toLocaleString()} ${data.to}`;
  document.getElementById('rate-out').textContent =
    `1 ${data.from} = ${data.rate.toFixed(4)} ${data.to} · updated ${data.updatedAt}`;
  result.style.display = 'block';
}

document.getElementById('go').addEventListener('click', convert);
document.getElementById('swap').addEventListener('click', () => {
  const tmp = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tmp;
  convert();
});

convert();
