import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME_LISTING_FEATURES } from "@/lib/home-content";

export function ListingDeepDive() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <p className="lh-label lh-accent">Asset readiness</p>
            <h2 className="lh-display mt-3 text-foreground sm:mt-4">
              Exchange listing{" "}
              <span className="lh-brand-gradient">for launches</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Prepare your token for listing with the right documentation, security signals, and
              coordination — before you spend on the wrong venue.
            </p>

            <div className="mt-8 space-y-4">
              {HOME_LISTING_FEATURES.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-chart-2"
                    strokeWidth={2.25}
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="lh-btn-cta mt-8 h-12 rounded-full px-8 text-sm font-semibold uppercase tracking-wide"
              asChild
            >
              <Link href="/services?category=exchange-listing">
                Explore listing services
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-chart-2/10 p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 landing-grid opacity-20" aria-hidden />
            <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              Works for
            </p>
            <ul className="relative mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "CEX applications",
                "DEX launches",
                "CMC & CoinGecko",
                "Wallet integrations",
                "Explorer updates",
                "Audit coordination",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm font-semibold text-foreground backdrop-blur-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="relative mt-6 text-sm leading-relaxed text-muted-foreground">
              Tokenize visibility across exchanges, data platforms, and wallets — with transparent
              quotes and milestone tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
