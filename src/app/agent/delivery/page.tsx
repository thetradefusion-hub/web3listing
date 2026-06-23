import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  AgentEmptyState,
  rel,
} from "@/components/agent/ui";
import { OrderStatusBadge } from "@/components/agent/dashboard/ui";

export default async function DeliveryCenterPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, services(name), deliverables(*)")
    .eq("agent_id", profile!.id)
    .in("status", ["completed", "delivered", "closed"])
    .order("updated_at", { ascending: false });

  return (
    <AgentPageShell>
      <AgentPageHeader
        title="Delivery Center"
        description="Download deliverables, reports, and listing confirmations"
      />

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const service = rel(order.services);
            return (
              <AgentPanel key={order.id}>
                <AgentPanelHeader
                  title={`#${order.order_number} — ${service?.name || "Service"}`}
                  action={<OrderStatusBadge status={order.status} />}
                />
                <AgentPanelBody>
                  {order.deliverables && order.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {order.deliverables.map((d: { id: string; title: string; file_url: string | null; external_link: string | null }) => (
                        <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                          <span className="font-medium text-slate-800">{d.title}</span>
                          <div className="flex gap-3">
                            {d.file_url && (
                              <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:underline">
                                Download
                              </a>
                            )}
                            {d.external_link && (
                              <a href={d.external_link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:underline">
                                View Link
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Deliverables pending</p>
                  )}
                  <Link href={`/agent/orders/${order.id}`} className="mt-4 inline-block text-sm font-medium text-violet-600 hover:underline">
                    View Order Details →
                  </Link>
                </AgentPanelBody>
              </AgentPanel>
            );
          })}
        </div>
      ) : (
        <AgentEmptyState
          title="No deliverables yet"
          description="Completed orders with files and reports will appear here."
        />
      )}
    </AgentPageShell>
  );
}
