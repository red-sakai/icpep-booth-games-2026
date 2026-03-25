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

type EditTeamDialogProps = {
  mode: "solo" | "pvp" | "pve";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNext: (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => void;
};
export const EditTeamDialog = ({
  mode,
  isOpen,
  setIsOpen,
  onNext,
}: EditTeamDialogProps) => {
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
          <DialogTitle
            className={cn(
              "flex items-center justify-center gap-4",
              selectedTeam === "team1" ? "text-sky-900" : "text-rose-900",
              "text-2xl font-bold",
            )}
          >
            Edit Player
          </DialogTitle>
          <DialogDescription
            className={cn(
              "text-center",
              selectedTeam === "team1" ? "text-sky-600" : "text-rose-600",
            )}
          >
            Create or select a player to track your scores. You can change this
            later.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-0">
          <span
            className={cn(
              selectedTeam === "team1" ? "text-sky-700" : "text-rose-700",
            )}
          >
            Assign to:
          </span>
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
              disabled={mode === "solo"}
            />
          </div>

          <span
            className={cn(
              selectedTeam === "team1" ? "text-sky-700" : "text-rose-700",
            )}
          >
            Method:
          </span>
          <div className="grid grid-cols-2 gap-4 py-4">
            <OptionButton
              selectedTeam={selectedTeam}
              Icon={TextCursorInput}
              label="Create Player"
              option="create"
              selectedOption={selectedOption}
              onClick={() => setSelectedOption("create")}
            />
            <OptionButton
              selectedTeam={selectedTeam}
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
              "w-full rounded-xl shadow-lg",
              selectedTeam === "team1"
                ? "bg-sky-500 hover:bg-sky-700 shadow-sky-200"
                : "bg-rose-500 hover:bg-rose-700 shadow-rose-200",
              "text-white py-6 text-lg font-bold",
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

type TeamButtonProps = {
  label: string;
  team: "team1" | "team2";
  selectedTeam: "team1" | "team2";
  onClick: () => void;
  disabled?: boolean;
};
const TeamButton = ({
  label,
  team,
  selectedTeam,
  onClick,
  disabled = false,
}: TeamButtonProps) => {
  const getButtonClasses = () => {
    if (team === "team1") {
      return team === selectedTeam
        ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md"
        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-rose-200 hover:bg-rose-25";
    } else if (team === "team2") {
      return team === selectedTeam
        ? "border-rose-500 bg-rose-50 text-rose-700 shadow-md"
        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-sky-25";
    }
  };

  return (
    <button
      className={cn(
        "flex items-center justify-evenly gap-4",
        "py-3 px-6 rounded-xl border-2 transition-all",
        getButtonClasses(),
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={!disabled ? onClick : () => {}}
    >
      <User className="size-6" />
      <span className="font-bold">{label}</span>
    </button>
  );
};

type OptionButtonProps = {
  selectedTeam: "team1" | "team2";
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  option: "create" | "select";
  selectedOption: "create" | "select";
  onClick?: () => void;
};
const OptionButton = ({
  selectedTeam,
  Icon,
  label,
  option,
  selectedOption,
  onClick,
}: OptionButtonProps) => {
  const getButtonClasses = () => {
    if (selectedTeam === "team1") {
      return option === selectedOption
        ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md"
        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-sky-25";
    } else if (selectedTeam === "team2") {
      return option === selectedOption
        ? "border-rose-500 bg-rose-50 text-rose-700 shadow-md"
        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-rose-200 hover:bg-rose-25";
    }
  };
  const getDivClasses = () => {
    if (selectedTeam === "team1") {
      return option === selectedOption
        ? "bg-sky-500 text-white"
        : "bg-slate-200";
    } else if (selectedTeam === "team2") {
      return option === selectedOption
        ? "bg-rose-500 text-white"
        : "bg-slate-200";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all space-y-3",
        getButtonClasses(),
      )}
    >
      <div className={cn("p-3 rounded-full", getDivClasses())}>
        <Icon className="size-8" />
      </div>
      <span className="font-bold">{label}</span>
    </button>
  );
};
