import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICE_PILLARS } from "@/lib/home-content";
import {
  CATEGORY_BAR_STYLES,
  CATEGORY_ICON_STYLES,
  getCategoryIcon,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";

export function ServicePillars() {
  return (
    <section className="landing-section relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_60%)]"
        aria-hidden
      />

      <div className="landing-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Our services</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            What we <span className="lh-brand-gradient">do</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
            Seven core categories — from development and security to exchange listing, market making,
            and growth — all managed through one professional marketplace.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
          {SERVICE_PILLARS.map((pillar, index) => {
            const Icon = getCategoryIcon(pillar.slug);
            return (
              <Link
                key={pillar.slug}
                href={pillar.href}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition hover:border-primary/35 hover:bg-card hover:text-foreground"
              >
                <span className="text-[10px] font-bold text-muted-foreground/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon className="size-3.5 text-primary dark:text-chart-2" />
                {pillar.title}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PILLARS.map((pillar, index) => {
            const Icon = getCategoryIcon(pillar.slug);

            return (
              <Link
                key={pillar.slug}
                href={pillar.href}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-6",
                  index === SERVICE_PILLARS.length - 1 && "lg:col-span-3 lg:max-w-md lg:justify-self-center"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80",
                    CATEGORY_BAR_STYLES[pillar.slug] ?? "bg-primary"
                  )}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl ring-1 transition group-hover:scale-105",
                      CATEGORY_ICON_STYLES[pillar.slug] ?? "bg-primary/10 text-primary ring-primary/20"
                    )}
                  >
                    <Icon className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {pillar.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pillar.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary transition group-hover:gap-2.5 dark:text-chart-2">
                  Explore services
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
          <Button
            size="lg"
            className="lh-btn-cta group h-11 rounded-full px-8 text-sm font-semibold uppercase tracking-wide"
            asChild
          >
            <Link href="/services">
              Browse all services
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground sm:text-sm">
            96+ services across 7 categories · Fixed price & custom quotes
          </p>
        </div>
      </div>
    </section>
  );
}
