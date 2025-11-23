import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

/**
 * DOM-Aware Validation
 * This test actually understands the DOM structure and visual relationships
 */

interface ArrayItemLayout {
  index: number;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface PointerLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styleLeft: string;
}

interface DOMStructure {
  arrayContainer: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  arrayItems: ArrayItemLayout[];
  pointers: PointerLayout[];
  visualValidation: {
    pointerPositions: Array<{
      pointerId: string;
      expectedIndex: number;
      actualX: number;
      expectedX: number;
      deviation: number;
      aligned: boolean;
    }>;
  };
}

async function analyzeDOMStructure(page: Page): Promise<DOMStructure> {
  // Get array container dimensions
  const arrayContainer = await page.locator('.array-container').first().boundingBox();

  if (!arrayContainer) {
    throw new Error('Array container not found');
  }

  // Get all array items with their positions and data
  const arrayItems = await page.locator('app-array-item').evaluateAll((items) => {
    return items.map((item, idx) => {
      const rect = item.getBoundingClientRect();
      const innerDiv = item.querySelector('.array-item');
      const dataIndex = innerDiv?.getAttribute('data-index');
      const dataValue = innerDiv?.getAttribute('data-value');

      return {
        index: dataIndex ? parseInt(dataIndex) : idx,
        value: dataValue ? parseInt(dataValue) : 0,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        centerX: rect.x + rect.width / 2,
        centerY: rect.y + rect.height / 2,
      };
    });
  });

  // Get pointer positions and styles
  const pointers = await page.locator('[data-pointer-id]').evaluateAll((ptrs) => {
    return ptrs.map((ptr) => {
      const rect = ptr.getBoundingClientRect();
      const style = window.getComputedStyle(ptr);

      // Pointers use transform: translateX(-50%), so their center is what matters
      const centerX = rect.x + (rect.width / 2);

      return {
        id: ptr.getAttribute('data-pointer-id') || 'unknown',
        x: centerX, // Use center X position
        y: rect.y,
        width: rect.width,
        height: rect.height,
        styleLeft: style.left,
      };
    });
  });

  // Calculate visual validation
  const visualValidation = {
    pointerPositions: pointers.map((pointer) => {
      // For LEFT pointer, expect it at index 0
      // For RIGHT pointer, expect it at last index
      const expectedIndex = pointer.id === 'LEFT' ? 0 : arrayItems.length - 1;
      const expectedItem = arrayItems[expectedIndex];

      const actualX = pointer.x;
      const expectedX = expectedItem ? expectedItem.centerX : 0;
      const deviation = Math.abs(actualX - expectedX);
      const aligned = deviation < 5; // Within 5px tolerance

      return {
        pointerId: pointer.id,
        expectedIndex,
        actualX,
        expectedX,
        deviation,
        aligned,
      };
    }),
  };

  return {
    arrayContainer: {
      x: arrayContainer.x,
      y: arrayContainer.y,
      width: arrayContainer.width,
      height: arrayContainer.height,
    },
    arrayItems,
    pointers,
    visualValidation,
  };
}

test.describe('DOM-Aware Two Sum Validation', () => {
  test('understand and validate complete DOM structure', async ({ page }) => {
    console.log('\n🔍 DOM-AWARE VALIDATION\n');
    console.log('This test understands the actual DOM structure and visual relationships\n');

    // Navigate and start animation
    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    console.log('1️⃣ Starting visualization...');
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1500);

    // Analyze DOM structure
    console.log('\n2️⃣ Analyzing DOM structure...\n');
    const domStructure = await analyzeDOMStructure(page);

    // Report array container
    console.log('📦 Array Container:');
    console.log(`   Position: (${domStructure.arrayContainer.x}, ${domStructure.arrayContainer.y})`);
    console.log(`   Size: ${domStructure.arrayContainer.width} × ${domStructure.arrayContainer.height}px`);

    // Report array items
    console.log('\n📊 Array Items:');
    domStructure.arrayItems.forEach((item) => {
      console.log(`   [${item.index}] value=${item.value}, center=(${item.centerX.toFixed(1)}, ${item.centerY.toFixed(1)}), size=${item.width.toFixed(1)}×${item.height.toFixed(1)}px`);
    });

    // Report pointers
    console.log('\n👈 Pointers:');
    domStructure.pointers.forEach((ptr) => {
      console.log(`   ${ptr.id}: position=(${ptr.x.toFixed(1)}, ${ptr.y.toFixed(1)}), style.left=${ptr.styleLeft}`);
    });

    // Visual validation
    console.log('\n🎯 Visual Alignment Validation:');
    let allAligned = true;

    domStructure.visualValidation.pointerPositions.forEach((validation) => {
      const status = validation.aligned ? '✅' : '❌';
      console.log(`   ${status} ${validation.pointerId} pointer:`);
      console.log(`      Expected: index ${validation.expectedIndex} at x=${validation.expectedX.toFixed(1)}px`);
      console.log(`      Actual: x=${validation.actualX.toFixed(1)}px`);
      console.log(`      Deviation: ${validation.deviation.toFixed(1)}px`);

      if (!validation.aligned) {
        allAligned = false;
      }
    });

    // Check array item spacing
    console.log('\n📏 Array Item Spacing Analysis:');
    if (domStructure.arrayItems.length > 1) {
      const spacings = [];
      for (let i = 0; i < domStructure.arrayItems.length - 1; i++) {
        const spacing = domStructure.arrayItems[i + 1].centerX - domStructure.arrayItems[i].centerX;
        spacings.push(spacing);
        console.log(`   Items ${i} → ${i + 1}: ${spacing.toFixed(1)}px`);
      }

      // Check if spacing is uniform
      const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
      const maxDeviation = Math.max(...spacings.map(s => Math.abs(s - avgSpacing)));
      const uniformSpacing = maxDeviation < 5;

      console.log(`   Average spacing: ${avgSpacing.toFixed(1)}px`);
      console.log(`   Max deviation: ${maxDeviation.toFixed(1)}px`);
      console.log(`   ${uniformSpacing ? '✅' : '⚠️'} Spacing is ${uniformSpacing ? 'uniform' : 'non-uniform'}`);
    }

    // Check pointer-to-item relationships
    console.log('\n🔗 Pointer-to-Item Relationships:');
    domStructure.pointers.forEach((pointer) => {
      // Find which array item this pointer is closest to
      let closestItem = null;
      let closestDistance = Infinity;

      domStructure.arrayItems.forEach((item) => {
        const distance = Math.abs(pointer.x - item.centerX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        const expectedIndex = pointer.id === 'LEFT' ? 0 : domStructure.arrayItems.length - 1;
        const correct = closestItem.index === expectedIndex;
        console.log(`   ${correct ? '✅' : '❌'} ${pointer.id} pointer is closest to item[${closestItem.index}] (distance: ${closestDistance.toFixed(1)}px)`);
        console.log(`      Expected: item[${expectedIndex}]`);
      }
    });

    // Overall validation
    console.log('\n📋 Overall Validation:');
    console.log(`   Array items count: ${domStructure.arrayItems.length === 4 ? '✅' : '❌'} ${domStructure.arrayItems.length} (expected 4)`);
    console.log(`   Pointers count: ${domStructure.pointers.length === 2 ? '✅' : '❌'} ${domStructure.pointers.length} (expected 2)`);
    console.log(`   Visual alignment: ${allAligned ? '✅' : '❌'} ${allAligned ? 'All pointers aligned' : 'Alignment issues detected'}`);

    // Take screenshot for visual inspection
    await page.screenshot({ path: 'dom-aware-validation.png', fullPage: true });
    console.log('\n📸 Screenshot saved to dom-aware-validation.png');

    console.log('\n✅ DOM-aware validation complete!\n');

    // Assert critical validations
    expect(domStructure.arrayItems.length).toBe(4);
    expect(domStructure.pointers.length).toBe(2);
    expect(allAligned).toBe(true);
  });

  test('validate pointer movement during animation', async ({ page }) => {
    console.log('\n🎬 POINTER MOVEMENT VALIDATION\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Start animation
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1500);

    // Pause animation
    const pauseBtn = page.locator('button[aria-label*="Pause" i]');
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click();
      console.log('⏸️  Animation paused\n');
    }

    // Get initial state
    const initialState = await analyzeDOMStructure(page);
    console.log('📊 Initial pointer positions:');
    initialState.pointers.forEach(ptr => {
      console.log(`   ${ptr.id}: x=${ptr.x.toFixed(1)}px`);
    });

    // Step forward
    const stepBtn = page.locator('button[aria-label="Next step"]');
    if (await stepBtn.count() > 0) {
      console.log('\n⏭️  Stepping forward...\n');
      await stepBtn.click();
      await page.waitForTimeout(500);

      // Get new state
      const newState = await analyzeDOMStructure(page);
      console.log('📊 New pointer positions:');
      newState.pointers.forEach((ptr, idx) => {
        const oldPtr = initialState.pointers[idx];
        const moved = oldPtr && Math.abs(ptr.x - oldPtr.x) > 1;
        console.log(`   ${ptr.id}: x=${ptr.x.toFixed(1)}px ${moved ? '(moved ➡️)' : '(stationary)'}`);
      });
    }

    console.log('\n✅ Pointer movement validation complete!\n');
  });
});
