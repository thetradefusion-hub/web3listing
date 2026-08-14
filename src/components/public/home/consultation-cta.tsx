import Link from "next/link";
import { CollaborateForm } from "@/components/public/home/collaborate-form";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConsultationCtaProps = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  withForm?: boolean;
  className?: string;
};

export function ConsultationCta({
  title = "Kick-off your project now",
  subtitle = "Get expert guidance for your listing & growth path. Request a free consultation today.",
  primaryLabel = "Schedule a call",
  primaryHref = "/contact",
  secondaryLabel = "Talk on Telegram",
  secondaryHref,
  withForm = true,
  className,
}: ConsultationCtaProps) {
  const secondaryIsTelegram = !secondaryHref;

  return (
    <section className={cn("landing-section border-b border-border", className)}>
      <div className="landing-container">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card to-chart-2/10 px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute inset-0 landing-grid opacity-20" aria-hidden />
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-chart-2/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />

          <div
            className={cn(
              "relative grid gap-10",
              withForm && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12"
            )}
          >
            <div className={cn(!withForm && "mx-auto max-w-2xl text-center")}>
              <p className="lh-label lh-accent">Get started</p>
              <h2 className="lh-display mt-3 text-foreground">{title}</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {subtitle}
              </p>

              <div
                className={cn(
                  "mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3",
                  !withForm && "justify-center"
                )}
              >
                <Button
                  size="lg"
                  className="lh-btn-cta h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide"
                  asChild
                >
                  <Link href={primaryHref}>{primaryLabel}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border/80 bg-background/60 px-8 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm"
                  asChild
                >
                  {secondaryIsTelegram ? (
                    <TelegramAnchor href={TELEGRAM_SUPPORT}>{secondaryLabel}</TelegramAnchor>
                  ) : (
                    <Link href={secondaryHref}>{secondaryLabel}</Link>
                  )}
                </Button>
              </div>
            </div>

            {withForm ? <CollaborateForm compact /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
