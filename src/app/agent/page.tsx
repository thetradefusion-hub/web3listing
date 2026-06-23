import Link from "next/link";
import {
  FolderKanban,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Wallet,
  Plus,
  Store,
  Package,
  Banknote,
  Headphones,
  Shield,
  Send,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/commission";
import { DashboardStatCard, OrderStatusBadge, TopServicesList, DashboardEmptyOrders, EarningsOverviewCard } from "@/components/agent/dashboard/ui";
import { QuickActionsGrid } from "@/components/agent/dashboard/quick-actions";
import {
  rel,
  AgentPageShell,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  AgentPrimaryButton,
  AgentSecondaryButton,
} from "@/components/agent/ui";
import { EarningsChart } from "@/components/agent/dashboard/earnings-chart";
import { ProjectStatusChart } from "@/components/agent/dashboard/project-status-chart";
import { Button } from "@/components/ui/button";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";
import { format, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from "date-fns";

const quickActions = [
  { label: "Create New Project", href: "/agent/projects/new", icon: Plus, color: "bg-[#EEF2FF] text-[#635BFF]" },
  { label: "View All Services", href: "/agent/services", icon: Store, color: "bg-[#ECFDF5] text-[#10B981]" },
  { label: "My Orders", href: "/agent/orders", icon: Package, color: "bg-[#FFFBEB] text-[#F59E0B]" },
  { label: "Wallet & Earnings", href: "/agent/wallet", icon: Wallet, color: "bg-[#F0FDFA] text-[#14B8A6]" },
  { label: "Withdrawal", href: "/agent/wallet", icon: Banknote, color: "bg-[#F5F3FF] text-[#8B5CF6]" },
  { label: "Support Ticket", href: "/agent/support", icon: Headphones, color: "bg-[#FDF2F8] text-[#EC4899]" },
];

const projectStatusLabels: Record<string, string> = {
  approved: "Approved",
  under_review: "Under Review",
  submitted: "Under Review",
  rejected: "Rejected",
  draft: "Draft",
};

function padCount(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export default async function AgentDashboard() {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const agentId = profile!.id;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    { count: projectCount },
    { count: orderCount },
    { count: activeOrders },
    { count: completedOrders },
    { data: wallet },
    { data: recentOrders },
    { data: projects },
    { data: allOrders },
    { data: ledgerThisMonth },
    { data: ledgerPrevMonth },
    { data: manager },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("agent_id", agentId),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("agent_id", agentId),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .not("status", "in", "(closed,completed,delivered)"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", agentId)
      .in("status", ["completed", "delivered", "closed"]),
    supabase.from("wallets").select("*").eq("user_id", agentId).single(),
    supabase
      .from("orders")
      .select("*, services(name, estimated_tat), projects(project_name, token_symbol, logo_url)")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("projects").select("status").eq("agent_id", agentId),
    supabase.from("orders").select("service_id, services(name)").eq("agent_id", agentId),
    supabase
      .from("commission_ledger")
      .select("amount, created_at")
      .eq("user_id", agentId)
      .eq("type", "credit")
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString()),
    supabase
      .from("commission_ledger")
      .select("amount")
      .eq("user_id", agentId)
      .eq("type", "credit")
      .gte("created_at", prevMonthStart.toISOString())
      .lte("created_at", prevMonthEnd.toISOString()),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("*").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("*").eq("is_active", true).limit(1).single(),
  ]);

  const orderIds = recentOrders?.map((o) => o.id) || [];
  const { data: quotations } = orderIds.length
    ? await supabase.from("quotations").select("order_id, client_price").in("order_id", orderIds)
    : { data: [] };
  const { data: payments } = orderIds.length
    ? await supabase.from("payments").select("order_id, amount").in("order_id", orderIds)
    : { data: [] };

  const quoteMap = new Map(quotations?.map((q) => [q.order_id, q.client_price]) || []);
  const paymentMap = new Map(payments?.map((p) => [p.order_id, p.amount]) || []);

  const monthEarnings = ledgerThisMonth?.reduce((s, e) => s + Number(e.amount), 0) || 0;
  const prevMonthEarnings = ledgerPrevMonth?.reduce((s, e) => s + Number(e.amount), 0) || 0;
  const earningsGrowth =
    prevMonthEarnings > 0
      ? (((monthEarnings - prevMonthEarnings) / prevMonthEarnings) * 100).toFixed(1)
      : monthEarnings > 0
        ? "100"
        : "0";

  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
  const earningsChartData = weeks.map((weekStart, i) => {
    const weekEnd = endOfWeek(weekStart);
    const amount =
      ledgerThisMonth
        ?.filter((e) => {
          const d = new Date(e.created_at);
          return d >= weekStart && d <= weekEnd;
        })
        .reduce((s, e) => s + Number(e.amount), 0) || 0;
    return { label: `W${i + 1}`, amount: Math.round(amount) };
  });

  const statusCounts: Record<string, number> = {};
  projects?.forEach((p) => {
    const key = p.status === "submitted" ? "under_review" : p.status;
    statusCounts[key] = (statusCounts[key] || 0) + 1;
  });
  const totalProjects = projectCount || 0;
  const statusOrder = ["approved", "under_review", "rejected", "draft"] as const;
  const projectChartData = statusOrder
    .filter((s) => statusCounts[s])
    .map((s) => ({
      name: projectStatusLabels[s] || s,
      value: statusCounts[s],
      percent: totalProjects ? Math.round((statusCounts[s] / totalProjects) * 100) : 0,
    }));

  const serviceCounts: Record<string, { name: string; count: number }> = {};
  allOrders?.forEach((o) => {
    const svc = rel(o.services);
    const name = svc?.name || "Unknown";
    const key = o.service_id;
    if (!serviceCounts[key]) serviceCounts[key] = { name, count: 0 };
    serviceCounts[key].count++;
  });
  const topServices = Object.values(serviceCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const activeOrderPct =
    orderCount && activeOrders ? `${Math.round(((activeOrders || 0) / orderCount) * 100)}% of total` : undefined;
  const completionRate =
    orderCount && completedOrders
      ? `${Math.round(((completedOrders || 0) / orderCount) * 100)}% completion`
      : undefined;
  const pendingBalance = wallet?.pending_balance || 0;

  return (
    <AgentPageShell compact>
      {profile?.kyc_status !== "approved" && (
        <div className="premium-card flex flex-col gap-3 border-[#FDE68A] bg-[#FFFBEB] p-4 sm:flex-row sm:items-center">
          <AlertTriangle className="h-8 w-8 shrink-0 text-[#F59E0B]" />
          <div className="flex-1">
            <p className="font-semibold text-[#92400E]">KYC Verification Required</p>
            <p className="text-sm text-[#B45309]">Complete KYC to place orders and earn commissions.</p>
          </div>
          <Button asChild size="sm" className="h-11 rounded-xl bg-[#F59E0B] hover:bg-[#D97706]">
            <Link href="/agent/kyc">Complete KYC</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <DashboardStatCard title="Total Projects" value={projectCount || 0} subtitle="Listed on platform" icon={FolderKanban} color="blue" />
        <DashboardStatCard title="Total Orders" value={orderCount || 0} subtitle="All time" icon={ClipboardList} color="green" />
        <DashboardStatCard title="Active Orders" value={padCount(activeOrders || 0)} subtitle="In pipeline" icon={Clock} color="orange" trend={activeOrderPct} trendDirection="neutral" />
        <DashboardStatCard title="Completed" value={completedOrders || 0} subtitle="Delivered & closed" icon={CheckCircle2} color="purple" trend={completionRate} trendDirection="up" />
        <DashboardStatCard title="Total Earnings" value={formatCurrency(wallet?.lifetime_earnings || 0)} subtitle="Lifetime commissions" icon={DollarSign} color="teal" largeValue />
        <DashboardStatCard
          title="Available Balance"
          value={formatCurrency(wallet?.available_balance || 0)}
          subtitle={pendingBalance > 0 ? `${formatCurrency(pendingBalance)} pending` : "Ready to withdraw"}
          icon={Wallet}
          color="pink"
          largeValue
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <AgentPanel className="overflow-hidden lg:col-span-2">
          <AgentPanelHeader
            title="Recent Orders"
            description="Latest activity across your projects"
            className="px-4 py-3"
            action={
              <Link href="/agent/orders" className="text-sm font-medium text-[#635BFF] hover:text-[#5248E6]">
                View All
              </Link>
            }
          />
          <ResponsiveTableShell
            className="max-h-[260px] overflow-y-auto"
            table={
          <table className="portal-table portal-table-compact w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Project Name</th>
                <th className="hidden md:table-cell">Service</th>
                <th>Status</th>
                <th className="hidden sm:table-cell">TAT</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                  const project = rel(order.projects);
                  const service = rel(order.services);
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/agent/orders/${order.id}`} className="font-medium text-[#635BFF] hover:underline">
                          #{order.order_number}
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF] text-[10px] font-bold text-[#635BFF]">
                            {(project?.token_symbol || project?.project_name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#0F172A]">{project?.project_name || "—"}</span>
                        </div>
                      </td>
                      <td className="hidden text-[#64748B] md:table-cell">{service?.name || "—"}</td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="hidden text-[#94A3B8] sm:table-cell">{service?.estimated_tat || "—"}</td>
                      <td className="text-right font-semibold text-[#0F172A]">
                        {amount ? formatCurrency(amount) : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>
                    <DashboardEmptyOrders />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            }
            mobile={
              recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const amount = quoteMap.get(order.id) ?? paymentMap.get(order.id) ?? 0;
                  const project = rel(order.projects);
                  const service = rel(order.services);
                  return (
                    <MobileDataCard key={order.id} href={`/agent/orders/${order.id}`}>
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
                        <MobileDataRow label="Amount">{amount ? formatCurrency(amount) : "—"}</MobileDataRow>
                      </div>
                    </MobileDataCard>
                  );
                })
              ) : (
                <DashboardEmptyOrders />
              )
            }
          />
        </AgentPanel>

        <AgentPanel>
          <AgentPanelHeader
            title="Quick Actions"
            description="Shortcuts to common tasks"
            className="px-4 py-3"
          />
          <AgentPanelBody className="p-4">
            <QuickActionsGrid actions={quickActions} />
          </AgentPanelBody>
        </AgentPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AgentPanel>
          <AgentPanelHeader title="Project Status" description="Breakdown by approval stage" className="px-4 py-3" />
          <AgentPanelBody className="p-4">
            {totalProjects > 0 ? (
              <ProjectStatusChart data={projectChartData} total={totalProjects} />
            ) : (
              <p className="py-8 text-center text-sm text-[#94A3B8]">No projects yet</p>
            )}
          </AgentPanelBody>
        </AgentPanel>

        <AgentPanel>
          <AgentPanelHeader title="Top Services" description="Most ordered services" className="px-4 py-3" />
          <AgentPanelBody className="p-4">
            {topServices.length > 0 ? (
              <TopServicesList services={topServices} />
            ) : (
              <p className="py-8 text-center text-sm text-[#94A3B8]">No service orders yet</p>
            )}
          </AgentPanelBody>
        </AgentPanel>

        <AgentPanel>
          <AgentPanelHeader
            title="Earnings Overview"
            description="Monthly commission performance"
            className="px-4 py-3"
          />
          <AgentPanelBody className="p-4">
            <EarningsOverviewCard
              monthEarnings={formatCurrency(monthEarnings)}
              earningsGrowth={earningsGrowth}
              monthLabel={format(now, "MMMM yyyy")}
              chart={<EarningsChart data={earningsChartData} />}
            />
          </AgentPanelBody>
        </AgentPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AgentPanel interactive>
          <AgentPanelBody className="p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FF] ring-1 ring-[#E0E7FF]">
              <Headphones className="h-5 w-5 text-[#635BFF]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Need Help?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
              Our support team is available on Telegram for quick assistance with orders and projects.
            </p>
            {manager?.telegram_link ? (
              <a
                href={manager.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-2.5 text-sm font-medium text-white transition hover:brightness-105"
              >
                <Send className="h-4 w-4" />
                Contact on Telegram
              </a>
            ) : (
              <AgentPrimaryButton href="/agent/support" className="mt-4 w-full">
                Open Support
              </AgentPrimaryButton>
            )}
          </AgentPanelBody>
        </AgentPanel>

        <AgentPanel interactive>
          <AgentPanelBody className="p-4">
            <p className="text-[12px] font-medium uppercase tracking-wider text-[#94A3B8]">Account Manager</p>
            <h3 className="mt-0.5 text-base font-semibold text-[#0F172A]">Your Dedicated Manager</h3>
            {manager ? (
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635BFF] text-base font-bold text-white">
                    {manager.name
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{manager.name}</p>
                    <p className="text-sm text-[#64748B]">{manager.telegram_id}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#94A3B8]">
                  {manager.support_hours || "Mon–Sat 10:00 AM – 7:00 PM IST"}
                </p>
                {manager.telegram_link && (
                  <AgentSecondaryButton href={manager.telegram_link} className="mt-4 w-full">
                    <Send className="h-4 w-4" />
                    Message on Telegram
                  </AgentSecondaryButton>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#64748B]">A dedicated manager will be assigned soon.</p>
            )}
          </AgentPanelBody>
        </AgentPanel>

        <AgentPanel className="border-[#E0E7FF] bg-gradient-to-br from-[#FAFBFF] to-[#F8FAFC]">
          <AgentPanelBody className="p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] ring-1 ring-[#E0E7FF]">
              <Shield className="h-4 w-4 text-[#635BFF]" />
            </div>
            <h3 className="text-base font-semibold text-[#0F172A]">Important Note</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
              All official communication happens only via Telegram. Never share payment details or credentials
              with unverified accounts to avoid scams.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#635BFF]">
              <TrendingUp className="h-4 w-4" />
              Stay safe — verify before you pay
            </div>
          </AgentPanelBody>
        </AgentPanel>
      </div>
    </AgentPageShell>
  );
}
