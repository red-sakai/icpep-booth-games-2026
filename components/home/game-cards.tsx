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
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-2 border-amber-200 shadow-md h-full">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-md">
                <Lightbulb size={48} className="text-amber-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-amber-600 text-center mb-2">
              Memory LED Challenge
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Test your memory by repeating a sequence of 6 LED patterns in the
              correct order
            </p>
            <Button
              onClick={() => navigateTo("led-memory")}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              Play LED Memory
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tech Tac Toe Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="overflow-hidden border-2 border-sky-200 shadow-md h-full">
          <div className="bg-gradient-to-r from-sky-100 to-indigo-100 p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-md">
                <Grid3X3 size={48} className="text-sky-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-sky-700 text-center mb-2">
              Tech Tac Toe
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              A binary twist on the classic game with 1s and 0s instead of Xs
              and Os
            </p>
            <Button
              onClick={() => navigateTo("tech-tac-toe")}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
            >
              Play Tech Tac Toe
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* RJ45 Wiring Game Card */}
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="overflow-hidden border-2 border-cyan-200 shadow-md h-full">
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-md">
                <Cable size={48} className="text-cyan-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-cyan-700 text-center mb-2">
              RJ45 Wiring Challenge
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Arrange T568A/B wires correctly within 15 seconds to test your
              networking knowledge
            </p>
            <Button
              onClick={() => navigateTo("rj45-game")}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
            >
              Play RJ45 Game
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
