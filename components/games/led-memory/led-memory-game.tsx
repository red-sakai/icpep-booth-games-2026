"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { GameState, LED } from "@/lib/types";
import { getRandomLED } from "@/lib/game-utils/led-memory-utils";
import GameHeader from "@/components/games/led-memory/game-header";
import LEDGrid from "@/components/games/led-memory/led-grid";
import LeaderboardPanel from "@/components/games/leaderboard/leaderboard-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DifficultyLevel = "easy" | "medium" | "hard";

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

export default function LEDMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<LED[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LED[]>([]);
  const [activeLED, setActiveLED] = useState<LED | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedLevel, setSelectedLevel] =
    useState<DifficultyLevel>("medium");
  const [showLevelDialog, setShowLevelDialog] = useState(true);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [hasPromptedName, setHasPromptedName] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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
        context.currentTime + LED_TONE_ATTACK
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + LED_TONE_DECAY
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + LED_TONE_DECAY + 0.02);
    },
    [initializeAudio]
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
            toast(
              `Time's up! You remembered ${playerSequence.length} out of ${sequence.length} correctly.`,
              {
                className: "bg-rose-100 text-rose-800 border-rose-200",
              }
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [playerSequence.length, sequence.length]
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
    [startGuessingTimer]
  );

  // Start a new game
  const startGame = useCallback(
    (level: DifficultyLevel) => {
      const levelConfig = LEVEL_CONFIG[level];
      const fullSequence = generateSequenceByLength(levelConfig.sequenceLength);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setSelectedLevel(level);
      setSequence(fullSequence);
      setPlayerSequence([]);
      setTimeLeft(levelConfig.timeLimit);
      setShowLevelDialog(false);
      setShowNameDialog(false);
      setPlayerName("");
      setHasPromptedName(false);
      setGameState("showing");
      void initializeAudio();
      showSequence(fullSequence, level);
    },
    [initializeAudio, showSequence]
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
      (led, index) => led === sequence[index]
    );

    if (!isCorrectSoFar) {
      // Wrong input, game over
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("gameover");

      const currentScore = newPlayerSequence.length - 1;
      toast(
        `Game Over! You remembered ${currentScore} out of ${sequence.length} correctly.`,
        {
          className: "bg-rose-100 text-rose-800 border-rose-200",
        }
      );
      return;
    }

    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence!
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("success");

      toast(
        `Success! You memorized all ${sequence.length} patterns correctly!`,
        {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        }
      );
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

  // Show post-game name dialog once per finished run
  useEffect(() => {
    const isFinished = gameState === "gameover" || gameState === "success";

    if (isFinished && sequence.length > 0 && !hasPromptedName) {
      setShowNameDialog(true);
      setHasPromptedName(true);
    }
  }, [gameState, hasPromptedName, sequence.length]);

  const handleSaveName = () => {
    const trimmedName = playerName.trim();

    if (trimmedName.length > 0) {
      toast(`Nice run, ${trimmedName}! (UI only — not saved)`, {
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
      });
    } else {
      toast("No name entered. You can skip this step.", {
        className: "bg-rose-100 text-rose-800 border-rose-200",
      });
    }

    setShowNameDialog(false);
  };

  const handleSkipName = () => {
    setShowNameDialog(false);
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-7 gap-5 sm:gap-6 bg-gradient-to-b from-white-100 via-white-100 to-white-100 rounded-2xl border border-rose-300/50 shadow-xl backdrop-blur-sm">
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

      {(gameState === "gameover" || gameState === "success") && (
        <Button
          onClick={() => setLeaderboardOpen(true)}
          variant="outline"
          size="lg"
          className="bg-white border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 shadow-sm"
        >
          Show Leaderboard
        </Button>
      )}

      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
        <DialogContent className="sm:max-w-2xl border-rose-100">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Leaderboard</DialogTitle>
            <DialogDescription>LED Memory scores and rankings</DialogDescription>
          </DialogHeader>

          <LeaderboardPanel
            gameId="led-memory"
            limit={9999}
            className="w-full max-w-none"
            entriesClassName="max-h-[60vh] overflow-y-auto pr-2"
          />
        </DialogContent>
      </Dialog>

      <div className="flex space-x-4">
        <Button
          onClick={() => startGame(selectedLevel)}
          variant="outline"
          size="lg"
          disabled={gameState === "showing"}
          className="min-w-40 bg-white border-rose-300 hover:bg-rose-50 hover:border-rose-400 text-rose-700 shadow-sm flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Restart
        </Button>

        <Button
          onClick={() => setShowLevelDialog(true)}
          variant="outline"
          size="lg"
          disabled={gameState === "showing"}
          className="min-w-40 bg-white border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 shadow-sm"
        >
          Change Level
        </Button>
      </div>

      <div className="w-full flex justify-center">
        <LeaderboardPanel
          gameId="led-memory"
          className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-rose-100"
        />
      </div>

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
            <DialogTitle className="text-xl text-rose-900">Choose Difficulty</DialogTitle>
            <DialogDescription>
              Pick a level to start Memory Heist.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => startGame("easy")}
            >
              <span className="text-rose-700 font-medium">Easy</span>
              <span className="text-xs text-rose-400 font-medium">6 lights • 20s</span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => startGame("medium")}
            >
              <span className="text-rose-700 font-medium">Medium</span>
              <span className="text-xs text-rose-400 font-medium">6 lights • 15s</span>
            </Button>
            <Button
              variant="outline"
              className="justify-between border-rose-100 hover:border-rose-300 hover:bg-rose-50/70"
              onClick={() => startGame("hard")}
            >
              <span className="text-rose-700 font-medium">Hard</span>
              <span className="text-xs text-rose-400 font-medium">6 lights • 10s</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-md rounded-xl border-rose-200">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl text-rose-900">Great Game!</DialogTitle>
            <DialogDescription>
              Enter your name for leaderboard preview. You can skip.
            </DialogDescription>
          </DialogHeader>

          <input
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full rounded-md border border-rose-200 bg-white px-3 py-2.5 text-sm text-rose-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
          />

          <DialogFooter>
            <Button
              variant="outline"
              className="border-rose-200 text-rose-700"
              onClick={handleSkipName}
            >
              Skip
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSaveName}>
              Save Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
