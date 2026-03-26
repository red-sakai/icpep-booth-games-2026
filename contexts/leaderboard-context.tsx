import { getLeaderboard } from "@/lib/leaderboard-utils/leaderboard-utils.client";
import { LeaderboardDataType } from "@/lib/types";
import React, { useEffect } from "react";

type LeaderboardContextType = {
  leaderboardData: LeaderboardDataType;
  setLeaderboardData?: React.Dispatch<
    React.SetStateAction<LeaderboardDataType>
  >;
  updateLeaderboardData: () => Promise<{
    data: any | null;
    error: string | null;
  }>;
};
const LeaderboardContext = React.createContext<LeaderboardContextType | null>(
  null,
);

type LeaderboardProviderProps = {
  children: React.ReactNode;
};
export const LeaderboardProvider = ({ children }: LeaderboardProviderProps) => {
  const [leaderboardData, setLeaderboardData] =
    React.useState<LeaderboardDataType>({
      version: 1,
      generatedAt: "2026-03-20T00:00:00.000Z",
      games: {
        "led-memory": {
          metric: "patternsRemembered",
          order: "desc",
          entries: [],
        },
        "rj45-game": {
          metric: "timeRemainingSeconds",
          order: "desc",
          entries: [],
        },
        "tech-tac-toe": {
          metric: "totalWins",
          order: "desc",
          entries: [],
        },
      },
    });
  const updateLeaderboardData = async () => {
    const result = await getLeaderboard();
    if (result.data) {
      setLeaderboardData(result.data);
      return result;
    } else {
      return result;
    }
  };

  useEffect(() => {
    updateLeaderboardData();
  }, []);

  return (
    <LeaderboardContext.Provider
      value={{ leaderboardData, setLeaderboardData, updateLeaderboardData }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = React.useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
