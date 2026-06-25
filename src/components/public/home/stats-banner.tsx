import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_STATS } from "@/lib/home-content";
import { HomeSectionHeader } from "@/components/public/home/section-header";

export function StatsBanner() {
  return (
    <section className="landing-section landing-section-alt landing-surface-deep relative overflow-hidden border-y">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </div>

      <div className="landing-container relative">
        <HomeSectionHeader
          label="The platform"
          title={
            <>
              Your Web3{" "}
              <span className="bg-gradient-to-r from-foreground via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:via-cyan-200 dark:to-violet-300">
                listing & growth hub
              </span>
            </>
          }
          className="mb-8 sm:mb-12"
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {PLATFORM_STATS.map((stat) => (
            <div
              key={stat.label}
              className="group flex min-w-0 flex-col items-center justify-center rounded-xl border border-border bg-card/80 px-2 py-4 text-center transition hover:border-primary/30 hover:bg-card sm:px-3 sm:py-6"
            >
              <p className="lh-stat-value text-foreground transition group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[8px] font-semibold uppercase leading-snug tracking-[0.1em] text-muted-foreground sm:mt-2 sm:text-[10px] sm:tracking-[0.18em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-12">
          <Button
            size="lg"
            className="h-11 w-full max-w-sm rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,0.3)] hover:bg-cyan-400 sm:h-12 sm:w-auto sm:max-w-none sm:rounded-full sm:px-8"
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
