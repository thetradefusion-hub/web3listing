import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { BecomePartnerForm } from "@/components/partner/onboarding/become-partner-form";
import {
  getPartnerOnboardingPath,
  isPartnerOnboardingComplete,
} from "@/lib/partner-onboarding";
import { getPortalPathForRole } from "@/lib/portal-config";

export const metadata = {
  title: "Become a Partner | Web3Listing",
  description: "Apply to become a Web3Listing partner and earn commissions on marketplace orders.",
};

export default async function BecomePartnerPage() {
  const profile = await getCurrentUser();
  if (profile) {
    if (profile.role === "agent") {
      if (!isPartnerOnboardingComplete(profile)) {
        redirect(
          getPartnerOnboardingPath(profile.partner_onboarding_status, {
            agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
          })
        );
      }
      redirect("/partner");
    }
    redirect(getPortalPathForRole(profile.role));
  }

  return <BecomePartnerForm />;
}
