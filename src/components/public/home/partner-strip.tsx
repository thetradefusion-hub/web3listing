import Link from "next/link";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { Button } from "@/components/ui/button";

export function PartnerStrip() {
  const items = [...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES];

  return (
    <section className="landing-section overflow-hidden border-b border-border">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Partner network</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Partner exchanges
            <br />
            <span className="lh-brand-gradient">& launchpads</span>
          </h2>
        </div>

        <div className="relative mt-10 overflow-hidden sm:mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:w-12 lg:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-12 lg:w-16" />
          <div className="flex overflow-hidden">
            <div className="lh-marquee flex shrink-0 items-center gap-2.5 sm:gap-4">
              {items.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground/80 sm:px-6 sm:py-3 sm:text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:mt-8 sm:text-xs">
          And 20+ more ecosystems
        </p>

        <div className="mt-6 flex justify-center sm:mt-8">
          <Button className="lh-btn-cta h-11 w-full max-w-xs rounded-full text-xs font-semibold uppercase tracking-wide sm:h-12 sm:w-auto sm:max-w-none sm:px-8 sm:text-sm" asChild>
            <Link href="/contact">Get a free consultation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
