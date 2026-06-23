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

  let query = supabase
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
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Service Marketplace</h1>
        <p className="mt-4 text-muted-foreground">Browse all Web3 listing, marketing, and growth services</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link href="/services" className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted">All</Link>
        {categories?.map((cat) => (
          <Link key={cat.id} href={`/services?category=${cat.slug}`} className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted">
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered?.map((service) => (
          <Link key={service.id} href={`/services/${service.slug}`}>
            <Card className="h-full transition-colors hover:border-cyan-500/30">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <PricingBadge model={service.pricing_model as PricingModel} variant="dark" />
                </div>
                <CardDescription>{service.service_categories?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-cyan-400">
                    {getServicePriceLabel(service)}
                  </span>
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
