import { NextRequest, NextResponse } from "next/server";
import { BoothPlayerType } from "@/lib/types";
import {
  addPlayer,
  deletePlayer,
  getPlayers,
  updatePlayer,
} from "@/lib/players-utils/players.server";

export async function GET() {
  const players = await getPlayers();
  return NextResponse.json(players);
}

export async function POST(req: NextRequest) {
  const { name, color, status } = await req.json();
  if (!name || !color || !status)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const newPlayer: BoothPlayerType = {
    name,
    color,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  await addPlayer(newPlayer);
  return NextResponse.json(newPlayer, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { name, ...updates } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const updated = await updatePlayer(name, updates);
  if (!updated)
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  const deleted = await deletePlayer(name);
  if (!deleted)
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
