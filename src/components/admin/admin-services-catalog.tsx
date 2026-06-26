"use client";

import { useMemo, useState, type ReactNode } from "react";
import { PackageSearch, Search } from "lucide-react";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { formatCurrency } from "@/lib/commission";
import { AdminPageShell, AdminPanel, rel } from "@/components/admin/ui";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { AddServiceButton } from "@/components/admin/service-form";
import { ServiceActions } from "@/components/admin/service-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PricingModel, Service, ServiceCategory } from "@/types/database";

type ServiceRow = Service & {
  service_categories?: ServiceCategory | ServiceCategory[] | null;
};

function ServiceIdentity({ service }: { service: ServiceRow }) {
  const initials = service.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 rounded-xl">
        {service.logo_url ? <AvatarImage src={service.logo_url} alt="" /> : null}
        <AvatarFallback className="rounded-xl bg-primary text-xs font-bold text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-foreground">{service.name}</p>
          {service.badge ? (
            <Badge variant="secondary" className="capitalize">
              {service.badge}
            </Badge>
          ) : null}
          <PricingBadge model={service.pricing_model as PricingModel} />
        </div>
      </div>
    </div>
  );
}

function CatalogToolbar({
  query,
  onQueryChange,
  categoryId,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  categories,
  action,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  categories: ServiceCategory[];
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search services..."
            className="h-11 rounded-xl border-input bg-background pl-10 shadow-sm"
          />
        </div>
        <Select value={categoryId} onValueChange={(v) => v && onCategoryChange(v)}>
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-[min(100%,240px)]">
            <SelectValue placeholder="Select categories">
              {categoryId === "all"
                ? "Select categories"
                : categories.find((c) => c.id === categoryId)?.name ?? "Select categories"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v && onStatusChange(v as typeof statusFilter)}>
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-[140px]">
            <SelectValue placeholder="Status">
              {statusFilter === "all"
                ? "Status"
                : statusFilter === "active"
                  ? "Active"
                  : "Inactive"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

function ResultsBar({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-gradient-to-r from-muted/40 via-card to-muted/30 px-4 py-2.5 text-xs sm:px-5 sm:text-sm">
      <p className="text-muted-foreground">
        {shown === 0 ? (
          "No services match your filters"
        ) : (
          <>
            Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> services
          </>
        )}
      </p>
    </div>
  );
}

export function AdminServicesCatalog({
  services,
  categories,
  orderCounts,
}: {
  services: ServiceRow[];
  categories: ServiceCategory[];
  orderCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((service) => {
      if (categoryId !== "all" && service.category_id !== categoryId) return false;
      if (statusFilter === "active" && !service.is_active) return false;
      if (statusFilter === "inactive" && service.is_active) return false;
      if (!q) return true;
      const category = rel(service.service_categories);
      return (
        service.name.toLowerCase().includes(q) ||
        service.slug.toLowerCase().includes(q) ||
        category?.name.toLowerCase().includes(q)
      );
    });
  }, [services, query, categoryId, statusFilter]);

  const hasFilters = query.trim() !== "" || categoryId !== "all" || statusFilter !== "all";

  function clearFilters() {
    setQuery("");
    setCategoryId("all");
    setStatusFilter("all");
  }

  return (
    <AdminPageShell compact fullWidth className="w-full">
      <AdminPanel className="min-h-0 w-full flex-1 overflow-hidden">
        <CatalogToolbar
          query={query}
          onQueryChange={setQuery}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          categories={categories}
          action={<AddServiceButton />}
        />

        <ResultsBar shown={filtered.length} total={services.length} />

        {filtered.length > 0 ? (
          <ResponsiveTableShell
            className="min-h-0 flex-1"
            table={
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[240px] px-4">Service</TableHead>
                    <TableHead className="hidden px-4 md:table-cell">Category</TableHead>
                    <TableHead className="px-4">Pricing</TableHead>
                    <TableHead className="hidden px-4 lg:table-cell">TAT</TableHead>
                    <TableHead className="hidden px-4 xl:table-cell">Commission</TableHead>
                    <TableHead className="px-4">Orders</TableHead>
                    <TableHead className="px-4">Status</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((service) => {
                    const category = rel(service.service_categories);
                    const price =
                      service.pricing_model === "fixed" && service.price
                        ? formatCurrency(service.price)
                        : service.pricing_model === "enterprise"
                          ? "Enterprise"
                          : "Custom quote";
                    const orders = orderCounts[service.id] || 0;

                    return (
                      <TableRow key={service.id}>
                        <TableCell className="whitespace-normal px-4 py-3">
                          <ServiceIdentity service={service} />
                        </TableCell>
                        <TableCell className="hidden px-4 text-muted-foreground md:table-cell">
                          {category?.name || "—"}
                        </TableCell>
                        <TableCell className="px-4 font-medium">{price}</TableCell>
                        <TableCell className="hidden px-4 text-muted-foreground lg:table-cell">
                          {service.estimated_tat || "—"}
                        </TableCell>
                        <TableCell className="hidden px-4 text-muted-foreground xl:table-cell">
                          {service.commission_value}
                          {service.commission_type === "percentage" ? "%" : " fixed"}
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge variant={orders > 0 ? "secondary" : "outline"}>{orders}</Badge>
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge variant={service.is_active ? "default" : "outline"}>
                            {service.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 text-right">
                          <ServiceActions
                            service={service}
                            categories={categories}
                            orderCount={orders}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            }
            mobile={
              <div className="flex flex-col gap-3">
                {filtered.map((service) => {
                  const category = rel(service.service_categories);
                  const price =
                    service.pricing_model === "fixed" && service.price
                      ? formatCurrency(service.price)
                      : service.pricing_model === "enterprise"
                        ? "Enterprise"
                        : "Custom quote";
                  const orders = orderCounts[service.id] || 0;

                  return (
                    <MobileDataCard key={service.id}>
                      <ServiceIdentity service={service} />
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                        <Badge variant={service.is_active ? "default" : "outline"}>
                          {service.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={orders > 0 ? "secondary" : "outline"}>{orders} orders</Badge>
                      </div>
                      <div className="mt-3 border-t border-border pt-3">
                        <MobileDataRow label="Category">{category?.name || "—"}</MobileDataRow>
                        <MobileDataRow label="Pricing">{price}</MobileDataRow>
                        <MobileDataRow label="TAT">{service.estimated_tat || "—"}</MobileDataRow>
                        <MobileDataRow label="Commission">
                          {service.commission_value}
                          {service.commission_type === "percentage" ? "%" : " fixed"}
                        </MobileDataRow>
                      </div>
                      <div className="mt-3 border-t border-border pt-3">
                        <ServiceActions
                          service={service}
                          categories={categories}
                          orderCount={orders}
                        />
                      </div>
                    </MobileDataCard>
                  );
                })}
              </div>
            }
          />
        ) : (
          <Empty className="m-4 rounded-2xl border-dashed py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
                <PackageSearch />
              </EmptyMedia>
              <EmptyTitle>No services found</EmptyTitle>
              <EmptyDescription>
                {hasFilters ? "Try a different category or search term." : "Add your first catalog service."}
              </EmptyDescription>
            </EmptyHeader>
            {hasFilters ? (
              <EmptyContent>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        )}
      </AdminPanel>
    </AdminPageShell>
  );
}

export function AdminServicesEmpty({ categories }: { categories: ServiceCategory[] }) {
  return (
    <AdminPageShell compact fullWidth className="w-full">
      <AdminPanel className="overflow-hidden">
        {categories.length > 0 ? (
          <div className="flex justify-end border-b border-border px-4 py-3 sm:px-5">
            <AddServiceButton />
          </div>
        ) : null}
        <Empty className="rounded-2xl border-0 border-dashed py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
              <PackageSearch />
            </EmptyMedia>
            <EmptyTitle>No services yet</EmptyTitle>
            <EmptyDescription>Add listing, marketing, and growth services to your catalog.</EmptyDescription>
          </EmptyHeader>
          {categories.length > 0 ? (
            <EmptyContent>
              <AddServiceButton />
            </EmptyContent>
          ) : null}
        </Empty>
      </AdminPanel>
    </AdminPageShell>
  );
}
