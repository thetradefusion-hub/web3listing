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

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/70 transition-all hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className={cn("relative overflow-hidden bg-muted", compact ? "aspect-[16/10]" : "aspect-[16/10]")}>
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-chart-2/15">
            <span className="text-3xl font-bold tracking-tight text-primary/40">W3</span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
          {category}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col gap-2 p-4 sm:p-5", compact && "p-3.5 sm:p-4")}>
        {dateLabel ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            {dateLabel}
          </p>
        ) : null}
        <h3
          className={cn(
            "font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary",
            compact ? "text-sm sm:text-[15px]" : "text-[15px] sm:text-base"
          )}
        >
          {post.title}
        </h3>
        <span className="sr-only">Category: {category}. Filter: /blog?category={categoryToParam(category)}</span>
      </div>
    </Link>
  );
}
