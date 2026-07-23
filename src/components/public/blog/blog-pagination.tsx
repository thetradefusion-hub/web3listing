import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryToParam } from "@/lib/blog";

export function BlogPagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category: string | null;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", categoryToParam(category));
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  const pages = buildPageList(page, totalPages);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
      <PaginationLink href={hrefFor(Math.max(1, page - 1))} disabled={page <= 1} label="Previous">
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">Previous</span>
      </PaginationLink>

      {pages.map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
              item === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/60 text-foreground hover:border-primary/40"
            )}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Link>
        )
      )}

      <PaginationLink
        href={hrefFor(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        label="Next"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="size-4" />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/60 px-3 text-sm font-medium text-muted-foreground/50"
        aria-disabled
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card/60 px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
    >
      {children}
    </Link>
  );
}

function buildPageList(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (current >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}
