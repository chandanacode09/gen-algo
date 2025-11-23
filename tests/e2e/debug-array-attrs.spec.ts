import { test } from '@playwright/test';

test('debug array item attributes', async ({ page }) => {
  await page.goto('/problems/two-sum');
  await page.waitForLoadState('networkidle');

  // Click visualize
  await page.locator('button:has-text("Visualize")').click();
  await page.waitForTimeout(2000);

  // Get first array item and inspect its HTML
  const firstItem = page.locator('app-array-item').first();

  console.log('\n🔍 Inspecting first array item...\n');

  // Get outer HTML
  const outerHTML = await firstItem.evaluate(el => el.outerHTML);
  console.log('Outer HTML:');
  console.log(outerHTML);
  console.log('\n');

  // Get inner div
  const innerDiv = firstItem.locator('.array-item').first();
  const innerHTML = await innerDiv.evaluate(el => el.outerHTML);
  console.log('Inner div HTML:');
  console.log(innerHTML);
  console.log('\n');

  // Try to get attributes different ways
  console.log('Attribute checks:');
  console.log('data-index via getAttribute:', await innerDiv.getAttribute('data-index'));
  console.log('data-value via getAttribute:', await innerDiv.getAttribute('data-value'));

  const attrs = await innerDiv.evaluate(el => {
    return {
      dataIndex: el.getAttribute('data-index'),
      dataValue: el.getAttribute('data-value'),
      hasDataIndex: el.hasAttribute('data-index'),
      hasDataValue: el.hasAttribute('data-value'),
      allAttrs: Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`),
    };
  });

  console.log('Detailed attribute info:', JSON.stringify(attrs, null, 2));
});
