import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import colorPaletteData from "@/data/player-color-pallete.json";
import { createPlayer } from "@/lib/players-utils/players.client";
import { BoothPlayerType } from "@/lib/types";
import { ColorPaletteSelection } from "./color-palette-selection";
import { usePlayers } from "@/contexts/players-context";

type CreatePlayerDialogProps = {
  team: "team1" | "team2";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currPlayer: BoothPlayerType | null;
  setCurrPlayer: (player: BoothPlayerType | null) => void;
};
export const CreatePlayerDialog = ({
  team,
  isOpen,
  setIsOpen,
  currPlayer,
  setCurrPlayer,
}: CreatePlayerDialogProps) => {
  const defaultColor = team === "team1" ? "blue" : "red";
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const { players, updatePlayersData } = usePlayers();

  useEffect(() => {
    if (currPlayer) {
      updatePlayersData();
    }
  }, [currPlayer, updatePlayersData]);

  const handleCancel = () => {
    setPlayerName("");
    setSelectedColor(defaultColor);
    setIsOpen(false);
  };
  const handleSubmit = () => {
    const newPlayer = {
      name: playerName,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };
    if (players.some((player) => player.name === newPlayer.name)) {
      alert("Player name already exists. Please choose a different name.");
      return;
    }
    createPlayer(newPlayer);
    setCurrPlayer(newPlayer);
    setPlayerName("");
    setSelectedColor(defaultColor);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      aria-describedby="create-player-dialog"
    >
      <DialogContent className="sm:max-w-md bg-white border-sky-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-900">
            Create a Player
          </DialogTitle>
        </DialogHeader>

        <span className="text-sky-700">Username:</span>
        <input
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter name"
          maxLength={20}
          className={cn(
            "w-full rounded-lg border border-sky-600",
            "bg-white px-4 py-2 text-base text-sky-700 outline-none",
            "focus:border-sky-600 focus:ring-2 focus:ring-sky-600",
            "transition-all duration-300",
          )}
        />
        <span className="text-sky-700">Color filter:</span>
        <ColorPaletteSelection
          team={team}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          colorPalette={colorPaletteData}
          className="gap-2 mb-2"
        />

        <DialogFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              className={cn(
                "w-full bg-slate-50 rounded-xl",
                "text-sky-900 py-6 text-lg font-bold",
                "cursor-pointer border border-slate-300/80",
                "hover:bg-slate-200   hover:shadow-lg",
                "transition-all duration-300",
              )}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "w-full bg-sky-600 rounded-xl shadow-lg",
                "text-white py-6 text-lg font-bold",
                "hover:bg-sky-700   hover:shadow-sky-200",
                "transition-all duration-300",
                "cursor-pointer",
              )}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
