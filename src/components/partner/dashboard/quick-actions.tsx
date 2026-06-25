import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { quickActionIconStyles, type QuickActionColor } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

export function QuickActionsGrid({
  actions,
}: {
  actions: { label: string; href: string; icon: LucideIcon; color: QuickActionColor }[];
  compact?: boolean;
  premium?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 transition-all hover:border-primary/30 hover:shadow-sm sm:gap-3 sm:p-3"
        >
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/50 transition-transform group-hover:scale-105 sm:size-10",
              quickActionIconStyles[action.color]
            )}
          >
            <action.icon />
          </div>
          <span className="min-w-0 flex-1 text-xs font-semibold text-foreground sm:text-sm">{action.label}</span>
          <ArrowUpRight className="hidden shrink-0 text-muted-foreground opacity-0 transition-all group-hover:text-primary group-hover:opacity-100 sm:block" />
        </Link>
      ))}
    </div>
  );
}
