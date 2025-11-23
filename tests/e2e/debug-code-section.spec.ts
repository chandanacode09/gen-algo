import { test } from '@playwright/test';

test('debug code section visibility', async ({ page }) => {
  console.log('\n🔍 DEBUGGING CODE SECTION VISIBILITY\n');

  await page.goto('/problems/two-sum');
  await page.waitForLoadState('networkidle');

  // Track code section visibility changes
  const visibilityChanges: Array<{time: number, visible: boolean, step: string}> = [];
  let startTime = Date.now();

  // Monitor visibility changes
  page.on('console', async (msg) => {
    // We'll add console logs in the component to track this
  });

  // Click visualize
  console.log('Starting animation...\n');
  await page.locator('button:has-text("Visualize")').click();

  // Monitor for 5 seconds
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(500);

    const elapsed = Date.now() - startTime;
    const codeSection = page.locator('.code-section');
    const isVisible = await codeSection.isVisible().catch(() => false);

    let stepText = '';
    const stepDesc = page.locator('.step-description').first();
    if (await stepDesc.count() > 0) {
      stepText = (await stepDesc.textContent()) || '';
    }

    visibilityChanges.push({
      time: elapsed,
      visible: isVisible,
      step: stepText.trim()
    });

    console.log(`[${elapsed}ms] Code section: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'} | Step: "${stepText.trim()}"`);
  }

  // Analyze the pattern
  console.log('\n📊 VISIBILITY PATTERN ANALYSIS:\n');

  let toggleCount = 0;
  for (let i = 1; i < visibilityChanges.length; i++) {
    if (visibilityChanges[i].visible !== visibilityChanges[i-1].visible) {
      toggleCount++;
      console.log(`   Toggle #${toggleCount} at ${visibilityChanges[i].time}ms: ${visibilityChanges[i-1].visible ? 'VISIBLE→HIDDEN' : 'HIDDEN→VISIBLE'}`);
      console.log(`      Previous step: "${visibilityChanges[i-1].step}"`);
      console.log(`      New step: "${visibilityChanges[i].step}"`);
    }
  }

  console.log(`\n   Total visibility toggles in 5 seconds: ${toggleCount}`);

  if (toggleCount > 3) {
    console.log('   ⚠️  WARNING: Code section is toggling too frequently!');
  }

  console.log('\n');
});
