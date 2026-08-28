import { describe, expect, it } from 'vitest';
import { escapeCsv, parseMoney, summarize } from './money';

describe('deterministic money', () => {
  it('parses decimal amounts into integer cents', () => {
    expect(parseMoney('1,234.5')).toBe(123450);
    expect(parseMoney('0.01')).toBe(1);
    expect(parseMoney('12.345')).toBeNull();
    expect(parseMoney('-1')).toBeNull();
  });

  it('balances without floating point drift', () => {
    const rows = [
      { id: '1', description: '', category: '', amountCents: 10, billable: true },
      { id: '2', description: '', category: '', amountCents: 20, billable: false },
    ];
    expect(summarize(30, rows)).toEqual({ splitCents: 30, billableCents: 10, overheadCents: 20, remainingCents: 0, balanced: true });
  });

  it('escapes spreadsheet cells safely', () => {
    expect(escapeCsv('fuel, tax')).toBe('"fuel, tax"');
    expect(escapeCsv('say "yes"')).toBe('"say ""yes"""');
  });
});
