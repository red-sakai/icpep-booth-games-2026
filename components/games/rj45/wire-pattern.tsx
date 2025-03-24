import { Card } from "@/components/ui/card";
import type { WireStandard, Wire } from "@/lib/types";
import { renderWire } from "@/lib/game-utils/rj45-utils";

type WirePatternProps = {
  standard: WireStandard;
  wires: Wire[];
};

export default function WirePattern({ standard, wires }: WirePatternProps) {
  return (
    <Card className="p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4 text-cyan-700 flex items-center justify-center gap-2">
        <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-sm font-bold">
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
