"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, FolderTree, Package, Search, Tags } from "lucide-react";
import { AdminPageShell, AdminPanel, AdminStatCard } from "@/components/admin/ui";
import { AddCategoryButton } from "@/components/admin/category-form-dialog";
import { CategoryActions } from "@/components/admin/category-actions";
import { MobileDataCard, MobileDataRow, ResponsiveTableShell } from "@/components/shared/responsive-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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
import type { ServiceCategory } from "@/types/database";

type CategoryRow = ServiceCategory & {
  services?: { count: number }[] | null;
};

function serviceCount(row: CategoryRow) {
  return row.services?.[0]?.count ?? 0;
}

function CategoryIdentity({ category }: { category: CategoryRow }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate font-semibold text-foreground">{category.name}</p>
        {!category.is_active ? (
          <Badge variant="secondary">Inactive</Badge>
        ) : null}
      </div>
      <p className="truncate font-mono text-xs text-muted-foreground">{category.slug}</p>
      {category.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
      ) : null}
    </div>
  );
}

function CatalogToolbar({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  action,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusChange: (value: "all" | "active" | "inactive") => void;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, slug, or description..."
          className="h-11 rounded-xl border-input bg-background pl-10 shadow-sm"
        />
      </div>
      <Select value={statusFilter} onValueChange={(v) => v && onStatusChange(v as typeof statusFilter)}>
        <SelectTrigger className="h-11 w-full rounded-xl sm:w-[180px]">
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
      {action}
    </div>
  );
}

function ResultsBar({ shown, total }: { shown: number; total: number }) {
  return (
    <div className="border-b border-border bg-gradient-to-r from-muted/40 via-card to-muted/30 px-4 py-2.5 text-xs sm:px-5 sm:text-sm">
      <p className="text-muted-foreground">
        {shown === 0 ? (
          "No categories match your filters"
        ) : (
          <>
            Showing <span className="font-semibold text-foreground">{shown}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> categories
          </>
        )}
      </p>
    </div>
  );
}

export function AdminCategoriesCatalog({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const stats = useMemo(() => {
    const active = categories.filter((c) => c.is_active).length;
    const withServices = categories.filter((c) => serviceCount(c) > 0).length;
    const totalServices = categories.reduce((sum, c) => sum + serviceCount(c), 0);
    return { total: categories.length, active, withServices, totalServices };
  }, [categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((category) => {
      if (statusFilter === "active" && !category.is_active) return false;
      if (statusFilter === "inactive" && category.is_active) return false;
      if (!q) return true;
      return (
        category.name.toLowerCase().includes(q) ||
        category.slug.toLowerCase().includes(q) ||
        category.description?.toLowerCase().includes(q)
      );
    });
  }, [categories, query, statusFilter]);

  const hasFilters = query.trim() !== "" || statusFilter !== "all";

  return (
    <AdminPageShell compact fullWidth className="w-full gap-4 sm:gap-5">
      <div className="min-w-0">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin" className="transition hover:text-primary">
            Admin
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Categories</span>
        </nav>
        <h1 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">Category Management</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Organize the service catalog — add, edit, or remove categories.
        </p>
      </div>

      <section aria-label="Category stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AdminStatCard title="Total Categories" value={stats.total} icon={Tags} color="blue" />
        <AdminStatCard title="Active" value={stats.active} icon={CheckCircle2} color="green" />
        <AdminStatCard title="With Services" value={stats.withServices} icon={FolderTree} color="purple" />
        <AdminStatCard title="Linked Services" value={stats.totalServices} icon={Package} color="orange" />
      </section>

      <AdminPanel className="overflow-hidden">
        <CatalogToolbar
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          action={<AddCategoryButton />}
        />
        <ResultsBar shown={filtered.length} total={categories.length} />

        {filtered.length > 0 ? (
          <ResponsiveTableShell
            table={
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[240px] px-4">Category</TableHead>
                    <TableHead className="hidden px-4 md:table-cell">Icon</TableHead>
                    <TableHead className="px-4">Services</TableHead>
                    <TableHead className="hidden px-4 sm:table-cell">Sort</TableHead>
                    <TableHead className="hidden px-4 lg:table-cell">Status</TableHead>
                    <TableHead className="px-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((category) => {
                    const count = serviceCount(category);
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="whitespace-normal px-4 py-3">
                          <CategoryIdentity category={category} />
                        </TableCell>
                        <TableCell className="hidden px-4 font-mono text-sm text-muted-foreground md:table-cell">
                          {category.icon || "—"}
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge variant="outline">{count}</Badge>
                        </TableCell>
                        <TableCell className="hidden px-4 text-muted-foreground sm:table-cell">
                          {category.sort_order}
                        </TableCell>
                        <TableCell className="hidden px-4 lg:table-cell">
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4">
                          <CategoryActions category={category} serviceCount={count} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            }
            mobile={
              <>
                {filtered.map((category) => {
                  const count = serviceCount(category);
                  return (
                    <MobileDataCard key={category.id}>
                      <CategoryIdentity category={category} />
                      <div className="mt-3 space-y-2">
                        <MobileDataRow label="Services">{count}</MobileDataRow>
                        <MobileDataRow label="Sort">{category.sort_order}</MobileDataRow>
                        <MobileDataRow label="Status">
                          {category.is_active ? "Active" : "Inactive"}
                        </MobileDataRow>
                        {category.icon ? <MobileDataRow label="Icon">{category.icon}</MobileDataRow> : null}
                      </div>
                      <div className="mt-4">
                        <CategoryActions category={category} serviceCount={count} />
                      </div>
                    </MobileDataCard>
                  );
                })}
              </>
            }
          />
        ) : (
          <Empty className="border-0 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Tags />
              </EmptyMedia>
              <EmptyTitle>{hasFilters ? "No matching categories" : "No categories yet"}</EmptyTitle>
              <EmptyDescription>
                {hasFilters ? "Try a different search or status filter." : "Create your first service category."}
              </EmptyDescription>
            </EmptyHeader>
            {!hasFilters ? <AddCategoryButton /> : null}
          </Empty>
        )}
      </AdminPanel>
    </AdminPageShell>
  );
}

export function AdminCategoriesEmpty() {
  return (
    <AdminPageShell compact fullWidth className="w-full gap-4 sm:gap-5">
      <div className="min-w-0">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/admin" className="transition hover:text-primary">
            Admin
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-foreground">Categories</span>
        </nav>
        <h1 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">Category Management</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Organize the service catalog — add, edit, or remove categories.
        </p>
      </div>

      <AdminPanel className="overflow-hidden">
        <Empty className="border-0 py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Tags />
            </EmptyMedia>
            <EmptyTitle>No categories yet</EmptyTitle>
            <EmptyDescription>Add categories to group services in the catalog.</EmptyDescription>
          </EmptyHeader>
          <AddCategoryButton />
        </Empty>
      </AdminPanel>
    </AdminPageShell>
  );
}
