"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, RotateCcw, AlertCircle } from "lucide-react";

type GameState = "idle" | "showing" | "guessing" | "gameover" | "success";
type LED = 1 | 2 | 3 | 4 | 5 | 6;

// Light mode colors
const LED_COLORS = {
  1: "bg-red-500 shadow-red-500/50",
  2: "bg-amber-500 shadow-amber-500/50",
  3: "bg-emerald-500 shadow-emerald-500/50",
  4: "bg-sky-500 shadow-sky-500/50",
  5: "bg-purple-500 shadow-purple-500/50",
  6: "bg-pink-500 shadow-pink-500/50",
};

const LED_INACTIVE_COLORS = {
  1: "bg-red-100 border-red-300",
  2: "bg-amber-100 border-amber-300",
  3: "bg-emerald-100 border-emerald-300",
  4: "bg-sky-100 border-sky-300",
  5: "bg-purple-100 border-purple-300",
  6: "bg-pink-100 border-pink-300",
};

// Fixed pattern length
const PATTERN_LENGTH = 6;

export default function LEDMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<LED[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LED[]>([]);
  const [activeLED, setActiveLED] = useState<LED | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a random LED number (1-6)
  const getRandomLED = (): LED => {
    return (Math.floor(Math.random() * 6) + 1) as LED;
  };

  // Generate a full sequence of 10 patterns
  const generateFullSequence = (): LED[] => {
    const newSequence: LED[] = [];
    for (let i = 0; i < PATTERN_LENGTH; i++) {
      newSequence.push(getRandomLED());
    }
    return newSequence;
  };

  // Start a new game
  const startGame = useCallback(() => {
    const fullSequence = generateFullSequence();
    setSequence(fullSequence);
    setPlayerSequence([]);
    setGameState("showing");
    showSequence(fullSequence);
  }, []);

  // Show the sequence to the player
  const showSequence = useCallback((currentSequence: LED[]) => {
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
          }, 500); // Shorter delay between LEDs to make it harder
        }, 1000); // Shorter display time to make it harder
      } else {
        // Sequence finished, player's turn
        setActiveLED(null);
        setGameState("guessing");
        setPlayerSequence([]);
      }
    };

    // Start playing the sequence after a short delay
    timeoutRef.current = setTimeout(playStep, 1000);
  }, []);

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
      setGameState("gameover");

      // Update best score
      const currentScore = newPlayerSequence.length - 1;

      toast(
        `Game Over! You remembered ${currentScore} out of ${PATTERN_LENGTH} correctly.`,
        {
          className: "bg-amber-100 text-amber-800 border-amber-200",
        }
      );
      return;
    }

    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence!
      setGameState("success");

      toast(
        `Success! You memorized all ${PATTERN_LENGTH} patterns correctly!`,
        {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        }
      );
    }
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-xl shadow-md">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-amber-600">
          Memory LED Challenge
        </h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="flex justify-center text-slate-700 font-medium">
            {gameState === "idle" && (
              <div className="flex items-center gap-2">
                <Brain size={18} />
                <p>Press Start to test your memory!</p>
              </div>
            )}
            {gameState === "showing" && (
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle size={18} />
                <p>Memorize the pattern...</p>
              </div>
            )}
            {gameState === "guessing" && (
              <p>
                Repeat the pattern! ({playerSequence.length}/{PATTERN_LENGTH})
              </p>
            )}
            {gameState === "gameover" && "Game Over!"}
            {gameState === "success" && "Perfect memory!"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-6 p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md">
        {[1, 2, 3, 4, 5, 6].map((led) => (
          <motion.div
            key={led}
            whileHover={{ scale: gameState === "guessing" ? 1.05 : 1 }}
            whileTap={{ scale: gameState === "guessing" ? 0.95 : 1 }}
          >
            <Card
              className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full cursor-pointer flex items-center justify-center border-4 transition-all duration-200 ${
                activeLED === led
                  ? `${LED_COLORS[led as LED]} shadow-lg border-white`
                  : `${LED_INACTIVE_COLORS[led as LED]}`
              }`}
              onClick={() => handleLEDClick(led as LED)}
            >
              <div
                className={`absolute inset-0 rounded-full ${
                  activeLED === led ? "opacity-70" : "opacity-0"
                } transition-opacity duration-200 blur-md ${
                  LED_COLORS[led as LED]
                }`}
              />
              <span
                className={`text-2xl sm:text-3xl font-bold ${
                  activeLED === led ? "text-white" : "text-slate-700"
                }`}
              >
                {led}
              </span>
            </Card>
          </motion.div>
        ))}
      </div>

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
