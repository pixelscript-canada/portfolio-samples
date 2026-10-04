const crypto = require('crypto');

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}',
};

module.exports = (req, res) => {
  const length = Math.min(64, Math.max(4, parseInt(req.query.length, 10) || 16));
  const useUpper = req.query.upper !== '0';
  const useNumbers = req.query.numbers !== '0';
  const useSymbols = req.query.symbols !== '0';

  let pool = SETS.lower;
  if (useUpper) pool += SETS.upper;
  if (useNumbers) pool += SETS.numbers;
  if (useSymbols) pool += SETS.symbols;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += pool[crypto.randomInt(0, pool.length)];
  }

  res.status(200).json({ password, length, pool: pool.length });
};
