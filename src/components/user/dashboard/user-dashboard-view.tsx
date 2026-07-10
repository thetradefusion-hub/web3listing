import Link from "next/link";
import {
  FolderKanban,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LayoutGrid,
  PieChart,
  Zap,
  Package,
  Percent,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/commission";
import {
  OrderStatusBadge,
  TopServicesList,
  DashboardEmptyOrders,
} from "@/components/partner/dashboard/ui";
import { QuickActionsGrid } from "@/components/partner/dashboard/quick-actions";
import {
  PartnerStatCard,
  DashboardPanel,
  ProjectTokenChip,
} from "@/components/partner/dashboard/dashboard-premium";
import { DashboardSupportSection } from "@/components/partner/dashboard/dashboard-support-section";
import { OrderDonutChart } from "@/components/admin/dashboard/dashboard-charts";
import { ProjectStatusChart } from "@/components/partner/dashboard/project-status-chart";
import { rel, PartnerPageShell } from "@/components/partner/ui";
import { Alert, AlertAction, AlertTitle } from "@/components/ui/alert";
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
import { MobileDataCard, ResponsiveTableShell } from "@/components/shared/responsive-table";
import type { AccountManager } from "@/types/database";
import type { OrderStatus } from "@/types/database";
import type { QuickActionColor } from "@/lib/theme-tokens";

const CLIENT_ORDER_GROUPS: Record<string, OrderStatus[]> = {
  "In Progress": ["payment_confirmed", "in_progress", "third_party_review"],
  Completed: ["completed", "delivered", "closed"],
  Pending: ["submitted", "under_review", "waiting_payment"],
};

const DONUT_COLORS: Record<string, string> = {
  "In Progress": "var(--chart-4)",
  Completed: "var(--chart-2)",
  Pending: "var(--chart-3)",
};

function buildClientOrderDonut(orders: { status: OrderStatus }[]) {
  const total = orders.length || 1;
  return Object.entries(CLIENT_ORDER_GROUPS)
    .map(([label, statuses]) => {
      const count = orders.filter((o) => statuses.includes(o.status)).length;
      return { label, count, percent: total ? Math.round((count / total) * 100) : 0, color: DONUT_COLORS[label] };
    })
    .filter((e) => e.count > 0);
}

type RecentOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  services?: { name: string } | { name: string }[] | null;
  projects?: { project_name: string; token_symbol: string | null } | { project_name: string; token_symbol: string | null }[] | null;
};

export function UserDashboardView({
  kycRequired,
  stats,
  recentOrders,
  quoteMap,
  paymentMap,
  orderStatusData,
  projectChartData,
  totalProjects,
  topServices,
  quickActions,
  manager,
}: {
  kycRequired: boolean;
  stats: {
    projectCount: number;
    orderCount: number;
    activeOrders: string | number;
    completedOrders: number;
    pendingOrders: number;
    activeOrderPct?: string;
    completionRate?: string;
  };
  recentOrders: RecentOrder[];
  quoteMap: Map<string, number>;
  paymentMap: Map<string, number>;
  orderStatusData: { status: OrderStatus }[];
  projectChartData: { name: string; value: number; percent: number }[];
  totalProjects: number;
  topServices: { name: string; count: number }[];
  quickActions: { label: string; href: string; icon: LucideIcon; color: QuickActionColor }[];
  manager: AccountManager | null;
}) {
  const displayOrders = recentOrders.slice(0, 5);
  const donutSegments = buildClientOrderDonut(orderStatusData);

  return (
    <PartnerPageShell compact fullWidth className="w-full gap-4 sm:gap-5">
      {kycRequired && (
        <Alert>
          <AlertTriangle />
          <AlertTitle>Complete KYC to place orders</AlertTitle>
          <AlertAction>
            <Button asChild size="sm">
              <Link href="/user/kyc">KYC</Link>
            </Button>
          </AlertAction>
        </Alert>
      )}

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <PartnerStatCard
          title="Total Project"
          value={stats.projectCount}
          subtitle="All projects"
          icon={FolderKanban}
          color="blue"
        />
        <PartnerStatCard
          title="Total Order"
          value={stats.orderCount}
          subtitle="All orders"
          icon={ClipboardList}
          color="green"
        />
        <PartnerStatCard
          title="Active Order"
          value={stats.activeOrders}
          subtitle={stats.activeOrderPct}
          icon={Clock}
          color="orange"
        />
        <PartnerStatCard
          title="Completed Order"
          value={stats.completedOrders}
          subtitle="Delivered or closed"
          icon={CheckCircle2}
          color="purple"
        />
        <PartnerStatCard
          title="Pending Order"
          value={stats.pendingOrders}
          subtitle="Awaiting action"
          icon={Package}
          color="orange"
        />
        <PartnerStatCard
          title="Completion %"
          value={stats.completionRate || "—"}
          subtitle={stats.orderCount ? `of ${stats.orderCount} orders` : "No orders yet"}
          icon={Percent}
          color="green"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
        <DashboardPanel
          className="xl:col-span-8"
          title="Recent Orders"
          icon={Package}
          iconColor="blue"
          contentClassName="p-0"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/user/orders">
                All
                <ArrowRight data-icon="inline-end" />
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
                    <TableHead className="hidden md:table-cell">Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden text-right md:table-cell">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.length > 0
                    ? displayOrders.map((order) => {
                        const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                        const project = rel(order.projects);
                        const service = rel(order.services);
                        return (
                          <TableRow key={order.id}>
                            <TableCell>
                              <Link
                                href={`/user/orders/${order.id}`}
                                className="font-medium text-primary hover:underline"
                              >
                                #{order.order_number}
                              </Link>
                            </TableCell>
                            <TableCell className="max-w-[180px]">
                              <ProjectTokenChip symbol={project?.token_symbol} name={project?.project_name} />
                            </TableCell>
                            <TableCell className="hidden max-w-[160px] truncate text-muted-foreground md:table-cell">
                              {service?.name || "—"}
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} compact />
                            </TableCell>
                            <TableCell className="hidden text-right font-semibold tabular-nums md:table-cell">
                              {amount ? formatCurrency(amount) : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                  {displayOrders.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <DashboardEmptyOrders compact basePath="/user" />
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            }
            mobile={
              displayOrders.length > 0 ? (
                displayOrders.map((order) => {
                  const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                  const project = rel(order.projects);
                  const service = rel(order.services);
                  const label = (project?.token_symbol || project?.project_name || "?").slice(0, 2).toUpperCase();
                  return (
                    <MobileDataCard key={order.id} href={`/user/orders/${order.id}`}>
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
                        <span className="text-muted-foreground">{service?.name || "—"}</span>
                        <span className="font-semibold tabular-nums">{amount ? formatCurrency(amount) : "—"}</span>
                      </div>
                    </MobileDataCard>
                  );
                })
              ) : (
                <DashboardEmptyOrders compact basePath="/user" />
              )
            }
          />
        </DashboardPanel>

        <DashboardPanel className="xl:col-span-4" title="Quick Actions" icon={Zap} iconColor="amber">
          <QuickActionsGrid actions={quickActions} />
        </DashboardPanel>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardPanel
          title="Order Status"
          description="Overview by stage"
          icon={PieChart}
          iconColor="purple"
          contentClassName="items-center py-4"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <Link href="/user/orders">
                View
                <ArrowRight data-icon="inline-end" className="size-3.5" />
              </Link>
            </Button>
          }
        >
          {orderStatusData.length > 0 ? (
            <OrderDonutChart segments={donutSegments} total={orderStatusData.length} />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Top Services"
          description="Most ordered"
          icon={LayoutGrid}
          iconColor="green"
          contentClassName="py-4"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <Link href="/user/services">
                Browse
                <ArrowRight data-icon="inline-end" className="size-3.5" />
              </Link>
            </Button>
          }
        >
          {topServices.length > 0 ? (
            <TopServicesList services={topServices.slice(0, 4)} />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders yet</p>
          )}
        </DashboardPanel>

        <DashboardPanel
          title="Projects"
          description="Status breakdown"
          icon={FolderKanban}
          iconColor="blue"
          className="md:col-span-2 xl:col-span-1"
          contentClassName="py-4"
          action={
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <Link href="/user/projects">
                View
                <ArrowRight data-icon="inline-end" className="size-3.5" />
              </Link>
            </Button>
          }
        >
          {totalProjects > 0 ? (
            <ProjectStatusChart data={projectChartData} total={totalProjects} compact />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No projects yet</p>
          )}
        </DashboardPanel>
      </div>

      <DashboardSupportSection manager={manager} kycRequired={kycRequired} basePath="/user" />
    </PartnerPageShell>
  );
}
