import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { buildRevenueSeries, buildRecentActivities } from "@/lib/admin-dashboard";
import { AdminDashboardView } from "@/components/admin/dashboard/admin-dashboard-view";
import type { OrderStatus } from "@/types/database";

export const dynamic = "force-dynamic";

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? "+100%" : undefined;
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function sumInRange(
  items: { created_at: string; amount?: number }[],
  start: Date,
  end: Date,
  field: "amount" | "count" = "count"
) {
  return items
    .filter((item) => {
      const t = new Date(item.created_at).getTime();
      return t >= start.getTime() && t < end.getTime();
    })
    .reduce((sum, item) => sum + (field === "amount" ? Number(item.amount || 0) : 1), 0);
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const profile = await getCurrentUser();

  const now = new Date();
  const periodStart = new Date(now);
  periodStart.setDate(periodStart.getDate() - 30);
  const prevStart = new Date(periodStart);
  prevStart.setDate(prevStart.getDate() - 30);

  const [
    { count: partnerCount },
    { count: userCount },
    { count: orderCount },
    { count: activeProjects },
    { count: pendingKyc },
    { count: pendingProjects },
    { data: allOrderStatuses },
    { data: recentOrders },
    { data: payments },
    { data: commissionCredits },
    { data: pendingWithdrawals },
    { data: openTickets },
    { data: pendingQuotes },
    { data: recentPayments },
    { data: recentOrdersForActivity },
    { data: partnersWithCreated },
    { data: allOrdersWithDates },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "agent"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("kyc_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("orders").select("status"),
    supabase
      .from("orders")
      .select(
        "*, services(name), profiles!orders_agent_id_fkey(full_name), projects(project_name, token_symbol), payments(amount, status)"
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("payments")
      .select("amount, created_at, id")
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("commission_ledger").select("amount").eq("type", "credit"),
    supabase.from("withdrawals").select("amount").eq("status", "pending"),
    supabase.from("tickets").select("id").in("status", ["open", "in_progress"]),
    supabase.from("quotations").select("client_price").eq("status", "sent"),
    supabase
      .from("payments")
      .select("id, amount, created_at")
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select("id, order_number, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("profiles").select("created_at").eq("role", "agent"),
    supabase.from("orders").select("created_at"),
  ]);

  const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const totalCommission =
    commissionCredits?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const withdrawalAmount =
    pendingWithdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;
  const quoteValue =
    pendingQuotes?.reduce((sum, q) => sum + Number(q.client_price), 0) || 0;

  const revenueCurrent = sumInRange(payments || [], periodStart, now, "amount");
  const revenuePrev = sumInRange(payments || [], prevStart, periodStart, "amount");

  const ordersCurrent = sumInRange(allOrdersWithDates || [], periodStart, now);
  const ordersPrev = sumInRange(allOrdersWithDates || [], prevStart, periodStart);

  const partnersCurrent = sumInRange(partnersWithCreated || [], periodStart, now);
  const partnersPrev = sumInRange(partnersWithCreated || [], prevStart, periodStart);

  const revenueSeries = buildRevenueSeries(payments || [], 14);
  const activities = buildRecentActivities({
    orders: recentOrdersForActivity || [],
    payments: recentPayments || [],
    kycCount: pendingKyc || 0,
    projectCount: pendingProjects || 0,
  });

  const adminName = profile?.full_name || profile?.email || "Admin";

  return (
    <AdminDashboardView
      adminName={adminName}
      stats={{
        totalRevenue,
        revenueTrend: calcTrend(revenueCurrent, revenuePrev),
        totalOrders: orderCount || 0,
        ordersTrend: calcTrend(ordersCurrent, ordersPrev),
        totalPartners: partnerCount || 0,
        partnersTrend: calcTrend(partnersCurrent, partnersPrev),
        totalUsers: userCount || 0,
        activeProjects: activeProjects || 0,
        projectsTrend: undefined,
        totalCommission,
        commissionTrend: undefined,
      }}
      revenueSeries={revenueSeries}
      orderStatuses={(allOrderStatuses || []) as { status: OrderStatus }[]}
      recentOrders={recentOrders || []}
      activities={activities}
      actions={{
        pendingWithdrawals: {
          count: pendingWithdrawals?.length || 0,
          amount: withdrawalAmount,
        },
        openTickets: openTickets?.length || 0,
        pendingKyc: pendingKyc || 0,
        totalPartners: partnerCount || 0,
        pendingQuotes: {
          count: pendingQuotes?.length || 0,
          value: quoteValue,
        },
      }}
    />
  );
}
