import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminEmptyState,
  OrderStatusBadge,
  rel,
} from "@/components/admin/ui";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, services(name, estimated_tat), profiles!orders_agent_id_fkey(full_name), projects(project_name, token_symbol)")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Order Management"
        description="Review, quote, and manage all partner orders"
      />

      {orders && orders.length > 0 ? (
        <AdminPanel className="overflow-hidden">
          <ResponsiveTableShell
            table={
              <table className="portal-table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Project</th>
                    <th>Service</th>
                    <th className="hidden lg:table-cell">Partner</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const service = rel(order.services);
                    const partner = rel(order.profiles);
                    const project = rel(order.projects);
                    return (
                      <tr key={order.id}>
                        <td className="font-medium text-[#635BFF]">#{order.order_number}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[10px] font-bold text-[#635BFF]">
                              {(project?.token_symbol || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[#0F172A]">{project?.project_name || "—"}</span>
                          </div>
                        </td>
                        <td className="text-[#64748B]">{service?.name || "—"}</td>
                        <td className="hidden text-[#64748B] lg:table-cell">{partner?.full_name || "—"}</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="text-right">
                          <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-[#635BFF] hover:underline">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            }
            mobile={
              <>
                {orders.map((order) => {
                  const service = rel(order.services);
                  const partner = rel(order.profiles);
                  const project = rel(order.projects);
                  return (
                    <MobileDataCard key={order.id} href={`/admin/orders/${order.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#635BFF]">#{order.order_number}</p>
                          <p className="mt-1 font-medium text-[#0F172A]">{project?.project_name || "—"}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="mt-4 border-t border-[#F1F5F9] pt-4">
                        <MobileDataRow label="Service">{service?.name || "—"}</MobileDataRow>
                        <MobileDataRow label="Partner">{partner?.full_name || "—"}</MobileDataRow>
                      </div>
                    </MobileDataCard>
                  );
                })}
              </>
            }
          />
        </AdminPanel>
      ) : (
        <AdminEmptyState title="No orders yet" description="Orders from partners will appear here." />
      )}
    </AdminPageShell>
  );
}
