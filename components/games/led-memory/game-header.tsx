"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertCircle, Clock, Info } from "lucide-react";
import type { GameState } from "@/lib/types";

type GameHeaderProps = {
  gameState: GameState;
  playerSequence: number[];
  sequenceLength: number;
  timeLeft: number;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
};

export default function GameHeader({
  gameState,
  playerSequence,
  sequenceLength,
  timeLeft,
  showInfo,
  setShowInfo,
}: GameHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600">
          Memory LED Challenge
        </h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-amber-600 hover:text-amber-800 transition-colors"
          aria-label="Show information about LED Memory Challenge"
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
                Watch the sequence of 6 LED lights and repeat it from memory
                within 20 seconds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              <p>
                Repeat the pattern! ({playerSequence.length}/{sequenceLength}) -
                Time: {timeLeft}s
              </p>
            </div>
          )}
          {gameState === "gameover" && "Game Over! Try again?"}
          {gameState === "success" && "Perfect memory! Try again?"}
        </div>
      </div>
    </div>
  );
}
