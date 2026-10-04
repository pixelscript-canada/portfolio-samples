const { generateCustomers } = require('./_customers');
const { mulberry32 } = require('./_rng');

const ALL = generateCustomers();

function round2(n) {
  return Math.round(n * 100) / 100;
}

function buildSeries(days = 30) {
  const rng = mulberry32(7);
  const series = [];
  let base = 1400;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const weekday = date.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.78 : 1;
    base += base * (0.01 + rng() * 0.015);
    const noise = 1 + (rng() - 0.5) * 0.18;
    series.push({
      date: date.toISOString().slice(0, 10),
      revenue: Math.round(base * weekendDip * noise),
    });
  }
  return series;
}

module.exports = (req, res) => {
  const active = ALL.filter((c) => c.status === 'active');
  const trial = ALL.filter((c) => c.status === 'trial');
  const churned = ALL.filter((c) => c.status === 'churned');

  const mrr = round2(active.reduce((s, c) => s + c.mrr, 0));
  const arpa = active.length ? round2(mrr / active.length) : 0;
  const churnRate = round2((churned.length / ALL.length) * 100);
  const trialConversion = round2((active.length / (active.length + trial.length + churned.length)) * 100);

  const series = buildSeries(30);
  const last7 = series.slice(-7).reduce((s, d) => s + d.revenue, 0);
  const prev7 = series.slice(-14, -7).reduce((s, d) => s + d.revenue, 0);
  const weekGrowth = prev7 ? round2(((last7 - prev7) / prev7) * 100) : 0;

  const recentSignups = [...ALL]
    .sort((a, b) => (a.joinedAt < b.joinedAt ? 1 : -1))
    .slice(0, 6)
    .map((c) => ({ name: c.name, company: c.company, plan: c.plan, joinedAt: c.joinedAt, status: c.status }));

  res.status(200).json({
    kpis: {
      mrr,
      mrrDeltaPct: weekGrowth,
      activeCustomers: active.length,
      trialCustomers: trial.length,
      arpa,
      churnRatePct: churnRate,
      trialConversionPct: trialConversion,
    },
    series,
    recentSignups,
  });
};
