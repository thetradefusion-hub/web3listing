import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function rel<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export function PartnerPageShell({
  children,
  className,
  narrow,
  compact,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1400px]",
        compact ? "space-y-4" : "space-y-6",
        narrow && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PartnerPageHeader({
  title,
  description,
  badge,
  action,
}: {
  title: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#0F172A]">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PartnerPrimaryButton({
  href,
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-5 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:opacity-50",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function PartnerSecondaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm font-medium text-[#0F172A] transition hover:bg-[#F1F5F9]",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function PartnerPanel({
  children,
  className,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "premium-card overflow-hidden",
        interactive && "premium-card-interactive",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PartnerPanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-[#F1F5F9] px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[#64748B]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PartnerPanelBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function PartnerEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <PartnerPanel>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <p className="text-base font-medium text-[#0F172A]">{title}</p>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-[#64748B]">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </PartnerPanel>
  );
}

const statIconStyles = {
  blue: "bg-[#EEF2FF] text-[#635BFF]",
  green: "bg-[#ECFDF5] text-[#10B981]",
  orange: "bg-[#FFFBEB] text-[#F59E0B]",
  purple: "bg-[#F5F3FF] text-[#8B5CF6]",
  teal: "bg-[#F0FDFA] text-[#14B8A6]",
  pink: "bg-[#FDF2F8] text-[#EC4899]",
} as const;

export function PartnerStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: keyof typeof statIconStyles;
  trend?: string;
}) {
  return (
    <Card className="premium-card premium-card-interactive gap-0 border-[#E2E8F0] py-0 shadow-none ring-0">
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-[#64748B]">{title}</p>
            <p className="mt-3 text-[36px] font-bold leading-none tracking-tight text-[#0F172A]">
              {value}
            </p>
            {subtitle && (
              <p className="mt-2 text-xs font-medium text-[#94A3B8]">{subtitle}</p>
            )}
            {trend && (
              <p className="mt-3 inline-flex rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-medium text-[#10B981]">
                {trend}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              statIconStyles[color]
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PartnerBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
}) {
  const styles = {
    default: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
    success: "border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
    warning: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]",
    danger: "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]",
    info: "border-[#C7D2FE] bg-[#EEF2FF] text-[#635BFF]",
    muted: "border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8]",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md px-2.5 text-xs font-medium capitalize",
        styles[variant]
      )}
    >
      {children}
    </Badge>
  );
}

export function projectStatusVariant(status: string): "success" | "warning" | "danger" | "muted" | "info" {
  if (status === "approved") return "success";
  if (status === "submitted") return "warning";
  if (status === "rejected") return "danger";
  return "muted";
}

export function kycStatusVariant(status: string): "success" | "warning" | "danger" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "warning";
}

export function PartnerFilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition",
        active
          ? "border-[rgba(99,91,255,0.2)] bg-[rgba(99,91,255,0.1)] text-[#635BFF]"
          : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:text-[#0F172A]"
      )}
    >
      {children}
    </Link>
  );
}

export function PartnerListRow({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  const className =
    "flex items-center justify-between gap-4 rounded-2xl border border-[#F1F5F9] bg-white px-5 py-4 transition hover:border-[#E2E8F0] hover:bg-[#F8FAFC]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}
