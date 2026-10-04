module.exports = async (req, res) => {
  const city = (req.query.city || '').toString().trim();
  if (!city) {
    res.status(400).json({ error: 'city is required' });
    return;
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geo = await geoRes.json();
    const place = geo.results && geo.results[0];
    if (!place) {
      res.status(404).json({ error: `No location found for "${city}"` });
      return;
    }

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
        `&timezone=auto`
    );
    const forecast = await forecastRes.json();

    res.status(200).json({
      place: {
        name: place.name,
        country: place.country,
        admin1: place.admin1 || null,
      },
      current: forecast.current,
      daily: forecast.daily,
    });
  } catch (err) {
    res.status(502).json({ error: 'Upstream weather service failed', detail: String(err) });
  }
};
