"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  entriesClassName?: string;
};

export default function LeaderboardPanel({
  gameId,
  limit = 5,
  className,
  entriesClassName,
}: LeaderboardPanelProps) {
  const theme = useMemo(() => {
    switch (gameId) {
      case "led-memory":
        return {
          card: "bg-rose-50/80 border-rose-200",
          title: "text-rose-800",
          metric: "text-rose-700",
        };
      case "tech-tac-toe":
        return {
          card: "bg-sky-50/80 border-sky-200",
          title: "text-sky-800",
          metric: "text-sky-700",
        };
      case "rj45-game":
        return {
          card: "bg-cyan-50/80 border-cyan-200",
          title: "text-cyan-800",
          metric: "text-cyan-700",
        };
      default:
        return {
          card: "bg-white/80 border-slate-200",
          title: "text-slate-800",
          metric: "text-slate-500",
        };
    }
  }, [gameId]);

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
      className={cn(
        "w-full max-w-2xl backdrop-blur-sm",
        theme.card,
        className
      )}
    >
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={cn("text-lg sm:text-xl font-semibold", theme.title)}>
            Leaderboard
          </h2>
          {game?.metric && (
            <span className={cn("text-sm", theme.metric)}>{game.metric}</span>
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
          <ol
            className={cn("space-y-2", entriesClassName)}
          >
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
