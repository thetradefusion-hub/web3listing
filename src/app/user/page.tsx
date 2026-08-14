import {
  Plus,
  Store,
  Package,
  Headphones,
  FolderKanban,
  ClipboardList,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { UserDashboardView } from "@/components/user/dashboard/user-dashboard-view";
import { rel } from "@/components/partner/ui";
import type { QuickActionColor } from "@/lib/theme-tokens";
import type { OrderStatus } from "@/types/database";

const quickActions: { label: string; href: string; icon: typeof Plus; color: QuickActionColor }[] = [
  { label: "New Project", href: "/user/projects/new", icon: Plus, color: "blue" },
  { label: "Services", href: "/user/services", icon: Store, color: "green" },
  { label: "Orders", href: "/user/orders", icon: Package, color: "orange" },
  { label: "Custom Req.", href: "/user/custom-requirements/new", icon: ClipboardList, color: "purple" },
  { label: "Support", href: "/user/support", icon: Headphones, color: "pink" },
];

const projectStatusLabels: Record<string, string> = {
  approved: "Approved",
  under_review: "Under Review",
  submitted: "Under Review",
  rejected: "Rejected",
  draft: "Draft",
};

const PENDING_STATUSES: OrderStatus[] = ["submitted", "under_review", "waiting_payment"];
const ACTIVE_STATUSES: OrderStatus[] = ["payment_confirmed", "in_progress", "third_party_review"];

export default async function UserDashboard() {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const userId = profile!.id;

  const [
    { count: projectCount },
    { count: orderCount },
    { count: activeOrders },
    { count: completedOrders },
    { count: pendingOrders },
    { data: recentOrders },
    { data: allOrderStatuses },
    { data: projects },
    { data: allOrders },
    { data: manager },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("agent_id", userId),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("agent_id", userId),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", userId)
      .in("status", ACTIVE_STATUSES),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", userId)
      .in("status", ["completed", "delivered", "closed"]),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", userId)
      .in("status", PENDING_STATUSES),
    supabase
      .from("orders")
      .select("id, order_number, status, services(name), projects(project_name, token_symbol)")
      .eq("agent_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("status").eq("agent_id", userId),
    supabase.from("projects").select("status").eq("agent_id", userId),
    supabase.from("orders").select("service_id, services(name)").eq("agent_id", userId),
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
    orderCount && activeOrders ? `${Math.round(((activeOrders || 0) / orderCount) * 100)}% active` : undefined;
  const completionRate =
    orderCount && completedOrders != null
      ? `${Math.round(((completedOrders || 0) / orderCount) * 100)}%`
      : orderCount
        ? "0%"
        : "—";

  return (
    <UserDashboardView
      stats={{
        projectCount: projectCount || 0,
        orderCount: orderCount || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0,
        pendingOrders: pendingOrders || 0,
        activeOrderPct,
        completionRate,
      }}
      recentOrders={recentOrders || []}
      quoteMap={quoteMap}
      paymentMap={paymentMap}
      orderStatusData={(allOrderStatuses || []) as { status: OrderStatus }[]}
      projectChartData={projectChartData}
      totalProjects={totalProjects}
      topServices={topServices}
      quickActions={quickActions}
      manager={manager}
    />
  );
}
