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
      <p className="lh-accent text-[11px] font-semibold uppercase tracking-wide">Step 3 of 4</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Partner agreements</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Accept the required policies to finish your application.
      </p>
      <div className="mt-7">
        <AgreementsForm />
      </div>
    </div>
  );
}
