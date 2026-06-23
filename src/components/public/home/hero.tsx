import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_STATS } from "@/lib/home-content";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/[0.04] via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(100%,720px)] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-12 text-center sm:px-6 sm:pb-20 sm:pt-16 md:pt-20 lg:pb-24 lg:pt-24">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-medium tracking-wide text-slate-300 sm:px-4 sm:text-xs">
          Web3 listing & growth platform
        </span>

        <h1 className="hero-title mt-6 text-balance text-white">
          One platform for{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            listings, marketing & growth
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">
          Launch faster and scale globally with professional exchange listing, PR, market making,
          audits, and community services — all from one dashboard.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 hover:bg-cyan-400 sm:h-12 sm:w-auto sm:px-8"
            asChild
          >
            <Link href="/contact">
              Get free consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 w-full rounded-xl border-white/12 bg-white/[0.03] text-sm font-semibold text-white hover:bg-white/[0.07] sm:h-12 sm:w-auto sm:px-8"
            asChild
          >
            <Link href="/services">Browse services</Link>
          </Button>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/[0.08] pt-10 sm:mt-14 sm:grid-cols-4 sm:gap-4 sm:pt-12">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
