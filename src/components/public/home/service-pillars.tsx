import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICE_PILLARS } from "@/lib/home-content";
import {
  CATEGORY_ICON_STYLES,
  getCategoryIcon,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";

export function ServicePillars() {
  return (
    <section className="landing-section relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_60%)]"
        aria-hidden
      />

      <div className="landing-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Services</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Our Web3 listing{" "}
            <span className="lh-brand-gradient">& growth services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Web3Listing builds launch systems that support real operations — helping teams ship
            listings faster, control risk, and automate repeat growth work.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICE_PILLARS.map((pillar) => {
            const Icon = getCategoryIcon(pillar.slug);

            return (
              <article
                key={pillar.slug}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 transition-all duration-300 sm:p-6",
                  "hover:border-primary/35 hover:bg-card hover:shadow-[0_20px_50px_-24px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                )}
              >
                <Link
                  href={pillar.href}
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-[1.04]",
                    CATEGORY_ICON_STYLES[pillar.slug] ??
                      "bg-primary/10 text-primary ring-primary/20"
                  )}
                  aria-label={`${pillar.title} services`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </Link>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  <Link
                    href={pillar.href}
                    className="transition-colors hover:text-primary"
                  >
                    {pillar.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {pillar.desc}
                </p>

                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Get in touch
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </article>
            );
          })}

          <Link
            href="/services"
            className="group flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/35 bg-primary/5 p-6 text-center transition hover:border-primary/55 hover:bg-primary/10"
          >
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Browse full catalog
            </span>
            <span className="mt-2 text-sm text-muted-foreground">96+ launch-ready services</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              View all
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
