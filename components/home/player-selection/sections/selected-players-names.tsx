import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";

type SelectedPlayersNamesProps = {
  selectedPlayers: {
    player1: BoothPlayerType | null;
    player2: BoothPlayerType | null;
  };
};

export const SelectedPlayerNames = ({
  selectedPlayers,
}: SelectedPlayersNamesProps) => {
  return (
    <section className="flex gap-2 items-center justify-start">
      <div className={cn("flex items-center gap-4", "mt-auto")}>
        <span className="text-gray-500 text-base">Player 1: </span>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
          <span
            className={cn(
              "text-sm font-medium",
              selectedPlayers.player1 ? "text-blue-500/80" : "text-gray-500/80",
            )}
          >
            {selectedPlayers.player1 ? selectedPlayers.player1.name : "None"}
          </span>
        </div>
      </div>
      <div className={cn("flex items-center gap-4", "mt-auto")}>
        <span className="text-gray-500 text-base">Player 2: </span>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-0.5 rounded-md shadow-md">
          <span
            className={cn(
              "text-sm font-medium",
              selectedPlayers.player2 ? "text-red-500/80" : "text-gray-500/80",
            )}
          >
            {selectedPlayers.player2 ? selectedPlayers.player2.name : "None"}
          </span>
        </div>
      </div>
    </section>
  );
};
