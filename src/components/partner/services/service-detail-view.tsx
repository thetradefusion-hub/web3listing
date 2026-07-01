"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck,
  FileSearch,
  FileText,
  Flame,
  Globe,
  Headphones,
  Layers,
  MessageSquare,
  Network,
  RotateCcw,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerPageShell } from "@/components/partner/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  CATEGORY_ICONS,
  getServiceAccent,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
  getServiceOrderPath,
  parseJsonArray,
  parseNetworks,
} from "@/lib/service-catalog";
import { iconTintStyles } from "@/lib/theme-tokens";
import type { Service } from "@/types/database";
import { cn } from "@/lib/utils";

type RecentListing = {
  id: string;
  project_name: string;
  token_symbol: string | null;
  completed_at: string;
};

const FEATURE_ICONS = [BadgeCheck, Shield, Globe, Headphones, ClipboardList];
const PROCESS_ICONS = [ClipboardList, FileSearch, Send, MessageSquare, BadgeCheck];

const TAB_TRIGGER_CLASS =
  "shrink-0 snap-start rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:py-3 sm:text-sm";

const TAB_LABELS: Record<string, { short: string; full: string }> = {
  overview: { short: "Overview", full: "Overview" },
  included: { short: "Included", full: "Included" },
  proof: { short: "Proof", full: "Proof" },
  requirements: { short: "Req.", full: "Requirements" },
  faq: { short: "FAQ", full: "FAQ" },
  terms: { short: "Terms", full: "Terms" },
};

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
    <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg ring-1", tone)}>
        <Icon className="size-3.5" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="break-words text-[11px] font-bold leading-snug text-foreground sm:text-xs">{value || "—"}</p>
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-semibold text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

function NetworksSummaryRow({ networks }: { networks: string | null | undefined }) {
  const options = useMemo(() => parseNetworks(networks), [networks]);
  const [selected, setSelected] = useState("");

  const value = selected || options[0] || "";

  if (options.length === 0) {
    return <SummaryRow icon={Network} label="Networks" value={undefined} />;
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
        <Network className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Networks</p>
        <Select value={value} onValueChange={(v) => v && setSelected(v)}>
          <SelectTrigger className="mt-0.5 h-9 w-full rounded-lg border-input bg-background text-sm font-semibold shadow-sm">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((network) => (
                <SelectItem key={network} value={network}>
                  {network}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ServiceDetailView({
  service,
  categoryName,
  categorySlug,
  defaultProjectId,
  recentListings,
  basePath = "/partner",
  showCommission = true,
}: {
  service: Service;
  categoryName: string;
  categorySlug: string;
  defaultProjectId?: string;
  recentListings: RecentListing[];
  basePath?: string;
  showCommission?: boolean;
}) {
  const meta = getServiceCardMeta(service);
  const logoColor = getServiceLogoColor(service.name);
  const accent = getServiceAccent(service.name);
  const CatIcon = CATEGORY_ICONS[categorySlug] || Layers;
  const whatsIncluded = parseJsonArray<string>(service.whats_included);
  const platforms = parseJsonArray<string>(service.supported_platforms);
  const processSteps = parseJsonArray<{ title: string; description?: string }>(service.process_steps);
  const faqs = service.faqs || [];
  const requiredDocs = service.required_documents || [];

  const overviewText = service.overview || service.description;
  const projectQuery = defaultProjectId ? `?project=${defaultProjectId}` : "";
  const orderHref = getServiceOrderPath(basePath, service.slug, defaultProjectId);

  return (
    <PartnerPageShell compact fullWidth className="gap-4 pb-20 sm:gap-5 lg:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:items-start sm:gap-3">
        <nav className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
          <Link href={`${basePath}/services${projectQuery}`} className="shrink-0 transition hover:text-primary">
            Marketplace
          </Link>
          <span aria-hidden>›</span>
          <span className="truncate font-medium text-foreground">{service.name}</span>
        </nav>

        <nav className="hidden min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Link href={basePath} className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <Link href={`${basePath}/services`} className="transition hover:text-primary">
            Marketplace
          </Link>
          <span aria-hidden>›</span>
          <Link
            href={`${basePath}/services?category=${categorySlug}${defaultProjectId ? `&project=${defaultProjectId}` : ""}`}
            className="transition hover:text-primary"
          >
            {categoryName}
          </Link>
          <span aria-hidden>›</span>
          <span className="max-w-[200px] truncate font-medium text-foreground md:max-w-none">{service.name}</span>
        </nav>

        <Button variant="outline" size="sm" className="h-8 shrink-0 rounded-xl px-2.5 text-xs font-semibold sm:h-9 sm:px-3" asChild>
          <Link href={`${basePath}/services${projectQuery}`} aria-label="Back to services">
            <ArrowLeft data-icon="inline-start" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
      </div>

      {/* Hero */}
      <Card size="sm" className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 py-0">
        <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />
        <CardContent className="flex flex-col gap-4 p-4 pl-5 sm:p-5 sm:pl-6 lg:flex-row lg:items-start lg:gap-5">
          <div className="flex min-w-0 gap-3 sm:gap-4 lg:min-w-0 lg:flex-1">
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-md ring-2 ring-border/50 sm:size-16 lg:size-[72px]",
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
              <h1 className="text-base font-bold leading-tight text-foreground sm:text-xl lg:text-2xl">{service.name}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {service.badge ? (
                  <span
                    className={cn(
                      "inline-flex h-5 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold",
                      BADGE_STYLES[service.badge]
                    )}
                  >
                    {service.badge === "hot" && <Flame className="size-3" strokeWidth={2.5} />}
                    {BADGE_LABELS[service.badge]}
                  </span>
                ) : null}
                <span className="inline-flex h-5 max-w-full items-center gap-1 rounded-full border border-border bg-muted/40 px-2 text-[10px] font-semibold text-muted-foreground">
                  <CatIcon className="size-3 shrink-0" strokeWidth={2} />
                  <span className="truncate">{categoryName}</span>
                </span>
              </div>

              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">{service.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(service.proof_of_work || service.proof_of_work_url) && (
                  <a
                    href={service.proof_of_work_url || "#"}
                    target="_blank"
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

              <div className="mt-4 hidden grid-cols-3 gap-2 lg:grid">
                <MetricPill icon={Tag} label="Price" value={meta.priceLabel} tone={iconTintStyles.blue} />
                <MetricPill icon={Clock} label="TAT" value={service.estimated_tat} tone={iconTintStyles.orange} />
                <MetricPill icon={CreditCard} label="Payment" value={service.payment_terms} tone={iconTintStyles.green} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:hidden">
            <MetricPill icon={Tag} label="Price" value={meta.priceLabel} tone={iconTintStyles.blue} />
            <MetricPill icon={Clock} label="TAT" value={service.estimated_tat} tone={iconTintStyles.orange} />
            <MetricPill icon={CreditCard} label="Pay" value={service.payment_terms} tone={iconTintStyles.green} />
          </div>

          <div className="hidden w-full shrink-0 flex-col gap-2 sm:flex lg:w-[172px]">
            <p className="text-center text-xl font-bold tabular-nums text-foreground sm:text-2xl lg:text-right">{meta.priceLabel}</p>
            {showCommission && meta.commissionLabel && (
              <div className="rounded-xl border border-chart-2/20 bg-chart-2/10 px-3 py-2 text-center lg:text-right">
                <p className="text-[10px] font-medium text-muted-foreground">Earn Commission</p>
                <p className="text-sm font-bold text-chart-2">{meta.commissionLabel}</p>
              </div>
            )}
            <Button className="h-10 rounded-xl font-semibold shadow-sm" asChild>
              <Link href={orderHref}>
                <ShoppingBag data-icon="inline-start" />
                {meta.ctaLabel}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-start lg:gap-5">
        <div className="order-2 flex min-w-0 flex-col gap-4 lg:order-none lg:col-start-1">
          <Card size="sm" className="gap-0 overflow-hidden py-0">
            <Tabs defaultValue="overview">
              <TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 snap-x snap-mandatory [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1">
                {Object.entries(TAB_LABELS).map(([tab, labels]) => (
                  <TabsTrigger key={tab} value={tab} className={TAB_TRIGGER_CLASS}>
                    <span className="sm:hidden">{labels.short}</span>
                    <span className="hidden sm:inline">{labels.full}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="flex flex-col gap-6 p-4 sm:p-5">
                <section>
                  <h3 className="text-sm font-bold text-foreground">Service Overview</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{overviewText}</p>
                  {whatsIncluded.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                      {whatsIncluded.slice(0, 5).map((item, i) => {
                        const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                        return (
                          <Card key={item} size="sm" className="gap-0 border-primary/15 bg-primary/5 py-0 text-center ring-0">
                            <CardContent className="flex flex-col items-center gap-2 p-3">
                              <span className="flex size-9 items-center justify-center rounded-full bg-card text-primary shadow-sm ring-1 ring-border/50">
                                <Icon className="size-4" strokeWidth={2} />
                              </span>
                              <p className="text-[10px] font-semibold leading-snug text-muted-foreground">{item}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </section>

                {processSteps.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-foreground">Our Process</h3>
                    <div className="mt-4 flex snap-x snap-mandatory items-start gap-1 overflow-x-auto pb-1 [scrollbar-width:thin]">
                      {processSteps.map((step, i) => {
                        const Icon = PROCESS_ICONS[i % PROCESS_ICONS.length];
                        return (
                          <div key={step.title} className="flex shrink-0 items-start">
                            <div className="flex w-[96px] flex-col items-center text-center sm:w-[104px]">
                              <span className="flex size-11 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-primary">
                                <Icon className="size-5" strokeWidth={2} />
                              </span>
                              <p className="mt-2 text-[10px] font-medium leading-snug text-muted-foreground">{step.title}</p>
                              {step.description ? (
                                <p className="mt-0.5 line-clamp-2 text-[9px] text-muted-foreground/80">{step.description}</p>
                              ) : null}
                            </div>
                            {i < processSteps.length - 1 && (
                              <ChevronRight className="mx-0.5 mt-3 size-4 shrink-0 text-border" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {platforms.length > 0 && (
                  <section>
                    <h3 className="text-sm font-bold text-foreground">Supported Platforms</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {platforms.map((p) => (
                        <span
                          key={p}
                          className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 text-xs font-medium text-muted-foreground"
                        >
                          <Globe className="size-3 shrink-0" />
                          {p}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="included" className="p-4 sm:p-5">
                {whatsIncluded.length > 0 ? (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {whatsIncluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty className="border-0 bg-transparent py-6">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">Nothing listed yet</EmptyTitle>
                      <EmptyDescription>Included items will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </TabsContent>

              <TabsContent value="proof" className="p-4 sm:p-5">
                {service.proof_of_work ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">{service.proof_of_work}</p>
                ) : (
                  <Empty className="border-0 bg-transparent py-6">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">Proof coming soon</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
                {service.proof_of_work_url && (
                  <Button variant="outline" className="mt-4 rounded-xl font-semibold" asChild>
                    <a href={service.proof_of_work_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink data-icon="inline-start" />
                      View Proof of Work
                    </a>
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="p-4 sm:p-5">
                {requiredDocs.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {requiredDocs.map((doc, i) => (
                      <li
                        key={doc}
                        className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/20 px-3.5 py-3 text-sm text-muted-foreground"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Requirements shared during order placement.</p>
                )}
              </TabsContent>

              <TabsContent value="faq" className="p-4 sm:p-5">
                {faqs.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {faqs.map((faq) => (
                      <Card key={faq.question} size="sm" className="gap-0 border-border py-0 ring-0">
                        <CardHeader className="gap-1 p-3.5 pb-2">
                          <CardTitle className="text-sm font-semibold text-foreground">{faq.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3.5 pt-0">
                          <CardDescription className="text-sm leading-relaxed">{faq.answer}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty className="border-0 bg-transparent py-6">
                    <EmptyHeader>
                      <EmptyTitle className="text-sm">No FAQs yet</EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                )}
              </TabsContent>

              <TabsContent value="terms" className="p-4 sm:p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.terms_conditions || "Standard platform terms apply. Third-party approvals are not guaranteed."}
                </p>
              </TabsContent>
            </Tabs>
          </Card>

          {recentListings.length > 0 && (
            <DashboardPanel
              title="Recent Successful Listings"
              description="Projects that completed this service"
              icon={CheckCircle2}
              iconColor="green"
              action={
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-semibold" asChild>
                  <Link href={`${basePath}/orders`}>View All</Link>
                </Button>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {recentListings.map((item) => {
                  const initials = (item.token_symbol || item.project_name).slice(0, 2).toUpperCase();
                  const avatarColor = getServiceLogoColor(item.project_name);
                  return (
                    <Card key={item.id} size="sm" className="gap-0 bg-muted/20 py-0 ring-0">
                      <CardContent className="flex flex-col gap-2.5 p-3.5">
                        <div className="flex items-start gap-2.5">
                          <Avatar className="size-10 ring-2 ring-border/50">
                            <AvatarFallback className={cn("text-[11px] font-bold", avatarColor)}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{item.project_name}</p>
                            <p className="text-[11px] text-muted-foreground">{categoryName}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {format(new Date(item.completed_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <span className="w-fit rounded-full border border-chart-2/30 bg-chart-2/10 px-2 py-0.5 text-[10px] font-semibold text-chart-2">
                          Completed
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DashboardPanel>
          )}
        </div>

        <aside className="order-1 flex min-w-0 flex-col gap-4 lg:order-none lg:col-start-2 lg:sticky lg:top-20 lg:self-start">
          <DashboardPanel title="Service Summary" icon={Layers} iconColor="blue" className="hidden sm:block">
            <div className="flex flex-col divide-y divide-border">
              <SummaryRow icon={Layers} label="Category" value={categoryName} />
              <SummaryRow icon={Clock} label="Estimated TAT" value={service.estimated_tat} />
              <SummaryRow icon={CreditCard} label="Payment Terms" value={service.payment_terms} />
              <SummaryRow icon={FileText} label="Listing Type" value={service.listing_type} />
              <NetworksSummaryRow networks={service.networks} />
              <SummaryRow icon={RotateCcw} label="Refund Policy" value={service.refund_policy || "Non-Refundable"} />
              <SummaryRow icon={Headphones} label="Support" value="24/7 Telegram" />
            </div>
          </DashboardPanel>

          <Card size="sm" className="gap-0 overflow-hidden py-0 shadow-md">
            <CardHeader className="border-b border-border p-4 pb-3">
              <CardTitle className="text-sm font-bold">Ready to order?</CardTitle>
              <CardDescription className="text-xs">Review pricing and place your order on the next step</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-4">
              <p className="text-2xl font-bold tabular-nums text-primary">{meta.priceLabel}</p>
              {showCommission && meta.commissionLabel ? (
                <div className="rounded-xl border border-chart-2/20 bg-chart-2/10 px-3 py-2 text-center text-sm">
                  <p className="text-muted-foreground">
                    Your Earnings: <span className="font-bold text-chart-2">{meta.commissionLabel}</span>
                  </p>
                </div>
              ) : null}
              <Button className="h-10 w-full rounded-xl font-semibold shadow-sm" asChild>
                <Link href={orderHref}>
                  <ShoppingBag data-icon="inline-start" />
                  {meta.ctaLabel}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Alert className="hidden border-primary/20 bg-primary/5 sm:flex">
            <Shield className="text-primary" />
            <AlertTitle className="text-xs font-semibold text-foreground">Safe & Secure</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Your payment and data are protected on our platform.
            </AlertDescription>
          </Alert>
        </aside>
      </div>

      {/* Mobile sticky order bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-card/80 sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium text-muted-foreground">{service.name}</p>
            <p className="text-lg font-bold tabular-nums text-primary">{meta.priceLabel}</p>
          </div>
          <Button className="h-10 shrink-0 rounded-xl px-4 font-semibold shadow-sm" asChild>
            <Link href={orderHref}>{meta.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </PartnerPageShell>
  );
}
