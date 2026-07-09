import Link from "next/link";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { ProjectForm } from "@/components/partner/project-form";
import { ProjectActions } from "@/components/partner/projects/project-actions";
import { PartnerPageShell, projectStatusVariant, PartnerBadge } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function PortalProjectEditView({
  project,
  orderCount,
  basePath,
}: {
  project: Project;
  orderCount: number;
  basePath: string;
}) {
  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={basePath} className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <Link href={`${basePath}/projects`} className="transition hover:text-primary">
            Projects
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Edit</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <ProjectActions
            project={project}
            orderCount={orderCount}
            basePath={basePath}
          />
          <Button variant="outline" size="sm" className="h-9 rounded-xl font-semibold" asChild>
            <Link href={`${basePath}/projects/${project.id}`}>
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      <Card
        size="sm"
        className="relative gap-0 overflow-hidden border-primary/15 bg-gradient-to-br from-card via-card to-primary/5 py-0"
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-chart-4" aria-hidden />
        <CardContent className="flex flex-col gap-3 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <FolderKanban className="size-5" strokeWidth={2.25} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  Edit {project.project_name}
                </h1>
                <PartnerBadge variant={projectStatusVariant(project.status)}>
                  {statusLabel(project.status)}
                </PartnerBadge>
              </div>
              <p className="text-sm text-muted-foreground">Update project details and save your changes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProjectForm project={project} compact fullPage basePath={basePath} />
    </PartnerPageShell>
  );
}
