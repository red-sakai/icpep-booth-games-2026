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
    <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md">
      {board.map((cell, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8 }}
          animate={{
            scale: 1,
            borderColor: winningPattern?.includes(index)
              ? "rgb(14, 165, 233)" // Highlighted winning cells
              : undefined,
          }}
          whileHover={{ scale: cell ? 1 : 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer flex items-center justify-center ${
              cell
                ? "bg-sky-50 border-sky-200"
                : "bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50"
            } ${
              winningPattern?.includes(index)
                ? "border-2 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                : ""
            }`}
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                  cell === "1" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {cell}
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
