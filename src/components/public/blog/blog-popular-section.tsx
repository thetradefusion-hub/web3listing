import { BlogPostCard } from "@/components/public/blog/blog-post-card";
import type { BlogPostSummary } from "@/lib/public-catalog-cache";

export function BlogPopularSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative mt-14 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/[0.06] via-card/40 to-chart-2/[0.05] px-4 py-10 sm:mt-16 sm:px-6 sm:py-12 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--foreground) 4%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 100%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Popular articles</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Most-read guides on exchange listings, marketing, and Web3 growth.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
