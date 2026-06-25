import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/partner/dashboard/ui";
import { DashboardPanel, PartnerStatCard, ProjectTokenChip } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerPageShell, rel } from "@/components/partner/ui";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, isCommissionEligibleStatus } from "@/lib/commission";
import type { Order, OrderStatus } from "@/types/database";

type OrderRow = Order & {
  services?: { name: string; estimated_tat?: string | null } | { name: string; estimated_tat?: string | null }[] | null;
  projects?: { project_name: string; token_symbol: string | null } | { project_name: string; token_symbol: string | null }[] | null;
};

const COMPLETED_STATUSES: OrderStatus[] = ["completed", "delivered", "closed"];

export function PartnerOrdersView({
  orders,
  amountByOrder,
  basePath = "/partner",
}: {
  orders: OrderRow[];
  amountByOrder: Record<string, number>;
  basePath?: string;
}) {
  const total = orders.length;
  const active = orders.filter((o) => !COMPLETED_STATUSES.includes(o.status)).length;
  const completed = orders.filter((o) => COMPLETED_STATUSES.includes(o.status)).length;
  const pendingPayment = orders.filter((o) => o.status === "waiting_payment").length;

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={basePath} className="transition hover:text-primary">
            Dashboard
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">My Orders</span>
        </nav>

        <Button asChild variant="outline" className="h-9 rounded-xl font-semibold">
          <Link href={`${basePath}/services`}>
            <Store data-icon="inline-start" />
            Browse Services
          </Link>
        </Button>
      </div>

      {total > 0 && (
        <section aria-label="Order stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <PartnerStatCard title="Total Orders" value={total} subtitle="All time" icon={Package} color="blue" />
          <PartnerStatCard title="Active" value={active} subtitle="In progress" icon={Clock} color="orange" />
          <PartnerStatCard
            title="Completed"
            value={completed}
            subtitle="Delivered & closed"
            icon={CheckCircle2}
            color="green"
          />
          <PartnerStatCard
            title="Awaiting Payment"
            value={pendingPayment}
            subtitle="Needs action"
            icon={ShoppingBag}
            color="purple"
          />
        </section>
      )}

      {total > 0 ? (
        <DashboardPanel title="All Orders" icon={Package} iconColor="blue" contentClassName="p-0">
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
                    <TableHead className="hidden text-right sm:table-cell">Amount</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const project = rel(order.projects);
                    const service = rel(order.services);
                    const amount = amountByOrder[order.id] ?? 0;
                    const delivery = isCommissionEligibleStatus(order.status);

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link
                            href={`${basePath}/orders/${order.id}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            #{order.order_number}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <ProjectTokenChip symbol={project?.token_symbol} name={project?.project_name} />
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                          {service?.name || "—"}
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} compact />
                        </TableCell>
                        <TableCell className="hidden text-right font-semibold tabular-nums sm:table-cell">
                          {amount ? formatCurrency(amount) : "—"}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                          {format(new Date(order.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant={delivery ? "default" : "outline"}
                            size="sm"
                            className="h-8 rounded-lg text-xs font-semibold"
                          >
                            <Link href={delivery ? `${basePath}/orders/${order.id}/delivery` : `${basePath}/orders/${order.id}`}>
                              {delivery ? "Delivery" : "View"}
                              <ArrowRight data-icon="inline-end" className="size-3.5" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            }
            mobile={orders.map((order) => {
              const project = rel(order.projects);
              const service = rel(order.services);
              const amount = amountByOrder[order.id] ?? 0;
              const delivery = isCommissionEligibleStatus(order.status);

              return (
                <MobileDataCard key={order.id} href={`${basePath}/orders/${order.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary">#{order.order_number}</p>
                      <p className="mt-1 truncate font-medium text-foreground">{project?.project_name || "—"}</p>
                    </div>
                    <OrderStatusBadge status={order.status} compact />
                  </div>
                  <div className="mt-3 space-y-0 border-t pt-3">
                    <MobileDataRow label="Service">{service?.name || "—"}</MobileDataRow>
                    <MobileDataRow label="Amount">{amount ? formatCurrency(amount) : "—"}</MobileDataRow>
                    <MobileDataRow label="Date">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </MobileDataRow>
                    {delivery ? (
                      <div className="pt-2">
                        <Button asChild size="sm" className="h-8 w-full rounded-lg text-xs font-semibold">
                          <Link href={`${basePath}/orders/${order.id}/delivery`}>Open Delivery</Link>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </MobileDataCard>
              );
            })}
          />
        </DashboardPanel>
      ) : (
        <Empty className="rounded-2xl border-dashed py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-12 bg-primary/10 text-primary">
              <Package />
            </EmptyMedia>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>
              Create a project and browse services to place your first order.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="rounded-xl font-semibold">
              <Link href={`${basePath}/services`}>
                <Store data-icon="inline-start" />
                Browse Services
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </PartnerPageShell>
  );
}
