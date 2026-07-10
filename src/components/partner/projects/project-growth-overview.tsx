"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { Button } from "@/components/ui/button";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import {
  getCategoryBarStyle,
  getCategoryIcon,
  getCategoryIconStyle,
  getServiceAccent,
  getServiceCardMeta,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import {
  CORE_GROWTH_CATEGORIES,
  computeGrowthPhases,
  getGrowthCategoryMeta,
  getServiceBenefits,
  getServiceImpactBadge,
  getServicesForCategory,
  pickDefaultGrowthCategory,
} from "@/lib/project-recommendations";
import type { Order, Project, Service, ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";

type ServiceWithCategory = Service & {
  service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
};

type OrderWithService = Order & { services?: ServiceWithCategory };

function GrowthRing({ score, stroke = "var(--primary)" }: { score: number; stroke?: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-14 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-bold tabular-nums leading-none text-foreground">{score}%</p>
      </div>
    </div>
  );
}

function StageProgressBar({
  value,
  barClass,
  className,
  trackClass,
}: {
  value: number;
  barClass: string;
  className?: string;
  trackClass?: string;
}) {
  return (
    <Progress value={value} className={cn("w-full gap-0", className)}>
      <ProgressTrack className={cn("h-1 bg-muted/80", trackClass)}>
        <ProgressIndicator className={cn("rounded-full transition-all duration-500", barClass)} />
      </ProgressTrack>
    </Progress>
  );
}

function orderStatusForService(orders: OrderWithService[], serviceId: string) {
  const matches = orders.filter((o) => o.service_id === serviceId);
  if (matches.some((o) => ["completed", "delivered", "closed"].includes(o.status))) return "completed";
  if (matches.length > 0) return "ordered";
  return "available";
}

export function ProjectGrowthOverview({
  project,
  orders,
  services,
  basePath = "/partner",
}: {
  project: Project;
  orders: OrderWithService[];
  services: ServiceWithCategory[];
  categories?: ServiceCategory[];
  basePath?: string;
}) {
  const { phases, score, summary } = useMemo(
    () => computeGrowthPhases(project, orders, services),
    [project, orders, services]
  );

  const [activeSlug, setActiveSlug] = useState(() => pickDefaultGrowthCategory(phases));

  const activePhase = phases.find((p) => p.id === activeSlug) || phases[0];
  const activeMeta = getGrowthCategoryMeta(activeSlug);
  const ActiveIcon = getCategoryIcon(activeSlug);
  const categoryServices = useMemo(
    () => getServicesForCategory(services, activeSlug).slice(0, 8),
    [services, activeSlug]
  );

  const progressPct = activePhase?.progressPct ?? 0;
  const stepIndex = Math.max(
    0,
    CORE_GROWTH_CATEGORIES.findIndex((c) => c.slug === activeSlug)
  );

  return (
    <DashboardPanel
      title="Project Growth Overview"
      description="Complete 7 stages to launch and scale"
      icon={TrendingUp}
      iconColor="green"
    >
      {/* Compact overall row */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2">
        <GrowthRing score={score} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
            <p className="text-xs font-semibold text-foreground">
              Overall progress{" "}
              <span className="tabular-nums text-muted-foreground">({score}%)</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">{summary.stagesCompleted}</span>/
              {summary.stagesTotal} stages ·{" "}
              <span className="font-semibold text-foreground">{summary.servicesCompleted}</span>
              {summary.servicesTotal > 0 ? `/${summary.servicesTotal}` : ""} services
              {summary.servicesInProgress > 0 ? ` · ${summary.servicesInProgress} active` : ""}
            </p>
          </div>
          <StageProgressBar value={score} barClass="bg-primary" className="mt-1.5" />
        </div>
      </div>

      {/* Compact 7-stage strip with progress arrows */}
      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-[720px] items-stretch gap-0 lg:min-w-0">
          {phases.map((phase, index) => {
            const active = phase.id === activeSlug;
            const Icon = getCategoryIcon(phase.id);
            const nextPhase = phases[index + 1];
            const arrowActive = phase.status === "completed";
            return (
              <div key={phase.id} className="flex min-w-0 flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setActiveSlug(phase.id)}
                  className={cn(
                    "flex w-full flex-col items-center rounded-xl border px-1 py-1.5 text-center transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    active
                      ? "border-primary/40 bg-primary/5"
                      : phase.status === "completed"
                        ? "border-chart-2/30 bg-chart-2/5"
                        : "border-border/70 bg-card hover:border-primary/25"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full",
                      getCategoryIconStyle(phase.id, active || phase.status === "completed"),
                      phase.status === "completed" && "bg-chart-2 text-white"
                    )}
                  >
                    {phase.status === "completed" ? (
                      <Check className="size-3.5" strokeWidth={2.5} />
                    ) : (
                      <Icon className="size-3.5" strokeWidth={2.25} />
                    )}
                  </span>
                  <p
                    className={cn(
                      "mt-1 w-full truncate px-0.5 text-[9px] font-bold leading-tight sm:text-[10px]",
                      active || phase.status === "completed" ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {phase.label}
                  </p>
                  <StageProgressBar
                    value={phase.progressPct}
                    barClass={
                      phase.status === "completed" ? "bg-chart-2" : getCategoryBarStyle(phase.id)
                    }
                    className="mt-1 w-full px-0.5"
                    trackClass="h-0.5"
                  />
                  <p
                    className={cn(
                      "mt-0.5 text-[8px] font-semibold tabular-nums sm:text-[9px]",
                      phase.status === "completed" ? "text-chart-2" : "text-muted-foreground"
                    )}
                  >
                    {phase.status === "completed"
                      ? "Fulfilled"
                      : phase.totalCount > 0
                        ? `0/${phase.totalCount}`
                        : "Pending"}
                  </p>
                </button>

                {nextPhase ? (
                  <div
                    className="flex w-3 shrink-0 items-center justify-center sm:w-4"
                    aria-hidden
                    title={
                      arrowActive
                        ? `${phase.label} completed — progress continues`
                        : `Order a ${phase.label} service to unlock progress`
                    }
                  >
                    <ChevronRight
                      className={cn(
                        "size-3.5 sm:size-4",
                        arrowActive ? "text-chart-2" : "text-border"
                      )}
                      strokeWidth={arrowActive ? 2.75 : 2}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact active stage + services */}
      <div className="mt-3 rounded-xl border border-border bg-muted/15 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-lg",
              getCategoryIconStyle(activeSlug, true)
            )}
          >
            <ActiveIcon className="size-3.5" strokeWidth={2} />
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
            Step {stepIndex + 1}. {activeMeta?.stageTitle || activePhase?.label}
          </p>
          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
            {progressPct}%
          </span>
          <span
            className={cn(
              "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
              activePhase?.status === "completed"
                ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
                : activePhase?.status === "in_progress"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
            )}
          >
            {activePhase?.status === "completed"
              ? "Fulfilled"
              : "Pending"}
          </span>
        </div>

        <StageProgressBar
          value={progressPct}
          barClass={getCategoryBarStyle(activeSlug)}
          className="mt-2"
        />

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-foreground">
            {activeMeta?.label || "Category"} Services
            <span className="ml-1.5 font-medium text-muted-foreground">
              ({activePhase?.completedCount || 0}/{activePhase?.totalCount || 0})
            </span>
          </h3>
          <Button variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-[11px] font-semibold" asChild>
            <Link href={`${basePath}/services?category=${activeSlug}&project=${project.id}`}>
              View all
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        {categoryServices.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categoryServices.map((service) => {
              const meta = getServiceCardMeta(service);
              const cat = Array.isArray(service.service_categories)
                ? service.service_categories[0]
                : service.service_categories;
              const Icon = getCategoryIcon(cat?.slug || activeSlug);
              const badge = getServiceImpactBadge(service, cat?.slug);
              const benefits = getServiceBenefits(service);
              const logoColor = getServiceLogoColor(service.name);
              const accent = getServiceAccent(service.name);
              const status = orderStatusForService(orders, service.id);
              const href = `${basePath}/services/${service.slug}?project=${project.id}`;

              return (
                <article
                  key={service.id}
                  className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-3.5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />

                  <div className="flex items-start justify-between gap-2 pl-2">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-border/50",
                        status === "completed" ? "bg-chart-2/15 text-chart-2" : logoColor
                      )}
                    >
                      {service.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={service.logo_url} alt="" className="size-full object-cover" />
                      ) : status === "completed" ? (
                        <CheckCircle2 className="size-5" strokeWidth={2} />
                      ) : (
                        <Icon className="size-5" strokeWidth={2} />
                      )}
                    </div>
                    {status === "completed" ? (
                      <span className="rounded-full border border-chart-2/30 bg-chart-2/10 px-2 py-0.5 text-[10px] font-semibold text-chart-2">
                        Completed
                      </span>
                    ) : (
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", badge.tone)}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 line-clamp-2 pl-2 text-sm font-bold text-foreground">{service.name}</h3>
                  {service.description ? (
                    <p className="mt-1 line-clamp-2 pl-2 text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  ) : null}

                  <ul className="mt-2.5 flex-1 space-y-1 pl-2">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 border-t border-border pt-2.5 pl-2">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground">Starting from</p>
                        <p className="text-sm font-bold tabular-nums text-foreground">{meta.priceLabel}</p>
                        <p className="text-[10px] text-muted-foreground">TAT: {service.estimated_tat || "—"}</p>
                      </div>
                      {status === "completed" ? (
                        <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-chart-2/30 bg-chart-2/10 px-2.5 text-xs font-semibold text-chart-2">
                          <CheckCircle2 className="size-3.5" />
                          Done
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 shrink-0 rounded-lg text-xs font-semibold"
                          asChild
                        >
                          <Link href={href}>{status === "ordered" ? "View order" : meta.ctaLabel}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
            No services in this category yet.
          </p>
        )}
      </div>
    </DashboardPanel>
  );
}
