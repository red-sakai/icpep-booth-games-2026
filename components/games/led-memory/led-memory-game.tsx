"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  EDificultyMultiplyer,
  EGame,
  type DifficultyLevel,
  type GameState,
  type LED,
} from "@/lib/types";
import { getRandomLED } from "@/lib/game-utils/led-memory-utils";
import GameHeader from "@/components/games/led-memory/game-header";
import LEDGrid from "@/components/games/led-memory/led-grid";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePlayers } from "@/contexts/players-context";
import { NotificationToaster } from "../../notification/notification-toaster";
import { LockInScoreDialog } from "@/components/confirmation/lock-in-score";
import { cn } from "@/lib/utils";

const TIME_BONUS_MAX_POINTS = 5;
const LEVEL_CONFIG: Record<
  DifficultyLevel,
  {
    label: string;
    sequenceLength: number;
    timeLimit: number;
    ledShowMs: number;
    ledGapMs: number;
  }
> = {
  easy: {
    label: "Easy",
    sequenceLength: 6,
    timeLimit: 20,
    ledShowMs: 900,
    ledGapMs: 500,
  },
  medium: {
    label: "Medium",
    sequenceLength: 6,
    timeLimit: 15,
    ledShowMs: 750,
    ledGapMs: 380,
  },
  hard: {
    label: "Hard",
    sequenceLength: 6,
    timeLimit: 10,
    ledShowMs: 600,
    ledGapMs: 280,
  },
};

const generateSequenceByLength = (length: number): LED[] => {
  const newSequence: LED[] = [];

  for (let index = 0; index < length; index++) {
    newSequence.push(getRandomLED());
  }

  return newSequence;
};

const LED_TONE_FREQUENCIES: Record<LED, number> = {
  1: 261.63,
  2: 329.63,
  3: 392.0,
  4: 440.0,
  5: 523.25,
  6: 659.25,
};

const LED_TONE_ATTACK = 0.008;
const LED_TONE_DECAY = 0.24;
const LED_TONE_PEAK_GAIN = 0.24;

type LEDMemoryGameProps = {
  gameId: string;
};
export default function LEDMemoryGame({ gameId }: LEDMemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<LED[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LED[]>([]);
  const [activeLED, setActiveLED] = useState<LED | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>("medium");
  const [showLevelDialog, setShowLevelDialog] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const { currTeam1Player } = usePlayers();
  const [isLockInScoreDialogOpen, setIsLockInScoreDialogOpen] = useState(false);
  const [score, setScore] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // show difficulty dialog IF the curr player not emtpy
    if (currTeam1Player && gameState === "idle" && sequence.length === 0) {
      setShowLevelDialog(true);
    }
  }, [currTeam1Player, gameState, sequence.length]);

  const initializeAudio = useCallback(async () => {
    if (typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playLEDTone = useCallback(
    async (led: LED) => {
      const context = await initializeAudio();
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = LED_TONE_FREQUENCIES[led];

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        LED_TONE_PEAK_GAIN,
        context.currentTime + LED_TONE_ATTACK,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + LED_TONE_DECAY,
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + LED_TONE_DECAY + 0.02);
    },
    [initializeAudio],
  );

  // Start the level-based timer for guessing
  const startGuessingTimer = useCallback(
    (level: DifficultyLevel) => {
      const levelConfig = LEVEL_CONFIG[level];
      setTimeLeft(levelConfig.timeLimit);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState("gameover");
            // toast(
            //   `Time's up! You remembered ${playerSequence.length} out of ${sequence.length} correctly.`,
            //   {
            //     className: "bg-rose-100 text-rose-800 border-rose-200",
            //   },
            // );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [playerSequence.length, sequence.length],
  );

  // Show the sequence to the player
  const showSequence = useCallback(
    (currentSequence: LED[], level: DifficultyLevel) => {
      let step = 0;
      const levelConfig = LEVEL_CONFIG[level];

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const playStep = () => {
        if (step < currentSequence.length) {
          setActiveLED(currentSequence[step]);
          void playLEDTone(currentSequence[step]);

          timeoutRef.current = setTimeout(() => {
            setActiveLED(null);

            timeoutRef.current = setTimeout(() => {
              step++;
              playStep();
            }, levelConfig.ledGapMs);
          }, levelConfig.ledShowMs);
        } else {
          setActiveLED(null);
          setGameState("guessing");
          setPlayerSequence([]);
          startGuessingTimer(level);
        }
      };

      timeoutRef.current = setTimeout(playStep, 900);
    },
    [startGuessingTimer],
  );

  // Start a new game
  const startGame = useCallback(
    (level: DifficultyLevel) => {
      const levelConfig = LEVEL_CONFIG[level];
      const fullSequence = generateSequenceByLength(levelConfig.sequenceLength);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (!currTeam1Player) {
        toast.custom(
          () => (
            <NotificationToaster
              variant={"warning"}
              message={`No player detected!`}
              description={`Please make sure a player is selected before starting the game.`}
            />
          ),
          {
            duration: 5000,
            position: "top-center",
          },
        );
        return;
      }

      setSelectedLevel(level);
      setSequence(fullSequence);
      setPlayerSequence([]);
      setTimeLeft(levelConfig.timeLimit);
      setShowLevelDialog(false);
      setGameState("showing");
      void initializeAudio();
      showSequence(fullSequence, level);
      toast.dismiss();
    },
    [initializeAudio, showSequence, currTeam1Player],
  );

  // Handle player clicking an LED
  const handleLEDClick = (led: LED) => {
    if (gameState !== "guessing") return;

    // Light up the LED briefly
    void playLEDTone(led);
    setActiveLED(led);
    setTimeout(() => setActiveLED(null), 200);

    // Add to player sequence
    const newPlayerSequence = [...playerSequence, led];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input is correct so far
    const isCorrectSoFar = newPlayerSequence.every(
      (led, index) => led === sequence[index],
    );

    if (!isCorrectSoFar) {
      // Wrong input, game over
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("gameover");
      return;
    }

    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence!
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("success");
    }
  };

  // Clean up timeouts when component unmounts or game resets
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      const audioContext = audioContextRef.current;
      if (audioContext) {
        void audioContext.close();
      }
    };
  }, []);

  // update post-game score
  useEffect(() => {
    const isFinished = gameState === "gameover" || gameState === "success";

    if (isFinished && sequence.length > 0) {
      const correctSequenceCount =
        playerSequence.length > 0 ? playerSequence.length - 1 : 0;
      const initalPoints =
        correctSequenceCount * EDificultyMultiplyer[selectedLevel];
      let timeBonusPoints = 0;
      if (gameState === "success") {
        timeBonusPoints = Math.round(
          (timeLeft / LEVEL_CONFIG[selectedLevel].timeLimit) *
            TIME_BONUS_MAX_POINTS,
        );
      }
      const newScore = initalPoints + timeBonusPoints;
      setScore(newScore);

      toast.custom(
        () => (
          <NotificationToaster
            variant={"rose"}
            message={`Player ${currTeam1Player ? currTeam1Player.name : "Anonymous"} got ${newScore} points!`}
            description={`You remembered ${correctSequenceCount} out of ${sequence.length} correctly on ${LEVEL_CONFIG[selectedLevel].label} level.`}
          />
        ),
        { duration: 5000 },
      );
      setIsLockInScoreDialogOpen(true);
    }
  }, [gameState, sequence.length]);

  // // Reset game and clear timers
  // const resetGame = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current);
  //   }
  //   setGameState("idle");
  //   setTimeLeft(20);
  // };
  //
  const handleDifficultyChange = (level: DifficultyLevel) => {
    setSelectedLevel(level);
    setShowLevelDialog(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-7 gap-5 sm:gap-6 bg-gradient-to-b from-white-100 via-white-100 to-white-100 rounded-2xl border border-rose-300/50 shadow-xl backdrop-blur-sm">
      <LockInScoreDialog
        team="team1"
        isOpen={isLockInScoreDialogOpen}
        setIsOpen={setIsLockInScoreDialogOpen}
        gameName={EGame.LED_MEMORY}
        player={currTeam1Player}
        score={score}
      />

      <GameHeader
        gameState={gameState}
        playerSequence={playerSequence}
        sequenceLength={sequence.length}
        timeLeft={timeLeft}
        selectedLevel={selectedLevel}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />

      <LEDGrid
        activeLED={activeLED}
        gameState={gameState}
        handleLEDClick={handleLEDClick}
      />

      <div className="flex space-x-4">
        <Button
          onClick={() => startGame(selectedLevel)}
          variant="outline"
          size="lg"
          disabled={gameState === "showing"}
          className={cn(
            "min-w-40 bg-white border-rose-300",
            "hover:bg-rose-50 hover:border-rose-400",
            "text-rose-700 shadow-sm",
            "flex items-center gap-4",
          )}
        >
          <Play className="size-5" />
        </Button>

        <Button
          onClick={() => setShowLevelDialog(true)}
          variant="outline"
          size="lg"
          disabled={gameState === "showing"}
          className="min-w-40 bg-white border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 shadow-sm"
        >
          Change Difficulty
        </Button>

        <Button
          onClick={() => setLeaderboardOpen(true)}
          variant="outline"
          size="lg"
          className="bg-white border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 shadow-sm"
        >
          Show Leaderboard
        </Button>
      </div>

      <div className="w-full flex justify-center">
        <LeaderboardPanel
          gameId="led-memory"
          className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-rose-100"
        />
      </div>

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl border-rose-100">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Leaderboard</DialogTitle>
            <DialogDescription>
              LED Memory scores and rankings
            </DialogDescription>
          </DialogHeader>

          <LeaderboardPanel
            gameId="led-memory"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showLevelDialog}
        onOpenChange={(open) => {
          if (open) {
            setShowLevelDialog(true);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md rounded-xl border-rose-200 [&>button]:hidden"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl text-rose-900">
              Choose Difficulty
            </DialogTitle>
            <DialogDescription>
              Pick a level to start Memory Heist.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => handleDifficultyChange("easy")}
            >
              <span className="text-rose-700 font-medium">Easy</span>
              <span className="text-xs text-rose-400 font-medium">
                6 lights • 20s
              </span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => handleDifficultyChange("medium")}
            >
              <span className="text-rose-700 font-medium">Medium</span>
              <span className="text-xs text-rose-400 font-medium">
                6 lights • 15s
              </span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => handleDifficultyChange("hard")}
            >
              <span className="text-rose-700 font-medium">Hard</span>
              <span className="text-xs text-rose-400 font-medium">
                6 lights • 10s
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
