import { escapeCsv, formatMoney } from './money';
import type { Slip } from './types';

function safeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function slipCsv(slip: Slip): string {
  const header = ['Supplier', 'Bill reference', 'Bill date', 'Client', 'Description', 'User-selected category', 'Treatment', 'Amount', 'Currency'];
  const rows = slip.allocations.map((row) => [
    safeCell(slip.supplier),
    safeCell(slip.reference),
    slip.billDate,
    safeCell(slip.client),
    safeCell(row.description),
    safeCell(row.category),
    row.billable ? 'Billable' : 'Overhead',
    (row.amountCents / 100).toFixed(2),
    slip.currency,
  ]);
  return [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n');
}

export function clientLineList(slip: Slip): string {
  const billable = slip.allocations.filter((row) => row.billable);
  const lines = [
    `PASS-THROUGH COSTS${slip.client ? ` — ${slip.client}` : ''}`,
    `${slip.supplier || 'Supplier'}${slip.reference ? ` · Bill ${slip.reference}` : ''}${slip.billDate ? ` · ${slip.billDate}` : ''}`,
    '',
    ...billable.map((row) => `${row.description || 'Unlabelled cost'}${row.category ? ` (${row.category})` : ''}\t${formatMoney(row.amountCents, slip.currency)}`),
    '',
    `CLIENT REIMBURSEMENT TOTAL\t${formatMoney(billable.reduce((sum, row) => sum + row.amountCents, 0), slip.currency)}`,
    '',
    'Categories and billable treatment were selected by the user and are not tax advice.',
  ];
  return lines.join('\n');
}

export function downloadText(contents: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
