"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import {
  BoothPlayerType,
  DifficultyLevel,
  EDificultyMultiplyer,
  EGame,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationToaster } from "../../notification/notification-toaster";
import { LockInScoreDialog } from "@/components/confirmation/lock-in-score";

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
  const { currTeam1Player, currTeam2Player, setCurrTeam2Player, players } =
    usePlayers();
  const [currentTeam, setCurrentTeam] = useState<Player | null>(null);
  const [winnerTeam, setWinnerTeam] = useState<Player | "draw" | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [score, setScore] = useState(0);
  const [isLockInScoreDialogOpen, setIsLockInScoreDialogOpen] = useState(false);

  // AI & Game Mode State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [previousGameMode, setPreviousGameMode] = useState<GameMode>(null);

  // Leaderboard & Streak State
  const [p1Streak, setP1Streak] = useState(0);
  const [p0Streak, setP0Streak] = useState(0);
  const [lastWinScore, setLastWinScore] = useState(0);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    if (gameMode === "pve") {
      const aiName = `AI (${difficulty.toUpperCase()})`;
      const existingAIPlayer = players.find((p) => p.name === aiName);
      if (existingAIPlayer) {
        setCurrTeam2Player(existingAIPlayer);
      } else {
        const newAIPlayer: BoothPlayerType = {
          name: aiName,
          color: "gray",
          status: {
            "tech-tac-toe": { playsRemaining: null, isLocked: false },
            "led-memory": { playsRemaining: null, isLocked: false },
            "rj45-game": { playsRemaining: null, isLocked: false },
          },
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };
        // createPlayer(newAIPlayer);
        setCurrTeam2Player(newAIPlayer);
      }
    }
  }, [gameMode, setCurrTeam2Player, difficulty]);

  useEffect(() => {
    if (currTeam1Player && currTeam2Player) {
      setCurrentTeam("1");
      toast.custom(
        () => (
          <NotificationToaster
            variant={"rose"}
            message={`Start!`}
            description={`Player <${currTeam1Player ? currTeam1Player.name : "Anonymous"}> will start the game!`}
          />
        ),
        { duration: 5000 },
      );
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
      if (winnerTeam === "draw") {
        toast.custom(
          () => (
            <NotificationToaster
              variant={"purple"}
              message={"It's a draw!"}
              description={"No team/player won this round."}
            />
          ),
          { duration: 5000 },
        );
      }

      if (winnerPlayerName === `AI (${difficulty.toUpperCase()})`) {
        toast.custom(
          () => (
            <NotificationToaster
              variant={winnerTeam === "1" ? "sky" : "rose"}
              message={`${winnerPlayerName} won!`}
              description={`Player <${currTeam1Player?.name}> got ${0} points!`}
            />
          ),
          { duration: 5000 },
        );
        setScore(0);
        setIsLockInScoreDialogOpen(true);
      }

      if (winnerPlayerName !== `AI (${difficulty.toUpperCase()})`) {
        let newScore = 0;
        if (gameMode === "pve") {
          newScore = 2 * EDificultyMultiplyer[difficulty];
        } else {
          newScore = 5; // pvp
        }
        toast.custom(
          () => (
            <NotificationToaster
              variant={winnerTeam === "1" ? "sky" : "rose"}
              message={`Player <${winnerPlayerName}> won!`}
              description={`You got ${newScore} points!`}
            />
          ),
          { duration: 5000 },
        );
        setScore(newScore);
        setIsLockInScoreDialogOpen(true);
      }
    }
  }, [winnerTeam]);

  const handleCellClick = useCallback(
    (index: number, isAutoMove = false) => {
      if (board[index] || winnerTeam || (isAIThinking && !isAutoMove)) return;
      if (gameMode === "pve" && currentTeam !== "1" && !isAutoMove) return;

      const newBoard = [...board];
      newBoard[index] = currentTeam;
      setBoard(newBoard);

      const { winner: newWinner, pattern } = checkWinner(newBoard);

      if (newWinner) {
        setWinnerTeam(newWinner);
        setWinningPattern(pattern);

        if (newWinner === "draw") {
          // toast("It's a draw!", {
          //   className: "bg-pink-100 text-pink-800 border-pink-200",
          // });
          setP1Streak(0);
          setP0Streak(0);
          setLastWinScore(0);
        } else {
          const winnerLabel =
            newWinner === "1" ? currTeam1Player?.name : currTeam2Player?.name;

          // toast(`Team ${winnerLabel} wins!`, {
          //   className: "bg-pink-100 text-pink-800 border-pink-200",
          // });

          let currentWinnerStreak = 1;
          if (newWinner === "1") {
            currentWinnerStreak = p1Streak + 1;
            setP1Streak(currentWinnerStreak);
            setP0Streak(0);
          } else {
            currentWinnerStreak = p0Streak + 1;
            setP0Streak(currentWinnerStreak);
            setP1Streak(0);
          }

          setLastWinScore(currentWinnerStreak);
        }
      } else {
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
      currTeam1Player,
      currTeam2Player,
    ],
  );

  useEffect(() => {
    if (
      gameMode === "pve" &&
      currentTeam === "0" &&
      !winnerTeam &&
      !isAIThinking
    ) {
      const timer = setTimeout(() => {
        setIsAIThinking(true);
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
    setWinningPattern(null);
    setIsAIThinking(false);
    setLastWinScore(0);
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
      setGameMode(previousGameMode);
      setPreviousGameMode(null);
    } else {
      setGameMode("pve");
    }
  };

  const handleModeSelect = (
    selectedGameMode: GameMode,
    selectedDiff: DifficultyLevel,
  ) => {
    if (gameMode !== selectedGameMode || difficulty !== selectedDiff) {
      setP1Streak(0);
      setP0Streak(0);
    }
    setGameMode(selectedGameMode);
    setDifficulty(selectedDiff);
  };

  // const handleSubmitName = async (name: string, scoreOverride?: number) => {
  //   try {
  //     const score = scoreOverride !== undefined ? scoreOverride : lastWinScore;
  //     const response = await fetch("/api/leaderboard", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         gameId: "tech-tac-toe",
  //         name,
  //         score,
  //       }),
  //     });
  //
  //     if (response.ok) {
  //       toast.success("Score saved to leaderboard!");
  //       setLeaderboardKey((prev) => prev + 1);
  //     } else {
  //       toast.error("Failed to save score.");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting score:", error);
  //     toast.error("An error occurred while saving your score.");
  //   } finally {
  //     setShowNameDialog(false);
  //   }
  // };
  //
  return (
    <div
      className="flex flex-col items-center justify-center p-6 space-y-6 bg-
                    [radial-gradient(ellipse_80%_60%_at_50%_40%,_#fce7f3_0%,_#fbcfe8_50%,_#fda4af_100%)] 
                    rounded-2xl shadow-xl border border-pink-200"
    >
      <LockInScoreDialog
        isOpen={isLockInScoreDialogOpen}
        setIsOpen={setIsLockInScoreDialogOpen}
        gameName={EGame.TECH_TAC_TOE}
        player={
          gameMode === "pve"
            ? currTeam1Player
            : winnerTeam === "1"
              ? currTeam1Player
              : currTeam2Player
        }
        score={score}
      />

      <GameModeSelector
        currGameMode={previousGameMode}
        open={gameMode === null}
        onSelect={handleModeSelect}
        onClose={handleCloseModeSelector}
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

      {/* Buttons MOVED UP to be directly under the board */}
      <div className="flex gap-3 mt-2 w-full max-w-[320px] justify-center">
        <Button
          onClick={resetBoard}
          variant="outline"
          size="lg"
          className="bg-white/50 backdrop-blur-sm border-pink-300 hover:bg-pink-50/70 
                    hover:border-pink-400 text-pink-600 shadow-sm flex items-center gap-2 rounded-xl"
        >
          <RotateCcw size={16} />
          Play Again
        </Button>
        <Button
          onClick={handleChangeMode}
          variant="ghost"
          size="lg"
          className="bg-white/80 backdrop-blur-sm border-pink-200 hover:bg-pink-50 hover:border-pink-300 text-pink-600 
                       shadow-sm flex items-center gap-2 transition-all rounded-xl"
        >
          Change Mode
        </Button>
      </div>

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

      <div className="w-full mt-4 justify-center flex">
        <LeaderboardPanel
          gameId="tech-tac-toe"
          leaderboardKey={leaderboardKey}
        />
      </div>
    </div>
  );
}
