import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Globe,
  Layers,
  LayoutGrid,
  Percent,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_STATS } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const STAT_META: Record<
  string,
  { icon: LucideIcon; accent: "purple" | "green" | "blue" | "amber" }
> = {
  "launch-ready services": { icon: Layers, accent: "purple" },
  "exchange ecosystems": { icon: Store, accent: "green" },
  "service categories": { icon: LayoutGrid, accent: "blue" },
  "average turnaround": { icon: Clock, accent: "amber" },
  "partner commission": { icon: Percent, accent: "green" },
  "client coverage": { icon: Globe, accent: "purple" },
};

const accentStyles = {
  purple: {
    bar: "from-primary to-chart-4",
    icon: "bg-primary/12 text-primary ring-primary/20",
    glow: "group-hover:shadow-primary/10",
  },
  green: {
    bar: "from-chart-2 to-chart-3",
    icon: "bg-chart-2/12 text-chart-2 ring-chart-2/25",
    glow: "group-hover:shadow-chart-2/10",
  },
  blue: {
    bar: "from-chart-4 to-primary",
    icon: "bg-chart-4/12 text-chart-4 ring-chart-4/20",
    glow: "group-hover:shadow-chart-4/10",
  },
  amber: {
    bar: "from-chart-3 to-chart-2",
    icon: "bg-chart-3/12 text-chart-3 ring-chart-3/25",
    glow: "group-hover:shadow-chart-3/10",
  },
} as const;

export function StatsBanner() {
  return (
    <section className="stats-banner-section landing-section relative overflow-hidden border-y border-border/60">
      <div className="stats-banner-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-[0.22] dark:opacity-15" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-chart-2/30 to-transparent" aria-hidden />

      <div className="landing-container relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="lh-label lh-accent">The platform</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Your Web3
            <br />
            <span className="lh-brand-gradient">#1 listing & growth hub</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
            Everything you need to list, market, and scale — backed by vetted partners and
            transparent pricing.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {PLATFORM_STATS.map((stat) => {
            const meta = STAT_META[stat.label] ?? { icon: Layers, accent: "purple" as const };
            const styles = accentStyles[meta.accent];
            const Icon = meta.icon;

            return (
              <div
                key={stat.label}
                className={cn(
                  "stats-card group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-xl sm:p-5",
                  styles.glow
                )}
              >
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b opacity-60 transition-opacity group-hover:opacity-100",
                    styles.bar
                  )}
                  aria-hidden
                />
                <div
                  className={cn(
                    "mx-auto mb-3 flex size-10 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-105",
                    styles.icon
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.25} />
                </div>
                <p className="lh-stat-value text-foreground transition-colors group-hover:text-primary dark:group-hover:text-chart-2">
                  {stat.value}
                </p>
                <p className="mt-2 text-[9px] font-semibold uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:text-[10px] sm:tracking-[0.14em]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-14">
          <Button
            size="lg"
            className="lh-btn-cta group h-12 w-full max-w-md rounded-full text-sm font-semibold uppercase tracking-wide sm:w-auto sm:px-10"
            asChild
          >
            <Link href="/contact">
              <span className="sm:hidden">Get listing strategy</span>
              <span className="hidden sm:inline">Get individual listing strategy</span>
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Free consultation · No obligation · Tailored exchange roadmap
          </p>
        </div>
      </div>
    </section>
  );
}
