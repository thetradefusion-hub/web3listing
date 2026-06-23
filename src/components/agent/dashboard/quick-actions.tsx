import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActionsGrid({
  actions,
}: {
  actions: { label: string; href: string; icon: LucideIcon; color: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group flex items-center gap-2.5 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] p-3 transition hover:border-[#E2E8F0] hover:bg-white hover:shadow-sm"
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
              action.color
            )}
          >
            <action.icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="text-[11px] font-medium leading-snug text-[#475569] group-hover:text-[#0F172A]">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
