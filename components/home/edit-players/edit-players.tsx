import { Edit } from "lucide-react";
import { usePlayers } from "@/contexts/players-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditPlayerDialog } from "@/components/home/edit-players/edit-player/edit-player-dialog";
import { CreatePlayerDialog } from "@/components/home/edit-players/edit-player/create-player-dialog";
import { SelectPlayerDialog } from "@/components/home/edit-players/edit-player/select-player-dialog";

type EditPlayersProps = {
  playerCount: 1 | 2;
};

export const EditPlayers = ({ playerCount }: EditPlayersProps) => {
  const [team, setTeam] = useState<"team1" | "team2">("team1");
  const {
    currTeam1Player,
    currTeam2Player,
    setCurrTeam1Player,
    setCurrTeam2Player,
  } = usePlayers();
  const [isEditPlayerDialogOpen, setIsEditPlayerDialogOpen] = useState(false);
  const [isCreatePlayerDialogOpen, setIsCreatePlayerDialogOpen] =
    useState(false);
  const [isSelectPlayerDialogOpen, setIsSelectPlayerDialogOpen] =
    useState(false);

  useEffect(() => {
    setCurrTeam1Player(null);
    setCurrTeam2Player(null);
  }, [playerCount, setCurrTeam1Player, setCurrTeam2Player]);

  useEffect(() => {
    if (isEditPlayerDialogOpen) {
      setIsCreatePlayerDialogOpen(false);
      setIsSelectPlayerDialogOpen(false);
    }
  }, [isEditPlayerDialogOpen]);

  const handleEditPlayerNext = (
    selectedOption: "create" | "select",
    selectedTeam: "team1" | "team2",
  ) => {
    setTeam(selectedTeam);
    if (selectedOption === "create") {
      setIsCreatePlayerDialogOpen(true);
    } else if (selectedOption === "select") {
      setIsSelectPlayerDialogOpen(true);
    }
    setIsEditPlayerDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <PlayerNames playerNumber={1} />
        {playerCount === 2 && <PlayerNames playerNumber={2} />}

        <button
          className={cn(
            "p-1 rounded-lg bg-blue-100 shadow-md",
            "cursor-pointer hover:scale-105 active:scale-95",
            "transition-all duration-200",
          )}
          onClick={() => setIsEditPlayerDialogOpen(true)}
        >
          <Edit className="size-6 text-gray-700" />
        </button>
      </div>

      <EditPlayerDialog
        isOpen={isEditPlayerDialogOpen}
        setIsOpen={setIsEditPlayerDialogOpen}
        onNext={handleEditPlayerNext}
      />
      <CreatePlayerDialog
        team={team}
        isOpen={isCreatePlayerDialogOpen}
        setIsOpen={setIsCreatePlayerDialogOpen}
        setIsEditPlayerDialogOpen={setIsEditPlayerDialogOpen}
        currPlayer={team === "team1" ? currTeam1Player : currTeam2Player}
        setCurrPlayer={
          team === "team1" ? setCurrTeam1Player : setCurrTeam2Player
        }
      />
      <SelectPlayerDialog
        variant={"sky"}
        isOpen={isSelectPlayerDialogOpen}
        setIsOpen={setIsSelectPlayerDialogOpen}
        setIsEditPlayerDialogOpen={setIsEditPlayerDialogOpen}
        currPlayer={team === "team1" ? currTeam1Player : currTeam2Player}
        setCurrPlayer={
          team === "team1" ? setCurrTeam1Player : setCurrTeam2Player
        }
      />
    </>
  );
};

type PlayerNamesProps = {
  playerNumber: 1 | 2;
};
const PlayerNames = ({ playerNumber }: PlayerNamesProps) => {
  const { currTeam1Player, currTeam2Player } = usePlayers();

  return (
    <div className="flex items-center gap-2">
      <span>Team {playerNumber}:</span>
      <span
        className={cn(
          "font-semibold bg-slate-50 text-gray-700 px-2 py-1 rounded-lg shadow-sm",
          playerNumber === 1 && currTeam1Player && "bg-blue-100 text-blue-800",
          playerNumber === 2 && currTeam2Player && "bg-red-100 text-red-800",
        )}
      >
        {playerNumber === 1
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
