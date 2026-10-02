import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, output, root } from './build.mjs';

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

export function createSiteServer({ directory = output, mountPath = '/' } = {}) {
  const mount = `/${mountPath.split('/').filter(Boolean).join('/')}${mountPath === '/' ? '' : '/'}`;
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
      if (!pathname.startsWith(mount)) { response.writeHead(404); response.end('Not found'); return; }
      const relative = pathname.slice(mount.length);
      let file = path.resolve(directory, relative || '.');
      if (file !== directory && !file.startsWith(`${directory}${path.sep}`)) { response.writeHead(403); response.end('Forbidden'); return; }
      const info = await stat(file).catch(() => null);
      if (info?.isDirectory()) {
        if (!pathname.endsWith('/')) { response.writeHead(308, { Location: `${url.pathname}/${url.search}` }); response.end(); return; }
        file = path.join(file, 'index.html');
      }
      const data = await readFile(file).catch(() => null);
      if (data) {
        response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' });
        response.end(request.method === 'HEAD' ? undefined : data);
      } else {
        // Set the base on missing nested routes so navigation and assets still work.
        const page = (await readFile(path.join(directory, '404.html'), 'utf8')).replace(/<base href="[^"]*">/, `<base href="${mount}">`);
        response.writeHead(404, { 'Content-Type': mimeTypes['.html'] });
        response.end(request.method === 'HEAD' ? undefined : page);
      }
    } catch { response.writeHead(400); response.end('Bad request'); }
  });
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await build();
  const server = createSiteServer();
  const port = Number(process.env.PORT || 4174);
  server.listen(port, '127.0.0.1', () => console.log(`The Art of Possibility → http://127.0.0.1:${port}`));
  if (process.argv.includes('--watch')) {
    let timer;
    for (const folder of ['src', 'public']) watch(path.join(root, folder), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          // Templates import content, so use a fresh process for a complete module reload.
          const { spawn } = await import('node:child_process');
          const child = spawn(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
          child.on('error', error => console.error(error));
        } catch (error) { console.error(error); }
      }, 120);
    });
  }
}
