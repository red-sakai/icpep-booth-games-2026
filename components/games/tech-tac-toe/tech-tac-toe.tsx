"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import {
  DifficultyLevel,
  EDificultyMultiplyer,
  type BoardState,
  type GameMode,
  type Player,
} from "@/lib/types";
import { checkWinner } from "@/lib/game-utils/tech-tac-toe-utils";
import { getBestMove } from "@/lib/game-utils/tech-tac-toe-ai";
import GameHeader from "@/components/games/tech-tac-toe/game-header";
import GameBoard from "@/components/games/tech-tac-toe/game-board";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import { usePlayers } from "@/contexts/players-context";
import GameModeSelector from "@/components/games/tech-tac-toe/game-mode-selector";
import PlayerNameDialog from "@/components/games/tech-tac-toe/player-name-dialog";
import { submitScore } from "@/lib/leaderboard-utils/leaderboard-utils.client";
import { useLeaderboard } from "@/contexts/leaderboard-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TechTacToeProps = {
  gameId: string;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
};
export default function TechTacToe({
  gameId,
  gameMode,
  setGameMode,
}: TechTacToeProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const {
    currTeam1Player,
    currTeam2Player,
    setCurrTeam1Player,
    setCurrTeam2Player,
  } = usePlayers();
  const [currentTeam, setCurrentTeam] = useState<Player | null>(null);
  const [winnerTeam, setWinnerTeam] = useState<Player | "draw" | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const { updateLeaderboardData } = useLeaderboard();

  // AI & Game Mode State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [previousGameMode, setPreviousGameMode] = useState<GameMode>(null);

  // Leaderboard & Streak State
  const [p1Streak, setP1Streak] = useState(0);
  const [p0Streak, setP0Streak] = useState(0);
  const [lastWinScore, setLastWinScore] = useState(0);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0); // For refreshing leaderboard

  useEffect(() => {
    if (gameMode === "pve") {
      setCurrTeam2Player({
        name: `AI (${difficulty.toUpperCase()})`,
        color: "red",
        createdAt: new Date().toISOString(),
      });
    }
  }, [gameMode, setCurrTeam2Player, difficulty]);

  useEffect(() => {
    if (currTeam1Player && currTeam2Player) {
      setCurrentTeam("1");
      toast(`${currTeam1Player.name} starts!`, {
        className: "bg-sky-100 text-sky-800 border-sky-200",
      });
    }
  }, [currTeam1Player, currTeam2Player]);

  // update leaderboard for winner
  useEffect(() => {
    let winnerPlayerName: string | null = null;
    if (winnerTeam === "1" && currTeam1Player) {
      winnerPlayerName = currTeam1Player.name;
    } else if (winnerTeam === "0" && currTeam2Player) {
      winnerPlayerName = currTeam2Player.name;
    }
    if (winnerPlayerName) {
      const score = 1 * EDificultyMultiplyer[difficulty];
      submitScore({ gameId, score, name: winnerPlayerName });
      alert(
        `Congratulations ${winnerPlayerName}! Your score of ${score} has been submitted to the leaderboard!`,
      );
      updateLeaderboardData();
    }
  }, [winnerTeam]);

  const handleCellClick = useCallback(
    (index: number, isAutoMove = false) => {
      // Ignore click if cell is already filled, game is over, or AI is thinking (unless it's an auto-move)
      if (board[index] || winnerTeam || (isAIThinking && !isAutoMove)) return;

      // In PvE, only allow clicks when it's Team 1's turn (unless it's an auto-move)
      if (gameMode === "pve" && currentTeam !== "1" && !isAutoMove) return;

      const newBoard = [...board];
      newBoard[index] = currentTeam;
      setBoard(newBoard);

      const { winner: newWinner, pattern } = checkWinner(newBoard);

      if (newWinner) {
        setWinnerTeam(newWinner);
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
            newWinner === "1" ? currTeam1Player?.name : currTeam2Player?.name;

          toast(`Team ${winnerLabel} wins! 🎉`, {
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

          // Show name dialog if a human won (or any win in PvP)
          // updateLeaderboardForWinner();
          // if (gameMode === "pvp" || (gameMode === "pve" && newWinner === "1")) {
          // } else if (gameMode === "pve" && newWinner === "0") {
          //   // Auto-submit AI win without dialog
          //   handleSubmitName(
          //     `AI (${difficulty.toUpperCase()})`,
          //     currentWinnerStreak,
          //   );
          // }
        }
      } else {
        // Switch player
        setCurrentTeam(currentTeam === "1" ? "0" : "1");
      }
    },
    [
      board,
      winnerTeam,
      isAIThinking,
      gameMode,
      currentTeam,
      p1Streak,
      p0Streak,
      difficulty,
    ],
  );

  // AI Turn Logic
  useEffect(() => {
    if (
      gameMode === "pve" &&
      currentTeam === "0" &&
      !winnerTeam &&
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
    currentTeam,
    winnerTeam,
    board,
    difficulty,
    isAIThinking,
    handleCellClick,
  ]);

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentTeam("1");
    setWinnerTeam(null);
    setWinnerTeam(null);
    setWinningPattern(null);
    setIsAIThinking(false);
    setLastWinScore(0);
    setShowNameDialog(false);
  };

  const handleChangeMode = () => {
    resetBoard();
    setPreviousGameMode(gameMode);
    setGameMode(null);
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

  const handleModeSelect = (
    selectedGameMode: GameMode,
    selectedDiff: DifficultyLevel,
  ) => {
    // Only reset streaks if switching modes or difficulty
    if (gameMode !== selectedGameMode || difficulty !== selectedDiff) {
      setP1Streak(0);
      setP0Streak(0);
    }
    setGameMode(selectedGameMode);
    setDifficulty(selectedDiff);
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

  const isFinished = winnerTeam !== null;

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-sky-100 via-indigo-50 to-blue-100 rounded-xl shadow-md">
      <GameModeSelector
        currGameMode={previousGameMode}
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
            : winnerTeam === "1"
              ? "Team 1 Wins! 🎉"
              : "Team 2 Wins! 🎉"
        }
        playerLabel={
          gameMode === "pvp"
            ? winnerTeam === "1"
              ? "Team 1"
              : "Team 2"
            : undefined
        }
      />

      <GameHeader
        winnerTeam={winnerTeam}
        currentTeam={currentTeam}
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

      <Button
        onClick={() => setLeaderboardOpen(true)}
        variant="outline"
        size="lg"
        className="bg-white border-sky-200 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm"
      >
        Show Leaderboard
      </Button>

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl border-sky-100">
          <DialogHeader>
            <DialogTitle className="text-sky-900">Leaderboard</DialogTitle>
            <DialogDescription>
              Tech-Tac-Toe scores and rankings
            </DialogDescription>
          </DialogHeader>

          <LeaderboardPanel
            gameId="led-memory"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>

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
