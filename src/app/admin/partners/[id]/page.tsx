import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PartnerActions } from "@/components/admin/partner-actions";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelHeader,
  AdminPanelBody,
  AdminBadge,
  kycStatusVariant,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { PARTNER_AGREEMENT_VERSION } from "@/lib/constants";
import type { PartnerOnboardingStatus } from "@/types/database";

async function resolveKycDocumentUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("kyc-documents").createSignedUrl(path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-slate-800">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function onboardingLabel(status?: PartnerOnboardingStatus | null) {
  return (status || "none").replace(/_/g, " ");
}

export default async function AdminPartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: partner } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "agent")
    .maybeSingle();

  if (!partner) notFound();

  const [{ data: kyc }, { data: agreement }, { count: orderCount }] = await Promise.all([
    supabase.from("kyc_submissions").select("*").eq("user_id", id).maybeSingle(),
    supabase
      .from("partner_agreements")
      .select("*")
      .eq("user_id", id)
      .order("accepted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", id),
  ]);

  const [
    passportUrl,
    selfieUrl,
    companyUrl,
    taxUrl,
    addressUrl,
    repIdUrl,
  ] = await Promise.all([
    resolveKycDocumentUrl(kyc?.passport_url),
    resolveKycDocumentUrl(kyc?.selfie_url),
    resolveKycDocumentUrl(kyc?.company_registration_url),
    resolveKycDocumentUrl(kyc?.tax_document_url),
    resolveKycDocumentUrl(kyc?.address_proof_url),
    resolveKycDocumentUrl(kyc?.authorized_rep_id_url),
  ]);

  const docs = [
    { label: kyc?.identity_document_type || "ID Document", url: passportUrl },
    { label: "Selfie with ID", url: selfieUrl },
    { label: "Company Registration", url: companyUrl },
    { label: "Tax Document", url: taxUrl },
    { label: "Address Proof", url: addressUrl },
    { label: "Authorized Rep ID", url: repIdUrl },
  ].filter((d) => d.url);

  const acceptedPolicies: string[] = Array.isArray(agreement?.accepted_policies)
    ? (agreement.accepted_policies as string[])
    : [];

  return (
    <AdminPageShell className="mx-auto max-w-5xl">
      <div className="mb-2">
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
          <Link href="/admin/partners">
            <ArrowLeft className="size-4" />
            Back to partners
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title={partner.full_name || partner.email}
        description={partner.email}
        badge={
          <div className="flex flex-wrap gap-2">
            <AdminBadge variant={kycStatusVariant(partner.kyc_status)}>
              KYC: {partner.kyc_status}
            </AdminBadge>
            <AdminBadge variant="muted">
              {onboardingLabel(partner.partner_onboarding_status)}
            </AdminBadge>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {orderCount || 0} orders · Joined {formatDate(partner.created_at)}
        </p>
        <PartnerActions
          partnerId={partner.id}
          email={partner.email}
          kycStatus={partner.kyc_status}
        />
      </div>

      <div className="space-y-4">
        <AdminPanel>
          <AdminPanelHeader title="Contact & account" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            <Field label="Full name" value={partner.full_name} />
            <Field label="Email" value={partner.email} />
            <Field label="Mobile" value={partner.mobile} />
            <Field
              label="Telegram"
              value={
                partner.telegram_username
                  ? `@${partner.telegram_username.replace(/^@/, "")}`
                  : null
              }
            />
            <Field label="Country" value={partner.country} />
            <Field label="Company" value={partner.company_name} />
            <Field label="Website" value={partner.partner_website} />
            <Field label="Wallet" value={partner.wallet_address} />
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Application details" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            <Field label="Years of experience" value={partner.years_of_experience} />
            <Field label="Monthly client volume" value={partner.monthly_client_volume} />
            <div className="md:col-span-2">
              <Field label="Services offered" value={partner.services_offered} />
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Business profile" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Company description" value={partner.company_description} />
            </div>
            <Field label="Business type" value={partner.business_type} />
            <Field label="Target market" value={partner.target_market} />
            <Field label="Existing client base" value={partner.existing_client_base} />
            <Field label="Monthly leads" value={partner.monthly_leads} />
            <div className="md:col-span-2">
              <Field label="Preferred marketplace services" value={partner.preferred_services} />
            </div>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Onboarding status" />
          <AdminPanelBody className="grid gap-3 md:grid-cols-2">
            <Field label="Status" value={onboardingLabel(partner.partner_onboarding_status)} />
            <Field label="KYC status" value={partner.kyc_status} />
            <Field label="Email verified at" value={formatDate(partner.email_verified_at)} />
            <Field
              label="Agreements accepted at"
              value={formatDate(partner.partner_agreements_accepted_at)}
            />
            <Field label="Activated at" value={formatDate(partner.partner_activated_at)} />
            <Field label="Last updated" value={formatDate(partner.updated_at)} />
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader
            title="KYC documents"
            action={
              kyc ? (
                <AdminBadge variant={kycStatusVariant(kyc.status)}>{kyc.status}</AdminBadge>
              ) : undefined
            }
          />
          <AdminPanelBody className="space-y-4">
            {!kyc ? (
              <p className="text-sm text-muted-foreground">No KYC submission yet.</p>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="ID document type" value={kyc.identity_document_type} />
                  <Field label="Reviewed at" value={formatDate(kyc.reviewed_at)} />
                  {kyc.review_notes ? (
                    <div className="md:col-span-2">
                      <Field label="Review notes" value={kyc.review_notes} />
                    </div>
                  ) : null}
                </div>
                {docs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {docs.map((doc) => (
                      <a
                        key={doc.label}
                        href={doc.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
                      >
                        {doc.label}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document files uploaded.</p>
                )}
              </>
            )}
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Partner agreements" />
          <AdminPanelBody className="space-y-3">
            {!agreement ? (
              <p className="text-sm text-muted-foreground">Agreements not accepted yet.</p>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field
                    label="Agreement version"
                    value={agreement.agreement_version || PARTNER_AGREEMENT_VERSION}
                  />
                  <Field label="Accepted at" value={formatDate(agreement.accepted_at)} />
                  <Field label="IP address" value={agreement.ip_address} />
                  <Field label="Device / user agent" value={agreement.user_agent} />
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Accepted policies
                  </p>
                  {acceptedPolicies.length ? (
                    <ul className="mt-2 list-inside list-disc text-sm font-medium text-slate-800">
                      {acceptedPolicies.map((policy) => (
                        <li key={policy}>{policy.replace(/_/g, " ")}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-slate-800">—</p>
                  )}
                </div>
              </>
            )}
          </AdminPanelBody>
        </AdminPanel>
      </div>
    </AdminPageShell>
  );
}
