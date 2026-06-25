import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Check,
  Circle,
  ExternalLink,
  Layers,
  Map,
  MessageCircle,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectForm } from "@/components/partner/project-form";
import { CopyTextButton } from "@/components/partner/projects/copy-text-button";
import { ProjectRecommendationsGrid } from "@/components/partner/projects/project-recommendations-grid";
import { DashboardPanel } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge, projectStatusVariant } from "@/components/partner/ui";
import {
  WHY_RECOMMENDATIONS,
  buildRoadmap,
  computeGrowthPhases,
} from "@/lib/project-recommendations";
import { getServiceAccent, getServiceCardMeta, getServiceLogoColor } from "@/lib/service-catalog";
import type { Order, Project, Service } from "@/types/database";
import { cn } from "@/lib/utils";

const WHY_ICONS = [TrendingUp, Shield, Users, BarChart3];

function statusLabel(status: Project["status"]) {
  const labels: Record<Project["status"], string> = {
    draft: "Draft",
    submitted: "In Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status] || status;
}

function GrowthRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-28 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112" aria-hidden>
        <circle cx="56" cy="56" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold tabular-nums text-foreground">{score}%</p>
        <p className="text-[10px] font-medium text-muted-foreground">Growth Score</p>
      </div>
    </div>
  );
}

function MetaTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-muted/30 px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

export function ProjectDetailView({
  project,
  orders,
  services,
  managerTelegramLink,
  basePath = "/partner",
}: {
  project: Project;
  orders: (Order & {
    services?: Service & { service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null };
  })[];
  services: (Service & {
    service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  })[];
  managerTelegramLink?: string | null;
  basePath?: string;
}) {
  if (project.status === "draft") {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={`${basePath}/projects`} className="transition hover:text-primary">
            My Projects
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Edit Project</span>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="size-9 rounded-xl" asChild>
            <Link href={`${basePath}/projects`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Complete your project</h1>
            <p className="text-sm text-muted-foreground">Fill in details before ordering services</p>
          </div>
        </div>
        <DashboardPanel title="Project details" icon={Layers} iconColor="blue">
          <ProjectForm project={project} basePath={basePath} />
        </DashboardPanel>
      </div>
    );
  }

  const { phases, score } = computeGrowthPhases(project, orders);
  const orderedServiceIds = new Set(orders.map((o) => o.service_id));
  const roadmap = buildRoadmap(services, orderedServiceIds);
  const accent = getServiceAccent(project.project_name);
  const logoColor = getServiceLogoColor(project.project_name);
  const initials = (project.token_symbol || project.project_name).slice(0, 2).toUpperCase();

  const description =
    project.team_info ||
    `${project.token_name} on ${project.blockchain_network}. Build visibility, trust, and growth with curated Web3 listing services.`;

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={basePath} className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <Link href={`${basePath}/projects`} className="transition hover:text-primary">
            My Projects
          </Link>
          <span aria-hidden>›</span>
          <span className="truncate font-medium text-foreground">{project.project_name}</span>
        </nav>
        <Button variant="outline" size="sm" className="h-9 rounded-xl font-semibold" asChild>
          <Link href="/partner/projects">
            <ArrowLeft data-icon="inline-start" />
            Back
          </Link>
        </Button>
      </div>

      {/* Project hero */}
      <Card size="sm" className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 py-0">
        <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />
        <CardContent className="p-4 pl-5 sm:p-5 sm:pl-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-md ring-2 ring-border/50 sm:size-16",
                  logoColor
                )}
              >
                {project.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.logo_url} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-sm font-bold">{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-bold text-foreground sm:text-xl">
                    {project.project_name}{" "}
                    <span className="font-semibold text-muted-foreground">({project.token_symbol})</span>
                  </h1>
                  <PartnerBadge variant={projectStatusVariant(project.status)}>
                    {statusLabel(project.status)}
                  </PartnerBadge>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Layers className="size-3.5 shrink-0" />
                  {project.blockchain_network}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                  {description}
                </p>
              </div>
            </div>
            <Button className="h-9 shrink-0 rounded-xl font-semibold" asChild>
              <Link href={`${basePath}/services?project=${project.id}`}>
                <ExternalLink data-icon="inline-start" />
                Browse Services
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetaTile label="Token Symbol">{project.token_symbol}</MetaTile>
            <MetaTile label="Token Name">{project.token_name}</MetaTile>
            <MetaTile label="Network">{project.blockchain_network}</MetaTile>
            <MetaTile label="Contract">
              {project.contract_address ? (
                <span className="flex min-w-0 items-center gap-1">
                  <span className="truncate font-mono text-xs">
                    {project.contract_address.slice(0, 10)}...{project.contract_address.slice(-6)}
                  </span>
                  <CopyTextButton text={project.contract_address} />
                </span>
              ) : (
                "—"
              )}
            </MetaTile>
          </div>
        </CardContent>
      </Card>

      {/* Growth overview */}
      <DashboardPanel
        title="Project Growth Overview"
        description="Track your journey from setup to scaling"
        icon={TrendingUp}
        iconColor="green"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1 overflow-x-auto pb-1">
            <div className="flex min-w-[640px] items-start justify-between gap-1 lg:min-w-0">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    {index > 0 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1",
                          phase.status !== "pending" ? "bg-chart-2" : "bg-border"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                        phase.status === "completed"
                          ? "border-chart-2 bg-chart-2/10 text-chart-2"
                          : phase.status === "in_progress"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {phase.status === "completed" ? (
                        <Check className="size-3.5" strokeWidth={2.5} />
                      ) : phase.status === "in_progress" ? (
                        <Circle className="size-2 fill-current" />
                      ) : null}
                    </span>
                    {index < phases.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1",
                          phases[index + 1]?.status !== "pending" ? "bg-chart-2" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-[10px] font-semibold leading-tight sm:text-[11px]",
                      phase.status === "pending" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {phase.label}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[9px] font-medium capitalize",
                      phase.status === "completed"
                        ? "text-chart-2"
                        : phase.status === "in_progress"
                          ? "text-primary"
                          : "text-muted-foreground"
                    )}
                  >
                    {phase.status === "completed"
                      ? "Done"
                      : phase.status === "in_progress"
                        ? "Active"
                        : "Pending"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <GrowthRing score={score} />
        </div>
      </DashboardPanel>

      <ProjectRecommendationsGrid projectId={project.id} services={services} basePath={basePath} />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardPanel title="Why These Recommendations?" icon={Sparkles} iconColor="blue">
          <div className="space-y-3">
            {WHY_RECOMMENDATIONS.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-border bg-muted/20 p-3"
                >
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg ring-1", item.tone)}>
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Your Personalized Roadmap" icon={Map} iconColor="purple">
          <div className="space-y-2.5">
            {roadmap.length > 0 ? (
              roadmap.map((item) => {
                const meta = getServiceCardMeta(item.service);
                return (
                  <div
                    key={item.service.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3.5 py-3"
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {item.step}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{item.service.name}</p>
                        <p className="text-[11px] font-medium text-chart-2">{item.boost}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="rounded-md border border-chart-3/30 bg-chart-3/10 px-2 py-0.5 text-[10px] font-semibold text-chart-3">
                        Pending
                      </span>
                      <Link
                        href={`${basePath}/services/${item.service.slug}?project=${project.id}`}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        {meta.ctaLabel}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                You have explored all recommended services for now.
              </p>
            )}
          </div>
        </DashboardPanel>
      </div>

      <Card size="sm" className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-card to-chart-4/5">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="size-5" />
            </span>
            <div>
              <p className="font-semibold text-foreground">Need help choosing services?</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Book a free consultation with your dedicated account manager.
              </p>
            </div>
          </div>
          {managerTelegramLink ? (
            <Button className="h-10 shrink-0 rounded-xl font-semibold" asChild>
              <a href={managerTelegramLink} target="_blank" rel="noopener noreferrer">
                <Send data-icon="inline-start" />
                Book Consultation
              </a>
            </Button>
          ) : (
            <Button className="h-10 shrink-0 rounded-xl font-semibold" asChild>
              <Link href={`${basePath}/support`}>Contact Support</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
