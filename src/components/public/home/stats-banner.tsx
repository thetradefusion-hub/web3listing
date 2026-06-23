import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_STATS } from "@/lib/home-content";

export function StatsBanner() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#070b14] py-14 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label text-cyan-400">The platform</p>
          <h2 className="lh-display mt-3 text-white sm:mt-4">
            Your Web3{" "}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              listing & growth hub
            </span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:mt-12 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {PLATFORM_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#0a0f1a] px-3 py-5 text-center sm:py-6"
            >
              <p className="lh-stat-value text-white">{stat.value}</p>
              <p className="mt-1.5 text-[9px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.18em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Button
            size="lg"
            className="h-11 w-full max-w-sm rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 hover:bg-cyan-400 sm:h-12 sm:w-auto sm:max-w-none sm:rounded-full sm:px-8"
            asChild
          >
            <Link href="/contact">
              <span className="sm:hidden">Get listing strategy</span>
              <span className="hidden sm:inline">Get individual listing strategy</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
