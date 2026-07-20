import { unstable_cache } from "next/cache";
import { CATALOG_CACHE_VERSION } from "@/lib/perf-cookies";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Service, ServiceCategory } from "@/types/database";

type ServiceCategoryRef =
  | { name?: string; slug?: string }
  | { name?: string; slug?: string }[]
  | null;

export type PublicServiceRow = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "logo_url"
  | "pricing_model"
  | "price"
  | "service_fee"
  | "badge"
  | "sort_order"
  | "is_active"
  | "estimated_tat"
  | "category_id"
> & {
  service_categories?: ServiceCategoryRef;
};

export type PublicServiceDetail = Pick<
  Service,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "overview"
  | "logo_url"
  | "pricing_model"
  | "price"
  | "service_fee"
  | "badge"
  | "sort_order"
  | "is_active"
  | "estimated_tat"
  | "category_id"
  | "demo_link"
  | "proof_of_work_url"
  | "payment_terms"
  | "third_party_fee_note"
  | "requires_third_party_ack"
> & {
  service_categories?: ServiceCategoryRef;
};

export const getPublicServicesCatalog = unstable_cache(
  async (): Promise<{
    categories: ServiceCategory[];
    services: PublicServiceRow[];
  }> => {
    const admin = createAdminClient();
    const [{ data: categories }, { data: services }] = await Promise.all([
      admin
        .from("service_categories")
        .select("id, name, slug, description, icon, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order"),
      admin
        .from("services")
        .select(
          "id, name, slug, description, logo_url, pricing_model, price, service_fee, badge, sort_order, is_active, estimated_tat, category_id, service_categories(name, slug)"
        )
        .eq("is_active", true)
        .order("sort_order"),
    ]);

    return {
      categories: (categories ?? []) as ServiceCategory[],
      services: (services ?? []) as PublicServiceRow[],
    };
  },
  ["public-services-catalog", CATALOG_CACHE_VERSION],
  { revalidate: 300, tags: ["services", "catalog"] }
);

export const getPublicServiceBySlug = unstable_cache(
  async (slug: string): Promise<PublicServiceDetail | null> => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("services")
      .select(
        "id, name, slug, description, overview, logo_url, pricing_model, price, service_fee, badge, sort_order, is_active, estimated_tat, category_id, demo_link, proof_of_work_url, payment_terms, third_party_fee_note, requires_third_party_ack, service_categories(name, slug)"
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    return (data as PublicServiceDetail | null) ?? null;
  },
  ["public-service-by-slug", CATALOG_CACHE_VERSION],
  { revalidate: 300, tags: ["services"] }
);

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
};

export const getPublishedBlogPosts = unstable_cache(
  async (): Promise<BlogPostSummary[]> => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("blog_posts")
      .select("id, title, slug, excerpt, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return (data ?? []) as BlogPostSummary[];
  },
  ["published-blog-posts-v1"],
  { revalidate: 300, tags: ["blog"] }
);

export const getPublishedBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    const admin = createAdminClient();
    const { data } = await admin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data;
  },
  ["published-blog-post-by-slug-v1"],
  { revalidate: 300, tags: ["blog"] }
);
