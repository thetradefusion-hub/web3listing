import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { CustomRequirementForm } from "@/components/user/custom-requirement-form";
import { CustomRequirementFormTips } from "@/components/user/custom-requirements/custom-requirements-ui";
import { PartnerPageShell } from "@/components/user/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewCustomRequirementPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, project_name, token_symbol")
    .eq("agent_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/user" className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <Link href="/user/custom-requirements" className="transition hover:text-primary">
            Custom Requirements
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">New</span>
        </nav>

        <Button variant="outline" size="sm" className="h-9 rounded-xl font-semibold" asChild>
          <Link href="/user/custom-requirements">
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
              <ClipboardList className="size-5" strokeWidth={2.25} />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Submit your requirement</h1>
              <p className="text-sm text-muted-foreground">Describe your bespoke Web3 need for a tailored quote</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <CustomRequirementForm projects={projects || []} />

        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <CustomRequirementFormTips />
          </div>
        </aside>
      </div>

      <div className="lg:hidden">
        <CustomRequirementFormTips />
      </div>
    </PartnerPageShell>
  );
}
