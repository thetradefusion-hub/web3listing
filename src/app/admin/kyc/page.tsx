import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
import type { KycSubmission } from "@/types/database";

function documentLabel(type: string | null | undefined) {
  const value = type?.trim();
  if (!value) return "ID Document";
  return value;
}

async function resolveKycDocumentUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("kyc-documents").createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

type KycSubmissionWithUrls = KycSubmission & {
  passport_view_url: string | null;
  selfie_view_url: string | null;
  company_view_url: string | null;
  tax_view_url: string | null;
};

export default async function AdminKycPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("kyc_submissions")
    .select("*, profiles!kyc_submissions_user_id_fkey(full_name, email, company_name, telegram_username, country)")
    .order("created_at", { ascending: false });

  const submissionsWithUrls: KycSubmissionWithUrls[] = await Promise.all(
    (submissions || []).map(async (kyc) => ({
      ...kyc,
      passport_view_url: await resolveKycDocumentUrl(kyc.passport_url),
      selfie_view_url: await resolveKycDocumentUrl(kyc.selfie_url),
      company_view_url: await resolveKycDocumentUrl(kyc.company_registration_url),
      tax_view_url: await resolveKycDocumentUrl(kyc.tax_document_url),
    }))
  );

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="KYC Review"
        description="Review and approve identity submissions from users and partners"
      />

      {submissionsWithUrls.length > 0 ? (
        <div className="space-y-4">
          {submissionsWithUrls.map((kyc) => {
            const profile = rel(kyc.profiles);
            return (
              <AdminPanel key={kyc.id}>
                <AdminPanelHeader
                  title={profile?.full_name || profile?.email || "Unknown User"}
                  action={<AdminBadge variant={kycStatusVariant(kyc.status)}>{kyc.status}</AdminBadge>}
                />
                <AdminPanelBody className="space-y-4">
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    {[
                      ["Email", profile?.email],
                      ["Document Type", documentLabel(kyc.identity_document_type)],
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

                  {kyc.review_notes && kyc.status !== "approved" ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                      <p className="font-semibold">Review notes</p>
                      <p className="mt-1 text-red-800">{kyc.review_notes}</p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    {kyc.passport_view_url ? (
                      <a
                        href={kyc.passport_view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                      >
                        {documentLabel(kyc.identity_document_type)}
                      </a>
                    ) : null}
                    {kyc.selfie_view_url ? (
                      <a
                        href={kyc.selfie_view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                      >
                        Selfie
                      </a>
                    ) : null}
                    {kyc.company_view_url ? (
                      <a
                        href={kyc.company_view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                      >
                        Company Registration
                      </a>
                    ) : null}
                    {kyc.tax_view_url ? (
                      <a
                        href={kyc.tax_view_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                      >
                        Tax Document
                      </a>
                    ) : null}
                  </div>

                  {kyc.status === "pending" ? <KycReviewer userId={kyc.user_id} /> : null}
                </AdminPanelBody>
              </AdminPanel>
            );
          })}
        </div>
      ) : (
        <AdminEmptyState title="No KYC submissions" description="User and partner KYC requests will appear here." />
      )}
    </AdminPageShell>
  );
}
