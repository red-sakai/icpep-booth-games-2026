import { Card } from "@/components/ui/card";
import type { WireStandard, Wire } from "@/lib/types";
import { renderWire } from "@/lib/game-utils/rj45-utils";

type WirePatternProps = {
  standard: WireStandard;
  wires: Wire[];
};

export default function WirePattern({ standard, wires }: WirePatternProps) {
  return (
    <Card className="p-4 sm:p-5 bg-white/45 backdrop-blur-md border border-white/50 shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold text-center mb-4 text-purple-700 flex items-center justify-center gap-2">
        <span className="bg-purple-100/80 text-purple-700 px-2 py-1 rounded text-sm font-bold">
          {standard}
        </span>
        Standard Pattern
      </h3>
      <p className="text-center text-sm text-purple-700/75 mb-3">
        Memorize this exact order before the shuffle starts.
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 sm:p-4 bg-white/35 rounded-xl border border-white/50">
        {wires.map((wire, index) => renderWire(wire, index))}
      </div>
    </Card>
  );
}