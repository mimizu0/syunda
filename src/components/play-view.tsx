import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { MODE_META, kanaCount, pickItem, readingOf, type ModeId, type PromptItem } from "@/lib/content";
import { analyze, normalizeReading, preferredRomaji } from "@/lib/romaji";
import { saveBest, type ModeBest } from "@/lib/records";
import type { RunResult } from "@/lib/game";
import { formatKps, formatPct } from "@/lib/game";
import { RubyPrompt } from "@/components/ruby-prompt";
import { Button } from "@/components/ui/button";
import { TypingCapture, type TypingCaptureHandle } from "@/components/typing-capture";
import { cn } from "@/lib/utils";

type Props = {
  mode: ModeId;
  onQuit: () => void;
  onFinish: (result: RunResult) => void;
};

type Hud = {
  kps: number;
  remaining: number | null;
  elapsed: number;
  accuracy: number;
  combo: number;
  armed: boolean;
};

export function PlayView({ mode, onQuit, onFinish }: Props) {
  const meta = MODE_META[mode];
  const captureRef = useRef<TypingCaptureHandle>(null);
  const liveRef = useRef(false);
  const recent = useRef<PromptItem[]>([]);
  const itemRef = useRef<PromptItem>(pickItem(mode));
  const typedRef = useRef("");
  const stats = useRef({
    keys: 0,
    misses: 0,
    combo: 0,
    maxCombo: 0,
    kana: 0,
    start: 0,
    peakKps: 0,
    times: [] as number[],
    running: false,
    finished: false,
  });

  const [live, setLive] = useState(false);
  const [item, setItem] = useState<PromptItem>(itemRef.current);
  const [typed, setTyped] = useState("");
  const [missTick, setMissTick] = useState(0);
  const [imeWarn, setImeWarn] = useState(false);
  const [viewport, setViewport] = useState({ height: 0, offsetTop: 0 });
  const [hud, setHud] = useState<Hud>({
    kps: 0,
    remaining: meta.seconds,
    elapsed: 0,
    accuracy: 100,
    combo: 0,
    armed: true,
  });

  const reading = normalizeReading(readingOf(item));
  const analysis = analyze(reading, typed);
  const targetRomaji = preferredRomaji(reading);

  const finish = useCallback(() => {
    const s = stats.current;
    if (s.finished) return;
    s.finished = true;
    s.running = false;
    liveRef.current = false;
    const now = performance.now();
    const seconds = s.start ? Math.max(0.001, (now - s.start) / 1000) : 0.001;
    const kps = s.keys / seconds;
    const accuracy = s.keys ? ((s.keys - s.misses) / s.keys) * 100 : 100;
    const run: ModeBest = {
      kps,
      accuracy,
      combo: s.maxCombo,
      keys: s.keys,
      at: Date.now(),
    };
    const { improved } = s.keys > 0 ? saveBest(mode, run) : { improved: false };
    onFinish({
      mode,
      kps,
      peakKps: Math.max(s.peakKps, kps),
      accuracy,
      combo: s.maxCombo,
      keys: s.keys,
      misses: s.misses,
      kana: s.kana,
      seconds,
      improved,
    });
  }, [mode, onFinish]);

  useEffect(() => {
    const sync = () => {
      const vv = window.visualViewport;
      setViewport({
        height: vv?.height ?? window.innerHeight,
        offsetTop: vv?.offsetTop ?? 0,
      });
    };
    sync();
    window.visualViewport?.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const loop = (now: number) => {
      const s = stats.current;
      if (s.running && !s.finished) {
        const elapsed = (now - s.start) / 1000;
        s.times = s.times.filter((t) => now - t <= 2000);
        const windowSec = Math.min(2, Math.max(elapsed, 0.2));
        const liveKps = s.times.length / windowSec;
        if (liveKps > s.peakKps) s.peakKps = liveKps;
        const remaining = meta.seconds == null ? null : Math.max(0, meta.seconds - elapsed);
        const accuracy = s.keys ? ((s.keys - s.misses) / s.keys) * 100 : 100;
        setHud({
          kps: liveKps,
          remaining,
          elapsed,
          accuracy,
          combo: s.combo,
          armed: false,
        });
        if (remaining !== null && remaining <= 0) {
          finish();
          return;
        }
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [finish, meta.seconds]);

  const focusInput = useCallback(() => {
    captureRef.current?.focus();
  }, []);

  const begin = useCallback(() => {
    liveRef.current = true;
    setLive(true);
    setHud((h) => ({ ...h, armed: false }));
    captureRef.current?.focus();
  }, []);

  const applyChar = useCallback(
    (chRaw: string) => {
      const s = stats.current;
      if (s.finished || !liveRef.current) return;

      const now = performance.now();
      if (!s.running) {
        s.running = true;
        s.start = now;
      }
      s.keys += 1;
      s.times.push(now);
      setImeWarn(false);

      const ch = chRaw.toLowerCase();
      const currentItem = itemRef.current;
      const currentReading = normalizeReading(readingOf(currentItem));
      const next = typedRef.current + ch;
      const result = analyze(currentReading, next);
      if (result.status === "mismatch") {
        s.misses += 1;
        s.combo = 0;
        setMissTick((n) => n + 1);
        try {
          navigator.vibrate?.(12);
        } catch {
          /* ignore */
        }
        return;
      }

      s.combo += 1;
      s.maxCombo = Math.max(s.maxCombo, s.combo);
      typedRef.current = next;
      setTyped(next);

      if (!result.complete) return;

      s.kana += kanaCount(currentItem);
      if (mode === "long") {
        finish();
        return;
      }
      recent.current = [...recent.current, currentItem].slice(-8);
      const nxt = pickItem(mode, recent.current);
      itemRef.current = nxt;
      typedRef.current = "";
      setItem(nxt);
      setTyped("");
    },
    [finish, mode],
  );

  const backspace = useCallback(() => {
    if (stats.current.finished || !typedRef.current) return;
    typedRef.current = typedRef.current.slice(0, -1);
    setTyped(typedRef.current);
  }, []);

  useEffect(() => {
    if (!live) return;
    focusInput();
  }, [focusInput, live, item]);

  const height = viewport.height || undefined;
  const shownTyped = typed.length > 14 ? typed.slice(-14) : typed;
  const shownRest = analysis.restHint.slice(0, 18);
  const timeLabel =
    hud.remaining == null
      ? hud.armed && !live
        ? "完走"
        : hud.elapsed > 0
          ? hud.elapsed.toFixed(1)
          : "0.0"
      : hud.remaining.toFixed(1);

  return (
    <div
      className="fixed inset-x-0 flex flex-col overflow-hidden bg-bg"
      data-play="1"
      data-romaji={targetRomaji}
      style={{
        top: viewport.offsetTop,
        height: height ?? "100dvh",
      }}
    >
      <header className="relative z-20 flex items-center gap-2 px-3 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md text-muted"
          onClick={() => {
            liveRef.current = false;
            onQuit();
          }}
          aria-label="やめる"
        >
          <X className="size-5" />
        </button>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 font-mono tabular-nums">
          <HudCell label={meta.seconds == null ? "TIME" : "LEFT"} value={timeLabel} />
          <HudCell label="KPS" value={formatKps(hud.kps)} accent />
          <HudCell label="ACC" value={formatPct(hud.accuracy)} />
        </div>
      </header>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-3 pt-4"
        onClick={() => {
          if (liveRef.current) focusInput();
        }}
        onKeyDown={() => undefined}
        role="presentation"
      >
        <div className="relative z-[2] flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
          <RubyPrompt item={item} kanaUsed={analysis.kanaUsed} compact={mode !== "word"} />
        </div>

        <div
          key={missTick}
          className={cn(
            "relative z-[2] mt-4 min-h-11 text-center font-mono text-xl tracking-[0.18em]",
            missTick > 0 && "shake",
          )}
        >
          {typed.length > 14 ? <span className="text-subtle">…</span> : null}
          <span className="text-good">{shownTyped}</span>
          <span className="mx-0.5 inline-block h-5 w-px translate-y-0.5 animate-pulse bg-accent align-middle" />
          <span className="text-muted">{shownRest}</span>
        </div>
        <div className="relative z-[2] mt-1 flex h-6 items-center justify-between text-xs text-subtle">
          <span>{imeWarn ? "英字（ABC）キーボードに切り替えてください" : "ローマ字直打ち · 変換しない"}</span>
          <span className="font-mono tabular-nums">{hud.combo > 1 ? `${hud.combo} combo` : ""}</span>
        </div>

        <TypingCapture
          ref={captureRef}
          active={live}
          onChar={applyChar}
          onBackspace={backspace}
          onIme={() => setImeWarn(true)}
        />
      </div>

      {!live ? (
        <div className="absolute inset-0 z-30 flex flex-col bg-bg px-6 pt-[max(4rem,env(safe-area-inset-top))]">
          <p className="text-xs font-medium tracking-[0.22em] text-muted">{meta.label}</p>
          <h2 className="mt-3 font-display text-4xl leading-none">英字で打つ</h2>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
            <li>キーボードを英字（ABC）に切り替える。</li>
            <li>
              読みをローマ字で打つ。変換・確定はしない。
              <span className="mt-1 block font-mono text-fg">猫 → neko</span>
            </li>
            <li>1打ごとに判定。ミスしたら打ち直す。</li>
          </ul>
          <div className="mt-auto pb-10">
            <Button size="lg" className="w-full" onClick={begin}>
              スタート
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HudCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-md bg-surface px-2 py-2">
      <div className="text-xs tracking-wide text-subtle">{label}</div>
      <div className={cn("truncate text-base leading-tight text-fg", accent && "text-good")}>{value}</div>
    </div>
  );
}
