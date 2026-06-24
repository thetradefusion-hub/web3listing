"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ServiceCatalogFilters } from "@/components/agent/services/service-catalog-filters";
import type { ServiceCategory } from "@/types/database";

export function ServiceCatalogToolbar({
  categories,
  categoryCounts,
  tatOptions,
  paymentOptions,
  managerTelegramLink,
  total,
}: {
  categories: ServiceCategory[];
  categoryCounts: Record<string, number>;
  tatOptions: string[];
  paymentOptions: string[];
  managerTelegramLink?: string | null;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const q = searchParams.get("q") || "";
  const hasFilters = Boolean(
    searchParams.get("category") ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice") ||
      searchParams.get("tat") ||
      searchParams.get("payment") ||
      searchParams.get("q")
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const query = (form.get("q") as string) || "";
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set("q", query);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    router.push(`/agent/services${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="space-y-3 lg:hidden">
      <form onSubmit={handleSearch} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" strokeWidth={2} />
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search services..."
          className="h-11 rounded-xl border-[#E2E8F0] bg-white pl-10 pr-24 shadow-sm"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg bg-[#635BFF] px-3 text-xs hover:bg-[#5248E6]"
        >
          Search
        </Button>
      </form>

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{total}</span> services available
        </p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-medium shadow-sm transition hover:bg-[#F8FAFC]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#635BFF]" strokeWidth={2} />
            Filters
            {hasFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-bold text-white">
                !
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto rounded-t-2xl p-0">
            <SheetHeader className="border-b border-[#F1F5F9] px-5 py-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <Filter className="h-4 w-4 text-[#635BFF]" strokeWidth={2} />
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
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function ServiceCatalogPageHeader({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <Link href="/agent" className="transition hover:text-[#635BFF]">
            Dashboard
          </Link>
          <span>›</span>
          <span className="text-[#64748B]">All Services</span>
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          All Services
        </h1>
        <p className="mt-1 hidden text-sm text-[#64748B] sm:block">
          Browse {total}+ Web3 listing, marketing, and growth services
        </p>
      </div>
      <div className="hidden items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 shadow-sm lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#635BFF] to-[#8B5CF6] text-white shadow-sm">
          <Search className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Catalog</p>
          <p className="text-sm font-bold text-[#0F172A]">{total} Services</p>
        </div>
      </div>
    </div>
  );
}
