import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import playerColorPalette from "@/data/player-color-pallete.json";
import { ColorPalette } from "./color-palette";

type FilterPlayersProps = {
  variant: "blue" | "red";
  filterNameValue: string;
  setFilterNameValue: React.Dispatch<React.SetStateAction<string>>;
  filterColor: string;
  setFilterColor: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterPlayers = ({
  variant,
  filterNameValue,
  setFilterNameValue,
  filterColor,
  setFilterColor,
}: FilterPlayersProps) => {
  const getClassNames = () => {
    if (variant === "blue") {
      return ["hover:outline-blue-500/80"];
    } else if (variant === "red") {
      return ["hover:outline-red-500/80"];
    } else return [];
  };

  return (
    <section className="flex gap-2 items-center">
      <input
        placeholder="Search player name"
        value={filterNameValue}
        onChange={(e) => setFilterNameValue(e.target.value)}
        className={cn(
          "outline-2 outline-slate-200 rounded-lg shadow-md",
          "h-8 w-full px-2 bg-slate-50",
          "text-gray-700 text-base",
          ...getClassNames(),
          "transition-all duration-200",
        )}
      />
      <FilterPlayerColorPicker
        variant={variant}
        filterColor={filterColor}
        setSelectedColor={setFilterColor}
      />
    </section>
  );
};

type FilterPlayerColorPickerProps = {
  variant: "blue" | "red";
  filterColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};
const FilterPlayerColorPicker = ({
  variant,
  filterColor,
  setSelectedColor,
}: FilterPlayerColorPickerProps) => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const getClassNames = () => {
    if (variant === "blue") {
      return ["hover:outline-blue-500/80"];
    } else if (variant === "red") {
      return ["hover:outline-red-500/80"];
    } else return [];
  };

  return (
    <div
      className={cn(
        "relative outline-2 outline-slate-200 rounded-lg shadow-md",
        ...getClassNames(),
      )}
    >
      <button
        className={cn(
          "flex items-center gap-2 rounded-md",
          "px-2 py-1 h-full bg-slate-50",
          "cursor-pointer",
        )}
        onClick={() => !isColorPaletteOpen && setIsColorPaletteOpen(true)}
      >
        {filterColor !== "all" ? (
          <span
            className="size-6 rounded-full"
            style={{ backgroundColor: filterColor }}
          />
        ) : (
          <span>All</span>
        )}
        <ChevronDown className="size-6 text-gray-700" />
      </button>

      <AnimatePresence>
        {isColorPaletteOpen && (
          <ColorPalette
            variant={variant}
            selectedColor={filterColor}
            setSelectedColor={setSelectedColor}
            setIsColorPaletteOpen={setIsColorPaletteOpen}
            colorPalette={["all", ...playerColorPalette]}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
