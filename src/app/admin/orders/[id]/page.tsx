import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderTimeline } from "@/components/shared/order-timeline";
import { QuotationBuilder } from "@/components/admin/quotation-builder";
import { OrderStatusUpdater, PaymentVerifier } from "@/components/admin/admin-actions";
import { DeliveryManager } from "@/components/admin/delivery-manager";
import type { OrderStatus } from "@/types/database";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  OrderStatusBadge,
  rel,
} from "@/components/admin/ui";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, services(*), projects(*), profiles!orders_agent_id_fkey(full_name, email)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const service = rel(order.services);
  const partner = rel(order.profiles);

  const [{ data: payment }, { data: quotation }, { data: deliverables }, { data: proofs }] = await Promise.all([
    supabase.from("payments").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("quotations").select("*").eq("order_id", id).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("deliverables").select("*").eq("order_id", id).order("sort_order"),
    supabase.from("order_proofs").select("*").eq("order_id", id).order("sort_order"),
  ]);

  return (
    <AdminPageShell className="mx-auto max-w-5xl">
      <AdminPageHeader
        title={`#${order.order_number}`}
        description={`${service?.name || "Service"} · Partner: ${partner?.full_name || "—"}`}
        badge={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader title="Order Timeline" />
          <AdminPanelBody>
            <OrderTimeline currentStatus={order.status as OrderStatus} />
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Update Status" />
          <AdminPanelBody>
            <OrderStatusUpdater orderId={id} currentStatus={order.status as OrderStatus} />
          </AdminPanelBody>
        </AdminPanel>
      </div>

      {service?.pricing_model !== "fixed" && !quotation && (
        <AdminPanel>
          <AdminPanelHeader title="Quotation Builder" description="Generate and send quote to partner" />
          <AdminPanelBody>
            <QuotationBuilder
              orderId={id}
              commissionType={service.commission_type}
              commissionValue={service.commission_value}
            />
          </AdminPanelBody>
        </AdminPanel>
      )}

      {quotation && (
        <AdminPanel>
          <AdminPanelHeader title="Quotation" />
          <AdminPanelBody className="grid gap-3 text-sm md:grid-cols-4">
            {[
              ["Client Price", `$${quotation.client_price}`],
              ["Vendor Cost", `$${quotation.vendor_cost}`],
              ["Commission", `$${quotation.commission_amount}`],
              ["Profit", `$${quotation.company_profit}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>
      )}

      {payment && (
        <AdminPanel>
          <AdminPanelHeader title={`Payment — $${payment.amount}`} />
          <AdminPanelBody className="space-y-3">
            <OrderStatusBadge status={payment.status === "confirmed" ? "payment_confirmed" : payment.status === "awaiting_verification" ? "under_review" : "submitted"} />
            {payment.proof_url && (
              <a href={payment.proof_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-600 hover:underline">
                View Payment Proof
              </a>
            )}
            {payment.status === "awaiting_verification" && <PaymentVerifier paymentId={payment.id} />}
          </AdminPanelBody>
        </AdminPanel>
      )}

      <AdminPanel>
        <AdminPanelHeader title="Delivery Management" description="Proofs, files, team notes, and completion details for the partner delivery page" />
        <AdminPanelBody>
          <DeliveryManager order={order} proofs={proofs || []} deliverables={deliverables || []} />
        </AdminPanelBody>
      </AdminPanel>

      {deliverables && deliverables.length > 0 && (
        <AdminPanel>
          <AdminPanelHeader title="Deliverables" />
          <AdminPanelBody className="space-y-2">
            {deliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-800">{d.title}</span>
                {d.file_url && (
                  <a href={d.file_url} className="font-medium text-violet-600 hover:underline">
                    Download
                  </a>
                )}
              </div>
            ))}
          </AdminPanelBody>
        </AdminPanel>
      )}

      {order.requirements && (
        <AdminPanel>
          <AdminPanelHeader title="Requirements" />
          <AdminPanelBody>
            <p className="text-sm leading-relaxed text-slate-600">{order.requirements}</p>
          </AdminPanelBody>
        </AdminPanel>
      )}
    </AdminPageShell>
  );
}
