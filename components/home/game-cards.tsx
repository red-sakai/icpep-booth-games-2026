"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3, Lightbulb, Cable } from "lucide-react";
import type { GameType } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";

type GameCardsProps = {
  navigateTo: (game: GameType) => void;
};

export default function GameCards({ navigateTo }: GameCardsProps) {
  const [leaderboardGame, setLeaderboardGame] = useState<GameType | null>(null);

  const leaderboardMeta = useMemo(() => {
    switch (leaderboardGame) {
      case "led-memory":
        return { title: "LED Memory" };
      case "tech-tac-toe":
        return { title: "Tech Tac Toe" };
      case "rj45-game":
        return { title: "RJ45" };
      default:
        return null;
    }
  }, [leaderboardGame]);

  return (
    <>
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
        <Card className="overflow-hidden border-2 border-amber-200 shadow-md h-full">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-md">
                <Lightbulb size={48} className="text-amber-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-amber-600 text-center mb-2">
              Memory Heist: Guess the Pattern of Lights
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Test your memory by repeating a sequence of 6 LED patterns in the
              correct order
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => setLeaderboardGame("led-memory")}
                variant="outline"
                className="w-full bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 shadow-sm"
              >
                Leaderboards
              </Button>
              <Button
                onClick={() => navigateTo("led-memory")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
              >
                Play LED Memory
              </Button>
            </div>
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
            <div className="space-y-2">
              <Button
                onClick={() => setLeaderboardGame("tech-tac-toe")}
                variant="outline"
                className="w-full bg-white border-sky-200 hover:bg-sky-50 hover:border-sky-300 text-sky-700 shadow-sm"
              >
                Leaderboards
              </Button>
              <Button
                onClick={() => navigateTo("tech-tac-toe")}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
              >
                Play Tech Tac Toe
              </Button>
            </div>
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
        <Card className="overflow-hidden border-2 border-cyan-200 shadow-md h-full">
          <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 h-full flex flex-col">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-md">
                <Cable size={48} className="text-cyan-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-cyan-700 text-center mb-2">
              Connect Me Not: Ethernet Color Coding Game
            </h2>
            <p className="text-slate-600 text-center mb-6 flex-grow">
              Arrange T568A/B wires correctly within 15 seconds to test your
              networking knowledge
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => setLeaderboardGame("rj45-game")}
                variant="outline"
                className="w-full bg-white border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 shadow-sm"
              >
                Leaderboards
              </Button>
              <Button
                onClick={() => navigateTo("rj45-game")}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
              >
                Play RJ45 Game
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
      </div>

      <Dialog
        open={leaderboardGame !== null}
        onOpenChange={(open) => setLeaderboardGame(open ? leaderboardGame : null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>
              {leaderboardMeta ? `${leaderboardMeta.title} records` : ""}
            </DialogDescription>
          </DialogHeader>

          {leaderboardGame && leaderboardGame !== "home" && (
            <LeaderboardPanel
              gameId={leaderboardGame}
              limit={9999}
              className="w-full max-w-none"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
