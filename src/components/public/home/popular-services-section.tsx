"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getServicePriceLabel } from "@/lib/pricing";
import {
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceInitials,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
import { HomeSectionHeader } from "@/components/public/home/section-header";
import type { PricingModel, Service } from "@/types/database";

type ServiceRow = Service & {
  service_categories?: { name: string; slug: string } | null;
};

export function PopularServicesSection({ services }: { services: ServiceRow[] | null }) {
  const { resolvedTheme } = useTheme();
  const badgeVariant = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <section className="landing-section">
      <div className="landing-container">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12">
          <HomeSectionHeader
            align="left"
            label="Catalog"
            title="Popular services"
            description="Fixed-price and managed services — order directly or request a custom quote."
            className="mb-0 max-w-xl"
          />
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl text-sm font-semibold sm:w-auto sm:self-start sm:rounded-full sm:px-6"
            asChild
          >
            <Link href="/services">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {services?.map((service) => {
            const catSlug = service.service_categories?.slug || "listing-services";
            const CatIcon = CATEGORY_ICONS[catSlug];
            const logoColor = getServiceLogoColor(service.name);
            const accent = getServiceAccent(service.name);

            return (
              <Link key={service.id} href={`/services/${service.slug}`} className="group">
                <article className="landing-card relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b opacity-70", accent)} />
                  <div className="flex flex-wrap items-start justify-between gap-2 pl-2">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 ring-border",
                          logoColor
                        )}
                      >
                        {CatIcon ? <CatIcon className="size-4" /> : getServiceInitials(service.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-300 sm:text-base">
                          {service.name}
                        </h3>
                        {service.service_categories?.name ? (
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {service.service_categories.name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <PricingBadge model={service.pricing_model as PricingModel} variant={badgeVariant} />
                    </div>
                  </div>

                  <p className="mt-4 pl-2 text-xl font-bold text-cyan-600 dark:text-cyan-400">
                    {getServicePriceLabel(service)}
                  </p>
                  <p className="mt-1 pl-2 text-xs text-muted-foreground">{service.estimated_tat}</p>

                  <span className="mt-auto flex items-center gap-1 pl-2 pt-4 text-xs font-semibold text-muted-foreground transition group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    View details
                    <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
