import Link from "next/link";
import { Button } from "@/components/ui/button";

type ConsultationCtaProps = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function ConsultationCta({
  title = "Get a free consultation",
  subtitle = "Tell us about your project and we'll recommend the right listing and growth path.",
  primaryLabel = "Book a call",
  primaryHref = "/contact",
  secondaryLabel = "Browse services",
  secondaryHref = "/services",
}: ConsultationCtaProps) {
  return (
    <section className="landing-section-tight">
      <div className="landing-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-chart-2/10 px-5 py-10 text-center sm:rounded-3xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 landing-grid opacity-20" />
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-chart-2/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative min-w-0">
            <h2 className="lh-display text-foreground">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
            <div className="mx-auto mt-7 flex w-full max-w-md flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3">
              <Button
                size="lg"
                className="lh-btn-cta h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wide sm:w-auto sm:px-8"
                asChild
              >
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full text-sm font-semibold uppercase tracking-wide sm:w-auto sm:px-8"
                asChild
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
