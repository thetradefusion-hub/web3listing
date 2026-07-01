import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getServicePriceLabel } from "@/lib/pricing";
import type { PricingModel } from "@/types/database";

export const metadata = { title: "Services" };

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const query = supabase
    .from("services")
    .select("*, service_categories(name, slug)")
    .eq("is_active", true)
    .order("sort_order");

  const { data: categories } = await supabase
    .from("service_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const { data: services } = await query;

  const filtered = services?.filter((s) => {
    if (params.category && s.service_categories?.slug !== params.category) return false;
    if (params.q && !s.name.toLowerCase().includes(params.q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">Service Marketplace</h1>
      <p className="mt-2 text-muted-foreground">
        Browse all Web3 listing, marketing, and growth services
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !params.category
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          }`}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${cat.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              params.category === cat.slug
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((service) => (
          <Link key={service.id} href={`/services/${service.slug}`}>
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <PricingBadge model={service.pricing_model as PricingModel} variant="dark" />
                </div>
                <CardDescription>{service.service_categories?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-chart-2">{getServicePriceLabel(service)}</span>
                  <span className="text-xs text-muted-foreground">{service.estimated_tat}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
