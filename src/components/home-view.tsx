import { ChevronRight } from "lucide-react";
import { MODE_META, type ModeId } from "@/lib/content";
import type { Records } from "@/lib/records";
import { formatKps } from "@/lib/game";
import { Button } from "@/components/ui/button";

const ORDER: ModeId[] = ["word", "mid", "long"];

const EXAMPLES: Record<ModeId, string> = {
  word: "猫 → neko",
  mid: "今日はいい天気です",
  long: "段落をローマ字で打ち切る",
};

type Props = {
  records: Records;
  onPick: (mode: ModeId) => void;
};

export function HomeView({ records, onPick }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="pt-6">
        <p className="text-xs font-medium tracking-[0.22em] text-muted">ROMAJI TYPE</p>
        <h1 className="mt-2 font-display text-6xl leading-none tracking-tight text-fg">瞬打</h1>
        <p className="mt-4 max-w-[18rem] text-pretty text-sm leading-relaxed text-muted">
          英字キーボードでローマ字を打つ。変換も確定もいらない。
        </p>
      </header>

      <ol className="mt-10 flex flex-col gap-3">
        {ORDER.map((mode) => {
          const meta = MODE_META[mode];
          const best = records.best[mode];
          return (
            <li key={mode}>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => onPick(mode)}
                className="group items-stretch justify-between"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-2xl leading-none">{meta.label}</span>
                    <span className="text-xs font-medium tracking-wide text-muted">{meta.kicker}</span>
                  </span>
                  <span className="text-sm text-muted">{EXAMPLES[mode]}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end justify-between pl-3">
                  <span className="font-mono text-sm tabular-nums text-fg">
                    {best ? `${formatKps(best.kps)} kps` : "—"}
                  </span>
                  <ChevronRight className="size-4 text-subtle transition-transform duration-150 group-active:translate-x-0.5" />
                </span>
              </Button>
            </li>
          );
        })}
      </ol>

      <p className="mt-auto pt-10 text-xs leading-relaxed text-subtle">
        端末の英字キーボードを使います。フリックのかな入力や変換候補は使いません。
      </p>
    </div>
  );
}
