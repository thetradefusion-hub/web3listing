import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconStyles = {
  blue: { icon: "bg-[#EEF2FF] text-[#635BFF]", accent: "bg-[#635BFF]" },
  green: { icon: "bg-[#ECFDF5] text-[#10B981]", accent: "bg-[#10B981]" },
  orange: { icon: "bg-[#FFFBEB] text-[#F59E0B]", accent: "bg-[#F59E0B]" },
  purple: { icon: "bg-[#F5F3FF] text-[#8B5CF6]", accent: "bg-[#8B5CF6]" },
  teal: { icon: "bg-[#F0FDFA] text-[#14B8A6]", accent: "bg-[#14B8A6]" },
  pink: { icon: "bg-[#FDF2F8] text-[#EC4899]", accent: "bg-[#EC4899]" },
} as const;

export function AdminDashboardStatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendDirection = "up",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: keyof typeof iconStyles;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}) {
  const styles = iconStyles[color];
  const TrendIcon =
    trendDirection === "down" ? ArrowDownRight : trendDirection === "up" ? ArrowUpRight : TrendingUp;

  return (
    <Card className="premium-card group relative gap-0 overflow-hidden border-[#E2E8F0] py-0 shadow-none ring-0">
      <div className={cn("absolute inset-x-0 top-0 h-0.5 opacity-80", styles.accent)} />
      <CardContent className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-[#64748B] lg:text-[11px]">{title}</p>
            <p className="mt-0.5 truncate text-base font-bold leading-tight tracking-tight text-[#0F172A] tabular-nums lg:text-lg">
              {value}
            </p>
            {trend && (
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[9px] font-medium lg:text-[10px]",
                  trendDirection === "down"
                    ? "bg-[#FEF2F2] text-[#DC2626]"
                    : trendDirection === "neutral"
                      ? "bg-[#F8FAFC] text-[#64748B]"
                      : "bg-[#ECFDF5] text-[#059669]"
                )}
              >
                <TrendIcon className="h-2 w-2" />
                {trend}
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg lg:h-8 lg:w-8 lg:rounded-xl",
              styles.icon
            )}
          >
            <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompactPanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] px-3 py-2 lg:px-4 lg:py-2.5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-[#0F172A]">{title}</h2>
        {description && (
          <p className="hidden text-[11px] text-[#94A3B8] xl:block">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
