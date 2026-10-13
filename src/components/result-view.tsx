import { MODE_META } from "@/lib/content";
import { formatKps, formatPct, formatTime, type RunResult } from "@/lib/game";
import { Button } from "@/components/ui/button";

type Props = {
  result: RunResult;
  onRetry: () => void;
  onHome: () => void;
};

export function ResultView({ result, onRetry, onHome }: Props) {
  const meta = MODE_META[result.mode];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="pt-8">
        <p className="text-xs font-medium tracking-[0.22em] text-muted">
          {meta.label} · {result.improved ? "BEST" : "RESULT"}
        </p>
        <p className="mt-4 font-display text-7xl leading-none tracking-tight text-fg">
          {formatKps(result.kps)}
          <span className="ml-2 font-sans text-base font-medium tracking-wide text-muted">KPS</span>
        </p>
        {result.improved ? (
          <p className="mt-3 text-sm text-good">このモードの最高を更新</p>
        ) : (
          <p className="mt-3 text-sm text-muted">平均の秒間キータイプ</p>
        )}
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        <Stat label="正確率" value={formatPct(result.accuracy)} />
        <Stat label="ピーク KPS" value={formatKps(result.peakKps)} />
        <Stat label="最大コンボ" value={String(result.combo)} />
        <Stat label="打鍵" value={`${result.keys - result.misses}/${result.keys}`} />
        <Stat label="かな" value={String(result.kana)} />
        <Stat label="時間" value={formatTime(result.seconds)} />
      </dl>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <Button size="lg" className="w-full" onClick={onRetry}>
          もう一度
        </Button>
        <Button size="lg" variant="secondary" className="w-full" onClick={onHome}>
          モード選択
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-surface px-4 py-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-mono text-lg tabular-nums text-fg">{value}</dd>
    </div>
  );
}
