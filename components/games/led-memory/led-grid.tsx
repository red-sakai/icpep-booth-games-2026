"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { GameState, LED } from "@/lib/types";
import {
  LED_COLORS,
  LED_INACTIVE_COLORS,
} from "@/lib/game-utils/led-memory-utils";

type LEDGridProps = {
  activeLED: LED | null;
  gameState: GameState;
  handleLEDClick: (led: LED) => void;
};

export default function LEDGrid({
  activeLED,
  gameState,
  handleLEDClick,
}: LEDGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md">
      {[1, 2, 3, 4, 5, 6].map((led) => (
        <motion.div
          key={led}
          whileHover={{ scale: gameState === "guessing" ? 1.05 : 1 }}
          whileTap={{ scale: gameState === "guessing" ? 0.95 : 1 }}
        >
          <Card
            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full cursor-pointer flex items-center justify-center border-4 transition-all duration-200 ${
              activeLED === led
                ? `${LED_COLORS[led as LED]} shadow-lg border-white`
                : `${LED_INACTIVE_COLORS[led as LED]}`
            }`}
            onClick={() => handleLEDClick(led as LED)}
          >
            <div
              className={`absolute inset-0 rounded-full ${
                activeLED === led ? "opacity-70" : "opacity-0"
              } transition-opacity duration-200 blur-md ${
                LED_COLORS[led as LED]
              }`}
            />
            <span
              className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                activeLED === led ? "text-white" : "text-slate-700"
              }`}
            >
              {led}
            </span>
            {gameState === "guessing" && (
              <Lightbulb
                size={16}
                className="absolute bottom-2 right-2 text-slate-500 opacity-70"
              />
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
