"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { Player, BoardState } from "@/lib/types";
import { checkWinner } from "@/lib/game-utils/tech-tac-toe-utils";
import GameHeader from "@/components/games/tech-tac-toe/game-header";
import GameBoard from "@/components/games/tech-tac-toe/game-board";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TechTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("1");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const handleCellClick = (index: number) => {
    // Ignore click if cell is already filled or game is over
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: newWinner, pattern } = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      setWinningPattern(pattern);

      if (newWinner === "draw") {
        toast("It's a draw! 🤝", {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      } else {
        toast(`Player ${newWinner} wins! 🎉`, {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      }
    } else {
      // Switch player
      setCurrentPlayer(currentPlayer === "1" ? "0" : "1");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("1");
    setWinner(null);
    setWinningPattern(null);
    setLeaderboardOpen(false);
  };

  const isFinished = winner !== null;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 rounded-xl shadow-md">
      <GameHeader
        winner={winner}
        currentPlayer={currentPlayer}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />

      <GameBoard
        board={board}
        winningPattern={winningPattern}
        handleCellClick={handleCellClick}
      />

      {isFinished && (
        <Button
          onClick={() => setLeaderboardOpen(true)}
          variant="outline"
          size="lg"
          className="bg-white border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm"
        >
          Show Leaderboard
        </Button>
      )}

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>
              Tech Tac Toe scores and rankings
            </DialogDescription>
          </DialogHeader>

          <LeaderboardPanel
            gameId="tech-tac-toe"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>

      <Button
        onClick={resetGame}
        variant="outline"
        size="lg"
        className="bg-white border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm flex items-center gap-2"
      >
        <RotateCcw size={16} />
        New Game
      </Button>
    </div>
  );
}
