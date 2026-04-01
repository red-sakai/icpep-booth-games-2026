import { Bot, Pencil, User } from "lucide-react";
import { usePlayers } from "@/contexts/players-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EditTeamDialog } from "@/components/edit-players/edit-player/edit-team-dialog";
import { BoothPlayerType, EGame, GameMode } from "@/lib/types";

type EditPlayersProps = {
  gameName: EGame;
  gameMode: GameMode;
  openOnMount?: boolean;
};

export const EditPlayers = ({
  gameName,
  gameMode,
  openOnMount = true,
}: EditPlayersProps) => {
  const [team, setTeam] = useState<"team1" | "team2">("team1");
  const {
    currTeam1Player,
    currTeam2Player,
    setCurrTeam1Player,
    setCurrTeam2Player,
    players,
  } = usePlayers();
  const [isEditTeamDialogOpen, setIsEditTeamDialogOpen] = useState(openOnMount);

  useEffect(() => {
    setCurrTeam1Player((prev) => {
      if (prev) {
        const updatedCurrTeam1Player = players.find(
          (p) => p.name === prev.name,
        );
        if (
          updatedCurrTeam1Player &&
          updatedCurrTeam1Player.status[gameName].isLocked
        ) {
          setCurrTeam1Player(null);
          return updatedCurrTeam1Player;
        }
      }
      return prev;
    });
  }, [players, gameMode, setCurrTeam1Player]);
  useEffect(() => {
    setCurrTeam2Player((prev) => {
      if (prev) {
        const updatedCurrTeam2Player = players.find(
          (p) => p.name === prev.name,
        );
        if (
          updatedCurrTeam2Player &&
          updatedCurrTeam2Player.status[gameName].isLocked
        ) {
          setCurrTeam2Player(null);
          return updatedCurrTeam2Player;
        }
      }
      return prev;
    });
  }, [players, gameMode, setCurrTeam2Player]);

  const handlePlayerNameDisplayClick = (newTeam: "team1" | "team2") => {
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
              gameName={gameName}
              gameMode={gameMode}
              team="team1"
              player={currTeam1Player}
              onClick={() => handlePlayerNameDisplayClick("team1")}
            />
          </div>
          {gameMode !== "solo" && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Team 2:</span>
              <PlayerNameDisplay
                gameName={gameName}
                gameMode={gameMode}
                team="team2"
                player={currTeam2Player}
                onClick={() => handlePlayerNameDisplayClick("team2")}
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
        gameName={gameName}
        gameMode={gameMode}
        team={team}
        setTeam={setTeam}
        isOpen={isEditTeamDialogOpen}
        setIsOpen={setIsEditTeamDialogOpen}
      />
    </>
  );
};

type PlayerNameDisplayProps = {
  gameName: EGame;
  gameMode: GameMode;
  team: "team1" | "team2";
  player: BoothPlayerType | null;
  onClick?: () => void;
};
const PlayerNameDisplay = ({
  gameName,
  gameMode,
  team,
  player,
  onClick,
}: PlayerNameDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
        "relative hover:z-50",
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAi ? <Bot className="size-4" /> : <User className="size-4" />}
      <span className="text-sm">{player?.name || "None"}</span>
      {isHovered && player?.status[gameName].playsRemaining && (
        <div
          className={cn(
            "absolute px-8 py-4",
            "top-full left-1/2 -translate-x-1/2 mt-4",
            " bg-slate-50/60 backdrop-blur-xs rounded-md shadow-md",
            "border border-slate-100/80",
            "flex items-center",
          )}
        >
          <p className="whitespace-nowrap text-slate-600">
            tries left:{" "}
            <span
              className={cn(
                "text-lg font-semibold",
                team === "team1" ? "text-sky-600" : "text-rose-600",
              )}
            >
              {player.status[gameName].playsRemaining}
            </span>
          </p>
        </div>
      )}
    </button>
  );
};
