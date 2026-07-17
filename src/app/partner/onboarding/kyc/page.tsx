import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { KycForm } from "@/components/partner/kyc-form";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";

export default async function OnboardingKycPage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  const status = profile.partner_onboarding_status || "none";
  const allowed = ["profile_complete", "kyc_rejected", "kyc_pending"];
  if (!allowed.includes(status)) {
    redirect(
      getPartnerOnboardingPath(status, {
        agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
      })
    );
  }

  // Already submitted KYC — move to agreements / pending
  if (status === "kyc_pending" && profile.kyc_status === "pending") {
    redirect(
      getPartnerOnboardingPath("kyc_pending", {
        agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
      })
    );
  }

  const supabase = await createClient();
  const { data: kyc } = await supabase
    .from("kyc_submissions")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();

  const underReview = profile.kyc_status === "pending" && Boolean(kyc);

  return (
    <div>
      <p className="lh-accent text-[11px] font-semibold uppercase tracking-wide">Step 2 of 4</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">KYC verification</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload identity, address proof, and authorized representative ID.
      </p>
      <div className="mt-7">
        <KycForm
          kycStatus={profile.kyc_status}
          underReview={underReview}
          partnerOnboarding
          defaultValues={{
            full_name: profile.full_name || "",
            company_name: profile.company_name || "",
            mobile: profile.mobile || "",
            telegram_username: profile.telegram_username || "",
            country: profile.country || "",
            identity_document_type: kyc?.identity_document_type || "Passport",
            passport_url: kyc?.passport_url || "",
            selfie_url: kyc?.selfie_url || "",
            company_registration_url: kyc?.company_registration_url || "",
            tax_document_url: kyc?.tax_document_url || "",
            address_proof_url: kyc?.address_proof_url || "",
            authorized_rep_id_url: kyc?.authorized_rep_id_url || "",
          }}
        />
      </div>
    </div>
  );
}
