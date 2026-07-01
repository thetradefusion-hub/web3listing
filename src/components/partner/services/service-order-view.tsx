"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  Layers,
  RotateCcw,
  Send,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { OrderForm } from "@/components/partner/order-form";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerPageShell } from "@/components/partner/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/commission";
import { PRICING_PACKAGE } from "@/lib/pricing";
import {
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
  parseJsonArray,
} from "@/lib/service-catalog";
import { iconTintStyles } from "@/lib/theme-tokens";
import type { Project, Service } from "@/types/database";
import { cn } from "@/lib/utils";

const ORDER_STEPS = ["Review service", "Select project", "Confirm order"] as const;

function MetricPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | null | undefined;
  tone: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-muted/25 px-2.5 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 sm:size-9", tone)}>
        <Icon className="size-3.5 sm:size-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[10px]">{label}</p>
        <p className="break-words text-[11px] font-bold leading-snug text-foreground sm:text-xs">{value || "—"}</p>
      </div>
    </div>
  );
}

function OrderStepper({ current = 2 }: { current?: number }) {
  return (
    <ol className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {ORDER_STEPS.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <li
            key={step}
            className={cn(
              "rounded-xl border px-2 py-2 text-center transition-colors sm:px-3 sm:py-2.5",
              isActive
                ? "border-primary/35 bg-primary/10"
                : isDone
                  ? "border-chart-2/30 bg-chart-2/10"
                  : "border-border bg-muted/20"
            )}
          >
            <p
              className={cn(
                "text-[10px] font-bold sm:text-xs",
                isActive ? "text-primary" : isDone ? "text-chart-2" : "text-muted-foreground"
              )}
            >
              {stepNum}. {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function PricingBreakdown({
  service,
  servicePrice,
  platformFee,
  platformFeePercent,
  total,
  priceLabel,
}: {
  service: Service;
  servicePrice: number;
  platformFee: number;
  platformFeePercent: number;
  total: number | null;
  priceLabel: string;
}) {
  if (service.pricing_model === "fixed" && total != null) {
    return (
      <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/30 via-card to-primary/5 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order total</p>
          <Badge variant="secondary" className="text-[10px]">
            {PRICING_PACKAGE[service.pricing_model]}
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums text-primary sm:text-3xl">{formatCurrency(total)}</p>
        <dl className="mt-4 flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between gap-3 text-muted-foreground">
            <dt>Service price</dt>
            <dd className="font-medium text-foreground">{formatCurrency(servicePrice)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-muted-foreground">
            <dt>Platform fee ({platformFeePercent}%)</dt>
            <dd className="font-medium text-foreground">{formatCurrency(platformFee)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-muted/30 via-card to-primary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pricing</p>
      <p className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{priceLabel}</p>
      <p className="mt-1.5 text-xs text-muted-foreground">{PRICING_PACKAGE[service.pricing_model]}</p>
    </div>
  );
}

export function ServiceOrderView({
  service,
  categoryName,
  categorySlug,
  projects,
  defaultProjectId,
  managerTelegramLink,
  basePath = "/partner",
  showCommission = true,
}: {
  service: Service;
  categoryName: string;
  categorySlug: string;
  projects: Project[];
  defaultProjectId?: string;
  managerTelegramLink?: string | null;
  basePath?: string;
  showCommission?: boolean;
}) {
  const meta = getServiceCardMeta(service);
  const logoColor = getServiceLogoColor(service.name);
  const accent = getServiceAccent(service.name);
  const CatIcon = CATEGORY_ICONS[categorySlug] || Layers;
  const projectQuery = defaultProjectId ? `?project=${defaultProjectId}` : "";
  const serviceHref = `${basePath}/services/${service.slug}${projectQuery}`;
  const whatsIncluded = parseJsonArray<string>(service.whats_included);
  const requiredDocs = service.required_documents || [];

  const platformFee = service.service_fee ?? 0;
  const servicePrice = service.price ?? 0;
  const total = service.pricing_model === "fixed" ? servicePrice + platformFee : null;
  const platformFeePercent = servicePrice > 0 ? Math.round((platformFee / servicePrice) * 100) : 0;
  const canOrder = projects.length > 0;

  return (
    <PartnerPageShell compact fullWidth className="gap-4 pb-8 sm:gap-5 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <nav className="hidden flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Link href={basePath} className="transition hover:text-primary">
                Dashboard
              </Link>
              <span aria-hidden>›</span>
              <Link href={`${basePath}/services`} className="transition hover:text-primary">
                Marketplace
              </Link>
              <span aria-hidden>›</span>
              <Link href={serviceHref} className="max-w-[200px] truncate transition hover:text-primary lg:max-w-none">
                {service.name}
              </Link>
              <span aria-hidden>›</span>
              <span className="font-medium text-foreground">Order</span>
            </nav>
            <h1 className="mt-0 text-lg font-bold text-foreground sm:mt-1.5 sm:text-2xl">Place your order</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete the form below to order <span className="font-medium text-foreground">{service.name}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 shrink-0 rounded-xl px-3 text-xs font-semibold sm:text-sm"
            asChild
          >
            <Link href={serviceHref}>
              <ArrowLeft data-icon="inline-start" />
              <span className="sm:inline">Back</span>
            </Link>
          </Button>
        </div>

        <OrderStepper current={canOrder ? 2 : 1} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(340px,440px)] xl:items-start xl:gap-6">
        {/* Left — service context */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card size="sm" className="relative gap-0 overflow-hidden py-0">
            <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-md ring-2 ring-border/50 sm:size-16",
                    logoColor
                  )}
                >
                  {service.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.logo_url} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-base font-bold sm:text-lg">{getServiceInitials(service.name)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold leading-tight text-foreground sm:text-lg">{service.name}</h2>
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <CatIcon className="size-3" strokeWidth={2} />
                      {categoryName}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {service.overview || service.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:gap-2.5">
                <MetricPill icon={Tag} label="Price" value={meta.priceLabel} tone={iconTintStyles.blue} />
                <MetricPill icon={Clock} label="TAT" value={service.estimated_tat} tone={iconTintStyles.orange} />
                <MetricPill icon={CreditCard} label="Payment" value={service.payment_terms} tone={iconTintStyles.green} />
              </div>
            </CardContent>
          </Card>

          {(service.listing_type || service.refund_policy || service.networks) && (
            <DashboardPanel title="Order details" icon={FileText} iconColor="purple">
              <div className="grid gap-2 sm:grid-cols-2">
                {service.listing_type ? (
                  <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Listing type</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{service.listing_type}</p>
                  </div>
                ) : null}
                {service.refund_policy ? (
                  <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Refund policy</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{service.refund_policy}</p>
                  </div>
                ) : null}
                {service.networks ? (
                  <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5 sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Networks</p>
                    <p className="mt-0.5 text-sm font-medium leading-relaxed text-foreground">{service.networks}</p>
                  </div>
                ) : null}
              </div>
            </DashboardPanel>
          )}

          {whatsIncluded.length > 0 && (
            <DashboardPanel title="What's included" icon={CheckCircle2} iconColor="green">
              <ul className="grid gap-2 sm:grid-cols-2">
                {whatsIncluded.slice(0, 6).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-xl border border-border bg-muted/15 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-2" strokeWidth={2.25} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </DashboardPanel>
          )}

          {requiredDocs.length > 0 && (
            <DashboardPanel title="Documents you'll need" icon={FileText} iconColor="amber">
              <ol className="flex flex-col gap-2">
                {requiredDocs.slice(0, 5).map((doc, i) => (
                  <li
                    key={doc}
                    className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/15 px-3 py-2.5 text-sm text-muted-foreground"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {doc}
                  </li>
                ))}
              </ol>
            </DashboardPanel>
          )}

          <div className="hidden gap-3 sm:grid sm:grid-cols-3">
            <Alert className="border-primary/20 bg-primary/5 py-3">
              <Shield className="size-4 text-primary" />
              <AlertTitle className="text-xs">Secure checkout</AlertTitle>
            </Alert>
            <Alert className="border-chart-2/25 bg-chart-2/10 py-3">
              <Headphones className="size-4 text-chart-2" />
              <AlertTitle className="text-xs">24/7 support</AlertTitle>
            </Alert>
            <Alert className="border-border bg-muted/30 py-3">
              <RotateCcw className="size-4 text-muted-foreground" />
              <AlertTitle className="text-xs text-muted-foreground">Clear refund terms</AlertTitle>
            </Alert>
          </div>
        </div>

        {/* Right — order panel */}
        <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
          <Card size="sm" className="gap-0 overflow-hidden py-0 shadow-lg ring-1 ring-border/60">
            <CardHeader className="border-b border-border bg-gradient-to-r from-primary/8 via-card to-chart-2/5 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
                  <ShoppingBag className="size-5" strokeWidth={2.25} />
                </span>
                <div className="min-w-0">
                  <CardTitle className="text-base font-bold sm:text-lg">Pricing & Order</CardTitle>
                  <CardDescription className="mt-0.5 text-xs sm:text-sm">
                    Select your project and confirm to continue
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
              <PricingBreakdown
                service={service}
                servicePrice={servicePrice}
                platformFee={platformFee}
                platformFeePercent={platformFeePercent}
                total={total}
                priceLabel={meta.priceLabel}
              />

              {showCommission && meta.commissionLabel && (
                <div className="rounded-xl border border-chart-2/25 bg-chart-2/10 px-3 py-3 text-center sm:px-4">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Your commission ({service.commission_value}%)
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-chart-2 sm:text-xl">{meta.commissionLabel}</p>
                </div>
              )}

              <Separator />

              {canOrder ? (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order form</p>
                  <OrderForm
                    service={service}
                    projects={projects}
                    defaultProjectId={defaultProjectId}
                    basePath={basePath}
                    comfortable
                  />
                </div>
              ) : (
                <Empty className="rounded-2xl border border-dashed bg-muted/10 py-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon" className="size-12 bg-primary/10 text-primary">
                      <Layers />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">Create a project first</EmptyTitle>
                    <EmptyDescription>
                      You need an approved project before ordering this service.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent className="flex w-full max-w-xs flex-col gap-2">
                    <Button className="h-11 w-full rounded-xl font-semibold" asChild>
                      <Link href={`${basePath}/projects/new`}>Create Project</Link>
                    </Button>
                    <Button variant="outline" className="h-10 w-full rounded-xl" asChild>
                      <Link href={serviceHref}>View service details</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>

            <CardFooter className="flex-col items-stretch gap-2 border-t border-border bg-muted/20 p-4 sm:p-5">
              <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                Multiple tokens or custom scope? Message your account manager for tailored pricing.
              </p>
              {managerTelegramLink ? (
                <Button variant="outline" className="h-10 w-full rounded-xl text-sm font-semibold sm:h-11" asChild>
                  <a href={managerTelegramLink} target="_blank" rel="noopener noreferrer">
                    <Send data-icon="inline-start" />
                    Message on Telegram
                  </a>
                </Button>
              ) : null}
            </CardFooter>
          </Card>

          <Alert className="mt-4 border-primary/20 bg-primary/5 sm:hidden">
            <Shield className="text-primary" />
            <AlertTitle className="text-xs font-semibold">Safe & Secure</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Payments and data are protected on our platform.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </PartnerPageShell>
  );
}
