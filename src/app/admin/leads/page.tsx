import { createClient } from "@/lib/supabase/server";
import { LeadActions } from "@/components/admin/lead-actions";
import type { LeadStatus } from "@/types/database";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
} from "@/components/admin/ui";

function leadVariant(status: string): "success" | "warning" | "info" | "danger" | "muted" {
  if (status === "converted") return "success";
  if (status === "qualified") return "info";
  if (status === "contacted") return "warning";
  if (status === "lost") return "danger";
  return "muted";
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="CRM Leads"
        description="Leads captured from the website contact form"
      />

      {leads && leads.length > 0 ? (
        <div className="space-y-3">
          {leads.map((lead) => (
            <AdminPanel key={lead.id}>
              <AdminPanelBody className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {lead.name} — {lead.email}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {lead.company || "—"} · {lead.telegram || "—"}
                    </p>
                  </div>
                  <AdminBadge variant={leadVariant(lead.status)}>{lead.status}</AdminBadge>
                </div>
                {lead.message && (
                  <p className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
                    {lead.message}
                  </p>
                )}
                <LeadActions leadId={lead.id} status={lead.status as LeadStatus} />
              </AdminPanelBody>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No leads yet" description="Website contact form submissions will appear here." />
      )}
    </AdminPageShell>
  );
}
