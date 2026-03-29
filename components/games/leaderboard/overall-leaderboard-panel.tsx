"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLeaderboard } from "@/contexts/leaderboard-context";
import { buildOverallLeaderboard } from "@/lib/leaderboard-utils/overall-leaderboard";
import TopThreePodium from "@/components/games/leaderboard/top-three-podium";

type OverallLeaderboardPanelProps = {
  limit?: number;
  className?: string;
  leaderboardKey?: number;
  entriesClassName?: string;
};

export default function OverallLeaderboardPanel({
  limit = 20,
  className,
  leaderboardKey = 0,
  entriesClassName,
}: OverallLeaderboardPanelProps) {
  const { leaderboardData, updateLeaderboardData } = useLeaderboard();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      const result = await updateLeaderboardData();
      if (result.error) {
        if (controller.signal.aborted) return;
        setError(result.error);
      }
      setLoading(false);
    };

    void load();

    return () => controller.abort();
  }, [leaderboardKey]);

  const entries = useMemo(
    () => buildOverallLeaderboard(leaderboardData, limit),
    [leaderboardData, limit],
  );

  const remainingEntries = useMemo(() => entries.slice(3), [entries]);

  return (
    <Card
      className={cn(
        "w-full max-w-2xl bg-white/60 backdrop-blur-sm border border-pink-200 shadow-[0_8px_30px_rgba(236,72,153,0.15)] rounded-2xl",
        className,
      )}
    >
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-fuchsia-500 font-black tracking-tight">
            Leaderboard
          </h2>
          <span className="text-fuchsia-600 font-bold uppercase tracking-wider text-xs">
            TOTAL SCORE
          </span>
        </div>

        {loading && <p className="text-sm text-slate-600">Loading leaderboard...</p>}

        {!loading && error && <p className="text-sm text-rose-700">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="text-sm text-slate-600">No entries yet.</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            <TopThreePodium
              entries={entries.map((entry) => ({
                name: entry.name,
                score: entry.totalScore,
              }))}
            />

            {remainingEntries.length > 0 && (
              <ol className={cn("space-y-2", entriesClassName)}>
                {remainingEntries.map((entry, index) => (
                  <li
                    key={`${entry.name}-${entry.latestActivityAt}-${index}`}
                    className="flex items-center justify-between text-base text-slate-700"
                  >
                    <span className="font-medium">
                      {index + 4}. {entry.name}
                    </span>
                    <span className="tabular-nums text-slate-800">
                      {entry.totalScore}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </Card>
  );
}