import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';
import { build, root } from '../scripts/build.mjs';
import { createSiteServer } from '../scripts/serve.mjs';
import { practices } from '../src/practices.mjs';

await build();
const server = createSiteServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {});
const errors = [];
const screenshots = path.join(root, 'test-results');
await mkdir(screenshots, { recursive: true });
const routes = ['/', '/practices/', ...practices.map(p => `/practices/${p.slug}/`), '/notebook/', '/about/'];

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`Failed request: ${request.url()}`));

  for (const route of routes) {
    const response = await page.goto(`${origin}${route}`);
    assert.equal(response.status(), 200, route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    assert.deepEqual(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `Accessibility: ${route}`);
  }
  console.log('PASS: 16 routes, WCAG A/AA automated audits, local assets, no browser errors.');

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of ['/', '/practices/', '/practices/giving-an-a/', '/notebook/', '/about/']) {
      await page.goto(`${origin}${route}`);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${width} ${route}`);
      if ([1440, 768, 390].includes(width)) {
        const name = route === '/' ? 'home' : route.split('/').filter(Boolean).join('-');
        await page.screenshot({ path: path.join(screenshots, `${name}-${width}.png`), fullPage: true });
      }
    }
  }
  console.log('PASS: responsive reflow at 320, 390, 768, 1024, and 1440px.');

  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ['/', '/practices/', '/practices/giving-an-a/', '/notebook/', '/about/']) {
    await page.goto(`${origin}${route}`);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `200% text overflow: ${route}`);
  }
  console.log('PASS: text enlarged to 200% without horizontal overflow.');

  await page.goto(origin);
  await page.screenshot({ path: path.join(screenshots, 'preview-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(screenshots, 'preview-mobile.png') });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(origin);
  await page.locator('#scene').selectOption('mistake');
  await expect(page.locator('#frame-after')).toContainText('human');
  await expect(page.locator('#frame-link')).toHaveAttribute('href', 'practices/rule-number-six/');
  await page.locator('#scene').selectOption('leadership');
  await expect(page.locator('#frame-link')).toHaveAttribute('href', 'practices/leading-from-any-chair/');

  await page.goto(`${origin}/practices/`);
  await page.getByRole('button', { name: 'More connection', exact: true }).click();
  await expect(page.locator('[data-practice]:visible')).toHaveCount(4);
  await page.reload();
  await expect(page.locator('[data-practice]:visible')).toHaveCount(4);
  await page.locator('#practice-search').fill('Giving an A');
  await expect(page.locator('[data-practice]:visible')).toHaveCount(1);
  await page.locator('#practice-search').fill('nothing-matches-this');
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.getByRole('button', { name: 'Show all practices' }).click();
  await expect(page.locator('[data-practice]:visible')).toHaveCount(12);
  console.log('PASS: scene examples, combined filters, shareable filter state, empty search recovery.');

  await page.goto(`${origin}/practices/giving-an-a/#reflect`);
  await page.getByRole('button', { name: 'Save reflection' }).click();
  await expect(page.locator('.save-status')).toContainText('Write a reflection');
  const note = '<img src=x onerror="window.bad=true">\nI can ask what would help.';
  await page.locator('textarea').fill(note);
  await page.getByRole('button', { name: 'Save reflection' }).click();
  await expect(page.locator('.save-status')).toContainText('Saved in this browser');
  await page.reload();
  await expect(page.locator('textarea')).toHaveValue(note);
  await page.goto(`${origin}/notebook/`);
  await expect(page.locator('[data-note="giving-an-a"] .saved-text')).toHaveText(note);
  assert.equal(await page.evaluate(() => window.bad), undefined);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download notes' }).click();
  const download = await downloadPromise;
  const downloadText = await readFile(await download.path(), 'utf8');
  assert.ok(downloadText.includes(note));
  await page.getByRole('button', { name: 'Clear notebook', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Keep my notes' }).click();
  await expect(page.locator('[data-note="giving-an-a"]')).toBeVisible();
  await page.getByRole('button', { name: 'Clear notebook', exact: true }).click();
  await page.getByRole('button', { name: 'Clear all notes' }).click();
  await expect(page.locator('[data-notebook-empty]')).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-notebook-empty]')).toBeVisible();
  console.log('PASS: note validation, persistence, safe text rendering, download, cancel and clear.');

  await page.goto(`${origin}/practices/rule-number-six/`);
  await page.locator('summary').click();
  await expect(page.locator('details')).toHaveAttribute('open', '');
  await page.goto(origin);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  assert.equal(await page.locator('.gesture-lines').evaluate(el => getComputedStyle(el).animationName), 'none');

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${origin}/practices/`);
  await expect(staticPage.locator('.practice-list a')).toHaveCount(12);
  await staticPage.locator('.practice-list a').nth(2).click();
  await expect(staticPage.locator('#try')).toContainText('Try it yourself');
  await expect(staticPage.locator('#reflect noscript')).toBeVisible();
  await noJs.close();

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${origin}/practices/giving-an-a/#reflect`);
  await blockedPage.locator('textarea').fill('Keep this even if saving fails.');
  await blockedPage.getByRole('button', { name: 'Save reflection' }).click();
  await expect(blockedPage.locator('.save-status')).toContainText('Could not save');
  await expect(blockedPage.locator('textarea')).toHaveValue('Keep this even if saving fails.');
  await blocked.close();
  console.log('PASS: keyboard skip link, details, reduced motion, no-JS reading, blocked-storage recovery.');

  const mounted = createSiteServer({ mountPath: '/art-of-possibility/' });
  mounted.listen(0, '127.0.0.1');
  await once(mounted, 'listening');
  const mountedOrigin = `http://127.0.0.1:${mounted.address().port}`;
  try {
    await page.goto(`${mountedOrigin}/art-of-possibility/`);
    await page.getByRole('link', { name: 'Explore the practices', exact: true }).click();
    await expect(page).toHaveURL(`${mountedOrigin}/art-of-possibility/practices/`);
    await page.locator('.practice-list a').nth(2).click();
    await expect(page.locator('h1')).toContainText('Begin with possibility');
    await expect(page.locator('.brand')).toHaveAttribute('href', '../../');
    assert.equal((await fetch(`${mountedOrigin}/art-of-possibility/missing/nested/page/`)).status, 404);
    assert.equal((await fetch(`${mountedOrigin}/art-of-possibility/`, { method: 'POST' })).status, 405);
    const errorPage = await context.newPage();
    await errorPage.goto(`${mountedOrigin}/art-of-possibility/missing/nested/page/`);
    await expect(errorPage.locator('h1')).toHaveText('A differentway back.');
    await errorPage.getByRole('link', { name: 'Explore the practices', exact: true }).click();
    await expect(errorPage).toHaveURL(`${mountedOrigin}/art-of-possibility/practices/`);
    await errorPage.close();
  } finally { await new Promise(resolve => mounted.close(resolve)); }
  assert.deepEqual(errors, []);
  console.log('PASS: deployment under /art-of-possibility/, HTTP 404/405, no console exceptions.');
  console.log(`Screenshots: ${screenshots}`);
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
