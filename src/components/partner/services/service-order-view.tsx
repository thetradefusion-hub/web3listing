"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Headphones,
  Layers,
  Send,
  Shield,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { OrderForm } from "@/components/partner/order-form";
import { PartnerPageShell } from "@/components/partner/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/commission";
import { PRICING_PACKAGE } from "@/lib/pricing";
import {
  getCategoryIcon,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
} from "@/lib/service-catalog";
import type { Project, Service } from "@/types/database";
import { cn } from "@/lib/utils";

const ORDER_STEPS = ["Review service", "Select project", "Confirm order"] as const;

function OrderStepper({ current = 2 }: { current?: number }) {
  return (
    <ol className="grid grid-cols-3 gap-2 sm:gap-3">
      {ORDER_STEPS.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <li
            key={step}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors sm:px-4 sm:py-3",
              isActive
                ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
                : isDone
                  ? "border-chart-2/35 bg-chart-2/10"
                  : "border-border/80 bg-muted/15"
            )}
          >
            <p
              className={cn(
                "text-[10px] font-bold sm:text-xs",
                isActive ? "text-primary" : isDone ? "text-chart-2" : "text-muted-foreground"
              )}
            >
              <span className="mr-1 inline-flex size-4 items-center justify-center rounded-full bg-current/10 text-[9px] sm:size-5 sm:text-[10px]">
                {stepNum}
              </span>
              {step}
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
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/8 via-card to-chart-2/5 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Order total</p>
          <Badge className="bg-primary/15 text-[10px] text-primary hover:bg-primary/15">
            {PRICING_PACKAGE[service.pricing_model]}
          </Badge>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-primary sm:text-4xl">{formatCurrency(total)}</p>
        <dl className="mt-4 flex flex-col gap-2.5 rounded-xl border border-border/60 bg-card/80 p-3 text-sm">
          <div className="flex justify-between gap-3 text-muted-foreground">
            <dt>Service price</dt>
            <dd className="font-semibold text-foreground">{formatCurrency(servicePrice)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-muted-foreground">
            <dt>Platform fee ({platformFeePercent}%)</dt>
            <dd className="font-semibold text-foreground">{formatCurrency(platformFee)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/8 via-card to-chart-2/5 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">Pricing</p>
      <p className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{priceLabel}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{PRICING_PACKAGE[service.pricing_model]}</p>
    </div>
  );
}

function CompactServiceContext({
  service,
  categoryName,
  categorySlug,
  meta,
  serviceHref,
}: {
  service: Service;
  categoryName: string;
  categorySlug: string;
  meta: ReturnType<typeof getServiceCardMeta>;
  serviceHref: string;
}) {
  const logoColor = getServiceLogoColor(service.name);
  const CatIcon = getCategoryIcon(categorySlug);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/15 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-border/50",
            logoColor
          )}
        >
          {service.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={service.logo_url} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xs font-bold">{getServiceInitials(service.name)}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">{service.name}</p>
            <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[9px] font-medium text-muted-foreground">
              <CatIcon className="size-2.5" strokeWidth={2} />
              {categoryName}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Tag className="size-3" />
              {meta.priceLabel}
            </span>
            {service.estimated_tat ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {service.estimated_tat}
              </span>
            ) : null}
            {service.payment_terms ? (
              <span className="inline-flex items-center gap-1">
                <CreditCard className="size-3" />
                {service.payment_terms}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-8 shrink-0 self-start rounded-lg text-xs text-muted-foreground sm:self-center" asChild>
        <Link href={serviceHref}>
          <ExternalLink data-icon="inline-start" className="size-3" />
          Full service details
        </Link>
      </Button>
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
  const projectQuery = defaultProjectId ? `?project=${defaultProjectId}` : "";
  const serviceHref = `${basePath}/services/${service.slug}${projectQuery}`;

  const platformFee = service.service_fee ?? 0;
  const servicePrice = service.price ?? 0;
  const total = service.pricing_model === "fixed" ? servicePrice + platformFee : null;
  const platformFeePercent = servicePrice > 0 ? Math.round((platformFee / servicePrice) * 100) : 0;
  const canOrder = projects.length > 0;

  return (
    <PartnerPageShell compact fullWidth className="mx-auto max-w-3xl gap-4 pb-8 sm:gap-5 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
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
            <h1 className="mt-0 text-lg font-bold text-foreground sm:mt-1.5 sm:text-2xl">Complete your order</h1>
            <p className="mt-1 text-sm text-muted-foreground">Select a project and confirm — you&apos;re almost done.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 shrink-0 rounded-xl px-3 text-xs font-semibold sm:text-sm"
            asChild
          >
            <Link href={serviceHref}>
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>

        <OrderStepper current={canOrder ? 2 : 1} />
      </div>

      <CompactServiceContext
        service={service}
        categoryName={categoryName}
        categorySlug={categorySlug}
        meta={meta}
        serviceHref={serviceHref}
      />

      {/* Main order flow */}
      <Card
        size="sm"
        className="gap-0 overflow-hidden border-2 border-primary/25 py-0 shadow-xl shadow-primary/10 ring-1 ring-primary/10"
      >
        <CardHeader className="border-b border-primary/15 bg-gradient-to-r from-primary/15 via-primary/8 to-chart-2/10 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <ShoppingBag className="size-6" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Step 2 of 3</p>
              <CardTitle className="mt-1 text-xl font-bold sm:text-2xl">Pricing &amp; Order</CardTitle>
              <CardDescription className="mt-1.5 text-sm text-foreground/75 sm:text-base">
                Select your project and confirm to continue
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 p-5 sm:gap-6 sm:p-6">
          <PricingBreakdown
            service={service}
            servicePrice={servicePrice}
            platformFee={platformFee}
            platformFeePercent={platformFeePercent}
            total={total}
            priceLabel={meta.priceLabel}
          />

          {showCommission && meta.commissionLabel && (
            <div className="rounded-xl border border-chart-2/30 bg-chart-2/10 px-4 py-3.5 text-center">
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                Your commission ({service.commission_value}
                {service.commission_type === "percentage" ? "%" : " fixed"})
              </p>
              <p className="mt-0.5 text-xl font-bold text-chart-2 sm:text-2xl">{meta.commissionLabel}</p>
            </div>
          )}

          <Separator />

          {canOrder ? (
            <div className="rounded-2xl border border-border bg-muted/10 p-4 sm:p-5">
              <p className="text-sm font-bold text-foreground">Select project &amp; place order</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose which token project this order is for, then submit.
              </p>
              <div className="mt-4">
                <OrderForm
                  service={service}
                  projects={projects}
                  defaultProjectId={defaultProjectId}
                  basePath={basePath}
                  comfortable
                />
              </div>
            </div>
          ) : (
            <Empty className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-14 bg-primary/15 text-primary">
                  <Layers />
                </EmptyMedia>
                <EmptyTitle className="text-lg">Create a project first</EmptyTitle>
                <EmptyDescription className="max-w-sm">
                  You need an approved project before ordering this service. Create one, then return here to place your
                  order.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex w-full max-w-xs flex-col gap-2">
                <Button className="h-11 w-full rounded-xl font-semibold shadow-sm" asChild>
                  <Link href={`${basePath}/projects/new`}>Create Project</Link>
                </Button>
                <Button variant="outline" className="h-10 w-full rounded-xl" asChild>
                  <Link href={serviceHref}>View service details</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-3 border-t border-border bg-muted/15 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5 text-primary" />
              Secure checkout
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Headphones className="size-3.5 text-chart-2" />
              24/7 support
            </span>
          </div>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            Multiple tokens or custom scope? Message your account manager for tailored pricing.
          </p>
          {managerTelegramLink ? (
            <Button variant="outline" className="h-10 w-full rounded-xl text-sm font-semibold sm:h-11" asChild>
              <TelegramAnchor href={managerTelegramLink}>
                <Send data-icon="inline-start" />
                Message on Telegram
              </TelegramAnchor>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </PartnerPageShell>
  );
}
