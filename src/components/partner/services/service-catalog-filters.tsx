"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote, Clock3, RotateCcw, Send, SlidersHorizontal } from "lucide-react";
import { catalogToolbarRowClass } from "@/components/partner/services/service-catalog-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_ICONS } from "@/lib/service-catalog";
import type { ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { usePortalBasePath } from "@/components/shared/portal-view-context";

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function FilterToolbarLabel({
  activeCount,
  clearHref,
}: {
  activeCount: number;
  clearHref: string;
}) {
  return (
    <div className={cn(catalogToolbarRowClass, "justify-between gap-2 px-3.5")}>
      <div className="flex min-w-0 items-center gap-2">
        <SlidersHorizontal className="size-4 shrink-0 text-primary" strokeWidth={2} />
        <span className="truncate text-sm font-medium text-foreground">Filter Services</span>
      </div>
      {activeCount > 0 ? (
        <Link href={clearHref} className="shrink-0 text-[11px] font-medium text-primary hover:underline">
          Clear All
        </Link>
      ) : null}
    </div>
  );
}

export function ServiceCatalogFilters({
  categories,
  categoryCounts,
  tatOptions,
  paymentOptions,
  managerTelegramLink,
  onApplied,
  hideHelpCard,
  hideSearch,
  sidebarLayout,
  className,
}: {
  categories: ServiceCategory[];
  categoryCounts: Record<string, number>;
  tatOptions: string[];
  paymentOptions: string[];
  managerTelegramLink?: string | null;
  onApplied?: () => void;
  hideHelpCard?: boolean;
  hideSearch?: boolean;
  /** Desktop sidebar: toolbar row matches search h-11, body below */
  sidebarLayout?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePath = usePortalBasePath();

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

  const [tat, setTat] = useState(current.tat || "__any__");
  const [payment, setPayment] = useState(current.payment || "__any__");

  useEffect(() => {
    setTat(current.tat || "__any__");
    setPayment(current.payment || "__any__");
  }, [current.tat, current.payment]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (current.category) n++;
    if (current.minPrice) n++;
    if (current.maxPrice) n++;
    if (current.tat) n++;
    if (current.payment) n++;
    if (!hideSearch && current.q) n++;
    return n;
  }, [current, hideSearch]);

  function buildUrl(updates: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = { ...current, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (merged.page && merged.page !== "1") params.set("page", merged.page);
    const qs = params.toString();
    return `${basePath}/services${qs ? `?${qs}` : ""}`;
  }

  function applyFilters(form: FormData) {
    const updates = {
      q: (form.get("q") as string) || "",
      category: current.category,
      minPrice: (form.get("minPrice") as string) || "",
      maxPrice: (form.get("maxPrice") as string) || "",
      tat: tat === "__any__" ? "" : tat,
      payment: payment === "__any__" ? "" : payment,
      page: "1",
    };
    router.push(buildUrl(updates));
    onApplied?.();
  }

  function selectCategory(slug: string) {
    const next = current.category === slug ? "" : slug;
    router.push(buildUrl({ category: next, page: "1" }));
  }

  const clearHref = `${basePath}/services${current.project ? `?project=${current.project}` : ""}`;

  const filterBody = (
    <>
      {!hideSearch && (
        <Input
          name="q"
          defaultValue={current.q}
          placeholder="Search in filters..."
          className="h-9 rounded-xl bg-muted/40 text-sm"
        />
      )}

      <FilterSection title="Category">
        <ScrollArea className="h-[160px] rounded-xl border border-border bg-muted/20 pr-2">
          <div className="flex flex-col gap-1 p-1.5">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug];
              const active = current.category === cat.slug;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.slug)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-foreground hover:bg-card hover:shadow-sm"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn("size-3.5 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")}
                      strokeWidth={2}
                    />
                  )}
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{cat.name}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                      active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </FilterSection>

      <Separator />

      <FilterSection title="Price range">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="filter-min-price" className="text-[10px] font-medium text-muted-foreground">
              Min
            </Label>
            <Input
              id="filter-min-price"
              name="minPrice"
              type="number"
              min="0"
              defaultValue={current.minPrice}
              placeholder="0"
              className="h-9 rounded-xl bg-muted/40 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="filter-max-price" className="text-[10px] font-medium text-muted-foreground">
              Max
            </Label>
            <Input
              id="filter-max-price"
              name="maxPrice"
              type="number"
              min="0"
              defaultValue={current.maxPrice}
              placeholder="999"
              className="h-9 rounded-xl bg-muted/40 text-sm"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Turnaround">
        <Select value={tat} onValueChange={(v) => setTat(v ?? "__any__")}>
          <SelectTrigger className="h-9 w-full rounded-xl bg-muted/40">
            <Clock3 className="size-3.5 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Any TAT" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__any__">Any TAT</SelectItem>
            {tatOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection title="Payment">
        <Select value={payment} onValueChange={(v) => setPayment(v ?? "__any__")}>
          <SelectTrigger className="h-9 w-full rounded-xl bg-muted/40">
            <Banknote className="size-3.5 shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Any terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__any__">Any terms</SelectItem>
            {paymentOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>
    </>
  );

  const helpCard = !hideHelpCard ? (
    <Card className="gap-0 overflow-hidden rounded-xl border-primary/20 bg-gradient-to-br from-primary/5 via-card to-chart-4/5 py-0 shadow-sm ring-0">
      <CardContent className="flex flex-col gap-2.5 p-3.5">
        <p className="text-xs font-semibold text-foreground">Need help choosing?</p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Your account manager can recommend the best services for your project stage.
        </p>
        {managerTelegramLink ? (
          <Button size="sm" className="h-9 w-full rounded-xl text-xs font-semibold" asChild>
            <a href={managerTelegramLink} target="_blank" rel="noopener noreferrer">
              <Send data-icon="inline-start" />
              Message on Telegram
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-9 w-full rounded-xl text-xs font-semibold" asChild>
            <Link href={`${basePath}/support`}>Contact Support</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  ) : null;

  return (
    <aside className={cn("flex flex-col gap-2", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters(new FormData(e.currentTarget));
        }}
        className="flex flex-col gap-2"
      >
        {sidebarLayout ? (
          <>
            <FilterToolbarLabel activeCount={activeCount} clearHref={clearHref} />
            <Card className="gap-0 overflow-hidden rounded-xl border py-0 shadow-sm ring-0">
              <CardContent className="flex flex-col gap-4 p-4">{filterBody}</CardContent>
              <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-4">
                <Button type="submit" className="h-10 w-full rounded-xl font-semibold">
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-full rounded-lg text-xs font-medium text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link href={clearHref}>
                    <RotateCcw data-icon="inline-start" />
                    Clear all
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card className="gap-0 overflow-hidden rounded-xl border py-0 shadow-sm ring-0">
            <CardHeader className="flex h-11 shrink-0 flex-row items-center justify-between gap-2 border-b px-4 py-0">
              <div className="flex min-w-0 items-center gap-2">
                <SlidersHorizontal className="size-4 shrink-0 text-primary" strokeWidth={2} />
                <CardTitle className="text-sm font-semibold text-foreground">Filter Services</CardTitle>
              </div>
              {activeCount > 0 ? (
                <Link href={clearHref} className="shrink-0 text-[11px] font-medium text-primary hover:underline">
                  Clear All
                </Link>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4">{filterBody}</CardContent>
            <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-4">
              <Button type="submit" className="h-10 w-full rounded-xl font-semibold">
                Apply Filters
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-full rounded-lg text-xs font-medium text-muted-foreground hover:text-primary"
                asChild
              >
                <Link href={clearHref}>
                  <RotateCcw data-icon="inline-start" />
                  Clear all
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>

      {helpCard}
    </aside>
  );
}
