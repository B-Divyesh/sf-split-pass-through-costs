import { expect, test } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
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
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  await expect(page.locator('#saved-count')).toHaveText('1');
  await expect(page.locator('#save-state')).toContainText('Sample record');
  await page.locator('#supplier').fill('Changed demo supplier');
  await page.locator('#reset-demo').click();
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
  await page.locator('#leave-demo').click();
  await expect(page).toHaveURL(/\/?new=1$/);
  await expect(page.locator('#supplier')).toHaveValue('');
  await page.goto('/');
  await expect(page.locator('#supplier')).toHaveValue('REAL PRIVATE SUPPLIER');
  await page.goto('/?demo=1');
  await expect(page.locator('.demo-banner')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.locator('#supplier')).toHaveValue('Sunrise Building Supply');
});

test('@claim:split-export exports every seeded row with reference, category, amount, currency, and treatment', async ({ page }) => {
  await expectBalancedDemo(page);
  const rows = csvRows(await downloadedText(page, async () => { await page.locator('#export-csv').click(); }));
  expect(rows[0]).toEqual(['Supplier', 'Supplier bill reference', 'Bill date', 'Client', 'Description', 'User-selected category', 'Treatment', 'Amount', 'Currency']);
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

test('@claim:local-privacy sends no requests to other websites for the complete demo flow', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url()); });
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) });
  await page.locator('#open-extraction').click();
  await page.locator('#run-extraction').click();
  await expect(page.locator('#extract-results')).toBeVisible();
  await page.locator('#discard-extraction').click();
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
  await page.locator('#supplier').fill('Offline supplier edit');
  await expect(page.locator('#supplier')).toHaveValue('Offline supplier edit');
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

test('@claim:backup-omits-attachments exports saved slip details without attachment bytes', async ({ page }) => {
  await expectBalancedDemo(page);
  await page.locator('#attachment').setInputFiles({ name: 'supplier-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('ATTACHMENT-BYTES-MUST-NOT-EXPORT') });
  await page.locator('#saved-toggle').click();
  const backup = await downloadedText(page, async () => { await page.locator('#backup-export').click(); });
  const payload = JSON.parse(backup) as { slips: Array<{ attachment?: { name?: string } }> };
  expect(backup).toContain('Sunrise Building Supply');
  expect(backup).toContain('SBS-48192');
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

test('@claim:installable-app can be installed in supported Chromium browsers', async ({ page, context }) => {
  const manifest = await (await page.request.get('/manifest.webmanifest')).json() as { display: string; start_url: string; icons: Array<{ src: string; sizes: string }> };
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toContain('?v=');
  expect(manifest.icons.some((icon) => icon.sizes === '192x192')).toBeTruthy();
  expect(manifest.icons.some((icon) => icon.sizes === '512x512')).toBeTruthy();
  for (const icon of manifest.icons) expect((await page.request.get(icon.src)).ok()).toBeTruthy();
  await expectBalancedDemo(page);
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBeTruthy();
  const session = await context.newCDPSession(page);
  const result = await session.send('Page.getInstallabilityErrors');
  expect(result.installabilityErrors).toEqual([]);
});

test('@claim:manual-data-privacy keeps manual bill data in the browser', async ({ page }) => {
  const outside: string[] = [];
  const dataBearing: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url()); });
  page.on('request', (request) => { const details = `${request.url()} ${request.postData() || ''}`; if (details.includes('Private Supply Co') || details.includes('PRIVATE-17')) dataBearing.push(details); });
  await page.goto('/?new=1');
  await page.locator('#attachment').setInputFiles({ name: 'private-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF private bill') });
  await page.locator('#supplier').fill('Private Supply Co');
  await page.locator('#reference').fill('PRIVATE-17');
  await page.locator('#bill-total').fill('20.00');
  await page.locator('.row-amount-input').first().fill('20.00');
  await page.locator('#save-slip').click();
  await downloadedText(page, async () => { await page.locator('#export-csv').click(); });
  await page.goto('/');
  await expect(page.locator('#supplier')).toHaveValue('Private Supply Co');
  expect(outside).toEqual([]);
  expect(dataBearing).toEqual([]);
});

test('@claim:delete-slip-data deletes the saved slip and its attachment', async ({ page }) => {
  await page.goto('/?new=1');
  await page.locator('#supplier').fill('Delete Me Supply');
  await page.locator('#bill-total').fill('12.00');
  await page.locator('.row-amount-input').first().fill('12.00');
  await page.locator('#attachment').setInputFiles({ name: 'delete-me.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF delete me') });
  await page.locator('#save-slip').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#delete-slip').click();
  await expect(page.locator('#toast')).toContainText('Slip and attachment deleted');
  const counts = await page.evaluate(async () => {
    const request = indexedDB.open('split-cost-slip');
    const db = await new Promise<IDBDatabase>((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const count = (store: string) => new Promise<number>((resolve, reject) => { const item = db.transaction(store).objectStore(store).count(); item.onsuccess = () => resolve(item.result); item.onerror = () => reject(item.error); });
    const result = { slips: await count('slips'), attachments: await count('attachments') };
    db.close();
    return result;
  });
  expect(counts).toEqual({ slips: 0, attachments: 0 });
  await page.reload();
  await expect(page.locator('#supplier')).toHaveValue('');
});

test('@claim:bill-extraction returns editable details without choosing treatment', async ({ page }) => {
  const fixture = await readFile('tests/fixtures/sociobot-extraction.json', 'utf8');
  let requestBody: Record<string, unknown> | undefined;
  let gatewayRequests = 0;
  await page.route('https://api.sociobot.in/v1/models', async (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ data: [{ id: 'gpt-5.6-sol' }] }) }));
  await page.route('https://api.sociobot.in/v1/responses', async (route) => {
    gatewayRequests += 1;
    requestBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: `data: ${JSON.stringify({ type: 'response.output_text.delta', delta: fixture })}\n\ndata: [DONE]\n\n` });
  });
  await page.goto('/?new=1');
  await page.locator('#attachment').setInputFiles({ name: 'acme.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF acme') });
  await page.locator('#open-extraction').click();
  await expect(page.locator('#extract-filename')).toContainText('acme.pdf');
  await page.locator('#run-extraction').click();
  await expect(page.locator('#extract-status')).toContainText('Enter your Sociobot key');
  expect(gatewayRequests).toBe(0);
  await page.locator('#sociobot-key').fill('sbk_test_fixture_only');
  expect(await page.evaluate(() => localStorage.getItem('split-cost-slip:sociobot-key'))).toBeNull();
  await page.locator('#run-extraction').click();
  await expect(page.locator('#extract-results')).toBeVisible();
  expect(requestBody?.model).toBe('gpt-5.6-sol');
  expect(requestBody?.stream).toBe(true);
  expect(JSON.stringify(requestBody)).toContain('data:application/pdf;base64');
  expect(await page.evaluate(() => localStorage.getItem('split-cost-slip:sociobot-key'))).toBe('sbk_test_fixture_only');
  expect(await page.locator('.suggested-treatment').evaluateAll((items) => items.map((item) => (item as HTMLSelectElement).value))).toEqual(['', '']);
  await page.locator('#suggested-supplier').fill('Acme Timber Yard — checked');
  await page.locator('#apply-extraction').click();
  await expect(page.locator('#extract-status')).toContainText('Choose billable or overhead');
  await page.locator('.suggested-treatment').nth(0).selectOption('billable');
  await page.locator('.suggested-treatment').nth(1).selectOption('overhead');
  await page.locator('#apply-extraction').click();
  await expect(page.locator('#supplier')).toHaveValue('Acme Timber Yard — checked');
  await expect(page.locator('#reference')).toHaveValue('INV-2048');
  await expect(page.locator('#bill-total')).toHaveValue('100.00');
  expect(await page.locator('.row-description').evaluateAll((items) => items.map((item) => (item as HTMLInputElement).value))).toEqual(['Oak boards', 'Delivery']);
  await expect(page.locator('.row-billable').nth(0)).toBeChecked();
  await expect(page.locator('.row-billable').nth(1)).not.toBeChecked();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.locator('#supplier')).toHaveValue('');
  await page.locator('#open-extraction').click();
  await page.locator('#remove-sociobot-key').click();
  expect(await page.evaluate(() => localStorage.getItem('split-cost-slip:sociobot-key'))).toBeNull();
  expect(await readFile('src/extract.ts', 'utf8')).not.toMatch(/sbk_[A-Za-z0-9]{20,}/);
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
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/offline.html', '/does-not-exist']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')), route).toEqual([]);
  }
  await page.goto('/demo');
  await page.locator('#open-extraction').click();
  await page.locator('#run-extraction').click();
  await expect(page.locator('#extract-results')).toBeVisible();
  const dialogResults = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(dialogResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')), 'extraction dialog').toEqual([]);
});

test('uses route-specific metadata and one shared chrome', async ({ page }) => {
  for (const [route, title] of [['/', 'Split Cost Slip — split billable and overhead costs'], ['/demo', 'Demo — Split Cost Slip'], ['/privacy/', 'Privacy — Split Cost Slip'], ['/terms/', 'Terms — Split Cost Slip'], ['/offline.html', 'Offline — Split Cost Slip'], ['/404.html', 'Page not found — Split Cost Slip'], ['/does-not-exist', 'Page not found — Split Cost Slip']] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/apple-touch-icon.png');
    await expect(page.locator('header nav a')).toHaveCount(3);
    await expect(page.locator('footer nav a')).toHaveCount(4);
    await expect(page.locator('footer nav a').last()).toContainText('(external)');
  }
});

test('focuses each route heading through unknown-route back and forward navigation', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.locator('.eyebrow')).toHaveText('Page not found');
  await expect(page.locator('h1')).toHaveText('We cannot find this page.');
  await expect(page.locator('main > p').nth(1)).toHaveText('Check the address, return home, or open the sample.');
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the demo' })).toBeVisible();
  await expect(page.locator('h1')).toBeFocused();
  await page.goto('/');
  await expect(page.locator('h1')).toBeFocused();
  await page.goto('/review-3-not-found');
  await expect(page.locator('.eyebrow')).toHaveText('Page not found');
  await expect(page.locator('h1')).toHaveText('We cannot find this page.');
  await expect(page.locator('main > p').nth(1)).toHaveText('Check the address, return home, or open the sample.');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('h1')).toBeFocused();
  await page.goForward();
  await expect(page.locator('h1')).toHaveText('We cannot find this page.');
  await expect(page.locator('h1')).toBeFocused();
});

test('keeps every visible mobile link, button, and file action at least 44 by 44 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/404.html', '/does-not-exist']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route}: no horizontal overflow`).toBeTruthy();
    const targets = page.locator('a, button, label.file-label').filter({ visible: true });
    const count = await targets.count();
    for (let index = 0; index < count; index += 1) {
      const target = targets.nth(index);
      if (!(await target.isVisible())) continue;
      const box = await target.boundingBox();
      expect(box?.width, `${route}: ${await target.innerText()} width`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${route}: ${await target.innerText()} height`).toBeGreaterThanOrEqual(44);
    }
  }
  await page.goto('/demo');
  await page.locator('#open-extraction').click();
  await page.locator('#run-extraction').click();
  for (const target of await page.locator('#extract-dialog a, #extract-dialog button').all()) {
    if (!(await target.isVisible())) continue;
    const box = await target.boundingBox();
    expect(box?.width, `${await target.innerText()} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${await target.innerText()} height`).toBeGreaterThanOrEqual(44);
  }
});

test('uses immutable caching only for versioned production assets', async ({ page }) => {
  await page.goto('/');
  const appAssets = await page.locator('script[src^="/assets/"],link[rel="stylesheet"][href^="/assets/"]').evaluateAll((nodes) => nodes.map((node) => node instanceof HTMLScriptElement ? node.getAttribute('src') : node.getAttribute('href')));
  expect(appAssets.length).toBeGreaterThan(1);
  for (const asset of appAssets) expect(asset).toMatch(/-[A-Za-z0-9_-]{8,}\.(?:js|css)$/);
  const assetFiles = await readdir('dist/assets');
  for (const asset of assetFiles.filter((name) => !name.endsWith('.map'))) expect(asset, 'immutable asset filename').toMatch(/-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/i);
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as { routes: Array<{ route: string; headers?: Record<string, string> }> };
  const immutable = config.routes.filter((route) => route.headers?.['Cache-Control']?.includes('immutable'));
  expect(immutable.map((route) => route.route)).toEqual(['/assets/*']);
});

test('names the saved-slip disclosure action and supports keyboard toggling', async ({ page }) => {
  await page.goto('/demo');
  const toggle = page.locator('#saved-toggle');
  await expect(toggle).toHaveText('Show sample slips (1)');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveText('Hide sample slips (1)');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveText('Show sample slips (1)');
});

test('registers every claim once and exposes working internal links', async ({ page }) => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  const source = await readFile('tests/app.spec.ts', 'utf8');
  const tags = [...source.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
  for (const claim of claims) {
    expect(claim.test).toContain(`@claim:${claim.id}`);
    expect(tags.filter((tag) => tag === claim.id), claim.id).toHaveLength(1);
  }
  expect(new Set(tags)).toEqual(new Set(claims.map((claim) => claim.id)));
  for (const route of ['/', '/demo', '/privacy/', '/terms/', '/offline.html', '/404.html']) {
    expect((await page.request.get(route)).ok(), route).toBeTruthy();
  }
});
