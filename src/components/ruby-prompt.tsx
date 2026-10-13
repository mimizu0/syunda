import { useEffect, useRef } from "react";
import { readingOf, type PromptItem } from "@/lib/content";
import { normalizeReading, preferredRomaji } from "@/lib/romaji";
import { cn } from "@/lib/utils";

type Props = {
  item: PromptItem;
  kanaUsed: number;
  compact?: boolean;
};

export function RubyPrompt({ item, kanaUsed, compact }: Props) {
  const currentRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [kanaUsed]);

  let cursor = 0;

  return (
    <p
      data-romaji={preferredRomaji(readingOf(item))}
      className={cn(
        "text-pretty text-center font-sans leading-snug text-fg",
        compact ? "text-xl" : "text-2xl",
      )}
    >
      {item.ruby.map((seg, index) => {
        const raw = seg.r ?? seg.s;
        const len = normalizeReading(raw).length;
        const start = cursor;
        const end = cursor + len;
        cursor = end;
        const done = len === 0 ? kanaUsed >= start : kanaUsed >= end;
        const current = !done && kanaUsed >= start && (len === 0 || kanaUsed < end);
        const className = cn(
          "transition-colors duration-150",
          done && "text-good",
          current && "text-fg",
          !done && !current && "text-subtle",
        );

        if (seg.r) {
          return (
            <ruby
              key={index}
              ref={current ? currentRef : undefined}
              className={cn(className, "mx-px ruby-center")}
            >
              <span>{seg.s}</span>
              <rp>(</rp>
              <rt className="text-xs font-medium tracking-wide text-current opacity-80">
                {seg.r}
              </rt>
              <rp>)</rp>
            </ruby>
          );
        }

        return (
          <span key={index} ref={current ? currentRef : undefined} className={className}>
            {seg.s}
          </span>
        );
      })}
    </p>
  );
}
