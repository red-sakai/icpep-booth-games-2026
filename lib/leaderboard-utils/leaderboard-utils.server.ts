import { LeaderboardDataType } from "../types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const GAME_CONFIG = {
  "led-memory": {
    metric: "patternsRemembered",
    order: "desc" as const,
    tableName: "leaderboard_memory_heist",
  },
  "rj45-game": {
    metric: "timeRemainingSeconds",
    order: "desc" as const,
    tableName: "leaderboard_ethernet_challenge",
  },
  "tech-tac-toe": {
    metric: "totalWins",
    order: "desc" as const,
    tableName: "leaderboard_tech_tac_toe",
  },
} as const;

type SupportedGameId = keyof typeof GAME_CONFIG;

const initialLeaderboard: LeaderboardDataType = {
  version: 1,
  generatedAt: new Date().toISOString(),
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

type SupabaseScoreRow = {
  name: string;
  score: number;
  created_at: string;
  updated_at: string | null;
};

const normalizePlayerName = (name: string) => name.trim().toUpperCase();

async function getGameEntries(
  gameId: SupportedGameId,
): Promise<LeaderboardDataType["games"][SupportedGameId]["entries"]> {
  const supabase = getSupabaseServerClient();
  const { tableName, order } = GAME_CONFIG[gameId];

  const { data, error } = await supabase
    .from(tableName)
    .select("name, score, created_at, updated_at")
    .order("score", { ascending: order === "asc" })
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(`Failed to load ${gameId} leaderboard: ${error.message}`);
  }

  return (data as SupabaseScoreRow[]).map((entry) => ({
    name: entry.name,
    score: Number(entry.score),
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  }));
}

export async function getLeaderboard() {
  const gameIds = Object.keys(GAME_CONFIG) as SupportedGameId[];
  const entriesByGame = await Promise.all(
    gameIds.map(async (gameId) => ({
      gameId,
      entries: await getGameEntries(gameId),
    })),
  );

  const leaderboard: LeaderboardDataType = {
    ...initialLeaderboard,
    generatedAt: new Date().toISOString(),
    games: {
      "led-memory": {
        ...initialLeaderboard.games["led-memory"],
        entries: [],
      },
      "rj45-game": {
        ...initialLeaderboard.games["rj45-game"],
        entries: [],
      },
      "tech-tac-toe": {
        ...initialLeaderboard.games["tech-tac-toe"],
        entries: [],
      },
    },
  };

  entriesByGame.forEach(({ gameId, entries }) => {
    leaderboard.games[gameId].entries = entries;
  });

  return leaderboard;
}

export async function updateLeaderboard(
  gameId: string,
  name: string,
  score: number,
) {
  const normalizedName = normalizePlayerName(name);
  const numericScore = Number(score);
  const now = new Date().toISOString();

  if (!(gameId in GAME_CONFIG)) {
    return { success: false, error: "Game not found" };
  }

  if (!normalizedName) {
    return { success: false, error: "Player name is required" };
  }

  if (Number.isNaN(numericScore)) {
    return { success: false, error: "Score must be a valid number" };
  }

  const supabase = getSupabaseServerClient();
  const gameConfig = GAME_CONFIG[gameId as SupportedGameId];
  const { tableName } = gameConfig;

  const { data: existingGameEntry, error: existingGameEntryError } =
    await supabase
      .from(tableName)
      .select("name, score, created_at")
      .eq("name", normalizedName)
      .maybeSingle();

  if (existingGameEntryError) {
    throw new Error(
      `Failed to read existing ${gameId} entry: ${existingGameEntryError.message}`,
    );
  }

  const hadEntryForGame = Boolean(existingGameEntry);
  const nextGameScore = hadEntryForGame
    ? Number(existingGameEntry?.score ?? 0) + numericScore
    : numericScore;

  if (hadEntryForGame) {
    const { error: updateGameError } = await supabase
      .from(tableName)
      .update({
        score: nextGameScore,
        updated_at: now,
      })
      .eq("name", normalizedName);

    if (updateGameError) {
      throw new Error(`Failed to update ${gameId} score: ${updateGameError.message}`);
    }
  } else {
    const { error: insertGameError } = await supabase.from(tableName).insert({
      name: normalizedName,
      score: nextGameScore,
      created_at: now,
      updated_at: null,
    });

    if (insertGameError) {
      throw new Error(`Failed to insert ${gameId} score: ${insertGameError.message}`);
    }
  }

  const { data: existingOverallEntry, error: existingOverallEntryError } =
    await supabase
      .from("leaderboard_overall")
      .select("name, total_score, games_played")
      .eq("name", normalizedName)
      .maybeSingle();

  if (existingOverallEntryError) {
    throw new Error(
      `Failed to read overall leaderboard entry: ${existingOverallEntryError.message}`,
    );
  }

  if (existingOverallEntry) {
    const nextTotalScore =
      Number(existingOverallEntry.total_score ?? 0) + numericScore;
    const nextGamesPlayed = hadEntryForGame
      ? Number(existingOverallEntry.games_played ?? 0)
      : Math.min(3, Number(existingOverallEntry.games_played ?? 0) + 1);

    const { error: updateOverallError } = await supabase
      .from("leaderboard_overall")
      .update({
        total_score: nextTotalScore,
        games_played: nextGamesPlayed,
        latest_activity_at: now,
        updated_at: now,
      })
      .eq("name", normalizedName);

    if (updateOverallError) {
      throw new Error(
        `Failed to update overall leaderboard: ${updateOverallError.message}`,
      );
    }
  } else {
    const { error: insertOverallError } = await supabase
      .from("leaderboard_overall")
      .insert({
        name: normalizedName,
        total_score: numericScore,
        games_played: 1,
        latest_activity_at: now,
        created_at: now,
        updated_at: null,
      });

    if (insertOverallError) {
      throw new Error(
        `Failed to create overall leaderboard entry: ${insertOverallError.message}`,
      );
    }
  }

  const savedEntry = {
    name: normalizedName,
    score: nextGameScore,
    createdAt: existingGameEntry?.created_at ?? now,
    updatedAt: hadEntryForGame ? now : null,
  };

  return { success: true, entry: savedEntry };
}
