import { test } from '@playwright/test';

test('immediate check', async ({ page, browser }) => {
  console.log('Browser version:', browser.version());

  page.on('crash', () => console.error('💥 CRASH!'));
  page.on('pageerror', (e) => console.error('JS Error:', e.message));

  await page.goto('http://localhost:4200', { waitUntil: 'domcontentloaded' });
  console.log('✅ Loaded');

  // Try to get info immediately
  const angularExists = await page.evaluate(() => {
    return typeof (window as any).ng !== 'undefined';
  });
  console.log('Angular exists:', angularExists);

  const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  console.log('Body HTML:', bodyHTML);
});
