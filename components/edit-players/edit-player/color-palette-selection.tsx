import { cn } from "@/lib/utils";

type ColorPaletteSelectionProps = {
  team: "team1" | "team2";
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  colorPalette: string[];
  className?: string;
};
export const ColorPaletteSelection = ({
  team,
  selectedColor,
  setSelectedColor,
  colorPalette,
  className = "",
}: ColorPaletteSelectionProps) => {
  const getClassNames = (color: string) => {
    console.log("getClassNames called with color:", color, selectedColor);
    if (team === "team1") {
      return [
        "hover: outline-sky-500/80",
        selectedColor === color ? "bg-sky-300/80 outline-sky-500/80" : "",
      ];
    } else if (team === "team2") {
      return [
        "hover: outline-rose-500/80",
        selectedColor === color ? "bg-rose-300/80 outline-rose-500/80" : "",
      ];
    } else return [];
  };

  return (
    <div className={cn("flex flex-wrap justify-evenly gap-1", className)}>
      {colorPalette.map((color) => (
        <button
          key={color}
          className={cn(
            "px-2 py-2 rounded-md shadow-md bg-slate-50 outline outline-slate-200",
            "flex items-center justify-center",

            ...getClassNames(color),

            "cursor-pointer hover:scale-110 active:scale-95",
            "transition-transform duration-200",
          )}
          onClick={() => {
            setSelectedColor(color);
          }}
        >
          {color === "all" ? (
            <span className="text-xs text-gray-700">All</span>
          ) : (
            <span
              className="size-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
