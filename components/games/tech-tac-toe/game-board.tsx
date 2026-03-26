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
    <div className="grid grid-cols-3 gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-pink-200 shadow-md">
      {board.map((cell, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8 }}
          animate={{
            scale: 1,
            borderColor: winningPattern?.includes(index)
              ? "rgb(236 72 153)" // Highlighted winning cells
              : undefined,
          }}
          whileHover={{ scale: cell ? 1 : 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer flex items-center
                        justify-center border-2 transition-all rounded-xl ${
              cell
                ? "bg-fuchsia-50 border-fuchsia-300"
                : "bg-pink-50 border-pink-200 hover:border-pink-300 hover:bg-pink-50"
            } ${
              winningPattern?.includes(index)
                ? "border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)] bg-fuchsia-100"
                : ""
            }`}
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                  cell === "1" ? "text-green-400" : "text-pink-400"
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