import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

async function expectBalancedDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Split Cost Slip');
  await expect(page.locator('.demo-banner')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  await expect(page.locator('#balance-label')).toHaveText('Balanced exactly');
}

test('@claim:demo-isolation opens a seeded isolated demo and reset restores it', async ({ page }) => {
  await page.goto('/?new=1');
  await page.locator('#supplier').fill('REAL PRIVATE SUPPLIER');
  await page.locator('#bill-total').fill('10.00');
  await page.locator('.row-amount-input').first().fill('10.00');
  await page.locator('#save-slip').click();
  await expect(page.locator('#save-state')).toContainText('Saved');
  await expectBalancedDemo(page);
  await expect(page.locator('#saved-count')).toHaveText('1');
  await page.locator('#supplier').fill('Changed demo supplier');
  await page.locator('#reset-demo').click();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  await page.goto('/');
  await expect(page.locator('#supplier')).toHaveValue('REAL PRIVATE SUPPLIER');
});

test('@claim:split-export exports each sample row with the chosen type', async ({ page }) => {
  await expectBalancedDemo(page);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-csv').click();
  const download = await downloadPromise;
  const content = await readFile(await download.path()!, 'utf8');
  expect(content).toContain('Sunrise Building Supply');
  expect(content).toContain('Cabinet plywood');
  expect(content).toContain('Billable');
  expect(content).toContain('Overhead');
  expect(content.trim().split('\n')).toHaveLength(4);
});

test('@claim:attachment-boundary keeps an allowed attachment and rejects one over 10 MB', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'sunrise.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10_000_000, 1) });
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
  await page.reload();
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
  await page.locator('#attachment').setInputFiles({ name: 'too-big.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10_000_001, 1) });
  await expect(page.locator('#toast')).toContainText('over 10 MB');
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
});

test('@claim:local-privacy sends no cross-origin requests in the complete demo flow', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url()); });
  await expectBalancedDemo(page);
  await page.locator('#save-slip').click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-csv').click();
  await downloadPromise;
  expect(outside).toEqual([]);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await expectBalancedDemo(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })); });
  await page.waitForTimeout(750);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toContainText('Split one bill');
  await expect(page.locator('#connection-text')).toContainText('Offline');
});

test('@claim:free-core keeps sample saving and exports available without a license', async ({ page }) => {
  await expectBalancedDemo(page);
  await expect(page.locator('#save-slip')).toBeEnabled();
  await expect(page.locator('#export-csv')).toBeEnabled();
  await expect(page.locator('#copy-client')).toBeEnabled();
  await expect(page.locator('text=Buy Pro')).toHaveCount(0);
});

test('blocks stale invalid money from balance, saving, and export', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('.row-amount-input').first().fill('10.999');
  await expect(page.locator('#balance-label')).toHaveText('Fix invalid amount');
  await page.locator('#export-csv').click();
  await expect(page.locator('#toast')).toContainText('Fix the highlighted amount');
  await page.locator('#save-slip').click();
  await expect(page.locator('#save-state')).toContainText('Fix invalid amount');
});

test('rejects malformed imports atomically and remains usable after reload', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#saved-toggle').click();
  await page.locator('#backup-import').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"format":"split-cost-slip","version":1,"slips":[{"id":"poison"}]}') });
  await expect(page.locator('#toast')).toContainText('missing or invalid');
  await page.reload();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
});

test('has no serious accessibility violations on app, demo, privacy, terms, and 404 routes', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')), route).toEqual([]);
  }
});

test('uses route-specific headings and legal chrome', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page).toHaveTitle('Privacy — Split Cost Slip');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('a[href="/demo"]')).toHaveCount(2);
  await page.goto('/terms/');
  await expect(page).toHaveTitle('Terms — Split Cost Slip');
  await page.goto('/does-not-exist');
  await expect(page).toHaveTitle('Page not found — Split Cost Slip');
  await expect(page.locator('h1')).toContainText('This slip is not here');
});
