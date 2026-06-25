import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PartnerOrdersView } from "@/components/partner/orders/partner-orders-view";

export default async function PartnerOrdersPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, services(name, estimated_tat), projects(project_name, token_symbol)")
    .eq("agent_id", profile!.id)
    .order("created_at", { ascending: false });

  const orderIds = orders?.map((o) => o.id) || [];
  const [{ data: quotations }, { data: payments }] = await Promise.all([
    orderIds.length
      ? supabase.from("quotations").select("order_id, client_price").in("order_id", orderIds)
      : Promise.resolve({ data: [] as { order_id: string; client_price: number }[] }),
    orderIds.length
      ? supabase.from("payments").select("order_id, amount").in("order_id", orderIds)
      : Promise.resolve({ data: [] as { order_id: string; amount: number }[] }),
  ]);

  const amountByOrder: Record<string, number> = {};
  for (const id of orderIds) {
    const quote = quotations?.find((q) => q.order_id === id)?.client_price;
    const payment = payments?.find((p) => p.order_id === id)?.amount;
    const amount = quote ?? payment ?? 0;
    if (amount) amountByOrder[id] = Number(amount);
  }

  return <PartnerOrdersView orders={orders || []} amountByOrder={amountByOrder} />;
}
