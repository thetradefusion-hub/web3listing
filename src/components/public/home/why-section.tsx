import { CheckCircle2 } from "lucide-react";
import { WHY_NEED_US } from "@/lib/home-content";

export function WhySection() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-16 xl:gap-20">
          <div className="text-center lg:sticky lg:top-24 lg:text-left">
            <p className="lh-label lh-accent">Why Web3Listing</p>
            <h2 className="lh-display mt-3 text-foreground sm:mt-4">
              Why do I need
              <br />
              <span className="lh-brand-gradient">Web3Listing?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base font-medium leading-snug text-foreground sm:text-lg lg:mx-0">
              We know the shortest way to listings, data platforms, and growth.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              Transparent pricing, vetted partners, and one professional dashboard for your entire
              Web3 launch stack.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {WHY_NEED_US.map((item) => (
              <div
                key={item.title}
                className="landing-card flex gap-3 p-4 transition-colors hover:border-primary/30 hover:bg-muted/40 sm:gap-4 sm:p-5"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-chart-2" strokeWidth={2.25} />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
