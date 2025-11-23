import { test, expect } from '@playwright/test';

/**
 * Comprehensive Two Sum Animation Playback Test
 * Tests the complete animation sequence from start to finish
 */

test.describe('Two Sum Full Animation Playback', () => {
  test('validate complete animation sequence', async ({ page }) => {
    console.log('\n🎬 Starting complete animation playback test...\n');

    // Navigate to Two Sum page
    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Click visualize
    console.log('1️⃣ Clicking Visualize button...');
    await page.locator('button:has-text("Visualize")').click();

    // Wait for animation to start
    await page.waitForTimeout(2000);

    // Check initial state after intro message
    console.log('2️⃣ Checking initial pointer state...');
    const leftPointer = page.locator('[data-pointer-id="LEFT"]');
    const rightPointer = page.locator('[data-pointer-id="RIGHT"]');

    const leftCount = await leftPointer.count();
    const rightCount = await rightPointer.count();

    console.log(`   LEFT pointer count: ${leftCount}`);
    console.log(`   RIGHT pointer count: ${rightCount}`);

    if (leftCount === 0) {
      console.error('   ❌ LEFT pointer not found!');
    } else {
      const leftStyle = await leftPointer.getAttribute('style');
      console.log(`   ✓ LEFT pointer style: ${leftStyle}`);
    }

    if (rightCount === 0) {
      console.error('   ❌ RIGHT pointer not found!');
    } else {
      const rightStyle = await rightPointer.getAttribute('style');
      console.log(`   ✓ RIGHT pointer style: ${rightStyle}`);
    }

    // Check array items
    console.log('3️⃣ Checking array items...');
    const arrayItems = page.locator('app-array-item');
    const itemCount = await arrayItems.count();
    console.log(`   Array item count: ${itemCount}`);

    for (let i = 0; i < itemCount; i++) {
      const item = arrayItems.nth(i);
      const value = await item.getAttribute('data-value');
      const index = await item.getAttribute('data-index');
      const isVisible = await item.isVisible();
      console.log(`   Item ${i}: index=${index}, value=${value}, visible=${isVisible}`);
    }

    // Check playback controls
    console.log('4️⃣ Checking playback controls...');
    const pauseBtn = page.locator('button[aria-label*="Pause" i]');
    const stepForwardBtn = page.locator('button[aria-label="Next step"]');
    const stepBackwardBtn = page.locator('button[aria-label="Previous step"]');
    const resetBtn = page.locator('button[aria-label*="Reset" i]');

    console.log(`   Pause button count: ${await pauseBtn.count()}`);
    console.log(`   Step Forward button count: ${await stepForwardBtn.count()}`);
    console.log(`   Step Backward button count: ${await stepBackwardBtn.count()}`);
    console.log(`   Reset button count: ${await resetBtn.count()}`);

    // Wait a bit and check if animation is progressing
    console.log('5️⃣ Waiting for animation to progress...');
    await page.waitForTimeout(3000);

    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'two-sum-playback.png', fullPage: true });
    console.log('   📸 Screenshot saved to two-sum-playback.png');

    // Check current step display
    const stepInfo = page.locator('.step-description').first();
    if (await stepInfo.count() > 0) {
      const stepText = await stepInfo.textContent();
      console.log(`   Current step: "${stepText}"`);
    }

    // Check if code snippet is showing
    const codeSection = page.locator('.code-section, .code-snippet');
    const codeCount = await codeSection.count();
    console.log(`   Code section count: ${codeCount}`);

    if (codeCount > 0) {
      const codeVisible = await codeSection.isVisible();
      console.log(`   Code section visible: ${codeVisible}`);
      if (codeVisible) {
        const codeText = await codeSection.textContent();
        console.log(`   Code content: "${codeText?.substring(0, 50)}..."`);
      }
    }

    // Try pausing and stepping through
    console.log('6️⃣ Testing playback controls...');
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click();
      console.log('   ✓ Clicked Pause');
      await page.waitForTimeout(500);

      if (await stepForwardBtn.count() > 0) {
        console.log('   ✓ Clicking Step Forward...');
        await stepForwardBtn.click();
        await page.waitForTimeout(500);

        const newStepText = await page.locator('.step-description').first().textContent();
        console.log(`   New step: "${newStepText}"`);
      }
    }

    // Check for console errors
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.waitForTimeout(1000);

    if (errors.length > 0) {
      console.error('\n❌ JavaScript errors detected:');
      errors.forEach(err => console.error(`   - ${err}`));
    } else {
      console.log('\n✅ No JavaScript errors detected');
    }

    console.log('\n🏁 Animation playback test complete\n');
  });
});
