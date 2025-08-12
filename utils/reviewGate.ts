// Client-side localStorage based submission gate for coffee reviews
// Blocks re-submission of the same combo for a TTL window

export const REVIEW_LS_KEY = 'coffee-spy:review-submissions:v1';
export const REVIEW_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

export type ReviewStore = Record<string, number>; // key -> createdAt (ms)

const nowMs = () => Date.now();

export const safeParse = (s: string | null): ReviewStore => {
  try {
    if (!s) return {};
    const obj = JSON.parse(s);
    return typeof obj === 'object' && obj ? (obj as ReviewStore) : {};
  } catch {
    return {};
  }
};

export const loadStore = (): ReviewStore => {
  if (typeof window === 'undefined') return {};
  return safeParse(localStorage.getItem(REVIEW_LS_KEY));
};

export const saveStore = (store: ReviewStore) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEW_LS_KEY, JSON.stringify(store));
  } catch {
    // storage quota or disabled; ignore silently
  }
};

export const pruneStore = (store: ReviewStore, ttlMs = REVIEW_TTL_MS, now = nowMs()): ReviewStore => {
  const next: ReviewStore = {};
  for (const [k, createdAt] of Object.entries(store)) {
    if (now - createdAt < ttlMs) next[k] = createdAt;
  }
  return next;
};

// Build a key for a review combo
// Set includeVenue=true to scope to a specific venue
export const makeKey = (
  coffeeType: string,
  coffeeSize: string,
  coffeeMilkType: string,
  opts?: { venueId?: number | string; includeVenue?: boolean }
) => {
  const base = `ct:${coffeeType}|sz:${coffeeSize}|mk:${coffeeMilkType}`;
  if (opts?.includeVenue && opts.venueId != null) return `${base}|v:${opts.venueId}`;
  return base;
};

// Build a key for a review combo based on groups (ignores size)
export const makeGroupKey = (
  coffeeGroup: 'standard' | 'specialty' | string,
  milkGroup: 'standard' | 'alternative' | string,
  size?: string,
  opts?: { venueId?: number | string; includeVenue?: boolean }
) => {
  const base = `ctg:${coffeeGroup}|mkg:${milkGroup}${size ? `|sz:${size}` : ''}`;
  if (opts?.includeVenue && opts.venueId != null) return `${base}|v:${opts.venueId}`;
  return base;
};

export const getBlockedUntil = (key: string, ttlMs = REVIEW_TTL_MS): number | null => {
  const store = pruneStore(loadStore(), ttlMs);
  saveStore(store);
  const createdAt = store[key];
  if (!createdAt) return null;
  const until = createdAt + ttlMs;
  return until > nowMs() ? until : null;
};

export const recordSubmission = (key: string, at = nowMs(), ttlMs = REVIEW_TTL_MS) => {
  const store = pruneStore(loadStore(), ttlMs);
  store[key] = at;
  saveStore(store);
};

export const msToCompact = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
};
