"use client";

import Link from "next/link";
import { Clock, CreditCard, FileCheck, Flame, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  getServiceAccent,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import type { Service } from "@/types/database";
import { cn } from "@/lib/utils";

function CompactMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          tone
        )}
      >
        <Icon className="h-3 w-3" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
        <p className="truncate text-[11px] font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

export function ServiceCatalogCard({
  service,
  projectQuery,
}: {
  service: Service & {
    service_categories?: { name: string; slug: string } | { name: string; slug: string }[] | null;
  };
  projectQuery?: string;
}) {
  const meta = getServiceCardMeta(service);
  const href = `/partner/services/${service.slug}${projectQuery || ""}`;
  const orderHref = `${href}${projectQuery ? (projectQuery.includes("?") ? "&" : "?") + "order=1" : "?order=1"}`;
  const logoColor = getServiceLogoColor(service.name);
  const accent = getServiceAccent(service.name);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#E0E7FF]/80 bg-gradient-to-br from-white via-white to-[#F8FAFF] shadow-sm transition-all duration-300 hover:border-[#C7D2FE] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]">
      <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />

      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Left — logo + info (priority width) */}
        <div className="flex min-w-0 flex-[1_1_0%] gap-3 border-b border-[#EEF2FF] p-4 sm:gap-3.5 sm:p-4 md:border-b-0 md:border-r md:py-4 md:pl-5 md:pr-4">
          <div
            className={cn(
              "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ring-2 ring-white sm:h-12 sm:w-12",
              logoColor
            )}
          >
            {service.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold sm:text-sm">{getServiceInitials(service.name)}</span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#0F172A] sm:text-[15px]">{service.name}</h3>
              {service.badge && (
                <span
                  className={cn(
                    "inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold shadow-sm",
                    BADGE_STYLES[service.badge]
                  )}
                >
                  {service.badge === "hot" && <Flame className="h-3 w-3" strokeWidth={2.5} />}
                  {BADGE_LABELS[service.badge]}
                </span>
              )}
            </div>

            <p className="mt-1.5 line-clamp-2 text-xs leading-[1.55] text-[#64748B] md:line-clamp-3 md:text-[13px]">
              {service.description}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 md:mt-auto md:pt-2">
              {(service.proof_of_work || service.proof_of_work_url) && (
                <a
                  href={service.proof_of_work_url || "#"}
                  target={service.proof_of_work_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => !service.proof_of_work_url && e.preventDefault()}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] transition-colors hover:bg-[#E0E7FF]"
                >
                  <FileCheck className="h-3 w-3" strokeWidth={2} />
                  Proof of Work
                </a>
              )}
              {service.demo_link && (
                <a
                  href={service.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-semibold text-[#059669] transition-colors hover:bg-[#D1FAE5]"
                >
                  <ShieldCheck className="h-3 w-3" strokeWidth={2} />
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Middle — compact metrics */}
        <div className="grid grid-cols-3 gap-2 border-b border-[#EEF2FF] bg-[#FAFBFF]/80 px-3 py-2.5 sm:px-4 md:flex md:w-[118px] md:shrink-0 md:flex-col md:justify-center md:gap-2 md:border-b-0 md:border-r md:px-2.5 md:py-3 lg:w-[124px]">
          <CompactMetric
            icon={Tag}
            label="Price"
            value={meta.priceLabel}
            tone="bg-[#EEF2FF] text-[#6366F1]"
          />
          <CompactMetric
            icon={Clock}
            label="TAT"
            value={service.estimated_tat || "—"}
            tone="bg-[#FFF7ED] text-[#EA580C]"
          />
          <CompactMetric
            icon={CreditCard}
            label="Pay"
            value={service.payment_terms || "—"}
            tone="bg-[#ECFDF5] text-[#059669]"
          />
        </div>

        {/* Right — actions + commission */}
        <div className="flex flex-col justify-center gap-1.5 p-3 sm:p-4 md:w-[148px] md:shrink-0 md:px-3 lg:w-[156px]">
          <Button
            variant="outline"
            className="h-8 w-full rounded-lg border-[#C7D2FE] bg-white/80 text-[11px] font-semibold text-[#6366F1] shadow-sm hover:border-[#A5B4FC] hover:bg-[#EEF2FF] sm:h-9 sm:text-xs"
            asChild
          >
            <Link href={href}>View Details</Link>
          </Button>
          <Button
            className="h-8 w-full rounded-lg border-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-[11px] font-semibold text-white shadow-md shadow-indigo-200/60 hover:from-[#4F46E5] hover:to-[#7C3AED] sm:h-9 sm:text-xs"
            asChild
          >
            <Link href={orderHref}>{meta.ctaLabel}</Link>
          </Button>
          {meta.commissionLabel && (
            <div className="mt-0.5 rounded-lg bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] px-2 py-1.5 text-center">
              <p className="text-[10px] font-medium text-[#64748B]">Earn Commission</p>
              <p className="text-xs font-bold text-[#059669]">{meta.commissionLabel}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
