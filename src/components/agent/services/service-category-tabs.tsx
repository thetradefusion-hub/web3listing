"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/lib/service-catalog";
import type { ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";

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
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
        active
          ? "bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] text-white shadow-sm shadow-[#635BFF]/25"
          : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#EEF2FF] group-hover:text-[#635BFF]"
      )}
    >
      {children}
    </div>
  );
}

function CategoryTab({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-[62px] shrink-0 snap-start flex-col items-center gap-1 rounded-xl border px-1.5 py-1.5 transition-all duration-200 sm:w-[68px]",
        active
          ? "border-[#635BFF] bg-[#EEF2FF] shadow-sm shadow-[#635BFF]/10"
          : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
      )}
    >
      <CategoryIconBox active={active}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </CategoryIconBox>
      <span
        className={cn(
          "line-clamp-2 h-[22px] w-full text-center text-[9px] font-semibold leading-[11px] sm:text-[10px] sm:leading-3",
          active ? "text-[#635BFF]" : "text-[#64748B]"
        )}
      >
        {label}
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
    return `/agent/services${qs ? `?${qs}` : ""}`;
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
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }

  const AllIcon = CATEGORY_ICONS["listing-services"];

  return (
    <div className="relative">
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-[#F8FAFC] to-transparent sm:w-8" />
          <button
            type="button"
            onClick={() => scrollByDir("left")}
            className="absolute left-0 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition hover:text-[#635BFF] sm:h-7 sm:w-7"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </>
      )}

      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-[#F8FAFC] to-transparent sm:w-8" />
          <button
            type="button"
            onClick={() => scrollByDir("right")}
            className="absolute right-0 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm transition hover:text-[#635BFF] sm:h-7 sm:w-7"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto scroll-smooth px-0.5 pb-1 pt-0.5 [scrollbar-width:thin] snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-track]:bg-transparent"
      >
        <CategoryTab
          active={!activeCategory}
          label="All Services"
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
              icon={Icon}
              onClick={() => router.push(buildHref(cat.slug))}
            />
          );
        })}
      </div>
    </div>
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
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  function pageHref(p: number) {
    const params = new URLSearchParams(baseQuery.replace(/^\?/, ""));
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const qs = params.toString();
    return `/agent/services${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#F1F5F9] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-center text-xs text-[#64748B] sm:text-left sm:text-sm">
        {total === 0 ? (
          "No services to show"
        ) : totalPages <= 1 ? (
          <>
            Showing <span className="font-semibold text-[#0F172A]">{total}</span> service
            {total !== 1 ? "s" : ""}
          </>
        ) : (
          <>
            Showing <span className="font-semibold text-[#0F172A]">{start}–{end}</span> of{" "}
            <span className="font-semibold text-[#0F172A]">{total}</span> services
          </>
        )}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[#E2E8F0]"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link href={pageHref(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              className={cn(
                "h-8 min-w-8 rounded-lg px-2 text-xs",
                p === page ? "bg-[#635BFF] hover:bg-[#5248E6]" : "border-[#E2E8F0]"
              )}
              asChild
            >
              <Link href={pageHref(p)}>{p}</Link>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-[#E2E8F0]"
            disabled={page >= totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link href={pageHref(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
