import { cn } from "@/lib/utils";

type PodiumEntry = {
  name: string;
  score: number;
};

type TopThreePodiumProps = {
  entries: PodiumEntry[];
  className?: string;
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function TopThreePodium({ entries, className }: TopThreePodiumProps) {
  const topThree = entries.slice(0, 3);
  const slots = [
    { entry: topThree[1], place: 2, blockHeight: "h-20 sm:h-24", tone: "from-slate-200 to-slate-300" },
    { entry: topThree[0], place: 1, blockHeight: "h-28 sm:h-32", tone: "from-amber-200 to-yellow-300" },
    { entry: topThree[2], place: 3, blockHeight: "h-16 sm:h-20", tone: "from-orange-200 to-rose-300" },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-pink-100 bg-gradient-to-b from-white to-pink-50/60 p-3 sm:p-4",
        className,
      )}
    >
      <div className="mx-auto flex max-w-xl items-end justify-center gap-2 sm:gap-4">
        {slots.map((slot) => (
          <div key={`podium-${slot.place}`} className="w-24 sm:w-28">
            <div className="mb-2 min-h-16 text-center">
              {slot.entry ? (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-fuchsia-500 to-pink-500 text-xs font-bold text-white shadow">
                    {getInitials(slot.entry.name)}
                  </div>
                  <p className="mt-1 truncate px-1 text-xs sm:text-sm font-semibold text-slate-800">
                    {slot.entry.name}
                  </p>
                  <p className="text-xs font-medium text-fuchsia-700">{slot.entry.score}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400">No player</p>
              )}
            </div>

            <div
              className={cn(
                "relative overflow-hidden rounded-t-lg border border-white/70 bg-gradient-to-b shadow-inner",
                slot.blockHeight,
                slot.tone,
              )}
            >
              <span className="absolute inset-x-0 top-2 text-center text-3xl font-black text-slate-700/80">
                {slot.place}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}