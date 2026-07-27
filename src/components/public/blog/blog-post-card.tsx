import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryToParam, formatBlogDate } from "@/lib/blog";
import type { BlogPostSummary } from "@/lib/public-catalog-cache";

export function BlogPostCard({
  post,
  className,
  compact = false,
}: {
  post: BlogPostSummary;
  className?: string;
  compact?: boolean;
}) {
  const category = post.category?.trim() || "Crypto";
  const dateLabel = formatBlogDate(post.published_at);
  const href = `/blog/${post.slug}`;

  return (
    <article className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted",
          compact ? "aspect-[16/10]" : "aspect-[16/10] sm:aspect-[16/9]"
        )}
      >
        <Link href={href} className="absolute inset-0" tabIndex={-1} aria-hidden>
          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt=""
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 via-background to-chart-2/10">
              <span className="text-2xl font-bold tracking-tight text-primary/35">W3</span>
            </div>
          )}
        </Link>

        <Link
          href={`/blog?category=${categoryToParam(category)}`}
          className="absolute left-3 top-3 z-10 rounded-md bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground sm:text-xs"
        >
          {category}
        </Link>
      </div>

      <div className={cn("pt-3 sm:pt-4", compact && "pt-2.5 sm:pt-3")}>
        {dateLabel ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground sm:text-[13px]">
            <CalendarDays className="size-3.5 shrink-0 opacity-70" />
            {dateLabel}
          </p>
        ) : null}
        <h3
          className={cn(
            "mt-1.5 font-bold leading-snug tracking-tight",
            compact ? "text-sm sm:text-base" : "text-base sm:text-lg lg:text-xl"
          )}
        >
          <Link
            href={href}
            className="text-foreground transition-colors group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
