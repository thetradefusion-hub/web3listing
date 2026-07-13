"use client";

import Link from "next/link";
import { useTheme } from "@/components/shared/theme-provider";
import { ArrowRight, ArrowUpRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getServicePriceLabel } from "@/lib/pricing";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  getCategoryIcon,
  getServiceAccent,
  getServiceInitials,
  getServiceLogoColor,
  getServiceLogoUrl,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
import { HomeSectionHeader } from "@/components/public/home/section-header";
import type { PricingModel, Service } from "@/types/database";

type ServiceRow = Service & {
  service_categories?: { name: string; slug: string } | null;
};

function ServiceLogo({ service }: { service: ServiceRow }) {
  const logoUrl = getServiceLogoUrl(service);
  const logoColor = getServiceLogoColor(service.name);
  const CatIcon = getCategoryIcon(service.service_categories?.slug);

  return (
    <div
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-border/60",
        logoUrl ? "bg-white dark:bg-white" : logoColor
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="size-9 object-contain" loading="lazy" decoding="async" />
      ) : CatIcon ? (
        <CatIcon className="size-5" strokeWidth={2} />
      ) : (
        <span className="text-xs font-bold">{getServiceInitials(service.name)}</span>
      )}
    </div>
  );
}

export function PopularServicesSection({ services }: { services: ServiceRow[] | null }) {
  const { resolvedTheme } = useTheme();
  const badgeVariant = resolvedTheme === "dark" ? "dark" : "light";
  const items = services ?? [];

  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeader
            align="left"
            label="Catalog"
            title="Popular services"
            description="Live listings from our marketplace — order directly or request a custom quote."
            className="mb-0 max-w-xl"
          />
          <Button
            variant="outline"
            className="h-11 shrink-0 rounded-xl text-sm font-semibold sm:rounded-full sm:px-6"
            asChild
          >
            <Link href="/services">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Services will appear here once published in the catalog.</p>
            <Button className="mt-4 rounded-xl" asChild>
              <Link href="/services">Browse catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((service) => {
              const accent = getServiceAccent(service.name);

              return (
                <Link key={service.id} href={`/services/${service.slug}`} className="group h-full">
                  <article className="landing-card relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/10">
                    <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} />

                    <div className="flex items-start justify-between gap-3 pl-2">
                      <ServiceLogo service={service} />
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <PricingBadge model={service.pricing_model as PricingModel} variant={badgeVariant} />
                        {service.badge ? (
                          <span
                            className={cn(
                              "inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold",
                              BADGE_STYLES[service.badge]
                            )}
                          >
                            {service.badge === "hot" ? <Flame className="size-3" strokeWidth={2.5} /> : null}
                            {BADGE_LABELS[service.badge]}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 min-w-0 pl-2">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary dark:group-hover:text-chart-2 sm:text-[15px]">
                        {service.name}
                      </h3>
                      {service.service_categories?.name ? (
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {service.service_categories.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4 pl-2">
                      <p className="text-xl font-bold text-primary dark:text-chart-2">{getServicePriceLabel(service)}</p>
                      {service.estimated_tat ? (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3 shrink-0" />
                          {service.estimated_tat}
                        </p>
                      ) : null}
                    </div>

                    <span className="mt-auto flex items-center gap-1 pl-2 pt-5 text-xs font-semibold text-muted-foreground transition group-hover:text-primary dark:group-hover:text-chart-2">
                      View details
                      <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
