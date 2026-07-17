import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Mail } from "lucide-react";
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
      <p className="lh-accent text-[11px] font-semibold uppercase tracking-wide">Step 4 of 4</p>
      <div className="mx-auto mt-4 flex size-16 items-center justify-center rounded-2xl border border-chart-4/30 bg-chart-4/10">
        <Clock className="size-8 text-chart-4" strokeWidth={1.75} />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Application under review
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        KYC submitted and agreements accepted. Our team will activate your partner account after
        reviewing your documents. You&apos;ll get an email when you&apos;re approved.
      </p>

      <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2">
        <li className="rounded-xl border border-border/70 bg-muted/20 px-3.5 py-3">
          <CheckCircle2 className="size-4 text-chart-2" strokeWidth={2.5} />
          <p className="mt-2 text-sm font-semibold text-foreground">Documents received</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Profile, KYC & agreements on file</p>
        </li>
        <li className="rounded-xl border border-border/70 bg-muted/20 px-3.5 py-3">
          <Mail className="size-4 text-primary" strokeWidth={2} />
          <p className="mt-2 text-sm font-semibold text-foreground">Email updates</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            We&apos;ll notify {profile.email || "you"} on approval
          </p>
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button asChild variant="outline" className="h-11 rounded-xl">
          <Link href="/">Back to website</Link>
        </Button>
        <form
          action={async () => {
            "use server";
            await signOut();
            redirect("/login");
          }}
        >
          <Button type="submit" variant="secondary" className="h-11 w-full rounded-xl sm:w-auto">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
