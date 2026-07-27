"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICE_PILLARS } from "@/lib/home-content";
import {
  CATEGORY_ICON_STYLES,
  getCategoryIcon,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";

export function ServicePillars() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-service-slide]");
    const gap = 20;
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.8) + gap;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="landing-section relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_60%)]"
        aria-hidden
      />

      <div className="landing-container relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="lh-label lh-accent">What we offer</p>
            <h2 className="lh-display mt-3 text-foreground sm:mt-4">
              Our <span className="lh-brand-gradient">Services</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous services"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="size-10 rounded-full border-border/80 disabled:opacity-35"
            >
              <ArrowLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next services"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="size-10 rounded-full border-border/80 disabled:opacity-35"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mt-8 sm:mt-10">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 pl-[max(1rem,calc((100%-var(--landing-max))/2+1rem))] pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:pl-[max(1.5rem,calc((100%-var(--landing-max))/2+1.5rem))] sm:pr-6 lg:pl-[max(2rem,calc((100%-var(--landing-max))/2+2rem))] lg:pr-8 [&::-webkit-scrollbar]:hidden"
          style={{ "--landing-max": "80rem" } as CSSProperties}
        >
          {SERVICE_PILLARS.map((pillar) => {
            const Icon = getCategoryIcon(pillar.slug);

            return (
              <article
                key={pillar.slug}
                data-service-slide
                className={cn(
                  "group relative flex w-[18.5rem] min-h-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 transition-all duration-300 sm:w-[20rem] sm:min-h-[245px] lg:w-[21rem] lg:min-h-[265px] lg:p-7",
                  "hover:border-primary/35 hover:bg-card hover:shadow-[0_20px_50px_-24px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                )}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />

                <div className="relative flex flex-1 flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
                  <Link
                    href={pillar.href}
                    className={cn(
                      "flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-[1.04] sm:size-16",
                      CATEGORY_ICON_STYLES[pillar.slug] ??
                        "bg-primary/10 text-primary ring-primary/20"
                    )}
                    aria-label={`${pillar.title} services`}
                  >
                    <Icon className="size-6 sm:size-7" strokeWidth={1.75} />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                      <Link
                        href={pillar.href}
                        className="transition-colors hover:text-primary"
                      >
                        {pillar.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                      {pillar.desc}
                    </p>

                    <Link
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      Get in touch
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Trailing spacer so last card can align with container edge */}
          <div className="w-2 shrink-0 sm:w-4" aria-hidden />
        </div>
      </div>
    </section>
  );
}
