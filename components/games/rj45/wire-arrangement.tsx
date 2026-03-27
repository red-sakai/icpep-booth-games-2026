"use client";

import { motion, Reorder } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Wire } from "@/lib/types";

type WireArrangementProps = {
  wires: Wire[];
  setWires: (wires: Wire[]) => void;
  checkArrangement: () => void;
  isMobile: boolean;
  isLargeScreen: boolean;
};

export default function WireArrangement({
  wires,
  setWires,
  checkArrangement,
  isMobile,
  isLargeScreen,
}: WireArrangementProps) {
  return (
    <Card className="p-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold text-center mb-4 text-purple-700">
        Arrange the wires in the correct order
      </h3>

      {/* Responsive wire arrangement - vertical on mobile, horizontal on larger screens */}
      <div className="flex flex-col items-center">
        <Reorder.Group
          axis={isMobile ? "y" : "x"}
          values={wires}
          onReorder={setWires}
          className={`${
            isMobile
              ? "flex flex-col gap-2"
              : "flex flex-row gap-2 justify-center"
          } p-4 bg-white/30 backdrop-blur-sm rounded-xl min-h-[120px] w-full`}
        >
          {wires.map((wire, index) => (
            <Reorder.Item
              key={wire.id}
              value={wire}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                className={`flex ${
                  isMobile ? "flex-row items-center" : "flex-col items-center"
                } p-2 bg-white/80 rounded-xl hover:bg-white border border-purple-100 shadow-sm ${
                  isLargeScreen ? "w-[80px]" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center text-purple-400 font-medium mb-1 mx-2">
                  {index + 1}
                </div>
                <div
                  className={`h-12 sm:h-16 w-6 sm:w-8 rounded-md flex items-center justify-center relative ${wire.bgClass} border border-slate-300`}
                >
                  {wire.stripeClass && (
                    <div
                      className={`absolute top-0 left-0 w-full h-full ${wire.stripeClass} opacity-70`}
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)",
                        backgroundSize: "14px 14px",
                        mixBlendMode: "multiply",
                      }}
                    ></div>
                  )}
                </div>
                <div className="text-xs font-medium text-purple-700 bg-white/80 px-2 py-1 rounded mx-2 my-1 shadow-sm whitespace-nowrap">
                  {wire.name}
                </div>
                <div
                  className={`text-purple-300 ${isMobile ? "ml-auto" : "mt-1"}`}
                >
                  {isMobile ? "⋮⋮" : "≡"}
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={checkArrangement}
          className="bg-purple-500 hover:bg-purple-600 text-white shadow-md text-base sm:text-lg px-4 sm:px-6 py-2 rounded-xl"
        >
          Check Wiring
        </Button>
      </div>
    </Card>
  );
}