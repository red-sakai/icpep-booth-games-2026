import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";

type PlayerSelectionListProps = {
  tab: "1" | "2";
  filterNameValue: string;
  filterColor: string;
  players: BoothPlayerType[];
  selectedPlayers: {
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  };
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<{
      player1: BoothPlayerType | null;
      player2: BoothPlayerType | null;
    }>
  >;
};

export const PlayerSelectionList = ({
  tab,
  filterNameValue,
  filterColor,
  players,
  selectedPlayers,
  setSelectedPlayers,
}: PlayerSelectionListProps) => {
  const [filteredPlayers, setFilteredPlayers] =
    useState<BoothPlayerType[]>(players);

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(filterNameValue.toLowerCase()) &&
        (player.color.includes(filterColor) || filterColor === "all"),
    );
    setFilteredPlayers(filtered);
  }, [filterNameValue, filterColor, players]);

  return (
    <section
      className={cn(
        "h-full w-full min-h-0 p-1 pb-3 bg-slate-50",
        "outline outline-slate-200 rounded-lg",
        "shadow-[inset_4px_0_4px_-4px_rgba(0,0,0,0.1),inset_0_4px_8px_-4px_rgba(0,0,0,0.1)]",
      )}
    >
      <div className={cn("h-full w-full p-2", "overflow-y-auto")}>
        <div className="h-full flex flex-col gap-2">
          {[...filteredPlayers].reverse().map((player) => (
            <AnimatePresence key={player.id}>
              <PlayerItem
                player={player}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
                tab={tab}
              />
            </AnimatePresence>
          ))}
        </div>
      </div>
    </section>
  );
};

type PlayerItemProps = {
  player: BoothPlayerType;
  selectedPlayers: {
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  };
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<{
      player1: BoothPlayerType | null;
      player2: BoothPlayerType | null;
    }>
  >;
  tab: "1" | "2";
};
const PlayerItem = ({
  player,
  selectedPlayers,
  setSelectedPlayers,
  tab,
}: PlayerItemProps) => {
  const handlePlayerSelect = () => {
    setSelectedPlayers((prev) => {
      const updatedSelectedPlayers = { ...prev };
      if (tab === "1") {
        if (prev.player2?.id !== player.id) {
          updatedSelectedPlayers.player1 =
            prev.player1?.id === player.id ? null : player;
        }
      } else if (tab === "2") {
        if (prev.player1?.id !== player.id) {
          updatedSelectedPlayers.player2 =
            prev.player2?.id === player.id ? null : player;
        }
      }
      return updatedSelectedPlayers;
    });
  };

  return (
    <motion.button
      key={player.id}
      className={cn(
        "py-1 px-4 flex gap-4",
        "items-center justify-start rounded-md",
        "outline shadow-md",

        selectedPlayers.player1?.id === player.id &&
          "bg-blue-200/80 outline-blue-400",
        selectedPlayers.player2?.id === player.id &&
          "bg-red-200/80 outline-red-400",

        "cursor-pointer",
        (tab === "1" && selectedPlayers.player2?.id === player.id) ||
          (tab === "2" && selectedPlayers.player1?.id === player.id)
          ? "cursor-not-allowed"
          : "hover:-translate-0.5 active:translate-0.5",

        selectedPlayers.player1?.id !== player.id &&
          selectedPlayers.player2?.id !== player.id &&
          "group outline-slate-200 bg-slate-50 hover:bg-slate-200",

        "transition-all duration-200",
      )}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={handlePlayerSelect}
    >
      <span
        className="size-4 rounded-full opacity-80"
        style={{ backgroundColor: player.color }}
      ></span>
      <span className="text-md text-gray-700 font-medium">{player.name}</span>
      {selectedPlayers.player1?.id === player.id ||
      selectedPlayers.player2?.id === player.id ? (
        <CheckCircle
          className={cn(
            "size-5 ml-auto",
            selectedPlayers.player1?.id === player.id && "text-blue-400",
            selectedPlayers.player2?.id === player.id && "text-red-400",
          )}
        />
      ) : (
        <Circle
          className={cn(
            "size-5 text-gray-200 ml-auto",
            tab === "1" && "group-hover:text-blue-300/80",
            tab === "2" && "group-hover:text-red-300/80",
          )}
        />
      )}
    </motion.button>
  );
};
