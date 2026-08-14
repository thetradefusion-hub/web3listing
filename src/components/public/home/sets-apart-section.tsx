import { HOME_SETS_APART } from "@/lib/home-content";

export function SetsApartSection() {
  return (
    <section className="landing-section border-b border-border landing-section-alt">
      <div className="landing-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="lh-label lh-accent">Differentiators</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            What sets us{" "}
            <span className="lh-brand-gradient">apart?</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-3 lg:gap-6">
          {HOME_SETS_APART.map((item, index) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 sm:p-8"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-chart-2">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {item.desc}
              </p>
              <div
                className="pointer-events-none absolute -bottom-16 -right-10 size-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
