import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { isCommissionEligibleStatus } from "@/lib/commission";
import { OrderStatusBadge } from "@/components/partner/dashboard/ui";
import {
  PartnerPageShell,
  PartnerPageHeader,
  PartnerPanel,
  PartnerEmptyState,
  rel,
} from "@/components/partner/ui";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";

export default async function PartnerOrdersPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, services(name, estimated_tat), projects(project_name, token_symbol)")
    .eq("agent_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <PartnerPageShell>
      <PartnerPageHeader
        title="My Orders"
        description="Track all your service orders and their progress"
      />

      {orders && orders.length > 0 ? (
        <PartnerPanel className="overflow-hidden">
          <ResponsiveTableShell
            table={
              <table className="portal-table w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Project</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">TAT</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const project = rel(order.projects);
                    const service = rel(order.services);
                    return (
                      <tr key={order.id}>
                        <td className="font-medium text-[#635BFF]">#{order.order_number}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2FF] text-[10px] font-bold text-[#635BFF]">
                              {(project?.token_symbol || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-[#0F172A]">{project?.project_name || "—"}</span>
                          </div>
                        </td>
                        <td className="text-[#64748B]">{service?.name || "—"}</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="hidden text-[#94A3B8] sm:table-cell">{service?.estimated_tat || "—"}</td>
                        <td className="text-right">
                          {isCommissionEligibleStatus(order.status) ? (
                            <Link href={`/partner/orders/${order.id}/delivery`} className="text-sm font-medium text-[#059669] hover:underline">
                              Delivery
                            </Link>
                          ) : (
                            <Link href={`/partner/orders/${order.id}`} className="text-sm font-medium text-[#635BFF] hover:underline">
                              View
                            </Link>
                          )}
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
                  const project = rel(order.projects);
                  const service = rel(order.services);
                  return (
                    <MobileDataCard key={order.id} href={`/partner/orders/${order.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#635BFF]">#{order.order_number}</p>
                          <p className="mt-1 font-medium text-[#0F172A]">{project?.project_name || "—"}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="mt-4 border-t border-[#F1F5F9] pt-4">
                        <MobileDataRow label="Service">{service?.name || "—"}</MobileDataRow>
                        <MobileDataRow label="TAT">{service?.estimated_tat || "—"}</MobileDataRow>
                      </div>
                    </MobileDataCard>
                  );
                })}
              </>
            }
          />
        </PartnerPanel>
      ) : (
        <PartnerEmptyState
          title="No orders yet"
          description="Create a project and browse services to place your first order."
        />
      )}
    </PartnerPageShell>
  );
}
