"use client";

import type { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePlayers } from "@/contexts/players-context";
import { useState } from "react";
import { PlayerTabHeader } from "./sections/player-tab-header";
import { NewPlayerCreation } from "./sections/new-player-creation";
import { FilterPlayers } from "./sections/filter-players";
import { SelectedPlayerNames } from "./sections/selected-players-names";
import { PlayerSelectionList } from "./sections/selection-list";
import { PlayerSelectionConfirmation } from "./sections/selection-confirmation";
import { Card } from "@/components/ui/card";

type PlayerSelectionModalProps = {
  playerCount: 1 | 2;
};
export const PlayerSelectionModal = ({
  playerCount,
}: PlayerSelectionModalProps) => {
  const { players, currentPlayers } = usePlayers();
  const [selectedPlayers, setSelectedPlayers] = useState<{
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  }>(currentPlayers);
  const [tab, setTab] = useState<"1" | "2">("1");
  const [filterNameValue, setFilterNameValue] = useState("");
  const [filterColor, setFilterColor] = useState("all");

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(filterNameValue.toLowerCase()) &&
      (player.color.includes(filterColor) || filterColor === "all"),
  );

  return (
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
        <PlayerTabHeader playerCount={playerCount} tab={tab} setTab={setTab} />

        <NewPlayerCreation variant={tab === "1" ? "blue" : "red"} />

        <FilterPlayers
          variant={tab === "1" ? "blue" : "red"}
          filterNameValue={filterNameValue}
          setFilterNameValue={setFilterNameValue}
          filterColor={filterColor}
          setFilterColor={setFilterColor}
        />

        <SelectedPlayerNames selectedPlayers={selectedPlayers} />

        <PlayerSelectionList
          tab={tab}
          filterNameValue={filterNameValue}
          filterColor={filterColor}
          players={filteredPlayers}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />

        <PlayerSelectionConfirmation selectedPlayers={selectedPlayers} />
      </div>
    </Card>
  );
};
