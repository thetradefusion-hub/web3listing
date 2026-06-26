import { createClient } from "@/lib/supabase/server";
import { AdminUsersCatalog } from "@/components/admin/admin-users-catalog";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, company_name, country, kyc_status, created_at, telegram_username")
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
    <AdminUsersCatalog
      users={users || []}
      projectCounts={projectCounts}
      orderCounts={orderCounts}
    />
  );
}
