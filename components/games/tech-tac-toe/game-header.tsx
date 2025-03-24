"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Trophy } from "lucide-react";
import type { Player } from "@/lib/types";

type GameHeaderProps = {
  winner: Player | "draw" | null;
  currentPlayer: Player;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
};

export default function GameHeader({
  winner,
  currentPlayer,
  showInfo,
  setShowInfo,
}: GameHeaderProps) {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-700">
          Tech Tac Toe
        </h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-sky-600 hover:text-sky-800 transition-colors"
          aria-label="Show information about Tech Tac Toe"
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
                A binary twist on the classic game with 1s and 0s instead of Xs
                and Os. Get three in a row to win!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <p className="text-slate-700 font-medium">
          {winner ? (
            winner === "draw" ? (
              "Game ended in a draw!"
            ) : (
              <span className="flex items-center justify-center gap-1">
                <Trophy
                  size={16}
                  className={
                    winner === "1" ? "text-emerald-500" : "text-rose-500"
                  }
                />
                Player {winner} wins!
              </span>
            )
          ) : (
            `Current player: ${currentPlayer}`
          )}
        </p>
      </div>
    </div>
  );
}
