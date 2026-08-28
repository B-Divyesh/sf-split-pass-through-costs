export type Currency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'INR';

export interface Allocation {
  id: string;
  description: string;
  category: string;
  amountCents: number;
  billable: boolean;
}

export interface AttachmentMeta {
  name: string;
  type: string;
  size: number;
}

export interface Slip {
  id: string;
  supplier: string;
  reference: string;
  client: string;
  billDate: string;
  currency: Currency;
  totalCents: number;
  notes: string;
  allocations: Allocation[];
  attachment?: AttachmentMeta;
  createdAt: string;
  updatedAt: string;
}
