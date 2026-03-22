import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type ColorPaletteProps = {
  variant: "blue" | "red";
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setIsColorPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorPalette: string[];
};
export const ColorPalette = ({
  variant,
  selectedColor,
  setSelectedColor,
  setIsColorPaletteOpen,
  colorPalette,
}: ColorPaletteProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const getClassNames = (color: string) => {
    if (variant === "blue") {
      return [
        "hover: outline-blue-500/80",
        selectedColor === color ? "bg-blue-300/80 outline-blue-500/80" : "",
      ];
    } else if (variant === "red") {
      return [
        "hover: outline-red-500/80",
        selectedColor === color ? "bg-red-300/80 outline-red-500/80" : "",
      ];
    } else return [];
  };

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
      <div className={cn("flex flex-wrap justify-evenly gap-1")}>
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
    </motion.div>
  );
};
