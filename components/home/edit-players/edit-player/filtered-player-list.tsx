import { usePlayers } from "@/contexts/players-context";
import { getPlayers } from "@/lib/players-utils/players.client";
import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";

type FilteredPlayerListProps = {
  filterNameValue: string;
  filterColor: string;
  selectedPlayer: BoothPlayerType | null;
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<BoothPlayerType | null>
  >;
};

export const FilteredPlayerList = ({
  filterNameValue,
  filterColor,
  selectedPlayer,
  setSelectedPlayer,
}: FilteredPlayerListProps) => {
  const { players, setPlayers } = usePlayers();
  const [filteredPlayers, setFilteredPlayers] =
    useState<BoothPlayerType[]>(players);

  useEffect(() => {
    const getPlayersData = async () => {
      const allPlayers = await getPlayers();
      setPlayers(allPlayers);
    };
    getPlayersData();
  }, [players]);

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(filterNameValue.toLowerCase()) &&
        (player.color.includes(filterColor) || filterColor === "all"),
    );
    setFilteredPlayers(filtered);
  }, [filterNameValue, filterColor, players]);

  const handlePlayerClick = (player: BoothPlayerType) => {
    if (player.name === selectedPlayer?.name) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
    }
  };

  return (
    <section
      className={cn(
        "h-full w-full bg-slate-50 overflow-y-auto",
        "outline outline-slate-200 rounded-lg",
        "shadow-[inset_4px_0_4px_-4px_rgba(0,0,0,0.1),inset_0_4px_8px_-4px_rgba(0,0,0,0.1)]",
        "flex flex-col",
      )}
    >
      <div className="flex-1 w-full flex flex-col gap-2 p-2">
        {[...filteredPlayers].reverse().map((player) => (
          <AnimatePresence key={player.name}>
            <PlayerItem
              player={player}
              selectedPlayer={selectedPlayer}
              onClick={() => handlePlayerClick(player)}
            />
          </AnimatePresence>
        ))}
      </div>
    </section>
  );
};

type PlayerItemProps = {
  player: BoothPlayerType;
  selectedPlayer: BoothPlayerType | null;
  onClick: () => void;
};
const PlayerItem = ({ player, selectedPlayer, onClick }: PlayerItemProps) => {
  return (
    <motion.button
      key={player.name}
      className={cn(
        "flex items-center justify-center gap-2",
        "px-4 py-2 rounded-lg bg-slate-50 shadow-sm",
        "border border-slate-200",
      )}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
    >
      <span
        className="size-4 rounded-full opacity-80"
        style={{ backgroundColor: player.color }}
      ></span>
      <span className="text-md text-gray-700 font-medium">{player.name}</span>
      {selectedPlayer?.name === player.name ? (
        <CheckCircle className={cn("size-5 ml-auto")} />
      ) : (
        <Circle className={cn("size-5 text-gray-200 ml-auto")} />
      )}
    </motion.button>
  );
};
