import Link from "next/link";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { Button } from "@/components/ui/button";

export function PartnerStrip() {
  const items = [...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES];

  return (
    <section className="overflow-hidden border-b border-white/[0.06] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <p className="lh-label text-cyan-400">Partner ecosystems</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">
            Exchanges & platforms we support
          </h2>
        </div>

        <div className="relative -mx-4 sm:mx-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#070b14] to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#070b14] to-transparent sm:w-16" />
          <div className="flex overflow-hidden">
            <div className="lh-marquee flex shrink-0 items-center gap-2.5 sm:gap-4">
              {items.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 sm:rounded-xl sm:px-6 sm:py-3 sm:text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:mt-8 sm:text-xs">
          And 20+ more ecosystems
        </p>

        <div className="mt-6 flex justify-center sm:mt-8">
          <Button
            variant="outline"
            className="h-10 w-full max-w-xs rounded-xl border-white/15 bg-white/5 text-xs font-semibold hover:bg-white/10 sm:h-11 sm:w-auto sm:max-w-none sm:rounded-full sm:px-8 sm:text-sm"
            asChild
          >
            <Link href="/contact">Get a free consultation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
