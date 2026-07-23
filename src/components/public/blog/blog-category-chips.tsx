import Link from "next/link";
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
    <div className="flex flex-wrap gap-2">
      <CategoryChip href="/blog" active={!activeCategory} label="All" />
      {categories.map((category) => {
        const param = categoryToParam(category);
        return (
          <CategoryChip
            key={category}
            href={`/blog?category=${param}`}
            active={activeCategory === category}
            label={category}
          />
        );
      })}
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-[13px]",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}
