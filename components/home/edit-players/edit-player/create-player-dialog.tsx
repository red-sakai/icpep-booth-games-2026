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
import { BoothPlayerType, GameMode } from "@/lib/types";
import { ColorPaletteSelection } from "./color-palette-selection";
import { usePlayers } from "@/contexts/players-context";
import { toast } from "sonner";
import { NotificationToaster } from "../../notification/notification-toaster";

type CreatePlayerDialogProps = {
  gameMode: GameMode;
  team: "team1" | "team2";
  setTeam: (team: "team1" | "team2") => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currPlayer: BoothPlayerType | null;
  setCurrPlayer: (player: BoothPlayerType | null) => void;
  onExit: (value: boolean) => void;
};
export const CreatePlayerDialog = ({
  gameMode,
  team,
  setTeam,
  isOpen,
  setIsOpen,
  currPlayer,
  setCurrPlayer,
  onExit,
}: CreatePlayerDialogProps) => {
  const defaultColor = team === "team1" ? "blue" : "red";
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const { players, updatePlayersData, currTeam1Player, currTeam2Player } =
    usePlayers();

  useEffect(() => {
    if (currPlayer) {
      updatePlayersData();
    }
  }, [currPlayer, updatePlayersData]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the user clicks the X, presses Escape, or clicks the backdrop to close it
      if (onExit) {
        onExit(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  const handleSubmit = () => {
    if (playerName.trim() === "") {
      toast.custom(() => (
        <NotificationToaster
          variant="warning"
          message="Player name cannot be empty!"
          description="Please enter a valid player name before submitting."
        />
      ));
      return;
    }
    const newPlayer = {
      name: playerName,
      color: selectedColor,
      createdAt: new Date().toISOString(),
    };
    if (players.some((player) => player.name === newPlayer.name)) {
      toast.custom(() => (
        <NotificationToaster
          variant="warning"
          message="Player name already exists!"
          description="Please choose a different name."
        />
      ));
      return;
    }
    createPlayer(newPlayer);
    setCurrPlayer(newPlayer);
    setPlayerName("");
    setSelectedColor(defaultColor);
    handleOpenChange(false);
    // only exit if both teams has players (pvp) or team1 has player (pve/solo)
    switch (gameMode) {
      case "pvp":
        if (team === "team1" && currTeam2Player) {
          onExit(false);
        } else if (team === "team2" && currTeam1Player) {
          onExit(false);
        } else {
          setTeam(team === "team1" ? "team2" : "team1");
        }

        break;
      default:
        onExit(false);
    }
    toast.custom(() => (
      <NotificationToaster
        variant="success"
        message="Player created successfully!"
        description={`Welcome, ${newPlayer.name}! You have joined ${team === "team1" ? "Team 1" : "Team 2"}.`}
      />
    ));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      aria-describedby="create-player-dialog"
    >
      <DialogContent
        className={cn(
          "sm:max-w-md bg-slate-50",
          team === "team1" ? "border-sky-100" : "border-rose-100",
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-2xl font-bold",
              team === "team1" ? "text-sky-900" : "text-rose-900",
            )}
          >
            Create a Player
          </DialogTitle>
        </DialogHeader>

        <span
          className={cn(team === "team1" ? "text-sky-700" : "text-rose-700")}
        >
          Username:
        </span>
        <input
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter name"
          maxLength={20}
          className={cn(
            "w-full rounded-lg border",
            "bg-slate-50 px-4 py-2 text-base",
            team === "team1"
              ? "border-sky-600 text-sky-700 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
              : "border-rose-600 text-rose-700 outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600",
            "transition-all duration-300",
          )}
        />
        <span
          className={cn(team === "team1" ? "text-sky-700" : "text-rose-700")}
        >
          Color filter:
        </span>
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
                team === "team1" ? "text-sky-900" : "text-rose-900",
                "py-6 text-lg font-bold",
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
                "w-full rounded-xl shadow-lg",
                "text-slate-50 py-6 text-lg font-bold",
                team === "team1"
                  ? "bg-sky-600 hover:bg-sky-700 hover:shadow-sky-200"
                  : "bg-rose-600 hover:bg-rose-700 hover:shadow-rose-200",
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
