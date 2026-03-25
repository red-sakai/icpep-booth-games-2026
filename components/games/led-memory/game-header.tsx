"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertCircle, Clock, Info } from "lucide-react";
import type { GameState } from "@/lib/types";

type GameHeaderProps = {
  gameState: GameState;
  playerSequence: number[];
  sequenceLength: number;
  timeLeft: number;
  selectedLevel: "easy" | "medium" | "hard";
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
};

export default function GameHeader({
  gameState,
  playerSequence,
  sequenceLength,
  timeLeft,
  selectedLevel,
  showInfo,
  setShowInfo,
}: GameHeaderProps) {
  const progress =
    sequenceLength > 0
      ? Math.min(100, Math.round((playerSequence.length / sequenceLength) * 100))
      : 0;

  const totalPatterns = sequenceLength || 6;

  return (
    <div className="w-full max-w-2xl text-center space-y-4">
      <div className="flex items-start justify-center gap-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-rose-600">
            Memory Heist
          </h1>
          <p className="text-sm sm:text-base text-rose-900 mt-1">
            Guess the pattern of lights before time runs out.
          </p>
          <p className="text-xs sm:text-sm text-rose-700 mt-1 tracking-wide">
            Difficulty:{" "}
            <span className="font-semibold capitalize text-rose-800">
              {selectedLevel}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="shrink-0 mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full border border-transparent text-rose-500 hover:text-rose-700 hover:bg-rose-100/80 hover:border-rose-200 transition-colors"
          aria-label="Show information about LED Memory Challenge"
        >
          <Info size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white/40 backdrop-blur-md border border-white/50 p-4 rounded-xl shadow-sm text-sm text-rose-900">
              <p className="font-medium text-rose-800">How to play</p>
              <p className="mt-1">
                Watch the sequence of 6 LED lights and repeat it from memory
                within 20 seconds.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-rose-800 font-medium">
          {gameState === "idle" && (
            <div className="flex items-center gap-2 text-rose-700">
              <Brain size={18} />
              <p>Press Start to test your memory!</p>
            </div>
          )}
          {gameState === "showing" && (
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle size={18} />
              <p>Memorize the pattern...</p>
            </div>
          )}
          {gameState === "guessing" && (
            <div className="flex items-center gap-2 text-rose-700">
              <Clock size={18} className="text-rose-500" />
              <p>
                Repeat the pattern! ({playerSequence.length}/{sequenceLength})
              </p>
              <span className="px-2.5 py-0.5 rounded-full border border-rose-300 bg-rose-100/60 text-rose-800 text-xs sm:text-sm">
                {timeLeft}s left
              </span>
            </div>
          )}
          {gameState === "gameover" && (
            <p className="text-rose-700">Game Over! Try again?</p>
          )}
          {gameState === "success" && (
            <p className="text-emerald-700">Perfect memory! Try again?</p>
          )}
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-xs text-rose-700 mb-1.5">
            <span>Progress</span>
            <span>{playerSequence.length}/{totalPatterns}</span>
          </div>
          <div className="h-1.5 rounded-full bg-rose-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-300"
              style={{ width: `${gameState === "guessing" ? progress : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
