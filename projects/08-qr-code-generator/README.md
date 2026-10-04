# QR Code Generator

Turns any text or URL into a QR code image rendered entirely on the server.

- `GET /api/qrcode?text=...&size=256` — returns a PNG image generated with the
  [`qrcode`](https://www.npmjs.com/package/qrcode) npm package

The frontend just points an `<img>` tag at the API — no canvas or client-side
QR library involved.
