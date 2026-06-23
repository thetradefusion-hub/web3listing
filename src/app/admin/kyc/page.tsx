import { createClient } from "@/lib/supabase/server";
import { KycReviewer } from "@/components/admin/admin-actions";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  AdminBadge,
  kycStatusVariant,
  AdminEmptyState,
  rel,
} from "@/components/admin/ui";

export default async function AdminKycPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("kyc_submissions")
    .select("*, profiles!kyc_submissions_user_id_fkey(full_name, email, company_name, telegram_username, country)")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="KYC Review"
        description="Review and approve agent identity submissions"
      />

      {submissions && submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((kyc) => {
            const profile = rel(kyc.profiles);
            return (
              <AdminPanel key={kyc.id}>
                <AdminPanelHeader
                  title={profile?.full_name || profile?.email || "Unknown Agent"}
                  action={<AdminBadge variant={kycStatusVariant(kyc.status)}>{kyc.status}</AdminBadge>}
                />
                <AdminPanelBody className="space-y-4">
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    {[
                      ["Email", profile?.email],
                      ["Company", profile?.company_name || "—"],
                      ["Telegram", profile?.telegram_username || "—"],
                      ["Country", profile?.country || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="mt-1 font-medium text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {kyc.passport_url && (
                      <a href={kyc.passport_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100">
                        Passport / ID
                      </a>
                    )}
                    {kyc.selfie_url && (
                      <a href={kyc.selfie_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100">
                        Selfie
                      </a>
                    )}
                    {kyc.company_registration_url && (
                      <a href={kyc.company_registration_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100">
                        Company Registration
                      </a>
                    )}
                  </div>
                  {kyc.status === "pending" && <KycReviewer userId={kyc.user_id} />}
                </AdminPanelBody>
              </AdminPanel>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState title="No KYC submissions" description="Agent KYC requests will appear here." />
      )}
    </AdminPageShell>
  );
}
