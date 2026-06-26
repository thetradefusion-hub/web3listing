import { createClient } from "@/lib/supabase/server";
import { AdminPartnersCatalog } from "@/components/admin/admin-partners-catalog";

export default async function AdminPartnersPage() {
  const supabase = await createClient();
  const { data: partners } = await supabase
    .from("profiles")
    .select("id, full_name, email, company_name, country, kyc_status, created_at, telegram_username")
    .eq("role", "agent")
    .order("created_at", { ascending: false });

  const partnerIds = partners?.map((p) => p.id) || [];
  const { data: orders } = partnerIds.length
    ? await supabase.from("orders").select("agent_id").in("agent_id", partnerIds)
    : { data: [] as { agent_id: string }[] };

  const orderCounts: Record<string, number> = {};
  for (const o of orders || []) {
    orderCounts[o.agent_id] = (orderCounts[o.agent_id] || 0) + 1;
  }

  return <AdminPartnersCatalog partners={partners || []} orderCounts={orderCounts} />;
}
