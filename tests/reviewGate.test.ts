import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import {
  REVIEW_LS_KEY,
  REVIEW_TTL_MS,
  safeParse,
  loadStore,
  saveStore,
  pruneStore,
  makeKey,
  makeGroupKey,
  getBlockedUntil,
  recordSubmission,
  msToCompact,
} from '../utils/reviewGate';

// Simple in-memory localStorage mock
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  length = 0;
  clear(): void {
    this.store.clear();
    this.length = 0;
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }
  removeItem(key: string): void {
    if (this.store.delete(key)) this.length = this.store.size;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
    this.length = this.store.size;
  }
}

const FIXED_NOW = new Date('2025-08-12T10:00:00Z').getTime();
let originalNow: () => number;

const setGlobalLS = (storage: Storage) => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });
};

const setGlobalWindow = (win: object) => {
  Object.defineProperty(globalThis, 'window', {
    value: win,
    configurable: true,
    writable: true,
  });
};

beforeEach(() => {
  // Ensure window and localStorage exist for the util
  setGlobalWindow({});
  setGlobalLS(new MemoryStorage());
  // Freeze time
  originalNow = Date.now;
  Date.now = () => FIXED_NOW;
});

afterEach(() => {
  // Cleanup
  // reset to undefined removes the properties
  setGlobalWindow(undefined as unknown as object);
  setGlobalLS(undefined as unknown as Storage);
  Date.now = originalNow;
});

describe('safeParse', () => {
  it('returns empty object for null/invalid', () => {
    expect(safeParse(null as unknown as string)).toEqual({});
    expect(safeParse('not json')).toEqual({});
  });
  it('parses valid JSON object', () => {
    expect(safeParse('{"a":123}')).toEqual({ a: 123 });
  });
});

describe('load/save/prune', () => {
  it('saves and loads store', () => {
    const store = { k1: FIXED_NOW - 1000, k2: FIXED_NOW - 2000 };
    saveStore(store);
    const loaded = loadStore();
    expect(loaded).toEqual(store);
  });

  it('prunes expired entries by TTL', () => {
    const store = {
      fresh: FIXED_NOW - (24 * 60 * 60 * 1000), // 1 day ago
      old: FIXED_NOW - (8 * 24 * 60 * 60 * 1000), // 8 days ago
    } as Record<string, number>;
    const pruned = pruneStore(store, REVIEW_TTL_MS, FIXED_NOW);
    expect(pruned).toHaveProperty('fresh');
    expect(pruned).not.toHaveProperty('old');
  });
});

describe('key builders', () => {
  it('makeKey builds exact combo key and supports venue scoping', () => {
    const k1 = makeKey('Latte', 'Large', 'Oat');
    expect(k1).toBe('ct:Latte|sz:Large|mk:Oat');
    const k2 = makeKey('Latte', 'Large', 'Oat', { includeVenue: true, venueId: 42 });
    expect(k2).toBe('ct:Latte|sz:Large|mk:Oat|v:42');
  });

  it('makeGroupKey builds group key, includes size optionally and venue scoping', () => {
    const k1 = makeGroupKey('standard', 'alternative');
    expect(k1).toBe('ctg:standard|mkg:alternative');
    const k2 = makeGroupKey('specialty', 'standard', 'Regular');
    expect(k2).toBe('ctg:specialty|mkg:standard|sz:Regular');
    const k3 = makeGroupKey('specialty', 'standard', 'Regular', { includeVenue: true, venueId: 'abc' });
    expect(k3).toBe('ctg:specialty|mkg:standard|sz:Regular|v:abc');
  });
});

describe('blocking and recording', () => {
  it('returns null when no record exists', () => {
    const key = makeGroupKey('standard', 'alternative', 'Large', { includeVenue: true, venueId: 1 });
    expect(getBlockedUntil(key)).toBeNull();
  });

  it('records submission and reports remaining block time', () => {
    const key = makeGroupKey('standard', 'alternative', 'Large', { includeVenue: true, venueId: 1 });
    recordSubmission(key);
    const until = getBlockedUntil(key);
    expect(until).not.toBeNull();
    // Should be exactly FIXED_NOW + TTL when recorded now
    expect(until).toBe(FIXED_NOW + REVIEW_TTL_MS);
  });

  it('expires old records and prunes storage', () => {
    const key = makeGroupKey('specialty', 'standard', 'Small', { includeVenue: true, venueId: 9 });
    // Manually seed an old record
    const seeded = { [key]: FIXED_NOW - (8 * 24 * 60 * 60 * 1000) };
  localStorage.setItem(REVIEW_LS_KEY, JSON.stringify(seeded));

    const until = getBlockedUntil(key);
    expect(until).toBeNull();
    // Store should be pruned to remove the expired key
  const raw = localStorage.getItem(REVIEW_LS_KEY);
  const after = raw ? JSON.parse(raw) : {};
  expect(after[key as string]).toBeUndefined();
  });
});

describe('msToCompact', () => {
  it('formats days and hours', () => {
    const twoDaysThreeHours = (2 * 24 + 3) * 60 * 60 * 1000;
    expect(msToCompact(twoDaysThreeHours)).toBe('2d 3h');
  });
  it('formats hours and minutes', () => {
    const threeHours45 = (3 * 60 + 45) * 60 * 1000;
    expect(msToCompact(threeHours45)).toBe('3h 45m');
  });
  it('formats minutes only', () => {
    const fiftyMin = 50 * 60 * 1000;
    expect(msToCompact(fiftyMin)).toBe('50m');
  });
});
