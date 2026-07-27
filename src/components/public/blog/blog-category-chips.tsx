import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryToParam } from "@/lib/blog";

export function BlogCategoryChips({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory: string | null;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-5 sm:gap-y-2.5">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog?category=${categoryToParam(category)}`}
          className={cn(
            "text-sm font-medium transition-colors sm:text-[15px]",
            activeCategory === category
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

export function BlogBreadcrumb() {
  return (
    <nav
      className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span className="font-medium text-foreground">Blog</span>
    </nav>
  );
}
