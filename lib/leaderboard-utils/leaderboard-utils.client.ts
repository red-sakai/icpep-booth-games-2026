const controller = new AbortController();

export async function getLeaderboard() {
  try {
    const res = await fetch(`/api/leaderboard?cb=${Date.now()}`, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.error || `Failed to load leaderboard (${res.status})`,
      };
    }
    const json = await res.json();
    return { data: json, error: null };
  } catch (err) {
    if (controller.signal.aborted)
      return { data: null, error: "Request aborted" };
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export interface SubmitScoreParams {
  gameId: string;
  name: string;
  score: number;
}

export async function submitScore({ gameId, name, score }: SubmitScoreParams) {
  const res = await fetch("/api/leaderboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId, name, score }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to submit score");
  }
  return data;
}
