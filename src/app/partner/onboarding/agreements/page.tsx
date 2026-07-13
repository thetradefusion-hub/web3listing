import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AgreementsForm } from "@/components/partner/onboarding/agreements-form";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";

export default async function AgreementsPage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  const status = profile.partner_onboarding_status || "none";
  if (profile.partner_agreements_accepted_at) {
    redirect("/partner/onboarding/pending");
  }

  if (status !== "kyc_pending" && status !== "agreements_pending") {
    redirect(
      getPartnerOnboardingPath(status, {
        agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
      })
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Partner agreements</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Accept the required policies to finish your application.
      </p>
      <div className="mt-6">
        <AgreementsForm />
      </div>
    </div>
  );
}
