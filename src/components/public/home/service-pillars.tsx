import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Globe,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import { SERVICE_PILLARS } from "@/lib/home-content";
import type { LucideIcon } from "lucide-react";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  "Exchange Listing": Building2,
  "Market Making": TrendingUp,
  "Marketing & PR": Megaphone,
  "Data Platform Support": Globe,
  "Advisory Services": BarChart3,
};

export function ServicePillars() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Our services</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            What we <span className="lh-brand-gradient">do</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
            From exchange listing to market making, PR, data platforms, and advisory — professional
            Web3 services through one marketplace.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_PILLARS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.title] || Building2;
            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-primary/35 hover:bg-card hover:shadow-xl hover:shadow-primary/5 sm:p-7"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-chart-2 opacity-0 transition group-hover:opacity-100" />
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/15">
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{pillar.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>
                <span className="mt-7 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary transition group-hover:gap-2.5 dark:text-chart-2">
                  Get in touch
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
