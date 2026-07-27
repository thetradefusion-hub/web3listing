import Link from "next/link";
import {
  BlogBreadcrumb,
  BlogCategoryChips,
} from "@/components/public/blog/blog-category-chips";
import { BlogPagination } from "@/components/public/blog/blog-pagination";
import { BlogPopularSection } from "@/components/public/blog/blog-popular-section";
import { BlogPostCard } from "@/components/public/blog/blog-post-card";
import { BLOG_CATEGORIES, BLOG_PAGE_SIZE, findCategoryFromParam } from "@/lib/blog";
import { getPublishedBlogPosts } from "@/lib/public-catalog-cache";

export const metadata = { title: "Blog" };
export const revalidate = 300;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const allPosts = await getPublishedBlogPosts();

  const dbCategories = [
    ...new Set(
      allPosts
        .map((p) => p.category?.trim())
        .filter((c): c is string => Boolean(c))
    ),
  ];

  const filterCategories = Array.from(
    new Set([...BLOG_CATEGORIES, ...dbCategories])
  ).sort((a, b) => a.localeCompare(b));

  const activeCategory = findCategoryFromParam(params.category, filterCategories);
  const filtered = activeCategory
    ? allPosts.filter((p) => (p.category?.trim() || "") === activeCategory)
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.page) || 1), totalPages);
  const start = (page - 1) * BLOG_PAGE_SIZE;
  const pagePosts = filtered.slice(start, start + BLOG_PAGE_SIZE);

  const popular = (
    allPosts.filter((p) => p.is_featured).length > 0
      ? allPosts.filter((p) => p.is_featured)
      : allPosts
  ).slice(0, 12);

  return (
    <div className="pb-8">
      <section className="landing-section-tight border-b border-border">
        <div className="landing-container">
          <BlogBreadcrumb />
          <h1 className="lh-display text-foreground">
            <span className="lh-brand-gradient">Blog</span>
          </h1>

          <div className="mt-8 sm:mt-10">
            <BlogCategoryChips
              categories={filterCategories}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </section>

      <section className="landing-section-tight">
        <div className="landing-container">
          {pagePosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
              {pagePosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                No articles in this category yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another filter or check back soon.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                View all posts
              </Link>
            </div>
          )}

          <BlogPagination
            page={page}
            totalPages={totalPages}
            category={activeCategory}
          />
        </div>
      </section>

      <BlogPopularSection posts={popular} />
    </div>
  );
}
