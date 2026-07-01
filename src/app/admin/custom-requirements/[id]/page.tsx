import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CUSTOM_REQUIREMENT_STATUS_LABELS } from "@/lib/constants";
import { CustomRequirementActions } from "@/components/admin/custom-requirement-actions";
import { CustomRequirementQuoteBuilder } from "@/components/admin/custom-requirement-quote-builder";
import { Button } from "@/components/ui/button";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  AdminBadge,
  rel,
} from "@/components/admin/ui";
import type { CustomRequirementStatus } from "@/types/database";

function statusVariant(status: CustomRequirementStatus): "success" | "warning" | "info" | "danger" | "muted" {
  if (status === "accepted" || status === "quoted") return "success";
  if (status === "under_review") return "info";
  if (status === "rejected") return "danger";
  if (status === "submitted") return "warning";
  return "muted";
}

export default async function AdminCustomRequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: requirement } = await supabase
    .from("custom_requirements")
    .select(
      "*, profiles!custom_requirements_user_id_fkey(full_name, email, company_name, telegram_username), projects(project_name, token_symbol)"
    )
    .eq("id", id)
    .single();

  if (!requirement) notFound();

  const user = rel(requirement.profiles);
  const project = rel(requirement.projects);

  return (
    <AdminPageShell className="mx-auto max-w-4xl">
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild className="rounded-lg">
          <Link href="/admin/custom-requirements">← All requirements</Link>
        </Button>
      </div>

      <AdminPageHeader
        title={requirement.title}
        description={`Submitted by ${user?.full_name || user?.email || "Unknown user"}`}
        badge={
          <AdminBadge variant={statusVariant(requirement.status)}>
            {CUSTOM_REQUIREMENT_STATUS_LABELS[requirement.status] || requirement.status}
          </AdminBadge>
        }
      />

      <div className="space-y-4">
        <AdminPanel>
          <AdminPanelHeader title="User details" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            {[
              ["Name", user?.full_name],
              ["Email", user?.email],
              ["Company", user?.company_name],
              ["Telegram", requirement.telegram || user?.telegram_username],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p>
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Requirement" />
          <AdminPanelBody className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Service type", requirement.service_type],
                ["Project", project ? `${project.project_name} (${project.token_symbol})` : "—"],
                ["Budget", requirement.budget_range],
                ["Timeline", requirement.timeline],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {requirement.description}
              </p>
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Review status" />
          <AdminPanelBody className="space-y-4">
            <CustomRequirementActions requirementId={requirement.id} status={requirement.status} />
            {requirement.admin_notes ? (
              <p className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
                <span className="font-semibold">Admin notes: </span>
                {requirement.admin_notes}
              </p>
            ) : null}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader
            title="Quotation"
            description={
              requirement.quote_status === "sent"
                ? `Quote sent — $${Number(requirement.quoted_price).toFixed(2)}`
                : "Build and send a custom price to the user"
            }
          />
          <AdminPanelBody>
            {requirement.quote_status === "accepted" ? (
              <p className="text-sm text-emerald-700">
                User accepted the quote of ${Number(requirement.quoted_price).toFixed(2)}.
              </p>
            ) : (
              <CustomRequirementQuoteBuilder
                requirementId={requirement.id}
                existingPrice={requirement.quoted_price}
                existingNotes={requirement.quote_notes}
              />
            )}
          </AdminPanelBody>
        </AdminPanel>
      </div>
    </AdminPageShell>
  );
}
