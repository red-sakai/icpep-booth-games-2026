"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { GameType } from "@/lib/types";

type BackToHomeButtonProps = {
  navigateTo: (game: GameType) => void;
  variant: "sky" | "amber" | "cyan";
};

export default function BackToHomeButton({
  navigateTo,
  variant,
}: BackToHomeButtonProps) {
  const variantStyles = {
    sky: "bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700",
    amber: "bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700",
    cyan: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="mb-6">
      <Button
        onClick={() => navigateTo("home")}
        variant="outline"
        className={`${variantStyles[variant]} flex items-center gap-2 shadow-sm`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Button>
    </div>
  );
}
