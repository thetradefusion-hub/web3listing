import Link from "next/link";
import { CalendarDays, RefreshCw } from "lucide-react";
import { BlogArticleBody } from "@/components/public/blog/blog-article-body";
import { BlogPopularSection } from "@/components/public/blog/blog-popular-section";
import { BlogRequestCta } from "@/components/public/blog/blog-request-cta";
import { categoryToParam, formatBlogDate } from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/public-catalog-cache";
import type { BlogPost } from "@/types/database";

export function BlogArticlePage({
  post,
  popular,
}: {
  post: BlogPost;
  popular: BlogPostSummary[];
}) {
  const category = post.category?.trim() || "Crypto";
  const published = formatBlogDate(post.published_at);
  const updated = formatBlogDate(post.updated_at);

  return (
    <div className="landing-section !pt-8 sm:!pt-10">
      <div className="landing-container max-w-4xl">
        <nav
          className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/blog?category=${categoryToParam(category)}`}
            className="transition-colors hover:text-foreground"
          >
            {category}
          </Link>
          <span aria-hidden>/</span>
          <span className="line-clamp-1 font-medium text-foreground">{post.title}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {published ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-primary" />
              {published}
            </span>
          ) : null}
          {updated && updated !== published ? (
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="size-3.5 text-primary" />
              Updated: {updated}
            </span>
          ) : null}
          <Link
            href={`/blog?category=${categoryToParam(category)}`}
            className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            {category}
          </Link>
        </div>

        {post.cover_image ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/80 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt="" className="aspect-[16/9] w-full object-cover" />
          </div>
        ) : null}

        <div className="mt-8">
          <BlogRequestCta />
        </div>

        {post.excerpt ? (
          <p className="mt-8 text-lg font-medium leading-relaxed text-foreground/85 sm:text-xl sm:leading-8">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-8">
          <BlogArticleBody content={post.content} />
        </div>

        <div className="mt-12">
          <BlogRequestCta
            title="Leave a request"
            description="Need help with exchange listing, market making, or growth? Tell us about your project and our team will get back to you."
            buttonLabel="Submit application"
          />
        </div>
      </div>

      <div className="landing-container mt-4">
        <BlogPopularSection posts={popular} />
      </div>
    </div>
  );
}
