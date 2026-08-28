import './style.css';
import { deleteSlip, exportBackup, getAttachment, getSlip, importBackup, listSlips, putAttachment, putSlip } from './db';
import { clientLineList, downloadText, slipCsv } from './export';
import { BUY_URL, loadLicense, removeLicense, restoreLicense, type LicenseState } from './license';
import { formatMoney, moneyInput, parseMoney, summarize } from './money';
import type { Allocation, Currency, Slip } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const categorySuggestions = ['Materials', 'Subcontractor labor', 'Equipment rental', 'Fuel', 'Permit / fee', 'Delivery'];
const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const newRow = (billable = true): Allocation => ({ id: uid(), description: '', category: '', amountCents: 0, billable });
const newSlip = (): Slip => ({
  id: uid(), supplier: '', reference: '', client: '', billDate: new Date().toISOString().slice(0, 10), currency: 'USD',
  totalCents: 0, notes: '', allocations: [newRow(true), newRow(false)], createdAt: now(), updatedAt: now(),
});

let current = newSlip();
let saved: Slip[] = [];
let license: LicenseState = { token: null, pro: false, notice: '' };
let saveTimer = 0;
let messageTimer = 0;
let attachmentUrl = '';

function shell(): void {
  app.innerHTML = `
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Split Cost Slip home"><span aria-hidden="true">S/</span> Split Cost Slip</a>
      <nav aria-label="Utility navigation">
        <button class="text-button" id="saved-toggle" type="button" aria-expanded="false" aria-controls="archive">Saved slips <span id="saved-count">0</span></button>
        <button class="text-button" id="pro-open" type="button">${license.pro ? 'Pro unlocked' : 'Unlock Pro'}</button>
      </nav>
    </header>
    <div class="connection-strip" role="status"><span class="status-dot" aria-hidden="true"></span><span id="connection-text">Checking connection…</span><span>· Your work stays on this device</span></div>

    <main id="main">
      <section class="masthead" aria-labelledby="page-title">
        <div class="masthead-copy">
          <p class="eyebrow">Field ledger № 01 / local utility</p>
          <h1 id="page-title">One bill in.<br><em>Clean costs out.</em></h1>
          <p class="deck">Split a mixed supplier bill into client-reimbursable and overhead rows—without duplicating the original expense.</p>
          <button class="primary-action" id="start-split" type="button">Start this split <span aria-hidden="true">↓</span></button>
        </div>
        <figure class="hero-figure">
          <img src="/assets/hero-broadsheet.webp" width="1320" height="820" fetchpriority="high" alt="A blank supplier bill separated by black and orange paper strips on a contractor's desk" />
          <figcaption>One source document. Two clearly marked destinations.</figcaption>
        </figure>
      </section>

      <div class="workspace-grid">
        <aside class="archive" id="archive" aria-label="Saved slips" hidden>
          <div class="section-kicker"><span>Archive</span><span id="archive-tier">Free · 5 slips</span></div>
          <button class="primary-action full" id="new-slip" type="button">New split slip</button>
          <div id="saved-list"></div>
          <div class="data-tools">
            <button class="text-button" id="backup-export" type="button">Export backup</button>
            <label class="text-button file-label" for="backup-import">Import backup</label>
            <input id="backup-import" class="visually-hidden" type="file" accept="application/json,.json" />
            <p>Backup files contain slip details, not attachments.</p>
          </div>
        </aside>

        <article class="slip" id="split-workspace" aria-labelledby="slip-heading">
          <div class="folio">
            <div><span class="folio-label">Working slip</span><strong id="slip-number">DRAFT</strong></div>
            <div><span class="folio-label">Storage</span><strong id="save-state">Not saved yet</strong></div>
            <div><span class="folio-label">Treatment</span><strong>User selected</strong></div>
          </div>

          <section class="source-section" aria-labelledby="slip-heading">
            <div class="section-title">
              <div><p class="eyebrow">01 / source bill</p><h2 id="slip-heading">Name the original</h2></div>
              <p>Required fields are marked *</p>
            </div>
            <div class="source-fields">
              <label class="field span-2">Supplier *<input id="supplier" autocomplete="organization" required /></label>
              <label class="field">Bill reference<input id="reference" autocomplete="off" /></label>
              <label class="field">Bill date<input id="bill-date" type="date" /></label>
              <label class="field">Client / job<input id="client" autocomplete="organization" /></label>
              <label class="field currency-field">Currency<select id="currency"><option>USD</option><option>GBP</option><option>EUR</option><option>CAD</option><option>AUD</option><option>INR</option></select></label>
              <label class="field amount-field">Original bill total *<span class="money-input"><span id="currency-prefix">$</span><input id="bill-total" inputmode="decimal" autocomplete="off" aria-describedby="total-help" /></span><small id="total-help">Two decimal places. Tax included if it is on the source bill.</small></label>
            </div>
            <div class="attachment-zone">
              <div><strong>Keep the source attached</strong><p>Photo or PDF, stored only in this browser. Maximum 10 MB.</p></div>
              <div class="attachment-actions">
                <label class="secondary-action file-label" for="attachment">Attach bill</label>
                <input class="visually-hidden" id="attachment" type="file" accept="image/*,application/pdf" />
                <button class="text-button" id="view-attachment" type="button" hidden>Open attachment</button>
              </div>
              <p id="attachment-name" class="attachment-name" aria-live="polite">No attachment yet</p>
            </div>
          </section>

          <section class="allocation-section" aria-labelledby="allocation-heading">
            <div class="section-title">
              <div><p class="eyebrow">02 / allocations</p><h2 id="allocation-heading">Mark every cost</h2></div>
              <p>Categories are your labels—not tax advice.</p>
            </div>
            <div class="row-head" aria-hidden="true"><span>Description & category</span><span>Treatment</span><span>Amount</span><span></span></div>
            <div id="allocation-rows"></div>
            <button class="add-row" id="add-row" type="button"><span aria-hidden="true">＋</span> Add cost row</button>
          </section>

          <section class="totals-section" aria-labelledby="totals-heading">
            <div class="totals-copy"><p class="eyebrow">03 / proof</p><h2 id="totals-heading">Close the ledger</h2><p id="balance-guidance">Enter the bill total and allocations to check the split.</p></div>
            <dl class="totals">
              <div><dt>Billable to client</dt><dd id="billable-total">$0.00</dd></div>
              <div><dt>Your overhead</dt><dd id="overhead-total">$0.00</dd></div>
              <div class="total-rule"><dt>Split total</dt><dd id="split-total">$0.00</dd></div>
              <div class="balance-row" id="balance-row"><dt id="balance-label">Still to allocate</dt><dd id="remaining-total">$0.00</dd></div>
            </dl>
          </section>

          <section class="output-section" aria-labelledby="output-heading">
            <div><p class="eyebrow">04 / tear-off</p><h2 id="output-heading">Take it to invoicing</h2><p>Exports preserve one source reference and your selected treatment for every row.</p></div>
            <div class="output-actions">
              <button class="primary-action" id="save-slip" type="button">Save slip</button>
              <button class="secondary-action" id="export-csv" type="button">Export CSV</button>
              <button class="secondary-action" id="copy-client" type="button">Copy client lines</button>
              <button class="secondary-action" id="print-client" type="button">Print client list</button>
              <button class="danger-action" id="delete-slip" type="button">Delete slip</button>
            </div>
            <p class="fine-print">Review your bookkeeping and tax treatment before importing. Split Cost Slip does not give tax or accounting advice.</p>
          </section>
        </article>
      </div>

      <section class="paid-note" aria-labelledby="pro-heading">
        <p class="eyebrow">The long-job edition</p>
        <h2 id="pro-heading">Five slips are free. Keep every job for $19 once.</h2>
        <p>Pro unlocks unlimited on-device history and one-click slip duplication. The split, attachment, CSV, client list, and backups always remain free.</p>
        <button class="secondary-action" id="pro-bottom" type="button">See the one-time unlock</button>
      </section>
    </main>

    <footer>
      <p><strong>Split Cost Slip</strong> · Local-first contractor utility</p>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-split-pass-through-costs">Source</a></nav>
      <p class="fine-print">Original hero artwork generated with the factory image model; no stock imagery. Nothing leaves your device except an optional license check.</p>
    </footer>

    <dialog id="pro-dialog" aria-labelledby="pro-dialog-title">
      <form method="dialog" class="dialog-inner">
        <button class="dialog-close" value="close" aria-label="Close Pro details">×</button>
        <p class="eyebrow">One-time license</p>
        <h2 id="pro-dialog-title">Unlimited slips. $19 once.</h2>
        <p>Archive every mixed bill on this device and duplicate prior splits for repeat suppliers. Core exports, attachments, and backups stay free.</p>
        <a class="primary-action buy-link" href="${BUY_URL}">Buy Pro securely</a>
        <p class="fine-print">Checkout is hosted by Sociobot. Sociobot/Dodo is the merchant of record and handles refunds; a refund revokes the license.</p>
        <hr />
        <label class="field">Have a license? Paste it<input id="license-token" autocomplete="off" /></label>
        <button class="secondary-action" id="restore-license" type="button">Verify and restore</button>
        <button class="text-button" id="remove-license" type="button" ${license.token ? '' : 'hidden'}>Remove this license</button>
        <p id="license-notice" class="margin-note" role="status">${license.notice}</p>
        <p class="fine-print"><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></p>
      </form>
    </dialog>
    <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
  `;
}

function input<T extends HTMLElement>(id: string): T { return document.getElementById(id) as T; }

function fillForm(): void {
  input<HTMLInputElement>('supplier').value = current.supplier;
  input<HTMLInputElement>('reference').value = current.reference;
  input<HTMLInputElement>('client').value = current.client;
  input<HTMLInputElement>('bill-date').value = current.billDate;
  input<HTMLSelectElement>('currency').value = current.currency;
  input<HTMLInputElement>('bill-total').value = current.totalCents ? moneyInput(current.totalCents) : '';
  input<HTMLElement>('slip-number').textContent = current.reference || 'DRAFT';
  input<HTMLElement>('attachment-name').textContent = current.attachment ? `${current.attachment.name} · ${formatBytes(current.attachment.size)}` : 'No attachment yet';
  input<HTMLButtonElement>('view-attachment').hidden = !current.attachment;
  renderRows();
  renderTotals();
}

function formatBytes(bytes: number): string { return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.ceil(bytes / 1000)} KB`; }

function renderRows(): void {
  const container = input<HTMLDivElement>('allocation-rows');
  container.replaceChildren();
  current.allocations.forEach((row, index) => {
    const wrapper = document.createElement('fieldset');
    wrapper.className = 'allocation-row';
    wrapper.innerHTML = `
      <legend>Cost row ${index + 1}</legend>
      <div class="row-identity"><label>Description<input class="row-description" autocomplete="off" /></label><label>Category<input class="row-category" list="category-list" autocomplete="off" /></label></div>
      <label class="treatment-control"><input class="row-billable" type="checkbox" /><span class="switch" aria-hidden="true"></span><span class="treatment-copy"><strong></strong><small></small></span></label>
      <label class="row-amount">Amount<input class="row-amount-input" inputmode="decimal" autocomplete="off" aria-label="Amount for cost row ${index + 1}" /></label>
      <button class="remove-row" type="button" aria-label="Remove cost row ${index + 1}">×</button>`;
    const description = wrapper.querySelector<HTMLInputElement>('.row-description')!;
    const category = wrapper.querySelector<HTMLInputElement>('.row-category')!;
    const billable = wrapper.querySelector<HTMLInputElement>('.row-billable')!;
    const amount = wrapper.querySelector<HTMLInputElement>('.row-amount-input')!;
    description.value = row.description;
    category.value = row.category;
    billable.checked = row.billable;
    amount.value = row.amountCents ? moneyInput(row.amountCents) : '';
    updateTreatment(wrapper, row.billable);
    description.addEventListener('input', () => { row.description = description.value; changed(); });
    category.addEventListener('input', () => { row.category = category.value; changed(); });
    billable.addEventListener('change', () => { row.billable = billable.checked; updateTreatment(wrapper, row.billable); changed(); });
    amount.addEventListener('input', () => {
      const parsed = parseMoney(amount.value);
      amount.setAttribute('aria-invalid', String(parsed === null && amount.value !== ''));
      if (parsed !== null) row.amountCents = parsed;
      changed();
    });
    wrapper.querySelector<HTMLButtonElement>('.remove-row')!.addEventListener('click', () => removeRow(index));
    container.append(wrapper);
  });
  if (!document.getElementById('category-list')) {
    const datalist = document.createElement('datalist');
    datalist.id = 'category-list';
    categorySuggestions.forEach((item) => { const option = document.createElement('option'); option.value = item; datalist.append(option); });
    document.body.append(datalist);
  }
}

function updateTreatment(wrapper: HTMLElement, billable: boolean): void {
  wrapper.classList.toggle('is-billable', billable);
  wrapper.querySelector('.treatment-copy strong')!.textContent = billable ? 'Billable' : 'Overhead';
  wrapper.querySelector('.treatment-copy small')!.textContent = billable ? 'Pass through' : 'Keep internal';
}

function renderTotals(): void {
  const totals = summarize(current.totalCents, current.allocations);
  input('billable-total').textContent = formatMoney(totals.billableCents, current.currency);
  input('overhead-total').textContent = formatMoney(totals.overheadCents, current.currency);
  input('split-total').textContent = formatMoney(totals.splitCents, current.currency);
  input('remaining-total').textContent = formatMoney(Math.abs(totals.remainingCents), current.currency);
  input('currency-prefix').textContent = new Intl.NumberFormat(undefined, { style: 'currency', currency: current.currency }).formatToParts(0).find((part) => part.type === 'currency')?.value || current.currency;
  const row = input('balance-row');
  row.className = `balance-row ${totals.balanced ? 'balanced' : totals.remainingCents < 0 ? 'over' : ''}`;
  input('balance-label').textContent = totals.balanced ? 'Balanced exactly' : totals.remainingCents < 0 ? 'Over-allocated' : 'Still to allocate';
  input('balance-guidance').textContent = totals.balanced
    ? 'Every cent of the source bill is accounted for.'
    : totals.remainingCents < 0
      ? `Reduce rows by ${formatMoney(Math.abs(totals.remainingCents), current.currency)} to match the bill.`
      : current.totalCents ? `Allocate ${formatMoney(totals.remainingCents, current.currency)} more to match the bill.` : 'Enter the bill total and allocations to check the split.';
}

function renderSaved(): void {
  input('saved-count').textContent = String(saved.length);
  input('archive-tier').textContent = license.pro ? 'Pro · unlimited' : `${saved.length}/5 free`;
  const container = input<HTMLDivElement>('saved-list');
  container.replaceChildren();
  if (!saved.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No saved slips yet. Your first balanced bill will appear here.';
    container.append(empty);
    return;
  }
  const list = document.createElement('ol');
  list.className = 'saved-list';
  saved.forEach((slip) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = slip.id === current.id ? 'saved-slip active' : 'saved-slip';
    const title = document.createElement('strong');
    title.textContent = slip.supplier || 'Untitled supplier';
    const meta = document.createElement('span');
    meta.textContent = `${slip.reference || 'No reference'} · ${formatMoney(slip.totalCents, slip.currency)}`;
    const status = summarize(slip.totalCents, slip.allocations);
    const mark = document.createElement('small');
    mark.textContent = `${status.balanced ? 'Balanced' : 'Draft'} · ${new Date(slip.updatedAt).toLocaleDateString()}`;
    button.append(title, meta, mark);
    button.addEventListener('click', () => void openSlip(slip.id));
    item.append(button);
    if (license.pro) {
      const duplicate = document.createElement('button');
      duplicate.className = 'duplicate-slip';
      duplicate.type = 'button';
      duplicate.textContent = 'Duplicate';
      duplicate.addEventListener('click', () => void duplicateSlip(slip));
      item.append(duplicate);
    }
    list.append(item);
  });
  container.append(list);
}

function changed(): void {
  current.updatedAt = now();
  input('save-state').textContent = 'Unsaved changes';
  renderTotals();
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => void saveCurrent(true), 700);
}

async function saveCurrent(silent = false): Promise<boolean> {
  const exists = saved.some((item) => item.id === current.id);
  if (!exists && saved.length >= 5 && !license.pro) {
    input('save-state').textContent = 'Free archive full';
    if (!silent) { showToast('Your five free archive slots are full. Export or delete one, or unlock Pro.'); openPro(); }
    return false;
  }
  if (!current.supplier.trim() && current.totalCents === 0 && current.allocations.every((row) => !row.description && !row.amountCents)) {
    input('save-state').textContent = 'Not saved yet';
    return false;
  }
  await putSlip(current);
  saved = await listSlips();
  input('save-state').textContent = 'Saved locally';
  renderSaved();
  if (!silent) showToast('Slip saved on this device.');
  return true;
}

async function openSlip(id: string): Promise<void> {
  const slip = await getSlip(id);
  if (!slip) return;
  current = slip;
  revokeAttachmentUrl();
  fillForm();
  renderSaved();
  input('split-workspace').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

async function duplicateSlip(slip: Slip): Promise<void> {
  current = { ...structuredClone(slip), id: uid(), reference: '', createdAt: now(), updatedAt: now(), allocations: slip.allocations.map((row) => ({ ...row, id: uid() })), attachment: undefined };
  await saveCurrent();
  fillForm();
}

function removeRow(index: number): void {
  const [removed] = current.allocations.splice(index, 1);
  renderRows(); changed();
  showToast('Cost row removed.', 'Undo', () => { current.allocations.splice(index, 0, removed); renderRows(); changed(); });
}

function showToast(text: string, action?: string, callback?: () => void): void {
  const toast = input<HTMLDivElement>('toast');
  window.clearTimeout(messageTimer);
  toast.replaceChildren(document.createTextNode(text));
  if (action && callback) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = action; button.addEventListener('click', () => { callback(); toast.hidden = true; }); toast.append(button);
  }
  toast.hidden = false;
  messageTimer = window.setTimeout(() => { toast.hidden = true; }, 6000);
}

function baseName(): string { return `${(current.supplier || 'supplier').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${current.reference || current.billDate}`; }
function reducedMotion(): boolean { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
function openPro(): void { input<HTMLDialogElement>('pro-dialog').showModal(); }
function revokeAttachmentUrl(): void { if (attachmentUrl) URL.revokeObjectURL(attachmentUrl); attachmentUrl = ''; }

function wireEvents(): void {
  const bindText = (id: string, key: 'supplier' | 'reference' | 'client') => input<HTMLInputElement>(id).addEventListener('input', (event) => { current[key] = (event.target as HTMLInputElement).value; if (key === 'reference') input('slip-number').textContent = current.reference || 'DRAFT'; changed(); });
  bindText('supplier', 'supplier'); bindText('reference', 'reference'); bindText('client', 'client');
  input<HTMLInputElement>('bill-date').addEventListener('change', (event) => { current.billDate = (event.target as HTMLInputElement).value; changed(); });
  input<HTMLSelectElement>('currency').addEventListener('change', (event) => { current.currency = (event.target as HTMLSelectElement).value as Currency; changed(); });
  input<HTMLInputElement>('bill-total').addEventListener('input', (event) => {
    const field = event.target as HTMLInputElement; const parsed = parseMoney(field.value); field.setAttribute('aria-invalid', String(parsed === null && field.value !== ''));
    if (parsed !== null) current.totalCents = parsed; changed();
  });
  input('add-row').addEventListener('click', () => { current.allocations.push(newRow()); renderRows(); changed(); document.querySelector<HTMLInputElement>('.allocation-row:last-child .row-description')?.focus(); });
  input('save-slip').addEventListener('click', () => void saveCurrent());
  input('start-split').addEventListener('click', () => { input('split-workspace').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); input<HTMLInputElement>('supplier').focus({ preventScroll: true }); });
  input('new-slip').addEventListener('click', () => { current = newSlip(); revokeAttachmentUrl(); fillForm(); renderSaved(); input<HTMLInputElement>('supplier').focus(); });
  input('saved-toggle').addEventListener('click', () => { const archive = input<HTMLElement>('archive'); archive.hidden = !archive.hidden; input('saved-toggle').setAttribute('aria-expanded', String(!archive.hidden)); if (!archive.hidden) input<HTMLButtonElement>('new-slip').focus(); });
  input<HTMLInputElement>('attachment').addEventListener('change', (event) => void handleAttachment((event.target as HTMLInputElement).files?.[0]));
  input('view-attachment').addEventListener('click', () => void viewAttachment());
  input('export-csv').addEventListener('click', () => { downloadText(slipCsv(current), `${baseName()}-split.csv`, 'text/csv;charset=utf-8'); showToast('CSV exported.'); });
  input('copy-client').addEventListener('click', () => void navigator.clipboard.writeText(clientLineList(current)).then(() => showToast('Client line list copied.')).catch(() => showToast('Clipboard is unavailable. Use Print client list instead.')));
  input('print-client').addEventListener('click', () => printClientList());
  input('delete-slip').addEventListener('click', () => void deleteCurrent());
  input('backup-export').addEventListener('click', () => void exportBackup().then((data) => downloadText(data, `split-cost-slip-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')));
  input<HTMLInputElement>('backup-import').addEventListener('change', (event) => void handleBackup((event.target as HTMLInputElement).files?.[0]));
  input('pro-open').addEventListener('click', openPro); input('pro-bottom').addEventListener('click', openPro);
  input('restore-license').addEventListener('click', () => void handleRestore());
  input('remove-license').addEventListener('click', () => { removeLicense(); location.reload(); });
  window.addEventListener('online', updateConnection); window.addEventListener('offline', updateConnection);
}

async function handleAttachment(file?: File): Promise<void> {
  if (!file) return;
  if (file.size > 10_000_000) { showToast('That file is over 10 MB. Choose a smaller photo or PDF.'); return; }
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { showToast('Choose an image or PDF supplier bill.'); return; }
  await putAttachment(current.id, file);
  current.attachment = { name: file.name, type: file.type, size: file.size };
  input('attachment-name').textContent = `${file.name} · ${formatBytes(file.size)}`;
  input<HTMLButtonElement>('view-attachment').hidden = false;
  changed(); showToast('Source bill attached locally.');
}

async function viewAttachment(): Promise<void> {
  const blob = await getAttachment(current.id);
  if (!blob) { showToast('The attachment file is missing from this device. Reattach it to this slip.'); return; }
  revokeAttachmentUrl(); attachmentUrl = URL.createObjectURL(blob); window.open(attachmentUrl, '_blank', 'noopener,noreferrer');
}

async function deleteCurrent(): Promise<void> {
  const label = current.supplier || 'this unsaved slip';
  if (!confirm(`Delete ${label}? This removes its local attachment too and cannot be undone.`)) return;
  await deleteSlip(current.id); saved = await listSlips(); current = newSlip(); fillForm(); renderSaved(); showToast('Slip and its local attachment deleted.');
}

async function handleBackup(file?: File): Promise<void> {
  if (!file) return;
  try { const count = await importBackup(await file.text()); saved = await listSlips(); renderSaved(); showToast(`${count} ${count === 1 ? 'slip' : 'slips'} imported.`); }
  catch (error) { showToast(error instanceof Error ? error.message : 'Could not import that backup.'); }
}

async function handleRestore(): Promise<void> {
  try { restoreLicense(input<HTMLInputElement>('license-token').value); input('license-notice').textContent = 'Checking license…'; license = await loadLicense(); if (license.pro) location.reload(); else input('license-notice').textContent = license.notice || 'That license could not be verified.'; }
  catch (error) { input('license-notice').textContent = error instanceof Error ? error.message : 'Could not restore the license.'; }
}

function printClientList(): void {
  const text = clientLineList(current);
  const frame = document.createElement('iframe'); frame.className = 'print-frame'; frame.title = 'Client line list print view'; document.body.append(frame);
  const doc = frame.contentDocument!; doc.open(); doc.write(`<!doctype html><html lang="en"><head><title>Pass-through costs</title><style>body{font:16px Georgia,serif;max-width:760px;margin:48px auto;white-space:pre-wrap;line-height:1.6} @media print{body{margin:20mm}}</style></head><body></body></html>`); doc.close(); doc.body.textContent = text;
  frame.contentWindow?.focus(); frame.contentWindow?.print(); setTimeout(() => frame.remove(), 1000);
}

function updateConnection(): void {
  input('connection-text').textContent = navigator.onLine ? 'Online' : 'Offline — ready to keep working';
  document.body.classList.toggle('is-offline', !navigator.onLine);
}

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let announced = false;
    await navigator.serviceWorker.register('/sw.js');
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !announced) {
        announced = true;
        showToast('A fresh edition is ready.', 'Reload', () => location.reload());
      }
    });
  } catch { showToast('Offline setup is unavailable in this browser. Your saved slips still stay local.'); }
}

async function init(): Promise<void> {
  license = await loadLicense(); shell(); wireEvents();
  try { saved = await listSlips(); if (saved[0]) current = saved[0]; }
  catch { showToast('Local storage could not be opened. Check private browsing or storage permissions.'); }
  fillForm(); renderSaved(); updateConnection(); void registerServiceWorker();
}

void init();
