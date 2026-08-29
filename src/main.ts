import './style.css';
import { deleteSlip, exportBackup, getAttachment, getSlip, importBackup, listSlips, putSlip, putSlipWithAttachment, resetDemoStorage, setStorageMode } from './db';
import { demoSuggestions, extractBill } from './extract';
import { clientLineList, downloadText, slipCsv } from './export';
import { formatMoney, moneyInput, parseMoney, summarize } from './money';
import type { BillSuggestions } from './extract';
import type { Allocation, Currency, Slip } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const demo = location.pathname === '/demo' || new URL(location.href).searchParams.get('demo') === '1';
const isAppRoute = ['/', '/demo'].includes(location.pathname) || (location.pathname === '/' && new URL(location.href).searchParams.get('demo') === '1');
const categories = ['Materials', 'Subcontractor labor', 'Equipment rental', 'Fuel', 'Permit / fee', 'Delivery'];
const SOCIOBOT_KEY = 'split-cost-slip:sociobot-key';
const now = () => new Date().toISOString(), uid = () => crypto.randomUUID();
const newRow = (billable = true): Allocation => ({ id: uid(), description: '', category: '', amountCents: 0, billable });
const newSlip = (): Slip => ({ id: uid(), supplier: '', reference: '', client: '', billDate: new Date().toISOString().slice(0, 10), currency: 'USD', totalCents: 0, notes: '', allocations: [newRow(true), newRow(false)], createdAt: now(), updatedAt: now() });
const sampleSlip = (): Slip => ({ id: 'demo-sunrise-2026', supplier: 'Sunrise Building Supply', reference: 'SBS-48192', client: 'Juniper Kitchen Remodel', billDate: '2026-08-21', currency: 'USD', totalCents: 128750, notes: '', attachment: { name: 'sunrise-supplier-bill.pdf', type: 'application/pdf', size: 47 }, createdAt: '2026-08-21T10:00:00.000Z', updatedAt: now(), allocations: [
  { id: 'demo-1', description: 'Cabinet plywood', category: 'Materials', amountCents: 86400, billable: true },
  { id: 'demo-2', description: 'Delivery to workshop', category: 'Delivery', amountCents: 12850, billable: false },
  { id: 'demo-3', description: 'Fasteners for install', category: 'Materials', amountCents: 29500, billable: true },
] });
const sampleAttachment = () => new File(['%PDF-1.4\n% Split Cost Slip sample attachment\n'], 'sunrise-supplier-bill.pdf', { type: 'application/pdf' });
let current = newSlip(), saved: Slip[] = [], saveTimer = 0, messageTimer = 0, attachmentUrl = '', extractionOpener: HTMLElement | null = null;
const invalidFields = new Set<string>();
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const valid = () => invalidFields.size === 0;
const focusHeading = (text: string) => { const heading = el<HTMLElement>('page-title'); heading.focus(); el('route-announcer').textContent = text; };

function setMetadata(): void {
  document.title = demo ? 'Demo — Split Cost Slip' : 'Split Cost Slip — split billable and overhead costs';
  const canonical = document.querySelector<HTMLLinkElement>('link[rel=canonical]')!; canonical.href = `https://split-pass-through-costs.sociobot.in${demo ? '/demo' : '/'}`;
  const description = demo ? 'Try a sample contractor bill split into billable costs and overhead.' : 'Split one supplier bill into billable costs and overhead for contractor invoicing.';
  document.querySelector<HTMLMetaElement>('meta[name=description]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
}
function notFound(): void {
  document.title = 'Page not found — Split Cost Slip';
  document.querySelector<HTMLMetaElement>('meta[name=description]')!.content = 'The requested Split Cost Slip page was not found.';
  document.querySelector<HTMLLinkElement>('link[rel=canonical]')!.href = 'https://split-pass-through-costs.sociobot.in/404';
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = 'The requested Split Cost Slip page was not found.';
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = document.title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = 'The requested Split Cost Slip page was not found.';
  app.innerHTML = `<header class="site-header"><a class="wordmark" href="/"><span aria-hidden="true">S/</span> Split Cost Slip</a><nav aria-label="Site navigation"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav></header><div id="route-announcer" class="visually-hidden" aria-live="polite"></div><main id="main" class="not-found"><p class="eyebrow">Page not found</p><h1 id="page-title" tabindex="-1">We cannot find this page.</h1><p>Check the address, return home, or open the sample.</p><p class="route-actions"><a class="primary-action" href="/">Return home</a><a class="secondary-action" href="/demo">Open the demo</a></p></main><footer><p>Split Cost Slip separates one bill into billable costs and overhead.</p><nav aria-label="Legal"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-split-pass-through-costs">Source on GitHub (external)</a></nav><p>Built by Param Factory · build repair-2</p></footer>`;
  focusHeading('Page not found — Split Cost Slip');
}
function shell(): void {
  app.innerHTML = `
  <header class="site-header">
    <a class="wordmark" href="/" aria-label="S/ Split Cost Slip — home"><span aria-hidden="true">S/</span> Split Cost Slip</a>
    <nav aria-label="Site navigation"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
  </header>
  <div id="route-announcer" class="visually-hidden" aria-live="polite"></div>
  <div class="connection-strip" role="status"><span class="status-dot" aria-hidden="true"></span><span id="connection-text">Checking connection…</span><span>${demo ? '· Sample records stay separate' : '· Saved in this browser'}</span></div>
  ${demo ? `<aside class="demo-banner" aria-label="Demo controls"><strong>Demo — sample data, nothing is saved</strong><span>Sample records use separate browser storage.</span><button class="text-button" id="reset-demo" type="button">Reset demo</button><a id="leave-demo" href="/?new=1">Start for real</a></aside>` : ''}
  <main id="main">
    <section class="masthead" aria-labelledby="page-title">
      <div class="masthead-copy"><p class="eyebrow">For contractors billing materials</p><h1 id="page-title" tabindex="-1">Split one bill into <em>billable and overhead costs.</em></h1><p class="deck">For contractors who need to separate client costs from their own overhead.</p><div class="hero-actions"><a class="primary-action" href="/?demo=1">Try it with sample data</a><button class="secondary-action" id="enter-bill" type="button">Enter my bill</button></div><p class="action-help">The sample opens a completed supplier bill. Your real bill starts empty.</p><ul class="plain-facts"><li>Saved in this browser</li><li>Works offline after the first visit</li><li>Saving and exports are free</li></ul></div>
      <figure class="hero-figure"><img src="/assets/hero-broadsheet-13629612.webp" width="1320" height="820" fetchpriority="high" alt="A supplier bill divided by black and orange paper strips on a contractor workbench"><figcaption>One supplier bill. Billable costs and overhead.</figcaption></figure>
    </section>
    <section class="how-it-works" aria-labelledby="how-title"><p class="eyebrow">How it works</p><h2 id="how-title">Split one supplier bill in three steps.</h2><ol><li><strong>Enter the bill.</strong> Add the supplier total and optional attachment.</li><li><strong>Divide each cost.</strong> Mark every cost row billable or overhead.</li><li><strong>Export the split.</strong> Save a CSV or a client line list when it balances.</li></ol></section>
    <div class="workspace-tools"><button class="text-button" id="saved-toggle" type="button" aria-expanded="false" aria-controls="archive">Show ${demo ? 'sample' : 'saved'} slips (<span id="saved-count">0</span>)</button></div><div class="workspace-grid"><aside class="archive" id="archive" aria-label="${demo ? 'Sample' : 'Saved'} slips" hidden><div class="section-kicker"><span>${demo ? 'Sample slips' : 'Saved slips'}</span><span id="archive-tier">${demo ? 'Sample records' : 'Saved in this browser'}</span></div><button class="primary-action full" id="new-slip" type="button">Create a new slip</button><div id="saved-list"></div><div class="data-tools"><button class="text-button" id="backup-export" type="button">Export backup</button><label class="text-button file-label" for="backup-import">Import backup</label><input id="backup-import" class="visually-hidden" type="file" accept="application/json,.json"><p>Backup files contain slip details, not attachments.</p></div></aside>
    <article class="slip" id="split-workspace" aria-labelledby="slip-heading"><div class="folio"><div><span class="folio-label">Working slip</span><strong id="slip-number">Draft</strong></div><div><span class="folio-label">Storage</span><strong id="save-state">${demo ? 'Sample record' : 'Not saved yet'}</strong></div><div><span class="folio-label">Mode</span><strong>${demo ? 'Sample only' : 'Your data'}</strong></div></div>
      <section aria-labelledby="slip-heading"><div class="section-title"><div><p class="eyebrow">01 / supplier bill</p><h2 id="slip-heading">Enter the supplier bill.</h2></div><p>Required fields are marked *.</p></div><div class="source-fields"><label class="field span-2">Supplier *<input id="supplier" autocomplete="organization" required></label><label class="field">Supplier bill reference<input id="reference" autocomplete="off"></label><label class="field">Bill date<input id="bill-date" type="date"></label><label class="field">Client / job<input id="client" autocomplete="organization"></label><label class="field">Currency<select id="currency"><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option><option>INR</option></select></label><label class="field amount-field">Supplier bill total *<span class="money-input"><span id="currency-prefix">$</span><input id="bill-total" inputmode="decimal" autocomplete="off" aria-describedby="total-help validation-message"></span><small id="total-help">Use two decimal places. Include tax if it is on the supplier bill.</small></label></div><p id="validation-message" class="margin-note" role="alert"></p><div class="attachment-zone"><div><strong>Attach the supplier bill</strong><p>Images and PDFs up to 10 MB are saved in this browser.</p></div><div class="attachment-actions"><label class="secondary-action file-label" for="attachment">Attach supplier bill</label><input class="visually-hidden" id="attachment" type="file" accept="image/*,application/pdf"><button class="text-button" id="view-attachment" type="button" hidden>Open attachment</button><button class="text-button" id="open-extraction" type="button" disabled>Extract bill details</button></div><p id="attachment-name" class="attachment-name" aria-live="polite">No attachment yet</p><p class="extraction-note">Optional: extraction uses your Sociobot key. Manual entry still works offline.</p></div></section>
      <section aria-labelledby="allocation-heading"><div class="section-title"><div><p class="eyebrow">02 / cost rows</p><h2 id="allocation-heading">Divide the bill into cost rows.</h2></div><p>Billable means you plan to charge the client for that row.</p></div><div class="row-head" aria-hidden="true"><span>Description and category</span><span>Type</span><span>Amount</span><span></span></div><div id="allocation-rows"></div><button class="add-row" id="add-row" type="button">＋ Add cost row</button></section>
      <section class="totals-section" aria-labelledby="totals-heading"><div class="totals-copy"><p class="eyebrow">03 / check</p><h2 id="totals-heading">Match the split to the bill total.</h2><p id="balance-guidance">Enter the bill total and cost rows to check the split.</p></div><dl class="totals"><div><dt>Billable to client</dt><dd id="billable-total">$0.00</dd></div><div><dt>Your overhead</dt><dd id="overhead-total">$0.00</dd></div><div class="total-rule"><dt>Split total</dt><dd id="split-total">$0.00</dd></div><div class="balance-row" id="balance-row"><dt id="balance-label">Still to allocate</dt><dd id="remaining-total">$0.00</dd></div></dl></section>
      <section class="output-section" aria-labelledby="output-heading"><div><p class="eyebrow">04 / output</p><h2 id="output-heading">Export the finished split.</h2><p>Each row keeps its supplier bill reference, category, and billable or overhead choice.</p></div><div class="output-actions"><button class="primary-action" id="save-slip" type="button">Save slip</button><button class="secondary-action" id="export-csv" type="button">Export CSV</button><button class="secondary-action" id="copy-client" type="button">Copy client line list</button><button class="secondary-action" id="print-client" type="button">Print client line list</button><button class="danger-action" id="delete-slip" type="button">Delete slip</button></div><p class="fine-print">Check your bookkeeping and tax treatment before importing. Split Cost Slip does not give tax or accounting advice.</p></section>
    </article></div>
    <section class="limits" aria-labelledby="limits-heading"><p class="eyebrow">Privacy and limits</p><h2 id="limits-heading">It splits bills. It does not replace accounting software.</h2><p>The demo sends no requests to other websites. Keep original attachments and check every export before accounting or invoicing.</p></section>
  </main><footer><p>Split Cost Slip separates one bill into billable costs and overhead.</p><nav aria-label="Legal"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-split-pass-through-costs">Source on GitHub (external)</a></nav><p>Built by Param Factory · build repair-2</p></footer><dialog id="extract-dialog" aria-labelledby="extract-title" aria-describedby="extract-privacy"><div class="dialog-inner"><button class="dialog-close" id="close-extraction" type="button" aria-label="Close bill extraction">×</button><p class="eyebrow">Optional bill reader</p><h2 id="extract-title">Extract editable bill details.</h2><div id="extract-start"><p id="extract-privacy">The named attachment goes to the Sociobot gateway only after you choose Extract bill details.</p><p class="send-sheet"><span>Attachment to send</span><strong id="extract-filename">No attachment</strong><small>Supplier, reference, date, total, and line items may be returned. You choose billable or overhead.</small></p>${demo ? '<p class="demo-extract-note">This demo uses a recorded result. It sends no request.</p>' : '<label class="field">Sociobot key<input id="sociobot-key" type="password" autocomplete="off" spellcheck="false" aria-describedby="key-help"></label><p id="key-help" class="key-help">The key stays in this browser until you remove it. <a href="https://sociobot.in/">Get a key at sociobot.in (external)</a>.</p><button class="text-button" id="remove-sociobot-key" type="button">Remove saved key</button>'}<div class="dialog-actions"><button class="primary-action" id="run-extraction" type="button">Extract bill details</button><button class="secondary-action" id="cancel-extraction" type="button">Keep entering manually</button></div></div><div id="extract-results" hidden><p>Edit each suggestion. Choose billable or overhead for every line before applying.</p><div class="suggestion-fields"><label class="field">Supplier<input id="suggested-supplier"></label><label class="field">Bill reference<input id="suggested-reference"></label><label class="field">Bill date<input id="suggested-date" type="date"></label><label class="field">Currency<select id="suggested-currency"><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option><option>INR</option></select></label><label class="field">Supplier bill total<input id="suggested-total" inputmode="decimal"></label></div><div id="suggested-lines"></div><div class="dialog-actions"><button class="primary-action" id="apply-extraction" type="button">Apply my choices</button><button class="secondary-action" id="discard-extraction" type="button">Discard suggestions</button></div></div><p id="extract-status" class="margin-note" role="status" aria-live="polite"></p></div></dialog><div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`;
  if (demo) {
    app.querySelector('.masthead')?.remove();
    app.querySelector('.how-it-works')?.remove();
    app.querySelector('.limits')?.remove();
    const summary = document.createElement('section');
    summary.className = 'demo-summary';
    summary.setAttribute('aria-labelledby', 'page-title');
    summary.innerHTML = `<p class="eyebrow">Completed sample</p><h1 id="page-title" tabindex="-1">Sunrise Building Supply</h1><div class="demo-summary-grid"><p><strong>SBS-48192</strong><span>Juniper Kitchen Remodel</span></p><p><strong>$1,287.50</strong><span>Supplier bill total</span></p><p><strong>Balanced exactly</strong><span>Two billable rows · one overhead row</span></p></div><ul><li>Cabinet plywood · Billable · $864.00</li><li>Fasteners for install · Billable · $295.00</li><li>Delivery to workshop · Overhead · $128.50</li></ul>`;
    app.querySelector('#main')?.prepend(summary);
  }
}
function formatBytes(bytes: number): string { return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.ceil(bytes / 1000)} KB`; }
function fillForm(): void { el<HTMLInputElement>('supplier').value = current.supplier; el<HTMLInputElement>('reference').value = current.reference; el<HTMLInputElement>('client').value = current.client; el<HTMLInputElement>('bill-date').value = current.billDate; el<HTMLSelectElement>('currency').value = current.currency; el<HTMLInputElement>('bill-total').value = current.totalCents ? moneyInput(current.totalCents) : ''; el('slip-number').textContent = current.reference || 'Draft'; el('save-state').textContent = saved.some((slip) => slip.id === current.id) ? (demo ? 'Sample record' : 'Saved in this browser') : 'Not saved yet'; el('attachment-name').textContent = current.attachment ? `${current.attachment.name} · ${formatBytes(current.attachment.size)}` : 'No attachment yet'; el<HTMLButtonElement>('view-attachment').hidden = !current.attachment; el<HTMLButtonElement>('open-extraction').disabled = !current.attachment; renderRows(); renderTotals(); }
function renderRows(): void { const container = el<HTMLDivElement>('allocation-rows'); container.replaceChildren(); current.allocations.forEach((row, index) => { const item = document.createElement('fieldset'); item.className = 'allocation-row'; item.innerHTML = `<legend>Cost row ${index + 1}</legend><div class="row-identity"><label>Description<input class="row-description" autocomplete="off"></label><label>Category<input class="row-category" list="category-list" autocomplete="off"></label></div><label class="treatment-control"><input class="row-billable" type="checkbox"><span class="switch" aria-hidden="true"></span><span class="treatment-copy"><strong></strong><small></small></span></label><label class="row-amount">Amount<input class="row-amount-input" inputmode="decimal" autocomplete="off" aria-label="Amount for cost row ${index + 1}" aria-describedby="validation-message"></label><button class="remove-row" type="button" aria-label="Remove cost row ${index + 1}">×</button>`; const description = item.querySelector<HTMLInputElement>('.row-description')!, category = item.querySelector<HTMLInputElement>('.row-category')!, billable = item.querySelector<HTMLInputElement>('.row-billable')!, amount = item.querySelector<HTMLInputElement>('.row-amount-input')!; description.value = row.description; category.value = row.category; billable.checked = row.billable; amount.value = row.amountCents ? moneyInput(row.amountCents) : ''; updateTreatment(item, row.billable); description.addEventListener('input', () => { row.description = description.value; description.removeAttribute('aria-invalid'); changed(); }); category.addEventListener('input', () => { row.category = category.value; changed(); }); billable.addEventListener('change', () => { row.billable = billable.checked; updateTreatment(item, row.billable); changed(); }); amount.addEventListener('input', () => setMoney(amount, `row-${row.id}`, (value) => { row.amountCents = value; })); item.querySelector<HTMLButtonElement>('.remove-row')!.addEventListener('click', () => { current.allocations.splice(index, 1); renderRows(); changed(); showToast('Cost row removed.', 'Undo', () => { current.allocations.splice(index, 0, row); renderRows(); changed(); }); }); container.append(item); }); if (!document.getElementById('category-list')) { const list = document.createElement('datalist'); list.id = 'category-list'; categories.forEach((value) => { const option = document.createElement('option'); option.value = value; list.append(option); }); document.body.append(list); } }
function updateTreatment(item: HTMLElement, billable: boolean): void { item.querySelector('.treatment-copy strong')!.textContent = billable ? 'Billable' : 'Overhead'; item.querySelector('.treatment-copy small')!.textContent = billable ? 'Charge to client' : 'Your cost'; }
function setMoney(field: HTMLInputElement, key: string, assign: (value: number) => void): void { const parsed = parseMoney(field.value); const bad = field.value !== '' && parsed === null; field.setAttribute('aria-invalid', String(bad)); if (bad) invalidFields.add(key); else { invalidFields.delete(key); assign(parsed ?? 0); } updateValidation(); changed(); }
function updateValidation(): void { const message = valid() ? '' : 'Use a whole amount with no more than two decimal places. Fix the highlighted amount before saving or exporting.'; el('validation-message').textContent = message; }
function clearActionValidation(): void { el('validation-message').textContent = valid() ? '' : 'Use a whole amount with no more than two decimal places. Fix the highlighted amount before saving or exporting.'; }
function blankRow(row: Allocation): boolean { return !row.description.trim() && !row.category.trim() && row.amountCents === 0; }
function cleanSlip(slip: Slip): Slip {
  return {
    ...slip,
    supplier: slip.supplier.trim(),
    reference: slip.reference.trim(),
    client: slip.client.trim(),
    allocations: slip.allocations.filter((row) => !blankRow(row)).map((row) => ({ ...row, description: row.description.trim(), category: row.category.trim() })),
  };
}
function showActionValidation(message: string, focus?: HTMLElement): false {
  el('validation-message').textContent = message;
  showToast(message);
  focus?.focus();
  return false;
}
function validateSlipAction(action: 'saving' | 'exporting', announce = true): boolean {
  if (!valid()) {
    if (announce) showActionValidation(`Fix the highlighted amount before ${action}.`);
    return false;
  }
  const supplier = el<HTMLInputElement>('supplier');
  supplier.setAttribute('aria-invalid', String(!current.supplier.trim()));
  if (!current.supplier.trim()) {
    if (announce) showActionValidation(`Enter the supplier before ${action}.`, supplier);
    return false;
  }
  const unnamed = current.allocations.find((row) => !blankRow(row) && !row.description.trim());
  if (unnamed) {
    const rowIndex = current.allocations.indexOf(unnamed);
    const field = document.querySelectorAll<HTMLInputElement>('.row-description')[rowIndex];
    field?.setAttribute('aria-invalid', 'true');
    if (announce) showActionValidation(`Name every cost row before ${action}.`, field);
    return false;
  }
  document.querySelectorAll<HTMLInputElement>('.row-description').forEach((field) => field.removeAttribute('aria-invalid'));
  return true;
}
function renderTotals(): void { const totals = summarize(current.totalCents, current.allocations), blocked = !valid(); el('billable-total').textContent = formatMoney(totals.billableCents, current.currency); el('overhead-total').textContent = formatMoney(totals.overheadCents, current.currency); el('split-total').textContent = formatMoney(totals.splitCents, current.currency); el('remaining-total').textContent = formatMoney(Math.abs(totals.remainingCents), current.currency); el('currency-prefix').textContent = new Intl.NumberFormat(undefined, { style: 'currency', currency: current.currency }).formatToParts(0).find((part) => part.type === 'currency')?.value || current.currency; const row = el('balance-row'); row.className = `balance-row ${!blocked && totals.balanced ? 'balanced' : !blocked && totals.remainingCents < 0 ? 'over' : ''}`; el('balance-label').textContent = blocked ? 'Fix invalid amount' : totals.balanced ? 'Balanced exactly' : totals.remainingCents < 0 ? 'Over-allocated' : 'Still to allocate'; el('balance-guidance').textContent = blocked ? 'Fix the highlighted amount before checking the split.' : totals.balanced ? 'Every cent of the supplier bill is accounted for.' : totals.remainingCents < 0 ? `Reduce rows by ${formatMoney(Math.abs(totals.remainingCents), current.currency)} to match the bill.` : current.totalCents ? `Allocate ${formatMoney(totals.remainingCents, current.currency)} more to match the bill.` : 'Enter the bill total and cost rows to check the split.'; }
function updateSavedToggle(): void { const expanded = el('saved-toggle').getAttribute('aria-expanded') === 'true'; el('saved-toggle').childNodes[0].textContent = `${expanded ? 'Hide' : 'Show'} ${demo ? 'sample' : 'saved'} slips (`; }
function renderSaved(): void { el('saved-count').textContent = String(saved.length); updateSavedToggle(); const box = el<HTMLDivElement>('saved-list'); box.replaceChildren(); if (!saved.length) { box.textContent = 'No saved slips yet. Your first balanced bill will appear here.'; return; } const list = document.createElement('ol'); list.className = 'saved-list'; saved.forEach((slip) => { const button = document.createElement('button'); button.type = 'button'; button.className = slip.id === current.id ? 'saved-slip active' : 'saved-slip'; button.innerHTML = `<strong></strong><span></span><small></small>`; button.querySelector('strong')!.textContent = slip.supplier || 'Untitled supplier'; button.querySelector('span')!.textContent = `${slip.reference || 'No reference'} · ${formatMoney(slip.totalCents, slip.currency)}`; button.querySelector('small')!.textContent = summarize(slip.totalCents, slip.allocations).balanced ? 'Balanced' : 'Draft'; button.addEventListener('click', () => void openSlip(slip.id)); const li = document.createElement('li'); li.append(button); list.append(li); }); box.append(list); }
function setActiveSlipUrl(id?: string): void {
  if (demo) return;
  const url = new URL(location.href);
  url.searchParams.delete('new');
  if (id) url.searchParams.set('slip', id); else url.searchParams.delete('slip');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
function newWorkspaceUrl(): void {
  if (demo) return;
  const url = new URL(location.href);
  url.searchParams.delete('slip');
  url.searchParams.set('new', '1');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
function changed(): void { current.updatedAt = now(); clearActionValidation(); el('save-state').textContent = valid() ? 'Unsaved changes' : 'Fix invalid amount'; renderTotals(); clearTimeout(saveTimer); if (valid()) saveTimer = window.setTimeout(() => void saveCurrent(true), 700); }
async function saveCurrent(silent = false): Promise<boolean> {
  if (!validateSlipAction('saving', !silent)) { if (!silent) el('save-state').textContent = valid() ? 'Needs details' : 'Fix invalid amount'; return false; }
  const slip = cleanSlip(current);
  if (!slip.supplier && slip.totalCents === 0 && !slip.allocations.length && !slip.attachment) { if (!silent) showActionValidation('Enter the supplier before saving.', el<HTMLInputElement>('supplier')); el('save-state').textContent = 'Not saved yet'; return false; }
  await putSlip(slip);
  saved = await listSlips();
  setActiveSlipUrl(current.id);
  el('save-state').textContent = demo ? 'Saved in demo only' : 'Saved in this browser';
  renderSaved();
  if (!silent) showToast(demo ? 'Sample change saved in demo only.' : 'Slip saved in this browser.');
  return true;
}
async function openSlip(id: string): Promise<void> { const slip = await getSlip(id); if (!slip) return; current = slip; setActiveSlipUrl(id); revokeAttachmentUrl(); fillForm(); renderSaved(); el('split-workspace').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); }
function showToast(text: string, action?: string, callback?: () => void): void { const toast = el<HTMLDivElement>('toast'); clearTimeout(messageTimer); toast.replaceChildren(document.createTextNode(text)); if (action && callback) { const button = document.createElement('button'); button.type = 'button'; button.textContent = action; button.addEventListener('click', () => { callback(); toast.hidden = true; }); toast.append(button); } toast.hidden = false; messageTimer = window.setTimeout(() => { toast.hidden = true; }, 6000); }
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function revokeAttachmentUrl(): void { if (attachmentUrl) URL.revokeObjectURL(attachmentUrl); attachmentUrl = ''; }
async function handleAttachment(file?: File): Promise<void> { if (!file) return; if (file.size > 10_000_000) { showToast('That file is over 10 MB. Choose a smaller image or PDF.'); return; } if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { showToast('Choose an image or PDF supplier bill.'); return; } current.attachment = { name: file.name, type: file.type, size: file.size }; await putSlipWithAttachment(current, file); saved = await listSlips(); setActiveSlipUrl(current.id); el('save-state').textContent = demo ? 'Saved in demo only' : 'Draft saved in this browser'; renderSaved(); el('attachment-name').textContent = `${file.name} · ${formatBytes(file.size)}`; el<HTMLButtonElement>('view-attachment').hidden = false; el<HTMLButtonElement>('open-extraction').disabled = false; showToast(demo ? 'Supplier bill attached in demo only.' : 'Supplier bill attached in this browser.'); }
async function viewAttachment(): Promise<void> { const file = await getAttachment(current.id); if (!file) { showToast('The attachment is missing. Attach it again.'); return; } revokeAttachmentUrl(); attachmentUrl = URL.createObjectURL(file); window.open(attachmentUrl, '_blank', 'noopener,noreferrer'); }
function assertOutput(): boolean { if (!validateSlipAction('exporting')) return false; if (!summarize(current.totalCents, current.allocations).balanced) return showActionValidation('Match the split to the bill total before exporting.'); return true; }
function closeExtraction(): void { const dialog = el<HTMLDialogElement>('extract-dialog'); if (dialog.open) dialog.close(); }
function openExtraction(): void {
  if (!current.attachment) { showToast('Attach an image or PDF before extracting bill details.'); return; }
  extractionOpener = document.activeElement as HTMLElement;
  el('extract-filename').textContent = `${current.attachment.name} · ${formatBytes(current.attachment.size)}`;
  el<HTMLElement>('extract-start').hidden = false;
  el<HTMLElement>('extract-results').hidden = true;
  el('extract-status').textContent = '';
  if (!demo) {
    const key = el<HTMLInputElement>('sociobot-key');
    key.value = localStorage.getItem(SOCIOBOT_KEY) || '';
    el<HTMLButtonElement>('remove-sociobot-key').hidden = !key.value;
  }
  const dialog = el<HTMLDialogElement>('extract-dialog');
  dialog.showModal();
  el<HTMLButtonElement>('close-extraction').focus();
}
function renderSuggestions(suggestions: BillSuggestions): void {
  el<HTMLInputElement>('suggested-supplier').value = suggestions.supplier;
  el<HTMLInputElement>('suggested-reference').value = suggestions.reference;
  el<HTMLInputElement>('suggested-date').value = suggestions.billDate;
  el<HTMLSelectElement>('suggested-currency').value = suggestions.currency;
  el<HTMLInputElement>('suggested-total').value = suggestions.total;
  const container = el<HTMLDivElement>('suggested-lines');
  container.replaceChildren();
  suggestions.lines.forEach((line, index) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'suggested-line';
    fieldset.innerHTML = `<legend>Suggested line ${index + 1}</legend><label class="field">Description<input class="suggested-description"></label><label class="field">Amount<input class="suggested-amount" inputmode="decimal"></label><label class="field">Your choice<select class="suggested-treatment" required><option value="">Choose billable or overhead</option><option value="billable">Billable</option><option value="overhead">Overhead</option></select></label>`;
    fieldset.querySelector<HTMLInputElement>('.suggested-description')!.value = line.description;
    fieldset.querySelector<HTMLInputElement>('.suggested-amount')!.value = line.amount;
    container.append(fieldset);
  });
  el<HTMLElement>('extract-start').hidden = true;
  el<HTMLElement>('extract-results').hidden = false;
  el('extract-status').textContent = 'Suggestions are ready. Check every field and choose each line’s treatment.';
  el<HTMLInputElement>('suggested-supplier').focus();
}
async function runExtraction(): Promise<void> {
  if (!current.attachment) return;
  const run = el<HTMLButtonElement>('run-extraction');
  run.disabled = true;
  el('extract-status').textContent = demo ? 'Loading the recorded sample…' : 'Preparing the attachment…';
  try {
    if (demo) {
      renderSuggestions(demoSuggestions());
      return;
    }
    const key = el<HTMLInputElement>('sociobot-key').value.trim();
    if (!key) { el('extract-status').textContent = 'Enter your Sociobot key, then choose Extract bill details.'; el<HTMLInputElement>('sociobot-key').focus(); return; }
    if (!navigator.onLine) { el('extract-status').textContent = 'Extraction needs a connection. Enter the bill manually while offline.'; return; }
    localStorage.setItem(SOCIOBOT_KEY, key);
    el<HTMLButtonElement>('remove-sociobot-key').hidden = false;
    const file = await getAttachment(current.id);
    if (!file) throw new Error('The attachment is missing. Attach it again.');
    renderSuggestions(await extractBill(file, current.attachment.name, current.attachment.type, key, (message) => { el('extract-status').textContent = message; }));
  } catch (error) {
    el('extract-status').textContent = error instanceof Error ? error.message : 'Bill details could not be extracted. Enter the bill manually or try again.';
  } finally {
    run.disabled = false;
  }
}
function applyExtraction(): void {
  const total = parseMoney(el<HTMLInputElement>('suggested-total').value);
  const rows = [...document.querySelectorAll<HTMLElement>('.suggested-line')];
  const parsed = rows.map((row) => ({
    description: row.querySelector<HTMLInputElement>('.suggested-description')!.value.trim(),
    amountCents: parseMoney(row.querySelector<HTMLInputElement>('.suggested-amount')!.value),
    treatment: row.querySelector<HTMLSelectElement>('.suggested-treatment')!.value,
  }));
  if (total === null || parsed.some((row) => row.amountCents === null)) { el('extract-status').textContent = 'Use whole amounts with no more than two decimal places.'; return; }
  if (parsed.some((row) => !row.treatment)) { el('extract-status').textContent = 'Choose billable or overhead for every suggested line.'; rows.find((row) => !row.querySelector<HTMLSelectElement>('.suggested-treatment')!.value)?.querySelector<HTMLSelectElement>('.suggested-treatment')?.focus(); return; }
  const previous = structuredClone(current);
  current.supplier = el<HTMLInputElement>('suggested-supplier').value.trim();
  current.reference = el<HTMLInputElement>('suggested-reference').value.trim();
  current.billDate = el<HTMLInputElement>('suggested-date').value;
  current.currency = el<HTMLSelectElement>('suggested-currency').value as Currency;
  current.totalCents = total;
  current.allocations = parsed.map((row) => ({ id: uid(), description: row.description, category: '', amountCents: row.amountCents!, billable: row.treatment === 'billable' }));
  invalidFields.clear();
  fillForm();
  changed();
  closeExtraction();
  showToast('Bill details applied. Check every field.', 'Undo', () => { current = previous; invalidFields.clear(); fillForm(); changed(); });
}
function printClientLineList(): void { const sheet = document.createElement('pre'); sheet.className = 'client-print-sheet'; sheet.textContent = clientLineList(cleanSlip(current)); document.body.append(sheet); document.body.classList.add('printing-client'); const cleanup = () => { sheet.remove(); document.body.classList.remove('printing-client'); }; window.addEventListener('afterprint', cleanup, { once: true }); window.print(); window.setTimeout(cleanup, 1000); }
function wireEvents(): void {
  const bind = (id: string, key: 'supplier' | 'reference' | 'client') => el<HTMLInputElement>(id).addEventListener('input', (event) => { current[key] = (event.target as HTMLInputElement).value; if (key === 'supplier') el<HTMLInputElement>('supplier').removeAttribute('aria-invalid'); if (key === 'reference') el('slip-number').textContent = current.reference || 'Draft'; changed(); });
  bind('supplier', 'supplier'); bind('reference', 'reference'); bind('client', 'client');
  el<HTMLInputElement>('bill-date').addEventListener('change', (event) => { current.billDate = (event.target as HTMLInputElement).value; changed(); });
  el<HTMLSelectElement>('currency').addEventListener('change', (event) => { current.currency = (event.target as HTMLSelectElement).value as Currency; changed(); });
  el<HTMLInputElement>('bill-total').addEventListener('input', (event) => setMoney(event.target as HTMLInputElement, 'total', (value) => { current.totalCents = value; }));
  document.getElementById('enter-bill')?.addEventListener('click', () => { el('split-workspace').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); el<HTMLInputElement>('supplier').focus({ preventScroll: true }); });
  el('add-row').addEventListener('click', () => { current.allocations.push(newRow()); renderRows(); changed(); document.querySelector<HTMLInputElement>('.allocation-row:last-child .row-description')?.focus(); });
  el('new-slip').addEventListener('click', () => { current = newSlip(); newWorkspaceUrl(); invalidFields.clear(); revokeAttachmentUrl(); fillForm(); renderSaved(); el<HTMLInputElement>('supplier').focus(); });
  el('saved-toggle').addEventListener('click', () => { const archive = el<HTMLElement>('archive'); archive.hidden = !archive.hidden; el('saved-toggle').setAttribute('aria-expanded', String(!archive.hidden)); updateSavedToggle(); });
  el<HTMLInputElement>('attachment').addEventListener('change', (event) => void handleAttachment((event.target as HTMLInputElement).files?.[0]));
  el('view-attachment').addEventListener('click', () => void viewAttachment());
  el('open-extraction').addEventListener('click', openExtraction);
  el('close-extraction').addEventListener('click', closeExtraction);
  el('cancel-extraction').addEventListener('click', closeExtraction);
  el('discard-extraction').addEventListener('click', closeExtraction);
  el('run-extraction').addEventListener('click', () => void runExtraction());
  el('apply-extraction').addEventListener('click', applyExtraction);
  el<HTMLDialogElement>('extract-dialog').addEventListener('close', () => extractionOpener?.focus());
  if (!demo) el('remove-sociobot-key').addEventListener('click', () => { localStorage.removeItem(SOCIOBOT_KEY); el<HTMLInputElement>('sociobot-key').value = ''; el<HTMLButtonElement>('remove-sociobot-key').hidden = true; el('extract-status').textContent = 'The saved Sociobot key was removed.'; });
  el('save-slip').addEventListener('click', () => void saveCurrent());
  el('export-csv').addEventListener('click', () => { if (assertOutput()) { downloadText(slipCsv(cleanSlip(current)), 'split-cost-slip.csv', 'text/csv;charset=utf-8'); showToast('CSV exported.'); } });
  el('copy-client').addEventListener('click', () => { if (assertOutput()) void navigator.clipboard.writeText(clientLineList(cleanSlip(current))).then(() => showToast('Client line list copied.')).catch(() => showToast('Clipboard is unavailable. Use Print client line list instead.')); });
  el('print-client').addEventListener('click', () => { if (assertOutput()) printClientLineList(); });
  el('delete-slip').addEventListener('click', () => void (async () => { if (!confirm(`Delete ${current.supplier || 'this slip'} and its attachment?`)) return; await deleteSlip(current.id); saved = await listSlips(); current = newSlip(); newWorkspaceUrl(); fillForm(); renderSaved(); showToast('Slip and attachment deleted.'); })());
  el('backup-export').addEventListener('click', () => void exportBackup().then((data) => downloadText(data, 'split-cost-slip-backup.json', 'application/json')));
  el<HTMLInputElement>('backup-import').addEventListener('change', (event) => void (async () => { try { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; const count = await importBackup(await file.text()); saved = await listSlips(); renderSaved(); showToast(`${count} slips imported.`); } catch (error) { showToast(error instanceof Error ? error.message : 'Could not import that backup.'); } })());
  if (demo) { el('reset-demo').addEventListener('click', () => void resetDemo()); el('leave-demo').addEventListener('click', (event) => { event.preventDefault(); void resetDemoStorage().then(() => { location.href = '/?new=1'; }); }); }
  window.addEventListener('online', updateConnection); window.addEventListener('offline', updateConnection);
}
async function resetDemo(): Promise<void> { await resetDemoStorage(); current = sampleSlip(); await putSlipWithAttachment(current, sampleAttachment()); saved = await listSlips(); invalidFields.clear(); fillForm(); renderSaved(); showToast('Demo reset to the Sunrise Building Supply sample.'); }
function updateConnection(): void { el('connection-text').textContent = navigator.onLine ? 'Online' : 'Offline — ready to keep working'; document.body.classList.toggle('is-offline', !navigator.onLine); }
async function registerServiceWorker(): Promise<void> { if (!('serviceWorker' in navigator)) return; try { const hadController = Boolean(navigator.serviceWorker.controller); const registration = await navigator.serviceWorker.register('/sw.js'); registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed' && hadController) showToast('A fresh edition is ready.', 'Reload', () => location.reload()); }); }); await navigator.serviceWorker.ready; const shellAssets = [...document.querySelectorAll<HTMLScriptElement>('script[src]'), ...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((node) => node instanceof HTMLScriptElement ? node.src : node.href); const cache = await caches.open('split-cost-slip-v10'); await cache.addAll([location.pathname, ...shellAssets]); } catch { showToast('Offline setup is unavailable in this browser.'); } }
async function init(): Promise<void> {
  if (!isAppRoute) { notFound(); return; }
  setStorageMode(demo); setMetadata(); shell(); wireEvents();
  try {
    saved = await listSlips();
    if (demo) {
      if (!saved.length) { current = sampleSlip(); await putSlipWithAttachment(current, sampleAttachment()); saved = await listSlips(); }
      else current = saved[0];
    } else {
      const params = new URL(location.href).searchParams;
      const requested = params.get('slip');
      const active = requested ? saved.find((slip) => slip.id === requested) : undefined;
      if (active) current = active;
      else if (saved[0] && !params.has('new')) current = saved[0];
    }
  } catch { showToast('Local storage could not be opened. Check private browsing or storage permissions.'); }
  fillForm(); renderSaved(); updateConnection(); focusHeading(demo ? 'Demo — Split Cost Slip' : 'Split Cost Slip'); void registerServiceWorker();
}
void init();
