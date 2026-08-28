import type { Slip } from './types';

const DB_NAME = 'split-cost-slip';
const DB_VERSION = 1;
const SLIPS = 'slips';
const FILES = 'attachments';

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SLIPS)) db.createObjectStore(SLIPS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listSlips(): Promise<Slip[]> {
  const db = await openDatabase();
  const result = await requestResult(db.transaction(SLIPS).objectStore(SLIPS).getAll()) as Slip[];
  db.close();
  return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getSlip(id: string): Promise<Slip | undefined> {
  const db = await openDatabase();
  const result = await requestResult(db.transaction(SLIPS).objectStore(SLIPS).get(id)) as Slip | undefined;
  db.close();
  return result;
}

export async function putSlip(slip: Slip): Promise<void> {
  const db = await openDatabase();
  await requestResult(db.transaction(SLIPS, 'readwrite').objectStore(SLIPS).put(slip));
  db.close();
}

export async function deleteSlip(id: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([SLIPS, FILES], 'readwrite');
  tx.objectStore(SLIPS).delete(id);
  tx.objectStore(FILES).delete(id);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function putAttachment(id: string, file: File): Promise<void> {
  const db = await openDatabase();
  await requestResult(db.transaction(FILES, 'readwrite').objectStore(FILES).put(file, id));
  db.close();
}

export async function getAttachment(id: string): Promise<Blob | undefined> {
  const db = await openDatabase();
  const result = await requestResult(db.transaction(FILES).objectStore(FILES).get(id)) as Blob | undefined;
  db.close();
  return result;
}

export async function exportBackup(): Promise<string> {
  return JSON.stringify({ format: 'split-cost-slip', version: 1, exportedAt: new Date().toISOString(), slips: await listSlips() }, null, 2);
}

export async function importBackup(raw: string): Promise<number> {
  const parsed = JSON.parse(raw) as { format?: string; version?: number; slips?: unknown };
  if (parsed.format !== 'split-cost-slip' || parsed.version !== 1 || !Array.isArray(parsed.slips)) {
    throw new Error('This is not a Split Cost Slip backup.');
  }
  let count = 0;
  for (const candidate of parsed.slips) {
    const slip = candidate as Partial<Slip>;
    if (!slip.id || !Array.isArray(slip.allocations) || typeof slip.totalCents !== 'number') continue;
    await putSlip(slip as Slip);
    count += 1;
  }
  return count;
}
