export interface ExtractedLine {
  description: string;
  amount: string;
}

export interface BillSuggestions {
  supplier: string;
  reference: string;
  billDate: string;
  currency: string;
  total: string;
  lines: ExtractedLine[];
}

const GATEWAY = 'https://api.sociobot.in/v1';
const currencies = new Set(['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'INR']);

export const demoSuggestions = (): BillSuggestions => ({
  supplier: 'Sunrise Building Supply',
  reference: 'SBS-48192',
  billDate: '2026-08-21',
  currency: 'USD',
  total: '1287.50',
  lines: [
    { description: 'Cabinet plywood', amount: '864.00' },
    { description: 'Delivery to workshop', amount: '128.50' },
    { description: 'Fasteners for install', amount: '295.00' },
  ],
});

function textFromResponse(response: unknown): string {
  if (!response || typeof response !== 'object') return '';
  const body = response as { output_text?: unknown; output?: unknown };
  if (typeof body.output_text === 'string') return body.output_text;
  if (!Array.isArray(body.output)) return '';
  return body.output.flatMap((item) => {
    if (!item || typeof item !== 'object' || !Array.isArray((item as { content?: unknown }).content)) return [];
    return ((item as { content: unknown[] }).content).flatMap((part) => {
      if (!part || typeof part !== 'object') return [];
      const text = (part as { text?: unknown }).text;
      return typeof text === 'string' ? [text] : [];
    });
  }).join('');
}

function parseSuggestions(raw: string): BillSuggestions {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let value: unknown;
  try {
    value = JSON.parse(cleaned);
  } catch {
    throw new Error('Sociobot returned bill details in an unreadable format. Enter the bill manually or try again.');
  }
  if (!value || typeof value !== 'object') throw new Error('Sociobot did not return bill details. Enter the bill manually or try again.');
  const bill = value as Partial<BillSuggestions>;
  const strings = [bill.supplier, bill.reference, bill.billDate, bill.currency, bill.total];
  const validLines = Array.isArray(bill.lines) && bill.lines.length > 0 && bill.lines.every((line) => line && typeof line.description === 'string' && typeof line.amount === 'string');
  if (!strings.every((part) => typeof part === 'string') || !currencies.has(bill.currency || '') || !validLines) {
    throw new Error('Sociobot returned incomplete bill details. Enter the bill manually or try again.');
  }
  return {
    supplier: bill.supplier!,
    reference: bill.reference!,
    billDate: bill.billDate!,
    currency: bill.currency!,
    total: bill.total!,
    lines: bill.lines!.map((line) => ({ description: line.description.trim(), amount: line.amount.trim() })),
  };
}

const fileDataUrl = (file: Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('The attachment could not be read. Attach it again.'));
  reader.readAsDataURL(file);
});

async function streamedText(response: Response, progress: (message: string) => void): Promise<string> {
  if (!response.body) return textFromResponse(await response.json());
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = '';
  let completed = '';
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = buffer.split('\n\n');
    buffer = done ? '' : events.pop() || '';
    for (const event of events) {
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        let item: unknown;
        try { item = JSON.parse(data); } catch { continue; }
        const eventData = item as { type?: unknown; delta?: unknown; response?: unknown };
        if (eventData.type === 'response.output_text.delta' && typeof eventData.delta === 'string') {
          result += eventData.delta;
          progress('Receiving editable bill details…');
        }
        if (eventData.type === 'response.completed') completed = textFromResponse(eventData.response);
      }
    }
    if (done) break;
  }
  return completed || result;
}

export async function extractBill(file: Blob, filename: string, type: string, key: string, progress: (message: string) => void): Promise<BillSuggestions> {
  progress('Checking available Sociobot models…');
  const headers = { Authorization: `Bearer ${key}` };
  const modelsResponse = await fetch(`${GATEWAY}/models`, { headers });
  if (!modelsResponse.ok) throw new Error('Sociobot could not verify that key. Check the key and try again.');
  const models = await modelsResponse.json() as { data?: Array<{ id?: string }> };
  const model = models.data?.map((item) => item.id).find((id): id is string => Boolean(id?.startsWith('gpt-5.6-')));
  if (!model) throw new Error('No compatible Sociobot text model is available. Enter the bill manually.');

  progress('Sending the named attachment to Sociobot…');
  const dataUrl = await fileDataUrl(file);
  const attachment = type.startsWith('image/')
    ? { type: 'input_image', image_url: dataUrl, detail: 'high' }
    : { type: 'input_file', filename, file_data: dataUrl };
  const response = await fetch(`${GATEWAY}/responses`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: 'Extract factual supplier bill fields only. Return JSON with supplier, reference, billDate as YYYY-MM-DD, currency as USD/GBP/EUR/CAD/AUD/INR, total with two decimals, and lines containing description and amount strings. Do not infer categories, clients, tax treatment, billable status, or overhead status.' }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: `Extract editable bill details from the attached supplier bill named ${filename}.` }, attachment],
        },
      ],
    }),
  });
  if (!response.ok) throw new Error('Sociobot could not read that attachment. Enter the bill manually or try again.');
  return parseSuggestions(await streamedText(response, progress));
}
