"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ServiceCatalogFilters } from "@/components/partner/services/service-catalog-filters";
import type { ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { usePortalBasePath } from "@/components/shared/portal-view-context";

/** Matches search input row — use for filter toolbar alignment on desktop */
export const catalogToolbarRowClass =
  "flex h-11 w-full min-w-0 shrink-0 items-center rounded-xl border border-input bg-background shadow-sm";

export function ServiceCatalogSearchBar({
  className,
  trailing,
}: {
  className?: string;
  trailing?: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = usePortalBasePath();
  const q = searchParams.get("q") || "";

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const query = (form.get("q") as string) || "";
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}/services${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={handleSearch} className={cn("flex min-w-0 items-center gap-2", className)}>
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={2}
        />
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search services..."
          className="h-11 rounded-xl border-input bg-background pl-10 shadow-sm"
        />
      </div>
      {trailing}
    </form>
  );
}

export function ServiceCatalogMobileFilters({
  categories,
  categoryCounts,
  tatOptions,
  paymentOptions,
  managerTelegramLink,
}: {
  categories: ServiceCategory[];
  categoryCounts: Record<string, number>;
  tatOptions: string[];
  paymentOptions: string[];
  managerTelegramLink?: string | null;
  total?: number;
}) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const hasFilters = Boolean(
    searchParams.get("category") ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice") ||
      searchParams.get("tat") ||
      searchParams.get("payment")
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-sm font-medium shadow-sm transition hover:bg-muted/50 lg:hidden",
          hasFilters && "border-primary/40 bg-primary/5"
        )}
      >
        <SlidersHorizontal className="size-4 text-primary" strokeWidth={2} />
        <span className="inline sm:inline">Filters</span>
        {hasFilters ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            !
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-2xl p-0">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-left">
            <Filter className="size-4 text-primary" strokeWidth={2} />
            Filter Services
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <ServiceCatalogFilters
            categories={categories}
            categoryCounts={categoryCounts}
            tatOptions={tatOptions}
            paymentOptions={paymentOptions}
            managerTelegramLink={managerTelegramLink}
            onApplied={() => setOpen(false)}
            hideHelpCard
            hideSearch
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ServiceCatalogPageHeader({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <Link href="/partner" className="transition hover:text-primary">
        Dashboard
      </Link>
      <span aria-hidden>›</span>
      <span className="font-medium text-foreground">All Services</span>
    </nav>
  );
}

export function ServiceCatalogResultsBar({
  total,
  page,
  pageSize,
  className,
}: {
  total: number;
  page: number;
  pageSize: number;
  className?: string;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-gradient-to-r from-muted/40 via-card to-muted/30 px-3 py-2.5 text-xs shadow-sm sm:px-4 sm:text-sm",
        className
      )}
    >
      <p className="text-muted-foreground">
        {total === 0 ? (
          "No services match your filters"
        ) : (
          <>
            Showing <span className="font-semibold text-foreground">{start}–{end}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> services
          </>
        )}
      </p>
      {total > 0 ? (
        <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          Page {page}
        </span>
      ) : null}
    </div>
  );
}
