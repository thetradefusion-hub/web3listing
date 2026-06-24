import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconStyles = {
  blue: {
    icon: "bg-[#EEF2FF] text-[#635BFF] ring-[#E0E7FF]",
    accent: "bg-[#635BFF]",
    wash: "from-[#EEF2FF]/40 to-white",
  },
  green: {
    icon: "bg-[#ECFDF5] text-[#10B981] ring-[#A7F3D0]",
    accent: "bg-[#10B981]",
    wash: "from-[#ECFDF5]/40 to-white",
  },
  orange: {
    icon: "bg-[#FFFBEB] text-[#F59E0B] ring-[#FDE68A]",
    accent: "bg-[#F59E0B]",
    wash: "from-[#FFFBEB]/50 to-white",
  },
  purple: {
    icon: "bg-[#F5F3FF] text-[#8B5CF6] ring-[#DDD6FE]",
    accent: "bg-[#8B5CF6]",
    wash: "from-[#F5F3FF]/40 to-white",
  },
  teal: {
    icon: "bg-[#F0FDFA] text-[#14B8A6] ring-[#99F6E4]",
    accent: "bg-[#14B8A6]",
    wash: "from-[#F0FDFA]/40 to-white",
  },
  pink: {
    icon: "bg-[#FDF2F8] text-[#EC4899] ring-[#FBCFE8]",
    accent: "bg-[#EC4899]",
    wash: "from-[#FDF2F8]/40 to-white",
  },
} as const;

export function AgentStatCard({
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
    <Card
      className={cn(
        "premium-card premium-card-interactive group relative gap-0 overflow-hidden border-[#E2E8F0] bg-gradient-to-br py-0 shadow-none ring-0",
        styles.wash
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-0.5 opacity-90", styles.accent)} />
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
                  "mt-1 inline-flex max-w-full items-center gap-0.5 truncate rounded-full px-1.5 py-px text-[9px] font-medium lg:text-[10px]",
                  trendDirection === "down"
                    ? "bg-[#FEF2F2] text-[#DC2626]"
                    : trendDirection === "neutral"
                      ? "bg-white/80 text-[#64748B] ring-1 ring-[#E2E8F0]"
                      : "bg-[#ECFDF5] text-[#059669]"
                )}
              >
                <TrendIcon className="h-2 w-2 shrink-0" />
                <span className="truncate">{trend}</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105",
              styles.icon
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PremiumPanelHeader({
  title,
  description,
  action,
  accent = "bg-[#635BFF]",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] bg-gradient-to-r from-[#FAFBFF]/80 to-white px-3 py-2 lg:px-4 lg:py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("h-4 w-1 shrink-0 rounded-full", accent)} />
        <div className="min-w-0">
          <h2 className="text-xs font-semibold text-[#0F172A] lg:text-sm">{title}</h2>
          {description && (
            <p className="hidden truncate text-[10px] text-[#94A3B8] lg:block">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ProjectTokenChip({
  symbol,
  name,
}: {
  symbol?: string | null;
  name?: string | null;
}) {
  const label = (symbol || name || "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[9px] font-bold text-[#635BFF] ring-1 ring-[#C7D2FE]/60">
        {label}
      </div>
      <span className="truncate text-[11px] font-medium text-[#0F172A]">{name || "—"}</span>
    </div>
  );
}

export function SupportActionCard({
  icon: Icon,
  title,
  description,
  children,
  tone = "from-[#FAFBFF] to-white",
  accent = "bg-[#635BFF]",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  tone?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-gradient-to-br p-2.5 transition-shadow hover:shadow-md lg:p-3",
        tone
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-0.5", accent)} />
      <div
        className={cn(
          "mb-2 flex h-8 w-8 items-center justify-center rounded-xl ring-1",
          accent === "bg-[#635BFF]" && "bg-[#EEF2FF] text-[#635BFF] ring-[#E0E7FF]",
          accent === "bg-[#10B981]" && "bg-[#ECFDF5] text-[#10B981] ring-[#A7F3D0]",
          accent === "bg-[#F59E0B]" && "bg-[#FFFBEB] text-[#F59E0B] ring-[#FDE68A]"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">{description}</p>
      {children}
    </div>
  );
}
