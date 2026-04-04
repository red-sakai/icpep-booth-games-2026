"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Cpu } from "lucide-react";
import { GameMode } from "@/lib/types";
import { toast } from "sonner";
import { NotificationToaster } from "@/components/notification/notification-toaster";

type Difficulty = "easy" | "medium" | "hard";

interface GameModeSelectorProps {
  currGameMode: GameMode;
  isOpen: boolean;
  onSave: (mode: GameMode, difficulty: Difficulty) => void;
  onClose?: () => void;
}

export default function GameModeSelector({
  currGameMode,
  isOpen,
  onSave,
  onClose,
}: GameModeSelectorProps) {
  const [selectedGameMode, setSeletectedGameMode] =
    useState<GameMode>(currGameMode);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("medium");

  useEffect(() => {
    setSeletectedGameMode(currGameMode);
  }, [currGameMode]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      if (selectedGameMode) {
        onClose();
      } else {
        toast.custom(
          () => (
            <NotificationToaster
              variant="warning"
              message="Game mode not selected"
              description="Please select a game mode before closing."
            />
          ),
          { duration: 5000, position: "top-center" },
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-pink-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-pink-900 text-center">
            Choose Game Mode
          </DialogTitle>
          <DialogDescription className="text-center text-pink-600">
            Select how you want to play Tech Tac Toe
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => setSeletectedGameMode("pvp")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
              selectedGameMode === "pvp"
                ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-pink-200 hover:bg-pink-25",
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                selectedGameMode === "pvp"
                  ? "bg-pink-500 text-white"
                  : "bg-slate-200",
              )}
            >
              <User size={32} />
            </div>
            <span className="font-bold">Player vs Player</span>
          </button>

          <button
            onClick={() => setSeletectedGameMode("pve")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
              selectedGameMode === "pve"
                ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-pink-200 hover:bg-pink-25",
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                selectedGameMode === "pve"
                  ? "bg-pink-500 text-white"
                  : "bg-slate-200",
              )}
            >
              <Cpu size={32} />
            </div>
            <span className="font-bold">Player vs AI</span>
          </button>
        </div>

        {selectedGameMode === "pve" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-medium text-pink-800 text-center">
              Select Difficulty
            </p>
            <div className="flex justify-center gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all",
                    selectedDiff === d
                      ? "bg-pink-600 text-white shadow-sm"
                      : "bg-pink-50 text-pink-600 hover:bg-pink-100",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              className={cn(
                "w-full bg-slate-50 rounded-xl",
                "text-pink-900",
                "py-6 text-lg font-bold",
                "cursor-pointer border border-slate-300/80",
                "hover:bg-slate-200   hover:shadow-lg",
                "transition-all duration-300",
              )}
              onClick={onClose ? () => onClose() : () => {}}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                "w-full rounded-xl shadow-lg",
                "text-slate-50 py-6 text-lg font-bold",
                "bg-pink-600 hover:bg-pink-700 hover:shadow-pink-200",
                "transition-all duration-300",
                "cursor-pointer",
              )}
              onClick={() => onSave(selectedGameMode, selectedDiff)}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
