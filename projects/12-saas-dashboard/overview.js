function trendHtml(pct) {
  const up = pct >= 0;
  const arrow = up ? '↑' : '↓';
  return `<span class="trend ${up ? 'up' : 'down'}">${arrow} ${Math.abs(pct)}% vs last week</span>`;
}

function renderKpis(k) {
  const grid = document.getElementById('kpi-grid');
  grid.innerHTML = `
    <div class="kpi-card">
      <div class="label">Monthly Recurring Revenue</div>
      <div class="value">${money(k.mrr)}</div>
      ${trendHtml(k.mrrDeltaPct)}
    </div>
    <div class="kpi-card">
      <div class="label">Active Customers</div>
      <div class="value">${k.activeCustomers}</div>
      <span class="trend up">↑ ${k.trialCustomers} in trial</span>
    </div>
    <div class="kpi-card">
      <div class="label">Avg Revenue / Account</div>
      <div class="value">${money(k.arpa)}</div>
      <span class="trend up">monthly</span>
    </div>
    <div class="kpi-card">
      <div class="label">Churn Rate</div>
      <div class="value">${k.churnRatePct}%</div>
      <span class="trend ${k.churnRatePct > 10 ? 'down' : 'up'}">${k.trialConversionPct}% trial→paid</span>
    </div>
  `;
}

function renderRecent(signups) {
  const el = document.getElementById('recent-list');
  if (!signups.length) {
    el.innerHTML = '<p class="empty">No recent signups.</p>';
    return;
  }
  el.innerHTML = signups.map((s) => `
    <div class="activity-row">
      <div class="av">${initials(s.name)}</div>
      <div class="info">
        <div class="n">${s.name}</div>
        <div class="c">${s.company} · ${s.plan}</div>
      </div>
      <span class="pill ${s.status}">${s.status}</span>
    </div>
  `).join('');
}

function renderChart(series) {
  if (typeof Chart === 'undefined') {
    document.querySelector('.chart-wrap').innerHTML =
      '<p class="empty">Chart library failed to load from the CDN — the data itself is fine, check <code>/api/overview</code>.</p>';
    return;
  }
  const ctx = document.getElementById('revenue-chart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: series.map((d) => d.date.slice(5)),
      datasets: [{
        data: series.map((d) => d.revenue),
        borderColor: '#7c5cff',
        backgroundColor: 'rgba(124,92,255,0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2.5,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8d8d99', maxTicksLimit: 6, font: { size: 11 } } },
        y: { grid: { color: '#26262f' }, ticks: { color: '#8d8d99', font: { size: 11 }, callback: (v) => `$${v}` } },
      },
    },
  });
}

async function load() {
  const res = await fetch('/api/overview');
  const data = await res.json();
  renderKpis(data.kpis);
  renderRecent(data.recentSignups);
  renderChart(data.series);
}

load();
