import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ColorPaletteSelection } from "./color-palette-selection";

type ColorPaletteModalProps = {
  team: "team1" | "team2";
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setIsColorPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorPalette: string[];
};
export const ColorPaletteModal = ({
  team,
  selectedColor,
  setSelectedColor,
  setIsColorPaletteOpen,
  colorPalette,
}: ColorPaletteModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsColorPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsColorPaletteOpen]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute z-20 right-0 top-full mt-2",
        "w-70 max-h-60 flex flex-col gap-2 p-2",
        "bg-slate-50 rounded-md shadow-lg outline outline-slate-200",
      )}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    >
      <ColorPaletteSelection
        team={team}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        colorPalette={colorPalette}
      />
    </motion.div>
  );
};
