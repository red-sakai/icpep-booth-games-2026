import { cn } from "@/lib/utils";
import { AlertTriangle, BadgeCheck, CircleQuestionMark } from "lucide-react";

type ScoreToasterProps = {
  variant?:
    | "success"
    | "error"
    | "warning"
    | "sky"
    | "rose"
    | "purple"
    | "default";
  message: string;
  description: string;
};

export const NotificationToaster = ({
  variant = "default",
  message,
  description,
}: ScoreToasterProps) => {
  const getVariantDivClasses = () => {
    switch (variant) {
      case "success":
        return "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-emerald-200";
      case "error":
        return "border-rose-300 bg-rose-50 text-rose-700 shadow-rose-200";
      case "warning":
        return "border-yellow-300 bg-yellow-50 text-yellow-700 shadow-yellow-200";
      case "sky":
        return "border-sky-300 bg-sky-50 text-sky-700 shadow-sky-200";
      case "rose":
        return "border-rose-300 bg-rose-50 text-rose-700 shadow-rose-200";
      case "purple":
        return "border-purple-300 bg-purple-50 text-purple-700 shadow-purple-200";
      default:
        return "border-slate-300 bg-slate-50 text-slate-700 shadow-slate-200";
    }
  };
  const getVariantH3Classes = () => {
    switch (variant) {
      case "success":
        return "text-emerald-600";
      case "error":
        return "text-rose-600";
      case "warning":
        return "text-yellow-600";
      case "sky":
        return "text-sky-600";
      case "rose":
        return "text-rose-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-slate-700";
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-slate-50 backdrop-blur-md",
        "border shadow-md rounded-lg p-4",
        getVariantDivClasses(),
      )}
    >
      <div className="flex items-center gap-4">
        {variant === "success" ? (
          <BadgeCheck className="size-5 text-emerald-600" />
        ) : variant === "warning" ? (
          <AlertTriangle className="size-5 text-yellow-600" />
        ) : variant === "error" ? (
          <CircleQuestionMark className="size-5 text-rose-600" />
        ) : variant === "sky" ? (
          <CircleQuestionMark className="size-5 text-sky-600" />
        ) : variant === "rose" ? (
          <CircleQuestionMark className="size-5 text-rose-600" />
        ) : variant === "purple" ? (
          <CircleQuestionMark className="size-5 text-purple-600" />
        ) : (
          <></>
        )}
        <h3 className={cn("text-base font-medium", getVariantH3Classes())}>
          {message}
        </h3>
      </div>
      <p className="text-sm text-slate-700 mt-1">{description}</p>
    </div>
  );
};
