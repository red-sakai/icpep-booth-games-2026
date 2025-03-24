import type { BoardState, WinPattern } from "@/lib/types";

// Win patterns for Tech Tac Toe
export const WIN_PATTERNS: WinPattern[] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

// Check if there's a winner or a draw
export const checkWinner = (
  boardState: BoardState
): { winner: "1" | "0" | "draw" | null; pattern: number[] | null } => {
  // Check for winner
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return { winner: boardState[a] as "1" | "0", pattern };
    }
  }

  // Check for draw
  if (boardState.every((cell) => cell !== null)) {
    return { winner: "draw", pattern: null };
  }

  return { winner: null, pattern: null };
};
