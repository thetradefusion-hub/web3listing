import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { UserDashboardView } from "@/components/user/dashboard/user-dashboard-view";
import { rel } from "@/components/user/ui";
import type { OrderStatus } from "@/types/database";

const PENDING_STATUSES: OrderStatus[] = ["submitted", "under_review", "waiting_payment"];

export default async function UserDashboard() {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const userId = profile!.id;

  const [
    { count: orderCount },
    { count: activeOrders },
    { count: completedOrders },
    { count: pendingOrders },
    { data: recentOrders },
    { data: allOrderStatuses },
    { data: featuredProject },
    { data: recommendedRaw },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("agent_id", userId),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", userId)
      .not("status", "in", "(closed,completed,delivered)"),
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
      .select("id, order_number, status, created_at, services(name), projects(project_name, token_symbol)")
      .eq("agent_id", userId)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase.from("orders").select("status").eq("agent_id", userId),
    supabase
      .from("projects")
      .select("*")
      .eq("agent_id", userId)
      .in("status", ["approved", "submitted"])
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("services")
      .select("*, service_categories(name, slug)")
      .eq("is_active", true)
      .order("sort_order")
      .limit(12),
  ]);

  let projectOrderCount = 0;
  if (featuredProject) {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("project_id", featuredProject.id);
    projectOrderCount = count || 0;
  }

  const recommendedServices = (recommendedRaw || [])
    .sort((a, b) => {
      const score = (s: typeof a) => (s.badge === "hot" || s.badge === "popular" ? 0 : 1);
      return score(a) - score(b) || a.sort_order - b.sort_order;
    })
    .slice(0, 4)
    .map((s) => ({
      ...s,
      service_categories: rel(s.service_categories),
    }));

  return (
    <UserDashboardView
      profile={profile!}
      stats={{
        orderCount: orderCount || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0,
        pendingOrders: pendingOrders || 0,
      }}
      recentOrders={recentOrders || []}
      orderStatusData={(allOrderStatuses || []) as { status: OrderStatus }[]}
      featuredProject={featuredProject}
      projectOrderCount={projectOrderCount}
      recommendedServices={recommendedServices}
    />
  );
}
