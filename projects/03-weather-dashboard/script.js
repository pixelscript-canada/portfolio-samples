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
  data.daily.time.slice(0, 5).forEach((date, i) => {
    const el = document.createElement('div');
    el.className = 'day';
    el.innerHTML = `
      <div class="d">${dayLabel(date)}</div>
      <div class="hi">${Math.round(data.daily.temperature_2m_max[i])}°</div>
      <div class="lo">${Math.round(data.daily.temperature_2m_min[i])}°</div>
    `;
    days.appendChild(el);
  });

  result.style.display = 'block';
});
