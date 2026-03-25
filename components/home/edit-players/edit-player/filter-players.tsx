import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import playerColorPaletteData from "@/data/player-color-pallete.json";
import { ColorPaletteModal } from "./color-palette-modal";

type FilterPlayersProps = {
  team: "team1" | "team2";
  filterNameValue: string;
  setFilterNameValue: React.Dispatch<React.SetStateAction<string>>;
  filterColor: string;
  setFilterColor: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterPlayers = ({
  team,
  filterNameValue,
  setFilterNameValue,
  filterColor,
  setFilterColor,
}: FilterPlayersProps) => {
  const getClassNames = () => {
    if (team === "team1") {
      return ["hover:border-2 hover:border-sky-600/80"];
    } else if (team === "team2") {
      return ["hover:border-2 hover:border-rose-700/80"];
    } else return [];
  };

  return (
    <section className="flex gap-2 items-center">
      <input
        placeholder="Search player name"
        maxLength={20}
        value={filterNameValue}
        onChange={(e) => setFilterNameValue(e.target.value)}
        className={cn(
          "border border-sky-600 rounded-lg shadow-md",
          "w-full py-2 px-4 bg-slate-50",
          "text-sky-700 text-base",
          ...getClassNames(),
          "transition-all duration-200",
        )}
      />
      <FilterPlayerColorPicker
        team={team}
        filterColor={filterColor}
        setSelectedColor={setFilterColor}
      />
    </section>
  );
};

type FilterPlayerColorPickerProps = {
  team: "team1" | "team2";
  filterColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};
const FilterPlayerColorPicker = ({
  team,
  filterColor,
  setSelectedColor,
}: FilterPlayerColorPickerProps) => {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const getClassNames = () => {
    if (team === "team1") {
      return ["hover:border-2 hover:border-sky-600/80"];
    } else if (team === "team2") {
      return ["hover:border-2 hover:border-rose-700/80"];
    } else return [];
  };

  return (
    <div className={cn("relative bg-transparent")}>
      <button
        className={cn(
          "flex items-center gap-2 rounded-md",
          "px-4 py-2 h-full bg-slate-50",
          "cursor-pointer rounded-lg shadow-md",
          "border border-sky-600",
          ...getClassNames(),
          "transition-all duration-200",
        )}
        onClick={() => !isColorPaletteOpen && setIsColorPaletteOpen(true)}
      >
        {filterColor !== "all" ? (
          <span
            className="size-6 rounded-full"
            style={{ backgroundColor: filterColor }}
          />
        ) : (
          <span className="text-sky-600">All</span>
        )}
        <ChevronDown className="size-6 text-sky-600" />
      </button>

      <AnimatePresence>
        {isColorPaletteOpen && (
          <ColorPaletteModal
            team={team}
            selectedColor={filterColor}
            setSelectedColor={setSelectedColor}
            setIsColorPaletteOpen={setIsColorPaletteOpen}
            colorPalette={["all", ...playerColorPaletteData]}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
