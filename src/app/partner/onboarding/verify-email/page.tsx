import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";

/** Email OTP temporarily disabled — send users to the next onboarding step. */
export default async function VerifyEmailPage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  redirect(
    getPartnerOnboardingPath(profile.partner_onboarding_status, {
      agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
    })
  );
}
