import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_STATS, TRUST_HIGHLIGHTS } from "@/lib/home-content";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40 dark:opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 size-48 rounded-full bg-violet-600/10 blur-[80px] sm:size-64 sm:blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-56 rounded-full bg-cyan-500/10 blur-[80px] sm:size-72 sm:blur-[100px]" />

      <div className="landing-container relative pb-10 pt-8 sm:pb-16 sm:pt-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="hero-title text-balance text-foreground">
            One platform for{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
              listings, marketing & growth
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base lg:text-lg">
            Launch faster and scale globally with exchange listing, PR, market making, audits, and
            community services — managed from one professional dashboard.
          </p>

          <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:mt-8 sm:flex-row sm:justify-center sm:gap-3">
            <Button
              size="lg"
              className="h-11 w-full rounded-xl bg-cyan-500 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,0.35)] hover:bg-cyan-400 sm:h-12 sm:w-auto sm:px-8"
              asChild
            >
              <Link href="/signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full rounded-xl border-border bg-background/80 text-sm font-semibold hover:bg-muted sm:h-12 sm:w-auto sm:px-8"
              asChild
            >
              <Link href="/services">Browse services</Link>
            </Button>
          </div>

          <ul className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2">
            {TRUST_HIGHLIGHTS.slice(0, 4).map((item) => (
              <li
                key={item}
                className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="min-w-0 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 border-t border-border pt-8 sm:mt-14 sm:grid-cols-4 sm:gap-4 sm:pt-12">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="min-w-0 text-center">
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase leading-snug tracking-wide text-muted-foreground sm:text-[11px] sm:tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
