import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { OrderTimeline } from "@/components/shared/order-timeline";
import { PaymentSection, QuotationSection } from "@/components/agent/payment-section";
import { OrderStatusBadge } from "@/components/agent/dashboard/ui";
import type { OrderStatus } from "@/types/database";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  rel,
} from "@/components/agent/ui";

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

  const [{ data: payment }, { data: quotation }, { data: deliverables }] = await Promise.all([
    supabase.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("quotations").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("deliverables").select("*").eq("order_id", id),
  ]);

  return (
    <AgentPageShell className="mx-auto max-w-4xl">
      <AgentPageHeader
        title={`#${order.order_number}`}
        description={`${service?.name || "Service"} · ${project?.project_name || "Project"}`}
        badge={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AgentPanel>
          <AgentPanelHeader title="Order Timeline" />
          <AgentPanelBody>
            <OrderTimeline currentStatus={order.status as OrderStatus} />
          </AgentPanelBody>
        </AgentPanel>

        <div className="space-y-4">
          {quotation && <QuotationSection quotation={quotation} />}
          {payment && <PaymentSection payment={payment} orderId={id} />}
        </div>
      </div>

      {order.progress_notes && (
        <AgentPanel>
          <AgentPanelHeader title="Progress Notes" />
          <AgentPanelBody>
            <p className="text-sm leading-relaxed text-slate-600">{order.progress_notes}</p>
          </AgentPanelBody>
        </AgentPanel>
      )}

      {deliverables && deliverables.length > 0 && (
        <AgentPanel>
          <AgentPanelHeader title="Deliverables" />
          <AgentPanelBody className="space-y-2">
            {deliverables.map((d) => (
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
          </AgentPanelBody>
        </AgentPanel>
      )}
    </AgentPageShell>
  );
}
