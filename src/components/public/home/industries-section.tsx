import { HOME_INDUSTRIES } from "@/lib/home-content";
import {
  Building2,
  Coins,
  Megaphone,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: LucideIcon[] = [Coins, Rocket, Building2, Megaphone, Users];

export function IndustriesSection() {
  return (
    <section className="landing-section border-b border-border landing-section-alt">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lh-label lh-accent">Who we serve</p>
          <h2 className="lh-display mt-3 text-foreground sm:mt-4">
            Listing & growth for{" "}
            <span className="lh-brand-gradient">crypto teams</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Bring your project on chain visibility with listing prep, agent-ready ops, and
            verifiable delivery through one marketplace.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
          {HOME_INDUSTRIES.map((item, i) => {
            const Icon = ICONS[i] ?? Coins;
            return (
              <article
                key={item.title}
                className="landing-card flex flex-col items-start p-5 transition-colors hover:border-primary/30 sm:min-h-[180px]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
