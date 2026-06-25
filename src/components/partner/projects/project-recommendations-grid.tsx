"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceCardMeta,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import {
  CATEGORY_TAB_GROUPS,
  countByTab,
  filterServicesByTab,
  getServiceBenefits,
  getServiceImpactBadge,
} from "@/lib/project-recommendations";
import type { Service } from "@/types/database";
import { cn } from "@/lib/utils";

const TAB_LABELS: Record<string, string> = {
  all: "All",
  visibility: "Visibility",
  security: "Security",
  marketing: "Marketing",
  growth: "Growth",
  development: "Development",
};

export function ProjectRecommendationsGrid({
  projectId,
  services,
  basePath = "/partner",
}: {
  projectId: string;
  services: (Service & {
    service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  })[];
  basePath?: string;
}) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(
    () => filterServicesByTab(services, activeTab).slice(0, 8),
    [services, activeTab]
  );

  return (
    <DashboardPanel
      title="Recommended Next Steps"
      description="Services tailored to grow visibility, trust, and adoption"
      icon={Sparkles}
      iconColor="purple"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {Object.keys(CATEGORY_TAB_GROUPS).map((tab) => {
          const count = countByTab(services, tab);
          if (tab !== "all" && count === 0) return null;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeTab === tab
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              {TAB_LABELS[tab]} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((service) => {
          const meta = getServiceCardMeta(service);
          const cat = Array.isArray(service.service_categories)
            ? service.service_categories[0]
            : service.service_categories;
          const Icon = CATEGORY_ICONS[cat?.slug || ""] || CATEGORY_ICONS["listing-services"];
          const badge = getServiceImpactBadge(service, cat?.slug);
          const benefits = getServiceBenefits(service);
          const logoColor = getServiceLogoColor(service.name);
          const accent = getServiceAccent(service.name);
          const href = `${basePath}/services/${service.slug}?project=${projectId}`;

          return (
            <article
              key={service.id}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
            >
              <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />

              <div className="flex items-start justify-between gap-2 pl-2">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-border/50",
                    logoColor
                  )}
                >
                  {service.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.logo_url} alt="" className="size-full object-cover" />
                  ) : (
                    <Icon className="size-5" strokeWidth={2} />
                  )}
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", badge.tone)}>
                  {badge.label}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 pl-2 text-sm font-bold text-foreground">{service.name}</h3>
              <p className="mt-1.5 line-clamp-2 pl-2 text-xs leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              <ul className="mt-3 flex-1 space-y-1.5 pl-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                    <span className="line-clamp-1">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 border-t border-border pt-3 pl-2">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">Starting from</p>
                    <p className="text-sm font-bold tabular-nums text-foreground">{meta.priceLabel}</p>
                    <p className="text-[10px] text-muted-foreground">TAT: {service.estimated_tat || "—"}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 shrink-0 rounded-lg text-xs font-semibold" asChild>
                    <Link href={href}>{meta.ctaLabel}</Link>
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">No services in this category yet.</p>
      )}
    </DashboardPanel>
  );
}
