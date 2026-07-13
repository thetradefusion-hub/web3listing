import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getPartnerOnboardingPath } from "@/lib/partner-onboarding";
import { signOut } from "@/lib/actions";

export default async function OnboardingPendingPage() {
  const profile = await getCurrentUser();
  if (!profile || profile.role !== "agent") redirect("/login");

  const status = profile.partner_onboarding_status || "none";
  if (status === "active") redirect("/partner");

  if (!profile.partner_agreements_accepted_at) {
    redirect(
      getPartnerOnboardingPath(status, {
        agreementsAccepted: false,
      })
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-chart-4/30 bg-chart-4/10">
        <Clock className="size-7 text-chart-4" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Application under review</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        KYC submitted and agreements accepted. Our team will activate your partner account after
        reviewing your documents. You&apos;ll get an email when you&apos;re approved.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/">Back to website</Link>
        </Button>
        <form
          action={async () => {
            "use server";
            await signOut();
            redirect("/login");
          }}
        >
          <Button type="submit" variant="secondary" className="w-full rounded-xl sm:w-auto">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
