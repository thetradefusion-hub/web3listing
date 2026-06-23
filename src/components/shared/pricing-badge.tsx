import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PricingModel } from "@/types/database";

const BADGES: Record<
  PricingModel,
  { label: string; dot: string; className: string; classNameDark?: string }
> = {
  fixed: {
    label: "Fixed Price",
    dot: "bg-emerald-500",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    classNameDark: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  },
  quote: {
    label: "Custom Quote",
    dot: "bg-amber-500",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    classNameDark: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  },
  enterprise: {
    label: "Enterprise",
    dot: "bg-red-500",
    className: "border-red-200 bg-red-50 text-red-700",
    classNameDark: "border-red-500/30 bg-red-500/15 text-red-400",
  },
};

export function PricingBadge({
  model,
  variant = "light",
}: {
  model: PricingModel;
  variant?: "light" | "dark";
}) {
  const badge = BADGES[model];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        variant === "dark" ? badge.classNameDark : badge.className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", badge.dot)} />
      {badge.label}
    </Badge>
  );
}
