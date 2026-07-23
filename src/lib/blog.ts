export const BLOG_CATEGORIES = [
  "AI",
  "Blockchain",
  "Centralized exchange",
  "Crypto",
  "Crypto conference",
  "Crypto Marketing",
  "Decentralized exchange",
  "DeFi",
  "Gaming",
  "ICO",
  "IDO",
  "IEO",
  "Listing",
  "Memecoin",
  "Mining",
  "News",
  "NFT",
  "Regulation",
  "Scam",
  "TOP",
  "Trading",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_PAGE_SIZE = 12;

export function slugifyBlogTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function formatBlogDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function categoryToParam(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findCategoryFromParam(param: string | null | undefined, categories: string[]) {
  if (!param) return null;
  const normalized = param.toLowerCase();
  return categories.find((c) => categoryToParam(c) === normalized) ?? null;
}
