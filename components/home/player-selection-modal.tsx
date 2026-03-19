"use client";

import type { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlayers } from "@/contexts/players-context";
import { Card } from "../ui/card";
import { Plus, CheckCircle, Circle, CircleDashed } from "lucide-react";
import { useEffect, useState } from "react";

type PlayerSelectionModalProps = {
  playerNumber: 1 | 2;
};
export const PlayerSelectionModal = ({
  playerNumber,
}: PlayerSelectionModalProps) => {
  const {
    players,
    setPlayers,
    currentPlayers,
    setCurrentPlayers,
    setOpenPlayerSelectionModal,
  } = usePlayers();
  const [filterValue, setFilterValue] = useState("");

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const [selectedPlayer, setSelectedPlayer] = useState<BoothPlayerType | null>(
    null,
  );
  const [selectedOpponent, setSelectedOpponent] =
    useState<BoothPlayerType | null>(null);

  useEffect(() => {
    console.log(playerNumber, currentPlayers);
    if (playerNumber === 1) {
      setSelectedPlayer(currentPlayers.player1);
      setSelectedOpponent(currentPlayers.player2);
    } else {
      setSelectedPlayer(currentPlayers.player2);
      setSelectedOpponent(currentPlayers.player1);
    }
  }, [playerNumber, currentPlayers]);

  const handleConfirm = () => {
    if (selectedPlayer) {
      if (playerNumber === 1) {
        setCurrentPlayers((prev) => ({
          ...prev,
          player1: selectedPlayer,
        }));
      } else {
        setCurrentPlayers((prev) => ({
          ...prev,
          player2: selectedPlayer,
        }));
      }
      setOpenPlayerSelectionModal(null);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-20 flex flex-col gap-4",
        "backdrop-blur-xs bg-white/20",
        "flex items-center justify-center",
      )}
    >
      <Card
        className={cn("max-h-120 w-120 h-120 rounded-xl border-none shadow-md")}
      >
        <div
          className={cn(
            "bg-gradient-to-r p-6 outline-2",
            playerNumber === 1
              ? "from-blue-100/80 to-blue-300/80 outline-blue-500/80"
              : "from-red-100/80 to-red-300/80 outline-red-500/80",
            "h-full flex flex-col gap-4 rounded-xl border-none",
          )}
        >
          <section className="">
            <h2
              className={cn(
                "text-2xl font-bold",
                playerNumber === 1 ? "text-blue-500" : "text-red-500",
              )}
            >
              Choose/Create Player {playerNumber}
            </h2>

            <p className="text-base text-gray-700">
              Select an existing player or create a new one to start playing!
            </p>
          </section>

          <section className="flex gap-2 items-center">
            <input
              placeholder="Filter players..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={cn(
                "outline-2 outline-slate-200 rounded-lg shadow-md",
                "h-8 w-full px-2 bg-slate-50",
                "text-gray-700 text-base",
                playerNumber === 1
                  ? "hover:outline-blue-500/80"
                  : "hover:outline-red-500/80",
                "transition-all duration-200",
              )}
            />
            <div>
              <button
                className={cn(
                  "outline-2 outline-slate-200 rounded-lg shadow-md",
                  "size-8 bg-slate-50",
                  "flex items-center justify-center",
                  "cursor-pointer active:scale-90 transition-transform",
                  "hover:scale-110",
                  playerNumber === 1
                    ? "hover:outline-blue-500/80"
                    : "hover:outline-red-500/80",
                )}
              >
                <Plus className="size-6 text-gray-700" />
              </button>
            </div>
          </section>

          <section className="flex gap-2 items-center justify-start">
            <div className={cn("flex items-center gap-4", "mt-auto")}>
              <span className="text-gray-500 text-base">Player 1: </span>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedPlayer ? "text-blue-500/80" : "text-gray-500/80",
                  )}
                >
                  {selectedPlayer?.name || "None"}
                </span>
              </div>
            </div>
            <div className={cn("flex items-center gap-4", "mt-auto")}>
              <span className="text-gray-500 text-base">Player 2: </span>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedOpponent ? "text-red-500/80" : "text-gray-500/80",
                  )}
                >
                  {selectedOpponent?.name || "None"}
                </span>
              </div>
            </div>
          </section>

          <section
            className={cn(
              "h-full w-full min-h-0 p-1 pb-3 bg-slate-50",
              "outline outline-slate-200 rounded-lg",
              "shadow-[inset_4px_0_4px_-4px_rgba(0,0,0,0.1),inset_0_4px_8px_-4px_rgba(0,0,0,0.1)]",
            )}
          >
            <div className={cn("h-full w-full p-2", "overflow-y-auto")}>
              <div className="h-full flex flex-col gap-2">
                {filteredPlayers.map((player) =>
                  PlayerItem({
                    player,
                    selectedPlayer,
                    setSelectedPlayer,
                    selectedOpponent,
                    playerNumber,
                  }),
                )}
              </div>
            </div>
          </section>

          <section className="w-full flex items-center justify-end gap-2 mt-auto">
            <button
              className={cn(
                "bg-destructive px-2 py-1",
                "rounded-md shadow-md",
                "cursor-pointer hover:scale-110 active:scale-95",
                "transition-transform duration-200",
              )}
              onClick={() => setOpenPlayerSelectionModal(null)}
            >
              <span className="text-base text-slate-50">Cancel</span>
            </button>
            <button
              disabled={!selectedPlayer}
              className={cn(
                "bg-emerald-400 px-2 py-1",
                "rounded-md shadow-md",
                selectedPlayer
                  ? "cursor-pointer hover:scale-110 active:scale-95"
                  : "cursor-not-allowed opacity-50",
                "transition-transform duration-200",
              )}
              onClick={handleConfirm}
            >
              <span className="text-base text-slate-50">Confirm</span>
            </button>
          </section>
        </div>
      </Card>
    </div>
  );
};

type PlayerItemProps = {
  player: BoothPlayerType;
  selectedPlayer?: BoothPlayerType | null;
  setSelectedPlayer: (player: BoothPlayerType | null) => void;
  selectedOpponent?: BoothPlayerType | null;
  playerNumber: 1 | 2;
};
const PlayerItem = ({
  player,
  selectedPlayer,
  setSelectedPlayer,
  selectedOpponent,
  playerNumber,
}: PlayerItemProps) => {
  const handleSelect = () => {
    if (player.id === selectedOpponent?.id) {
      return;
    } else if (player.id === selectedPlayer?.id) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(player);
    }
  };

  return (
    <button
      key={player.id}
      className={cn(
        "py-1 px-4 flex gap-4",
        "items-center justify-start rounded-md",
        "outline shadow-md",
        playerNumber === 1
          ? selectedPlayer?.id === player.id
            ? "bg-blue-200/80 outline-blue-400"
            : "bg-red-200/80 outline-red-400"
          : selectedPlayer?.id === player.id
            ? "bg-red-200/80 outline-red-400"
            : "bg-blue-200/80 outline-blue-400",

        playerNumber === 1
          ? selectedOpponent?.id === player.id
            ? "bg-red-200/80 outline-red-400"
            : "bg-blue-200/80 outline-blue-400"
          : selectedOpponent?.id === player.id
            ? "bg-blue-200/80 outline-blue-400"
            : "bg-red-200/80 outline-red-400",

        player.id !== selectedPlayer?.id &&
          player.id !== selectedOpponent?.id &&
          "group outline-slate-200 bg-slate-50 hover:bg-slate-200",

        player.id !== selectedOpponent?.id
          ? "cursor-pointer hover:-translate-0.5 active:translate-0.5"
          : "cursor-not-allowed",
        "transition-all duration-200",
      )}
      onClick={handleSelect}
    >
      <span
        className="size-4 rounded-full opacity-80"
        style={{ backgroundColor: player.color }}
      ></span>
      <span className="text-md text-gray-700 font-medium">{player.name}</span>
      {selectedPlayer?.id === player.id ||
      selectedOpponent?.id === player.id ? (
        <CheckCircle
          className={cn(
            "size-5 ml-auto",
            playerNumber === 1
              ? selectedPlayer?.id === player.id
                ? "text-blue-400 group-hover:text-blue-300/80"
                : "text-red-400 group-hover:text-red-300/80"
              : selectedPlayer?.id === player.id
                ? "text-red-400 group-hover:text-red-300/80"
                : "text-blue-400 group-hover:text-blue-300/80",
            playerNumber === 1
              ? selectedOpponent?.id === player.id
                ? "text-red-400 group-hover:text-red-300/80"
                : "text-blue-400 group-hover:text-blue-300/80"
              : selectedOpponent?.id === player.id
                ? "text-blue-400 group-hover:text-blue-300/80"
                : "text-red-400 group-hover:text-red-300/80",
          )}
        />
      ) : (
        <Circle
          className={cn(
            "size-5 text-gray-200 ml-auto",
            playerNumber === 1
              ? "group-hover:text-blue-300/80"
              : "group-hover:text-red-300/80",
          )}
        />
      )}
    </button>
  );
};
