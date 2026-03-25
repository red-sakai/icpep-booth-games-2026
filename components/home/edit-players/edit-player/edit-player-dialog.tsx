import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MousePointerClick, TextCursorInput, User } from "lucide-react";
import { useState } from "react";

type EditPlayerDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNext: (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => void;
};
export const EditPlayerDialog = ({
  isOpen,
  setIsOpen,
  onNext,
}: EditPlayerDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<"create" | "select">(
    "create",
  );
  const [selectedTeam, setSelectedTeam] = useState<"team1" | "team2">("team1");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      aria-describedby="player-entry-dialog"
    >
      <DialogContent className="sm:max-w-md bg-white border-sky-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-900 flex items-center justify-center gap-4">
            Edit Player
          </DialogTitle>
          <DialogDescription className="text-center text-sky-600">
            Create or select a player to track your scores. You can change this
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-0">
          <span className="text-sky-700">Assign to:</span>
          <div className="grid grid-cols-2 gap-4 py-4">
            <TeamButton
              label="Team 1"
              team="team1"
              selectedTeam={selectedTeam}
              onClick={() => setSelectedTeam("team1")}
            />
            <TeamButton
              label="Team 2"
              team="team2"
              selectedTeam={selectedTeam}
              onClick={() => setSelectedTeam("team2")}
            />
          </div>

          <span className="text-sky-700">Method:</span>
          <div className="grid grid-cols-2 gap-4 py-4">
            <OptionButton
              Icon={TextCursorInput}
              label="Create Player"
              option="create"
              selectedOption={selectedOption}
              onClick={() => setSelectedOption("create")}
            />
            <OptionButton
              Icon={MousePointerClick}
              label="Select Player"
              option="select"
              selectedOption={selectedOption}
              onClick={() => setSelectedOption("select")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className={cn(
              "w-full bg-sky-600 rounded-xl shadow-lg",
              "text-white py-6 text-lg font-bold",
              "hover:bg-sky-700   hover:shadow-sky-200",
              "transition-all duration-300",
              "cursor-pointer",
            )}
            onClick={() => onNext(selectedOption, selectedTeam)}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type OptionButtonProps = {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  option: "create" | "select";
  selectedOption: "create" | "select";
  onClick?: () => void;
};
const OptionButton = ({
  Icon,
  label,
  option,
  selectedOption,
  onClick,
}: OptionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
        option === selectedOption
          ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md"
          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-sky-25",
      )}
    >
      <div
        className={cn(
          "p-3 rounded-full",
          option === selectedOption ? "bg-sky-500 text-white" : "bg-slate-200",
        )}
      >
        <Icon className="size-8" />
      </div>
      <span className="font-bold">{label}</span>
    </button>
  );
};

type TeamButtonProps = {
  label: string;
  team: "team1" | "team2";
  selectedTeam: "team1" | "team2";
  onClick: () => void;
};
const TeamButton = ({
  label,
  team,
  selectedTeam,
  onClick,
}: TeamButtonProps) => {
  return (
    <button
      className={cn(
        "flex items-center justify-evenly gap-4",
        "py-3 px-6 rounded-xl border-2 transition-all",
        team === selectedTeam
          ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md"
          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-sky-25",
      )}
      onClick={onClick}
    >
      <User className="size-6" />
      <span className="font-bold">{label}</span>
    </button>
  );
};
