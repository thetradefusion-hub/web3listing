import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Package, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconStyles = {
  blue: { icon: "bg-[#EEF2FF] text-[#635BFF]", accent: "bg-[#635BFF]" },
  green: { icon: "bg-[#ECFDF5] text-[#10B981]", accent: "bg-[#10B981]" },
  orange: { icon: "bg-[#FFFBEB] text-[#F59E0B]", accent: "bg-[#F59E0B]" },
  purple: { icon: "bg-[#F5F3FF] text-[#8B5CF6]", accent: "bg-[#8B5CF6]" },
  teal: { icon: "bg-[#F0FDFA] text-[#14B8A6]", accent: "bg-[#14B8A6]" },
  pink: { icon: "bg-[#FDF2F8] text-[#EC4899]", accent: "bg-[#EC4899]" },
} as const;

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendDirection = "up",
  largeValue,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: keyof typeof iconStyles;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  largeValue?: boolean;
}) {
  const styles = iconStyles[color];
  const TrendIcon =
    trendDirection === "down" ? ArrowDownRight : trendDirection === "up" ? ArrowUpRight : TrendingUp;

  return (
    <Card className="premium-card premium-card-interactive group relative gap-0 overflow-hidden border-[#E2E8F0] py-0 shadow-none ring-0">
      <div className={cn("absolute inset-x-0 top-0 h-0.5 opacity-80", styles.accent)} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#64748B]">{title}</p>
            <p
              className={cn(
                "mt-1 font-bold leading-none tracking-tight text-[#0F172A] tabular-nums",
                largeValue ? "text-xl xl:text-2xl" : "text-2xl xl:text-[28px]"
              )}
            >
              {value}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#94A3B8]">{subtitle}</p>
            {trend && (
              <div
                className={cn(
                  "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  trendDirection === "down"
                    ? "bg-[#FEF2F2] text-[#DC2626]"
                    : trendDirection === "neutral"
                      ? "bg-[#F8FAFC] text-[#64748B]"
                      : "bg-[#ECFDF5] text-[#059669]"
                )}
              >
                <TrendIcon className="h-2.5 w-2.5" />
                {trend}
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
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

export function OrderStatusBadge({ status, compact, mini }: { status: string; compact?: boolean; mini?: boolean }) {
  const config: Record<string, { className: string; label: string }> = {
    in_progress: {
      className: "border-[#C7D2FE] bg-[#EEF2FF] text-[#635BFF]",
      label: "In Progress",
    },
    payment_confirmed: {
      className: "border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]",
      label: "Payment Confirmed",
    },
    under_review: {
      className: "border-[#FDE68A] bg-[#FFFBEB] text-[#F59E0B]",
      label: "Under Review",
    },
    completed: {
      className: "border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]",
      label: "Completed",
    },
    delivered: {
      className: "border-[#A7F3D0] bg-[#ECFDF5] text-[#10B981]",
      label: "Delivered",
    },
    closed: {
      className: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
      label: "Closed",
    },
    submitted: {
      className: "border-[#FDE68A] bg-[#FFFBEB] text-[#F59E0B]",
      label: "Submitted",
    },
    waiting_payment: {
      className: "border-[#FDE68A] bg-[#FFFBEB] text-[#F59E0B]",
      label: "Waiting Payment",
    },
    third_party_review: {
      className: "border-[#C7D2FE] bg-[#EEF2FF] text-[#635BFF]",
      label: "Third Party Review",
    },
  };

  const item = config[status] || config.submitted;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md font-medium",
        mini
          ? "h-4 px-1 text-[9px] leading-none"
          : compact
            ? "h-5 px-1.5 text-[10px]"
            : "h-6 px-2.5 text-xs",
        item.className
      )}
    >
      {item.label}
    </Badge>
  );
}

export function TopServicesList({
  services,
  compact,
  premium,
}: {
  services: { name: string; count: number }[];
  compact?: boolean;
  premium?: boolean;
}) {
  const maxCount = services[0]?.count || 1;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {services.map((svc, i) => (
        <div key={svc.name} className="group">
          <div className={cn("flex items-center", compact ? "gap-2" : "gap-2.5")}>
            <span
              className={cn(
                "flex shrink-0 items-center justify-center font-bold",
                premium
                  ? "h-5 w-5 rounded-md bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[9px] text-[#635BFF] ring-1 ring-[#C7D2FE]/50"
                  : "rounded-md bg-[#F8FAFC] text-[#64748B] ring-1 ring-[#F1F5F9]",
                !premium && (compact ? "h-5 w-5 text-[9px] rounded" : "h-7 w-7 text-[11px] rounded-lg")
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate font-medium text-[#0F172A]", compact ? "text-[11px]" : "text-sm")}>{svc.name}</p>
            </div>
            <span className={cn("shrink-0 font-semibold tabular-nums text-[#635BFF]", compact ? "text-[11px]" : "text-sm")}>
              {svc.count}
            </span>
          </div>
          {(premium || !compact) && (
            <div className={cn("overflow-hidden rounded-full bg-[#F1F5F9]", premium ? "ml-7 mt-1 h-0.5" : "ml-9 h-1")}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] transition-all duration-500"
                style={{ width: `${Math.max(8, (svc.count / maxCount) * 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DashboardEmptyOrders({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center px-2 py-5 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] ring-1 ring-[#C7D2FE]/50">
          <Package className="h-4 w-4 text-[#635BFF]" />
        </div>
        <p className="mt-2 text-xs font-semibold text-[#0F172A]">No orders yet</p>
        <p className="mt-1 text-[10px] text-[#64748B]">Create a project to get started</p>
        <Link
          href="/partner/projects/new"
          className="mt-2.5 inline-flex h-7 items-center rounded-lg bg-[#635BFF] px-3 text-[10px] font-semibold text-white hover:brightness-105"
        >
          Create Project
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF]">
        <Package className="h-5 w-5 text-[#635BFF]" />
      </div>
      <p className="mt-4 text-base font-semibold text-[#0F172A]">No orders yet</p>
      <p className="mt-1.5 max-w-sm text-sm text-[#64748B]">
        Create a project and browse services to place your first order and start earning commissions.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          href="/partner/projects/new"
          className="inline-flex h-9 items-center rounded-xl bg-[#635BFF] px-4 text-sm font-medium text-white transition hover:brightness-105"
        >
          Create Project
        </Link>
        <Link
          href="/partner/services"
          className="inline-flex h-9 items-center rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#0F172A] transition hover:bg-[#F8FAFC]"
        >
          View Services
        </Link>
      </div>
    </div>
  );
}

export function EarningsOverviewCard({
  monthEarnings,
  earningsGrowth,
  monthLabel,
  chart,
  compact,
}: {
  monthEarnings: string;
  earningsGrowth: string;
  monthLabel: string;
  chart: ReactNode;
  compact?: boolean;
}) {
  const isPositive = Number(earningsGrowth) >= 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn("font-medium uppercase tracking-wider text-[#94A3B8]", compact ? "text-[9px]" : "text-[11px]")}>
            Earnings
          </p>
          <p className={cn("font-bold leading-none tracking-tight text-[#0F172A] tabular-nums", compact ? "mt-0.5 text-lg" : "mt-1 text-[24px]")}>
            {monthEarnings}
          </p>
          <p className={cn("font-medium text-[#94A3B8]", compact ? "text-[10px]" : "mt-0.5 text-xs")}>{monthLabel}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-full font-medium",
            compact ? "h-5 px-1.5 text-[9px]" : "h-6 px-2 text-[10px]",
            isPositive ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#FEF2F2] text-[#DC2626]"
          )}
        >
          {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
          {isPositive ? "+" : ""}
          {earningsGrowth}%
        </span>
      </div>
      <div className={compact ? "mt-1" : "mt-2"}>{chart}</div>
    </div>
  );
}
