"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

// Game components
import TechTacToe from "@/components/games/tech-tac-toe/tech-tac-toe";
import LEDMemoryGame from "@/components/games/led-memory/led-memory-game";
import RJ45Game from "@/components/games/rj45/rj45-game";

// Home page components
import GameHeader from "@/components/home/game-header";
import HowToJoinSection from "@/components/home/how-to-join-section";
import GameMechanicsSection from "@/components/home/game-mechanics-section";
import GameCards from "@/components/home/game-cards";
import BackToHomeButton from "@/components/home/back-to-home-button";

// Types
import { GameType } from "@/lib/types";
import { PlayersProvider } from "@/contexts/players-context";
import { PlayersSelection } from "@/components/home/players-selection";

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameType>("home");

  const navigateTo = (game: GameType) => {
    setCurrentGame(game);
  };

  // Render the current game or home screen
  const renderContent = () => {
    switch (currentGame) {
      case "tech-tac-toe":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <BackToHomeButton navigateTo={navigateTo} variant="sky" />
              <PlayersSelection playerCount={2} />
            </div>
            <TechTacToe />
          </div>
        );
      case "led-memory":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <BackToHomeButton navigateTo={navigateTo} variant="amber" />
              <PlayersSelection playerCount={1} />
            </div>
            <LEDMemoryGame />
          </div>
        );
      case "rj45-game":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <BackToHomeButton navigateTo={navigateTo} variant="cyan" />
              <PlayersSelection playerCount={1} />
            </div>
            <RJ45Game />
          </div>
        );
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <GameHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <HowToJoinSection />
              <GameMechanicsSection />
            </div>
            <GameCards navigateTo={navigateTo} />
          </div>
        );
    }
  };

  return (
    <PlayersProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {currentGame !== "home" && (
          <div className="fixed bottom-4 right-4">
            <Button
              onClick={() => navigateTo("home")}
              size="icon"
              className="rounded-full bg-white text-sky-600 hover:bg-sky-50 shadow-md"
              aria-label="Return to home"
            >
              <Home size={20} />
            </Button>
          </div>
        )}
      </div>
    </PlayersProvider>
  );
}
