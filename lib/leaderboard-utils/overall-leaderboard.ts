import { LeaderboardDataType } from "@/lib/types";

export type OverallLeaderboardEntry = {
  name: string;
  totalScore: number;
  gamesPlayed: number;
  latestActivityAt: string;
};

export function buildOverallLeaderboard(
  leaderboardData: LeaderboardDataType | null | undefined,
  limit = 20,
): OverallLeaderboardEntry[] {
  if (!leaderboardData?.games) return [];

  const totals = new Map<string, OverallLeaderboardEntry>();

  Object.values(leaderboardData.games).forEach((game) => {
    game.entries.forEach((entry) => {
      const normalizedName = entry.name.trim().toUpperCase();
      const numericScore = Number(entry.score);

      if (!normalizedName || Number.isNaN(numericScore)) return;

      const activityAt = entry.updatedAt ?? entry.createdAt;
      const existing = totals.get(normalizedName);

      if (!existing) {
        totals.set(normalizedName, {
          name: normalizedName,
          totalScore: numericScore,
          gamesPlayed: 1,
          latestActivityAt: activityAt,
        });
        return;
      }

      existing.totalScore += numericScore;
      existing.gamesPlayed += 1;

      if (new Date(activityAt).getTime() > new Date(existing.latestActivityAt).getTime()) {
        existing.latestActivityAt = activityAt;
      }
    });
  });

  return [...totals.values()]
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return new Date(b.latestActivityAt).getTime() - new Date(a.latestActivityAt).getTime();
    })
    .slice(0, Math.max(0, limit));
}