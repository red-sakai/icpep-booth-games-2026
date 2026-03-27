"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Grid3X3,
  Lightbulb,
  Cable,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import type { GameType } from "@/lib/types";

type GameCardsProps = {
  navigateTo: (game: GameType) => void;
};

interface GameOption {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: {
    from: string;
    to: string;
    accent: string;
    button: string;
    buttonHover: string;
  };
}

const games: GameOption[] = [
  {
    id: "led-memory",
    title: "Memory Heist",
    description:
      "Test your memory by repeating a sequence of 6 LED patterns in the correct order. Challenge yourself and climb the leaderboard!",
    icon: <Lightbulb size={100} />,
    color: {
      from: "from-rose-400",
      to: "to-rose-600",
      accent: "bg-rose-500",
      button: "bg-rose-500",
      buttonHover: "hover:bg-rose-600",
    },
  },
  {
    id: "tech-tac-toe",
    title: "Tech Tac Toe",
    description:
      "A binary twist on the classic game with 1s and 0s instead of Xs and Os. Strategic gameplay meets digital innovation.",
    icon: <Grid3X3 size={100} />,
    color: {
      from: "from-pink-400",
      to: "to-pink-600",
      accent: "bg-pink-500",
      button: "bg-pink-600",
      buttonHover: "hover:bg-pink-700",
    },
  },
  {
    id: "rj45-game",
    title: "Ethernet Challenge",
    description:
      "Master the art of RJ45 connector wiring standards. Learn T568A and T568B in this interactive challenge.",
    icon: <Cable size={100} />,
    color: {
      from: "from-purple-500",
      to: "to-fuchsia-600",
      accent: "bg-purple-500",
      button: "bg-purple-600",
      buttonHover: "hover:bg-purple-700",
    },
  },
];

export default function GameSelectorCarousel({ navigateTo }: GameCardsProps) {
  const [current, setCurrent] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setCurrent((prev) => (prev + newDirection + games.length) % games.length);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [paginate]);

  const game = games[current];

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
      {/* Main carousel container */}
      <div className="flex flex-col md:flex-row gap-0">
        {/* Left - Featured Game Card with overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-1/2 relative min-h-72 md:min-h-96 overflow-hidden group"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${game.color.from} ${game.color.to} opacity-30`}
            />

            {/* Icon background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="text-white">{game.icon}</div>
            </div>

            {/* Content overlay - removed for better background visibility */}

            <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
              {/* Top spacer */}
              <div />

              {/* Bottom - Title and play button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {game.title}
                </h2>

                <Button
                  onClick={() => navigateTo(game.id)}
                  className={`${game.color.button} ${game.color.buttonHover} text-white font-bold px-6 py-3 shadow-lg flex items-center gap-2`}
                >
                  <Play size={20} fill="white" />
                  Play Now
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right - Thumbnails carousel */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col p-4 md:p-6 gap-4 h-full md:justify-between">
          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`desc-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-20 md:h-24"
            >
              <p className="text-sm md:text-base text-slate-700 leading-relaxed line-clamp-3">
                {game.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Thumbnails grid */}
          <div className="flex flex-col justify-center flex-1 min-h-0">
            {/* Thumbnails container */}
            <div className="flex gap-3 justify-center">
                {games.map((g, index) => (
                  <motion.button
                    key={g.id}
                    onClick={() => setCurrent(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-28 h-40 rounded-lg overflow-hidden border-2 transition-all ${
                      index === current
                        ? "border-slate-900 shadow-md"
                        : "border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`bg-gradient-to-br ${g.color.from} ${g.color.to} w-full h-full flex items-center justify-center relative group`}
                    >
                      {/* Play icon overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play
                          size={32}
                          fill="white"
                          className="text-white"
                        />
                      </div>

                      {/* Icon */}
                      <div className="text-white scale-50">{g.icon}</div>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-2">
            {games.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-8 bg-slate-900"
                    : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to game ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          aria-label="Previous game"
        >
          <ChevronLeft size={24} />
        </motion.button>

        <p className="text-xs text-slate-500">
          Use arrow keys or click to navigate
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          aria-label="Next game"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}
