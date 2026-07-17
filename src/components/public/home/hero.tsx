import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { getServiceInitials, getServiceLogoUrl } from "@/lib/service-catalog";
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

/** Square brand marks for the orbit (favicon CDN is reliable for exchange domains). */
const HERO_LOGO_BY_NAME: Record<(typeof HERO_EXCHANGES)[number], string> = {
  Binance: "https://www.google.com/s2/favicons?domain=binance.com&sz=128",
  MEXC: "https://www.google.com/s2/favicons?domain=mexc.com&sz=128",
  "Gate.io": "https://www.google.com/s2/favicons?domain=gate.io&sz=128",
  KuCoin: "https://www.google.com/s2/favicons?domain=kucoin.com&sz=128",
  Bitget: "https://www.google.com/s2/favicons?domain=bitget.com&sz=128",
  OKX: "https://www.google.com/s2/favicons?domain=okx.com&sz=128",
  Bybit: "https://www.google.com/s2/favicons?domain=bybit.com&sz=128",
  CoinMarketCap: "https://www.google.com/s2/favicons?domain=coinmarketcap.com&sz=128",
  CoinGecko: "https://www.google.com/s2/favicons?domain=coingecko.com&sz=128",
  DEXTools: "https://www.google.com/s2/favicons?domain=dextools.io&sz=128",
};

function ExchangeOrb({
  name,
  className,
}: {
  name: (typeof HERO_EXCHANGES)[number];
  className?: string;
}) {
  const logoUrl = HERO_LOGO_BY_NAME[name] ?? getServiceLogoUrl({ name });

  return (
    <div
      className={cn(
        "flex size-14 flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/90 text-center shadow-lg shadow-primary/5 backdrop-blur-md sm:size-16",
        className
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          width={28}
          height={28}
          className="size-6 object-contain sm:size-7"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-xs font-bold tracking-tight text-primary sm:text-sm">
          {getServiceInitials(name)}
        </span>
      )}
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
        <div className="relative z-10 flex size-28 flex-col items-center justify-center gap-1 rounded-full border border-primary/40 bg-zinc-950 text-white shadow-2xl shadow-primary/30 sm:size-32">
          <Image
            src="/web3_exact_colors.svg"
            alt="W3 Listing"
            width={72}
            height={48}
            priority
            className="h-9 w-auto sm:h-10"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/85">
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

function PartnerMarqueeItem({ name }: { name: string }) {
  const logoUrl = getServiceLogoUrl({ name });

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 backdrop-blur-sm">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          width={20}
          height={20}
          className="size-5 object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
          {getServiceInitials(name)}
        </span>
      )}
      <span className="text-sm font-semibold tracking-tight text-muted-foreground/90">{name}</span>
    </span>
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
          <div className="flex w-max items-center gap-4 lh-marquee px-4 sm:gap-5">
            {[...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES].map((name, i) => (
              <PartnerMarqueeItem key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
