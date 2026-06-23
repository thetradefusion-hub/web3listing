import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { WithdrawalForm } from "@/components/agent/withdrawal-form";
import { formatCurrency } from "@/lib/commission";
import { Wallet, TrendingUp, Clock } from "lucide-react";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentStatCard,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  AgentBadge,
  AgentEmptyState,
} from "@/components/agent/ui";

function withdrawalVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  if (status === "paid" || status === "approved") return "success";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "muted";
}

export default async function AgentWalletPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: wallet }, { data: ledger }, { data: withdrawals }] = await Promise.all([
    supabase.from("wallets").select("*").eq("user_id", profile!.id).single(),
    supabase.from("commission_ledger").select("*").eq("user_id", profile!.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("withdrawals").select("*").eq("user_id", profile!.id).order("created_at", { ascending: false }),
  ]);

  return (
    <AgentPageShell>
      <AgentPageHeader
        title="Wallet & Earnings"
        description="Commission balance, withdrawals, and transaction history"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AgentStatCard title="Available Balance" value={formatCurrency(wallet?.available_balance || 0)} subtitle="Ready to withdraw" icon={Wallet} color="teal" />
        <AgentStatCard title="Pending Balance" value={formatCurrency(wallet?.pending_balance || 0)} subtitle="Processing" icon={Clock} color="orange" />
        <AgentStatCard title="Lifetime Earnings" value={formatCurrency(wallet?.lifetime_earnings || 0)} subtitle="All time" icon={TrendingUp} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AgentPanel>
          <AgentPanelHeader title="Request Withdrawal" description="Withdraw your available commission balance" />
          <AgentPanelBody>
            <WithdrawalForm availableBalance={wallet?.available_balance || 0} />
          </AgentPanelBody>
        </AgentPanel>

        <AgentPanel>
          <AgentPanelHeader title="Withdrawal History" />
          <AgentPanelBody className="space-y-2">
            {withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <span className="font-medium text-slate-800">{formatCurrency(w.amount)}</span>
                  <AgentBadge variant={withdrawalVariant(w.status)}>{w.status}</AgentBadge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No withdrawals yet</p>
            )}
          </AgentPanelBody>
        </AgentPanel>
      </div>

      <AgentPanel>
        <AgentPanelHeader title="Commission Ledger" description="Recent credits and debits" />
        <AgentPanelBody className="space-y-2">
          {ledger && ledger.length > 0 ? (
            ledger.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm">
                <div>
                  <span className={entry.type === "credit" ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                    {entry.type === "credit" ? "+" : "-"}{formatCurrency(entry.amount)}
                  </span>
                  <p className="text-xs text-slate-500">{entry.description}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <AgentEmptyState title="No ledger entries yet" description="Commissions will appear here after completed orders." />
          )}
        </AgentPanelBody>
      </AgentPanel>
    </AgentPageShell>
  );
}
