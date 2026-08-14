import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Layers,
  Package,
  Search,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { ConsultationCta } from "@/components/public/home/consultation-cta";
import { getServicePriceLabel } from "@/lib/pricing";
import {
  BADGE_LABELS,
  BADGE_STYLES,
  CATEGORY_BAR_STYLES,
  CATEGORY_ICON_STYLES,
  getCategoryIcon,
  getServiceAccent,
  getServiceLogoColor,
  getServiceLogoUrl,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
import type { PricingModel, ServiceCategory } from "@/types/database";
import type { PublicServiceRow } from "@/lib/public-catalog-cache";

type ServiceWithCategory = PublicServiceRow;

function getCategory(service: ServiceWithCategory) {
  const cat = service.service_categories;
  if (Array.isArray(cat)) return cat[0] ?? null;
  return cat ?? null;
}

function ServiceLogo({ service }: { service: ServiceWithCategory }) {
  const logoUrl = getServiceLogoUrl(service);
  const logoColor = getServiceLogoColor(service.name);
  const CatIcon = getCategoryIcon(getCategory(service)?.slug);

  return (
    <div
      className={cn(
        "relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-md ring-1 ring-border/50 transition duration-300 group-hover:scale-105 group-hover:shadow-lg",
        logoUrl ? "bg-white" : logoColor
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className="size-10 object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <CatIcon className="size-6" strokeWidth={2} />
      )}
    </div>
  );
}

function CategoryCard({
  category,
  count,
  index,
}: {
  category: ServiceCategory;
  count: number;
  index: number;
}) {
  const Icon = getCategoryIcon(category.slug, category.icon);

  return (
    <Link
      href={`/services?category=${category.slug}`}
      className="services-card group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-6"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-90",
          CATEGORY_BAR_STYLES[category.slug] ?? "bg-primary"
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/5 blur-2xl transition duration-500 group-hover:bg-primary/15"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-110 group-hover:shadow-md sm:size-14",
            CATEGORY_ICON_STYLES[category.slug] ?? "bg-primary/10 text-primary ring-primary/20"
          )}
        >
          <Icon className="size-5 sm:size-6" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm">
            {count} {count === 1 ? "service" : "services"}
          </span>
        </div>
      </div>

      <h2 className="relative mt-5 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
        {category.name}
      </h2>
      <p className="relative mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {category.description ||
          `Browse ${category.name.toLowerCase()} services for your Web3 project.`}
      </p>

      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3">
        Explore services
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="size-3.5" />
        </span>
      </span>
    </Link>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceWithCategory;
  index: number;
}) {
  const category = getCategory(service);
  const price = getServicePriceLabel(service);
  const badge = service.badge && service.badge in BADGE_LABELS ? service.badge : null;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="services-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/10"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-90",
          getServiceAccent(service.name)
        )}
        aria-hidden
      />

      <div className="flex items-start gap-3.5">
        <ServiceLogo service={service} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-extrabold tracking-tight text-foreground transition group-hover:text-primary sm:text-lg">
              {service.name}
            </h3>
            {badge ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  BADGE_STYLES[badge as keyof typeof BADGE_STYLES]
                )}
              >
                {BADGE_LABELS[badge as keyof typeof BADGE_LABELS]}
              </span>
            ) : null}
          </div>
          {category?.name ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">{category.name}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        <PricingBadge model={service.pricing_model as PricingModel} variant="dark" />
      </div>

      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.description ||
          "Professional Web3 service with transparent pricing and dedicated support."}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Price</p>
          <p className="mt-0.5 truncate text-sm font-extrabold text-chart-2">{price}</p>
        </div>
        <div className="rounded-xl bg-muted/40 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">TAT</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-extrabold text-foreground">
            <Clock className="size-3.5 shrink-0 text-muted-foreground" />
            {service.estimated_tat || "Flexible"}
          </p>
        </div>
      </div>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-3">
        View details
        <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function ServicesMarketplace({
  categories,
  services,
  selectedCategorySlug,
  searchQuery,
}: {
  categories: ServiceCategory[];
  services: ServiceWithCategory[];
  selectedCategorySlug?: string;
  searchQuery?: string;
}) {
  const counts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.slug] = services.filter((s) => getCategory(s)?.slug === cat.slug).length;
    return acc;
  }, {});

  const selectedCategory = selectedCategorySlug
    ? categories.find((c) => c.slug === selectedCategorySlug)
    : null;

  const filteredServices = services.filter((s) => {
    if (selectedCategorySlug && getCategory(s)?.slug !== selectedCategorySlug) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const showingCategory = Boolean(selectedCategory);
  const CategoryIcon = selectedCategory
    ? getCategoryIcon(selectedCategory.slug, selectedCategory.icon)
    : Layers;
  const totalServices = services.length;

  return (
    <>
      <section className="services-marketplace relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 landing-grid opacity-30" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-chart-2/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-10 size-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />

        <div className="landing-container relative py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="services-hero-badge mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card/80 px-3.5 py-1.5 backdrop-blur-sm">
              <Store className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                Service marketplace
              </span>
            </div>

            <h1 className="lh-display mt-5 text-foreground sm:mt-6">
              {showingCategory ? (
                <>
                  {selectedCategory?.name}{" "}
                  <span className="lh-brand-gradient">services</span>
                </>
              ) : (
                <>
                  Choose a <span className="lh-brand-gradient">category</span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
              {showingCategory
                ? selectedCategory?.description ||
                  `Explore ${selectedCategory?.name.toLowerCase()} offerings with logos, pricing, and turnaround details.`
                : "Pick a category first, then open related services with logos, pricing, and full details."}
            </p>

            {!showingCategory && !searchQuery ? (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                  <Layers className="size-3.5 text-primary" />
                  {categories.length} categories
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
                  <Package className="size-3.5 text-chart-2" />
                  {totalServices}+ live services
                </span>
              </div>
            ) : null}
          </div>

          <form
            action="/services"
            method="get"
            className="services-search mx-auto mt-8 flex max-w-2xl gap-2 sm:mt-10"
          >
            {selectedCategorySlug ? (
              <input type="hidden" name="category" value={selectedCategorySlug} />
            ) : null}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                defaultValue={searchQuery || ""}
                placeholder={
                  showingCategory ? "Search within this category…" : "Search all services…"
                }
                className="h-12 w-full rounded-2xl border border-border/80 bg-card/90 pr-4 pl-11 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <Button type="submit" className="lh-btn-cta h-12 rounded-2xl px-6 font-semibold">
              Search
            </Button>
          </form>

          {!showingCategory && !searchQuery && categories.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug, cat.icon);
                return (
                  <Link
                    key={cat.id}
                    href={`/services?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition hover:border-primary/35 hover:bg-card hover:text-foreground"
                  >
                    <Icon className="size-3.5 text-primary" />
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {showingCategory ? (
            <div className="mt-10 flex flex-col gap-7 sm:mt-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="outline" className="h-11 w-fit rounded-xl font-semibold" asChild>
                  <Link href="/services">
                    <ArrowLeft data-icon="inline-start" />
                    All categories
                  </Link>
                </Button>

                <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-border/70 bg-card/80 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:self-auto">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl ring-1",
                      CATEGORY_ICON_STYLES[selectedCategory!.slug] ??
                        "bg-primary/10 text-primary ring-primary/20"
                    )}
                  >
                    <CategoryIcon className="size-5" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedCategory?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {filteredServices.length}{" "}
                      {filteredServices.length === 1 ? "service" : "services"} available
                    </p>
                  </div>
                </div>
              </div>

              {filteredServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {filteredServices.map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    No services found in this category
                    {searchQuery ? ` for “${searchQuery}”` : ""}.
                  </p>
                  <Button className="mt-4 rounded-xl" asChild>
                    <Link href="/services">Browse categories</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : searchQuery ? (
            <div className="mt-10 sm:mt-12">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Search results for{" "}
                  <span className="font-bold text-foreground">“{searchQuery}”</span>
                </p>
                <Button variant="outline" size="sm" className="rounded-xl" asChild>
                  <Link href="/services">Clear search</Link>
                </Button>
              </div>
              {filteredServices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                  {filteredServices.map((service, index) => (
                    <ServiceCard key={service.id} service={service} index={index} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
                  <p className="text-sm text-muted-foreground">No services matched your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  count={counts[category.slug] ?? 0}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ConsultationCta
        title="Not sure which category fits?"
        subtitle="Tell us about your project and we’ll recommend the right listing and growth path."
        primaryLabel="Get free consultation"
        primaryHref="/contact"
        secondaryLabel="Become a partner"
        secondaryHref="/become-a-partner"
        withForm={false}
      />
    </>
  );
}
