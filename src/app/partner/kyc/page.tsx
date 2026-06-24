import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { KycForm } from "@/components/partner/kyc-form";
import {
  PartnerPageShell,
  PartnerPageHeader,
  PartnerPanel,
  PartnerPanelHeader,
  PartnerPanelBody,
  PartnerBadge,
  kycStatusVariant,
} from "@/components/partner/ui";

export default async function KycPage({
  searchParams,
}: {
  searchParams: Promise<{ required?: string }>;
}) {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const params = await searchParams;

  const { data: kyc } = await supabase
    .from("kyc_submissions")
    .select("*")
    .eq("user_id", profile!.id)
    .single();

  return (
    <PartnerPageShell narrow>
      {params.required === "true" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          KYC approval is required before you can place orders.
        </div>
      )}

      <PartnerPageHeader
        title="KYC Verification"
        description="Complete identity verification to access all features"
        badge={<PartnerBadge variant={kycStatusVariant(profile!.kyc_status)}>{profile!.kyc_status}</PartnerBadge>}
      />

      <PartnerPanel>
        <PartnerPanelHeader
          title="Personal Information"
          description="Passport/ID, company registration, and selfie verification"
        />
        <PartnerPanelBody>
          <KycForm
            kycStatus={profile!.kyc_status}
            defaultValues={{
              full_name: profile?.full_name || "",
              company_name: profile?.company_name || "",
              mobile: profile?.mobile || "",
              telegram_username: profile?.telegram_username || "",
              country: profile?.country || "",
              passport_url: kyc?.passport_url || "",
              selfie_url: kyc?.selfie_url || "",
              company_registration_url: kyc?.company_registration_url || "",
              tax_document_url: kyc?.tax_document_url || "",
            }}
          />
          {kyc?.review_notes && (
            <p className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Review notes: {kyc.review_notes}
            </p>
          )}
        </PartnerPanelBody>
      </PartnerPanel>
    </PartnerPageShell>
  );
}
