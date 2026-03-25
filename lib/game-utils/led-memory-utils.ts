import type { LED } from "@/lib/types";

// Light mode colors - more vibrant
export const LED_COLORS = {
  1: "bg-red-500 shadow-red-500/70 border-red-400",
  2: "bg-orange-500 shadow-orange-500/70 border-orange-400",
  3: "bg-emerald-500 shadow-emerald-500/70 border-emerald-400",
  4: "bg-blue-500 shadow-blue-500/70 border-blue-400",
  5: "bg-violet-500 shadow-violet-500/70 border-violet-400",
  6: "bg-pink-500 shadow-pink-500/70 border-pink-400",
};

export const LED_INACTIVE_COLORS = {
  1: "bg-red-200 border-red-400",
  2: "bg-orange-200 border-orange-400",
  3: "bg-emerald-200 border-emerald-400",
  4: "bg-blue-200 border-blue-400",
  5: "bg-violet-200 border-violet-400",
  6: "bg-pink-200 border-pink-400",
};

// Fixed pattern length
const PATTERN_LENGTH = 6;

// Generate a random LED number (1-6)
export const getRandomLED = (): LED => {
  return (Math.floor(Math.random() * 6) + 1) as LED;
};

// Generate a full sequence of 6 patterns
export const generateFullSequence = (): LED[] => {
  const newSequence: LED[] = [];
  for (let i = 0; i < PATTERN_LENGTH; i++) {
    newSequence.push(getRandomLED());
  }
  return newSequence;
};
