import Link from "next/link";
import { BlogCategoryChips } from "@/components/public/blog/blog-category-chips";
import { BlogPagination } from "@/components/public/blog/blog-pagination";
import { BlogPopularSection } from "@/components/public/blog/blog-popular-section";
import { BlogPostCard } from "@/components/public/blog/blog-post-card";
import { BLOG_PAGE_SIZE, findCategoryFromParam } from "@/lib/blog";
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

  const categories = [
    ...new Set(
      allPosts
        .map((p) => p.category?.trim())
        .filter((c): c is string => Boolean(c))
    ),
  ].sort((a, b) => a.localeCompare(b));

  const activeCategory = findCategoryFromParam(params.category, categories);
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
  ).slice(0, 8);

  return (
    <div className="landing-section">
      <div className="landing-container">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-foreground">Blog</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Guides on exchange listings, crypto marketing, market making, and Web3 growth — written for founders and
          partners.
        </p>

        <div className="mt-8">
          <BlogCategoryChips categories={categories} activeCategory={activeCategory} />
        </div>

        {pagePosts.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">No articles in this category yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another filter or check back soon.</p>
            <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              View all posts
            </Link>
          </div>
        )}

        <BlogPagination page={page} totalPages={totalPages} category={activeCategory} />

        <BlogPopularSection posts={popular} />
      </div>
    </div>
  );
}
