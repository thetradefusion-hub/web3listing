import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PACKAGES } from "@/lib/home-content";
import { HomeSectionHeader } from "@/components/public/home/section-header";
import { cn } from "@/lib/utils";

export function PricingPackages() {
  return (
    <section className="landing-section border-y landing-section-alt">
      <div className="landing-container">
        <HomeSectionHeader label="Pricing" title="Choose your package" className="mb-8 sm:mb-14" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PRICING_PACKAGES.map((pkg) => (
            <article
              key={pkg.name}
              className={cn(
                "relative flex flex-col rounded-xl border p-5 sm:rounded-2xl sm:p-7 lg:p-8",
                pkg.featured
                  ? "border-primary/40 bg-gradient-to-b from-primary/10 via-card to-card shadow-lg shadow-primary/10 lg:scale-[1.02]"
                  : "border-border bg-card/80"
              )}
            >
              {pkg.featured ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-chart-2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]">
                  Most popular
                </span>
              ) : null}

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
                  {pkg.name}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-foreground sm:mt-2 sm:text-2xl">{pkg.subtitle}</h3>
                <span className="mt-2 inline-block max-w-full rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:mt-3 sm:px-3 sm:py-1 sm:text-[11px]">
                  {pkg.badge}
                </span>
              </div>

              <div className="mt-5 border-t border-border pt-5 sm:mt-8 sm:pt-8">
                <p className="text-xl font-extrabold text-foreground sm:text-3xl">{pkg.price}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pkg.priceNote}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-2 sm:mt-8 sm:space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2" />
                    <span className="min-w-0 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-5 h-11 w-full rounded-xl text-sm font-semibold sm:mt-8 sm:h-12",
                  pkg.featured
                    ? "lh-btn-cta sm:rounded-full"
                    : "sm:rounded-full"
                )}
                variant={pkg.featured ? "default" : "outline"}
                asChild
              >
                <Link href={pkg.href}>{pkg.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
