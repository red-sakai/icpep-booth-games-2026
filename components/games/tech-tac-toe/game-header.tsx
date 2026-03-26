"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Trophy, Cpu } from "lucide-react";
import type { GameMode, Player } from "@/lib/types";
import { cn } from "@/lib/utils";

type GameHeaderProps = {
  winnerTeam: Player | "draw" | null;
  currentTeam: Player | null;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  isAIThinking?: boolean;
  gameMode?: GameMode;
  p1Streak?: number;
  p0Streak?: number;
};

export default function GameHeader({
  winnerTeam,
  currentTeam,
  showInfo,
  setShowInfo,
  isAIThinking,
  gameMode,
  p1Streak = 0,
  p0Streak = 0,
}: GameHeaderProps) {
  const getPlayerLabel = (player: Player) => {
    if (!player) {
      return "Waiting...";
    }
    if (gameMode === "pve") {
      return player === "1" ? "Team (1)" : "AI (0)";
    }
    return `Team ${player}`;
  };

  return (
    <div className="text-center space-y-3 w-full max-w-md">
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
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm text-slate-700 mb-2">
              <p>
                A binary twist on the classic game with 1s and 0s instead of Xs
                and Os. Get three in a row to win!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div
          className={cn(
            "bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm border-b-4 transition-all",
            currentTeam === "1" && !winnerTeam
              ? "border-sky-500 scale-105"
              : "border-transparent opacity-80",
          )}
        >
          <div className="text-xs font-bold text-sky-600 uppercase">Team 1</div>
          <div className="text-lg font-black text-sky-900 flex items-center justify-center gap-1">
            <span className="text-2xl">1</span>
            {p1Streak > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Trophy size={10} /> {p1Streak}
              </span>
            )}
          </div>
        </div>

        <div
          className={cn(
            "bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm border-b-4 transition-all",
            currentTeam === "0" && !winnerTeam
              ? "border-sky-500 scale-105"
              : "border-transparent opacity-80",
          )}
        >
          <div className="text-xs font-bold text-sky-600 uppercase">
            {gameMode === "pve" ? "AI" : "Team 2"}
          </div>
          <div className="text-lg font-black text-sky-900 flex items-center justify-center gap-1">
            <span className="text-2xl">0</span>
            {p0Streak > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Trophy size={10} /> {p0Streak}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm min-w-[200px]">
        <div className="text-slate-700 font-medium">
          {winnerTeam ? (
            winnerTeam === "draw" ? (
              "Game ended in a draw!"
            ) : (
              <span className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
                <Trophy size={18} />
                {getPlayerLabel(winnerTeam)} wins!
              </span>
            )
          ) : isAIThinking ? (
            <span className="flex items-center justify-center gap-2 text-sky-600 animate-pulse">
              <Cpu size={16} />
              AI is thinking...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Current turn: {getPlayerLabel(currentTeam || "1")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
