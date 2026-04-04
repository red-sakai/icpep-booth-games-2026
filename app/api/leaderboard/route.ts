import { NextRequest, NextResponse } from "next/server";
import {
  getLeaderboard,
  updateLeaderboard,
} from "@/lib/leaderboard-utils/leaderboard-utils.server";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error reading leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to read leaderboard" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, name, score } = body;

    if (!gameId || !name || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { success, entry, error } = await updateLeaderboard(
      gameId,
      name,
      score,
    );

    if (!success) {
      return NextResponse.json({ error }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to update leaderboard" },
      { status: 500 },
    );
  }
}
