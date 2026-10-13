import { useCallback, useState } from "react";
import type { ModeId } from "@/lib/content";
import { loadRecords, type Records } from "@/lib/records";
import type { RunResult } from "@/lib/game";
import { HomeView } from "@/components/home-view";
import { PlayView } from "@/components/play-view";
import { ResultView } from "@/components/result-view";

type Screen = "home" | "play" | "result";

export function AppShell() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<ModeId>("word");
  const [records, setRecords] = useState<Records>(() => loadRecords());
  const [result, setResult] = useState<RunResult | null>(null);
  const [playKey, setPlayKey] = useState(0);

  const pick = useCallback((next: ModeId) => {
    setMode(next);
    setPlayKey((n) => n + 1);
    setScreen("play");
  }, []);

  const finish = useCallback((run: RunResult) => {
    setResult(run);
    setRecords(loadRecords());
    setScreen("result");
  }, []);

  if (screen === "play") {
    return (
      <PlayView
        key={playKey}
        mode={mode}
        onQuit={() => setScreen("home")}
        onFinish={finish}
      />
    );
  }

  if (screen === "result" && result) {
    return (
      <ResultView
        result={result}
        onRetry={() => {
          setPlayKey((n) => n + 1);
          setScreen("play");
        }}
        onHome={() => setScreen("home")}
      />
    );
  }

  return <HomeView records={records} onPick={pick} />;
}
