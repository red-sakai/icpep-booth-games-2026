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
      {/* Title Area */}
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-400 drop-shadow-sm tracking-tight">
          Tech Tac Toe
        </h1>   
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-pink-400 hover:text-pink-600 transition-colors bg-white/50 p-1.5 rounded-full hover:bg-white shadow-sm"
          aria-label="Show information about Tech Tac Toe"
        >
          <Info size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-pink-200 p-3 rounded-xl shadow-lg text-sm text-pink-900 mb-2 font-medium">
              <p>
                A binary twist on the classic game with 1s and 0s instead of Xs
                and Os. Get three in a row to win!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Turn Cards */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        {/* Team 1 (Pink Theme) */}
        <div 
          className={cn(
          "bg-white border border-pink-200 rounded-xl p-2 shadow-sm border-b-4 transition-all duration-300",
          currentTeam === "1" && !winnerTeam
            ? "bg-white/90 border-pink-400 scale-105 shadow-[0_4px_20px_rgba(236,72,153,0.2)]"
            : "bg-white/40 border-transparent opacity-70 hover:opacity-100",
        )}>
          <div className="text-xs font-bold text-pink-600/80 uppercase tracking-wider">Team 1</div>
          <div className="text-xl sm:text-2xl font-black text-pink-600 flex items-center justify-center gap-2 drop-shadow-sm">
            <span>1</span>
            {p1Streak > 0 && (
              <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-pink-200">
                <Trophy size={12} /> {p1Streak}
              </span>
            )}
          </div>
        </div>

        {/* Team 2 / AI (Fuchsia Theme) */}
        <div 
          className={cn(
          "bg-white border border-fuchsia-200 rounded-xl p-2 shadow-sm border-b-4 transition-all duration-300",
          currentTeam === "0" && !winnerTeam
            ? "bg-white/90 border-fuchsia-400 scale-105 shadow-[0_4px_20px_rgba(217,70,239,0.2)]"
            : "bg-white/40 border-transparent opacity-70 hover:opacity-100",
        )}>
          <div className="text-xs font-bold text-fuchsia-600/80 uppercase tracking-wider">
            {gameMode === "pve" ? "AI" : "Team 2"}
          </div>
          <div className="text-xl sm:text-2xl font-black text-fuchsia-600 flex items-center justify-center gap-2 drop-shadow-sm">
            <span>0</span>
            {p0Streak > 0 && (
              <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-fuchsia-200">
                <Trophy size={12} /> {p0Streak}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white/60 backdrop-blur-xl border border-pink-100/50 rounded-xl p-3 sm:p-4 shadow-lg min-w-[200px] transition-all">
        <div className="font-bold tracking-wide">
          {winnerTeam ? (
            winnerTeam === "draw" ? (
              <span className="text-pink-600">Game ended in a draw!</span>
            ) : (
              <span className={cn(
                "flex items-center justify-center gap-2 text-lg drop-shadow-sm",
                winnerTeam === "1" ? "text-pink-600" : "text-pink-600"
              )}>
                <Trophy size={20} className="animate-bounce" />
                {getPlayerLabel(winnerTeam)} wins!
              </span>
            )
          ) : isAIThinking ? (
            <span className="flex items-center justify-center gap-2 text-pink-500 animate-pulse">
              <Cpu size={18} className="animate-spin-slow" />
              AI is thinking...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-pink-700">
              Current turn:{" "}
              <span className={cn(
                "px-2 py-0.5 rounded-md bg-white shadow-sm border",
                currentTeam === "1" ? "text-pink-600 border-pink-200" : "text-fuchsia-600 border-pink-200"
              )}>
                {getPlayerLabel(currentTeam || "1")}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}