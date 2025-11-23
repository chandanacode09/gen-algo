import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

/**
 * Critical Edge Cases & Error Recovery Validation
 * Tests scenarios that will break in production if not handled
 */

interface StateSnapshot {
  step: number;
  pointers: Array<{ id: string; index: number }>;
  elementStates: Array<{ index: number; state: string }>;
}

async function captureState(page: Page): Promise<StateSnapshot> {
  const stepCounter = page.locator('.step-counter .current-step');
  const step = await stepCounter.textContent().then(t => parseInt(t || '0'));

  // Capture pointer positions
  const pointers = await page.locator('[data-pointer-id]').evaluateAll((ptrs) => {
    return ptrs.map((ptr) => {
      const id = ptr.getAttribute('data-pointer-id') || '';
      // Find closest array item
      const allItems = document.querySelectorAll('app-array-item');
      const rect = ptr.getBoundingClientRect();
      const ptrCenter = rect.x + rect.width / 2;

      let closestIndex = -1;
      let closestDistance = Infinity;

      allItems.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.x + itemRect.width / 2;
        const distance = Math.abs(ptrCenter - itemCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      return { id, index: closestIndex };
    });
  });

  // Capture element states
  const elementStates = await page.locator('app-array-item').evaluateAll((items) => {
    return items.map((item, idx) => {
      const innerDiv = item.querySelector('.array-item');
      const classes = innerDiv?.className || '';
      let state = 'DEFAULT';
      if (classes.includes('anim-state-current')) state = 'CURRENT';
      else if (classes.includes('anim-state-visited')) state = 'VISITED';
      else if (classes.includes('anim-state-result')) state = 'RESULT';
      else if (classes.includes('anim-state-pointer_left')) state = 'POINTER_LEFT';
      else if (classes.includes('anim-state-pointer_right')) state = 'POINTER_RIGHT';

      return { index: idx, state };
    });
  });

  return { step, pointers, elementStates };
}

test.describe('Critical Edge Cases', () => {
  test('backward step validation - state rollback', async ({ page }) => {
    console.log('\n⏪ BACKWARD STEP VALIDATION\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1000);

    // Pause
    await page.locator('button[aria-label*="Pause" i]').click();

    const forwardStates: StateSnapshot[] = [];
    const stepForward = page.locator('button[aria-label="Next step"]');

    // Step forward 5 times, capturing state at each step
    console.log('📹 Capturing forward progression...');
    for (let i = 0; i < 5; i++) {
      const state = await captureState(page);
      forwardStates.push(state);
      console.log(`  Step ${state.step}: Pointers [${state.pointers.map(p => `${p.id}@${p.index}`).join(', ')}]`);
      await stepForward.click();
      await page.waitForTimeout(300);
    }

    // Capture final forward state
    const finalForward = await captureState(page);
    forwardStates.push(finalForward);
    console.log(`  Step ${finalForward.step}: Pointers [${finalForward.pointers.map(p => `${p.id}@${p.index}`).join(', ')}]`);

    console.log('\n⏮️  Stepping backward...');
    const stepBackward = page.locator('button[aria-label="Previous step"]');

    let backwardValid = true;
    const issues: string[] = [];

    // Step backward and verify states match
    for (let i = forwardStates.length - 2; i >= 0; i--) {
      await stepBackward.click();
      await page.waitForTimeout(300);

      const currentState = await captureState(page);
      const expectedState = forwardStates[i];

      console.log(`  Validating step ${currentState.step} (expected ${expectedState.step})`);

      // Validate step number
      if (currentState.step !== expectedState.step) {
        issues.push(`Step number mismatch: got ${currentState.step}, expected ${expectedState.step}`);
        backwardValid = false;
      }

      // Validate pointer positions (match by ID, not array index)
      currentState.pointers.forEach((ptr) => {
        const expected = expectedState.pointers.find(p => p.id === ptr.id);
        if (expected && ptr.index !== expected.index) {
          issues.push(`Step ${currentState.step}: ${ptr.id} pointer at index ${ptr.index}, expected ${expected.index}`);
          backwardValid = false;
        } else if (!expected) {
          issues.push(`Step ${currentState.step}: ${ptr.id} pointer present but not expected`);
          backwardValid = false;
        }
      });

      // Check for missing pointers
      expectedState.pointers.forEach((expectedPtr) => {
        const found = currentState.pointers.find(p => p.id === expectedPtr.id);
        if (!found) {
          issues.push(`Step ${currentState.step}: ${expectedPtr.id} pointer missing (expected at index ${expectedPtr.index})`);
          backwardValid = false;
        }
      });

      // Validate element states
      currentState.elementStates.forEach((elem, idx) => {
        const expected = expectedState.elementStates[idx];
        if (elem.state !== expected.state) {
          issues.push(`Step ${currentState.step}: Element ${idx} state ${elem.state}, expected ${expected.state}`);
          backwardValid = false;
        }
      });
    }

    console.log('\n📊 Backward Validation Results:');
    if (backwardValid) {
      console.log('✅ All backward steps correctly restored previous state!\n');
    } else {
      console.log(`❌ Backward validation failed with ${issues.length} issues:`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    expect(backwardValid).toBe(true);
    expect(issues.length).toBe(0);
  });

  test('reset functionality validation', async ({ page }) => {
    console.log('\n🔄 RESET FUNCTIONALITY VALIDATION\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1000);

    // Pause and step through several steps
    await page.locator('button[aria-label*="Pause" i]').click();
    const stepForward = page.locator('button[aria-label="Next step"]');

    for (let i = 0; i < 5; i++) {
      await stepForward.click();
      await page.waitForTimeout(200);
    }

    const beforeReset = await captureState(page);
    console.log(`Before reset: Step ${beforeReset.step}`);
    console.log(`  Pointers: ${beforeReset.pointers.map(p => `${p.id}@${p.index}`).join(', ')}`);
    console.log(`  Non-default states: ${beforeReset.elementStates.filter(e => e.state !== 'DEFAULT').length}`);

    // Click reset
    console.log('\n🔄 Clicking Reset...\n');
    const resetBtn = page.locator('button[aria-label*="Reset" i]');
    await resetBtn.click();
    await page.waitForTimeout(500);

    const afterReset = await captureState(page);
    console.log(`After reset: Step ${afterReset.step}`);

    const issues: string[] = [];

    // Validate reset cleared everything
    if (afterReset.step !== 0 && afterReset.step !== 1) {
      issues.push(`Step not reset: ${afterReset.step}`);
    }

    // Check pointers are at initial positions
    const leftPtr = afterReset.pointers.find(p => p.id === 'LEFT');
    const rightPtr = afterReset.pointers.find(p => p.id === 'RIGHT');

    if (leftPtr && leftPtr.index !== 0) {
      issues.push(`LEFT pointer not at index 0 after reset: ${leftPtr.index}`);
    }

    if (rightPtr && rightPtr.index !== 3) {
      issues.push(`RIGHT pointer not at last index after reset: ${rightPtr.index}`);
    }

    console.log('📊 Reset Validation:');
    if (issues.length === 0) {
      console.log('✅ Reset correctly restored initial state!\n');
    } else {
      console.log(`❌ Reset validation failed:`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    expect(issues.length).toBe(0);
  });

  test('edge case: empty array - should keep previous valid state', async ({ page }) => {
    console.log('\n📭 EDGE CASE: Empty Array\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Get initial array count
    const initialInput = await page.locator('input#array-input').inputValue();
    console.log(`Initial input: "${initialInput}"`);

    // Try to enter empty array
    const arrayInput = page.locator('input#array-input');
    await arrayInput.clear();
    await arrayInput.fill('');
    await arrayInput.blur(); // Trigger change event

    await page.waitForTimeout(500);

    // Try to visualize - should use default or previous valid array
    const visualizeBtn = page.locator('button:has-text("Visualize")');
    if (await visualizeBtn.isVisible()) {
      await visualizeBtn.click();
      await page.waitForTimeout(1000);

      const arrayItems = await page.locator('app-array-item').count();
      console.log(`Array items rendered: ${arrayItems}`);

      // Component should gracefully handle by keeping valid state (default array has 4 items)
      const handledGracefully = arrayItems >= 2; // parseInput() requires >= 2 elements

      if (handledGracefully) {
        console.log('✅ Empty input handled gracefully - kept valid state\n');
      } else {
        console.log('❌ Empty input caused issues\n');
      }

      expect(handledGracefully).toBe(true);
    }
  });

  test('edge case: single element - should keep previous valid state', async ({ page }) => {
    console.log('\n1️⃣ EDGE CASE: Single Element\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    const arrayInput = page.locator('input#array-input');
    await arrayInput.clear();
    await arrayInput.fill('5');
    await arrayInput.blur(); // Trigger change event

    const targetInput = page.locator('input#target-input');
    await targetInput.clear();
    await targetInput.fill('10');

    await page.waitForTimeout(500);

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1000);

    const arrayItems = await page.locator('app-array-item').count();
    console.log(`Array items: ${arrayItems}`);

    // Component requires >= 2 elements, so should keep valid state (default has 4)
    const handledGracefully = arrayItems >= 2;

    if (handledGracefully) {
      console.log('✅ Single element handled gracefully - kept valid state\n');
    } else {
      console.log('⚠️  Single element behavior unexpected\n');
    }

    expect(handledGracefully).toBe(true);
  });

  test('edge case: no solution exists', async ({ page }) => {
    console.log('\n🚫 EDGE CASE: No Solution\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    const arrayInput = page.locator('input#array-input');
    await arrayInput.clear();
    await arrayInput.fill('1, 2, 3, 4');

    const targetInput = page.locator('input#target-input');
    await targetInput.clear();
    await targetInput.fill('100'); // Impossible to reach

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(3000);

    // Should complete without finding solution
    const noSolutionMsg = await page.locator('text=/no solution/i').count();
    const completedWithoutError = noSolutionMsg > 0 ||
      await page.locator('.step-description').count() > 0;

    console.log(`No solution message shown: ${noSolutionMsg > 0}`);
    console.log(`Animation completed: ${completedWithoutError}`);

    if (completedWithoutError) {
      console.log('✅ No solution case handled gracefully\n');
    } else {
      console.log('❌ No solution case not handled\n');
    }

    expect(completedWithoutError).toBe(true);
  });

  test('edge case: large array', async ({ page }) => {
    console.log('\n📏 EDGE CASE: Large Array (50 elements)\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Generate large array
    const largeArray = Array.from({ length: 50 }, (_, i) => i + 1).join(', ');

    const arrayInput = page.locator('input#array-input');
    await arrayInput.clear();
    await arrayInput.fill(largeArray);

    const targetInput = page.locator('input#target-input');
    await targetInput.clear();
    await targetInput.fill('99'); // 49 + 50

    console.log('⏳ Starting animation with 50 elements...');
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(2000);

    const arrayItems = await page.locator('app-array-item').count();
    const visualizationArea = await page.locator('.visualization-area').isVisible();

    console.log(`Array items rendered: ${arrayItems}`);
    console.log(`Visualization visible: ${visualizationArea}`);

    const handledLargeArray = arrayItems >= 50 && visualizationArea;

    if (handledLargeArray) {
      console.log('✅ Large array rendered successfully\n');
    } else {
      console.log('⚠️  Large array may have issues\n');
    }

    expect(arrayItems).toBeGreaterThanOrEqual(50);
  });

  test('edge case: negative numbers', async ({ page }) => {
    console.log('\n➖ EDGE CASE: Negative Numbers\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    const arrayInput = page.locator('input#array-input');
    await arrayInput.clear();
    await arrayInput.fill('-5, -2, 0, 3, 7');

    const targetInput = page.locator('input#target-input');
    await targetInput.clear();
    await targetInput.fill('-7'); // -5 + -2

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(2000);

    const arrayItems = await page.locator('app-array-item').count();
    const hasNegativeDisplay = await page.evaluate(() => {
      const items = document.querySelectorAll('.array-value');
      return Array.from(items).some(item => item.textContent?.includes('-'));
    });

    console.log(`Array items: ${arrayItems}`);
    console.log(`Negative numbers displayed: ${hasNegativeDisplay}`);

    if (hasNegativeDisplay) {
      console.log('✅ Negative numbers handled correctly\n');
    } else {
      console.log('⚠️  Negative numbers may not display properly\n');
    }

    expect(arrayItems).toBe(5);
    expect(hasNegativeDisplay).toBe(true);
  });
});

test.describe('Error Recovery & Rapid Actions', () => {
  test('rapid button clicking - no crashes', async ({ page }) => {
    console.log('\n⚡ RAPID BUTTON CLICKING TEST\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    await page.locator('button[aria-label*="Pause" i]').click();

    const stepForward = page.locator('button[aria-label="Next step"]');
    const stepBackward = page.locator('button[aria-label="Previous step"]');

    console.log('⚡ Rapidly clicking step buttons...');

    // Rapid forward clicks
    for (let i = 0; i < 10; i++) {
      await stepForward.click({ timeout: 100 }).catch(() => {});
    }

    // Rapid backward clicks
    for (let i = 0; i < 10; i++) {
      await stepBackward.click({ timeout: 100 }).catch(() => {});
    }

    // Mixed rapid clicks
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        await stepForward.click({ timeout: 100 }).catch(() => {});
      } else {
        await stepBackward.click({ timeout: 100 }).catch(() => {});
      }
    }

    await page.waitForTimeout(500);

    // Check still functional
    const stepCounter = await page.locator('.step-counter').isVisible();
    const noJSErrors = await page.evaluate(() => {
      return !(window as any).hasJSError;
    });

    console.log(`Step counter visible: ${stepCounter}`);
    console.log(`No JS errors: ${noJSErrors}`);

    if (stepCounter) {
      console.log('✅ Survived rapid clicking without crashes\n');
    } else {
      console.log('❌ UI broken after rapid clicking\n');
    }

    expect(stepCounter).toBe(true);
  });

  test('double visualize click - no duplicate animations', async ({ page }) => {
    console.log('\n🖱️  DOUBLE CLICK PROTECTION TEST\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    const visualizeBtn = page.locator('button:has-text("Visualize")');

    // Double click rapidly
    console.log('🖱️  Double clicking Visualize...');
    await visualizeBtn.click();
    await visualizeBtn.click({ timeout: 100 }).catch(() => {});
    await page.waitForTimeout(1000);

    // Check only one animation running
    const arrayContainers = await page.locator('.array-container').count();
    const pointerCount = await page.locator('[data-pointer-id]').count();

    console.log(`Array containers: ${arrayContainers}`);
    console.log(`Pointers: ${pointerCount}`);

    const noDuplicates = arrayContainers === 1 && pointerCount === 2;

    if (noDuplicates) {
      console.log('✅ No duplicate animations created\n');
    } else {
      console.log('⚠️  Multiple animations may be running\n');
    }

    expect(arrayContainers).toBe(1);
  });

  test('play/pause spam - state consistency', async ({ page }) => {
    console.log('\n⏯️  PLAY/PAUSE SPAM TEST\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    console.log('⏯️  Rapidly toggling play/pause...');

    // Spam play/pause
    for (let i = 0; i < 15; i++) {
      const pauseBtn = page.locator('button[aria-label*="Pause" i]');
      const playBtn = page.locator('button[aria-label*="Play" i]');

      if (await pauseBtn.count() > 0) {
        await pauseBtn.click({ timeout: 100 }).catch(() => {});
      } else if (await playBtn.count() > 0) {
        await playBtn.click({ timeout: 100 }).catch(() => {});
      }

      await page.waitForTimeout(50);
    }

    await page.waitForTimeout(500);

    // Pause and check state is valid
    const pauseBtn = page.locator('button[aria-label*="Pause" i]');
    if (await pauseBtn.count() > 0) {
      await pauseBtn.click();
    }

    await page.waitForTimeout(300);

    const state = await captureState(page);
    const hasValidState = state.step >= 0 && state.pointers.length === 2;

    console.log(`Current step: ${state.step}`);
    console.log(`State valid: ${hasValidState}`);

    if (hasValidState) {
      console.log('✅ State remained consistent during spam\n');
    } else {
      console.log('❌ State became inconsistent\n');
    }

    expect(hasValidState).toBe(true);
  });
});
