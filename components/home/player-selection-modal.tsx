"use client";

import type { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlayers } from "@/contexts/players-context";
import { Card } from "../ui/card";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import playerColorPalette from "@/data/player-color-pallete.json";

type PlayerSelectionModalProps = {
  playerCount: 1 | 2;
};
export const PlayerSelectionModal = ({
  playerCount,
}: PlayerSelectionModalProps) => {
  const {
    players,
    setPlayers,
    currentPlayers,
    setCurrentPlayers,
    setIsPlayerSelectionModalOpen,
  } = usePlayers();
  const [filterValue, setFilterValue] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<{
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  }>(currentPlayers);
  const [tab, setTab] = useState<"1" | "2">("1");
  const [newPlayer, setNewPlayer] = useState<BoothPlayerType>({
    id: "",
    name: "",
    color: "",
  });
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewPlayer((prev) => ({
      ...prev,
      name,
      id: String(players.length + 1),
    }));
  };

  const handleSaveNewPlayer = () => {
    if (!newPlayer?.id || !newPlayer?.name || !newPlayer?.color) return;
    if (players.some((player) => player.name === newPlayer.name)) {
      alert(
        "A player with the same name already exists. Please choose a different name.",
      );
      return;
    }
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayer({ id: "", name: "", color: "" });
  };
  const handleCancelNewPlayer = () => {
    setNewPlayer({ id: "", name: "", color: "" });
  };

  const handleConfirm = () => {
    setCurrentPlayers(selectedPlayers);
    setIsPlayerSelectionModalOpen(false);
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
            tab === "1"
              ? "from-blue-100/80 to-blue-300/80 outline-blue-500/80"
              : "from-red-100/80 to-red-300/80 outline-red-500/80",
            "h-full flex flex-col gap-4 rounded-xl border-none",
          )}
        >
          <section>
            <div
              className={cn(
                "flex items-center gap-4",
                tab === "1" ? "text-blue-500" : "text-red-500",
              )}
            >
              <h2 className="text-2xl font-bold">Choose/Create Player</h2>
              <div className="flex items-center gap-2">
                {tab === "2" && (
                  <button
                    className={cn(
                      "border border-red-500/80 rounded-md p-0.5",
                      "bg-slate-50 shadow-sm hover:scale-110 active:scale-95",
                      "transition-transform duration-200",
                    )}
                    onClick={() => setTab("1")}
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                )}
                <div className="flex items-end gap-2">
                  <span
                    className={cn(
                      tab === "1"
                        ? "text-5xl font-bold bg-slate-50 px-3 py-0.5 rounded-md shadow-sm"
                        : "text-xl font-semibold",
                      "transition-all duration-300",
                    )}
                  >
                    1
                  </span>
                  {playerCount == 2 && (
                    <span
                      className={cn(
                        tab === "2"
                          ? "text-5xl font-bold bg-slate-50 px-2 py-0.5 rounded-md shadow-sm"
                          : "text-xl font-semibold",
                        "transition-all duration-300",
                      )}
                    >
                      2
                    </span>
                  )}
                </div>
                {playerCount == 2 && tab === "1" && (
                  <button
                    className={cn(
                      "border border-blue-500/80 rounded-md p-0.5",
                      "bg-slate-50 shadow-sm hover:scale-110 active:scale-95",
                      "transition-transform duration-200",
                    )}
                    onClick={() => setTab("2")}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-base text-gray-700">
              Select an existing player or create a new one to start playing!
            </p>
          </section>

          <section className="flex gap-2 items-center">
            <input
              placeholder="Enter new name"
              value={newPlayer.name}
              onChange={handleNewNameChange}
              className={cn(
                "outline-2 outline-slate-200 rounded-md shadow-md",
                "h-8 w-full px-2 bg-slate-50",
                "text-gray-700 text-base",
                tab === "1"
                  ? "hover:outline-blue-500/80"
                  : "hover:outline-red-500/80",
                "transition-all duration-200",
              )}
            />
            <div
              className={cn(
                "relative outline-2 outline-slate-200 rounded-lg shadow-md",
                tab === "1"
                  ? "hover:outline-blue-500/80"
                  : "hover:outline-red-500/80",
              )}
            >
              <button
                className={cn(
                  "flex items-center gap-2 rounded-md",
                  "px-2 py-1 h-full bg-slate-50",
                  "cursor-pointer",
                )}
                onClick={() => setIsColorPaletteOpen((prev) => !prev)}
              >
                {newPlayer?.color ? (
                  <span
                    className="size-6 rounded-full"
                    style={{ backgroundColor: newPlayer.color }}
                  />
                ) : (
                  <CircleDashed className="size-6 text-gray-700" />
                )}
                <ChevronDown className="size-6 text-gray-700" />
              </button>
              {isColorPaletteOpen && (
                <PlayerColorPalette
                  tab={tab}
                  newPlayer={newPlayer}
                  setNewPlayer={setNewPlayer}
                  setIsColorPaletteOpen={setIsColorPaletteOpen}
                />
              )}
            </div>
            <button
              disabled={!newPlayer.id || !newPlayer.name || !newPlayer.color}
              className={cn(
                "px-2 py-1 rounded-md shadow-md",
                newPlayer.id && newPlayer.name && newPlayer.color
                  ? "bg-emerald-400 cursor-pointer hover:scale-110 active:scale-95"
                  : "bg-gray-400/80 cursor-not-allowed",
                "text-base text-slate-50",
                "transition-transform duration-200",
              )}
              onClick={handleSaveNewPlayer}
            >
              <Check className="size-6" />
            </button>
            <button
              className={cn(
                "px-2 py-1 rounded-md shadow-md",
                "bg-destructive cursor-pointer hover:scale-110 active:scale-95",
                "text-base text-slate-50",
                "transition-transform duration-200",
              )}
              onClick={handleCancelNewPlayer}
            >
              <X className="size-6" />
            </button>
          </section>

          <section className="flex gap-2 items-center">
            <input
              placeholder="Search player name"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={cn(
                "outline-2 outline-slate-200 rounded-lg shadow-md",
                "h-8 w-full px-2 bg-slate-50",
                "text-gray-700 text-base",
                tab === "1"
                  ? "hover:outline-blue-500/80"
                  : "hover:outline-red-500/80",
                "transition-all duration-200",
              )}
            />
          </section>

          <section className="flex gap-2 items-center justify-start">
            <div className={cn("flex items-center gap-4", "mt-auto")}>
              <span className="text-gray-500 text-base">Player 1: </span>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedPlayers.player1
                      ? "text-blue-500/80"
                      : "text-gray-500/80",
                  )}
                >
                  {selectedPlayers.player1
                    ? selectedPlayers.player1.name
                    : "None"}
                </span>
              </div>
            </div>
            <div className={cn("flex items-center gap-4", "mt-auto")}>
              <span className="text-gray-500 text-base">Player 2: </span>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedPlayers.player2
                      ? "text-red-500/80"
                      : "text-gray-500/80",
                  )}
                >
                  {selectedPlayers.player2
                    ? selectedPlayers.player2.name
                    : "None"}
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
                {filteredPlayers.reverse().map((player) =>
                  PlayerItem({
                    player,
                    selectedPlayers,
                    setSelectedPlayers,
                    tab,
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
              onClick={() => setIsPlayerSelectionModalOpen(false)}
            >
              <span className="text-base text-slate-50">Cancel</span>
            </button>
            <button
              className={cn(
                "bg-emerald-400 px-2 py-1",
                "rounded-md shadow-md",
                "cursor-pointer hover:scale-110 active:scale-95",
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
    <button
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
    </button>
  );
};

type PlayerColorPaletteProps = {
  tab: "1" | "2";
  newPlayer: BoothPlayerType;
  setNewPlayer: React.Dispatch<React.SetStateAction<BoothPlayerType>>;
  setIsColorPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const PlayerColorPalette = ({
  tab,
  newPlayer,
  setNewPlayer,
  setIsColorPaletteOpen,
}: PlayerColorPaletteProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsColorPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsColorPaletteOpen]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-20 right-0 top-full mt-2",
        "w-70 max-h-60 flex flex-col gap-2 p-2",
        "bg-slate-50 rounded-md shadow-lg outline outline-slate-200",
      )}
    >
      <div className={cn("flex flex-wrap justify-evenly gap-1")}>
        {playerColorPalette.map((color) => (
          <button
            key={color}
            className={cn(
              "px-2 py-2 rounded-md shadow-md bg-slate-50 outline outline-slate-200",
              "flex items-center justify-center",

              tab === "1" && "hover:outline-blue-500/80",
              tab === "2" && "hover:outline-red-500/80",

              tab === "1" &&
                newPlayer.color === color &&
                "bg-blue-300/80 outline-blue-500/80",
              tab === "2" &&
                newPlayer.color === color &&
                "bg-red-300/80 outline-red-500/80",

              "cursor-pointer hover:scale-110 active:scale-95",
              "transition-transform duration-200",
            )}
            onClick={() => {
              setNewPlayer((prev) => ({ ...prev, color }));
            }}
          >
            <span
              className="size-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
