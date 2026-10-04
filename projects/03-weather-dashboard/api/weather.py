from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, quote
from urllib.request import urlopen
from urllib.error import URLError
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)
        city = (query.get('city', [''])[0] or '').strip()

        if not city:
            self._json(400, {'error': 'city is required'})
            return

        try:
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={quote(city)}&count=1"
            with urlopen(geo_url, timeout=8) as r:
                geo = json.loads(r.read())

            results = geo.get('results') or []
            if not results:
                self._json(404, {'error': f'No location found for "{city}"'})
                return
            place = results[0]

            forecast_url = (
                "https://api.open-meteo.com/v1/forecast"
                f"?latitude={place['latitude']}&longitude={place['longitude']}"
                "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
                "&daily=temperature_2m_max,temperature_2m_min,weather_code"
                "&timezone=auto"
            )
            with urlopen(forecast_url, timeout=8) as r:
                forecast = json.loads(r.read())

            self._json(200, {
                'place': {
                    'name': place.get('name'),
                    'country': place.get('country'),
                    'admin1': place.get('admin1'),
                },
                'current': forecast.get('current'),
                'daily': forecast.get('daily'),
            })
        except URLError as e:
            self._json(502, {'error': 'Upstream weather service failed', 'detail': str(e)})
        except Exception as e:
            self._json(502, {'error': 'Upstream weather service failed', 'detail': str(e)})

    def _json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Content-length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
