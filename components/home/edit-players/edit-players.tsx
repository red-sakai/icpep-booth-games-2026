import { Edit } from "lucide-react";
import { usePlayers } from "@/contexts/players-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditTeamDialog } from "@/components/home/edit-players/edit-player/edit-team-dialog";
import { CreatePlayerDialog } from "@/components/home/edit-players/edit-player/create-player-dialog";
import { SelectPlayerDialog } from "@/components/home/edit-players/edit-player/select-player-dialog";
import { GameMode } from "@/lib/types";

type EditPlayersProps = {
  gameMode: GameMode;
};

export const EditPlayers = ({ gameMode }: EditPlayersProps) => {
  const [team, setTeam] = useState<"team1" | "team2">("team1");
  const {
    currTeam1Player,
    currTeam2Player,
    setCurrTeam1Player,
    setCurrTeam2Player,
  } = usePlayers();
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);
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

  // open edit team dialog when both create and select player dialogs are closed
  useEffect(() => {
    if (!isCreatePlayerDialogOpen && !isSelectPlayerDialogOpen) {
      setIsEditTeamDialogOpen(true);
    }
  }, [isCreatePlayerDialogOpen, isSelectPlayerDialogOpen]);

  const handleEditTeamNext = (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => {
    setTeam(selectedTeam);
    if (selectedOption === "create") {
      setIsCreatePlayerDialogOpen(true);
    } else if (selectedOption === "select") {
      setIsSelectPlayerDialogOpen(true);
    }
    setIsEditTeamDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <PlayerNames team="team1" />
        {gameMode !== "solo" && <PlayerNames team="team2" />}

        <button
          className={cn(
            "p-1 rounded-lg bg-blue-100 shadow-md",
            "cursor-pointer hover:scale-105 active:scale-95",
            "transition-all duration-200",
          )}
          onClick={() => setIsEditTeamDialogOpen(true)}
        >
          <Edit className="size-6 text-gray-700" />
        </button>
      </div>

      <EditTeamDialog
        gameMode={gameMode}
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
      />
      <SelectPlayerDialog
        team={team}
        isOpen={isSelectPlayerDialogOpen}
        setIsOpen={setIsSelectPlayerDialogOpen}
        currPlayer={team === "team1" ? currTeam1Player : currTeam2Player}
        setCurrPlayer={
          team === "team1" ? setCurrTeam1Player : setCurrTeam2Player
        }
      />
    </>
  );
};

type PlayerNamesProps = {
  team: "team1" | "team2";
  defaultPlayer?: string | null;
};
const PlayerNames = ({ team, defaultPlayer = null }: PlayerNamesProps) => {
  const { currTeam1Player, currTeam2Player } = usePlayers();

  return (
    <div className="flex items-center gap-2">
      <span>Team {team === "team1" ? "1" : "2"}:</span>
      <span
        className={cn(
          "font-semibold bg-slate-50 text-gray-700 px-2 py-1 rounded-lg shadow-sm",
          team === "team1" && currTeam1Player && "bg-blue-100 text-blue-800",
          team === "team2" && currTeam2Player && "bg-red-100 text-red-800",
        )}
      >
        {defaultPlayer
          ? defaultPlayer
          : team === "team1"
            ? currTeam1Player
              ? currTeam1Player.name
              : "None"
            : currTeam2Player
              ? currTeam2Player.name
              : "None"}
      </span>
    </div>
  );
};
