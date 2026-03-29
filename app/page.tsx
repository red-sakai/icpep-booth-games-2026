"use client";

import { useEffect, useState } from "react";
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
import GameSelectorCarousel from "@/components/home/game-selector-carousel";
import BackToHomeButton from "@/components/home/back-to-home-button";

// Types
import { GameMode, GameType } from "@/lib/types";
import { EditPlayers } from "@/components/home/edit-players/edit-players";
import { usePlayers } from "@/contexts/players-context";
import { useLeaderboard } from "@/contexts/leaderboard-context";

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameType>("home");
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const { updatePlayersData, setCurrTeam1Player, setCurrTeam2Player } =
    usePlayers();
  const { updateLeaderboardData } = useLeaderboard();

  useEffect(() => {
    updatePlayersData();
    updateLeaderboardData();
  }, []);

  useEffect(() => {
    setCurrTeam1Player(null);
    setCurrTeam2Player(null);
  }, [setCurrTeam1Player, setCurrTeam2Player, currentGame]);

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
              <BackToHomeButton navigateTo={navigateTo} variant="pink" />
              <EditPlayers gameMode={gameMode} openOnMount={false} />
            </div>
            <TechTacToe
              gameId="tech-tac-toe"
              gameMode={gameMode}
              setGameMode={setGameMode}
            />
          </div>
        );
      case "led-memory":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <BackToHomeButton navigateTo={navigateTo} variant="rose" />
              <EditPlayers gameMode="solo" />
            </div>
            <LEDMemoryGame gameId="led-memory" />
          </div>
        );
      case "rj45-game":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <BackToHomeButton navigateTo={navigateTo} variant="purple" />
              <EditPlayers gameMode="solo" />
            </div>
            <RJ45Game gameId="rj45-game" />
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
            <GameSelectorCarousel navigateTo={navigateTo} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-200 to-rose-200 p-4 md:p-8">
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
            className="rounded-full bg-white text-pink-600 hover:bg-pink-50 shadow-md"
            aria-label="Return to home"
          >
            <Home size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
