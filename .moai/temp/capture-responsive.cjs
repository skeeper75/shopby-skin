const { chromium } = require('playwright');
const { mkdirSync } = require('fs');

const BASE = 'http://localhost:8080';
const OUT = '/tmp/spec-layout-captures';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1280, height: 900 },
];

const PAGES = [
  { name: 'main', path: '/' },
  { name: 'cart', path: '/cart' },
  { name: 'sign-in', path: '/sign-in' },
  { name: 'sign-up', path: '/sign-up' },
  { name: 'my-page', path: '/my-page' },
  { name: 'find-id', path: '/find-id' },
  { name: 'find-password', path: '/find-password' },
  { name: 'faq', path: '/faq' },
  { name: 'notice', path: '/notice' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const pg of PAGES) {
      try {
        await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1000);
        const file = `${OUT}/${pg.name}_${vp.name}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log(`OK: ${pg.name}_${vp.name}`);
      } catch (e) {
        console.log(`FAIL: ${pg.name}_${vp.name} - ${e.message.slice(0, 80)}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log(`\nCaptures saved to: ${OUT}`);
})();
