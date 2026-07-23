import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPublishedBlogPosts } from "@/lib/public-catalog-cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const legal = ["terms", "privacy", "refund", "aml-kyc", "sla", "partner-policy", "disclaimer"];
  const staticPages = ["", "/services", "/about", "/contact", "/blog", "/login"];

  const posts = await getPublishedBlogPosts();

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...legal.map((slug) => ({
      url: `${SITE_URL}/legal/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
