import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/commission";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminStatCard,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  rel,
} from "@/components/admin/ui";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: orders }, { data: agents }, { data: commissions }] = await Promise.all([
    supabase.from("payments").select("amount, status, created_at").eq("status", "confirmed"),
    supabase.from("orders").select("status, service_id, services(name)"),
    supabase.from("profiles").select("id, full_name").eq("role", "agent"),
    supabase.from("commission_ledger").select("amount, user_id, profiles!commission_ledger_user_id_fkey(full_name)").eq("type", "credit"),
  ]);

  const totalRevenue = payments?.reduce((s, p) => s + Number(p.amount), 0) || 0;
  const totalCommissions = commissions?.reduce((s, c) => s + Number(c.amount), 0) || 0;

  const serviceCounts: Record<string, number> = {};
  orders?.forEach((o) => {
    const svc = rel(o.services);
    const name = svc?.name || "Unknown";
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });

  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Reports & Analytics"
        description="Revenue, agent performance, and service statistics"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard title="Total Revenue" value={formatCurrency(totalRevenue)} subtitle="Confirmed payments" icon={DollarSign} color="teal" />
        <AdminStatCard title="Commissions Paid" value={formatCurrency(totalCommissions)} subtitle="Agent earnings" icon={TrendingUp} color="purple" />
        <AdminStatCard title="Active Agents" value={agents?.length || 0} subtitle="Registered" icon={Users} color="blue" />
      </div>

      <AdminPanel>
        <AdminPanelHeader title="Service-wise Orders" description="Most ordered services" />
        <AdminPanelBody className="space-y-3">
          {topServices.length > 0 ? (
            topServices.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-800">{name}</span>
                <span className="text-sm font-semibold text-slate-600">{count} orders</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No order data yet</p>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </AdminPageShell>
  );
}
