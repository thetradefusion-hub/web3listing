import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Megaphone,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { CUSTOM_REQUIREMENT_STATUS_LABELS } from "@/lib/constants";
import { PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { Button } from "@/components/ui/button";
import {
  PartnerPageShell,
  PartnerPageHeader,
  PartnerPanel,
  PartnerPanelBody,
  PartnerBadge,
} from "@/components/user/ui";
import { cn } from "@/lib/utils";
import type { CustomRequirement, CustomRequirementStatus } from "@/types/database";
import type { LucideIcon } from "lucide-react";

type RequirementRow = CustomRequirement & {
  projects?: { project_name: string; token_symbol: string } | { project_name: string; token_symbol: string }[] | null;
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "Exchange Listing": Building2,
  "Marketing & PR": Megaphone,
  "Market Making": TrendingUp,
  "Smart Contract Audit": ShieldCheck,
  "Wallet Integration": Wallet,
  "Community Growth": Sparkles,
  "Data Platform (CMC/CG)": FileText,
  Other: ClipboardList,
};

function statusVariant(status: CustomRequirementStatus): "success" | "warning" | "info" | "danger" | "muted" {
  if (status === "accepted" || status === "quoted") return "success";
  if (status === "under_review") return "info";
  if (status === "rejected") return "danger";
  if (status === "submitted") return "warning";
  return "muted";
}

function relProject(projects: RequirementRow["projects"]) {
  if (!projects) return null;
  return Array.isArray(projects) ? projects[0] : projects;
}

function RequirementCard({ req }: { req: RequirementRow }) {
  const project = relProject(req.projects);
  const Icon = SERVICE_ICONS[req.service_type] || ClipboardList;
  const hasQuote = req.quoted_price != null && req.quote_status === "sent";

  return (
    <Link href={`/user/custom-requirements/${req.id}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/25 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-px">
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2 opacity-80" aria-hidden />

        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
          <div className="flex min-w-0 flex-1 gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/15 sm:size-12">
              <Icon className="size-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-foreground sm:text-base">{req.title}</h3>
                <PartnerBadge variant={statusVariant(req.status)}>
                  {CUSTOM_REQUIREMENT_STATUS_LABELS[req.status] || req.status}
                </PartnerBadge>
              </div>
              <p className="mt-1 text-xs font-medium text-primary/90 sm:text-sm">{req.service_type}</p>
              {project ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {project.project_name} · {project.token_symbol}
                </p>
              ) : null}
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {req.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(req.created_at).toLocaleDateString()}
                </span>
                {req.budget_range ? (
                  <span className="inline-flex items-center gap-1">
                    <DollarSign className="size-3" />
                    {req.budget_range}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:pl-2">
            {hasQuote ? (
              <div className="text-left sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Quote</p>
                <p className="text-lg font-bold text-chart-2">${Number(req.quoted_price).toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground sm:max-w-[120px] sm:text-right">
                {req.status === "submitted" ? "Awaiting review" : "View details"}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100 sm:opacity-100">
              Open
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function HowItWorksStrip() {
  const steps = [
    { n: "1", title: "Submit", desc: "Describe your bespoke Web3 need" },
    { n: "2", title: "Review", desc: "Our team evaluates scope & timeline" },
    { n: "3", title: "Quote", desc: "Receive a tailored price proposal" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.n}
          className="rounded-xl border border-border/80 bg-muted/20 px-4 py-3 text-center sm:text-left"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
            {step.n}
          </span>
          <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function CustomRequirementsListView({ requirements }: { requirements: RequirementRow[] }) {
  const pending = requirements.filter((r) => r.status === "submitted" || r.status === "under_review").length;
  const quoted = requirements.filter((r) => r.status === "quoted").length;
  const accepted = requirements.filter((r) => r.status === "accepted").length;

  return (
    <PartnerPageShell>
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-chart-2/5 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Bespoke services</p>
            <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">Need something custom?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Request tailored listing, marketing, audit, or growth work — we&apos;ll review and send a quotation.
            </p>
          </div>
          <Button asChild size="lg" className="h-11 shrink-0 rounded-xl font-semibold shadow-md">
            <Link href="/user/custom-requirements/new">
              <Plus className="mr-2 size-4" />
              New requirement
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <PartnerPageHeader
          title="Custom Requirements"
          description="Track your bespoke requests and quotations"
        />
      </div>

      {requirements.length > 0 ? (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PartnerStatCard title="Total requests" value={requirements.length} icon={ClipboardList} color="purple" />
            <PartnerStatCard title="In review" value={pending} icon={Clock} color="orange" />
            <PartnerStatCard title="Quotes received" value={quoted} icon={DollarSign} color="green" />
            <PartnerStatCard title="Accepted" value={accepted} icon={Sparkles} color="blue" />
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <RequirementCard key={req.id} req={req} />
            ))}
          </div>
        </>
      ) : (
        <PartnerPanel className="overflow-hidden">
          <PartnerPanelBody className="py-10 sm:py-14">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <ClipboardList className="size-8" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">No custom requirements yet</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                When catalog services don&apos;t fit your needs, submit a detailed request and our team will prepare a
                custom quote.
              </p>
              <Button asChild className="mt-6 h-11 rounded-xl px-6 font-semibold">
                <Link href="/user/custom-requirements/new">Submit your first request</Link>
              </Button>
            </div>
            <div className="mx-auto mt-10 max-w-2xl">
              <HowItWorksStrip />
            </div>
          </PartnerPanelBody>
        </PartnerPanel>
      )}
    </PartnerPageShell>
  );
}

export function CustomRequirementFormTips({ className }: { className?: string }) {
  const tips = [
    "Include target exchanges, platforms, or regions",
    "Share links to your website, docs, or deck",
    "Mention deadlines and launch milestones",
    "Attach budget expectations if you have them",
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <HowItWorksStrip />
      <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Tips for a faster quote</p>
        <ul className="mt-3 space-y-2">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-chart-2" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
