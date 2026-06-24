import Link from "next/link";
import {
  Calendar,
  Coins,
  FolderKanban,
  ShoppingBag,
  Users,
  Wallet,
  Activity,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/commission";
import {
  buildOrderStatusDistribution,
  formatRelativeTime,
  getDateRangeLabel,
} from "@/lib/admin-dashboard";
import {
  AdminDashboardStatCard,
  CompactPanelHeader,
} from "@/components/admin/dashboard/dashboard-compact";
import {
  AdminPageShell,
  AdminPanel,
  OrderStatusBadge,
  rel,
} from "@/components/admin/ui";
import {
  MobileDataCard,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";
import {
  ActionCard,
  OrderDonutChart,
  RevenueChart,
} from "@/components/admin/dashboard/dashboard-charts";
import type { OrderStatus } from "@/types/database";

type RecentOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  created_at: string;
  services?: { name: string } | { name: string }[] | null;
  profiles?: { full_name: string } | { full_name: string }[] | null;
  projects?: { project_name: string; token_symbol: string | null } | { project_name: string; token_symbol: string | null }[] | null;
  payments?: { amount: number; status: string }[] | { amount: number; status: string } | null;
};

export function AdminDashboardView({
  adminName,
  stats,
  revenueSeries,
  orderStatuses,
  recentOrders,
  activities,
  actions,
}: {
  adminName: string;
  stats: {
    totalRevenue: number;
    revenueTrend?: string;
    totalOrders: number;
    ordersTrend?: string;
    totalPartners: number;
    partnersTrend?: string;
    activeProjects: number;
    projectsTrend?: string;
    totalCommission: number;
    commissionTrend?: string;
  };
  revenueSeries: { label: string; value: number }[];
  orderStatuses: { status: OrderStatus }[];
  recentOrders: RecentOrder[];
  activities: {
    id: string;
    title: string;
    description: string;
    time: string;
    tone: string;
  }[];
  actions: {
    pendingWithdrawals: { count: number; amount: number };
    openTickets: number;
    pendingKyc: number;
    totalPartners: number;
    pendingQuotes: { count: number; value: number };
  };
}) {
  const donutSegments = buildOrderStatusDistribution(orderStatuses);
  const firstName = adminName.split(" ")[0] || adminName;
  const displayOrders = recentOrders.slice(0, 5);
  const displayActivities = activities.slice(0, 5);

  return (
    <AdminPageShell compact className="space-y-3 lg:space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="truncate text-base font-semibold text-[#0F172A] lg:text-lg">
          Welcome back, {firstName}! 👋
        </h2>
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 text-[10px] font-medium text-[#64748B] lg:text-[11px]">
          <Calendar className="h-3 w-3 text-[#635BFF] lg:h-3.5 lg:w-3.5" />
          <span className="hidden sm:inline">{getDateRangeLabel(30)}</span>
          <span className="sm:hidden">30 days</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2.5">
        <AdminDashboardStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={Wallet}
          color="purple"
          trend={stats.revenueTrend}
        />
        <AdminDashboardStatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
          trend={stats.ordersTrend}
        />
        <AdminDashboardStatCard
          title="Total Partners"
          value={stats.totalPartners}
          icon={Users}
          color="orange"
          trend={stats.partnersTrend}
        />
        <AdminDashboardStatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
          color="green"
          trend={stats.projectsTrend}
        />
        <AdminDashboardStatCard
          title="Total Commission"
          value={formatCurrency(stats.totalCommission)}
          icon={Coins}
          color="orange"
          trend={stats.commissionTrend}
        />
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12 lg:gap-3">
        <AdminPanel className="lg:col-span-7">
          <CompactPanelHeader
            title="Revenue Overview"
            description="Daily confirmed payment volume"
            action={
              <span className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
                <TrendingUp className="h-2.5 w-2.5" />
                Daily
              </span>
            }
          />
          <div className="px-3 py-2 lg:px-4 lg:py-2.5">
            <RevenueChart data={revenueSeries} />
          </div>
        </AdminPanel>

        <AdminPanel className="lg:col-span-5">
          <CompactPanelHeader title="Orders Status" description="Distribution by stage" />
          <div className="px-3 py-2 lg:px-4 lg:py-2.5">
            <OrderDonutChart segments={donutSegments} total={orderStatuses.length} />
          </div>
        </AdminPanel>
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12 lg:items-stretch lg:gap-3">
        <AdminPanel className="flex h-full flex-col overflow-hidden lg:col-span-8">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#F1F5F9] px-3 py-1.5 lg:px-3 lg:py-2">
            <h2 className="text-xs font-semibold text-[#0F172A] lg:text-sm">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[10px] font-medium text-[#635BFF] hover:text-[#5248E6] lg:text-[11px]">
              View All
            </Link>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
          <ResponsiveTableShell
            className="flex-1 [&_.portal-table-laptop_tbody_tr:last-child_td]:border-b-0"
            table={
              <table className="portal-table portal-table-laptop w-full">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th className="hidden xl:table-cell">Project</th>
                    <th>Service</th>
                    <th className="hidden lg:table-cell">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayOrders.length > 0 ? (
                    displayOrders.map((order) => {
                      const service = rel(order.services);
                      const project = rel(order.projects);
                      const payments = Array.isArray(order.payments)
                        ? order.payments
                        : order.payments
                          ? [order.payments]
                          : [];
                      const amount = payments.find((p) => p.status === "confirmed")?.amount
                        ?? payments[0]?.amount;

                      return (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-[11px] font-medium text-[#635BFF] hover:underline"
                            >
                              #{order.order_number}
                            </Link>
                          </td>
                          <td className="hidden max-w-[110px] truncate text-[#64748B] xl:table-cell">
                            {project?.project_name || "—"}
                          </td>
                          <td className="max-w-[140px] truncate text-[#64748B]">
                            {service?.name || "—"}
                          </td>
                          <td className="hidden whitespace-nowrap text-[11px] font-medium text-[#0F172A] lg:table-cell">
                            {amount != null ? formatCurrency(Number(amount)) : "—"}
                          </td>
                          <td>
                            <OrderStatusBadge status={order.status} mini />
                          </td>
                        </tr>
                      );
                    })
                  ) : null}
                  {displayOrders.length > 0 &&
                    displayOrders.length < 5 &&
                    Array.from({ length: 5 - displayOrders.length }).map((_, i) => (
                      <tr key={`order-pad-${i}`} aria-hidden className="pointer-events-none">
                        <td colSpan={5} className="!border-b !border-[#f1f5f9] !py-[5px]" />
                      </tr>
                    ))}
                  {displayOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-[11px] text-[#94A3B8]">
                        No orders yet
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            }
            mobile={
              displayOrders.length > 0 ? (
                displayOrders.map((order) => {
                  const service = rel(order.services);
                  const payments = Array.isArray(order.payments)
                    ? order.payments
                    : order.payments
                      ? [order.payments]
                      : [];
                  const amount = payments.find((p) => p.status === "confirmed")?.amount
                    ?? payments[0]?.amount;

                  return (
                    <MobileDataCard key={order.id} href={`/admin/orders/${order.id}`}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#635BFF]">#{order.order_number}</p>
                        <OrderStatusBadge status={order.status} compact />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-slate-100 pt-2 text-[11px]">
                        <span className="text-[#64748B]">{service?.name || "—"}</span>
                        <span className="font-medium text-[#0F172A]">
                          {amount != null ? formatCurrency(Number(amount)) : "—"}
                        </span>
                      </div>
                    </MobileDataCard>
                  );
                })
              ) : (
                <p className="py-4 text-center text-sm text-slate-400">No orders yet</p>
              )
            }
          />
          </div>
        </AdminPanel>

        <AdminPanel className="flex h-full flex-col lg:col-span-4">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#F1F5F9] px-3 py-1.5 lg:px-3 lg:py-2">
            <h2 className="text-xs font-semibold text-[#0F172A] lg:text-sm">Recent Activities</h2>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-3 py-2 lg:px-3 lg:py-2">
            {displayActivities.length > 0 ? (
              <div className="flex flex-1 flex-col justify-between gap-1.5">
              {displayActivities.map((item) => (
                <div key={item.id} className="flex min-h-[28px] flex-1 items-start gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md lg:h-6 lg:w-6 ${item.tone}`}
                  >
                    <Activity className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium leading-tight text-[#0F172A] lg:text-xs">{item.title}</p>
                    <p className="truncate text-[10px] leading-tight text-[#64748B]">{item.description}</p>
                    <p className="text-[9px] text-[#94A3B8]">{formatRelativeTime(item.time)}</p>
                  </div>
                </div>
              ))}
              {displayActivities.length < 5 &&
                Array.from({ length: 5 - displayActivities.length }).map((_, i) => (
                  <div key={`activity-pad-${i}`} className="min-h-[28px] flex-1" aria-hidden />
                ))}
              </div>
            ) : (
              <p className="flex flex-1 items-center justify-center text-xs text-[#94A3B8]">No recent activity</p>
            )}
          </div>
        </AdminPanel>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-2.5">
        <ActionCard
          title="Pending Withdrawals"
          metric={String(actions.pendingWithdrawals.count)}
          subtext={`${formatCurrency(actions.pendingWithdrawals.amount)} requested`}
          href="/admin/withdrawals"
          cta="Review Now"
          tone="border-[#FDE68A] bg-[#FFFBEB]/50"
        />
        <ActionCard
          title="Open Support Tickets"
          metric={String(actions.openTickets)}
          subtext="Awaiting response"
          href="/admin/tickets"
          cta="View Tickets"
          tone="border-[#C7D2FE] bg-[#EEF2FF]/50"
        />
        <ActionCard
          title="KYC Verification"
          metric={String(actions.pendingKyc)}
          subtext={`of ${actions.totalPartners} partners`}
          href="/admin/kyc"
          cta="Verify Now"
          tone="border-[#FECACA] bg-[#FEF2F2]/50"
        />
        <ActionCard
          title="Quotes Awaiting"
          metric={String(actions.pendingQuotes.count)}
          subtext={`${formatCurrency(actions.pendingQuotes.value)} value`}
          href="/admin/orders"
          cta="View Quotes"
          tone="border-[#A7F3D0] bg-[#ECFDF5]/50"
        />
      </div>
    </AdminPageShell>
  );
}
