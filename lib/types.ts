import type React from "react";
// Game types
export type GameType = "home" | "tech-tac-toe" | "led-memory" | "rj45-game";

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
