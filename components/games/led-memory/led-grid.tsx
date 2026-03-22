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
  const canInteract = gameState === "guessing";

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      <p className="text-center text-sm sm:text-base text-slate-600">
        {canInteract
          ? "Tap the LEDs in exact order."
          : "Watch closely for the sequence."}
      </p>

      <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6 justify-items-center">
        {[1, 2, 3, 4, 5, 6].map((led) => (
          <motion.div
            key={led}
            whileHover={{ scale: canInteract ? 1.04 : 1 }}
            whileTap={{ scale: canInteract ? 0.97 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <Card
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-[3px] transition-all duration-200 ease-out ${
                canInteract ? "cursor-pointer" : "cursor-not-allowed"
              } ${
                activeLED === led
                  ? `${LED_COLORS[led as LED]} shadow-lg border-white scale-105`
                  : `${LED_INACTIVE_COLORS[led as LED]} shadow-sm opacity-90`
              }`}
              onClick={() => handleLEDClick(led as LED)}
              aria-disabled={!canInteract}
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
              {canInteract && (
                <Lightbulb
                  size={14}
                  className="absolute bottom-2 right-2 text-slate-600 opacity-60"
                />
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
