import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  kycStatusVariant,
  AdminEmptyState,
} from "@/components/admin/ui";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  const userIds = users?.map((u) => u.id) || [];
  const [{ data: projects }, { data: orders }] = await Promise.all([
    userIds.length
      ? supabase.from("projects").select("agent_id").in("agent_id", userIds)
      : Promise.resolve({ data: [] as { agent_id: string }[] }),
    userIds.length
      ? supabase.from("orders").select("agent_id").in("agent_id", userIds)
      : Promise.resolve({ data: [] as { agent_id: string }[] }),
  ]);

  const projectCounts: Record<string, number> = {};
  const orderCounts: Record<string, number> = {};
  for (const p of projects || []) {
    projectCounts[p.agent_id] = (projectCounts[p.agent_id] || 0) + 1;
  }
  for (const o of orders || []) {
    orderCounts[o.agent_id] = (orderCounts[o.agent_id] || 0) + 1;
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Users"
        description="Self-service accounts that order services without partner commission"
      />

      {users && users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user) => (
            <AdminPanel key={user.id}>
              <AdminPanelBody>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                      {(user.full_name || user.email).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.full_name || user.email}</p>
                      <p className="text-sm text-slate-500">
                        {user.email} · {user.company_name || user.country || "—"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <AdminBadge variant={kycStatusVariant(user.kyc_status)}>
                      KYC: {user.kyc_status}
                    </AdminBadge>
                    <AdminBadge variant="info">{projectCounts[user.id] || 0} projects</AdminBadge>
                    <AdminBadge variant="info">{orderCounts[user.id] || 0} orders</AdminBadge>
                    <Link
                      href={`/admin/orders?owner=${user.id}`}
                      className="text-sm font-medium text-[#635BFF] hover:underline"
                    >
                      View orders
                    </Link>
                  </div>
                </div>
              </AdminPanelBody>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmptyState title="No users yet" description="Users will appear here after self-service signup." />
      )}
    </AdminPageShell>
  );
}
