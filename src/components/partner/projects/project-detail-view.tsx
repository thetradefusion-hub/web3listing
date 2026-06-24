import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronRight,
  Circle,
  ExternalLink,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/partner/project-form";
import { CopyTextButton } from "@/components/partner/projects/copy-text-button";
import { ProjectRecommendationsGrid } from "@/components/partner/projects/project-recommendations-grid";
import { PartnerBadge, projectStatusVariant } from "@/components/partner/ui";
import {
  WHY_RECOMMENDATIONS,
  buildRoadmap,
  computeGrowthPhases,
} from "@/lib/project-recommendations";
import { getServiceCardMeta } from "@/lib/service-catalog";
import type { Order, Project, Service } from "@/types/database";
import { cn } from "@/lib/utils";

const WHY_ICONS = [TrendingUp, Shield, Users, BarChart3];

function GrowthRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28">
      <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112" aria-hidden>
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="#635BFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-[#0F172A] sm:text-2xl">{score}%</p>
        <p className="text-[10px] font-medium text-[#94A3B8]">Overall Score</p>
      </div>
    </div>
  );
}

export function ProjectDetailView({
  project,
  orders,
  services,
  managerTelegramLink,
}: {
  project: Project;
  orders: (Order & {
    services?: Service & { service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null };
  })[];
  services: (Service & {
    service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  })[];
  managerTelegramLink?: string | null;
}) {
  if (project.status === "draft") {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg" asChild>
            <Link href="/partner/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Edit Project</h1>
            <p className="text-sm text-[#64748B]">Complete your project before ordering services</p>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
          <ProjectForm project={project} />
        </div>
      </div>
    );
  }

  const { phases, score } = computeGrowthPhases(project, orders);
  const orderedServiceIds = new Set(orders.map((o) => o.service_id));
  const roadmap = buildRoadmap(services, orderedServiceIds);

  const description =
    project.team_info ||
    `${project.token_name} on ${project.blockchain_network}. Build visibility, trust, and growth with curated Web3 listing services.`;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
            <Link href="/partner/projects" aria-label="Back to projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">Recommended Next Steps</h1>
            <nav className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#94A3B8] sm:text-sm">
              <Link href="/partner" className="hover:text-[#635BFF]">Dashboard</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <Link href="/partner/projects" className="hover:text-[#635BFF]">My Projects</Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-[#64748B]">{project.project_name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Project hero */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-sm font-bold text-white shadow-md sm:h-16 sm:w-16">
              {project.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                project.token_symbol?.slice(0, 2).toUpperCase() || "TK"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#0F172A] sm:text-xl">
                  {project.project_name}{" "}
                  <span className="font-semibold text-[#64748B]">({project.token_symbol})</span>
                </h2>
                <PartnerBadge variant={projectStatusVariant(project.status)}>{project.status}</PartnerBadge>
              </div>
              <p className="mt-1 text-sm text-[#64748B]">{project.blockchain_network}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#64748B] sm:line-clamp-3">
                {description}
              </p>
            </div>
          </div>

          <Button variant="outline" className="h-9 shrink-0 rounded-lg text-xs sm:text-sm" asChild>
            <Link href={`/partner/services?project=${project.id}`}>
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Browse All Services
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-3 border-t border-[#F1F5F9] pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Token Symbol", project.token_symbol],
            ["Token Name", project.token_name],
            ["Network", project.blockchain_network],
            [
              "Contract",
              project.contract_address ? (
                <span className="flex min-w-0 items-center gap-1">
                  <span className="truncate font-mono text-xs sm:text-sm">
                    {project.contract_address.slice(0, 10)}...{project.contract_address.slice(-6)}
                  </span>
                  <CopyTextButton text={project.contract_address} />
                </span>
              ) : (
                "—"
              ),
            ],
          ].map(([label, value]) => (
            <div key={String(label)} className="min-w-0 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-3.5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">{label}</p>
              <div className="mt-1 text-sm font-semibold text-[#0F172A]">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Growth overview */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#0F172A]">Project Growth Overview</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Track your project journey from setup to growth and scaling.
            </p>

            <div className="mt-5 overflow-x-auto pb-1">
              <div className="flex min-w-[640px] items-start justify-between gap-1 lg:min-w-0">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="flex flex-1 flex-col items-center text-center">
                    <div className="flex w-full items-center">
                      {index > 0 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1",
                            phase.status !== "pending" ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                          phase.status === "completed"
                            ? "border-[#10B981] bg-[#ECFDF5] text-[#059669]"
                            : phase.status === "in_progress"
                              ? "border-[#635BFF] bg-[#EEF2FF] text-[#635BFF]"
                              : "border-[#E2E8F0] bg-white text-[#CBD5E1]"
                        )}
                      >
                        {phase.status === "completed" ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        ) : phase.status === "in_progress" ? (
                          <Circle className="h-2 w-2 fill-current" />
                        ) : null}
                      </span>
                      {index < phases.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1",
                            phases[index + 1]?.status !== "pending" ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                          )}
                        />
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-[10px] font-semibold leading-tight sm:text-[11px]",
                        phase.status === "pending" ? "text-[#94A3B8]" : "text-[#0F172A]"
                      )}
                    >
                      {phase.label}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-[9px] font-medium capitalize",
                        phase.status === "completed"
                          ? "text-[#059669]"
                          : phase.status === "in_progress"
                            ? "text-[#635BFF]"
                            : "text-[#CBD5E1]"
                      )}
                    >
                      {phase.status === "completed"
                        ? "Completed"
                        : phase.status === "in_progress"
                          ? "In Progress"
                          : "Pending"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GrowthRing score={score} />
        </div>
      </section>

      {/* Recommendations grid */}
      <ProjectRecommendationsGrid projectId={project.id} services={services} />

      {/* Bottom: why + roadmap */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-bold text-[#0F172A]">Why These Recommendations?</h2>
          <div className="mt-4 space-y-3">
            {WHY_RECOMMENDATIONS.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <div key={item.title} className="flex gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      item.tone
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-bold text-[#0F172A]">Your Personalized Roadmap</h2>
          <div className="mt-4 space-y-3">
            {roadmap.length > 0 ? (
              roadmap.map((item) => {
                const meta = getServiceCardMeta(item.service);
                return (
                  <div
                    key={item.service.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[#F1F5F9] bg-[#FAFBFC] px-3.5 py-3"
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#635BFF]">
                        {item.step}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0F172A]">
                          {item.step}. {item.service.name}
                        </p>
                        <p className="text-[11px] font-medium text-[#059669]">{item.boost}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-md border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-semibold text-[#C2410C]">
                        Pending
                      </span>
                      <Link
                        href={`/partner/services/${item.service.slug}?project=${project.id}`}
                        className="text-[11px] font-semibold text-[#635BFF] hover:underline"
                      >
                        {meta.ctaLabel}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[#94A3B8]">You have explored all recommended services for now.</p>
            )}
          </div>
        </section>
      </div>

      {/* Consultation banner */}
      <section className="rounded-2xl border border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] p-4 sm:flex sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="font-bold text-[#1E40AF]">Need help choosing the right services?</p>
          <p className="mt-1 text-sm text-[#3B82F6]">
            Book a free consultation with your dedicated account manager.
          </p>
        </div>
        {managerTelegramLink ? (
          <Button className="mt-3 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:mt-0 sm:w-auto" asChild>
            <a href={managerTelegramLink} target="_blank" rel="noopener noreferrer">
              Book Free Consultation
            </a>
          </Button>
        ) : (
          <Button className="mt-3 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:mt-0 sm:w-auto" asChild>
            <Link href="/partner/support">Book Free Consultation</Link>
          </Button>
        )}
      </section>
    </div>
  );
}
