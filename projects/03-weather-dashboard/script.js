const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const errorBox = document.getElementById('error');
const result = document.getElementById('result');

const WMO = {
  0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 61: 'Light rain', 63: 'Rain',
  65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 95: 'Thunderstorm',
};

function describe(code) {
  return WMO[code] || 'Mixed conditions';
}

function dayLabel(iso) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.textContent = '';
  result.style.display = 'none';

  const res = await fetch(`/api/weather?city=${encodeURIComponent(cityInput.value.trim())}`);
  const data = await res.json();

  if (!res.ok) {
    errorBox.textContent = data.error || 'Could not fetch weather.';
    return;
  }

  document.getElementById('place').textContent =
    [data.place.name, data.place.admin1, data.place.country].filter(Boolean).join(', ');
  document.getElementById('temp').textContent = `${Math.round(data.current.temperature_2m)}°C`;
  document.getElementById('meta').innerHTML =
    `${describe(data.current.weather_code)}<br>Humidity ${data.current.relative_humidity_2m}% · Wind ${Math.round(data.current.wind_speed_10m)} km/h`;

  const days = document.getElementById('days');
  days.innerHTML = '';

  const highs = data.daily.temperature_2m_max.slice(0, 5);
  const lows = data.daily.temperature_2m_min.slice(0, 5);
  const weekMax = Math.max(...highs);
  const weekMin = Math.min(...lows);
  const span = Math.max(1, weekMax - weekMin);

  data.daily.time.slice(0, 5).forEach((date, i) => {
    const hi = Math.round(highs[i]);
    const lo = Math.round(lows[i]);
    const top = ((weekMax - highs[i]) / span) * 100;
    const bottom = ((lows[i] - weekMin) / span) * 100;

    const el = document.createElement('div');
    el.className = 'day';
    el.innerHTML = `
      <div class="hi">${hi}°</div>
      <div class="track">
        <div class="bar" style="top:${top}%;bottom:${bottom}%"></div>
      </div>
      <div class="lo">${lo}°</div>
      <div class="d">${dayLabel(date)}</div>
    `;
    days.appendChild(el);
  });

  result.style.display = 'block';
});
