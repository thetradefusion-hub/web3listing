import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  badgeVariantStyles,
  iconTintStyles,
  type AccentColor,
} from "@/lib/theme-tokens";
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
  fullWidth,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col",
        !fullWidth && !narrow && "max-w-[1400px]",
        compact ? "gap-3" : "gap-5",
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
          <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
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
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:opacity-50",
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
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-muted px-5 text-sm font-medium text-foreground transition hover:bg-accent",
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
        "flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
        <p className="text-base font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </PartnerPanel>
  );
}

const statIconStyles = iconTintStyles;

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
  color?: AccentColor | "teal" | "pink";
  trend?: string;
}) {
  return (
    <Card className="premium-card premium-card-interactive gap-0 border-border py-0 shadow-none ring-0">
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
            <p className="mt-3 text-[36px] font-bold leading-none tracking-tight text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="mt-2 text-xs font-medium text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className="mt-3 inline-flex rounded-full bg-chart-2/10 px-2.5 py-0.5 text-xs font-medium text-chart-2">
                {trend}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              statIconStyles[color as keyof typeof statIconStyles] ?? statIconStyles.blue
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
  variant?: keyof typeof badgeVariantStyles;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md px-2.5 text-xs font-medium capitalize",
        badgeVariantStyles[variant]
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
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
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
    "flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 transition hover:border-border hover:bg-muted/50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}
