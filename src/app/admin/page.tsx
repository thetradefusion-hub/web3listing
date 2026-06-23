import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/commission";
import { Users, Package, DollarSign, UserCheck, Clock, FolderKanban } from "lucide-react";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminStatCard,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  OrderStatusBadge,
  rel,
} from "@/components/admin/ui";
import {
  MobileDataCard,
  MobileDataRow,
  ResponsiveTableShell,
} from "@/components/shared/responsive-table";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: agentCount },
    { count: orderCount },
    { count: pendingOrders },
    { count: pendingKyc },
    { count: pendingProjects },
    { data: recentOrders },
    { data: payments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "agent"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).in("status", ["submitted", "under_review", "waiting_payment"]),
    supabase.from("kyc_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("orders").select("*, services(name), profiles!orders_agent_id_fkey(full_name)").order("created_at", { ascending: false }).limit(8),
    supabase.from("payments").select("amount").eq("status", "confirmed"),
  ]);

  const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const quickLinks = [
    { href: "/admin/projects", label: "Review Projects" },
    { href: "/admin/orders", label: "Manage Orders" },
    { href: "/admin/payments", label: "Verify Payments" },
    { href: "/admin/withdrawals", label: "Process Withdrawals" },
    { href: "/admin/agents", label: "Manage Agents" },
  ];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Overview"
        description="System metrics and pending actions"
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <AdminStatCard title="Total Agents" value={agentCount || 0} subtitle="Registered" icon={Users} color="blue" />
        <AdminStatCard title="Total Orders" value={orderCount || 0} subtitle="All time" icon={Package} color="green" />
        <AdminStatCard title="Pending Actions" value={pendingOrders || 0} subtitle="Needs review" icon={Clock} color="orange" />
        <AdminStatCard title="Pending KYC" value={pendingKyc || 0} subtitle="Awaiting approval" icon={UserCheck} color="purple" />
        <AdminStatCard title="Pending Projects" value={pendingProjects || 0} subtitle="Awaiting review" icon={FolderKanban} color="purple" />
        <AdminStatCard title="Revenue" value={formatCurrency(totalRevenue)} subtitle="Confirmed payments" icon={DollarSign} color="teal" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminPanel>
          <AdminPanelHeader title="Pending KYC" description="Agent verification queue" />
          <AdminPanelBody>
            <p className="text-[36px] font-bold leading-none text-[#0F172A]">{pendingKyc || 0}</p>
            <Link href="/admin/kyc" className="mt-4 inline-block text-sm font-medium text-[#635BFF] hover:underline">
              Review KYC submissions →
            </Link>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Pending Projects" description="Token projects awaiting approval" />
          <AdminPanelBody>
            <p className="text-[36px] font-bold leading-none text-[#0F172A]">{pendingProjects || 0}</p>
            <Link href="/admin/projects?status=submitted" className="mt-4 inline-block text-sm font-medium text-[#635BFF] hover:underline">
              Review project submissions →
            </Link>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Quick Links" />
          <AdminPanelBody className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-3 text-sm font-medium text-[#64748B] transition hover:border-[#E2E8F0] hover:bg-white hover:text-[#0F172A]"
              >
                {link.label}
                <span className="text-[#635BFF]">→</span>
              </Link>
            ))}
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <AdminPanel className="overflow-hidden">
        <AdminPanelHeader
          title="Recent Orders"
          action={
            <Link href="/admin/orders" className="text-sm font-medium text-[#635BFF] hover:text-[#5248E6]">
              View All
            </Link>
          }
        />
        <ResponsiveTableShell
          table={
          <table className="portal-table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Service</th>
                <th className="hidden sm:table-cell">Agent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const service = rel(order.services);
                  const agent = rel(order.profiles);
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#635BFF] hover:underline">
                          #{order.order_number}
                        </Link>
                      </td>
                      <td className="text-[#64748B]">{service?.name || "—"}</td>
                      <td className="hidden text-[#64748B] sm:table-cell">{agent?.full_name || "—"}</td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[#94A3B8]">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          }
          mobile={
            recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const service = rel(order.services);
                const agent = rel(order.profiles);
                return (
                  <MobileDataCard key={order.id} href={`/admin/orders/${order.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[#635BFF]">#{order.order_number}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <MobileDataRow label="Service">{service?.name || "—"}</MobileDataRow>
                      <MobileDataRow label="Agent">{agent?.full_name || "—"}</MobileDataRow>
                    </div>
                  </MobileDataCard>
                );
              })
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No orders yet</p>
            )
          }
        />
      </AdminPanel>
    </AdminPageShell>
  );
}
