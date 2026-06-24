"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  Clock3,
  Filter,
  FolderOpen,
  Headphones,
  Search,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORY_ICONS } from "@/lib/service-catalog";
import type { ServiceCategory } from "@/types/database";

export function ServiceCatalogFilters({
  categories,
  categoryCounts,
  tatOptions,
  paymentOptions,
  managerTelegramLink,
  onApplied,
  hideHelpCard,
  className,
}: {
  categories: ServiceCategory[];
  categoryCounts: Record<string, number>;
  tatOptions: string[];
  paymentOptions: string[];
  managerTelegramLink?: string | null;
  onApplied?: () => void;
  hideHelpCard?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    tat: searchParams.get("tat") || "",
    payment: searchParams.get("payment") || "",
    project: searchParams.get("project") || "",
    page: searchParams.get("page") || "1",
  };

  function buildUrl(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { ...current, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (merged.page && merged.page !== "1") params.set("page", merged.page);
    const qs = params.toString();
    return `/partner/services${qs ? `?${qs}` : ""}`;
  }

  function applyFilters(form: FormData) {
    const updates = {
      q: (form.get("q") as string) || "",
      category: (form.get("category") as string) || "",
      minPrice: (form.get("minPrice") as string) || "",
      maxPrice: (form.get("maxPrice") as string) || "",
      tat: (form.get("tat") as string) || "",
      payment: (form.get("payment") as string) || "",
      page: "1",
    };
    router.push(buildUrl(updates));
    onApplied?.();
  }

  return (
    <aside className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters(new FormData(e.currentTarget));
        }}
        className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#635BFF]" strokeWidth={2} />
            </span>
            Filter Services
          </h3>
          <Link
            href={`/partner/services${current.project ? `?project=${current.project}` : ""}`}
            className="text-xs font-medium text-[#635BFF] hover:underline"
          >
            Clear All
          </Link>
        </div>

        <input type="hidden" name="category" value={current.category} />

        <div className="relative mb-4 hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" strokeWidth={2} />
          <Input
            name="q"
            defaultValue={current.q}
            placeholder="Search services..."
            className="h-10 rounded-xl border-[#E2E8F0] pl-9"
          />
        </div>

        <div className="mb-4 max-h-[200px] space-y-1 overflow-y-auto pr-1 lg:max-h-[240px]">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            <FolderOpen className="h-3.5 w-3.5" strokeWidth={2} />
            Category
          </p>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug];
            return (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-[#F8FAFC]"
              >
                <Checkbox
                  checked={current.category === cat.slug}
                  onCheckedChange={(checked) => {
                    router.push(buildUrl({ category: checked ? cat.slug : "", page: "1" }));
                  }}
                />
                {Icon && (
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" strokeWidth={2} />
                )}
                <span className="flex-1 truncate text-sm text-[#475569]">{cat.name}</span>
                <span className="rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B]">
                  {categoryCounts[cat.id] || 0}
                </span>
              </label>
            );
          })}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs text-[#64748B]">
              <Filter className="h-3 w-3" strokeWidth={2} />
              Min Price
            </Label>
            <Input name="minPrice" type="number" min="0" defaultValue={current.minPrice} placeholder="$0" className="h-9 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs text-[#64748B]">
              <Filter className="h-3 w-3" strokeWidth={2} />
              Max Price
            </Label>
            <Input name="maxPrice" type="number" min="0" defaultValue={current.maxPrice} placeholder="$999" className="h-9 rounded-lg" />
          </div>
        </div>

        <div className="mb-4 space-y-1.5">
          <Label className="flex items-center gap-1 text-xs text-[#64748B]">
            <Clock3 className="h-3 w-3" strokeWidth={2} />
            TAT
          </Label>
          <select
            name="tat"
            defaultValue={current.tat}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A]"
          >
            <option value="">Select TAT</option>
            {tatOptions.map((tat) => (
              <option key={tat} value={tat}>{tat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 space-y-1.5">
          <Label className="flex items-center gap-1 text-xs text-[#64748B]">
            <Banknote className="h-3 w-3" strokeWidth={2} />
            Payment Terms
          </Label>
          <select
            name="payment"
            defaultValue={current.payment}
            className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A]"
          >
            <option value="">Select Payment Terms</option>
            {paymentOptions.map((term) => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>

        <Button type="submit" className="h-10 w-full rounded-xl bg-gradient-to-r from-[#635BFF] to-[#7C6FFF] font-semibold shadow-sm hover:from-[#5248E6]">
          Apply Filters
        </Button>
      </form>

      {!hideHelpCard && (
        <div className="mt-4 rounded-2xl border border-[#E0E7FF] bg-gradient-to-br from-[#FAFBFF] to-[#EEF2FF]/50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Headphones className="h-4 w-4 text-[#635BFF]" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">Need Help Choosing?</p>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                Contact your dedicated manager for personalized recommendations.
              </p>
            </div>
          </div>
          {managerTelegramLink ? (
            <a
              href={managerTelegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#C7D2FE] bg-white text-sm font-medium text-[#635BFF] transition hover:bg-[#EEF2FF]"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
              Message on Telegram
            </a>
          ) : (
            <Button variant="outline" className="mt-3 h-10 w-full rounded-xl" asChild>
              <Link href="/partner/support">Contact Support</Link>
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}
