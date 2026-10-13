import type { ModeId } from "./content";

export type RunResult = {
  mode: ModeId;
  kps: number;
  peakKps: number;
  accuracy: number;
  combo: number;
  keys: number;
  misses: number;
  kana: number;
  seconds: number;
  improved: boolean;
};

export function formatKps(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0.0";
  return n.toFixed(1);
}

export function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n)}%`;
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  if (m <= 0) return `${r.toFixed(1)}s`;
  return `${m}:${r.toFixed(1).padStart(4, "0")}`;
}
