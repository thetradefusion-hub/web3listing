import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOME_SOLUTIONS } from "@/lib/home-content";

export function WhySection() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Solutions</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Bringing projects on exchange with{" "}
            <span className="lh-brand-gradient">listing & growth</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
            Creating the next phase of your launch by streamlining listing prep, proving readiness,
            and moving visibility across exchanges and data platforms.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {HOME_SOLUTIONS.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_28px_60px_-28px_color-mix(in_srgb,var(--primary)_50%,transparent)] sm:min-h-[260px] sm:p-7"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100"
                aria-hidden
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explore
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
