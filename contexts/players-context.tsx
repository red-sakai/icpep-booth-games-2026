"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { BoothPlayerType } from "@/lib/types";

type CurrentPlayersType = {
  player1: BoothPlayerType | null;
  player2: BoothPlayerType | null;
}

type PlayersContextType = {
  players: BoothPlayerType[];
  setPlayers: React.Dispatch<React.SetStateAction<BoothPlayerType[]>>;
  currentPlayers: CurrentPlayersType;
  setCurrentPlayers: React.Dispatch<React.SetStateAction<CurrentPlayersType>>;
  isPlayerSelectionModalOpen: boolean;
  setIsPlayerSelectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayersContext = createContext<PlayersContextType | null>(null);

type PlayersProviderProps = {
  children: React.ReactNode;
};

export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  const [players, setPlayers] = useState<BoothPlayerType[]>([]);
  const [currentPlayers, setCurrentPlayers] = useState<CurrentPlayersType>({ player1: null, player2: null });
  const [isPlayerSelectionModalOpen, setIsPlayerSelectionModalOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      players,
      setPlayers,
      currentPlayers,
      setCurrentPlayers,
      isPlayerSelectionModalOpen,
      setIsPlayerSelectionModalOpen,
    }),
    [players, currentPlayers, isPlayerSelectionModalOpen]
  );


  return (
    <PlayersContext.Provider value={contextValue}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
