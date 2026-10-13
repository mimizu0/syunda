import type { ModeId } from "./content";

const KEY = "shunda-records-v1";
const VERSION = 1;

export type ModeBest = {
  kps: number;
  accuracy: number;
  combo: number;
  keys: number;
  at: number;
};

export type Records = {
  version: number;
  best: Partial<Record<ModeId, ModeBest>>;
};

const empty: Records = { version: VERSION, best: {} };

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadRecords(): Records {
  if (!canUseStorage()) return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Records;
    if (!parsed || parsed.version !== VERSION || typeof parsed.best !== "object") {
      return empty;
    }
    return { version: VERSION, best: parsed.best ?? {} };
  } catch {
    return empty;
  }
}

export function saveBest(mode: ModeId, run: ModeBest): { records: Records; improved: boolean } {
  const records = loadRecords();
  const prev = records.best[mode];
  const improved = !prev || run.kps > prev.kps;
  if (improved) {
    records.best[mode] = run;
    if (canUseStorage()) {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(records));
      } catch {
        /* private mode / quota */
      }
    }
  }
  return { records, improved };
}
