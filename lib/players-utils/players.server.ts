import fs from "fs/promises";
import path from "path";
import { BoothPlayerType } from "@/lib/types";

const dataFilePath = path.join(process.cwd(), "public", "players.json");

export async function getPlayers(): Promise<BoothPlayerType[]> {
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    if (!data.trim()) {
      await fs.writeFile(dataFilePath, "[]", "utf-8");
      return [];
    }
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(dataFilePath, "[]", "utf-8");
      return [];
    }
    throw err;
  }
}

export async function addPlayer(
  player: BoothPlayerType,
): Promise<BoothPlayerType> {
  const players = await getPlayers();
  players.push(player);
  await fs.writeFile(dataFilePath, JSON.stringify(players, null, 2));
  return player;
}

export async function updatePlayer(
  name: string,
  updates: Partial<BoothPlayerType>,
): Promise<BoothPlayerType | null> {
  const players = await getPlayers();
  const idx = players.findIndex((p) => p.name === name);
  if (idx === -1) return null;
  players[idx] = {
    ...players[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(dataFilePath, JSON.stringify(players, null, 2));
  return players[idx];
}

export async function deletePlayer(name: string): Promise<boolean> {
  const players = await getPlayers();
  const filtered = players.filter((p) => p.name !== name);
  if (filtered.length === players.length) return false;
  await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2));
  return true;
}
