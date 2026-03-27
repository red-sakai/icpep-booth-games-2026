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
  timeExpired,
  showInfo,
  setShowInfo,
}: GameHeaderProps) {
  return (
    <div className="text-center space-y-3 max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-700 tracking-tight">
          Connect Me Not: Ethernet Color Coding Game
        </h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-cyan-600 hover:text-cyan-800 transition-colors"
          aria-label="Show information about RJ45 wiring"
        >
          <Info size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm text-slate-700">
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
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm">
          <p className="text-slate-700 text-base sm:text-lg">
            Select a wiring standard to begin. You&apos;ll need to memorize the
            pattern, then arrange the wires correctly in 15 seconds.
          </p>
        </div>
      )}

      {gameState === "learn" && (
        <div className="flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg shadow-sm">
          <AlertCircle size={20} />
          <p className="font-medium text-base sm:text-lg">
            Memorize this pattern! Jumbling in 5 seconds...
          </p>
        </div>
      )}

      {gameState === "arrange" && (
        <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg shadow-sm">
          <Clock size={20} />
          <p className="font-medium text-base sm:text-lg">
            Arrange the wires correctly! Time left: {timeLeft}s
          </p>
        </div>
      )}

      {gameState === "success" && (
        <div className="flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg shadow-sm">
          <Award size={20} />
          <p className="font-medium text-base sm:text-lg">
            Perfect wiring! You win! You got {points} points:{" "}
            {matchedWires.length}/{correctWires.length} wires matched.
          </p>
        </div>
      )}

      {gameState === "failure" && (
        <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg shadow-sm">
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
