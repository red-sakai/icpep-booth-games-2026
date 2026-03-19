import { Edit } from "lucide-react";
import { usePlayers } from "@/contexts/players-context";
import { PlayerSelectionModal } from "./player-selection-modal";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type PlayerSelectionButtonProps = {
  playerCount: 1 | 2;
};

export const PlayersSelection = ({
  playerCount,
}: PlayerSelectionButtonProps) => {
  const {
    setCurrentPlayers,
    isPlayerSelectionModalOpen,
    setIsPlayerSelectionModalOpen,
  } = usePlayers();

  useEffect(() => {
    setCurrentPlayers({ player1: null, player2: null });
  }, [setCurrentPlayers]);

  return (
    <>
      {isPlayerSelectionModalOpen && (
        <PlayerSelectionModal playerCount={playerCount} />
      )}

      <div className="flex items-center justify-end gap-4">
        <PlayerStatus playerNumber={1} />
        {playerCount === 2 && <PlayerStatus playerNumber={2} />}

        <button
          className={cn(
            "bg-slate-50 p-1 rounded-lg shadow-sm hover:bg-blue-100 transition-colors",
            "cursor-pointer",
          )}
          onClick={() => setIsPlayerSelectionModalOpen(true)}
        >
          <Edit className="size-6 text-gray-700" />
        </button>
      </div>
    </>
  );
};

type PlayerStatusProps = {
  playerNumber: 1 | 2;
};
const PlayerStatus = ({ playerNumber }: PlayerStatusProps) => {
  const { currentPlayers } = usePlayers();

  return (
    <div className="flex items-center gap-2">
      <span>Player {playerNumber}:</span>
      <span
        className={cn(
          "font-semibold bg-slate-50 text-gray-700 px-2 py-1 rounded-lg shadow-sm",
          playerNumber === 1 &&
            currentPlayers.player1 &&
            "bg-blue-100 text-blue-800",
          playerNumber === 2 &&
            currentPlayers.player2 &&
            "bg-red-100 text-red-800",
        )}
      >
        {playerNumber === 1
          ? currentPlayers?.player1
            ? currentPlayers.player1.name
            : "None"
          : currentPlayers?.player2
            ? currentPlayers.player2.name
            : "None"}
      </span>
    </div>
  );
};
