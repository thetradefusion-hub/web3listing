import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { AgentOrderDetailView } from "@/components/agent/orders/agent-order-detail-view";
import { AgentPageShell, rel } from "@/components/agent/ui";

export default async function AgentOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, services(*), projects(*)")
    .eq("id", id)
    .eq("agent_id", profile!.id)
    .single();

  if (!order) notFound();

  const service = rel(order.services);
  const project = rel(order.projects);

  const [{ data: payment }, { data: quotation }, { data: deliverables }, { data: history }] =
    await Promise.all([
      supabase.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("quotations").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("deliverables").select("*").eq("order_id", id).order("sort_order"),
      supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at"),
    ]);

  return (
    <AgentPageShell className="max-w-5xl">
      <AgentOrderDetailView
        order={order}
        service={service}
        project={project}
        payment={payment}
        quotation={quotation}
        deliverables={deliverables || []}
        history={history || []}
      />
    </AgentPageShell>
  );
}
