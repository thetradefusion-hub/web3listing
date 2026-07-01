import { HOW_IT_WORKS } from "@/lib/home-content";
import { HomeSectionHeader } from "@/components/public/home/section-header";

export function HowItWorksSection() {
  return (
    <section className="landing-section border-y landing-section-alt">
      <div className="landing-container">
        <HomeSectionHeader label="Process" title="How it works" className="mb-8 sm:mb-14" />

        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent xl:block" />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5 xl:gap-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.step} className="group relative min-w-0">
                <div className="landing-card flex h-full flex-col p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-5">
                  <div className="mb-3 flex items-center gap-3 sm:mb-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-chart-2/10 text-sm font-extrabold text-primary ring-1 ring-primary/20 sm:size-11 dark:text-chart-2">
                      {step.step}
                    </span>
                    {index < HOW_IT_WORKS.length - 1 ? (
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-primary/25 to-transparent xl:block" />
                    ) : null}
                  </div>
                  <h3 className="text-sm font-bold text-foreground sm:text-base">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
