import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResponsiveTableShell({
  table,
  mobile,
  className,
}: {
  table: ReactNode;
  mobile: ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={cn("hidden overflow-x-auto md:block", className)}>{table}</div>
      <div className="space-y-3 p-6 md:hidden">{mobile}</div>
    </>
  );
}

export function MobileDataCard({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  const className =
    "block rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#CBD5E1] hover:shadow-md";

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return <div className={className}>{children}</div>;
}

export function MobileDataRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="shrink-0 text-xs font-medium text-[#94A3B8]">{label}</span>
      <span className="min-w-0 text-right text-[#0F172A]">{children}</span>
    </div>
  );
}
