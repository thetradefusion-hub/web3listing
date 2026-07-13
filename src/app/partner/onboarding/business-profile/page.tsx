import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BusinessProfileForm } from "@/components/partner/onboarding/business-profile-form";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";

export default async function BusinessProfilePage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  const status = profile.partner_onboarding_status || "none";
  if (
    status !== "applied" &&
    status !== "email_verified" &&
    status !== "profile_complete" &&
    status !== "kyc_rejected"
  ) {
    redirect(
      getPartnerOnboardingPath(status, {
        agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
      })
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Business profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us about your company so we can review your partner fit.
      </p>
      <div className="mt-6">
        <BusinessProfileForm
          defaults={{
            company_description: profile.company_description,
            business_type: profile.business_type,
            target_market: profile.target_market,
            existing_client_base: profile.existing_client_base,
            monthly_leads: profile.monthly_leads,
            preferred_services: profile.preferred_services,
          }}
        />
      </div>
    </div>
  );
}
