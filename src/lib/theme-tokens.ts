/** Theme-aware color tokens for partner portal — use instead of hardcoded hex. */

export const chartCssVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
] as const;

export const chartBgClasses = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-1",
] as const;

export const chartTextClasses = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-chart-1",
] as const;

export const statCardStyles = {
  blue: {
    icon: "bg-primary/10 text-primary ring-primary/20",
    accent: "bg-primary",
    wash: "from-primary/10 via-card to-card",
  },
  green: {
    icon: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
    accent: "bg-chart-2",
    wash: "from-chart-2/10 via-card to-card",
  },
  orange: {
    icon: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
    accent: "bg-chart-3",
    wash: "from-chart-3/10 via-card to-card",
  },
  purple: {
    icon: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
    accent: "bg-chart-4",
    wash: "from-chart-4/10 via-card to-card",
  },
} as const;

export const panelIconStyles = {
  blue: "bg-primary/10 text-primary",
  green: "bg-chart-2/10 text-chart-2",
  purple: "bg-chart-4/10 text-chart-4",
  teal: "bg-chart-2/15 text-chart-2",
  amber: "bg-chart-3/10 text-chart-3",
  pink: "bg-chart-5/10 text-chart-5",
} as const;

export const iconTintStyles = {
  blue: "bg-primary/10 text-primary ring-primary/20",
  green: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
  orange: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
  purple: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
  teal: "bg-chart-2/15 text-chart-2 ring-chart-2/20",
  amber: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
  pink: "bg-chart-5/10 text-chart-5 ring-chart-5/20",
} as const;

export const quickActionIconStyles = {
  blue: "bg-primary/10 text-primary",
  green: "bg-chart-2/10 text-chart-2",
  orange: "bg-chart-3/10 text-chart-3",
  teal: "bg-chart-2/15 text-chart-2",
  purple: "bg-chart-4/10 text-chart-4",
  pink: "bg-chart-5/10 text-chart-5",
} as const;

export type AccentColor = keyof typeof statCardStyles;
export type PanelIconColor = keyof typeof panelIconStyles;
export type QuickActionColor = keyof typeof quickActionIconStyles;

export const badgeVariantStyles = {
  default: "border-border bg-muted text-muted-foreground",
  success: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  warning: "border-chart-3/30 bg-chart-3/10 text-chart-3",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-primary/30 bg-primary/10 text-primary",
  muted: "border-border bg-muted/60 text-muted-foreground",
} as const;
