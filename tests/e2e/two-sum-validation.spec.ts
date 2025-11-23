import { test, expect, Page } from '@playwright/test';

/**
 * Animation Validation Tests for Two Sum
 *
 * This test suite automatically validates:
 * - Pointer positioning accuracy
 * - Element state correctness
 * - Code executor visibility
 * - Animation step execution
 */

interface PointerInfo {
  id: string;
  expectedIndex: number;
  expectedPercent: number;
  actualPercent: number | null;
  deviation: number;
  visible: boolean;
}

interface ValidationReport {
  testName: string;
  timestamp: string;
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    expected?: any;
    actual?: any;
    deviation?: number;
  }>;
  summary: {
    totalIssues: number;
    errors: number;
    warnings: number;
  };
}

/**
 * Calculate expected pointer position percentage
 */
function calculateExpectedPosition(index: number, arrayLength: number): number {
  if (arrayLength <= 1) return 50;
  return (index / (arrayLength - 1)) * 100;
}

/**
 * Extract position percentage from style attribute
 */
function extractLeftPercent(style: string | null): number | null {
  if (!style) return null;
  const match = style.match(/left:\s*(\d+\.?\d*)%/);
  return match ? parseFloat(match[1]) : null;
}

test.describe('Two Sum Visualization Validation', () => {
  let validationReport: ValidationReport;

  test.beforeEach(async ({ page }) => {
    validationReport = {
      testName: 'Two Sum Animation Validation',
      timestamp: new Date().toISOString(),
      issues: [],
      summary: { totalIssues: 0, errors: 0, warnings: 0 },
    };

    // Navigate to Two Sum page
    await page.goto('/problems/two-sum');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({}, testInfo) => {
    // Calculate summary
    validationReport.summary.totalIssues = validationReport.issues.length;
    validationReport.summary.errors = validationReport.issues.filter(i => i.severity === 'error').length;
    validationReport.summary.warnings = validationReport.issues.filter(i => i.severity === 'warning').length;

    // Print detailed report
    console.log('\n' + '='.repeat(80));
    console.log('🤖 AUTOMATED VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`Test: ${validationReport.testName}`);
    console.log(`Time: ${validationReport.timestamp}`);
    console.log(`Status: ${testInfo.status}`);
    console.log('='.repeat(80));

    if (validationReport.issues.length === 0) {
      console.log('✅ No issues found! Animation is working correctly.');
    } else {
      console.log(`\n📊 Summary: ${validationReport.summary.totalIssues} issues found`);
      console.log(`   ❌ Errors: ${validationReport.summary.errors}`);
      console.log(`   ⚠️  Warnings: ${validationReport.summary.warnings}`);
      console.log('\n📋 Detailed Issues:\n');

      validationReport.issues.forEach((issue, index) => {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${index + 1}. ${icon} [${issue.category}] ${issue.message}`);
        if (issue.expected !== undefined) {
          console.log(`   Expected: ${JSON.stringify(issue.expected)}`);
        }
        if (issue.actual !== undefined) {
          console.log(`   Actual: ${JSON.stringify(issue.actual)}`);
        }
        if (issue.deviation !== undefined) {
          console.log(`   Deviation: ${issue.deviation.toFixed(2)}%`);
        }
        console.log('');
      });
    }
    console.log('='.repeat(80) + '\n');
  });

  test('validate pointer positions at initialization', async ({ page }) => {
    const arrayLength = 4; // Default: [2, 7, 11, 15]

    // Click visualize button
    const visualizeBtn = page.locator('button:has-text("Visualize")');
    await visualizeBtn.click();

    // Wait for animation to start
    await page.waitForTimeout(1000);

    // Check LEFT pointer
    const leftPointer = page.locator('[data-pointer-id="LEFT"]').first();
    const leftExists = await leftPointer.count() > 0;

    if (!leftExists) {
      validationReport.issues.push({
        severity: 'error',
        category: 'Pointer Visibility',
        message: 'LEFT pointer not found in DOM',
      });
    } else {
      const leftStyle = await leftPointer.getAttribute('style');
      const actualLeft = extractLeftPercent(leftStyle);
      const expectedLeft = calculateExpectedPosition(0, arrayLength);

      if (actualLeft === null) {
        validationReport.issues.push({
          severity: 'error',
          category: 'Pointer Position',
          message: 'LEFT pointer has no position style',
        });
      } else {
        const deviation = Math.abs(actualLeft - expectedLeft);

        if (deviation > 5) {
          validationReport.issues.push({
            severity: 'error',
            category: 'Pointer Position',
            message: 'LEFT pointer position is incorrect',
            expected: `${expectedLeft.toFixed(2)}% (index 0)`,
            actual: `${actualLeft.toFixed(2)}%`,
            deviation: deviation,
          });
        } else if (deviation > 1) {
          validationReport.issues.push({
            severity: 'warning',
            category: 'Pointer Position',
            message: 'LEFT pointer position has minor deviation',
            expected: `${expectedLeft.toFixed(2)}%`,
            actual: `${actualLeft.toFixed(2)}%`,
            deviation: deviation,
          });
        }
      }

      // Check label
      const leftLabel = await leftPointer.textContent();
      if (!leftLabel?.includes('L')) {
        validationReport.issues.push({
          severity: 'warning',
          category: 'Pointer Label',
          message: 'LEFT pointer label is missing or incorrect',
          expected: 'L',
          actual: leftLabel,
        });
      }
    }

    // Check RIGHT pointer
    const rightPointer = page.locator('[data-pointer-id="RIGHT"]').first();
    const rightExists = await rightPointer.count() > 0;

    if (!rightExists) {
      validationReport.issues.push({
        severity: 'error',
        category: 'Pointer Visibility',
        message: 'RIGHT pointer not found in DOM',
      });
    } else {
      const rightStyle = await rightPointer.getAttribute('style');
      const actualRight = extractLeftPercent(rightStyle);
      const expectedRight = calculateExpectedPosition(3, arrayLength);

      if (actualRight === null) {
        validationReport.issues.push({
          severity: 'error',
          category: 'Pointer Position',
          message: 'RIGHT pointer has no position style',
        });
      } else {
        const deviation = Math.abs(actualRight - expectedRight);

        if (deviation > 5) {
          validationReport.issues.push({
            severity: 'error',
            category: 'Pointer Position',
            message: 'RIGHT pointer position is incorrect',
            expected: `${expectedRight.toFixed(2)}% (index 3)`,
            actual: `${actualRight.toFixed(2)}%`,
            deviation: deviation,
          });
        } else if (deviation > 1) {
          validationReport.issues.push({
            severity: 'warning',
            category: 'Pointer Position',
            message: 'RIGHT pointer position has minor deviation',
            expected: `${expectedRight.toFixed(2)}%`,
            actual: `${actualRight.toFixed(2)}%`,
            deviation: deviation,
          });
        }
      }

      // Check label
      const rightLabel = await rightPointer.textContent();
      if (!rightLabel?.includes('R')) {
        validationReport.issues.push({
          severity: 'warning',
          category: 'Pointer Label',
          message: 'RIGHT pointer label is missing or incorrect',
          expected: 'R',
          actual: rightLabel,
        });
      }
    }
  });

  test('validate code executor visibility', async ({ page }) => {
    // Click visualize
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    // Check if code display section exists
    const codeSection = page.locator('.code-display, [class*="code"]').first();
    const codeSectionExists = await codeSection.count() > 0;

    if (!codeSectionExists) {
      validationReport.issues.push({
        severity: 'warning',
        category: 'Code Executor',
        message: 'Code display section not found',
      });
    } else {
      // Check if it's visible
      const isVisible = await codeSection.isVisible();

      if (!isVisible) {
        validationReport.issues.push({
          severity: 'error',
          category: 'Code Executor',
          message: 'Code display section exists but is not visible',
        });
      }

      // Check if it has content
      const content = await codeSection.textContent();
      if (!content || content.trim().length === 0) {
        validationReport.issues.push({
          severity: 'warning',
          category: 'Code Executor',
          message: 'Code display section is empty',
        });
      }
    }
  });

  test('validate array visualization', async ({ page }) => {
    const arrayLength = 4;

    // Click visualize
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    // Check array items
    const arrayItems = page.locator('app-array-item, [class*="array-item"]');
    const itemCount = await arrayItems.count();

    if (itemCount !== arrayLength) {
      validationReport.issues.push({
        severity: 'error',
        category: 'Array Visualization',
        message: 'Incorrect number of array items rendered',
        expected: arrayLength,
        actual: itemCount,
      });
    }

    // Check if array items are visible
    for (let i = 0; i < Math.min(itemCount, arrayLength); i++) {
      const item = arrayItems.nth(i);
      const isVisible = await item.isVisible();

      if (!isVisible) {
        validationReport.issues.push({
          severity: 'error',
          category: 'Array Visualization',
          message: `Array item at index ${i} is not visible`,
        });
      }
    }
  });

  test('validate playback controls', async ({ page }) => {
    // Click visualize
    await page.locator('button:has-text("Visualize")').click();
    await page.waitForTimeout(500);

    // Check for playback controls
    const controls = [
      { name: 'Play button', selector: 'button:has-text("Play"), button[title*="Play"]' },
      { name: 'Pause button', selector: 'button:has-text("Pause"), button[title*="Pause"]' },
      { name: 'Step forward', selector: 'button:has-text("Step"), button[title*="Step"]' },
      { name: 'Reset button', selector: 'button:has-text("Reset"), button[title*="Reset"]' },
    ];

    for (const control of controls) {
      const exists = await page.locator(control.selector).first().count() > 0;
      if (!exists) {
        validationReport.issues.push({
          severity: 'warning',
          category: 'Playback Controls',
          message: `${control.name} not found`,
        });
      }
    }
  });
});
