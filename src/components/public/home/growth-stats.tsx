import { HOME_GROWTH_STATS } from "@/lib/home-content";

export function GrowthStats() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="lh-label lh-accent">Impact</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Get significant{" "}
            <span className="lh-brand-gradient">launch growth</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
          {HOME_GROWTH_STATS.map((stat) => (
            <article
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-6 py-8 text-center"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                aria-hidden
              />
              <p className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                {stat.value}
              </p>
              <h3 className="mt-3 text-base font-bold text-foreground sm:text-lg">{stat.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
