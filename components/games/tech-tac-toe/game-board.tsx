"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { BoardState } from "@/lib/types";

type GameBoardProps = {
  board: BoardState;
  winningPattern: number[] | null;
  handleCellClick: (index: number) => void;
};

export default function GameBoard({
  board,
  winningPattern,
  handleCellClick,
}: GameBoardProps) {
  return (
    // Vibrant frosted glass container with a glowing violet shadow
    <div className="p-5 sm:p-6 rounded-2xl bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(236,72,153,0.2)] border border-pink-100/60">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {board.map((cell, index) => {
          const isWinningCell = winningPattern?.includes(index);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: isWinningCell
                  ? ["0px 0px 15px rgba(236,72,153,0.4)", "0px 0px 30px rgba(236,72,153,0.7)", "0px 0px 15px rgba(236,72,153,0.4)"]
                  : "0px 0px 0px rgba(236,72,153,0)",
              }}
              transition={{
                duration: 0.3,
                delay: isWinningCell ? 0 : index * 0.05,
                boxShadow: isWinningCell
                  ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  : { duration: 0.3 },
              }}
              whileHover={{ scale: cell ? 1 : 1.05 }}
              whileTap={{ scale: cell ? 1 : 0.95 }}
              className="rounded-xl"
            >
              <Card
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-pointer flex items-center justify-center transition-all duration-300 ${
                  cell
                    ? "bg-gradient-to-br from-pink-50 to-fuchsia-50 border-pink-200"
                    : "bg-white/70 border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 hover:bg-white"
                } ${
                  isWinningCell
                    ? "border-pink-400 bg-pink-50 ring-2 ring-pink-400/60 z-10"
                    : cell ? "shadow-inner" : ""
                }`}
                onClick={() => handleCellClick(index)}
              >
                {cell && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2, rotate: -60 }}
                    animate={{
                      opacity: 1,
                      scale: isWinningCell ? [1, 1.1, 1] : 1,
                      rotate: 0,
                    }}
                    transition={{
                      scale: isWinningCell
                        ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                        : { type: "spring", stiffness: 300, damping: 20 },
                      rotate: { type: "spring", stiffness: 300, damping: 20 },
                      opacity: { duration: 0.2 },
                    }}
                    className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter drop-shadow-md ${
                      cell === "1" ? "text-pink-500" : "text-fuchsia-500"
                    }`}
                  >
                    {cell}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}