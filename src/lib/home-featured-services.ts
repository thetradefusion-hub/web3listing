import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { pickFeaturedServices } from "@/lib/service-catalog";
import type { PricingModel } from "@/types/database";

export type HomeFeaturedService = {
  id: string;
  name: string;
  slug: string;
  badge: "hot" | "popular" | "new" | null;
  sort_order: number | null;
  pricing_model: PricingModel;
  price: number | null;
  service_fee: number | null;
  logo_url: string | null;
  description: string | null;
  estimated_tat: string | null;
  service_categories?: { name: string; slug: string } | null;
};

/** Cached featured services for the marketing homepage (no cookies → can be ISR). */
export const getHomeFeaturedServices = unstable_cache(
  async (): Promise<HomeFeaturedService[]> => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("services")
      .select(
        "id, name, slug, badge, sort_order, pricing_model, price, service_fee, logo_url, description, estimated_tat, service_categories(name, slug)"
      )
      .eq("is_active", true)
      .order("sort_order")
      .limit(48);

    const rows: HomeFeaturedService[] = (data ?? []).map((row) => {
      const categoryRaw = row.service_categories as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null
        | undefined;
      const category = Array.isArray(categoryRaw) ? categoryRaw[0] ?? null : categoryRaw ?? null;

      return {
        id: String(row.id),
        name: String(row.name),
        slug: String(row.slug),
        badge: (["hot", "popular", "new"].includes(String(row.badge))
          ? (row.badge as "hot" | "popular" | "new")
          : null),
        sort_order: typeof row.sort_order === "number" ? row.sort_order : null,
        pricing_model: row.pricing_model as PricingModel,
        price: typeof row.price === "number" ? row.price : null,
        service_fee: typeof row.service_fee === "number" ? row.service_fee : null,
        logo_url: (row.logo_url as string | null) ?? null,
        description: (row.description as string | null) ?? null,
        estimated_tat: (row.estimated_tat as string | null) ?? null,
        service_categories: category
          ? { name: String(category.name), slug: String(category.slug) }
          : null,
      };
    });

    return pickFeaturedServices(rows, 8);
  },
  ["home-featured-services-v1"],
  { revalidate: 300 }
);
