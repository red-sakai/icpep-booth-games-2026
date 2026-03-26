import { usePlayers } from "@/contexts/players-context";
import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";

type FilteredPlayerListProps = {
  team: "team1" | "team2";
  filterNameValue: string;
  filterColor: string;
  selectedPlayer: BoothPlayerType | null;
  setSelectedPlayer: React.Dispatch<
    React.SetStateAction<BoothPlayerType | null>
  >;
};

export const FilteredPlayerList = ({
  team,
  filterNameValue,
  filterColor,
  selectedPlayer,
  setSelectedPlayer,
}: FilteredPlayerListProps) => {
  const { players, updatePlayersData, currTeam1Player, currTeam2Player } =
    usePlayers();
  const [filteredPlayers, setFilteredPlayers] =
    useState<BoothPlayerType[]>(players);

  useEffect(() => {
    updatePlayersData();
  }, [players]);

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(filterNameValue.toLowerCase()) &&
        (player.color.includes(filterColor) || filterColor === "all"),
    );
    setFilteredPlayers(filtered);
  }, [filterNameValue, filterColor, players]);

  const handlePlayerItemClick = (player: BoothPlayerType) => {
    if (["AI (EASY)", "AI (MEDIUM)", "AI (HARD)"].includes(player.name)) {
      alert("AI players cannot be selected. Please choose a different player.");
      return;
    }
    switch (team) {
      case "team1":
        if (selectedPlayer?.name === player.name) {
          setSelectedPlayer(null);
        } else if (currTeam2Player?.name === player.name) {
          alert(
            "Player is already selected for Team 2. Please choose a different player.",
          );
        } else {
          setSelectedPlayer(player);
        }
        break;
      case "team2":
        if (selectedPlayer?.name === player.name) {
          setSelectedPlayer(null);
        } else if (currTeam1Player?.name === player.name) {
          alert(
            "Player is already selected for Team 1. Please choose a different player.",
          );
        } else {
          setSelectedPlayer(player);
        }
        break;
    }
  };

  return (
    <section
      className={cn(
        "h-full w-full bg-slate-50 overflow-y-auto",
        "outline outline-slate-200 rounded-lg",
        "shadow-[inset_4px_0_4px_-4px_rgba(0,0,0,0.1),inset_0_4px_8px_-4px_rgba(0,0,0,0.1)]",
      )}
      onWheelCapture={(e) => e.stopPropagation()}
      onTouchMoveCapture={(e) => e.stopPropagation()}
    >
      <div className="w-full flex flex-col gap-2 p-2">
        {[...filteredPlayers].reverse().map((player) => (
          <AnimatePresence key={player.name}>
            <PlayerItem
              team={team}
              player={player}
              selectedPlayer={selectedPlayer}
              onClick={() => handlePlayerItemClick(player)}
            />
          </AnimatePresence>
        ))}
      </div>
    </section>
  );
};

type PlayerItemProps = {
  team: "team1" | "team2";
  player: BoothPlayerType;
  selectedPlayer: BoothPlayerType | null;
  onClick: () => void;
};
const PlayerItem = ({
  team,
  player,
  selectedPlayer,
  onClick,
}: PlayerItemProps) => {
  const { currTeam1Player, currTeam2Player } = usePlayers();

  const getButtonClasses = () => {
    if (team === "team1") {
      return selectedPlayer?.name === player.name
        ? "bg-sky-400/20 border-sky-600/80 text-sky-600"
        : player.name === currTeam2Player?.name
          ? "border-rose-700/80 text-rose-700 bg-rose-400/20 cursor-not-allowed"
          : "hover:border-sky-600/80 text-sky-700";
    } else if (team === "team2") {
      return selectedPlayer?.name === player.name
        ? "bg-rose-400/20 border-rose-700/80 text-rose-700"
        : player.name === currTeam1Player?.name
          ? "border-sky-600/80 text-sky-600 bg-sky-400/20 cursor-not-allowed"
          : "hover:border-rose-700/80 text-rose-700";
    } else return "";
  };

  const getIsChecked = () => {
    if (team === "team1") {
      return (
        selectedPlayer?.name === player.name ||
        currTeam2Player?.name === player.name
      );
    } else if (team === "team2") {
      return (
        selectedPlayer?.name === player.name ||
        currTeam1Player?.name === player.name
      );
    } else return false;
  };

  const getCheckedPlayerTeam = () => {
    if (team === "team1") {
      if (selectedPlayer?.name === player.name) return "- Team 1";
      else if (currTeam2Player?.name === player.name) return "- Team 2";
      else return null;
    } else if (team === "team2") {
      if (selectedPlayer?.name === player.name) return "- Team 2";
      else if (currTeam1Player?.name === player.name) return "- Team 1";
      else return null;
    }
  };

  return (
    <motion.button
      key={player.name}
      className={cn(
        "group flex items-center justify-center gap-2",
        "px-4 py-2 rounded-lg bg-slate-50 shadow-sm",
        "border border-slate-200",
        "transition-all duration-200",
        getButtonClasses(),
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
      <span className="text-md font-medium">{player.name}</span>
      <span className="text-sm ml-2">{getCheckedPlayerTeam()}</span>
      {getIsChecked() ? (
        <CheckCircle className="size-5 ml-auto" />
      ) : (
        <Circle
          className={cn(
            "size-5 text-slate-300 ml-auto",
            team === "team1"
              ? "group-hover:text-sky-600/80"
              : "group-hover:text-rose-600/80",
            "transition-colors duration-200",
          )}
        />
      )}
    </motion.button>
  );
};
