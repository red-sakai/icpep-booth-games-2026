import { BoothPlayerType } from "@/lib/types";

const API_URL = "/api/players";

export async function getPlayers(): Promise<BoothPlayerType[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
}

export async function createPlayer(
  player: Omit<BoothPlayerType, "createdAt" | "updatedAt">,
): Promise<BoothPlayerType> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
  if (!res.ok) throw new Error("Failed to create player");
  return res.json();
}

export async function updatePlayer(
  name: string,
  updates: Partial<Omit<BoothPlayerType, "name" | "createdAt">>,
): Promise<BoothPlayerType> {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, ...updates }),
  });
  if (!res.ok) throw new Error("Failed to update player");
  return res.json();
}

export async function deletePlayer(name: string): Promise<void> {
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to delete player");
}
