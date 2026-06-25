import {
  Plus,
  Store,
  Package,
  Wallet,
  Banknote,
  Headphones,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/commission";
import { PartnerDashboardView } from "@/components/partner/dashboard/partner-dashboard-view";
import { rel } from "@/components/partner/ui";
import type { QuickActionColor } from "@/lib/theme-tokens";
import { format, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from "date-fns";

const quickActions: { label: string; href: string; icon: typeof Plus; color: QuickActionColor }[] = [
  { label: "New Project", href: "/partner/projects/new", icon: Plus, color: "blue" },
  { label: "Services", href: "/partner/services", icon: Store, color: "green" },
  { label: "Orders", href: "/partner/orders", icon: Package, color: "orange" },
  { label: "Wallet", href: "/partner/wallet", icon: Wallet, color: "teal" },
  { label: "Withdraw", href: "/partner/wallet", icon: Banknote, color: "purple" },
  { label: "Support", href: "/partner/support", icon: Headphones, color: "pink" },
];

const projectStatusLabels: Record<string, string> = {
  approved: "Approved",
  under_review: "Under Review",
  submitted: "Under Review",
  rejected: "Rejected",
  draft: "Draft",
};

export default async function PartnerDashboard() {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const partnerId = profile!.id;

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
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("agent_id", partnerId),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("agent_id", partnerId),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", partnerId)
      .not("status", "in", "(closed,completed,delivered)"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", partnerId)
      .in("status", ["completed", "delivered", "closed"]),
    supabase.from("wallets").select("*").eq("user_id", partnerId).single(),
    supabase
      .from("orders")
      .select("*, services(name, estimated_tat), projects(project_name, token_symbol, logo_url)")
      .eq("agent_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("projects").select("status").eq("agent_id", partnerId),
    supabase.from("orders").select("service_id, services(name)").eq("agent_id", partnerId),
    supabase
      .from("commission_ledger")
      .select("amount, created_at")
      .eq("user_id", partnerId)
      .eq("type", "credit")
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString()),
    supabase
      .from("commission_ledger")
      .select("amount")
      .eq("user_id", partnerId)
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
    orderCount && activeOrders ? `${Math.round(((activeOrders || 0) / orderCount) * 100)}%` : undefined;
  const completionRate =
    orderCount && completedOrders
      ? `${Math.round(((completedOrders || 0) / orderCount) * 100)}%`
      : undefined;
  const pendingBalance = wallet?.pending_balance || 0;

  return (
    <PartnerDashboardView
      kycRequired={profile?.kyc_status !== "approved"}
      stats={{
        projectCount: projectCount || 0,
        orderCount: orderCount || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0,
        lifetimeEarnings: wallet?.lifetime_earnings || 0,
        availableBalance: wallet?.available_balance || 0,
        pendingBalance,
        activeOrderPct,
        completionRate,
      }}
      recentOrders={recentOrders || []}
      quoteMap={quoteMap}
      paymentMap={paymentMap}
      projectChartData={projectChartData}
      totalProjects={totalProjects}
      topServices={topServices}
      monthEarnings={formatCurrency(monthEarnings)}
      earningsGrowth={earningsGrowth}
      earningsChartData={earningsChartData}
      quickActions={quickActions}
      manager={manager}
    />
  );
}
