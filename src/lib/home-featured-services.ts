import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { pickFeaturedServices } from "@/lib/service-catalog";
import type { Service } from "@/types/database";

type HomeService = Service & {
  service_categories?: { name: string; slug: string } | null;
};

/** Cached featured services for the marketing homepage (no cookies → can be ISR). */
export const getHomeFeaturedServices = unstable_cache(
  async (): Promise<HomeService[]> => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("services")
      .select(
        "id, name, slug, badge, sort_order, pricing_model, base_price, logo_url, description, service_categories(name, slug)"
      )
      .eq("is_active", true)
      .order("sort_order")
      .limit(48);

    return pickFeaturedServices((data as HomeService[]) ?? [], 8);
  },
  ["home-featured-services-v1"],
  { revalidate: 300 }
);
