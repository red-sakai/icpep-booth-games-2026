import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PlayerTabHeaderProps = {
  tab: "1" | "2";
  setTab: React.Dispatch<React.SetStateAction<"1" | "2">>;
  playerCount: 1 | 2;
};

export const PlayerTabHeader = ({
  tab,
  setTab,
  playerCount,
}: PlayerTabHeaderProps) => {
  return (
    <section>
      <div
        className={cn(
          "flex items-center gap-4",
          tab === "1" ? "text-blue-500" : "text-red-500",
        )}
      >
        <h2 className="text-2xl font-bold">Choose/Create Player</h2>
        <div className="flex items-center gap-2">
          {tab === "2" && (
            <button
              className={cn(
                "border border-red-500/80 rounded-md p-0.5",
                "bg-slate-50 shadow-sm hover:scale-110 active:scale-95",
                "transition-transform duration-200",
              )}
              onClick={() => setTab("1")}
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          <div className="flex items-end gap-2">
            <span
              className={cn(
                tab === "1"
                  ? "text-5xl font-bold bg-slate-50 px-3 py-0.5 rounded-md shadow-sm"
                  : "text-xl font-semibold",
                "transition-all duration-300",
              )}
            >
              1
            </span>
            {playerCount == 2 && (
              <span
                className={cn(
                  tab === "2"
                    ? "text-5xl font-bold bg-slate-50 px-2 py-0.5 rounded-md shadow-sm"
                    : "text-xl font-semibold",
                  "transition-all duration-300",
                )}
              >
                2
              </span>
            )}
          </div>
          {playerCount == 2 && tab === "1" && (
            <button
              className={cn(
                "border border-blue-500/80 rounded-md p-0.5",
                "bg-slate-50 shadow-sm hover:scale-110 active:scale-95",
                "transition-transform duration-200",
              )}
              onClick={() => setTab("2")}
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-base text-gray-700">
        Select an existing player or create a new one to start playing!
      </p>
    </section>
  );
};
