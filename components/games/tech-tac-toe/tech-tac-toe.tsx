"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { BoardState, BoothPlayerType } from "@/lib/types";
import { checkWinner } from "@/lib/game-utils/tech-tac-toe-utils";
import GameHeader from "@/components/games/tech-tac-toe/game-header";
import GameBoard from "@/components/games/tech-tac-toe/game-board";
import { usePlayers } from "@/contexts/players-context";

export default function TechTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const { currentPlayers } = usePlayers();
  const [currentPlayer, setCurrentPlayer] = useState<BoothPlayerType | null>(
    null,
  );
  const [winnerPlayer, setWinnerPlayer] = useState<
    BoothPlayerType | "draw" | null
  >(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (currentPlayers.player1 && currentPlayers.player2) {
      setCurrentPlayer(currentPlayers.player1);
      toast(`${currentPlayers.player1.name} starts!`, {
        className: "bg-sky-100 text-sky-800 border-sky-200",
      });
    }
  }, [currentPlayers]);

  const handleCellClick = (index: number) => {
    if (!currentPlayers.player1 || !currentPlayers.player2) {
      alert("Please select both players before starting the game.");
      return;
    }
    // Ignore click if cell is already filled or game is over
    if (board[index] || winnerPlayer) return;

    const newBoard = [...board];
    if (currentPlayers?.player1.name === currentPlayer?.name) {
      newBoard[index] = "1";
    } else if (currentPlayers?.player2.name === currentPlayer?.name) {
      newBoard[index] = "0";
    }
    setBoard(newBoard);

    const { winner: newWinner, pattern } = checkWinner(newBoard);

    if (newWinner) {
      if (newWinner === "1") {
        setWinnerPlayer(currentPlayers?.player1);
      } else if (newWinner === "0") {
        setWinnerPlayer(currentPlayers?.player2);
      } else {
        setWinnerPlayer("draw");
      }
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
      if (currentPlayer === currentPlayers?.player1) {
        setCurrentPlayer(currentPlayers?.player2);
        toast(`${currentPlayers?.player2?.name}'s turn!`, {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      } else {
        setCurrentPlayer(currentPlayers?.player1);
        toast(`${currentPlayers?.player1?.name}'s turn!`, {
          className: "bg-sky-100 text-sky-800 border-sky-200",
        });
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(currentPlayers?.player1 || null);
    setWinnerPlayer(null);
    setWinningPattern(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 rounded-xl shadow-md">
      <GameHeader
        winnerPlayer={winnerPlayer}
        currentPlayer={currentPlayer}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />

      <GameBoard
        board={board}
        winningPattern={winningPattern}
        handleCellClick={handleCellClick}
      />

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
