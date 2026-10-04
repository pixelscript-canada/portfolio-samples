module.exports = async (req, res) => {
  const from = (req.query.from || 'USD').toString().toUpperCase();
  const to = (req.query.to || 'CAD').toString().toUpperCase();
  const amount = Number(req.query.amount);

  if (!Number.isFinite(amount) || amount < 0) {
    res.status(400).json({ error: 'amount must be a non-negative number' });
    return;
  }

  try {
    const rateRes = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await rateRes.json();

    if (data.result !== 'success' || !data.rates || !data.rates[to]) {
      res.status(400).json({ error: `Unsupported currency pair ${from}/${to}` });
      return;
    }

    const rate = data.rates[to];
    res.status(200).json({
      from,
      to,
      amount,
      rate,
      result: Math.round(amount * rate * 10000) / 10000,
      updatedAt: data.time_last_update_utc,
    });
  } catch (err) {
    res.status(502).json({ error: 'Upstream exchange rate service failed', detail: String(err) });
  }
};
