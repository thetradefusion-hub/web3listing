import { createClient } from "@/lib/supabase/server";
import { CreateAgentDialog } from "@/components/admin/create-agent-dialog";
import { AgentActions } from "@/components/admin/agent-actions";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  kycStatusVariant,
  AdminEmptyState,
} from "@/components/admin/ui";

export default async function AdminAgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Agent Management"
        description="Create and manage B2B agent accounts"
        action={<CreateAgentDialog />}
      />

      {agents && agents.length > 0 ? (
        <div className="space-y-3">
          {agents.map((agent) => (
            <AdminPanel key={agent.id}>
              <AdminPanelBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                      {(agent.full_name || agent.email).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{agent.full_name || agent.email}</p>
                      <p className="text-sm text-slate-500">
                        {agent.email} · {agent.company_name || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AdminBadge variant={kycStatusVariant(agent.kyc_status)}>
                      KYC: {agent.kyc_status}
                    </AdminBadge>
                    {agent.telegram_username && (
                      <AdminBadge variant="info">{agent.telegram_username}</AdminBadge>
                    )}
                    <AgentActions agentId={agent.id} email={agent.email} kycStatus={agent.kyc_status} />
                  </div>
                </div>
              </AdminPanelBody>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No agents yet" description="Create your first agent account to get started." />
      )}
    </AdminPageShell>
  );
}
