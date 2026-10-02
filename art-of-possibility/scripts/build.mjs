import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { practices } from '../src/practices.mjs';
import { home, indexPage, lesson, notebook, about, notFound } from '../src/templates.mjs';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const output = path.join(root, 'dist');
export async function build() {
  const basePath = `/${(process.env.BASE_PATH || '/').split('/').filter(Boolean).join('/')}`.replace(/\/?$/, '/');
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'public'), output, { recursive: true });
  const pages = [
    ['index.html', home()], ['practices/index.html', indexPage()],
    ...practices.map(p => [`practices/${p.slug}/index.html`, lesson(p)]),
    ['notebook/index.html', notebook()], ['about/index.html', about()], ['404.html', notFound(basePath)]
  ];
  for (const [file, html] of pages) {
    const destination = path.join(output, file);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
  const entries = practices.map(({ slug, title, number, prompt }) => ({ slug, title, number, prompt }));
  await writeFile(path.join(output, 'practice-index.js'), `export const entries = ${JSON.stringify(entries)};\n`);
  console.log(`Built ${pages.length} static pages → dist/`);
  return pages.map(([file]) => file);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
