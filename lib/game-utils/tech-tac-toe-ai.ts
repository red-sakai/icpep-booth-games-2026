import type { BoardState, Player } from "@/lib/types";
import { WIN_PATTERNS } from "./tech-tac-toe-utils";

type Difficulty = "easy" | "medium" | "hard";

/**
 * Returns the best move for the AI player based on difficulty.
 */
export function getBestMove(
  board: BoardState,
  player: Player,
  difficulty: Difficulty
): number {
  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val): val is number => val !== null);

  if (availableMoves.length === 0) return -1;

  // Easy: Random move
  if (difficulty === "easy") {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // Medium: Limited depth or occasional random moves
  if (difficulty === "medium") {
    // 30% chance of a random move to simulate "medium" difficulty
    if (Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      return availableMoves[randomIndex];
    }
    // Otherwise use minimax with depth limit
    return findBestMoveMinimax(board, player, 2);
  }

  // Hard: Full minimax (unbeatable)
  return findBestMoveMinimax(board, player, 9);
}

function findBestMoveMinimax(
  board: BoardState,
  player: Player,
  maxDepth: number
): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  const opponent = player === "1" ? "0" : "1";

  // If first move and middle is open, always take it (optimization)
  if (board[4] === null) return 4;

  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val): val is number => val !== null);

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = player;
    
    const score = minimax(
      newBoard,
      0,
      false,
      -Infinity,
      Infinity,
      player,
      opponent,
      maxDepth
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player,
  humanPlayer: Player,
  maxDepth: number
): number {
  const winner = evaluateBoard(board, aiPlayer, humanPlayer);
  
  // Terminal state or max depth reached
  if (winner !== null || depth >= maxDepth) {
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    return 0; // Draw or depth limit
  }

  const availableMoves = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((val): val is number => val !== null);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiPlayer;
      const evalScore = minimax(
        newBoard,
        depth + 1,
        false,
        alpha,
        beta,
        aiPlayer,
        humanPlayer,
        maxDepth
      );
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = humanPlayer;
      const evalScore = minimax(
        newBoard,
        depth + 1,
        true,
        alpha,
        beta,
        aiPlayer,
        humanPlayer,
        maxDepth
      );
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateBoard(
  board: BoardState,
  aiPlayer: Player,
  humanPlayer: Player
): Player | "draw" | null {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "draw";
  }

  return null;
}
