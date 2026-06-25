import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  Globe,
  Layers,
  FilePen,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerBadge, PartnerPageShell, projectStatusVariant } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getServiceAccent, getServiceLogoColor } from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

function statusLabel(status: Project["status"]) {
  const labels: Record<Project["status"], string> = {
    draft: "Draft",
    submitted: "In Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status] || status;
}

function ProjectCard({
  project,
  orderCount,
  basePath,
}: {
  project: Project;
  orderCount: number;
  basePath: string;
}) {
  const accent = getServiceAccent(project.project_name);
  const logoColor = getServiceLogoColor(project.project_name);
  const initials = (project.token_symbol || project.project_name).slice(0, 2).toUpperCase();

  return (
    <Link href={`${basePath}/projects/${project.id}`} className="group block h-full">
      <Card
        size="sm"
        className="relative h-full overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 py-0 transition-all duration-300 hover:border-primary/25 hover:shadow-md"
      >
        <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />

        <CardContent className="flex h-full flex-col gap-3 p-4 pl-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ring-2 ring-border/50",
                logoColor
              )}
            >
              {project.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.logo_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-xs font-bold">{initials}</span>
              )}
            </div>
            <PartnerBadge variant={projectStatusVariant(project.status)}>
              {statusLabel(project.status)}
            </PartnerBadge>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary">
              {project.project_name}
            </h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {project.token_name}{" "}
              <span className="font-semibold text-foreground">({project.token_symbol})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Layers className="size-3 shrink-0" strokeWidth={2} />
              {project.blockchain_network}
            </span>
            {orderCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <ShoppingBag className="size-3 shrink-0" strokeWidth={2} />
                {orderCount} {orderCount === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
            <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
            <div className="flex items-center gap-2">
              {project.website_url ? (
                <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-label="Has website" />
              ) : null}
              <span className="inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight className="size-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PartnerProjectsView({
  projects,
  orderCountByProject,
  basePath = "/partner",
}: {
  projects: Project[];
  orderCountByProject: Record<string, number>;
  basePath?: string;
}) {
  const total = projects.length;
  const approved = projects.filter((p) => p.status === "approved").length;
  const inReview = projects.filter((p) => p.status === "submitted").length;
  const draft = projects.filter((p) => p.status === "draft").length;

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={basePath} className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">My Projects</span>
        </nav>

        <Button asChild className="h-9 rounded-xl font-semibold shadow-sm">
          <Link href={`${basePath}/projects/new`}>
            <Plus data-icon="inline-start" />
            New Project
          </Link>
        </Button>
      </div>

      {total > 0 && (
        <section aria-label="Project stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <PartnerStatCard title="Total Projects" value={total} subtitle="All projects" icon={FolderKanban} color="blue" />
          <PartnerStatCard
            title="Approved"
            value={approved}
            subtitle="Ready for services"
            icon={CheckCircle2}
            color="green"
          />
          <PartnerStatCard
            title="In Review"
            value={inReview}
            subtitle="Awaiting approval"
            icon={Clock}
            color="orange"
          />
          <PartnerStatCard title="Drafts" value={draft} subtitle="Incomplete" icon={FilePen} color="purple" />
        </section>
      )}

      {total > 0 ? (
        <section
          aria-label="Project list"
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              orderCount={orderCountByProject[project.id] || 0}
              basePath={basePath}
            />
          ))}
        </section>
      ) : (
        <Empty className="rounded-2xl border-dashed py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 bg-primary/10 text-primary">
              <FolderKanban />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first token project to start ordering Web3 listing services.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="rounded-xl font-semibold">
              <Link href={`${basePath}/projects/new`}>
                <Plus data-icon="inline-start" />
                Create Project
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </PartnerPageShell>
  );
}
