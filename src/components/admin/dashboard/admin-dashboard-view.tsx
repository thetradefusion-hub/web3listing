import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Calendar,
  Coins,
  FolderKanban,
  Headphones,
  PieChart,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/commission";
import {
  buildOrderStatusDistribution,
  formatRelativeTime,
  getDateRangeLabel,
} from "@/lib/admin-dashboard";
import {
  ActionCard,
  OrderDonutChart,
  RevenueChart,
} from "@/components/admin/dashboard/dashboard-charts";
import {
  AdminDashboardStatCard,
  AdminPageShell,
  DashboardPanel,
  OrderStatusBadge,
  ProjectTokenChip,
  rel,
} from "@/components/admin/ui";
import { MobileDataCard, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

function trendDirection(trend?: string): "up" | "down" | "neutral" {
  if (!trend) return "neutral";
  if (trend.startsWith("-")) return "down";
  return "up";
}

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
    totalUsers: number;
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
  const displayActivities = activities.slice(0, 6);
  const revenueTotal = revenueSeries.reduce((sum, d) => sum + d.value, 0);

  return (
    <AdminPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Admin</span>
            <span aria-hidden>›</span>
            <span>Dashboard</span>
          </nav>
          <h1 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">System overview and pending actions</p>
        </div>

        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground">
          <Calendar className="size-3.5 shrink-0 text-primary" strokeWidth={2} />
          <span className="hidden sm:inline">{getDateRangeLabel(30)}</span>
          <span className="sm:hidden">Last 30 days</span>
        </div>
      </div>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <AdminDashboardStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={Wallet}
          color="purple"
          trend={stats.revenueTrend ? `${stats.revenueTrend} vs prior` : undefined}
          trendDirection={trendDirection(stats.revenueTrend)}
        />
        <AdminDashboardStatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
          trend={stats.ordersTrend ? `${stats.ordersTrend} vs prior` : undefined}
          trendDirection={trendDirection(stats.ordersTrend)}
        />
        <AdminDashboardStatCard
          title="Partners"
          value={stats.totalPartners}
          icon={Users}
          color="orange"
          trend={stats.partnersTrend ? `${stats.partnersTrend} vs prior` : undefined}
          trendDirection={trendDirection(stats.partnersTrend)}
        />
        <AdminDashboardStatCard
          title="Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
          subtitle="Self-service accounts"
        />
        <AdminDashboardStatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderKanban}
          color="green"
          subtitle="Approved projects"
        />
        <AdminDashboardStatCard
          title="Commission Paid"
          value={formatCurrency(stats.totalCommission)}
          icon={Coins}
          color="green"
          subtitle="Lifetime credits"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
        <DashboardPanel
          className="xl:col-span-7"
          title="Revenue Overview"
          description="Daily confirmed payment volume"
          icon={TrendingUp}
          iconColor="blue"
          action={
            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {formatCurrency(revenueTotal)} · 14 days
            </span>
          }
          contentClassName="py-4"
        >
          <RevenueChart data={revenueSeries} />
        </DashboardPanel>

        <DashboardPanel
          className="xl:col-span-5"
          title="Orders by Status"
          description="Distribution across pipeline stages"
          icon={PieChart}
          iconColor="purple"
          contentClassName="py-4"
        >
          <OrderDonutChart segments={donutSegments} total={orderStatuses.length} />
        </DashboardPanel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
        <DashboardPanel
          className="xl:col-span-8"
          title="Recent Orders"
          icon={ShoppingBag}
          iconColor="blue"
          contentClassName="p-0"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold">
              <Link href="/admin/orders">
                View all
                <ArrowRight data-icon="inline-end" className="size-3.5" />
              </Link>
            </Button>
          }
        >
          <ResponsiveTableShell
            className="flex-1"
            table={
              <Table className="portal-table">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Order</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead className="hidden lg:table-cell">Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden text-right md:table-cell">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.length > 0 ? (
                    displayOrders.map((order) => {
                      const service = rel(order.services);
                      const project = rel(order.projects);
                      const payments = Array.isArray(order.payments)
                        ? order.payments
                        : order.payments
                          ? [order.payments]
                          : [];
                      const amount =
                        payments.find((p) => p.status === "confirmed")?.amount ?? payments[0]?.amount;

                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              #{order.order_number}
                            </Link>
                          </TableCell>
                          <TableCell className="max-w-[160px]">
                            <ProjectTokenChip
                              symbol={project?.token_symbol}
                              name={project?.project_name}
                            />
                          </TableCell>
                          <TableCell className="hidden max-w-[140px] truncate text-muted-foreground lg:table-cell">
                            {service?.name || "—"}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} compact />
                          </TableCell>
                          <TableCell className="hidden text-right font-semibold tabular-nums md:table-cell">
                            {amount != null ? formatCurrency(Number(amount)) : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        No orders yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            }
            mobile={
              displayOrders.length > 0 ? (
                displayOrders.map((order) => {
                  const service = rel(order.services);
                  const project = rel(order.projects);
                  const payments = Array.isArray(order.payments)
                    ? order.payments
                    : order.payments
                      ? [order.payments]
                      : [];
                  const amount =
                    payments.find((p) => p.status === "confirmed")?.amount ?? payments[0]?.amount;
                  const label = (project?.token_symbol || project?.project_name || "?")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <MobileDataCard key={order.id} href={`/admin/orders/${order.id}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar size="sm" className="size-9">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {label}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-primary">#{order.order_number}</p>
                            <p className="truncate text-sm font-medium">{project?.project_name || "—"}</p>
                          </div>
                        </div>
                        <OrderStatusBadge status={order.status} compact />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3 text-sm">
                        <span className="truncate text-muted-foreground">{service?.name || "—"}</span>
                        <span className="shrink-0 font-semibold tabular-nums">
                          {amount != null ? formatCurrency(Number(amount)) : "—"}
                        </span>
                      </div>
                    </MobileDataCard>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
              )
            }
          />
        </DashboardPanel>

        <DashboardPanel
          className="xl:col-span-4"
          title="Recent Activity"
          description="Latest system events"
          icon={Activity}
          iconColor="teal"
          contentClassName="py-3"
        >
          {displayActivities.length > 0 ? (
            <div className="flex flex-col gap-2">
              {displayActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ${item.tone}`}
                  >
                    <Activity className="size-3.5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                      {formatRelativeTime(item.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
          )}
        </DashboardPanel>
      </div>

      <section aria-label="Pending actions" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          title="Pending Withdrawals"
          metric={String(actions.pendingWithdrawals.count)}
          subtext={`${formatCurrency(actions.pendingWithdrawals.amount)} requested`}
          href="/admin/withdrawals"
          cta="Review withdrawals"
          tone="border-chart-3/30 bg-chart-3/10"
        />
        <ActionCard
          title="Open Tickets"
          metric={String(actions.openTickets)}
          subtext="Awaiting staff response"
          href="/admin/tickets"
          cta="View tickets"
          tone="border-primary/30 bg-primary/10"
        />
        <ActionCard
          title="KYC Review"
          metric={String(actions.pendingKyc)}
          subtext={`of ${actions.totalPartners} partners`}
          href="/admin/kyc"
          cta="Verify partners"
          tone="border-destructive/30 bg-destructive/10"
        />
        <ActionCard
          title="Quotes Awaiting"
          metric={String(actions.pendingQuotes.count)}
          subtext={`${formatCurrency(actions.pendingQuotes.value)} pipeline value`}
          href="/admin/orders"
          cta="View quotes"
          tone="border-chart-2/30 bg-chart-2/10"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardPanel title="Operations" description="People, projects, and compliance" icon={ShieldCheck} iconColor="green">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/partners">Partners</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/kyc">KYC Review</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/projects">Projects</Link>
            </Button>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Support & Finance" description="Payments, tickets, and payouts" icon={Headphones} iconColor="blue">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/payments">Payments</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/tickets">Tickets</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9 rounded-xl font-semibold">
              <Link href="/admin/withdrawals">Withdrawals</Link>
            </Button>
          </div>
        </DashboardPanel>
      </div>
    </AdminPageShell>
  );
}
