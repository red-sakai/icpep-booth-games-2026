"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { GameState, LED } from "@/lib/types";
import { generateFullSequence } from "@/lib/game-utils/led-memory-utils";
import GameHeader from "@/components/games/led-memory/game-header";
import LEDGrid from "@/components/games/led-memory/led-grid";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LEDMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<LED[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LED[]>([]);
  const [activeLED, setActiveLED] = useState<LED | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start the 20-second timer for guessing
  const startGuessingTimer = useCallback(() => {
    setTimeLeft(20);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Time's up - game over
          setGameState("gameover");
          toast(
            `Time's up! You remembered ${playerSequence.length} out of ${sequence.length} correctly.`,
            {
              className: "bg-amber-100 text-amber-800 border-amber-200",
            }
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [playerSequence.length, sequence.length]);

  // Start a new game
  const startGame = useCallback(() => {
    setLeaderboardOpen(false);
    const fullSequence = generateFullSequence();
    setSequence(fullSequence);
    setPlayerSequence([]);
    setGameState("showing");
    showSequence(fullSequence);
  }, []);

  // Show the sequence to the player
  const showSequence = useCallback(
    (currentSequence: LED[]) => {
      let step = 0;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const playStep = () => {
        if (step < currentSequence.length) {
          // Light up the LED
          setActiveLED(currentSequence[step]);

          // Turn off after a delay
          timeoutRef.current = setTimeout(() => {
            setActiveLED(null);

            // Wait before showing the next LED
            timeoutRef.current = setTimeout(() => {
              step++;
              playStep();
            }, 400); // Longer delay between LEDs to make it easier
          }, 800); // Longer display time to make it easier
        } else {
          // Sequence finished, player's turn
          setActiveLED(null);
          setGameState("guessing");
          setPlayerSequence([]);
          startGuessingTimer(); // Start the 20-second timer
        }
      };

      // Start playing the sequence after a short delay
      timeoutRef.current = setTimeout(playStep, 1000);
    },
    [startGuessingTimer]
  );

  // Handle player clicking an LED
  const handleLEDClick = (led: LED) => {
    if (gameState !== "guessing") return;

    // Light up the LED briefly
    setActiveLED(led);
    setTimeout(() => setActiveLED(null), 200);

    // Add to player sequence
    const newPlayerSequence = [...playerSequence, led];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input is correct so far
    const isCorrectSoFar = newPlayerSequence.every(
      (led, index) => led === sequence[index]
    );

    if (!isCorrectSoFar) {
      // Wrong input, game over
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("gameover");

      const currentScore = newPlayerSequence.length - 1;
      toast(
        `Game Over! You remembered ${currentScore} out of ${sequence.length} correctly.`,
        {
          className: "bg-amber-100 text-amber-800 border-amber-200",
        }
      );
      return;
    }

    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence!
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("success");

      toast(
        `Success! You memorized all ${sequence.length} patterns correctly!`,
        {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        }
      );
    }
  };

  // Clean up timeouts when component unmounts or game resets
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // // Reset game and clear timers
  // const resetGame = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //   }
  //   setGameState("idle");
  //   setTimeLeft(20);
  // };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-xl shadow-md">
      <GameHeader
        gameState={gameState}
        playerSequence={playerSequence}
        sequenceLength={sequence.length}
        timeLeft={timeLeft}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />

      <LEDGrid
        activeLED={activeLED}
        gameState={gameState}
        handleLEDClick={handleLEDClick}
      />

      {(gameState === "gameover" || gameState === "success") && (
        <Button
          onClick={() => setLeaderboardOpen(true)}
          variant="outline"
          size="lg"
          className="bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 shadow-sm"
        >
          Show Leaderboard
        </Button>
      )}

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>LED Memory scores and rankings</DialogDescription>
          </DialogHeader>

          <LeaderboardPanel
            gameId="led-memory"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>

      <div className="flex space-x-4">
        <Button
          onClick={startGame}
          variant="outline"
          size="lg"
          className="bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 shadow-sm flex items-center gap-2"
        >
          <RotateCcw size={16} />
          {gameState === "idle" ||
          gameState === "gameover" ||
          gameState === "success"
            ? "Start Challenge"
            : "Restart"}
        </Button>
      </div>
    </div>
  );
}
