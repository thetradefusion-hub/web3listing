import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActionsGrid({
  actions,
  compact,
  premium,
}: {
  actions: { label: string; href: string; icon: LucideIcon; color: string }[];
  compact?: boolean;
  premium?: boolean;
}) {
  return (
    <div className={cn("grid grid-cols-2", compact ? "gap-1.5" : "gap-2")}>
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={cn(
            "group relative flex items-center overflow-hidden border transition-all duration-200",
            premium
              ? "rounded-xl border-[#E2E8F0] bg-white shadow-sm hover:border-[#C7D2FE] hover:shadow-md"
              : "rounded-lg border-[#F1F5F9] bg-[#FAFBFC] hover:border-[#E2E8F0] hover:bg-white hover:shadow-sm",
            compact ? "gap-2 p-2" : "gap-2.5 rounded-xl p-3"
          )}
        >
          {premium && (
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#635BFF]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          )}
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
              compact ? "h-7 w-7" : "h-8 w-8",
              action.color
            )}
          >
            <action.icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={2} />
          </div>
          <span
            className={cn(
              "min-w-0 flex-1 font-medium leading-snug text-[#475569] group-hover:text-[#0F172A]",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          >
            {action.label}
          </span>
          {premium && (
            <ArrowRight className="h-3 w-3 shrink-0 text-[#94A3B8] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[#635BFF] group-hover:opacity-100" />
          )}
        </Link>
      ))}
    </div>
  );
}
