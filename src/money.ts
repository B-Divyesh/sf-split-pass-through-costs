import type { Allocation, Currency } from './types';

export function parseMoney(value: string): number | null {
  const cleaned = value.trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{0,2})?$/.test(cleaned)) return null;
  const [whole, decimal = ''] = cleaned.split('.');
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function moneyInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatMoney(cents: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
}

export function summarize(totalCents: number, allocations: Allocation[]) {
  const splitCents = allocations.reduce((sum, item) => sum + item.amountCents, 0);
  const billableCents = allocations.filter((item) => item.billable).reduce((sum, item) => sum + item.amountCents, 0);
  return {
    splitCents,
    billableCents,
    overheadCents: splitCents - billableCents,
    remainingCents: totalCents - splitCents,
    balanced: totalCents > 0 && totalCents === splitCents,
  };
}

export function escapeCsv(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
