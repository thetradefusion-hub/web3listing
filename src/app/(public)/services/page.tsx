import { createClient } from "@/lib/supabase/server";
import { ServicesMarketplace } from "@/components/public/services/services-marketplace";
import type { Service, ServiceCategory } from "@/types/database";

export const metadata = { title: "Services" };

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: categories }, { data: services }] = await Promise.all([
    supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("services")
      .select("*, service_categories(name, slug)")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  return (
    <ServicesMarketplace
      categories={(categories || []) as ServiceCategory[]}
      services={(services || []) as (Service & {
        service_categories?: { name?: string; slug?: string } | null;
      })[]}
      selectedCategorySlug={params.category}
      searchQuery={params.q}
    />
  );
}
