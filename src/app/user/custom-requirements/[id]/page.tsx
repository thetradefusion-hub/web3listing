import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { CUSTOM_REQUIREMENT_STATUS_LABELS } from "@/lib/constants";
import { CustomRequirementQuoteSection } from "@/components/user/custom-requirement-quote-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PartnerPageShell,
  PartnerPanel,
  PartnerPanelHeader,
  PartnerPanelBody,
  PartnerBadge,
  rel,
} from "@/components/user/ui";
import type { CustomRequirementStatus } from "@/types/database";

function statusVariant(status: CustomRequirementStatus): "success" | "warning" | "info" | "danger" | "muted" {
  if (status === "accepted" || status === "quoted") return "success";
  if (status === "under_review") return "info";
  if (status === "rejected") return "danger";
  if (status === "submitted") return "warning";
  return "muted";
}

export default async function UserCustomRequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: requirement } = await supabase
    .from("custom_requirements")
    .select("*, projects(project_name, token_symbol)")
    .eq("id", id)
    .eq("user_id", profile!.id)
    .single();

  if (!requirement) notFound();

  const project = rel(requirement.projects);

  const fields: [string, string | null | undefined][] = [
    ["Service type", requirement.service_type],
    ["Project", project ? `${project.project_name} (${project.token_symbol})` : null],
    ["Budget", requirement.budget_range],
    ["Timeline", requirement.timeline],
    ["Telegram", requirement.telegram],
  ];

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
          <span className="font-medium text-foreground">Detail</span>
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
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <ClipboardList className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {requirement.title}
                </h1>
                <PartnerBadge variant={statusVariant(requirement.status)}>
                  {CUSTOM_REQUIREMENT_STATUS_LABELS[requirement.status] || requirement.status}
                </PartnerBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Submitted {new Date(requirement.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <CustomRequirementQuoteSection requirement={requirement} />

        <PartnerPanel>
          <PartnerPanelHeader title="Your requirements" />
          <PartnerPanelBody className="space-y-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {requirement.description}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map(([label, value]) =>
                value ? (
                  <div key={label} className="rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                  </div>
                ) : null
              )}
            </div>
          </PartnerPanelBody>
        </PartnerPanel>

        {requirement.quote_status === "accepted" && requirement.quoted_price != null ? (
          <PartnerPanel>
            <PartnerPanelBody>
              <p className="text-sm text-muted-foreground">
                You accepted the quote of{" "}
                <span className="font-semibold text-foreground">
                  ${Number(requirement.quoted_price).toFixed(2)}
                </span>
                . Our team will contact you to proceed with payment and delivery.
              </p>
            </PartnerPanelBody>
          </PartnerPanel>
        ) : null}
      </div>
    </PartnerPageShell>
  );
}
