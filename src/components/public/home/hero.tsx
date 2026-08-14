import Image from "next/image";
import { PARTNER_EXCHANGES } from "@/lib/home-content";
import { CollaborateForm } from "@/components/public/home/collaborate-form";
import { getServiceInitials, getServiceLogoUrl } from "@/lib/service-catalog";

function PartnerChip({ name }: { name: string }) {
  const logoUrl = getServiceLogoUrl({ name });

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 backdrop-blur-sm">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          width={18}
          height={18}
          className="size-4 object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="flex size-4 items-center justify-center rounded-md bg-primary/10 text-[9px] font-bold text-primary">
          {getServiceInitials(name)}
        </span>
      )}
      <span className="text-xs font-semibold tracking-tight text-muted-foreground sm:text-sm">
        {name}
      </span>
    </span>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="hero-mesh-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 landing-grid opacity-[0.22] dark:opacity-15"
        aria-hidden
      />

      <div className="landing-container relative">
        <div className="grid items-center gap-10 pb-14 pt-10 sm:gap-12 sm:pb-16 sm:pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:pb-20 lg:pt-16">
          <div className="flex min-w-0 flex-col">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1">
              <Image
                src="/web3_exact_colors.svg"
                alt=""
                width={28}
                height={18}
                priority
                className="h-4 w-auto"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                Web3Listing
              </span>
            </div>

            <p className="lh-label lh-accent">Token listing & growth</p>

            <h1 className="lh-hero-display mt-4 max-w-3xl text-foreground">
              Building the next stage of{" "}
              <span className="lh-brand-gradient">token launches</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base font-medium leading-relaxed text-foreground/80 sm:mt-6 sm:text-lg">
              Web3 listing & growth solutions for crypto projects
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              List on exchanges, amplify with PR & KOLs, deepen liquidity, and manage everything from
              one professional marketplace.
            </p>

            <div className="mt-8 sm:mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                With
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PARTNER_EXCHANGES.slice(0, 6).map((name) => (
                  <PartnerChip key={name} name={name} />
                ))}
              </div>
            </div>
          </div>

          <CollaborateForm />
        </div>

        <div className="relative overflow-hidden border-t border-border/60 py-5 sm:py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />
          <div className="flex w-max items-center gap-3 lh-marquee px-4 sm:gap-4">
            {[...PARTNER_EXCHANGES, ...PARTNER_EXCHANGES].map((name, i) => (
              <PartnerChip key={`${name}-${i}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
