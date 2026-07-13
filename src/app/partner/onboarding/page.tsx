import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";

export default async function OnboardingIndexPage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  redirect(
    getPartnerOnboardingPath(profile.partner_onboarding_status, {
      agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
    })
  );
}
