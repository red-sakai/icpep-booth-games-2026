import { Card } from "@/components/ui/card";
import type { WireStandard, Wire } from "@/lib/types";
import { renderWire } from "@/lib/game-utils/rj45-utils";

type WirePatternProps = {
  standard: WireStandard;
  wires: Wire[];
};

export default function WirePattern({ standard, wires }: WirePatternProps) {
  return (
    <Card className="p-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold text-center mb-4 text-purple-700 flex items-center justify-center gap-2">
        <span className="bg-purple-100/80 text-purple-700 px-2 py-1 rounded text-sm font-bold">
          {standard}
        </span>
        Standard Pattern
      </h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 sm:p-4">
        {wires.map((wire, index) => renderWire(wire, index))}
      </div>
    </Card>
  );
}