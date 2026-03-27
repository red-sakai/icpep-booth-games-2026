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
import { FilteredPlayerList } from "@/components/home/edit-players/edit-player/filtered-player-list";
import { BoothPlayerType } from "@/lib/types";
import { FilterPlayers } from "./filter-players";

type SelectPlayerDialogProps = {
  team: "team1" | "team2";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currPlayer: BoothPlayerType | null;
  setCurrPlayer: (player: BoothPlayerType | null) => void;
  onExit: () => void;
};
export const SelectPlayerDialog = ({
  team,
  isOpen,
  setIsOpen,
  currPlayer,
  setCurrPlayer,
  onExit,
}: SelectPlayerDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const defaultColor = "all";
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedPlayer, setSelectedPlayer] = useState<BoothPlayerType | null>(
    currPlayer,
  );

  useEffect(() => {
    setSelectedPlayer(currPlayer);
  }, [currPlayer]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // If the user clicks the X, presses Escape, or clicks the backdrop to close it
      if (onExit) {
        onExit();
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
    if (!selectedPlayer) return;
    setCurrPlayer(selectedPlayer);
    setPlayerName("");
    setSelectedColor(defaultColor);
    setIsOpen(false);
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
            Select a Player
          </DialogTitle>
        </DialogHeader>

        <span
          className={cn(team === "team1" ? "text-sky-700" : "text-rose-700")}
        >
          Filter players:
        </span>
        <FilterPlayers
          team={team}
          filterNameValue={playerName}
          setFilterNameValue={setPlayerName}
          filterColor={selectedColor}
          setFilterColor={setSelectedColor}
        />

        <span
          className={cn(team === "team1" ? "text-sky-700" : "text-rose-700")}
        >
          Result:
        </span>
        <div className="h-40 max-h-40 min-h-40">
          <FilteredPlayerList
            team={team}
            filterNameValue={playerName}
            filterColor={selectedColor}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        </div>

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
                "w-full brounded-xl shadow-lg",
                "text-slate-50 py-6 text-lg font-bold",
                team === "team1"
                  ? "bg-sky-600 hover:bg-sky-700   hover:shadow-sky-200"
                  : "bg-rose-600 hover:bg-rose-700   hover:shadow-rose-200",
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
