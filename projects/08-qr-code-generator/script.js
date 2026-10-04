const form = document.getElementById('form');
const textInput = document.getElementById('text');
const img = document.getElementById('qr');

function update() {
  const text = textInput.value.trim() || 'https://example.com';
  img.src = `/api/qrcode?size=440&text=${encodeURIComponent(text)}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  update();
});

update();
