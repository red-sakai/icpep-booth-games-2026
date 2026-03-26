"use client";

import { useState } from "react";
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

type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

interface GameModeSelectorProps {
  open: boolean;
  onSelect: (mode: GameMode, difficulty: Difficulty) => void;
  onClose?: () => void;
}

export default function GameModeSelector({
  open,
  onSelect,
  onClose,
}: GameModeSelectorProps) {
  const [mode, setMode] = useState<GameMode>("pve");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const handleStart = () => {
    onSelect(mode, difficulty);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            onClick={() => setMode("pvp")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
              mode === "pvp"
                ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-pink-200 hover:bg-pink-25"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                mode === "pvp" ? "bg-pink-500 text-white" : "bg-slate-200"
              )}
            >
              <User size={32} />
            </div>
            <span className="font-bold">Player vs Player</span>
          </button>

          <button
            onClick={() => setMode("pve")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
              mode === "pve"
                ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-pink-200 hover:bg-pink-25"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-full",
                mode === "pve" ? "bg-pink-500 text-white" : "bg-slate-200"
              )}
            >
              <Cpu size={32} />
            </div>
            <span className="font-bold">Player vs AI</span>
          </button>
        </div>

        {mode === "pve" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-medium text-pink-800 text-center">
              Select Difficulty
            </p>
            <div className="flex justify-center gap-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all",
                    difficulty === d
                      ? "bg-pink-600 text-white shadow-sm"
                      : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            onClick={handleStart}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-pink-200 transition-all"
          >
            Start Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
