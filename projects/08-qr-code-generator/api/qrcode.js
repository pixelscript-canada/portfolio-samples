const QRCode = require('qrcode');

module.exports = async (req, res) => {
  const text = (req.query.text || 'https://example.com').toString();
  const size = Math.min(1024, Math.max(64, parseInt(req.query.size, 10) || 256));

  try {
    const buffer = await QRCode.toBuffer(text, {
      type: 'png',
      width: size,
      margin: 1,
      color: { dark: '#0b0c10', light: '#ffffff' },
    });
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code', detail: String(err) });
  }
};
