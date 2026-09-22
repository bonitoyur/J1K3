import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname !== '/' && pathname !== '/index.html' && pathname !== '/firebase-config.js' && !pathname.startsWith('/src/') && !pathname.startsWith('/assets/')) {
      res.writeHead(404).end('Not found'); return;
    }
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, file);
    const publicPath = relative.replaceAll(path.sep, '/');
    if ((publicPath !== 'index.html' && publicPath !== 'firebase-config.js' && !publicPath.startsWith('src/') && !publicPath.startsWith('assets/')) || relative.startsWith('..') || path.isAbsolute(relative) || !mime[path.extname(file)]) {
      res.writeHead(403).end('Forbidden'); return;
    }
    const content = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Cache-Control': 'no-store' });
    res.end(content);
  } catch { res.writeHead(404).end('Not found'); }
});
server.listen(Number(process.env.PORT || 5173), '127.0.0.1', () => {
  console.log(`Open http://localhost:${server.address().port}`);
});
