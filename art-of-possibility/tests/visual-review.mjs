import { chromium } from '@playwright/test';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import { build, root } from '../scripts/build.mjs';
import { createSiteServer } from '../scripts/serve.mjs';
await build();
const server = createSiteServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const browser = await chromium.launch();
const label = process.argv[2] || 'review';
await mkdir(`${root}/test-results`, { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const [name, route] of [['home','/'], ['lesson','/practices/giving-an-a/']]) {
    await page.goto(origin + route);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${root}/test-results/${label}-${name}.png`, fullPage: true });
    if (name === 'home') await page.locator('[data-reveal-frame]').click();
    else await page.locator('[data-guide-toggle]').click();
    await page.waitForFunction(() => document.getAnimations().length === 0);
    await page.screenshot({ path: `${root}/test-results/${label}-${name}-active.png`, fullPage: true });
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
