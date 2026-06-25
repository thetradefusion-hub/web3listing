import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ArrowDownRight, ArrowUpRight, Package } from "lucide-react";

const statusConfig: Record<string, { dot: string; label: string; variant?: "secondary" | "outline" | "destructive" }> = {
  in_progress: { dot: "bg-primary", label: "Active", variant: "secondary" },
  payment_confirmed: { dot: "bg-[color:var(--chart-2)]", label: "Paid", variant: "secondary" },
  under_review: { dot: "bg-[color:var(--chart-3)]", label: "Review", variant: "outline" },
  completed: { dot: "bg-[color:var(--chart-2)]", label: "Done", variant: "secondary" },
  delivered: { dot: "bg-[color:var(--chart-2)]", label: "Delivered", variant: "secondary" },
  closed: { dot: "bg-muted-foreground", label: "Closed", variant: "outline" },
  submitted: { dot: "bg-[color:var(--chart-3)]", label: "Submitted", variant: "outline" },
  waiting_payment: { dot: "bg-[color:var(--chart-3)]", label: "Pending", variant: "outline" },
  third_party_review: { dot: "bg-primary", label: "Review", variant: "secondary" },
};

export function OrderStatusBadge({ status, compact }: { status: string; compact?: boolean; mini?: boolean }) {
  const item = statusConfig[status] || statusConfig.submitted;

  return (
    <Badge variant={item.variant ?? "outline"} className={cn("gap-1.5 font-medium", compact ? "h-6" : "h-7")}>
      <span className={cn("size-1.5 rounded-full", item.dot)} />
      {item.label}
    </Badge>
  );
}

import { chartBgClasses, chartTextClasses } from "@/lib/theme-tokens";

export function TopServicesList({
  services,
}: {
  services: { name: string; count: number }[];
  compact?: boolean;
  premium?: boolean;
}) {
  const maxCount = services[0]?.count || 1;

  return (
    <div className="flex min-h-[168px] flex-col justify-center gap-3.5">
      {services.map((svc, i) => {
        const pct = Math.round((svc.count / maxCount) * 100);
        return (
          <div key={svc.name} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-primary-foreground shadow-sm",
                  chartBgClasses[i % chartBgClasses.length]
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground" title={svc.name}>
                  {svc.name}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className={cn("text-sm font-bold tabular-nums", chartTextClasses[i % chartTextClasses.length])}>
                  {svc.count}
                </p>
                <p className="text-[10px] text-muted-foreground">orders</p>
              </div>
            </div>
            <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-muted/80">
              <div
                className={cn("h-full rounded-full transition-all", chartBgClasses[i % chartBgClasses.length])}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DashboardEmptyOrders({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <Empty className="border-0 bg-transparent py-8">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Package />
          </EmptyMedia>
          <EmptyTitle>No orders</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="sm">
            <Link href="/partner/projects/new">New Project</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Empty className="border-dashed py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No orders yet</EmptyTitle>
        <EmptyDescription>
          Create a project and browse services to place your first order and start earning commissions.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/partner/projects/new">Create Project</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/partner/services">View Services</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function EarningsOverviewCard({
  monthEarnings,
  earningsGrowth,
  chart,
}: {
  monthEarnings: string;
  earningsGrowth: string;
  chart: ReactNode;
}) {
  const isPositive = Number(earningsGrowth) >= 0;

  return (
    <div className="flex min-h-[168px] flex-col justify-center gap-4">
      <div className="flex items-end justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">This month</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-[1.75rem]">
            {monthEarnings}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "h-7 gap-1 rounded-lg px-2.5 text-xs font-semibold tabular-nums",
            isPositive ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"
          )}
        >
          {isPositive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {isPositive ? "+" : ""}
          {earningsGrowth}%
        </Badge>
      </div>
      <div className="min-h-0 flex-1">{chart}</div>
    </div>
  );
}
