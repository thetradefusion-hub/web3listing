import Link from "next/link";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { Button } from "@/components/ui/button";
import { HomeSectionHeader } from "@/components/public/home/section-header";

export function PartnerStrip() {
  const items = [...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES];

  return (
    <section className="landing-section overflow-hidden border-b border-border">
      <div className="landing-container">
        <HomeSectionHeader
          label="Partner ecosystems"
          title="Exchanges & platforms we support"
          className="mb-8 sm:mb-10"
        />

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent sm:w-12 lg:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent sm:w-12 lg:w-16" />
          <div className="flex overflow-hidden">
            <div className="lh-marquee flex shrink-0 items-center gap-2.5 sm:gap-4">
              {items.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 rounded-lg border border-border bg-card/80 px-4 py-2 text-xs font-semibold text-foreground/80 sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
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
          <Button
            variant="outline"
            className="h-10 w-full max-w-xs rounded-xl text-xs font-semibold sm:h-11 sm:w-auto sm:max-w-none sm:rounded-full sm:px-8 sm:text-sm"
            asChild
          >
            <Link href="/contact">Get a free consultation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
