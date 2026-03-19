import React, { useEffect } from "react";
import { BoothPlayerType } from "@/lib/types";

type PlayersContextType = {
  players: BoothPlayerType[];
  setPlayers: React.Dispatch<React.SetStateAction<BoothPlayerType[]>>;
  currentPlayers: {
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  };
  setCurrentPlayers: React.Dispatch<
    React.SetStateAction<{
      player1: BoothPlayerType | null;
      player2: BoothPlayerType | null;
    }>
  >;
  isPlayerSelectionModalOpen: boolean;
  setIsPlayerSelectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayersContext = React.createContext<PlayersContextType | null>(null);

type PlayersProviderProps = {
  children: React.ReactNode;
};
export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  const [players, setPlayers] = React.useState<BoothPlayerType[]>([]);
  const [currentPlayers, setCurrentPlayers] = React.useState<{
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  }>({ player1: null, player2: null });
  const [isPlayerSelectionModalOpen, setIsPlayerSelectionModalOpen] =
    React.useState(false);

  return (
    <PlayersContext.Provider
      value={{
        players,
        setPlayers,
        currentPlayers,
        setCurrentPlayers,
        isPlayerSelectionModalOpen,
        setIsPlayerSelectionModalOpen,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = React.useContext(PlayersContext);
  if (!context) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};
