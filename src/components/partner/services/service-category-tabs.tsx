"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_ICONS, getCategoryShortLabel } from "@/lib/service-catalog";
import type { ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { usePortalBasePath } from "@/components/shared/portal-view-context";

function CategoryIconBox({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 sm:size-9",
        active
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      )}
    >
      {children}
    </div>
  );
}

function CategoryTab({
  active,
  label,
  shortLabel,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "group flex w-[58px] shrink-0 snap-start flex-col items-center gap-1 rounded-xl border px-1 py-1.5 transition-all duration-200 sm:w-[62px]",
        "lg:w-auto lg:min-w-0 lg:flex-1 lg:basis-0 lg:shrink lg:snap-none lg:px-1.5",
        active
          ? "border-primary/40 bg-primary/10 shadow-sm shadow-primary/10"
          : "border-border bg-card hover:border-primary/20 hover:bg-muted/40"
      )}
    >
      <CategoryIconBox active={active}>
        <Icon className="size-4 sm:size-[18px]" strokeWidth={2} />
      </CategoryIconBox>
      <span
        className={cn(
          "w-full text-center text-[10px] font-semibold leading-tight",
          "truncate lg:whitespace-normal lg:line-clamp-2",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        {shortLabel}
      </span>
    </button>
  );
}

export function ServiceCategoryTabs({
  categories,
  projectQuery,
}: {
  categories: ServiceCategory[];
  projectQuery?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePath = usePortalBasePath();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";

  function buildHref(category?: string) {
    const params = new URLSearchParams();
    if (projectQuery?.includes("project=")) {
      const project = projectQuery.split("project=")[1]?.split("&")[0];
      if (project) params.set("project", project);
    }
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `${basePath}/services${qs ? `?${qs}` : ""}`;
  }

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, categories.length]);

  function scrollByDir(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  }

  const AllIcon = CATEGORY_ICONS["listing-services"];

  return (
    <Card className="gap-0 rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 py-0 shadow-sm ring-0">
      <CardContent className="relative p-2.5 sm:p-3">
        <p className="mb-2 px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Browse by category
        </p>
        {canScrollLeft && (
          <>
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-card to-transparent sm:w-10" />
            <button
              type="button"
              onClick={() => scrollByDir("left")}
              className="absolute left-1 top-1/2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-primary sm:left-2 sm:size-8"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="size-4" strokeWidth={2.5} />
            </button>
          </>
        )}

        {canScrollRight && (
          <>
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-card to-transparent sm:w-10" />
            <button
              type="button"
              onClick={() => scrollByDir("right")}
              className="absolute right-1 top-1/2 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:text-primary sm:right-2 sm:size-8"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex w-full gap-1.5 overflow-x-auto scroll-smooth px-0.5 py-0.5 [scrollbar-width:thin] snap-x snap-mandatory lg:justify-between lg:gap-1.5 lg:overflow-x-hidden xl:gap-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <CategoryTab
            active={!activeCategory}
            label="All categories"
            shortLabel="All"
            icon={AllIcon}
            onClick={() => router.push(buildHref())}
          />

          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || AllIcon;
            return (
              <CategoryTab
                key={cat.id}
                active={activeCategory === cat.slug}
                label={cat.name}
                shortLabel={getCategoryShortLabel(cat.slug, cat.name)}
                icon={Icon}
                onClick={() => router.push(buildHref(cat.slug))}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function ServiceCatalogPagination({
  page,
  totalPages,
  total,
  pageSize,
  baseQuery,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  baseQuery: string;
}) {
  const basePath = usePortalBasePath();
  if (totalPages <= 1) return null;

  function pageHref(p: number) {
    const params = new URLSearchParams(baseQuery.replace(/^\?/, ""));
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const qs = params.toString();
    return `${basePath}/services${qs ? `?${qs}` : ""}`;
  }

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1 rounded-2xl border border-border bg-gradient-to-r from-card via-card to-muted/20 px-3 py-3 shadow-sm sm:gap-1.5">
      <Button variant="outline" size="icon" className="size-8 rounded-lg" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={pageHref(page - 1)} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" />
          </span>
        )}
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          className="size-8 min-w-8 rounded-lg px-0 text-xs"
          asChild
        >
          <Link href={pageHref(p)}>{p}</Link>
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-lg"
        disabled={page >= totalPages}
        asChild={page < totalPages}
      >
        {page < totalPages ? (
          <Link href={pageHref(page + 1)} aria-label="Next page">
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span>
            <ChevronRight className="size-4" />
          </span>
        )}
      </Button>
    </div>
  );
}
