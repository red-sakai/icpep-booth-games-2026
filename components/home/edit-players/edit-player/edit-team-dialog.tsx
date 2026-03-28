import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePlayers } from "@/contexts/players-context";
import { BoothPlayerType, GameMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, MousePointerClick, TextCursorInput, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { NotificationToaster } from "../../notification/notification-toaster";

type EditTeamDialogProps = {
  gameMode: GameMode;
  team: "team1" | "team2";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onNext: (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => void;
};
export const EditTeamDialog = ({
  gameMode,
  team,
  isOpen,
  setIsOpen,
  onNext,
}: EditTeamDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<"create" | "select">(
    "create",
  );
  const [selectedTeam, setSelectedTeam] = useState<"team1" | "team2">(team);
  const { currTeam1Player, currTeam2Player, setCurrTeam2Player } = usePlayers();
  const prevGameModeRef = useRef<GameMode>(gameMode);

  useEffect(() => {
    setSelectedTeam(team);
  }, [team]);

  // reset selected team and option when game mode changes
  useEffect(() => {
    setSelectedTeam("team1");
    setSelectedOption("create");
  }, [gameMode]);

  // reset team 2 player when switching to pvp mode from other modes
  useEffect(() => {
    if (gameMode === "pvp" && prevGameModeRef.current !== "pvp") {
      setCurrTeam2Player(null);
    }
  }, [gameMode]);

  // open dialog when game mode changes
  useEffect(() => {
    if (prevGameModeRef.current !== gameMode) {
      prevGameModeRef.current = gameMode;
      // auto-open the dialog if the game mode is actually selected
      if (gameMode !== null) {
        setIsOpen(true);
      }
    }
  }, [gameMode, setIsOpen]);

  const handleOnOpenChange = (open: boolean) => {
    switch (gameMode) {
      case "solo":
        if (currTeam1Player) {
          setIsOpen(open);
        } else {
          toast.custom(() => (
            <NotificationToaster
              variant="warning"
              message="No player assigned!"
              description="Please create or select a player to continue."
            />
          ));
        }
        break;
      case "pvp":
        if (currTeam1Player && currTeam2Player) {
          setIsOpen(open);
        } else {
          toast.custom(() => (
            <NotificationToaster
              variant="warning"
              message="Players missing!"
              description="Please create or select players for both teams to continue."
            />
          ));
        }
        break;
      case "pve":
        if (currTeam1Player && currTeam2Player) {
          setIsOpen(open);
        } else {
          toast.custom(() => (
            <NotificationToaster
              variant="warning"
              message="Player missing!"
              description="Please create or select a player for Team 1 to continue."
            />
          ));
        }
        break;
      case null:
        setIsOpen(open);
        break;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOnOpenChange}
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
              player={currTeam1Player}
              selectedTeam={selectedTeam}
              onClick={() => setSelectedTeam("team1")}
            />
            <TeamButton
              label="Team 2"
              team="team2"
              player={currTeam2Player}
              selectedTeam={selectedTeam}
              onClick={() => setSelectedTeam("team2")}
              disabled={gameMode === "solo" || gameMode === "pve"}
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
  player: BoothPlayerType | null;
  selectedTeam: "team1" | "team2";
  onClick: () => void;
  disabled?: boolean;
};
const TeamButton = ({
  label,
  team,
  player,
  selectedTeam,
  onClick,
  disabled = false,
}: TeamButtonProps) => {
  const [isAi, setIsAi] = useState(false);

  useEffect(() => {
    if (team === "team2") {
      setIsAi(
        ["AI (EASY)", "AI (MEDIUM)", "AI (HARD)"].includes(player?.name || ""),
      );
    }
  }, [player, team]);

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
  const getCircleStyle = () => {
    if (player) {
      return { backgroundColor: player.color };
    }
    if (selectedTeam !== team) {
      return {
        border: "2px solid var(--color-slate-400)",
        backgroundColor: "transparent",
      };
    }
    switch (team) {
      case "team1":
        return {
          border: "2px solid var(--color-sky-600)",
          backgroundColor: "transparent",
        };
      case "team2":
        return {
          border: "2px solid var(--color-rose-600)",
          backgroundColor: "transparent",
        };
    }
  };

  return (
    <button
      className={cn(
        "py-3 px-6 rounded-xl border-2 transition-all",
        getButtonClasses(),
        disabled && "cursor-not-allowed opacity-50",
        "flex flex-col items-center justify-between gap-1",
      )}
      onClick={!disabled ? onClick : () => {}}
    >
      <div className="flex items-center justify-evenly gap-4">
        {isAi ? <Bot className="size-6" /> : <User className="size-6" />}
        <span className="font-bold">{label}</span>
      </div>
      <div className="flex items-center justify-start gap-4">
        <span className="size-4 rounded-full" style={getCircleStyle()} />
        <span className="text-sm">{player ? player.name : "N/A"}</span>
      </div>
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
