import { test, expect } from '@playwright/test';

/**
 * Code Section Stability Test
 * Validates that the code section maintains consistent dimensions
 * and doesn't resize between animation steps
 */

test.describe('Code Section Stability', () => {
  test('code section maintains stable dimensions during animation', async ({ page }) => {
    console.log('\n📐 CODE SECTION STABILITY TEST\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Start animation
    console.log('Starting animation...\n');
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1000);

    // Pause to control playback
    const pauseBtn = page.locator('button[aria-label*="Pause" i]');
    await pauseBtn.click();

    // Measure code section dimensions at multiple steps
    const measurements: Array<{
      step: number;
      width: number;
      height: number;
      snippet: string;
    }> = [];

    const stepBtn = page.locator('button[aria-label="Next step"]');

    for (let i = 0; i < 10; i++) {
      // Wait for step to complete
      await page.waitForTimeout(300);

      // Measure code section
      const codeSection = page.locator('.code-section');
      const isVisible = await codeSection.isVisible().catch(() => false);

      if (isVisible) {
        const box = await codeSection.boundingBox();
        const snippet = await page.locator('.code-snippet code').textContent();

        if (box) {
          measurements.push({
            step: i,
            width: box.width,
            height: box.height,
            snippet: snippet?.trim() || '',
          });

          console.log(`Step ${i}:`);
          console.log(`  Size: ${box.width.toFixed(1)}w × ${box.height.toFixed(1)}h`);
          console.log(`  Code: "${snippet?.trim().substring(0, 40)}..."`);
        }
      }

      // Step forward
      await stepBtn.click();
    }

    // Analyze stability
    console.log('\n📊 STABILITY ANALYSIS:\n');

    const widths = measurements.map(m => m.width);
    const heights = measurements.map(m => m.height);

    const minWidth = Math.min(...widths);
    const maxWidth = Math.max(...widths);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);

    const widthVariation = maxWidth - minWidth;
    const heightVariation = maxHeight - minHeight;

    console.log(`Width range: ${minWidth.toFixed(1)}px - ${maxWidth.toFixed(1)}px (variation: ${widthVariation.toFixed(1)}px)`);
    console.log(`Height range: ${minHeight.toFixed(1)}px - ${maxHeight.toFixed(1)}px (variation: ${heightVariation.toFixed(1)}px)`);

    // Width should be completely stable (0px variation)
    const widthStable = widthVariation === 0;

    // Height should be stable within 5px tolerance (for slight rendering differences)
    const heightStable = heightVariation <= 5;

    console.log(`\nWidth stability: ${widthStable ? '✅ STABLE' : `❌ UNSTABLE (${widthVariation.toFixed(1)}px variation)`}`);
    console.log(`Height stability: ${heightStable ? '✅ STABLE' : `❌ UNSTABLE (${heightVariation.toFixed(1)}px variation)`}`);

    if (widthStable && heightStable) {
      console.log('\n✅ Code section dimensions are stable!\n');
    } else {
      console.log('\n❌ Code section is resizing during animation\n');

      // Show which steps had different sizes
      const uniqueSizes = new Map<string, number[]>();
      measurements.forEach(m => {
        const key = `${m.width.toFixed(0)}×${m.height.toFixed(0)}`;
        if (!uniqueSizes.has(key)) {
          uniqueSizes.set(key, []);
        }
        uniqueSizes.get(key)!.push(m.step);
      });

      console.log('Size variations by step:');
      uniqueSizes.forEach((steps, size) => {
        console.log(`  ${size}px at steps: [${steps.join(', ')}]`);
      });
      console.log('');
    }

    // Assert stability
    expect(widthStable).toBe(true);
    expect(heightStable).toBe(true);
  });

  test('code section has minimum height to prevent collapsing', async ({ page }) => {
    console.log('\n📏 MINIMUM HEIGHT TEST\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1500);

    const codeSection = page.locator('.code-section');
    const box = await codeSection.boundingBox();

    console.log(`Code section height: ${box?.height.toFixed(1)}px`);

    // Should have minimum height of at least 150px (min-height: 180px minus padding)
    const hasMinHeight = box && box.height >= 150;

    if (hasMinHeight) {
      console.log('✅ Minimum height constraint applied\n');
    } else {
      console.log('❌ Code section too small\n');
    }

    expect(hasMinHeight).toBe(true);
  });
});
