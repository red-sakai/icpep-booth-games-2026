"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Lightbulb, Cable } from "lucide-react";
import type { GameType } from "@/lib/types";

type GameCardsProps = {
  navigateTo: (game: GameType) => void;
};

export default function GameCards({ navigateTo }: GameCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {/* Memory LED Challenge Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{
          type: "spring",
          stiffness: 300,
          duration: 0.3,
          delay: 0.1,
        }} // Combined transition
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden border-2 border-rose-400 shadow-lg h-full">
          <div className="p-6 h-full flex flex-col bg-gradient-to-b from-rose-200 via-rose-100 to-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <Lightbulb size={48} className="text-rose-500" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-rose-600 text-center mb-2">
              Memory Heist: Guess the Pattern of Lights
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Test your memory by repeating a sequence of 6 LED patterns in the
              correct order
            </p>
            <Button
              onClick={() => navigateTo("led-memory")}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-none font-semibold"
            >
              Play LED Memory
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tech Tac Toe Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{
          type: "spring",
          stiffness: 300,
          duration: 0.3,
          delay: 0.1,
        }} // Combined transition
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden border-2 border-pink-400 shadow-lg h-full">
          <div className="p-6 h-full flex flex-col bg-gradient-to-b from-pink-200 via-pink-100 to-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <Grid3X3 size={48} className="text-pink-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-pink-600 text-center mb-2">
              Tech Tac Toe
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              A binary twist on the classic game with 1s and 0s instead of Xs
              and Os
            </p>
            <Button
              onClick={() => navigateTo("tech-tac-toe")}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-none font-semibold"
            >
              Play Tech Tac Toe
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* RJ45 Wiring Game Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{
          type: "spring",
          stiffness: 300,
          duration: 0.3,
          delay: 0.1,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden border-2 border-purple-400 shadow-lg h-full">
          <div className="p-6 h-full flex flex-col bg-gradient-to-b from-purple-200 via-purple-100 to-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <Cable size={48} className="text-purple-500" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-purple-600 text-center mb-2">
              Connect Me Not: Ethernet Color Coding Game
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Arrange T568A/B wires correctly within 15 seconds to test your
              networking knowledge
            </p>
            <Button
              onClick={() => navigateTo("rj45-game")}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-none font-semibold"
            >
              Play RJ45 Game
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}