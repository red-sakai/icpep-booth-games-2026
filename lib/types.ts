import type React from "react";
// Game types
export type GameType = "home" | "tech-tac-toe" | "led-memory" | "rj45-game";
export type GameMode = "solo" | "pvp" | "pve" | null;

// Social QR code types
export type SocialQRCode = {
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
};

// Tech Tac Toe types
export type Player = "1" | "0";
export type BoardState = (Player | null)[];
export type WinPattern = [number, number, number];

// LED Memory Game types
export type GameState =
  | "idle"
  | "showing"
  | "guessing"
  | "gameover"
  | "success";
export type LED = 1 | 2 | 3 | 4 | 5 | 6;

// RJ45 Game types
export type WireStandard = "T568A" | "T568B";
export type Wire = {
  id: number;
  color1: string;
  color2: string | null;
  name: string;
  bgClass: string;
  stripeClass: string | null;
};
export type RJ45GameState =
  | "select"
  | "learn"
  | "arrange"
  | "success"
  | "failure";

export type DifficultyLevel = "easy" | "medium" | "hard";
export enum EDificultyMultiplyer {
  easy = 1,
  medium = 1.5,
  hard = 2,
}

// ----- for leaderboard -----
export enum EGame {
  TECH_TAC_TOE = "tech-tac-toe",
  LED_MEMORY = "led-memory",
  RJ45_GAME = "rj45-game",
}
export enum EGamePlayLimit {
  TECH_TAC_TOE = 3,
  LED_MEMORY = 2,
  RJ45_GAME = 2,
}
export type BoothPlayerType = {
  name: string;
  color: string;
  status: Record<EGame, { playsRemaining: number | null; isLocked: boolean }>;
  createdAt: string;
  updatedAt?: string | null;
};
export type LeaderboardPlayerType = {
  name: string;
  score: number;
  createdAt: string;
  updatedAt?: string | null;
};
export type GameLeaderboardType = {
  metric: string;
  order: "asc" | "desc";
  entries: LeaderboardPlayerType[];
};
export type LeaderboardDataType = {
  version: number;
  generatedAt: string;
  games: Record<string, GameLeaderboardType>;
};
