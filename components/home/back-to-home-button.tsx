"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { GameType } from "@/lib/types";

type BackToHomeButtonProps = {
  navigateTo: (game: GameType) => void;
  variant: "pink" | "rose" | "purple";
};

export default function BackToHomeButton({
  navigateTo,
  variant,
}: BackToHomeButtonProps) {
  const variantStyles = {
    pink: "bg-white/50 backdrop-blur-sm border-pink-300 hover:bg-pink-100/70 hover:border-pink-400 text-pink-600 hover:text-pink-600",
    rose: "bg-white/50 backdrop-blur-sm border-rose-300 hover:bg-rose-50/70 hover:border-rose-400 text-rose-600 hover:text-rose-600",
    purple: "bg-white/50 backdrop-blur-sm border-purple-300 hover:bg-purple-100/70 hover:border-purple-400 text-purple-600 hover:text-purple-600",
  };

  return (
    <div className="mb-6">
      <Button
        onClick={() => navigateTo("home")}
        variant="outline"
        className={`${variantStyles[variant]} flex items-center gap-2 shadow-sm rounded-xl`}
      >
        <ArrowLeft size={16} />
        Back to Games
      </Button>
    </div>
  );
}