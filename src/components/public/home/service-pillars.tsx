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
import { HomeSectionHeader } from "@/components/public/home/section-header";
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
    <section className="landing-section">
      <div className="landing-container">
        <HomeSectionHeader
          label="Our services"
          title="What we do"
          description="From exchange listing to market making, PR, data platforms, and advisory — access professional Web3 services through one marketplace."
          className="mb-10 sm:mb-14"
        />

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {SERVICE_PILLARS.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.title] || Building2;
            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group flex flex-col rounded-2xl border border-border bg-card/50 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 sm:p-6"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/15">
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary dark:group-hover:text-chart-2 sm:text-xl">
                  {pillar.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground sm:mt-3">{pillar.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:gap-2 dark:text-chart-2">
                  Explore
                  <ArrowUpRight className="size-3.5 sm:size-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
