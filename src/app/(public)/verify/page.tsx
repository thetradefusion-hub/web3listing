import Link from "next/link";
import { Shield } from "lucide-react";
import { PartnerVerifyForm } from "@/components/public/verify/partner-verify-form";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Verify Partner",
  description: `Check whether an email, mobile number, Telegram username, or partner ID is an official ${SITE_NAME} partner.`,
};

export default function VerifyPartnerPage() {
  return (
    <section className="services-marketplace relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-chart-2/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 size-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="landing-container relative py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="services-hero-badge mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-3.5 py-1.5 backdrop-blur-sm">
            <Shield className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
              Partner verification
            </span>
          </div>

          <h1 className="lh-display mt-5 text-foreground sm:mt-6">
            Verify <span className="lh-brand-gradient">partner contact</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
            Check whether a URL contact detail — email, mobile number, Telegram username, or partner
            ID — belongs to an official active {SITE_NAME} partner. This helps protect you from scam
            attempts.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <PartnerVerifyForm />
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:mt-14 sm:grid-cols-2">
          <div className="rounded-2xl border border-chart-2/20 bg-chart-2/5 px-4 py-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-chart-2">Verified source</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Contact matches an active partner in our database.
            </p>
          </div>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-destructive">
              Unverified source
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              No active partner match — treat with caution.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Contact us
          </Link>{" "}
          or{" "}
          <Link href="/become-a-partner" className="font-semibold text-primary hover:underline">
            become a partner
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
