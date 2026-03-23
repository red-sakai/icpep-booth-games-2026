import { usePlayers } from "@/contexts/players-context";
import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";

type PlayerSelectionConfirmationProps = {
  selectedPlayers: {
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  };
};

export const PlayerSelectionConfirmation = ({
  selectedPlayers,
}: PlayerSelectionConfirmationProps) => {
  const { setIsPlayerSelectionModalOpen, setCurrentPlayers } = usePlayers();

  const handleConfirm = () => {
    setCurrentPlayers(selectedPlayers);
    setIsPlayerSelectionModalOpen(false);
  };

  return (
    <section className="w-full flex items-center justify-end gap-2 mt-auto">
      <button
        className={cn(
          "bg-destructive px-2 py-1",
          "rounded-md shadow-md",
          "cursor-pointer hover:scale-110 active:scale-95",
          "transition-transform duration-200",
        )}
        onClick={() => setIsPlayerSelectionModalOpen(false)}
      >
        <span className="text-base text-slate-50">Cancel</span>
      </button>
      <button
        className={cn(
          "bg-emerald-400 px-2 py-1",
          "rounded-md shadow-md",
          "cursor-pointer hover:scale-110 active:scale-95",
          "transition-transform duration-200",
        )}
        onClick={handleConfirm}
      >
        <span className="text-base text-slate-50">Confirm</span>
      </button>
    </section>
  );
};
