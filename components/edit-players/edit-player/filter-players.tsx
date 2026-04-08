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
  const getClasses = () => {
    if (team === "team1") {
      return "border-sky-600 text-purple-700 hover:border-2 hover:border-purple-600/80";
    } else if (team === "team2") {
      return "border-rose-700 text-rose-700 hover:border-2 hover:border-rose-700/80";
    } else return "";
  };

  return (
    <section className="flex gap-2 items-center">
      <input
        placeholder="Search player name"
        maxLength={20}
        value={filterNameValue}
        onChange={(e) => setFilterNameValue(e.target.value)}
        className={cn(
          "border hover:border-2 rounded-lg shadow-md text-base",
          "w-full py-2 px-4 bg-slate-50",
          "transition-all duration-200",
          getClasses(),
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
  const getClasses = () => {
    if (team === "team1") {
      return "border-pruple-600 text-purple-700 hover:border-purple-600/80";
    } else if (team === "team2") {
      return "border-rose-700 text-rose-700 hover:border-rose-700/80";
    } else return "";
  };

  return (
    <div className={cn("relative bg-transparent")}>
      <button
        className={cn(
          "flex items-center gap-2 rounded-md",
          "px-4 py-2 h-full bg-slate-50 border hover:border-2",
          "cursor-pointer rounded-lg shadow-md",
          "transition-all duration-200",
          getClasses(),
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
        <ChevronDown className="size-6" />
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
