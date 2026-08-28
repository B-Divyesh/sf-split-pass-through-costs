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

async function downloadedText(page: import('@playwright/test').Page, trigger: () => Promise<void>): Promise<string> {
  const downloadPromise = page.waitForEvent('download');
  await trigger();
  const download = await downloadPromise;
  return readFile(await download.path()!, 'utf8');
}

const csvRows = (text: string) => text.trim().split(/\r?\n/).map((line) => line.split(','));

test('@claim:demo-isolation opens a seeded isolated demo and reset restores it', async ({ page }) => {
  await page.goto('/?new=1');
  await page.locator('#supplier').fill('REAL PRIVATE SUPPLIER');
  await page.locator('#bill-total').fill('10.00');
  await page.locator('.row-amount-input').first().fill('10.00');
  await page.locator('#save-slip').click();
  await expect(page.locator('#save-state')).toContainText('Saved');
  await expectBalancedDemo(page);
  await expect(page.locator('#saved-count')).toHaveText('1');
  await expect(page.locator('#save-state')).toContainText('Sample record');
  await page.locator('#supplier').fill('Changed demo supplier');
  await page.locator('#reset-demo').click();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  await page.goto('/');
  await expect(page.locator('#supplier')).toHaveValue('REAL PRIVATE SUPPLIER');
});

test('@claim:split-export exports every seeded row with reference, category, amount, currency, and treatment', async ({ page }) => {
  await expectBalancedDemo(page);
  const rows = csvRows(await downloadedText(page, async () => { await page.locator('#export-csv').click(); }));
  expect(rows[0]).toEqual(['Supplier', 'Bill reference', 'Bill date', 'Client', 'Description', 'User-selected category', 'Treatment', 'Amount', 'Currency']);
  expect(rows.slice(1)).toEqual([
    ['Sunrise Building Supply', 'SBS-48192', '2026-08-21', 'Juniper Kitchen Remodel', 'Cabinet plywood', 'Materials', 'Billable', '864.00', 'USD'],
    ['Sunrise Building Supply', 'SBS-48192', '2026-08-21', 'Juniper Kitchen Remodel', 'Delivery to workshop', 'Delivery', 'Overhead', '128.50', 'USD'],
    ['Sunrise Building Supply', 'SBS-48192', '2026-08-21', 'Juniper Kitchen Remodel', 'Fasteners for install', 'Materials', 'Billable', '295.00', 'USD'],
  ]);
});

test('@claim:attachment-boundary keeps image and PDF attachments through reload and rejects one byte over 10 MB', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'receipt.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) });
  await expect(page.locator('#attachment-name')).toContainText('receipt.png');
  await page.reload();
  await expect(page.locator('#attachment-name')).toContainText('receipt.png');
  await page.locator('#attachment').setInputFiles({ name: 'sunrise.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10_000_000, 1) });
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
  await page.reload();
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
  await page.locator('#attachment').setInputFiles({ name: 'too-big.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10_000_001, 1) });
  await expect(page.locator('#toast')).toContainText('over 10 MB');
  await expect(page.locator('#attachment-name')).toContainText('sunrise.pdf');
});

test('@claim:local-privacy sends no cross-origin requests for the complete demo flow', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url()); });
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) });
  await page.locator('#save-slip').click();
  await downloadedText(page, async () => { await page.locator('#export-csv').click(); });
  await page.locator('#copy-client').click();
  await page.evaluate(() => { window.print = () => undefined; });
  await page.locator('#print-client').click();
  await page.locator('#saved-toggle').click();
  const backup = await downloadedText(page, async () => { await page.locator('#backup-export').click(); });
  await page.locator('#backup-import').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(backup) });
  await expect(page.locator('#toast')).toContainText('slips imported');
  await page.locator('#reset-demo').click();
  await page.locator('#leave-demo').click();
  await expect(page).toHaveURL(/\/?new=1$/);
  expect(outside).toEqual([]);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await expectBalancedDemo(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true })); });
  await page.waitForTimeout(750);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toContainText('Sunrise Building Supply');
  await expect(page.locator('#connection-text')).toContainText('Offline');
});

test('@claim:free-core saves, reloads, exports, and copies without a license or paywall', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await expectBalancedDemo(page);
  await page.locator('#save-slip').click();
  await expect(page.locator('#save-state')).toContainText('Saved');
  await page.reload();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  const csv = await downloadedText(page, async () => { await page.locator('#export-csv').click(); });
  expect(csv).toContain('SBS-48192');
  await page.locator('#copy-client').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('CLIENT REIMBURSEMENT TOTAL');
  await expect(page.locator('text=Buy Pro')).toHaveCount(0);
});

test('@claim:client-output copies and prints billable rows only', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await expectBalancedDemo(page);
  await page.locator('#copy-client').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('CLIENT REIMBURSEMENT TOTAL');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Cabinet plywood');
  expect(copied).toContain('Fasteners for install');
  expect(copied).not.toContain('Delivery to workshop');
  await page.evaluate(() => { window.print = () => undefined; });
  await page.locator('#print-client').click();
  await expect(page.locator('.client-print-sheet')).toContainText('Cabinet plywood');
  await expect(page.locator('.client-print-sheet')).not.toContainText('Delivery to workshop');
});

test('@claim:backup-omits-attachments exports slip details without attachment bytes', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'supplier-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('ATTACHMENT-BYTES-MUST-NOT-EXPORT') });
  await page.locator('#saved-toggle').click();
  const backup = await downloadedText(page, async () => { await page.locator('#backup-export').click(); });
  const payload = JSON.parse(backup) as { slips: Array<{ attachment?: { name?: string } }> };
  expect(payload.slips[0].attachment?.name).toBe('supplier-bill.pdf');
  expect(backup).not.toContain('ATTACHMENT-BYTES-MUST-NOT-EXPORT');
  expect(backup).not.toContain('base64');
});

test('@claim:slip-persistence saves an edited slip and its attachment across reload', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#supplier').fill('Sunrise Building Supply — edited');
  await page.locator('#attachment').setInputFiles({ name: 'supplier-bill.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) });
  await page.locator('#save-slip').click();
  await page.reload();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply — edited');
  await expect(page.locator('#attachment-name')).toContainText('supplier-bill.png');
});

test('@claim:cent-balance shows exact balanced, under, and over states', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('.row-amount-input').first().fill('863.99');
  await expect(page.locator('#balance-label')).toHaveText('Still to allocate');
  await expect(page.locator('#remaining-total')).toHaveText('$0.01');
  await page.locator('.row-amount-input').first().fill('864.01');
  await expect(page.locator('#balance-label')).toHaveText('Over-allocated');
  await expect(page.locator('#remaining-total')).toHaveText('$0.01');
  await page.locator('.row-amount-input').first().fill('864.00');
  await expect(page.locator('#balance-label')).toHaveText('Balanced exactly');
});

test('@claim:installable-app ships a complete manifest and service worker', async ({ page }) => {
  const manifest = await (await page.request.get('/manifest.webmanifest')).json() as { display: string; start_url: string; icons: Array<{ src: string; sizes: string }> };
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toContain('?v=');
  expect(manifest.icons.some((icon) => icon.sizes === '192x192')).toBeTruthy();
  expect(manifest.icons.some((icon) => icon.sizes === '512x512')).toBeTruthy();
  for (const icon of manifest.icons) expect((await page.request.get(icon.src)).ok()).toBeTruthy();
  await expectBalancedDemo(page);
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBeTruthy();
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

test('uses route-specific metadata and one shared chrome', async ({ page }) => {
  for (const [route, title] of [['/privacy/', 'Privacy — Split Cost Slip'], ['/terms/', 'Terms — Split Cost Slip'], ['/does-not-exist', 'Page not found — Split Cost Slip']] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"][sizes="180x180"]')).toHaveCount(1);
    await expect(page.locator('header nav a')).toHaveCount(3);
    await expect(page.locator('footer nav a')).toHaveCount(4);
  }
});
