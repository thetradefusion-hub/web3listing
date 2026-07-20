import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedBlogPosts } from "@/lib/public-catalog-cache";

export const metadata = { title: "Blog" };
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Blog & Knowledge Base</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="transition-colors hover:border-primary/30">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground">No blog posts yet</p>
        )}
      </div>
    </div>
  );
}
