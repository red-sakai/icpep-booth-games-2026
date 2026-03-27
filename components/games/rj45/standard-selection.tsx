"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { WireStandard } from "@/lib/types";
import { WIRE_STANDARDS } from "@/lib/game-utils/rj45-utils";

type StandardSelectionProps = {
  selectStandard: (standard: WireStandard) => void;
};

export default function StandardSelection({
  selectStandard,
}: StandardSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          className="overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 cursor-pointer bg-white/40 backdrop-blur-md"
          onClick={() => selectStandard("T568A")}
        >
          <div className="bg-gradient-to-r from-purple-50/80 to-fuchsia-50/80 p-4 sm:p-6">
            <div className="text-center mb-4">
              <span className="text-lg sm:text-xl font-bold text-purple-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                T568A
              </span>
            </div>
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="flex justify-center gap-1 sm:gap-2">
                {WIRE_STANDARDS["T568A"].map((wire, i) => (
                  <div
                    key={i}
                    className={`h-12 sm:h-16 w-6 sm:w-8 ${wire.bgClass} border border-slate-300 rounded-sm`}
                    style={{
                      backgroundImage: wire.stripeClass
                        ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${wire.stripeClass.replace(
                            "bg-",
                            ""
                          )} 2px, ${wire.stripeClass.replace("bg-", "")} 4px)`
                        : "none",
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-center gap-1 sm:gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div
                    key={num}
                    className="text-center text-xs font-medium text-slate-500 w-6 sm:w-8"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          className="overflow-hidden border-2 border-fuchsia-200 hover:border-fuchsia-400 transition-all duration-200 cursor-pointer bg-white/40 backdrop-blur-md"
          onClick={() => selectStandard("T568B")}
        >
          <div className="bg-gradient-to-r from-fuchsia-50/80 to-purple-50/80 p-4 sm:p-6">
            <div className="text-center mb-4">
              <span className="text-lg sm:text-xl font-bold text-fuchsia-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                T568B
              </span>
            </div>
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="flex justify-center gap-1 sm:gap-2">
                {WIRE_STANDARDS["T568B"].map((wire, i) => (
                  <div
                    key={i}
                    className={`h-12 sm:h-16 w-6 sm:w-8 ${wire.bgClass} border border-slate-300 rounded-sm`}
                    style={{
                      backgroundImage: wire.stripeClass
                        ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${wire.stripeClass.replace(
                            "bg-",
                            ""
                          )} 2px, ${wire.stripeClass.replace("bg-", "")} 4px)`
                        : "none",
                    }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-center gap-1 sm:gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div
                    key={num}
                    className="text-center text-xs font-medium text-slate-500 w-6 sm:w-8"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
