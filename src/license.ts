const SLUG = 'split-pass-through-costs';
const KEY = `sb_license:${SLUG}`;
const CACHE_KEY = `${KEY}:verdict`;
const DAY = 86_400_000;

export interface LicenseState {
  token: string | null;
  pro: boolean;
  notice: string;
}

export const BUY_URL = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

function saveTokenFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(KEY, token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function restoreLicense(token: string): void {
  const clean = token.trim();
  if (!clean) throw new Error('Paste the license token from your purchase email.');
  localStorage.setItem(KEY, clean);
  localStorage.removeItem(CACHE_KEY);
}

export function removeLicense(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(CACHE_KEY);
}

export async function loadLicense(): Promise<LicenseState> {
  saveTokenFromUrl();
  const token = localStorage.getItem(KEY);
  if (!token) return { token: null, pro: false, notice: '' };

  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') as { valid?: boolean; checkedAt?: number } | null;
  const optimistic = cached?.valid === true;
  if (cached?.checkedAt && Date.now() - cached.checkedAt < DAY) {
    return { token, pro: optimistic, notice: cached.valid ? '' : 'License no longer active.' };
  }

  if (!navigator.onLine) return { token, pro: optimistic, notice: optimistic ? '' : 'License check will resume when online.' };
  try {
    const url = `https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('verification unavailable');
    const verdict = await response.json() as { valid: boolean };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    return { token, pro: verdict.valid, notice: verdict.valid ? '' : 'License no longer active.' };
  } catch {
    return { token, pro: optimistic, notice: optimistic ? '' : 'Could not refresh the license; free tools still work.' };
  }
}
