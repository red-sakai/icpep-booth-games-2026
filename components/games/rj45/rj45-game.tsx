"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { WireStandard, Wire, RJ45GameState } from "@/lib/types";
import { WIRE_STANDARDS } from "@/lib/game-utils/rj45-utils";
import GameHeader from "@/components/games/rj45/game-header";
import StandardSelection from "@/components/games/rj45/standard-selection";
import WirePattern from "@/components/games/rj45/wire-pattern";
import WireArrangement from "@/components/games/rj45/wire-arrangement";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function RJ45Game() {
  const [gameState, setGameState] = useState<RJ45GameState>("select");
  const [standard, setStandard] = useState<WireStandard>("T568A");
  const [wires, setWires] = useState<Wire[]>([]);
  const [correctWires, setCorrectWires] = useState<Wire[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCorrectPattern, setShowCorrectPattern] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  // Select a standard and start the game
  const selectStandard = (selected: WireStandard) => {
    setStandard(selected);
    setCorrectWires([...WIRE_STANDARDS[selected]]);
    setGameState("learn");
    setTimeExpired(false);

    // Show the correct pattern for 5 seconds
    setTimeout(() => {
      // Jumble the wires
      const jumbledWires = [...WIRE_STANDARDS[selected]].sort(
        () => Math.random() - 0.5
      );
      setWires(jumbledWires);
      setShowCorrectPattern(false);
      setGameState("arrange");
      startTimer();
    }, 5000);
  };

  // Simple timer function
  const startTimer = () => {
    setTimeLeft(15);
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
      // Check if wiring is correct
      const isCorrect = wires.every(
        (wire, index) => wire.id === correctWires[index].id
      );

      if (isCorrect) {
        setGameState("success");
        toast(
          "Perfect arrangement! You've successfully wired the RJ45 connector!",
          {
            className: "bg-green-100 text-green-800 border-green-200",
          }
        );
      } else {
        setGameState("failure");
        setShowCorrectPattern(true);
        toast("Time's up! Incorrect wire arrangement.", {
          className: "bg-red-100 text-red-800 border-red-200",
        });
      }
    }
  }, [timeExpired, gameState, wires, correctWires]);

  // Check if the arrangement is correct (for manual check button)
  const checkArrangement = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const isCorrect = wires.every(
      (wire, index) => wire.id === correctWires[index].id
    );

    if (isCorrect) {
      // Success!
      setGameState("success");
      toast(
        "Perfect arrangement! You've successfully wired the RJ45 connector!",
        {
          className: "bg-green-100 text-green-800 border-green-200",
        }
      );
    } else {
      // Game over - wrong arrangement
      setGameState("failure");
      setShowCorrectPattern(true); // Show the correct pattern
      toast("Incorrect wire arrangement! Check the correct pattern.", {
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
  };

  // Reset the game
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setGameState("select");
    setWires([]);
    setCorrectWires([]);
    setTimeLeft(15);
    setShowCorrectPattern(true);
    setTimeExpired(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className="flex flex-col items-center justify-center p-4 md:p-8 space-y-6 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 rounded-xl shadow-md relative"
    >
      <GameHeader
        gameState={gameState}
        standard={standard}
        timeLeft={timeLeft}
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
          className="bg-white border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 shadow-md flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Play Again
        </Button>
      )}
    </div>
  );
}
