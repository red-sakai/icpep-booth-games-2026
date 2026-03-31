import {} from "@radix-ui/react-dialog";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { BoothPlayerType, EGame } from "@/lib/types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { submitScore } from "@/lib/leaderboard-utils/leaderboard-utils.client";
import { toast } from "sonner";
import { NotificationToaster } from "../notification/notification-toaster";
import { useLeaderboard } from "@/contexts/leaderboard-context";
import { updatePlayer } from "@/lib/players-utils/players.client";
import { usePlayers } from "@/contexts/players-context";

type LockInScoreDialogProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  gameName: EGame;
  player: BoothPlayerType | null;
  oponent?: BoothPlayerType | null;
  score: number;
};
export const LockInScoreDialog = ({
  isOpen,
  setIsOpen,
  gameName,
  player,
  oponent = null,
  score,
}: LockInScoreDialogProps) => {
  const { updateLeaderboardData } = useLeaderboard();
  const { updatePlayersData } = usePlayers();

  const decrementPlaysRemaining = (p: BoothPlayerType) => {
    const updatedPlayer = { ...p };
    if (
      p.status[gameName].playsRemaining &&
      p.status[gameName].playsRemaining > 0
    ) {
      updatedPlayer.status[gameName] = {
        ...updatedPlayer.status[gameName],
        playsRemaining: p.status[gameName].playsRemaining - 1,
      };
    }
    if (oponent) {
      const updatedOponent = { ...oponent };
      if (
        oponent &&
        oponent.status[gameName].playsRemaining &&
        oponent.status[gameName].playsRemaining > 0
      ) {
        updatedOponent.status[gameName] = {
          ...updatedOponent.status[gameName],
          playsRemaining: oponent.status[gameName].playsRemaining - 1,
        };
        updatePlayer(oponent.name, { ...updatedOponent });
      }
    }
    return updatedPlayer;
  };

  const handleSubmit = () => {
    if (!player) return;
    submitScore({
      gameId: gameName,
      score,
      name: player.name,
    });
    toast.custom(
      () => (
        <NotificationToaster
          variant={"success"}
          message={`Your score of ${score} has been saved!`}
          description={`Check the leaderboard to see how you rank against other players!`}
        />
      ),
      { duration: 5000 },
    );
    const updatedPlayer = decrementPlaysRemaining(player);
    updatedPlayer.status[gameName].isLocked = true;
    updatePlayer(player.name, { ...updatedPlayer });
    updateLeaderboardData();
    updatePlayersData();
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (!player) return;
    const updatedPlayer = decrementPlaysRemaining(player);
    if (updatedPlayer.status[gameName].playsRemaining === 0) {
      toast.custom(
        () => (
          <NotificationToaster
            variant={"warning"}
            message={`No more tries for ${gameName}!`}
            description={`You have no choice but to lock in your score.`}
          />
        ),
        { duration: 5000 },
      );
    } else {
      updatePlayer(player.name, { ...updatedPlayer });
      setIsOpen(false);
    }
  };

  return player ? (
    <Dialog
      open={isOpen}
      // onOpenChange={setIsOpen}
      aria-describedby="player-entry-dialog"
    >
      <DialogContent className="sm:max-w-md bg-white border-sky-100 space-y-4">
        <DialogHeader>
          <DialogTitle
            className={cn(
              "flex items-center justify-center gap-4",
              "text-rose-600",
              "text-2xl font-bold text-center",
            )}
          >
            Do you want to lock in your score?
          </DialogTitle>
          <DialogDescription className="text-center text-slate-700">
            You have{" "}
            <span className="font-semibold text-rose-600">
              {player?.status[gameName].playsRemaining
                ? player.status[gameName].playsRemaining - 1
                : 0}
            </span>{" "}
            {player?.status[gameName].playsRemaining &&
            player.status[gameName].playsRemaining - 1
              ? "try"
              : "tries"}{" "}
            left for{" "}
            <span className="font-semibold text-rose-600">{gameName}</span>.
            Make sure to lock in your best score!
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-end justify-center gap-4 text-rose-600">
          <span className="text-8xl border-2 border-rose-400 rounded-xl px-8 py-4">
            {score}
          </span>
        </div>

        <DialogFooter className="mb-0">
          <Button
            className={cn(
              "w-full bg-slate-50 rounded-xl",
              "text-rose-600",
              "py-6 text-lg font-bold",
              "cursor-pointer border border-slate-300/80",
              "hover:bg-slate-200   hover:shadow-lg",
              "transition-all duration-300",
            )}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              "w-full rounded-xl shadow-lg",
              "bg-rose-500 hover:bg-rose-700 shadow-rose-200",
              "text-white py-6 text-lg font-bold",
              "transition-all duration-300",
              "cursor-pointer",
            )}
            onClick={handleSubmit}
          >
            Lock in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
};
