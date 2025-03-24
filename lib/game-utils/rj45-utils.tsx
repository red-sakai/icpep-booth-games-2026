import type { Wire, WireStandard } from "@/lib/types";

// Define the T568A and T568B wire standards
export const WIRE_STANDARDS: Record<WireStandard, Wire[]> = {
  T568A: [
    {
      id: 1,
      color1: "white",
      color2: "green",
      name: "White/Green",
      bgClass: "bg-white",
      stripeClass: "bg-green-500",
    },
    {
      id: 2,
      color1: "green",
      color2: null,
      name: "Green",
      bgClass: "bg-green-500",
      stripeClass: null,
    },
    {
      id: 3,
      color1: "white",
      color2: "orange",
      name: "White/Orange",
      bgClass: "bg-white",
      stripeClass: "bg-orange-500",
    },
    {
      id: 4,
      color1: "blue",
      color2: null,
      name: "Blue",
      bgClass: "bg-blue-500",
      stripeClass: null,
    },
    {
      id: 5,
      color1: "white",
      color2: "blue",
      name: "White/Blue",
      bgClass: "bg-white",
      stripeClass: "bg-blue-500",
    },
    {
      id: 6,
      color1: "orange",
      color2: null,
      name: "Orange",
      bgClass: "bg-orange-500",
      stripeClass: null,
    },
    {
      id: 7,
      color1: "white",
      color2: "brown",
      name: "White/Brown",
      bgClass: "bg-white",
      stripeClass: "bg-amber-800",
    },
    {
      id: 8,
      color1: "brown",
      color2: null,
      name: "Brown",
      bgClass: "bg-amber-800",
      stripeClass: null,
    },
  ],
  T568B: [
    {
      id: 1,
      color1: "white",
      color2: "orange",
      name: "White/Orange",
      bgClass: "bg-white",
      stripeClass: "bg-orange-500",
    },
    {
      id: 2,
      color1: "orange",
      color2: null,
      name: "Orange",
      bgClass: "bg-orange-500",
      stripeClass: null,
    },
    {
      id: 3,
      color1: "white",
      color2: "green",
      name: "White/Green",
      bgClass: "bg-white",
      stripeClass: "bg-green-500",
    },
    {
      id: 4,
      color1: "blue",
      color2: null,
      name: "Blue",
      bgClass: "bg-blue-500",
      stripeClass: null,
    },
    {
      id: 5,
      color1: "white",
      color2: "blue",
      name: "White/Blue",
      bgClass: "bg-white",
      stripeClass: "bg-blue-500",
    },
    {
      id: 6,
      color1: "green",
      color2: null,
      name: "Green",
      bgClass: "bg-green-500",
      stripeClass: null,
    },
    {
      id: 7,
      color1: "white",
      color2: "brown",
      name: "White/Brown",
      bgClass: "bg-white",
      stripeClass: "bg-amber-800",
    },
    {
      id: 8,
      color1: "brown",
      color2: null,
      name: "Brown",
      bgClass: "bg-amber-800",
      stripeClass: null,
    },
  ],
};

// Render a wire for the correct pattern display
export const renderWire = (wire: Wire, index: number) => (
  <div className="flex flex-col items-center">
    <div className="text-center text-slate-500 font-medium mb-1">
      {index + 1}
    </div>
    <div
      className={`h-12 sm:h-16 w-6 sm:w-8 rounded-md flex items-center justify-center relative ${wire.bgClass} border border-slate-300 shadow-sm`}
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
    <div className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded mt-1 shadow-sm whitespace-nowrap">
      {wire.name}
    </div>
  </div>
);
