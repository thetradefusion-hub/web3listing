import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const HERO_EXCHANGES = [
  "Binance",
  "MEXC",
  "Gate.io",
  "KuCoin",
  "Bitget",
  "OKX",
  "Bybit",
  "CoinMarketCap",
  "CoinGecko",
  "DEXTools",
] as const;

function ExchangeOrb({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .replace(/\./g, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex size-14 flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/90 text-center shadow-lg shadow-primary/5 backdrop-blur-md sm:size-16",
        className
      )}
    >
      <span className="text-xs font-bold tracking-tight text-primary sm:text-sm">{initials}</span>
      <span className="mt-0.5 max-w-[3.5rem] truncate px-1 text-[8px] font-medium text-muted-foreground sm:text-[9px]">
        {name}
      </span>
    </div>
  );
}

function HeroExchangeNetwork() {
  const ring = HERO_EXCHANGES.slice(0, 8);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px]">
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full border border-primary/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[22%] rounded-full border border-dashed border-chart-2/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_62%)]"
        aria-hidden
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 flex size-28 flex-col items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary to-chart-4 text-primary-foreground shadow-2xl shadow-primary/30 sm:size-32">
          <span className="text-2xl font-black tracking-tight sm:text-3xl">W3</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] opacity-90">
            Listing
          </span>
        </div>
      </div>

      {ring.map((name, index) => {
        const angle = (index / ring.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 42;
        const left = 50 + Math.cos(angle) * radius;
        const top = 50 + Math.sin(angle) * radius;
        return (
          <div
            key={name}
            className="hero-preview-float absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${index * 0.35}s`,
            }}
          >
            <ExchangeOrb name={name} />
          </div>
        );
      })}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="hero-mesh-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-[0.28] dark:opacity-20" aria-hidden />

      <div className="landing-container relative">
        <div className="grid items-center gap-12 pb-12 pt-12 sm:gap-14 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pb-20 lg:pt-20">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <p className="lh-label lh-accent">Token listing & growth</p>

            <h1 className="lh-display mt-4 max-w-3xl text-foreground">
              Token listing
              <br />
              <span className="lh-brand-gradient">& launch agency</span>
            </h1>

            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              List your token on{" "}
              <span className="font-semibold text-foreground">any exchange</span>
              {" "}— plus market making, PR, audits, and growth support from one platform.
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                className="lh-btn-cta group h-12 w-full rounded-full px-8 text-sm font-semibold uppercase tracking-wide sm:w-auto"
                asChild
              >
                <Link href="/contact">
                  Get free consultation
                  <ArrowRight
                    data-icon="inline-end"
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-border/80 bg-background/70 px-8 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm hover:bg-muted/60 sm:w-auto"
                asChild
              >
                <Link href="/become-a-partner">Become our partner</Link>
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground sm:text-sm">
              20+ exchange ecosystems · Transparent pricing · Partner dashboard
            </p>
          </div>

          <HeroExchangeNetwork />
        </div>

        <div className="relative overflow-hidden border-t border-border/60 py-5 sm:py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />
          <div className="flex w-max gap-8 lh-marquee px-4">
            {[...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 text-sm font-semibold tracking-tight text-muted-foreground/75"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
