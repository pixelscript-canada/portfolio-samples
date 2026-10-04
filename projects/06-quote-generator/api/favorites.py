from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

QUOTES = [
    {'id': '1', 'text': 'Simplicity is the soul of efficiency.', 'author': 'Austin Freeman'},
    {'id': '2', 'text': 'Make it work, make it right, make it fast.', 'author': 'Kent Beck'},
    {'id': '3', 'text': 'Programs must be written for people to read.', 'author': 'Harold Abelson'},
    {'id': '4', 'text': 'The best error message is the one that never shows up.', 'author': 'Thomas Fuchs'},
    {'id': '5', 'text': 'Code is like humor. When you have to explain it, it is bad.', 'author': 'Cory House'},
    {'id': '6', 'text': 'First, solve the problem. Then, write the code.', 'author': 'John Johnson'},
    {'id': '7', 'text': 'Any fool can write code that a computer can understand.', 'author': 'Martin Fowler'},
    {'id': '8', 'text': 'Fix the cause, not the symptom.', 'author': 'Steve Maguire'},
]
QUOTES_BY_ID = {q['id']: q for q in QUOTES}

# Module-level state persists across warm invocations of this function
# (resets on cold start) — fine for a demo, same tradeoff as the in-memory
# stores in the Node.js and Go examples in this repo.
favorite_ids = set()


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        favorites = [q for q in QUOTES if q['id'] in favorite_ids]
        self._json(200, favorites)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length) if length else b'{}'
        try:
            payload = json.loads(raw or b'{}')
        except json.JSONDecodeError:
            payload = {}

        quote_id = str(payload.get('id', ''))
        if quote_id not in QUOTES_BY_ID:
            self._json(404, {'error': 'quote not found'})
            return

        favorite_ids.add(quote_id)
        self._json(201, {'ok': True})

    def do_DELETE(self):
        query = parse_qs(urlparse(self.path).query)
        quote_id = (query.get('id', [''])[0] or '')
        favorite_ids.discard(quote_id)
        self._json(200, {'ok': True})

    def _json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Content-length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
