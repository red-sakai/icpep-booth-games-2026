import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "leaderboard.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    console.error("Error reading leaderboard:", error);
    return NextResponse.json({ error: "Failed to read leaderboard" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, name, score } = body;

    if (!gameId || !name || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "leaderboard.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const leaderboard = JSON.parse(fileData);

    if (!leaderboard.games[gameId]) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const entries = leaderboard.games[gameId].entries;
    const existingIndex = entries.findIndex(
      (entry: any) => entry.name.toUpperCase() === name.toUpperCase()
    );

    let savedEntry;
    if (existingIndex !== -1) {
      // Accumulate score for returning player
      entries[existingIndex].score += score;
      entries[existingIndex].updatedAt = new Date().toISOString();
      savedEntry = entries[existingIndex];
    } else {
      // New player — create entry
      savedEntry = {
        name: name.toUpperCase(),
        score,
        createdAt: new Date().toISOString(),
      };
      entries.push(savedEntry);
    }

    // Sort by score descending and keep top 20
    leaderboard.games[gameId].entries = entries
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 20);

    await fs.writeFile(filePath, JSON.stringify(leaderboard, null, 2), "utf-8");

    return NextResponse.json({ success: true, entry: savedEntry });
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    return NextResponse.json({ error: "Failed to update leaderboard" }, { status: 500 });
  }
}
