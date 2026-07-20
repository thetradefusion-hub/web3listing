import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAccountManagerForProfile } from "@/lib/account-manager";
import { PartnerPortalShell } from "@/components/partner/portal-shell";
import { PartnerOnboardingShell } from "@/components/partner/onboarding/onboarding-shell";
import {
  getPartnerOnboardingPath,
  isPartnerOnboardingComplete,
} from "@/lib/partner-onboarding";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  if (profile.role !== "agent") {
    if (profile.role === "user") redirect("/user");
    redirect("/admin");
  }

  if (!isPartnerOnboardingComplete(profile)) {
    return (
      <PartnerOnboardingShell
        profile={profile}
        currentPath={getPartnerOnboardingPath(profile.partner_onboarding_status, {
          agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
        })}
      >
        {children}
      </PartnerOnboardingShell>
    );
  }

  const manager = await getAccountManagerForProfile(profile);

  return (
    <PartnerPortalShell profile={profile} manager={manager}>
      {children}
    </PartnerPortalShell>
  );
}
