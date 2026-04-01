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
import { Pen, User } from "lucide-react";
import { useState } from "react";
import { EditTeamDialog } from "../edit-players/edit-player/edit-team-dialog";

type LockInScoreDialogProps = {
  team: "team1" | "team2";
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  gameName: EGame;
  player: BoothPlayerType | null;
  score: number;
};
export const LockInScoreDialog = ({
  team,
  isOpen,
  setIsOpen,
  gameName,
  player,
  score,
}: LockInScoreDialogProps) => {
  const { updateLeaderboardData } = useLeaderboard();
  const { updatePlayersData } = usePlayers();
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(false);

  const baseColor = team === "team1" ? "sky" : "rose";

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
    return updatedPlayer;
  };

  const handleSubmit = async () => {
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
      { duration: 5000, position: "top-center" },
    );
    const updatedPlayer = decrementPlaysRemaining(player);
    updatedPlayer.status[gameName].isLocked = true;
    await updatePlayer(player.name, { ...updatedPlayer });
    await updateLeaderboardData();
    await updatePlayersData();
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
        { duration: 5000, position: "top-center" },
      );
    } else {
      updatePlayer(player.name, { ...updatedPlayer });
      setIsOpen(false);
    }
  };

  const handleEditChosenPlayerClick = () => {
    setIsEditTeamDialogOpen(true);
  };

  return player ? (
    <>
      <EditTeamDialog
        gameName={gameName}
        gameMode="solo"
        team={team}
        setTeam={() => {}}
        isOpen={isEditTeamDialogOpen}
        setIsOpen={setIsEditTeamDialogOpen}
      />

      <Dialog
        open={isOpen}
        // onOpenChange={setIsOpen}
        aria-describedby="player-entry-dialog"
      >
        <DialogContent className="sm:max-w-md bg-white space-y-4">
          <DialogHeader>
            <DialogTitle
              className={cn(
                "flex items-center justify-center gap-4",
                `text-${baseColor}-600`,
                "text-2xl font-bold text-center",
              )}
            >
              Do you want to lock in your score?
            </DialogTitle>
            <DialogDescription className="text-center text-slate-700">
              You have{" "}
              <span className={`font-semibold text-${baseColor}-600`}>
                {player?.status[gameName].playsRemaining
                  ? player.status[gameName].playsRemaining - 1
                  : "Infinity"}
              </span>{" "}
              {player?.status[gameName].playsRemaining &&
              player.status[gameName].playsRemaining - 1 === 1
                ? "try"
                : "tries"}{" "}
              left for{" "}
              <span className={`font-semibold text-${baseColor}-600`}>
                {gameName}
              </span>
              . Make sure to lock in your best score!
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-4 text-slate-800">
            <span
              className={cn(
                "flex items-center gap-4",
                "bg-slate-100 rounded-xl shadow-lg px-8 py-2",
                "cursor-pointer hover:scale-105 hover:bg-slate-200",
                "active:scale-95 active:shadow-sm",
                "transition-all duration-200",
              )}
              style={{
                borderBottom: `2px solid var(--color-${baseColor}-400)`,
              }}
              onClick={handleEditChosenPlayerClick}
            >
              <User className="size-4" />
              {player.name}
            </span>
            <button
              className={cn(
                "flex items-center gap-4",
                "bg-slate-100 rounded-xl shadow-lg p-2.5",
                "cursor-pointer hover:scale-105 hover:bg-slate-200",
                "active:scale-95 active:shadow-sm",
                "transition-all duration-200",
              )}
              style={{
                borderBottom: `2px solid var(--color-${baseColor}-400)`,
              }}
              onClick={handleEditChosenPlayerClick}
            >
              <Pen className="size-5" />
            </button>
          </div>

          <div
            className={`flex items-end justify-center gap-4 text-${baseColor}-600`}
          >
            <span
              className="text-8xl border-2 rounded-xl px-8 py-4"
              style={{
                border:
                  baseColor === "sky"
                    ? "2px solid var(--color-sky-400)"
                    : "2px solid var(--color-rose-400)",
              }}
            >
              {score}
            </span>
          </div>

          <DialogFooter className="mb-0">
            <Button
              className={cn(
                "w-full bg-slate-50 rounded-xl",
                `text-${baseColor}-600`,
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
                `bg-${baseColor}-500 hover:bg-${baseColor}-700 shadow-${baseColor}-200`,
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
    </>
  ) : null;
};
