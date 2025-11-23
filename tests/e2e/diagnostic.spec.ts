import { test, expect } from '@playwright/test';

test('diagnose page crash', async ({ page }) => {
  const consoleMessages: string[] = [];
  const errors: string[] = [];

  // Capture console messages
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log(text);
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    const errorText = `PAGE ERROR: ${error.message}\n${error.stack}`;
    errors.push(errorText);
    console.error(errorText);
  });

  try {
    console.log('Navigating to /problems...');
    await page.goto('/problems', { timeout: 10000 });
    console.log('✓ Successfully loaded /problems');

    await page.waitForTimeout(2000);

    // Try to navigate to Two Sum
    console.log('\nNavigating to /problems/two-sum...');
    await page.goto('/problems/two-sum', { timeout: 10000, waitUntil: 'dom contentloaded' });
    console.log('✓ Successfully loaded /problems/two-sum');

    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'two-sum-page.png', fullPage: true });
    console.log('✓ Screenshot saved');

  } catch (error) {
    console.error('\n❌ Navigation failed:', error);

    // Print all captured errors
    if (errors.length > 0) {
      console.error('\n🔴 JavaScript Errors Detected:');
      errors.forEach((err, i) => console.error(`${i + 1}. ${err}`));
    }

    throw error;
  }

  // Print summary
  console.log('\n📊 Console Messages:', consoleMessages.length);
  console.log('🔴 Errors:', errors.length);
});
