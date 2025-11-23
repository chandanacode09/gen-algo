import { test } from '@playwright/test';

test('load root page', async ({ page }) => {
  const errors: string[] = [];

  page.on('pageerror', (error) => {
    const fullError = `${error.message}\n${error.stack}`;
    console.error('❌ JavaScript Error:', fullError);
    errors.push(fullError);
  });

  page.on('crash', () => {
    console.error('💥 PAGE CRASHED!');
  });

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type}] ${text}`);
  });

  try {
    console.log('Loading http://localhost:4200 ...');
    await page.goto('http://localhost:4200', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    console.log('✅ Page loaded!');

    // Try to get page title immediately
    const title = await page.title();
    console.log('Page title:', title);

    // Take screenshot before any potential crash
    await page.screenshot({ path: 'page-before-crash.png' });
    console.log('Screenshot saved');

    // Now wait to see if crash occurs
    console.log('Waiting to see if page crashes...');
    await page.waitForTimeout(3000);

    console.log('✅ No crash after 3 seconds');

  } catch (error: any) {
    console.error('\n💥 CRASH DETAILS:');
    console.error('Error:', error.message);
    if (errors.length > 0) {
      console.error('\n🔴 Captured JavaScript Errors:');
      errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
    }
    throw error;
  }
});
