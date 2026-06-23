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
    <section className="py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-[#0c1222] to-violet-600/10 px-5 py-8 text-center sm:rounded-2xl sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 landing-grid opacity-30" />
          <div className="relative">
            <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {subtitle}
            </p>
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 hover:bg-cyan-400 sm:h-12 sm:w-auto sm:rounded-full sm:px-8"
                asChild
              >
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full rounded-xl border-white/15 bg-white/5 text-sm font-semibold hover:bg-white/10 sm:h-12 sm:w-auto sm:rounded-full sm:px-8"
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
