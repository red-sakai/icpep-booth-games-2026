import { cn } from "@/lib/utils";

type ScoreToasterProps = {
  variant: "sky" | "rose" | "emerald";
  message: string;
  description: string;
};

export const NotificationToaster = ({
  variant,
  message,
  description,
}: ScoreToasterProps) => {
  const getVariantDivClasses = () => {
    switch (variant) {
      case "sky":
        return "border-sky-300 bg-sky-50 text-sky-700 shadow-sky-200";
      case "emerald":
        return "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-200";
      case "rose":
        return "border-rose-300 bg-rose-50 text-rose-700 shadow-rose-200";
      default:
        return "border-slate-300 bg-slate-50 text-slate-700 shadow-slate-200";
    }
  };
  const getVariantH3Classes = () => {
    switch (variant) {
      case "sky":
        return "text-sky-600";
      case "emerald":
        return "text-emerald-600";
      case "rose":
        return "text-rose-600";
      default:
        return "text-slate-700";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-slate-50 backdrop-blur-md",
        "border shadow-lg rounded-lg p-4",
        getVariantDivClasses(),
      )}
    >
      <h3 className={cn("text-base font-medium", getVariantH3Classes())}>
        {message}
      </h3>
      <p className="text-sm text-slate-700 mt-1">{description}</p>
    </div>
  );
};
