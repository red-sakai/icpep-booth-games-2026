import fs from "fs/promises";
import path from "path";
import { LeaderboardDataType } from "../types";

const filePath = path.join(process.cwd(), "public", "leaderboard.json");
const initialLeaderboard: LeaderboardDataType = {
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
};
async function initializeLeaderboardFile() {
  await fs.writeFile(
    filePath,
    JSON.stringify(initialLeaderboard, null, 2),
    "utf-8",
  );
}

export async function getLeaderboard() {
  try {
    const fileData = await fs.readFile(filePath, "utf-8");
    if (!fileData.trim()) {
      await initializeLeaderboardFile();
      return initialLeaderboard;
    }
    return JSON.parse(fileData);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await initializeLeaderboardFile();
      return initialLeaderboard;
    }
    throw error;
  }
}

export async function updateLeaderboard(
  gameId: string,
  name: string,
  score: number,
) {
  const leaderboard = await getLeaderboard();

  if (!leaderboard.games[gameId]) {
    return { success: false, error: "Game not found" };
  }

  const entries = leaderboard.games[gameId].entries;
  const existingIndex = entries.findIndex(
    (entry: any) => entry.name.toUpperCase() === name.toUpperCase(),
  );

  let savedEntry;
  if (existingIndex !== -1) {
    entries[existingIndex].score += score;
    entries[existingIndex].updatedAt = new Date().toISOString();
    savedEntry = entries[existingIndex];
  } else {
    savedEntry = {
      name: name.toUpperCase(),
      score,
      createdAt: new Date().toISOString(),
    };
    entries.push(savedEntry);
  }

  leaderboard.games[gameId].entries = entries
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 20);

  await fs.writeFile(filePath, JSON.stringify(leaderboard, null, 2), "utf-8");

  return { success: true, entry: savedEntry };
}
