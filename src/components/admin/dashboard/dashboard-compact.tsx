import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { statCardStyles } from "@/lib/theme-tokens";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const adminStatColors = {
  ...statCardStyles,
  teal: {
    icon: "bg-chart-2/15 text-chart-2 ring-chart-2/20",
    accent: "bg-chart-2",
    wash: "from-chart-2/10 via-card to-card",
  },
  pink: {
    icon: "bg-chart-5/10 text-chart-5 ring-chart-5/20",
    accent: "bg-chart-5",
    wash: "from-chart-5/10 via-card to-card",
  },
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
  color: keyof typeof adminStatColors;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}) {
  const styles = adminStatColors[color];
  const TrendIcon =
    trendDirection === "down" ? ArrowDownRight : trendDirection === "up" ? ArrowUpRight : TrendingUp;

  return (
    <Card className="premium-card group relative gap-0 overflow-hidden border-border py-0 shadow-none ring-0">
      <div className={cn("absolute inset-x-0 top-0 h-0.5 opacity-80", styles.accent)} />
      <CardContent className="p-2.5 lg:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-muted-foreground lg:text-[11px]">{title}</p>
            <p className="mt-0.5 truncate text-base font-bold leading-tight tracking-tight text-foreground tabular-nums lg:text-lg">
              {value}
            </p>
            {trend && (
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[9px] font-medium lg:text-[10px]",
                  trendDirection === "down"
                    ? "bg-destructive/10 text-destructive"
                    : trendDirection === "neutral"
                      ? "bg-muted text-muted-foreground"
                      : "bg-chart-2/10 text-chart-2"
                )}
              >
                <TrendIcon className="h-2 w-2" />
                {trend}
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 lg:h-8 lg:w-8 lg:rounded-xl",
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
    <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 lg:px-4 lg:py-2.5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="hidden text-[11px] text-muted-foreground xl:block">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
