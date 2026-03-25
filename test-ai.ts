import { getBestMove } from "./lib/game-utils/tech-tac-toe-ai";
import { BoardState } from "./lib/types";

// Mock Board for testing
// 1 = Player, 0 = AI, null = Empty

// Test 1: AI should take the winning move
const winningBoard: BoardState = [
  "0", "0", null,
  "1", "1", null,
  null, null, null
];
const move1 = getBestMove(winningBoard, "0", "hard");
console.log("Test 1 (Winning Move):", move1 === 2 ? "PASSED" : "FAILED (Move: " + move1 + ")");

// Test 2: AI should block the player's winning move
const blockBoard: BoardState = [
  "1", "1", null,
  "0", null, null,
  null, null, null
];
const move2 = getBestMove(blockBoard, "0", "hard");
console.log("Test 2 (Blocking Move):", move2 === 2 ? "PASSED" : "FAILED (Move: " + move2 + ")");

// Test 3: AI should take the center if open (optimization)
const centerBoard: BoardState = [
  null, null, null,
  null, null, null,
  null, null, null
];
const move3 = getBestMove(centerBoard, "0", "hard");
console.log("Test 3 (Center Move):", move3 === 4 ? "PASSED" : "FAILED (Move: " + move3 + ")");

// Test 4: Hard difficulty should not lose in a common fork scenario
const forkBoard: BoardState = [
  "1", null, null,
  null, "0", null,
  null, null, "1"
];
// Player has corners, AI must take an edge (1, 3, 5, or 7) to avoid a fork
const move4 = getBestMove(forkBoard, "0", "hard");
const isEdge = [1, 3, 5, 7].includes(move4);
console.log("Test 4 (Fork Prevention):", isEdge ? "PASSED" : "FAILED (Move: " + move4 + ")");
