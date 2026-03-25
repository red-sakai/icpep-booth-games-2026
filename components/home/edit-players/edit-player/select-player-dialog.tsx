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
  variant: "sky" | "rose";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsEditPlayerDialogOpen: (open: boolean) => void;
  currPlayer: BoothPlayerType | null;
  setCurrPlayer: (player: BoothPlayerType | null) => void;
};
export const SelectPlayerDialog = ({
  variant,
  isOpen,
  setIsOpen,
  setIsEditPlayerDialogOpen,
  currPlayer,
  setCurrPlayer,
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

  useEffect(() => {
    if (!isOpen) {
      setIsEditPlayerDialogOpen(true);
    }
    setIsOpen(isOpen);
  }, [isOpen, setIsEditPlayerDialogOpen, setIsOpen]);

  const handleCancel = () => {
    setPlayerName("");
    setSelectedColor(defaultColor);
    setIsOpen(false);
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
      onOpenChange={setIsOpen}
      aria-describedby="create-player-dialog"
    >
      <DialogContent className="sm:max-w-md bg-white border-sky-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-900">
            Select a Player
          </DialogTitle>
        </DialogHeader>

        <span className="text-sky-700">Filter players:</span>
        <FilterPlayers
          variant={variant}
          filterNameValue={playerName}
          setFilterNameValue={setPlayerName}
          filterColor={selectedColor}
          setFilterColor={setSelectedColor}
        />

        <span className="text-sky-700">Result:</span>
        <div className="h-full max-h-40 min-h-40">
          <FilteredPlayerList
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
