import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CUSTOM_REQUIREMENT_STATUS_LABELS } from "@/lib/constants";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
} from "@/components/admin/ui";
import type { CustomRequirementStatus } from "@/types/database";

function statusVariant(status: CustomRequirementStatus): "success" | "warning" | "info" | "danger" | "muted" {
  if (status === "accepted" || status === "quoted") return "success";
  if (status === "under_review") return "info";
  if (status === "rejected") return "danger";
  if (status === "submitted") return "warning";
  return "muted";
}

export default async function AdminCustomRequirementsPage() {
  const supabase = await createClient();

  const { data: requirements } = await supabase
    .from("custom_requirements")
    .select("*, profiles!custom_requirements_user_id_fkey(full_name, email, company_name)")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Custom Requirements"
        description="User-submitted bespoke requests — review and send quotations"
      />

      {requirements && requirements.length > 0 ? (
        <div className="space-y-3">
          {requirements.map((req) => {
            const user = Array.isArray(req.profiles) ? req.profiles[0] : req.profiles;
            return (
              <Link key={req.id} href={`/admin/custom-requirements/${req.id}`}>
                <AdminPanel className="transition-colors hover:border-violet-200">
                  <AdminPanelBody className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{req.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {user?.full_name || user?.email} · {req.service_type}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{req.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <AdminBadge variant={statusVariant(req.status)}>
                        {CUSTOM_REQUIREMENT_STATUS_LABELS[req.status] || req.status}
                      </AdminBadge>
                      <span className="text-xs text-slate-400">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </AdminPanelBody>
                </AdminPanel>
              </Link>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          title="No custom requirements"
          description="When users submit bespoke requests from their dashboard, they will appear here."
        />
      )}
    </AdminPageShell>
  );
}
