"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { BoothPlayerType } from "@/lib/types";

type PlayersContextType = {
  players: BoothPlayerType[];
  setPlayers: React.Dispatch<React.SetStateAction<BoothPlayerType[]>>;
  currTeam1Player: BoothPlayerType | null;
  setCurrTeam1Player: React.Dispatch<
    React.SetStateAction<BoothPlayerType | null>
  >;
  currTeam2Player: BoothPlayerType | null;
  setCurrTeam2Player: React.Dispatch<
    React.SetStateAction<BoothPlayerType | null>
  >;
  isPlayerEntryDialogOpen: boolean;
  setIsPlayerEntryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatePlayersData: () => Promise<void>;
};

const PlayersContext = createContext<PlayersContextType | null>(null);

type PlayersProviderProps = {
  children: React.ReactNode;
};

export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  const [players, setPlayers] = useState<BoothPlayerType[]>([]);
  const [currTeam1Player, setCurrTeam1Player] =
    useState<BoothPlayerType | null>(null);
  const [currTeam2Player, setCurrTeam2Player] =
    useState<BoothPlayerType | null>(null);
  const [isPlayerEntryDialogOpen, setIsPlayerEntryDialogOpen] = useState(false);

  const updatePlayersData = useCallback(async () => {
    const response = await fetch("/api/players");
    const data = await response.json();
    setPlayers(data);
  }, []);

  return (
    <PlayersContext.Provider
      value={{
        players,
        setPlayers,
        currTeam1Player,
        setCurrTeam1Player,
        currTeam2Player,
        setCurrTeam2Player,
        isPlayerEntryDialogOpen,
        setIsPlayerEntryDialogOpen,
        updatePlayersData,
      }}
    >
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
