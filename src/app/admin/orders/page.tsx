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
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceId } = await searchParams;
  const supabase = await createClient();

  let ordersQuery = supabase
    .from("orders")
    .select("*, services(name, estimated_tat), profiles!orders_agent_id_fkey(full_name, role), projects(project_name, token_symbol)")
    .order("created_at", { ascending: false });

  if (serviceId) {
    ordersQuery = ordersQuery.eq("service_id", serviceId);
  }

  const [{ data: orders }, { data: filteredService }] = await Promise.all([
    ordersQuery,
    serviceId
      ? supabase.from("services").select("id, name").eq("id", serviceId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Order Management"
        description={
          filteredService
            ? `Orders linked to ${filteredService.name}`
            : "Review, quote, and manage all partner orders"
        }
      />

      {filteredService && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <span>
            Showing orders for <span className="font-semibold">{filteredService.name}</span>. Delete or
            reassign them to remove this service from the catalog.
          </span>
          <Button size="sm" variant="outline" className="rounded-xl bg-white" asChild>
            <Link href="/admin/orders">Clear filter</Link>
          </Button>
        </div>
      )}

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
                    <th className="hidden xl:table-cell">Owner type</th>
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
                        <td className="hidden xl:table-cell">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              partner?.role === "user"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {partner?.role === "user" ? "User" : "Partner"}
                          </span>
                        </td>
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
        <AdminEmptyState
          title={filteredService ? "No orders for this service" : "No orders yet"}
          description={
            filteredService
              ? "This service has no linked orders. You can delete it from the services catalog."
              : "Orders from partners will appear here."
          }
        />
      )}
    </AdminPageShell>
  );
}
