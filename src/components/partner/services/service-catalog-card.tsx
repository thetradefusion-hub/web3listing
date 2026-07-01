"use client";

import Link from "next/link";
import { Clock, CreditCard, FileCheck, Flame, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
  getServiceOrderPath,
} from "@/lib/service-catalog";
import { iconTintStyles } from "@/lib/theme-tokens";
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
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md ring-1", tone)}>
        <Icon className="size-3" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="whitespace-normal break-words text-[11px] font-bold leading-snug text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function ServiceCatalogCard({
  service,
  projectQuery,
  basePath,
  showCommission,
}: {
  service: Service & {
    service_categories?: { name: string; slug: string } | { name: string; slug: string }[] | null;
  };
  projectQuery?: string;
  basePath?: string;
  showCommission?: boolean;
}) {
  const meta = getServiceCardMeta(service);
  const portalBase = basePath ?? "/partner";
  const displayCommission = showCommission ?? true;
  const href = `${portalBase}/services/${service.slug}${projectQuery || ""}`;
  const orderHref = getServiceOrderPath(portalBase, service.slug, projectQuery?.replace(/^\?project=/, "") || undefined);
  const logoColor = getServiceLogoColor(service.name);
  const accent = getServiceAccent(service.name);
  const description = service.overview || service.description;
  const cat = Array.isArray(service.service_categories)
    ? service.service_categories[0]
    : service.service_categories;
  const CatIcon = CATEGORY_ICONS[cat?.slug || ""] || CATEGORY_ICONS["listing-services"];

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md hover:-translate-y-px">
      <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />

      <div className="flex flex-col md:flex-row md:items-stretch">
        {/* Left — logo + info */}
        <div className="flex min-w-0 flex-[1_1_0%] gap-3 border-b border-border p-4 sm:gap-3.5 md:border-b-0 md:border-r md:py-4 md:pl-5 md:pr-4">
          <div
            className={cn(
              "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ring-2 ring-border/50 sm:size-12",
              logoColor
            )}
          >
            {service.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.logo_url} alt="" className="size-full object-cover" />
            ) : (
              <span className="text-xs font-bold sm:text-sm">{getServiceInitials(service.name)}</span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-foreground sm:text-[15px]">{service.name}</h3>
              {service.badge && (
                <span
                  className={cn(
                    "inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold shadow-sm",
                    BADGE_STYLES[service.badge]
                  )}
                >
                  {service.badge === "hot" && <Flame className="size-3" strokeWidth={2.5} />}
                  {BADGE_LABELS[service.badge]}
                </span>
              )}
            </div>

            {cat?.name ? (
              <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <CatIcon className="size-3 shrink-0" strokeWidth={2} />
                {cat.name}
              </span>
            ) : null}

            {description ? (
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:line-clamp-3 md:text-[13px]">
                {description}
              </p>
            ) : null}

            <div className="mt-2.5 flex flex-wrap items-center gap-2 md:mt-auto md:pt-2">
              {(service.proof_of_work || service.proof_of_work_url) && (
                <a
                  href={service.proof_of_work_url || "#"}
                  target={service.proof_of_work_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => !service.proof_of_work_url && e.preventDefault()}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <FileCheck className="size-3" strokeWidth={2} />
                  Proof of Work
                </a>
              )}
              {service.demo_link && (
                <a
                  href={service.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-chart-2/10 px-2.5 py-1 text-[11px] font-semibold text-chart-2 transition-colors hover:bg-chart-2/15"
                >
                  <ShieldCheck className="size-3" strokeWidth={2} />
                  Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Middle — metrics */}
        <div className="grid grid-cols-3 gap-2 border-b border-border bg-muted/20 px-3 py-2.5 sm:px-4 md:flex md:w-[156px] md:shrink-0 md:flex-col md:justify-center md:gap-2.5 md:border-b-0 md:border-r md:bg-muted/10 md:px-3 md:py-3 lg:w-[172px]">
          <CompactMetric
            icon={Tag}
            label="Price"
            value={meta.priceLabel}
            tone={iconTintStyles.blue}
          />
          <CompactMetric
            icon={Clock}
            label="TAT"
            value={service.estimated_tat || "—"}
            tone={iconTintStyles.orange}
          />
          <CompactMetric
            icon={CreditCard}
            label="Pay"
            value={service.payment_terms || "—"}
            tone={iconTintStyles.green}
          />
        </div>

        {/* Right — actions */}
        <div className="flex flex-col justify-center gap-1.5 p-3 sm:p-4 md:w-[148px] md:shrink-0 md:px-3 lg:w-[156px]">
          <Button variant="outline" className="h-8 w-full rounded-lg text-[11px] font-semibold sm:h-9 sm:text-xs" asChild>
            <Link href={href}>View Details</Link>
          </Button>
          <Button className="h-8 w-full rounded-lg text-[11px] font-semibold sm:h-9 sm:text-xs" asChild>
            <Link href={orderHref}>{meta.ctaLabel}</Link>
          </Button>
          {displayCommission && meta.commissionLabel && (
            <div className="mt-0.5 rounded-lg border border-chart-2/20 bg-chart-2/10 px-2 py-1.5 text-center">
              <p className="text-[10px] font-medium text-muted-foreground">Earn Commission</p>
              <p className="text-xs font-bold text-chart-2">{meta.commissionLabel}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
