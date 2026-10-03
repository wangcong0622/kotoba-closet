/* Minimal local static server for the ES-module game. No package installation required. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, '..');
const host = process.env.KOTOBA_HOST || '127.0.0.1';
const port = Number(process.env.KOTOBA_PORT || 8000);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json'
};

http.createServer((request, response) => {
  let requested;
  try { requested = decodeURIComponent((request.url || '/').split('?')[0]); }
  catch { response.writeHead(400).end('Invalid URL'); return; }
  const relative = requested.replace(/^[/\\]+/, '') || 'index.html';
  if(host !== '127.0.0.1' && !['index.html','sw.js','manifest.webmanifest','apple-touch-icon.png'].includes(relative) && !/^(assets|data|src|styles)\//.test(relative)){response.writeHead(404).end('Not found');return;}
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(data);
  });
}).listen(port, host, () => console.log(`ことばクローゼット: http://localhost:${port}`));
