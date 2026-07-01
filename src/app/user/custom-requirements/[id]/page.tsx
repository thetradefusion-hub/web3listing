import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { CUSTOM_REQUIREMENT_STATUS_LABELS } from "@/lib/constants";
import { CustomRequirementQuoteSection } from "@/components/user/custom-requirement-quote-section";
import { Button } from "@/components/ui/button";
import {
  PartnerPageShell,
  PartnerPageHeader,
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
    <PartnerPageShell className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="rounded-lg">
          <Link href="/user/custom-requirements">
            <ArrowLeft className="mr-2 size-4" />
            All requirements
          </Link>
        </Button>
      </div>

      <PartnerPageHeader
        title={requirement.title}
        description={`Submitted ${new Date(requirement.created_at).toLocaleString()}`}
        badge={
          <PartnerBadge variant={statusVariant(requirement.status)}>
            {CUSTOM_REQUIREMENT_STATUS_LABELS[requirement.status] || requirement.status}
          </PartnerBadge>
        }
      />

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
