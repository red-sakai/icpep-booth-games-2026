"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { GameType } from "@/lib/types";
import { BACK_TO_HOME } from "@/lib/home-and-join-configs";

type BackToHomeButtonProps = {
  navigateTo: (game: GameType) => void;
  // This ensures 'variant' must match one of the keys in our config
  variant: keyof typeof BACK_TO_HOME;
};

export default function BackToHomeButton({
  navigateTo,
  variant,
}: BackToHomeButtonProps) {
  return (
    <div className="mb-6">
      <Button
        onClick={() => navigateTo("home")}
        variant="outline"
        className={`${BACK_TO_HOME[variant]} flex items-center gap-2 shadow-sm rounded-xl`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Button>
    </div>
  );
}