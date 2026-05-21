const http = require('http');
const fs   = require('fs');
const path = require('path');
const PORT = 3002;
const ROOT = __dirname;
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.mjs':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2', '.woff':'font/woff', '.map':'application/json', '.xml':'application/xml', '.txt':'text/plain', '.webmanifest':'application/manifest+json' };

http.createServer((req, res) => {
  const pathname = req.url.split('?')[0];
  const p        = pathname === '/' ? '/index.html' : pathname;
  const file     = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Klima.Al v2 → http://localhost:${PORT}`));
