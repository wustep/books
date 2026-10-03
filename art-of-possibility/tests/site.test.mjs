import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { build, output } from '../scripts/build.mjs';
import { practices } from '../src/practices.mjs';

const pages = await build();
test('each practice has a complete, unique teaching route and valid cross-reference', () => {
  assert.equal(practices.length, 12);
  assert.equal(new Set(practices.map(p => p.slug)).size, 12);
  for (const [index, practice] of practices.entries()) {
    assert.equal(practice.number, index + 1);
    assert.equal(practice.steps.length, 3);
    assert.ok(practices.some(p => p.slug === practice.related));
    for (const field of ['idea', 'explanation', 'scenario', 'oldFrame', 'newFrame', 'prompt', 'nuance', 'outcome']) assert.ok(practice[field].length > 20, `${practice.slug}: ${field}`);
  }
});

test('every generated page has a main landmark, one h1, metadata, and unique IDs', async () => {
  for (const file of pages) {
    const html = await readFile(path.join(output, file), 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
    assert.equal((html.match(/<main[ >]/g) || []).length, 1, file);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="description"/);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `Duplicate IDs in ${file}`);
    if (file.startsWith('practices/') && file !== 'practices/index.html') {
      for (const id of ['idea', 'everyday', 'try', 'reflect']) assert.ok(ids.includes(id), `${file} missing ${id}`);
    }
  }
});

test('all local navigation, assets, and fragment targets resolve without a client router', async () => {
  for (const file of pages) {
    const html = await readFile(path.join(output, file), 'utf8');
    for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(value)) continue;
      const url = new URL(value, `https://example.test/${file}`);
      let target = path.join(output, decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
      const info = await stat(target).catch(() => null);
      assert.ok(info?.isFile(), `${file} links to missing ${value}`);
      if (url.hash && target.endsWith('.html')) {
        const destination = await readFile(target, 'utf8');
        assert.ok(destination.includes(`id="${url.hash.slice(1)}"`), `${file}: missing fragment ${value}`);
      }
    }
  }
});

test('production documents do not request remote scripts, fonts, or images', async () => {
  for (const file of pages) {
    const html = await readFile(path.join(output, file), 'utf8');
    assert.doesNotMatch(html, /(?:src|href)="https?:[^\"]+\.(?:js|css|woff2|jpg|png)/);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>[^<]+<\/script>/);
  }
});
