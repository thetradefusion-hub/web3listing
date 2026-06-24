import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  filterServices,
  getCategoryCounts,
  getUniquePaymentOptions,
  getUniqueTatOptions,
} from "@/lib/service-catalog";
import { ServiceCatalogCard } from "@/components/partner/services/service-catalog-card";
import { ServiceCatalogFilters } from "@/components/partner/services/service-catalog-filters";
import {
  ServiceCatalogPageHeader,
  ServiceCatalogToolbar,
} from "@/components/partner/services/service-catalog-toolbar";
import {
  ServiceCatalogPagination,
  ServiceCategoryTabs,
} from "@/components/partner/services/service-category-tabs";
import { rel } from "@/components/partner/ui";

const PAGE_SIZE = 10;

function FiltersSkeleton() {
  return <div className="hidden h-[520px] animate-pulse rounded-2xl bg-[#F1F5F9] lg:block" />;
}

function ToolbarSkeleton() {
  return <div className="h-20 animate-pulse rounded-xl bg-[#F1F5F9] lg:hidden" />;
}

export default async function PartnerServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    project?: string;
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    tat?: string;
    payment?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: allServices }, { data: categories }, { data: manager }] = await Promise.all([
    supabase.from("services").select("*, service_categories(name, slug)").eq("is_active", true).order("sort_order"),
    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),
  ]);

  const servicesWithCategory = (allServices || []).map((s) => ({
    ...s,
    service_categories: rel(s.service_categories),
  }));

  const filtered = filterServices(servicesWithCategory, {
    q: params.q,
    category: params.category,
    categories: categories || [],
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    tat: params.tat,
    payment: params.payment,
  });

  const page = Math.max(1, Number(params.page) || 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const projectQuery = params.project ? `?project=${params.project}` : "";
  const baseQuery = new URLSearchParams();
  if (params.project) baseQuery.set("project", params.project);
  if (params.category) baseQuery.set("category", params.category);
  if (params.q) baseQuery.set("q", params.q);
  if (params.minPrice) baseQuery.set("minPrice", params.minPrice);
  if (params.maxPrice) baseQuery.set("maxPrice", params.maxPrice);
  if (params.tat) baseQuery.set("tat", params.tat);
  if (params.payment) baseQuery.set("payment", params.payment);
  if (page > 1) baseQuery.set("page", String(page));

  const categoryCounts = getCategoryCounts(servicesWithCategory);
  const filterProps = {
    categories: categories || [],
    categoryCounts,
    tatOptions: getUniqueTatOptions(servicesWithCategory),
    paymentOptions: getUniquePaymentOptions(servicesWithCategory),
    managerTelegramLink: manager?.telegram_link,
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <ServiceCatalogPageHeader total={servicesWithCategory.length} />

      <Suspense fallback={<ToolbarSkeleton />}>
        <ServiceCatalogToolbar {...filterProps} total={total} />
      </Suspense>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <ServiceCategoryTabs categories={categories || []} projectQuery={projectQuery} />

          <div className="space-y-3 sm:space-y-4">
            {paged.length > 0 ? (
              paged.map((service) => (
                <ServiceCatalogCard key={service.id} service={service} projectQuery={projectQuery} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-white px-6 py-12 text-center sm:py-16">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                  <PackageSearch className="h-6 w-6 text-[#635BFF]" strokeWidth={2} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#0F172A]">No services found</p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>

          <ServiceCatalogPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            baseQuery={`?${baseQuery.toString()}`}
          />
        </div>

        <Suspense fallback={<FiltersSkeleton />}>
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <ServiceCatalogFilters {...filterProps} />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}
