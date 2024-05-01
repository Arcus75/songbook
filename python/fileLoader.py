from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Získání seznamu souborů v dané složce
        filelist = os.listdir('../data')

        # Sestavení odpovědi v JSON formátu
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(json.dumps(filelist), 'utf-8'))

# Spuštění HTTP serveru na portu 8000
httpd = HTTPServer(('https://zpevnik.arcusvault.synology.me', 8000), MyHandler)
httpd.serve_forever()