import Link from "next/link";
import { ArrowLeft, FolderKanban, Layers, ShieldCheck } from "lucide-react";
import { ProjectForm } from "@/components/partner/project-form";
import { PartnerPageShell } from "@/components/partner/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PartnerNewProjectView() {
  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/partner" className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <Link href="/partner/projects" className="transition hover:text-primary">
            Projects
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">New</span>
        </nav>

        <Button variant="outline" size="sm" className="h-9 rounded-xl font-semibold" asChild>
          <Link href="/partner/projects">
            <ArrowLeft data-icon="inline-start" />
            Back
          </Link>
        </Button>
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
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Create new project</h1>
              <p className="text-sm text-muted-foreground">Register your token to unlock marketplace services</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              <Layers className="size-3 text-primary" />
              Token details
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
              <ShieldCheck className="size-3 text-primary" />
              Legal consent
            </span>
          </div>
        </CardContent>
      </Card>

      <ProjectForm compact fullPage />
    </PartnerPageShell>
  );
}
