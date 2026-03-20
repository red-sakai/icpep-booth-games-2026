"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";

type LeaderboardEntry = {
  name: string;
  score: number;
  createdAt: string;
};

type LeaderboardGame = {
  metric: string;
  order: "asc" | "desc";
  entries: LeaderboardEntry[];
};

type LeaderboardFile = {
  version: number;
  generatedAt: string;
  games: Record<string, LeaderboardGame>;
};

type LeaderboardPanelProps = {
  gameId: string;
  limit?: number;
  className?: string;
};

export default function LeaderboardPanel({
  gameId,
  limit = 5,
  className,
}: LeaderboardPanelProps) {
  const [data, setData] = useState<LeaderboardFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cacheBuster = useMemo(() => Date.now(), []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/leaderboard.json?cb=${cacheBuster}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load leaderboard.json (${res.status})`);
        }

        const json = (await res.json()) as LeaderboardFile;
        setData(json);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        if (controller.signal.aborted) return;
        setLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, [cacheBuster]);

  const game = data?.games?.[gameId] ?? null;

  const entries = useMemo(() => {
    if (!game?.entries) return [];

    const sorted = [...game.entries].sort((a, b) => {
      const delta = a.score - b.score;
      return game.order === "asc" ? delta : -delta;
    });

    return sorted.slice(0, Math.max(0, limit));
  }, [game?.entries, game?.order, limit]);

  return (
    <Card
      className={
        className ??
        "w-full max-w-2xl bg-white/80 backdrop-blur-sm border-slate-200"
      }
    >
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Leaderboard
          </h2>
          {game?.metric && (
            <span className="text-sm text-slate-500">{game.metric}</span>
          )}
        </div>

        {loading && (
          <p className="text-sm text-slate-600">Loading leaderboard…</p>
        )}

        {!loading && error && (
          <p className="text-sm text-rose-700">{error}</p>
        )}

        {!loading && !error && !game && (
          <p className="text-sm text-slate-600">
            No leaderboard data found for this game.
          </p>
        )}

        {!loading && !error && game && entries.length === 0 && (
          <p className="text-sm text-slate-600">No entries yet.</p>
        )}

        {!loading && !error && game && entries.length > 0 && (
          <ol className="space-y-2">
            {entries.map((entry, index) => (
              <li
                key={`${entry.name}-${entry.createdAt}-${index}`}
                className="flex items-center justify-between text-base text-slate-700"
              >
                <span className="font-medium">
                  {index + 1}. {entry.name}
                </span>
                <span className="tabular-nums text-slate-800">
                  {entry.score}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}
