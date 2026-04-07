"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { WireStandard, Wire, RJ45GameState, EGame } from "@/lib/types";
import { WIRE_STANDARDS } from "@/lib/game-utils/rj45-utils";
import GameHeader from "@/components/games/rj45/game-header";
import StandardSelection from "@/components/games/rj45/standard-selection";
import WirePattern from "@/components/games/rj45/wire-pattern";
import WireArrangement from "@/components/games/rj45/wire-arrangement";
import { useMediaQuery } from "@/hooks/use-media-query";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePlayers } from "@/contexts/players-context";
import { NotificationToaster } from "../../notification/notification-toaster";
import { LockInScoreDialog } from "@/components/confirmation/lock-in-score";

const TIME_BONUS_MULTIPLIER = 5;
const TOTAL_TIME = 15;
const LEARN_TIME = 5;
type RJ45GameProps = {
  gameId: string;
};
export default function RJ45Game({ gameId }: RJ45GameProps) {
  const [gameState, setGameState] = useState<RJ45GameState>("select");
  const [standard, setStandard] = useState<WireStandard>("T568A");
  const [wires, setWires] = useState<Wire[]>([]);
  const [correctWires, setCorrectWires] = useState<Wire[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCorrectPattern, setShowCorrectPattern] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [learnCountdown, setLearnCountdown] = useState(LEARN_TIME);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const { currTeam1Player } = usePlayers();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const learnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // scoring
  const [mathedWires, setMatchedWires] = useState<Wire[]>([]);
  const [score, setScore] = useState(0);
  const [isLockInScoreDialogOpen, setIsLockInScoreDialogOpen] = useState(false);

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  // Select a standard and start the game
  const selectStandard = (selected: WireStandard) => {
    if (!currTeam1Player) {
      toast.custom(
        () => (
          <NotificationToaster
            variant={"warning"}
            message={`No player detected!`}
            description={`Please make sure a player is selected before starting the game.`}
          />
        ),
        {
          duration: 5000,
          position: "top-center",
        },
      );
      return;
    }

    setLeaderboardOpen(false);
    setStandard(selected);
    setCorrectWires([...WIRE_STANDARDS[selected]]);
    setGameState("learn");
    setTimeExpired(false);
    setLearnCountdown(LEARN_TIME);

    if (learnTimerRef.current) {
      clearInterval(learnTimerRef.current);
    }

    learnTimerRef.current = setInterval(() => {
      setLearnCountdown((prev) => {
        if (prev <= 1) {
          if (learnTimerRef.current) {
            clearInterval(learnTimerRef.current);
          }

          const jumbledWires = [...WIRE_STANDARDS[selected]].sort(
            () => Math.random() - 0.5,
          );
          setWires(jumbledWires);
          setShowCorrectPattern(false);
          setGameState("arrange");
          startTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Simple timer function
  const startTimer = () => {
    setTimeLeft(TOTAL_TIME);
    setTimeExpired(false);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up
          clearInterval(timerRef.current!);
          setTimeExpired(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  // Effect to handle timer expiration
  useEffect(() => {
    if (timeExpired && gameState === "arrange") {
      const newMatchedWires = wires.filter(
        (wire, index) => wire.id === correctWires[index].id,
      );
      setMatchedWires(newMatchedWires);

      if (newMatchedWires.length === correctWires.length) {
        setGameState("success");
        const timeBonusScore = Math.round(
          (timeLeft / TOTAL_TIME) * TIME_BONUS_MULTIPLIER,
        );
        const newScore = 3 + timeBonusScore;
        setScore(newScore);
        toast.custom(
          () => (
            <NotificationToaster
              variant={"success"}
              message={`Congratulations <${currTeam1Player ? currTeam1Player.name : "Anonymous"}>!`}
              description={`You matched the wires perfectly on ${standard} standard and got a score of ${newScore}!`}
            />
          ),
          { duration: 5000, position: "top-center" },
        );
        setIsLockInScoreDialogOpen(true);
      } else {
        setGameState("failure");
        setShowCorrectPattern(true);
        // toast("Time's up! Incorrect wire arrangement.", {
        //   className: "bg-rose-100 text-rose-800 border-rose-200",
        // });
      }
    }
  }, [timeExpired, gameState, wires, correctWires]);

  // Check if the arrangement is correct (for manual check button)
  const checkArrangement = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const newMatchedWires = wires.filter(
      (wire, index) => wire.id === correctWires[index].id,
    );
    setMatchedWires(newMatchedWires);

    if (newMatchedWires.length === correctWires.length) {
      setGameState("success");
      const timeBonusScore = Math.round(
        (timeLeft / TOTAL_TIME) * TIME_BONUS_MULTIPLIER,
      );
      const newScore = 3 + timeBonusScore;
      setScore(newScore);
      toast.custom(
        () => (
          <NotificationToaster
            variant={"success"}
            message={`Congratulations ${currTeam1Player ? currTeam1Player.name : "Anonymous"}!`}
            description={`You matched the wires perfectly on ${standard} standard and got a score of ${newScore}!`}
          />
        ),
        { duration: 5000, position: "top-center" },
      );
    } else {
      // Game over - wrong arrangement
      setGameState("failure");
      setScore(0);
      setShowCorrectPattern(true); // Show the correct pattern
      // toast("Incorrect wire arrangement! Check the correct pattern.", {
      //   className: "bg-rose-100 text-rose-800 border-rose-200",
      // });
    }
    setIsLockInScoreDialogOpen(true);
  };

  // Reset the game
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setGameState("select");
    setWires([]);
    setCorrectWires([]);
    setMatchedWires([]);
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setLearnCountdown(LEARN_TIME);
    setShowCorrectPattern(true);
    setTimeExpired(false);
    setLeaderboardOpen(false);

    if (learnTimerRef.current) {
      clearInterval(learnTimerRef.current);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (learnTimerRef.current) {
        clearInterval(learnTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className="flex flex-col items-center justify-center p-4 md:p-8 space-y-6 
                relative overflow-hidden rounded-2xl shadow-2xl
                bg-gradient-to-br from-purple-300/15 via-white/20 to-fuchsia-300/15 backdrop-blur-xl
                border border-white/30 
                ring-1 ring-purple-200/20
                after:pointer-events-none after:absolute after:inset-0 after:-z-10
                after:content-[''] after:bg-gradient-to-br 
                after:from-purple-300/20 after:via-transparent after:to-purple-800/20"
    >
      <div className="pointer-events-none absolute -top-14 -left-10 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

      <LockInScoreDialog
        team="team1"
        isOpen={isLockInScoreDialogOpen}
        setIsOpen={setIsLockInScoreDialogOpen}
        gameName={EGame.RJ45_GAME}
        player={currTeam1Player}
        score={score}
      />

      <GameHeader
        points={score}
        matchedWires={mathedWires}
        correctWires={correctWires}
        gameState={gameState}
        timeLeft={timeLeft}
        totalTime={TOTAL_TIME}
        learnCountdown={learnCountdown}
        timeExpired={timeExpired}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />

      <div className="w-full max-w-4xl">
        {gameState === "select" && (
          <StandardSelection selectStandard={selectStandard} />
        )}

        {(gameState === "learn" ||
          (showCorrectPattern && gameState === "failure")) && (
          <WirePattern standard={standard} wires={correctWires} />
        )}

        {gameState === "arrange" && (
          <WireArrangement
            wires={wires}
            setWires={setWires}
            checkArrangement={checkArrangement}
            isMobile={isMobile}
            isLargeScreen={isLargeScreen}
          />
        )}
      </div>

      {(gameState === "success" || gameState === "failure") && (
        <Button
          onClick={resetGame}
          variant="outline"
          size="lg"
          className="bg-white/50 backdrop-blur-sm border-purple-300 hover:bg-purple-50/70 hover:border-purple-400 text-purple-600 shadow-sm rounded-xl"
        >
          <RotateCcw size={16} />
          Play Again
        </Button>
      )}

      <Button
        onClick={() => setLeaderboardOpen(true)}
        variant="outline"
        size="lg"
        className="bg-white/80 backdrop-blur-sm border-sky-200 hover:text-sky-700 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm rounded-xl"
      >
        Show Leaderboard
      </Button>

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl border-purple-100">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Leaderboard</DialogTitle>
            <DialogDescription>RJ45 scores and rankings</DialogDescription>
          </DialogHeader>
          <LeaderboardPanel
            gameId="rj45-game"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
