"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeaderboard } from "@/contexts/leaderboard-context";
import { buildOverallLeaderboard } from "@/lib/leaderboard-utils/overall-leaderboard";
import OverallLeaderboardPanel from "@/components/games/leaderboard/overall-leaderboard-panel";

function rankAccent(rank: number) {
  if (rank === 1) return "from-amber-300 via-yellow-200 to-amber-400 border-amber-300";
  if (rank === 2) return "from-slate-200 via-slate-100 to-slate-300 border-slate-300";
  if (rank === 3) return "from-orange-200 via-rose-100 to-orange-300 border-orange-300";
  return "from-white to-white border-slate-200";
}

export default function OverallLeaderboardSection() {
  const { leaderboardData, updateLeaderboardData } = useLeaderboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const result = await updateLeaderboardData();
      if (result.error) setError(result.error);

      setLoading(false);
    };

    void load();
  }, []);

  const top5 = useMemo(
    () => buildOverallLeaderboard(leaderboardData, 5),
    [leaderboardData],
  );

  return (
    <section className="mt-8 md:mt-10">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 md:p-8 shadow-lg">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-rose-200/40 blur-2xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Hall of Fame
              </p>
              <h3 className="mt-1 text-2xl md:text-3xl font-black text-slate-900">
                Overall Leaderboard
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Top 5 based on combined scores from all games.
              </p>
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold inline-flex items-center gap-2"
            >
              <Trophy size={18} />
              View Full Leaderboard
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {loading && (
              <p className="col-span-full text-sm text-slate-600">Loading overall rankings...</p>
            )}

            {!loading && error && (
              <p className="col-span-full text-sm text-rose-700">{error}</p>
            )}

            {!loading && !error && top5.length === 0 && (
              <p className="col-span-full text-sm text-slate-600">No entries yet.</p>
            )}

            {!loading &&
              !error &&
              top5.map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={`${entry.name}-${entry.latestActivityAt}-${rank}`}
                    className={`rounded-xl border bg-gradient-to-br ${rankAccent(rank)} p-4 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">#{rank}</p>
                      {rank === 1 && <Crown size={16} className="text-amber-700" />}
                      {rank > 1 && rank <= 3 && <Medal size={16} className="text-slate-600" />}
                    </div>
                    <p className="mt-2 truncate text-base font-bold text-slate-900">
                      {entry.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">Score: {entry.totalScore}</p>
                    <p className="text-xs text-slate-500">Games: {entry.gamesPlayed}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Overall Leaderboard</DialogTitle>
            <DialogDescription>
              Combined standings from LED Memory, Tech Tac Toe, and RJ45.
            </DialogDescription>
          </DialogHeader>

          <OverallLeaderboardPanel limit={50} className="w-full max-w-none" />
        </DialogContent>
      </Dialog>
    </section>
  );
}
