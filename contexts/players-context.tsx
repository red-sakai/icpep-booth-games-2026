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

  // smaple players
  useEffect(() => {
    setPlayers([
      { id: "1", name: "Alice", color: "red" },
      { id: "2", name: "Bob", color: "blue" },
      { id: "3", name: "Charlie", color: "green" },
      { id: "4", name: "Diana", color: "yellow" },
      { id: "5", name: "Eve", color: "purple" },
      { id: "6", name: "Frank", color: "orange" },
      { id: "7", name: "Grace", color: "pink" },
      { id: "8", name: "Heidi", color: "cyan" },
      { id: "9", name: "Ivan", color: "teal" },
      { id: "10", name: "Judy", color: "magenta" },
      { id: "11", name: "Karl", color: "lime" },
      { id: "12", name: "Leo", color: "indigo" },
      { id: "13", name: "Mallory", color: "brown" },
      { id: "14", name: "Nina", color: "gray" },
      { id: "15", name: "Oscar", color: "black" },
      { id: "16", name: "Peggy", color: "skyblue" },
      { id: "17", name: "Quentin", color: "gold" },
      { id: "18", name: "Ruth", color: "lightgreen" },
      { id: "19", name: "Sybil", color: "violet" },
      { id: "20", name: "Trent", color: "navy" },
    ]);
  }, []);

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
