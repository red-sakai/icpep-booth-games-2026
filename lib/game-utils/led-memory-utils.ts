import type { LED } from "@/lib/types";

// Light mode colors
export const LED_COLORS = {
  1: "bg-red-500 shadow-red-500/50",
  2: "bg-amber-500 shadow-amber-500/50",
  3: "bg-emerald-500 shadow-emerald-500/50",
  4: "bg-sky-500 shadow-sky-500/50",
  5: "bg-purple-500 shadow-purple-500/50",
  6: "bg-pink-500 shadow-pink-500/50",
};

export const LED_INACTIVE_COLORS = {
  1: "bg-red-100 border-red-300",
  2: "bg-amber-100 border-amber-300",
  3: "bg-emerald-100 border-emerald-300",
  4: "bg-sky-100 border-sky-300",
  5: "bg-purple-100 border-purple-300",
  6: "bg-pink-100 border-pink-300",
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
