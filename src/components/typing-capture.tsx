import { forwardRef, useImperativeHandle, useRef } from "react";
import { isRomajiChar } from "@/lib/romaji";

type Props = {
  active: boolean;
  onChar: (ch: string) => void;
  onBackspace: () => void;
  onIme: () => void;
};

export type TypingCaptureHandle = {
  focus: () => void;
};

/**
 * Hidden latin capture. Must stay a real input so the OS keyboard opens.
 * Sentinel keeps iOS backspace firing when the field would otherwise be empty.
 */
export const TypingCapture = forwardRef<TypingCaptureHandle, Props>(
  function TypingCapture({ active, onChar, onBackspace, onIme }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const composing = useRef(false);
    const skipChange = useRef(false);

    const restore = () => {
      const el = inputRef.current;
      if (!el) return;
      el.value = " ";
      try {
        el.setSelectionRange(1, 1);
      } catch {
        /* Safari on hidden inputs */
      }
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        const el = inputRef.current;
        if (!el) return;
        restore();
        el.focus({ preventScroll: true });
      },
    }));

    const take = (raw: string) => {
      for (const ch of raw) {
        if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(ch)) {
          onIme();
          return;
        }
        if (isRomajiChar(ch)) onChar(ch);
      }
    };

    return (
      <input
        id="type-input"
        ref={inputRef}
        aria-label="ローマ字入力"
        className="pointer-events-auto absolute inset-0 z-[1] h-full w-full cursor-text opacity-[0.02]"
        style={{ fontSize: 16, caretColor: "transparent" }}
        lang="en"
        inputMode="url"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        defaultValue=" "
        tabIndex={active ? 0 : -1}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onCompositionStart={() => {
          composing.current = true;
        }}
        onCompositionEnd={(e) => {
          composing.current = false;
          const data = e.data ?? "";
          restore();
          if (!data) return;
          if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(data)) onIme();
          else take(data);
        }}
        onBeforeInput={(e) => {
          if (composing.current) return;
          const ie = e.nativeEvent;
          if (ie.inputType?.startsWith("delete")) {
            e.preventDefault();
            skipChange.current = true;
            onBackspace();
            restore();
            return;
          }
          if (ie.inputType === "insertText" && ie.data) {
            e.preventDefault();
            skipChange.current = true;
            take(ie.data);
            restore();
          }
        }}
        onChange={(e) => {
          if (composing.current) return;
          if (skipChange.current) {
            skipChange.current = false;
            restore();
            return;
          }
          const value = e.target.value;
          restore();
          if (value.length === 0) {
            onBackspace();
            return;
          }
          const extra = value.startsWith(" ") ? value.slice(1) : value.replace(/ /g, "");
          if (extra) take(extra);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return;
          if (e.key === "Backspace") {
            e.preventDefault();
            skipChange.current = true;
            onBackspace();
            restore();
          } else if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onBlur={() => {
          if (active) {
            requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
          }
        }}
      />
    );
  },
);
