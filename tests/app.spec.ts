import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('splits a mixed bill, persists it, and exports CSV', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Split Cost Slip/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);

  await page.locator('#supplier').fill('Northside Supply');
  await page.locator('#reference').fill('INV-2048');
  await page.locator('#client').fill('Harbor remodel');
  await page.locator('#bill-total').fill('125.50');

  const rows = page.locator('.allocation-row');
  await rows.nth(0).locator('.row-description').fill('Timber delivery');
  await rows.nth(0).locator('.row-category').fill('Materials');
  await rows.nth(0).locator('.row-amount-input').fill('100.25');
  await rows.nth(1).locator('.row-description').fill('Shop supplies');
  await rows.nth(1).locator('.row-category').fill('Overhead supplies');
  await rows.nth(1).locator('.row-amount-input').fill('25.25');
  await page.locator('#attachment').setInputFiles({ name: 'supplier-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
  await expect(page.locator('#attachment-name')).toContainText('supplier-bill.pdf');

  await expect(page.locator('#balance-label')).toHaveText('Balanced exactly');
  await expect(page.locator('#billable-total')).toContainText('100.25');
  await expect(page.locator('#overhead-total')).toContainText('25.25');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-csv').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('northside-supply-INV-2048-split.csv');

  await page.locator('#save-slip').click();
  await expect(page.locator('#save-state')).toHaveText('Saved locally');
  await page.reload();
  await expect(page.locator('#supplier')).toHaveValue('Northside Supply');
  await expect(page.locator('#attachment-name')).toContainText('supplier-bill.pdf');
  await expect(page.locator('#balance-label')).toHaveText('Balanced exactly');
});

test('has no serious accessibility violations in the working screen', async ({ page }) => {
  await page.goto('/');
  // Axe's package currently declares a newer Playwright Page shape; the runtime API used here is stable.
  const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('supports keyboard row creation and the Pro restore dialog', async ({ page }) => {
  await page.goto('/');
  await page.locator('#add-row').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.allocation-row')).toHaveCount(3);
  await expect(page.locator('.allocation-row').last().locator('.row-description')).toBeFocused();

  await page.locator('#pro-open').click();
  await expect(page.locator('#pro-dialog')).toBeVisible();
  await expect(page.locator('#pro-dialog-title')).toContainText('$19 once');
  await page.locator('.dialog-close').click();
  await expect(page.locator('#pro-dialog')).toBeHidden();
});

test('serves the app shell offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toContainText('One bill in');
  await expect(page.locator('#connection-text')).toContainText('Offline');
});

test('legal pages are real standalone routes', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.locator('h1')).toHaveText('Your bills stay yours.');
  await page.goto('/terms/');
  await expect(page.locator('h1')).toContainText('not an accountant');
});

test('stores, strips, and verifies a returned Pro license', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/split-pass-through-costs/verify?license=TEST-LICENSE', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null }),
  }));
  await page.goto('/?license=TEST-LICENSE');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#pro-open')).toHaveText('Pro unlocked');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:split-pass-through-costs'))).toBe('TEST-LICENSE');
});
