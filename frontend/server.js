const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback a index.html para soportar navegación SPA
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (errFallback, fallbackContent) => {
          if (errFallback) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n===============================================================`);
  console.log(`🎓 PLATAFORMA DE MONITORÍAS ACADÉMICAS - UNIVERSIDAD SIMÓN BOLÍVAR`);
  console.log(`===============================================================`);
  console.log(`🚀 Servidor Web ACTIVO en: http://localhost:${PORT}`);
  console.log(`🌐 Acceso en red local: http://127.0.0.1:${PORT}`);
  console.log(`👤 Usuario por defecto: Johan Sebastian Rojas Gómez (MONITOR18)`);
  console.log(`📌 Requisito de Horas: 54 horas reglamentarias`);
  console.log(`===============================================================\n`);
});
