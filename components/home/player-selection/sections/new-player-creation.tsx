import { usePlayers } from "@/contexts/players-context";
import { BoothPlayerType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Check, ChevronDown, CircleDashed, X } from "lucide-react";
import { useEffect, useState } from "react";
import playerColorPalette from "@/data/player-color-pallete.json";
import { ColorPalette } from "./color-palette";

type NewPlayerCreationProps = {
  variant: "blue" | "red";
};

export const NewPlayerCreation = ({ variant }: NewPlayerCreationProps) => {
  const { players, setPlayers } = usePlayers();
  const [newPlayer, setNewPlayer] = useState<BoothPlayerType>({
    id: "",
    name: "",
    color: "",
  });
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (selectedColor) {
      setNewPlayer((prev) => ({ ...prev, color: selectedColor }));
    }
  }, [selectedColor]);

  const getClassNames = () => {
    if (variant === "blue") {
      return ["hover:outline-blue-500/80"];
    } else if (variant === "red") {
      return ["hover:outline-red-500/80"];
    } else return [];
  };

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewPlayer((prev) => ({
      ...prev,
      name,
      id: String(players.length + 1),
    }));
  };

  const handleSaveNewPlayer = () => {
    if (!newPlayer?.id || !newPlayer?.name || !newPlayer?.color) return;
    if (players.some((player) => player.name === newPlayer.name)) {
      alert(
        "A player with the same name already exists. Please choose a different name.",
      );
      return;
    }
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayer({ id: "", name: "", color: "" });
    setSelectedColor("");
  };
  const handleCancelNewPlayer = () => {
    setNewPlayer({ id: "", name: "", color: "" });
  };

  return (
    <section className="flex gap-2 items-center">
      <input
        placeholder="Enter new name"
        value={newPlayer.name}
        onChange={handleNewNameChange}
        className={cn(
          "outline-2 outline-slate-200 rounded-md shadow-md",
          "h-8 w-full px-2 bg-slate-50",
          "text-gray-700 text-base",
          ...getClassNames(),
          "transition-all duration-200",
        )}
      />

      <NewPlayerColorPicker
        variant={variant}
        newPlayer={newPlayer}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

      <button
        disabled={!newPlayer.id || !newPlayer.name || !newPlayer.color}
        className={cn(
          "px-2 py-1 rounded-md shadow-md",
          newPlayer.id && newPlayer.name && newPlayer.color
            ? "bg-emerald-400 cursor-pointer hover:scale-110 active:scale-95"
            : "bg-gray-400/80 cursor-not-allowed",
          "text-base text-slate-50",
          "transition-transform duration-200",
        )}
        onClick={handleSaveNewPlayer}
      >
        <Check className="size-6" />
      </button>

      <button
        className={cn(
          "px-2 py-1 rounded-md shadow-md",
          "bg-destructive cursor-pointer hover:scale-110 active:scale-95",
          "text-base text-slate-50",
          "transition-transform duration-200",
        )}
        onClick={handleCancelNewPlayer}
      >
        <X className="size-6" />
      </button>
    </section>
  );
};

type NewPlayerColorPickerProps = {
  variant: "blue" | "red";
  newPlayer: BoothPlayerType;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};
const NewPlayerColorPicker = ({
  variant,
  newPlayer,
  selectedColor,
  setSelectedColor,
}: NewPlayerColorPickerProps) => {
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
        onClick={() => setIsColorPaletteOpen((prev) => !prev)}
      >
        {newPlayer.color ? (
          <span
            className="size-6 rounded-full"
            style={{ backgroundColor: newPlayer.color }}
          />
        ) : (
          <CircleDashed className="size-6 text-gray-700" />
        )}
        <ChevronDown className="size-6 text-gray-700" />
      </button>

      <AnimatePresence>
        {isColorPaletteOpen && (
          <ColorPalette
            variant={variant}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            setIsColorPaletteOpen={setIsColorPaletteOpen}
            colorPalette={playerColorPalette}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
