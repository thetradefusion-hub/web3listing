"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_ICONS,
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

const CARD_ACCENTS = [
  "border-[#E0E7FF] bg-gradient-to-br from-white to-[#F8FAFF]",
  "border-[#D1FAE5] bg-gradient-to-br from-white to-[#F0FDF4]",
  "border-[#FED7AA] bg-gradient-to-br from-white to-[#FFFBEB]",
  "border-[#DDD6FE] bg-gradient-to-br from-white to-[#FAF5FF]",
];

export function ProjectRecommendationsGrid({
  projectId,
  services,
}: {
  projectId: string;
  services: (Service & {
    service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  })[];
}) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(
    () => filterServicesByTab(services, activeTab).slice(0, 8),
    [services, activeTab]
  );

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A]">Recommended Next Steps</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Services tailored to grow your project visibility, trust, and adoption.
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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
                  ? "border-[#635BFF] bg-[#635BFF] text-white shadow-sm"
                  : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#C7D2FE] hover:text-[#635BFF]"
              )}
            >
              {TAB_LABELS[tab]} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((service, i) => {
          const meta = getServiceCardMeta(service);
          const cat = Array.isArray(service.service_categories)
            ? service.service_categories[0]
            : service.service_categories;
          const Icon = CATEGORY_ICONS[cat?.slug || ""] || CATEGORY_ICONS["listing-services"];
          const badge = getServiceImpactBadge(service, cat?.slug);
          const benefits = getServiceBenefits(service);
          const logoColor = getServiceLogoColor(service.name);
          const href = `/agent/services/${service.slug}?project=${projectId}`;

          return (
            <article
              key={service.id}
              className={cn(
                "flex flex-col rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md",
                CARD_ACCENTS[i % CARD_ACCENTS.length]
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm",
                    logoColor
                  )}
                >
                  {service.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.logo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  )}
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", badge.tone)}>
                  {badge.label}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 text-sm font-bold text-[#0F172A]">{service.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#64748B]">
                {service.description}
              </p>

              <ul className="mt-3 space-y-1.5">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-[11px] text-[#475569]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                    <span className="line-clamp-1">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t border-[#F1F5F9] pt-3">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-medium text-[#94A3B8]">Starting from</p>
                    <p className="text-sm font-bold text-[#0F172A]">{meta.priceLabel}</p>
                    <p className="text-[10px] text-[#94A3B8]">TAT: {service.estimated_tat || "—"}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 rounded-lg border-[#C7D2FE] text-xs font-semibold text-[#635BFF] hover:bg-[#EEF2FF]"
                    asChild
                  >
                    <Link href={href}>{meta.ctaLabel}</Link>
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-[#94A3B8]">No services in this category yet.</p>
      )}
    </section>
  );
}
