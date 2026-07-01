import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHY_CHOOSE, PARTNER_AUDIENCE, PARTNER_BENEFITS } from "@/lib/home-content";
import { HomeSectionHeader } from "@/components/public/home/section-header";

export function WhyChooseSection() {
  return (
    <section className="landing-section border-t landing-section-alt">
      <div className="landing-container">
        <HomeSectionHeader
          label="Why us"
          title="Why choose TokenWeb3Listing?"
          className="mb-10 sm:mb-14"
        />

        <div className="mb-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title} className="landing-card p-5">
              <h3 className="text-sm font-bold text-foreground sm:text-base">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-chart-2/10 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/20 blur-3xl" />
            <p className="lh-label text-primary">Partner program</p>
            <h3 className="mt-3 text-2xl font-bold text-foreground sm:mt-4">Become a partner & earn</h3>
            <p className="mt-2 text-sm font-medium text-primary/90">Web3 Partner Program</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Earn recurring commissions by referring projects to our marketplace.
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Benefits</p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PARTNER_BENEFITS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-primary to-chart-2 text-sm font-semibold text-white hover:opacity-90 sm:mt-8 sm:w-auto sm:rounded-full sm:px-8"
              asChild
            >
              <Link href="/login">
                Become a partner <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="landing-card p-6 sm:p-8">
            <p className="lh-label lh-accent">Perfect for</p>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {PARTNER_AUDIENCE.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="size-4 shrink-0 text-chart-2" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2 ring-1 ring-chart-2/20">
                <Globe className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Global Web3 coverage</p>
                <p className="text-xs text-muted-foreground">Asia · Europe · MENA · Africa · Americas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
