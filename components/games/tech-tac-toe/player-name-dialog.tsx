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
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface PlayerNameDialogProps {
  open: boolean;
  score: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  title?: string;
  playerLabel?: string;
}

export default function PlayerNameDialog({
  open,
  score,
  onSubmit,
  onCancel,
  title = "Congratulations! 🎉",
  playerLabel,
}: PlayerNameDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim().toUpperCase());
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white border-sky-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-sky-900 text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-sky-600">
              {playerLabel ? `${playerLabel}, you` : "You"} won with a streak of <span className="font-bold text-sky-800">{score}</span>! Enter your name to save your score.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="bg-sky-50 p-4 rounded-full text-sky-600">
              <User size={48} />
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER YOUR NAME"
              maxLength={10}
              autoFocus
              className="text-center text-xl font-bold uppercase border-sky-200 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <DialogFooter>
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-slate-200 text-slate-600"
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold"
              >
                Save Score
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
