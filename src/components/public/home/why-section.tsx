import { CheckCircle2 } from "lucide-react";
import { WHY_NEED_US } from "@/lib/home-content";

export function WhySection() {
  return (
    <section className="landing-section border-b border-border">
      <div className="landing-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14 xl:gap-16">
          <div className="text-center lg:sticky lg:top-24 lg:text-left">
            <p className="lh-label lh-accent">Why TokenWeb3Listing</p>
            <h2 className="lh-display mt-3 text-foreground sm:mt-4">
              Why do I need{" "}
              <span className="lh-brand-gradient">
                TokenWeb3Listing?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              We know the shortest path to listings, data platforms, and growth — with transparent
              pricing and a single dashboard for your entire Web3 launch stack.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {WHY_NEED_US.map((item) => (
              <div
                key={item.title}
                className="landing-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40 sm:p-5"
              >
                <div className="flex gap-3 sm:gap-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-chart-2 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
