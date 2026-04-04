"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Clock, Award, Info } from "lucide-react";
import type { RJ45GameState, Wire } from "@/lib/types";

type GameHeaderProps = {
  points: number;
  matchedWires: Wire[];
  correctWires: Wire[];
  gameState: RJ45GameState;
  timeLeft: number;
  totalTime: number;
  learnCountdown: number;
  timeExpired: boolean;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
};

export default function GameHeader({
  points,
  matchedWires,
  correctWires,
  gameState,
  timeLeft,
  totalTime,
  learnCountdown,
  timeExpired,
  showInfo,
  setShowInfo,
}: GameHeaderProps) {
  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  return (
    <div className="text-center space-y-3 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700 tracking-tight leading-tight">
          Connect Me Not: Ethernet Color Coding Game
        </h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="shrink-0 rounded-full p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-100/70 transition-colors"
          aria-label="Show information about RJ45 wiring"
        >
          <Info size={20} />
        </button>
      </div>

      <p className="text-sm sm:text-base text-purple-700/80 font-medium">
        Pick a standard, memorize the pattern, and wire it back before time runs out.
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span className="px-3 py-1 rounded-full bg-white/70 border border-purple-200 text-purple-700 font-medium">
          Score: {points}
        </span>
        {gameState === "arrange" && (
          <span className="px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200 text-amber-700 font-medium">
            Time: {timeLeft}s
          </span>
        )}
      </div>

      {gameState === "arrange" && (
        <div className="mx-auto w-full max-w-md">
          <div className="h-2.5 w-full rounded-full bg-white/55 border border-white/70 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                timeLeft <= 5 ? "bg-rose-400" : timeLeft <= 9 ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${timerPercentage}%` }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 backdrop-blur-md border border-white/50 p-3 rounded-xl shadow-sm text-sm text-purple-900">
              <p>
                RJ45 connectors use specific color patterns for network cables.
                T568A and T568B are the two standard wiring patterns used in
                Ethernet cables.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {gameState === "select" && (
        <div className="bg-white/50 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-sm">
          <p className="text-purple-800 text-base sm:text-sm">
            Select a wiring standard to begin. You&apos;ll need to memorize the
            pattern, then arrange the wires correctly in 15 seconds.
          </p>
        </div>
      )}

      {gameState === "learn" && (
        <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 p-3 rounded-xl shadow-sm">
          <AlertCircle size={20} />
          <p className="font-medium text-base sm:text-lg">
            Memorize this pattern! Jumbling in {learnCountdown}s...
          </p>
        </div>
      )}

      {gameState === "arrange" && (
        <div className="flex items-center justify-center space-x-2 text-amber-700 bg-amber-50/80 backdrop-blur-sm border border-amber-200 p-3 rounded-xl shadow-sm">
          <Clock size={20} />
          <p className="font-medium text-base sm:text-lg">
            Arrange the wires correctly before the timer runs out.
          </p>
        </div>
      )}

      {gameState === "success" && (
        <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 p-3 rounded-xl shadow-sm">
          <Award size={20} />
          <p className="font-medium text-base sm:text-lg">
            Perfect wiring! You win! You got {points} points:{" "}
            {matchedWires.length}/{correctWires.length} wires matched.
          </p>
        </div>
      )}

      {gameState === "failure" && (
        <div className="flex items-center justify-center space-x-2 text-rose-700 bg-rose-50/80 backdrop-blur-sm border border-rose-200 p-3 rounded-xl shadow-sm">
          <AlertCircle size={20} />
          <p className="font-medium text-base sm:text-lg">
            {timeExpired
              ? `Time's up! You got ${points} points: ${matchedWires.length}/${correctWires.length} wires matched.`
              : `Incorrect wiring! You got ${points} points: ${matchedWires.length}/${correctWires.length} wires matched.`}
          </p>
        </div>
      )}
    </div>
  );
}
