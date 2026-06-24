import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PaymentVerifier } from "@/components/admin/admin-actions";
import { formatCurrency } from "@/lib/commission";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
  AdminFilterPill,
  rel,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function paymentVariant(status: string): "success" | "warning" | "danger" | "info" | "muted" {
  if (status === "confirmed") return "success";
  if (status === "awaiting_verification") return "warning";
  if (status === "failed") return "danger";
  return "muted";
}

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "awaiting_verification", label: "Needs Verification" },
  { value: "pending", label: "Awaiting Proof" },
  { value: "confirmed", label: "Confirmed" },
] as const;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select("*, orders(order_number, agent_id, profiles!orders_agent_id_fkey(full_name, email))")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data: payments, error } = await query;

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Payment Verification"
        description="Review partner payment proofs and confirm received funds"
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <AdminFilterPill
            key={f.value || "all"}
            href={f.value ? `/admin/payments?status=${f.value}` : "/admin/payments"}
            active={statusFilter === f.value || (!statusFilter && f.value === "")}
          >
            {f.label}
          </AdminFilterPill>
        ))}
      </div>

      {error ? (
        <AdminEmptyState title="Could not load payments" description={error.message} />
      ) : payments && payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment) => {
            const order = rel(payment.orders);
            const partner = rel(order?.profiles);
            return (
              <AdminPanel key={payment.id}>
                <AdminPanelBody>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <Link
                        href={`/admin/orders/${payment.order_id}`}
                        className="font-semibold text-violet-600 hover:underline"
                      >
                        #{order?.order_number || "—"}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        {partner?.full_name || partner?.email || "—"} · {formatCurrency(payment.amount)}
                      </p>
                      {payment.proof_url && (
                        <a
                          href={payment.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs font-medium text-violet-600 hover:underline"
                        >
                          View payment proof
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <AdminBadge variant={paymentVariant(payment.status)}>
                        {payment.status.replace(/_/g, " ")}
                      </AdminBadge>
                      {payment.status === "awaiting_verification" && (
                        <PaymentVerifier paymentId={payment.id} />
                      )}
                    </div>
                  </div>
                </AdminPanelBody>
              </AdminPanel>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState
          title="No payment records yet"
          description="Payments appear here automatically when an partner places a fixed-price order or accepts a quotation."
          action={
            <div className="max-w-lg space-y-2 text-left text-sm text-slate-500">
              <p className="font-medium text-slate-700">How payments show up:</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Partner places a fixed-price order → payment row created (pending)</li>
                <li>Or admin sends a quote → payment row created when quote is sent</li>
                <li>Partner uploads payment proof → status becomes awaiting verification</li>
                <li>Admin confirms here → status becomes confirmed</li>
              </ol>
              <Link href="/admin/orders" className="mt-3 inline-block text-sm font-medium text-violet-600 hover:underline">
                Check orders waiting for payment →
              </Link>
            </div>
          }
        />
      )}
    </AdminPageShell>
  );
}
