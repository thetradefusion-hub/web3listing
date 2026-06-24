"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  FileSearch,
  FileText,
  Globe,
  Headphones,
  Heart,
  Layers,
  MessageSquare,
  Network,
  PlayCircle,
  RotateCcw,
  Send,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderForm } from "@/components/partner/order-form";
import { formatCurrency } from "@/lib/commission";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  getServiceCardMeta,
  getServiceInitials,
  getServiceLogoColor,
  parseJsonArray,
} from "@/lib/service-catalog";
import type { Project, Service } from "@/types/database";
import { cn } from "@/lib/utils";

type RecentListing = {
  id: string;
  project_name: string;
  token_symbol: string | null;
  completed_at: string;
};

const FEATURE_ICONS = [BadgeCheck, TrendingUp, Shield, Users, Headphones];
const PROCESS_ICONS = [ClipboardList, FileSearch, Send, MessageSquare, BadgeCheck];

const LISTING_AVATAR_COLORS = [
  "bg-[#FEF3C7] text-[#D97706]",
  "bg-[#FEE2E2] text-[#DC2626]",
  "bg-[#DBEAFE] text-[#2563EB]",
  "bg-[#F3E8FF] text-[#7C3AED]",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold text-[#0F172A]">{children}</h3>;
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
    <div className="flex items-start gap-3 border-b border-[#F1F5F9] py-3 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#94A3B8]">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-[#94A3B8]">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-[#0F172A]">{value || "—"}</p>
      </div>
    </div>
  );
}

export function ServiceDetailView({
  service,
  categoryName,
  categorySlug,
  projects,
  defaultProjectId,
  recentListings,
  managerTelegramLink,
}: {
  service: Service;
  categoryName: string;
  categorySlug: string;
  projects: Project[];
  defaultProjectId?: string;
  recentListings: RecentListing[];
  managerTelegramLink?: string | null;
}) {
  const meta = getServiceCardMeta(service);
  const logoColor = getServiceLogoColor(service.name);
  const whatsIncluded = parseJsonArray<string>(service.whats_included);
  const platforms = parseJsonArray<string>(service.supported_platforms);
  const processSteps = parseJsonArray<{ title: string; description?: string }>(service.process_steps);
  const faqs = service.faqs || [];
  const requiredDocs = service.required_documents || [];

  const platformFee = service.service_fee ?? 0;
  const servicePrice = service.price ?? 0;
  const total = service.pricing_model === "fixed" ? servicePrice + platformFee : null;
  const platformFeePercent = servicePrice > 0 ? Math.round((platformFee / servicePrice) * 100) : 0;

  const overviewText = service.overview || service.description;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start gap-3">
        <Button
          variant="outline"
          size="icon"
          className="mt-0.5 h-9 w-9 shrink-0 rounded-lg border-[#E2E8F0] bg-white"
          asChild
        >
          <Link href="/partner/services" aria-label="Back to services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Service Details</h1>
          <nav className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#94A3B8] sm:text-sm">
            <Link href="/partner/services" className="hover:text-[#635BFF]">
              All Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/partner/services?category=${categorySlug}`} className="hover:text-[#635BFF]">
              {categoryName}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[#64748B]">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero card */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-lg font-bold sm:h-[72px] sm:w-[72px]",
              logoColor
            )}
          >
            {service.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              getServiceInitials(service.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            {service.badge ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                  BADGE_STYLES[service.badge]
                )}
              >
                {BADGE_LABELS[service.badge]} Service
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                Popular Service
              </span>
            )}

            <h2 className="mt-2 text-xl font-bold text-[#0F172A] sm:text-2xl">{service.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748B]">
              {service.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[#635BFF]">
              {(service.proof_of_work || service.proof_of_work_url) && (
                <a
                  href={service.proof_of_work_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Proof of Work
                </a>
              )}
              {service.demo_link && (
                <a
                  href={service.demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  Demo
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 text-[#F59E0B]">
                <Star className="h-3.5 w-3.5 fill-current" />
                Top Rated
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-[190px] lg:text-right">
            <p className="text-2xl font-bold text-[#0F172A] sm:text-[28px]">{meta.priceLabel}</p>
            {meta.commissionLabel && (
              <p className="mt-1 text-sm text-[#64748B]">
                Earn Commission{" "}
                <span className="font-semibold text-[#059669]">{meta.commissionLabel}</span>
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button
                className="h-10 rounded-xl bg-[#635BFF] text-sm font-semibold hover:bg-[#5248E6]"
                asChild
              >
                <a href="#order-section">{meta.ctaLabel}</a>
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-xl border-[#E2E8F0] text-sm font-medium text-[#64748B]"
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* Left column */}
        <div className="min-w-0 space-y-5">
          <Tabs defaultValue="overview" className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <TabsList className="h-auto w-full justify-start gap-0 overflow-x-auto rounded-none border-b border-[#F1F5F9] bg-transparent p-0">
              {[
                ["overview", "Overview"],
                ["included", "What's Included"],
                ["proof", "Proof of Work"],
                ["requirements", "Requirements"],
                ["faq", "FAQ"],
                ["terms", "Terms & Conditions"],
              ].map(([tab, label]) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="shrink-0 rounded-none border-b-2 border-transparent px-4 py-3.5 text-sm font-medium text-[#64748B] data-[state=active]:border-[#635BFF] data-[state=active]:bg-transparent data-[state=active]:text-[#635BFF] data-[state=active]:shadow-none"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-8 p-5 sm:p-6">
              <section>
                <SectionTitle>Service Overview</SectionTitle>
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                  {overviewText}
                </p>

                {whatsIncluded.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {whatsIncluded.slice(0, 5).map((item, i) => {
                      const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                      return (
                        <div
                          key={item}
                          className="rounded-xl border border-[#EDE9FE] bg-[#F5F3FF] px-3 py-4 text-center"
                        >
                          <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#635BFF] shadow-sm">
                            <Icon className="h-4 w-4" strokeWidth={2} />
                          </span>
                          <p className="mt-2.5 text-[11px] font-semibold leading-snug text-[#475569]">
                            {item}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <SectionTitle>About {service.name.split("(")[0].trim()}</SectionTitle>
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                  {service.description}
                </p>
              </section>

              {processSteps.length > 0 && (
                <section>
                  <SectionTitle>Our Process</SectionTitle>
                  <div className="mt-5 flex items-start gap-1 overflow-x-auto pb-1 sm:gap-2">
                    {processSteps.map((step, i) => {
                      const Icon = PROCESS_ICONS[i % PROCESS_ICONS.length];
                      return (
                        <div key={step.title} className="flex shrink-0 items-start">
                          <div className="flex w-[100px] flex-col items-center text-center sm:w-[110px]">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#E0E7FF] bg-[#EEF2FF] text-[#635BFF]">
                              <Icon className="h-5 w-5" strokeWidth={2} />
                            </span>
                            <p className="mt-2 text-[11px] font-medium leading-snug text-[#475569]">
                              {step.title}
                            </p>
                          </div>
                          {i < processSteps.length - 1 && (
                            <ChevronRight className="mx-0.5 mt-3 h-4 w-4 shrink-0 text-[#CBD5E1] sm:mx-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {platforms.length > 0 && (
                <section>
                  <SectionTitle>Supported Platforms</SectionTitle>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {platforms.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#FAFBFC] px-3 py-1.5 text-xs font-medium text-[#475569]"
                      >
                        <Globe className="h-3.5 w-3.5 text-[#94A3B8]" />
                        {p}
                      </span>
                    ))}
                    {platforms.length >= 3 && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB]">
                        And More...
                      </span>
                    )}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="included" className="p-5 sm:p-6">
              {whatsIncluded.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {whatsIncluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-3.5 py-3 text-sm text-[#475569]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#635BFF]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#94A3B8]">No included items listed yet.</p>
              )}
            </TabsContent>

            <TabsContent value="proof" className="p-5 sm:p-6">
              {service.proof_of_work ? (
                <p className="text-sm leading-relaxed text-[#64748B]">{service.proof_of_work}</p>
              ) : (
                <p className="text-sm text-[#94A3B8]">Proof of work details coming soon.</p>
              )}
              {service.proof_of_work_url && (
                <a
                  href={service.proof_of_work_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#635BFF] hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Proof of Work
                </a>
              )}
            </TabsContent>

            <TabsContent value="requirements" className="p-5 sm:p-6">
              {requiredDocs.length > 0 ? (
                <ul className="space-y-2">
                  {requiredDocs.map((doc, i) => (
                    <li
                      key={doc}
                      className="flex items-start gap-2.5 rounded-xl border border-[#F1F5F9] px-3.5 py-3 text-sm text-[#475569]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#635BFF]">
                        {i + 1}
                      </span>
                      {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#94A3B8]">
                  Requirements will be shared during order placement.
                </p>
              )}
            </TabsContent>

            <TabsContent value="faq" className="p-5 sm:p-6">
              {faqs.length > 0 ? (
                <div className="divide-y divide-[#F1F5F9]">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-sm font-semibold text-[#0F172A]">{faq.question}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#94A3B8]">No FAQs added for this service yet.</p>
              )}
            </TabsContent>

            <TabsContent value="terms" className="p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-[#64748B]">
                {service.terms_conditions ||
                  "Standard platform terms apply. Third-party approvals are not guaranteed."}
              </p>
            </TabsContent>
          </Tabs>

          {/* Recent listings — below tabs */}
          {recentListings.length > 0 && (
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <SectionTitle>Recent Successful Listings</SectionTitle>
                <Link href="/partner/orders" className="text-xs font-semibold text-[#635BFF] hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {recentListings.map((item, i) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-3.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          LISTING_AVATAR_COLORS[i % LISTING_AVATAR_COLORS.length]
                        )}
                      >
                        {(item.token_symbol || item.project_name).slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0F172A]">{item.project_name}</p>
                        <p className="text-[11px] text-[#94A3B8]">Listed on {categoryName}</p>
                        <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                          {new Date(item.completed_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="mt-2.5 inline-flex rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-semibold text-[#059669]">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-sm font-bold text-[#0F172A]">Service Summary</h3>
            <dl className="mt-1">
              <SummaryRow icon={Layers} label="Category" value={categoryName} />
              <SummaryRow icon={Clock} label="Estimated TAT" value={service.estimated_tat} />
              <SummaryRow icon={CreditCard} label="Payment Terms" value={service.payment_terms} />
              <SummaryRow icon={FileText} label="Listing Type" value={service.listing_type} />
              <SummaryRow icon={Network} label="Networks" value={service.networks} />
              <SummaryRow
                icon={RotateCcw}
                label="Refund Policy"
                value={service.refund_policy || "Non-Refundable"}
              />
              <SummaryRow icon={Headphones} label="Support" value="24/7 Telegram Support" />
            </dl>
          </div>

          <div
            id="order-section"
            className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"
          >
            <h3 className="text-sm font-bold text-[#0F172A]">Pricing & Earnings</h3>

            {service.pricing_model === "fixed" && total != null ? (
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-[#64748B]">
                  <dt>Service Price</dt>
                  <dd className="font-medium text-[#0F172A]">{formatCurrency(servicePrice)}</dd>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <dt>Platform Fee ({platformFeePercent}%)</dt>
                  <dd className="font-medium text-[#0F172A]">{formatCurrency(platformFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-[#F1F5F9] pt-2.5">
                  <dt className="font-bold text-[#0F172A]">Total Amount</dt>
                  <dd className="text-base font-bold text-[#635BFF]">{formatCurrency(total)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-lg font-bold text-[#0F172A]">{meta.priceLabel}</p>
            )}

            {meta.commissionLabel && (
              <div className="mt-4 rounded-xl bg-[#ECFDF5] px-3 py-2.5 text-center text-sm">
                <span className="text-[#64748B]">Your Earnings ({service.commission_value}%): </span>
                <span className="font-bold text-[#059669]">{meta.commissionLabel}</span>
              </div>
            )}

            <div className="mt-4 border-t border-[#F1F5F9] pt-4">
              {projects.length > 0 ? (
                <OrderForm service={service} projects={projects} defaultProjectId={defaultProjectId} />
              ) : (
                <div className="space-y-2 text-center">
                  <p className="text-xs text-[#64748B]">Create a project to place an order</p>
                  <Button className="w-full rounded-xl bg-[#635BFF] hover:bg-[#5248E6]" asChild>
                    <Link href="/partner/projects/new">Create Project</Link>
                  </Button>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-[#94A3B8]">
              Need this service for multiple tokens? Contact your manager for custom pricing.
            </p>

            {managerTelegramLink && (
              <a
                href={managerTelegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] text-sm font-semibold text-[#2563EB] transition-colors hover:bg-[#DBEAFE]"
              >
                Message on Telegram
              </a>
            )}
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
            <p className="text-xs leading-relaxed text-[#475569]">
              <span className="font-semibold text-[#2563EB]">Safe & Secure:</span> Your payment and
              data are 100% secure with us.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
