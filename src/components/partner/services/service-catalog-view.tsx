import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  FolderKanban,
  Grid3X3,
  Layers,
  PackageSearch,
  Sparkles,
  Store,
} from "lucide-react";
import { PartnerStatCard } from "@/components/partner/dashboard/dashboard-premium";
import { PartnerPageShell } from "@/components/partner/ui";
import { ServiceCatalogCard } from "@/components/partner/services/service-catalog-card";
import { ServiceCatalogFilters } from "@/components/partner/services/service-catalog-filters";
import {
  ServiceCatalogMobileFilters,
  ServiceCatalogResultsBar,
  ServiceCatalogSearchBar,
} from "@/components/partner/services/service-catalog-toolbar";
import {
  ServiceCatalogPagination,
  ServiceCategoryTabs,
} from "@/components/partner/services/service-category-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getServiceAccent, getServiceLogoColor } from "@/lib/service-catalog";
import type { Project, Service, ServiceCategory } from "@/types/database";
import { cn } from "@/lib/utils";
import { PortalViewProvider } from "@/components/shared/portal-view-context";

function FiltersSkeleton() {
  return <div className="hidden h-11 animate-pulse rounded-xl bg-muted lg:block" />;
}

function SearchSkeleton() {
  return <div className="h-11 animate-pulse rounded-xl bg-muted" />;
}

function ProjectContextBanner({
  project,
  basePath,
}: {
  project: Pick<Project, "id" | "project_name" | "token_symbol" | "logo_url" | "blockchain_network">;
  basePath: string;
}) {
  const accent = getServiceAccent(project.project_name);
  const logoColor = getServiceLogoColor(project.project_name);
  const initials = (project.token_symbol || project.project_name).slice(0, 2).toUpperCase();

  return (
    <Card size="sm" className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-card to-chart-4/5 py-0">
      <div className={cn("absolute inset-y-0 left-0 w-1 bg-gradient-to-b", accent)} aria-hidden />
      <CardContent className="flex flex-col gap-3 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-2 ring-border/50",
              logoColor
            )}
          >
            {project.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.logo_url} alt="" className="size-full object-cover" />
            ) : (
              <span className="text-xs font-bold">{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Ordering for project</p>
            <p className="truncate text-sm font-bold text-foreground sm:text-base">
              {project.project_name}{" "}
              <span className="font-semibold text-muted-foreground">({project.token_symbol})</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="size-3 shrink-0" />
              {project.blockchain_network}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-9 shrink-0 rounded-xl font-semibold" asChild>
          <Link href={`${basePath}/projects/${project.id}`}>
            View Project
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ServiceList({
  paged,
  projectQuery,
  emptyHref,
  basePath,
  showCommission,
}: {
  paged: (Service & {
    service_categories?: { name: string; slug: string } | { name: string; slug: string }[] | null;
  })[];
  projectQuery: string;
  emptyHref: string;
  basePath?: string;
  showCommission?: boolean;
}) {
  if (paged.length === 0) {
    return (
      <Empty className="rounded-2xl border-dashed py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-11 bg-primary/10 text-primary">
            <PackageSearch />
          </EmptyMedia>
          <EmptyTitle>No services found</EmptyTitle>
          <EmptyDescription>Try a different category or adjust your filters.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href={emptyHref}>Clear filters</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-3.5">
      {paged.map((service) => (
        <ServiceCatalogCard
          key={service.id}
          service={service}
          projectQuery={projectQuery}
          basePath={basePath}
          showCommission={showCommission}
        />
      ))}
    </div>
  );
}

export function ServiceCatalogView({
  paged,
  total,
  totalAll,
  totalPages,
  page,
  pageSize,
  baseQuery,
  projectQuery,
  emptyHref,
  categories,
  categoryCounts,
  tatOptions,
  paymentOptions,
  managerTelegramLink,
  project,
  featuredCount,
  activeCategoryName,
  basePath = "/partner",
  showCommission = true,
}: {
  paged: (Service & {
    service_categories?: { name: string; slug: string } | { name: string; slug: string }[] | null;
  })[];
  total: number;
  totalAll: number;
  totalPages: number;
  page: number;
  pageSize: number;
  baseQuery: string;
  projectQuery: string;
  emptyHref: string;
  categories: ServiceCategory[];
  categoryCounts: Record<string, number>;
  tatOptions: string[];
  paymentOptions: string[];
  managerTelegramLink?: string | null;
  project?: Pick<Project, "id" | "project_name" | "token_symbol" | "logo_url" | "blockchain_network"> | null;
  featuredCount: number;
  activeCategoryName?: string;
  basePath?: string;
  showCommission?: boolean;
}) {
  const filterProps = {
    categories,
    categoryCounts,
    tatOptions,
    paymentOptions,
    managerTelegramLink,
  };

  return (
    <PortalViewProvider basePath={basePath} showCommission={showCommission}>
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={basePath} className="transition hover:text-primary">
              Dashboard
            </Link>
            <span aria-hidden>›</span>
            <span className="font-medium text-foreground">{showCommission ? "Marketplace" : "Services"}</span>
          </nav>
          <h1 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">
            {showCommission ? "Service Marketplace" : "Services"}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Browse listings, security, marketing, and growth services for your token projects.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="h-9 rounded-xl font-semibold">
            <Link href={`${basePath}/projects/new`}>
              <FolderKanban data-icon="inline-start" />
              New Project
            </Link>
          </Button>
          <Button asChild className="h-9 rounded-xl font-semibold shadow-sm">
            <Link href={`${basePath}/orders`}>
              <Store data-icon="inline-start" />
              My Orders
            </Link>
          </Button>
        </div>
      </div>

      {project ? <ProjectContextBanner project={project} basePath={basePath} /> : null}

      <section aria-label="Catalog stats" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <PartnerStatCard
          title="Available"
          value={totalAll}
          subtitle="Active services"
          icon={Grid3X3}
          color="blue"
        />
        <PartnerStatCard
          title="Showing"
          value={total}
          subtitle={activeCategoryName ? `In ${activeCategoryName}` : "Matching filters"}
          icon={Sparkles}
          color="purple"
        />
        <PartnerStatCard
          title="Categories"
          value={categories.length}
          subtitle="Service types"
          icon={Layers}
          color="green"
        />
        <PartnerStatCard
          title="Featured"
          value={featuredCount}
          subtitle="Hot & popular"
          icon={Flame}
          color="orange"
        />
      </section>

      {/* Desktop */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-5">
        <Suspense fallback={<SearchSkeleton />}>
          <ServiceCatalogSearchBar className="min-w-0 lg:col-start-1 lg:row-start-1" />
        </Suspense>

        <Suspense fallback={<FiltersSkeleton />}>
          <div className="min-w-0 self-start lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-4">
            <ServiceCatalogFilters {...filterProps} hideSearch sidebarLayout />
          </div>
        </Suspense>

        <div className="flex min-w-0 flex-col gap-3 lg:col-start-1 lg:row-start-2 xl:gap-4">
          <ServiceCategoryTabs categories={categories} projectQuery={projectQuery} />

          <ServiceCatalogResultsBar total={total} page={page} pageSize={pageSize} />

          <ServiceList
            paged={paged}
            projectQuery={projectQuery}
            emptyHref={emptyHref}
            basePath={basePath}
            showCommission={showCommission}
          />

          <ServiceCatalogPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            baseQuery={baseQuery}
          />
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="flex flex-col gap-3 lg:hidden">
        <Suspense fallback={<SearchSkeleton />}>
          <ServiceCatalogSearchBar trailing={<ServiceCatalogMobileFilters {...filterProps} />} />
        </Suspense>

        <ServiceCategoryTabs categories={categories} projectQuery={projectQuery} />

        <ServiceCatalogResultsBar total={total} page={page} pageSize={pageSize} />

        <ServiceList
          paged={paged}
          projectQuery={projectQuery}
          emptyHref={emptyHref}
          basePath={basePath}
          showCommission={showCommission}
        />

        <ServiceCatalogPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          baseQuery={baseQuery}
        />
      </div>
    </PartnerPageShell>
    </PortalViewProvider>
  );
}
