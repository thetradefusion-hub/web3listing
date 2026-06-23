import { createClient } from "@/lib/supabase/server";
import { WithdrawalProcessor } from "@/components/admin/admin-actions";
import { formatCurrency } from "@/lib/commission";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
  rel,
} from "@/components/admin/ui";

function withdrawalVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  if (status === "paid" || status === "approved") return "success";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "muted";
}

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*, profiles!withdrawals_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Withdrawal Management"
        description="Approve withdrawals and upload payment proof"
      />

      {withdrawals && withdrawals.length > 0 ? (
        <div className="space-y-3">
          {withdrawals.map((w) => {
            const profile = rel(w.profiles);
            return (
              <AdminPanel key={w.id}>
                <AdminPanelBody className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {profile?.full_name || profile?.email} — {formatCurrency(w.amount)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {w.method.replace(/_/g, " ")} · {w.wallet_address || w.bank_info || "—"}
                      </p>
                    </div>
                    <AdminBadge variant={withdrawalVariant(w.status)}>{w.status}</AdminBadge>
                  </div>
                  {w.status === "pending" && <WithdrawalProcessor withdrawalId={w.id} />}
                </AdminPanelBody>
              </AdminPanel>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState title="No withdrawals yet" description="Agent withdrawal requests will appear here." />
      )}
    </AdminPageShell>
  );
}
