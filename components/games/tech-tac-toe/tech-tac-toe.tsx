"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { BoardState, Player } from "@/lib/types";
import { checkWinner } from "@/lib/game-utils/tech-tac-toe-utils";
import { getBestMove } from "@/lib/game-utils/tech-tac-toe-ai";
import GameHeader from "@/components/games/tech-tac-toe/game-header";
import GameBoard from "@/components/games/tech-tac-toe/game-board";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import { usePlayers } from "@/contexts/players-context";
import GameModeSelector from "@/components/games/tech-tac-toe/game-mode-selector";
import PlayerNameDialog from "@/components/games/tech-tac-toe/player-name-dialog";

type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

export default function TechTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const { currTeam1Player, currTeam2Player } = usePlayers();
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [winnerPlayer, setWinnerPlayer] = useState<Player | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    if (currTeam1Player && currTeam2Player) {
      setCurrentPlayer("1");
      toast(`${currTeam1Player.name} starts!`, {
        className: "bg-sky-100 text-sky-800 border-sky-200",
      });
    }
  }, [currTeam1Player, currTeam2Player]);

  // AI & Game Mode State
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [previousGameMode, setPreviousGameMode] = useState<GameMode | null>(
    null,
  );

  // Leaderboard & Streak State
  const [p1Streak, setP1Streak] = useState(0);
  const [p0Streak, setP0Streak] = useState(0);
  const [lastWinScore, setLastWinScore] = useState(0);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0); // For refreshing leaderboard

  const handleCellClick = useCallback(
    (index: number, isAutoMove = false) => {
      // Ignore click if cell is already filled, game is over, or AI is thinking (unless it's an auto-move)
      if (board[index] || winner || (isAIThinking && !isAutoMove)) return;

      // In PvE, only allow clicks when it's Player 1's turn (unless it's an auto-move)
      if (gameMode === "pve" && currentPlayer !== "1" && !isAutoMove) return;

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
          setP1Streak(0);
          setP0Streak(0);
          setLastWinScore(0);
        } else {
          const winnerLabel =
            newWinner === "1" ? "1" : gameMode === "pve" ? "AI" : "2";

          toast(`Player ${winnerLabel} wins! 🎉`, {
            className: "bg-sky-100 text-sky-800 border-sky-200",
          });

          let currentWinnerStreak = 1;
          if (newWinner === "1") {
            currentWinnerStreak = p1Streak + 1;
            setP1Streak(currentWinnerStreak);
            setP0Streak(0); // Reset opponent streak
          } else {
            currentWinnerStreak = p0Streak + 1;
            setP0Streak(currentWinnerStreak);
            setP1Streak(0); // Reset opponent streak
          }

          setLastWinScore(currentWinnerStreak);
          setWinnerPlayer(newWinner);

          // Show name dialog if a human won (or any win in PvP)
          if (gameMode === "pvp" || (gameMode === "pve" && newWinner === "1")) {
            setShowNameDialog(true);
          } else if (gameMode === "pve" && newWinner === "0") {
            // Auto-submit AI win without dialog
            handleSubmitName(
              `AI (${difficulty.toUpperCase()})`,
              currentWinnerStreak,
            );
          }
        }
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === "1" ? "0" : "1");
      }
    },
    [
      board,
      winner,
      isAIThinking,
      gameMode,
      currentPlayer,
      p1Streak,
      p0Streak,
      difficulty,
    ],
  );

  // AI Turn Logic
  useEffect(() => {
    if (
      gameMode === "pve" &&
      currentPlayer === "0" &&
      !winner &&
      !isAIThinking
    ) {
      const timer = setTimeout(() => {
        setIsAIThinking(true);

        // Brief delay to simulate "thinking" for better UX
        const thinkTimer = setTimeout(() => {
          const aiMove = getBestMove(board, "0", difficulty);
          if (aiMove !== -1) {
            handleCellClick(aiMove, true);
          }
          setIsAIThinking(false);
        }, 600);

        return () => clearTimeout(thinkTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [
    gameMode,
    currentPlayer,
    winner,
    board,
    difficulty,
    isAIThinking,
    handleCellClick,
  ]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("1");
    setWinner(null);
    setWinnerPlayer(null);
    setWinningPattern(null);
    setIsAIThinking(false);
    setLastWinScore(0);
    setShowNameDialog(false);
  };

  const handleChangeMode = () => {
    resetBoard();
    setPreviousGameMode(gameMode); // Save current mode before opening selector
    setGameMode(null); // Return to mode selector
    setP1Streak(0);
    setP0Streak(0);
  };

  const handleCloseModeSelector = () => {
    if (previousGameMode) {
      // User cancelled mode change, restore previous mode
      setGameMode(previousGameMode);
      setPreviousGameMode(null);
    } else {
      // Initial load with no previous mode - select default
      setGameMode("pve");
    }
  };

  const handleModeSelect = (mode: GameMode, diff: Difficulty) => {
    setPreviousGameMode(null); // Clear saved mode on selection
    // Only reset streaks if switching modes or difficulty
    if (gameMode !== mode || difficulty !== diff) {
      setP1Streak(0);
      setP0Streak(0);
    }
    setGameMode(mode);
    setDifficulty(diff);
  };

  const handleSubmitName = async (name: string, scoreOverride?: number) => {
    try {
      const score = scoreOverride !== undefined ? scoreOverride : lastWinScore;
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: "tech-tac-toe",
          name,
          score,
        }),
      });

      if (response.ok) {
        toast.success("Score saved to leaderboard!");
        setLeaderboardKey((prev) => prev + 1); // Refresh leaderboard
      } else {
        toast.error("Failed to save score.");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      toast.error("An error occurred while saving your score.");
    } finally {
      setShowNameDialog(false);
    }
  };

  const isFinished = winnerPlayer !== null;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 rounded-xl shadow-md">
      <GameModeSelector
        open={gameMode === null}
        onSelect={handleModeSelect}
        onClose={handleCloseModeSelector}
      />

      <PlayerNameDialog
        open={showNameDialog}
        score={lastWinScore}
        onSubmit={handleSubmitName}
        onCancel={() => setShowNameDialog(false)}
        title={
          gameMode === "pve"
            ? "You Win! 🏆"
            : winnerPlayer === "1"
              ? "Player 1 Wins! 🎉"
              : "Player 2 Wins! 🎉"
        }
        playerLabel={
          gameMode === "pvp"
            ? winnerPlayer === "1"
              ? "Player 1"
              : "Player 2"
            : undefined
        }
      />

      <GameHeader
        winnerPlayer={winnerPlayer}
        currentPlayer={currentPlayer}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        isAIThinking={isAIThinking}
        gameMode={gameMode}
        p1Streak={p1Streak}
        p0Streak={p0Streak}
      />

      <GameBoard
        board={board}
        winningPattern={winningPattern}
        handleCellClick={handleCellClick}
      />

      <LeaderboardPanel gameId="tech-tac-toe" leaderboardKey={leaderboardKey} />

      <div className="flex gap-2">
        <Button
          onClick={resetBoard}
          variant="outline"
          size="lg"
          className="bg-white border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Play Again
        </Button>
        <Button
          onClick={handleChangeMode}
          variant="ghost"
          size="lg"
          className="text-sky-600 hover:bg-sky-50"
        >
          Change Mode
        </Button>
      </div>
    </div>
  );
}
