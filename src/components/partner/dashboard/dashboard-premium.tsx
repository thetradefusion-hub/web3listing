import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  panelIconStyles,
  statCardStyles,
  type AccentColor,
  type PanelIconColor,
} from "@/lib/theme-tokens";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export function PartnerStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  trend,
  trendDirection = "up",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: AccentColor;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
}) {
  const styles = statCardStyles[color];
  const caption = trend || subtitle;

  return (
    <Card size="sm" className={cn("relative overflow-hidden bg-gradient-to-br transition-shadow hover:shadow-md", styles.wash)}>
      <div className={cn("absolute inset-y-0 left-0 w-1", styles.accent)} />
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-0 pl-5">
        <CardDescription className="text-xs font-semibold">{title}</CardDescription>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl ring-1", styles.icon)}>
          <Icon />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pl-5">
        <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground sm:text-3xl">{value}</p>
        {caption ? (
          <p
            className={cn(
              "text-xs font-semibold",
              trendDirection === "down"
                ? "text-destructive"
                : trendDirection === "up"
                  ? "text-chart-2"
                  : "text-muted-foreground"
            )}
          >
            {caption}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function DashboardPanel({
  title,
  description,
  icon: Icon,
  iconColor = "blue",
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: PanelIconColor;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card size="sm" className={cn("flex h-full w-full flex-col transition-shadow hover:shadow-md", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", panelIconStyles[iconColor])}>
              <Icon />
            </div>
          ) : null}
          <div className="min-w-0">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        </div>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn("flex min-h-0 w-full flex-1 flex-col", contentClassName)}>{children}</CardContent>
    </Card>
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
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar size="sm" className="size-7">
        <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">{label}</AvatarFallback>
      </Avatar>
      <span className="truncate text-sm font-medium text-foreground">{name || "—"}</span>
    </div>
  );
}

export function SupportActionCard({
  icon: Icon,
  title,
  iconColor = "blue",
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  iconColor?: PanelIconColor;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Card size="sm" className={cn("flex h-full w-full flex-col", className)}>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className={cn("flex size-9 items-center justify-center rounded-xl", panelIconStyles[iconColor])}>
          <Icon />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {children ? <CardFooter className="mt-auto border-0 bg-transparent">{children}</CardFooter> : null}
    </Card>
  );
}

export function ManagerProfileCard({
  name,
  telegramId,
  telegramLink,
}: {
  name: string;
  telegramId: string;
  telegramLink?: string | null;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <Avatar className="size-10 bg-primary">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">{initials}</AvatarFallback>
          <AvatarBadge className="bg-chart-2" />
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{telegramId}</p>
        </div>
      </div>
      {telegramLink ? (
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={telegramLink} target="_blank" rel="noopener noreferrer">
            Message
          </a>
        </Button>
      ) : null}
    </div>
  );
}
