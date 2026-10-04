from http.server import BaseHTTPRequestHandler
import json
import random

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


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        quote = random.choice(QUOTES)
        body = json.dumps(quote).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Content-length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
