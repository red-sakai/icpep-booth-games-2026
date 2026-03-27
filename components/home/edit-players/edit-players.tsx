import { Bot, Pencil, User } from "lucide-react";
import { usePlayers } from "@/contexts/players-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditTeamDialog } from "@/components/home/edit-players/edit-player/edit-team-dialog";
import { CreatePlayerDialog } from "@/components/home/edit-players/edit-player/create-player-dialog";
import { SelectPlayerDialog } from "@/components/home/edit-players/edit-player/select-player-dialog";
import { BoothPlayerType, GameMode } from "@/lib/types";

type EditPlayersProps = {
  gameMode: GameMode;
  openOnMount?: boolean;
};

export const EditPlayers = ({
  gameMode,
  openOnMount = true,
}: EditPlayersProps) => {
  const [team, setTeam] = useState<"team1" | "team2">("team1");
  const {
    currTeam1Player,
    currTeam2Player,
    setCurrTeam1Player,
    setCurrTeam2Player,
  } = usePlayers();
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(openOnMount);
  const [isCreatePlayerDialogOpen, setIsCreatePlayerDialogOpen] =
    useState(false);
  const [isSelectPlayerDialogOpen, setIsSelectPlayerDialogOpen] =
    useState(false);

  // reset create and select player dialogs when edit team dialog is opened
  useEffect(() => {
    if (isEditTeamDialogOpen) {
      setIsCreatePlayerDialogOpen(false);
      setIsSelectPlayerDialogOpen(false);
    }
  }, [isEditTeamDialogOpen]);

  // open edit team dialog when both create and select player dialogs are exited
  const onExitCreateOrSelectPlayerDialog = () => {
    setIsCreatePlayerDialogOpen(false);
    setIsSelectPlayerDialogOpen(false);
    setIsEditTeamDialogOpen(true);
  };

  const handleEditTeamNext = (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => {
    setTeam(selectedTeam);
    setIsEditTeamDialogOpen(false);
    if (selectedOption === "create") {
      setIsCreatePlayerDialogOpen(true);
    } else if (selectedOption === "select") {
      setIsSelectPlayerDialogOpen(true);
    }
  };

  const handlePlayerNameClick = (newTeam: "team1" | "team2") => {
    setTeam(newTeam);
    setIsEditTeamDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <div
          className={cn(
            "flex items-start gap-4 px-6 py-1.5",
            "bg-slate-50 rounded-xl shadow-sm",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700">Team 1:</span>
            <PlayerNameDisplay
              gameMode={gameMode}
              team="team1"
              player={currTeam1Player}
              onClick={() => handlePlayerNameClick("team1")}
            />
          </div>
          {gameMode !== "solo" && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Team 2:</span>
              <PlayerNameDisplay
                gameMode={gameMode}
                team="team2"
                player={currTeam2Player}
                onClick={() => handlePlayerNameClick("team2")}
              />
            </div>
          )}
        </div>

        <button
          className={cn(
            "p-2 rounded-lg bg-slate-50 shadow-md",
            "cursor-pointer hover:scale-105 active:scale-95",
            "transition-all duration-200",
          )}
          onClick={() => setIsEditTeamDialogOpen(true)}
        >
          <Pencil className="size-5 text-slate-700" />
        </button>
      </div>

      <EditTeamDialog
        gameMode={gameMode}
        team={team}
        isOpen={isEditTeamDialogOpen}
        setIsOpen={setIsEditTeamDialogOpen}
        onNext={handleEditTeamNext}
      />
      <CreatePlayerDialog
        team={team}
        isOpen={isCreatePlayerDialogOpen}
        setIsOpen={setIsCreatePlayerDialogOpen}
        currPlayer={team === "team1" ? currTeam1Player : currTeam2Player}
        setCurrPlayer={
          team === "team1" ? setCurrTeam1Player : setCurrTeam2Player
        }
        onExit={onExitCreateOrSelectPlayerDialog}
      />
      <SelectPlayerDialog
        team={team}
        isOpen={isSelectPlayerDialogOpen}
        setIsOpen={setIsSelectPlayerDialogOpen}
        currPlayer={team === "team1" ? currTeam1Player : currTeam2Player}
        setCurrPlayer={
          team === "team1" ? setCurrTeam1Player : setCurrTeam2Player
        }
        onExit={onExitCreateOrSelectPlayerDialog}
      />
    </>
  );
};

type PlayerNameDisplayProps = {
  gameMode: GameMode;
  team: "team1" | "team2";
  player: BoothPlayerType | null;
  onClick?: () => void;
};
const PlayerNameDisplay = ({
  gameMode,
  team,
  player,
  onClick,
}: PlayerNameDisplayProps) => {
  const [isAi, setIsAi] = useState(false);

  useEffect(() => {
    if (team === "team2") {
      setIsAi(
        ["AI (EASY)", "AI (MEDIUM)", "AI (HARD)"].includes(player?.name || ""),
      );
    }
  }, [player, team]);

  return (
    <button
      className={cn(
        "font-medium bg-slate-50 rounded-lg shadow-md border-b-2",
        team === "team1" &&
          player &&
          "bg-sky-100 text-sky-800 border-sky-600/80",
        team === "team2" &&
          player &&
          "bg-rose-100 text-rose-800 border-rose-600/80",
        "flex items-center gap-4 px-4 py-1",
        team === "team1" || gameMode === "pvp"
          ? "cursor-pointer hover:scale-105 active:scale-95"
          : "cursor-not-allowed",
        "transition-all duration-200",
      )}
      // always allow team 1, only ollow team 2 if pvp (since ai players can't be edited)
      onClick={team === "team1" || gameMode === "pvp" ? onClick : () => {}}
    >
      {isAi ? <Bot className="size-4" /> : <User className="size-4" />}
      <span className="text-sm">{player?.name || "None"}</span>
    </button>
  );
};
