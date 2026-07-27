"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/public/blog/blog-post-card";
import type { BlogPostSummary } from "@/lib/public-catalog-cache";

export function BlogPopularSection({ posts }: { posts: BlogPostSummary[] }) {
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

  if (posts.length === 0) return null;

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-popular-slide]");
    const gap = 24;
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.45) + gap;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="relative mt-14 border-t border-border pt-12 sm:mt-16 sm:pt-14">
      <div className="landing-container">
        <div className="flex items-end justify-between gap-4">
          <h2 className="lh-display text-foreground">
            <span className="lh-brand-gradient">Popular articles</span>
          </h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous popular articles"
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
              aria-label="Next popular articles"
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
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 pl-[max(1rem,calc((100%-80rem)/2+1rem))] pr-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:pl-[max(1.5rem,calc((100%-80rem)/2+1.5rem))] sm:pr-6 lg:pl-[max(2rem,calc((100%-80rem)/2+2rem))] lg:pr-8 [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post) => (
            <div
              key={post.id}
              data-popular-slide
              className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
            >
              <BlogPostCard post={post} compact />
            </div>
          ))}
          <div className="w-2 shrink-0 sm:w-4" aria-hidden />
        </div>
      </div>
    </section>
  );
}
