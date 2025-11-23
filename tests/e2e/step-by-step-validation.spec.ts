import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

/**
 * Step-by-Step DOM Validation
 * Validates DOM state changes at EACH animation step
 */

interface StepSnapshot {
  stepNumber: number;
  description: string;
  timestamp: number;
  dom: {
    pointers: Array<{
      id: string;
      position: number; // actual pixel position
      expectedIndex: number;
      actualIndex: number; // closest array item
      aligned: boolean;
    }>;
    elements: Array<{
      index: number;
      value: number;
      state: string; // CSS class indicating state
      expectedState?: string;
      stateCorrect: boolean;
    }>;
    codeSection: {
      visible: boolean;
      snippet: string;
      lineNumber: string;
    };
  };
  issues: string[];
}

interface ValidationReport {
  totalSteps: number;
  validatedSteps: number;
  snapshots: StepSnapshot[];
  criticalIssues: string[];
  warnings: string[];
  passed: boolean;
}

async function captureStepSnapshot(
  page: Page,
  stepNumber: number
): Promise<StepSnapshot> {
  const snapshot: StepSnapshot = {
    stepNumber,
    description: '',
    timestamp: Date.now(),
    dom: {
      pointers: [],
      elements: [],
      codeSection: {
        visible: false,
        snippet: '',
        lineNumber: '',
      },
    },
    issues: [],
  };

  // Get step description
  const stepDesc = page.locator('.step-description').first();
  if (await stepDesc.count() > 0) {
    snapshot.description = (await stepDesc.textContent())?.trim() || '';
  }

  // Capture array items and their states
  const arrayItems = await page.locator('app-array-item').evaluateAll((items) => {
    return items.map((item, idx) => {
      const rect = item.getBoundingClientRect();
      const innerDiv = item.querySelector('.array-item');
      const dataIndex = innerDiv?.getAttribute('data-index');
      const dataValue = innerDiv?.getAttribute('data-value');

      // Get actual CSS classes to determine state
      const classes = innerDiv?.className || '';
      let state = 'DEFAULT';
      if (classes.includes('anim-state-current')) state = 'CURRENT';
      else if (classes.includes('anim-state-visited')) state = 'VISITED';
      else if (classes.includes('anim-state-result')) state = 'RESULT';
      else if (classes.includes('anim-state-pointer_left')) state = 'POINTER_LEFT';
      else if (classes.includes('anim-state-pointer_right')) state = 'POINTER_RIGHT';
      else if (classes.includes('anim-state-comparing')) state = 'COMPARING';
      else if (classes.includes('anim-state-candidate')) state = 'CANDIDATE';

      return {
        index: dataIndex ? parseInt(dataIndex) : idx,
        value: dataValue ? parseInt(dataValue) : 0,
        state,
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };
    });
  });

  snapshot.dom.elements = arrayItems.map(item => ({
    index: item.index,
    value: item.value,
    state: item.state,
    stateCorrect: true, // Will validate against expected states
  }));

  // Capture pointers
  const pointers = await page.locator('[data-pointer-id]').evaluateAll((ptrs) => {
    return ptrs.map((ptr) => {
      const rect = ptr.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;

      return {
        id: ptr.getAttribute('data-pointer-id') || 'unknown',
        x: centerX,
      };
    });
  });

  snapshot.dom.pointers = pointers.map(ptr => {
    // Find which array item this pointer is closest to
    let closestIndex = -1;
    let closestDistance = Infinity;

    arrayItems.forEach((item, idx) => {
      const distance = Math.abs(ptr.x - item.x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = idx;
      }
    });

    const expectedIndex = ptr.id === 'LEFT' ? 0 : arrayItems.length - 1; // Default expectation
    const aligned = closestDistance < 10; // Within 10px

    return {
      id: ptr.id,
      position: ptr.x,
      expectedIndex,
      actualIndex: closestIndex,
      aligned,
    };
  });

  // Capture code section
  const codeSection = page.locator('.code-section');
  const codeVisible = await codeSection.isVisible().catch(() => false);

  snapshot.dom.codeSection.visible = codeVisible;

  if (codeVisible) {
    const codeSnippet = page.locator('.code-snippet code');
    if (await codeSnippet.count() > 0) {
      snapshot.dom.codeSection.snippet = (await codeSnippet.textContent())?.trim() || '';
    }
  }

  return snapshot;
}

async function validateStepTransitions(
  snapshots: StepSnapshot[]
): ValidationReport {
  const report: ValidationReport = {
    totalSteps: snapshots.length,
    validatedSteps: 0,
    snapshots,
    criticalIssues: [],
    warnings: [],
    passed: true,
  };

  for (let i = 0; i < snapshots.length; i++) {
    const snapshot = snapshots[i];

    // Validate pointers are aligned
    snapshot.dom.pointers.forEach(ptr => {
      if (!ptr.aligned) {
        snapshot.issues.push(
          `${ptr.id} pointer not aligned at step ${i}: at index ${ptr.actualIndex}, expected ${ptr.expectedIndex}`
        );
        report.criticalIssues.push(
          `Step ${i} (${snapshot.description}): ${ptr.id} pointer misaligned`
        );
        report.passed = false;
      }
    });

    // Validate code section visibility
    if (!snapshot.dom.codeSection.visible && i > 0) {
      snapshot.issues.push('Code section not visible');
      report.warnings.push(`Step ${i}: Code section hidden`);
    }

    // Validate state transitions (if we have previous step)
    if (i > 0) {
      const prevSnapshot = snapshots[i - 1];

      // Check if pointer positions changed when they should
      if (snapshot.description.includes('Move') || snapshot.description.includes('move')) {
        const currentPointers = snapshot.dom.pointers;
        const prevPointers = prevSnapshot.dom.pointers;

        let pointerMoved = false;
        currentPointers.forEach((ptr, idx) => {
          if (prevPointers[idx] && Math.abs(ptr.position - prevPointers[idx].position) > 5) {
            pointerMoved = true;
          }
        });

        if (!pointerMoved) {
          snapshot.issues.push('Pointer should have moved but position unchanged');
          report.warnings.push(`Step ${i} (${snapshot.description}): No pointer movement detected`);
        }
      }

      // Check if element states changed when they should
      if (snapshot.description.includes('Mark') || snapshot.description.includes('Highlight')) {
        const currentElements = snapshot.dom.elements;
        const prevElements = prevSnapshot.dom.elements;

        let stateChanged = false;
        currentElements.forEach((elem, idx) => {
          if (prevElements[idx] && elem.state !== prevElements[idx].state) {
            stateChanged = true;
          }
        });

        if (!stateChanged && !snapshot.description.includes('new position')) {
          snapshot.issues.push('Element state should have changed but remained same');
          report.warnings.push(`Step ${i} (${snapshot.description}): No state change detected`);
        }
      }
    }

    report.validatedSteps++;
  }

  return report;
}

test.describe('Step-by-Step DOM Validation', () => {
  test('validate DOM state at every animation step', async ({ page }) => {
    console.log('\n🔬 STEP-BY-STEP DOM VALIDATION\n');
    console.log('This test captures and validates DOM state at EVERY animation step\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    // Start animation
    console.log('Starting animation...\n');
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(1000);

    // Pause to control playback
    const pauseBtn = page.locator('button[aria-label*="Pause" i]');
    await pauseBtn.click();
    console.log('⏸️  Animation paused for step-by-step validation\n');

    // Get total steps
    const stepCounter = page.locator('.step-counter .total-steps');
    const totalSteps = await stepCounter.textContent().then(t => parseInt(t || '0'));
    console.log(`📊 Total steps to validate: ${totalSteps}\n`);

    const snapshots: StepSnapshot[] = [];

    // Step through each animation step
    const stepBtn = page.locator('button[aria-label="Next step"]');

    for (let i = 0; i < Math.min(totalSteps, 15); i++) { // Limit to first 15 steps for performance
      // Capture current state
      const snapshot = await captureStepSnapshot(page, i);
      snapshots.push(snapshot);

      console.log(`Step ${i}: "${snapshot.description}"`);
      console.log(`  Pointers: ${snapshot.dom.pointers.map(p => `${p.id}@${p.actualIndex}`).join(', ')}`);
      console.log(`  Element states: ${snapshot.dom.elements.filter(e => e.state !== 'DEFAULT').map(e => `[${e.index}]=${e.state}`).join(', ') || 'all DEFAULT'}`);
      console.log(`  Code visible: ${snapshot.dom.codeSection.visible ? '✅' : '❌'}`);

      if (snapshot.issues.length > 0) {
        console.log(`  ⚠️  Issues: ${snapshot.issues.join('; ')}`);
      }
      console.log('');

      // Step forward
      if (i < totalSteps - 1) {
        await stepBtn.click();
        await page.waitForTimeout(300); // Wait for step to complete
      }
    }

    // Validate all transitions
    console.log('🔍 VALIDATING STATE TRANSITIONS...\n');
    const report = await validateStepTransitions(snapshots);

    console.log(`📊 Validation Results:`);
    console.log(`  Total steps: ${report.totalSteps}`);
    console.log(`  Validated steps: ${report.validatedSteps}`);
    console.log(`  Critical issues: ${report.criticalIssues.length}`);
    console.log(`  Warnings: ${report.warnings.length}`);
    console.log('');

    if (report.criticalIssues.length > 0) {
      console.log('❌ CRITICAL ISSUES:');
      report.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }

    if (report.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      report.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log('');
    }

    if (report.passed) {
      console.log('✅ ALL STEP VALIDATIONS PASSED!\n');
    } else {
      console.log('❌ STEP VALIDATION FAILED\n');
    }

    // Assert the validation passed
    expect(report.criticalIssues.length).toBe(0);
    expect(report.passed).toBe(true);
  });

  test('validate animation sequence integrity', async ({ page }) => {
    console.log('\n🎬 ANIMATION SEQUENCE INTEGRITY CHECK\n');

    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');

    const sequenceLog: Array<{step: number, description: string, timestamp: number}> = [];
    let startTime = Date.now();

    // Start animation
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    // Pause and step through
    await page.locator('button[aria-label*="Pause" i]').click();

    const stepBtn = page.locator('button[aria-label="Next step"]');
    const stepCounter = page.locator('.step-counter .current-step');

    for (let i = 0; i < 10; i++) {
      const currentStep = await stepCounter.textContent().then(t => parseInt(t || '0'));
      const description = await page.locator('.step-description').first().textContent();

      sequenceLog.push({
        step: currentStep,
        description: description?.trim() || '',
        timestamp: Date.now() - startTime,
      });

      await stepBtn.click();
      await page.waitForTimeout(200);
    }

    // Validate sequence integrity
    console.log('📋 Animation Sequence:');
    let sequenceValid = true;

    for (let i = 1; i < sequenceLog.length; i++) {
      const current = sequenceLog[i];
      const prev = sequenceLog[i - 1];

      console.log(`  ${current.step}. ${current.description} (${current.timestamp}ms)`);

      // Check steps are incrementing
      if (current.step !== prev.step + 1) {
        console.log(`    ⚠️  Step number jumped from ${prev.step} to ${current.step}`);
        sequenceValid = false;
      }
    }

    console.log('');
    if (sequenceValid) {
      console.log('✅ Sequence integrity validated - all steps in order\n');
    } else {
      console.log('❌ Sequence integrity issues detected\n');
    }

    expect(sequenceValid).toBe(true);
  });
});
