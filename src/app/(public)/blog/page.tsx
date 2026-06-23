import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Blog" };

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-4xl font-bold">Blog & Knowledge Base</h1>
      <div className="space-y-6">
        {posts?.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="transition-colors hover:border-cyan-500/30">
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
        {(!posts || posts.length === 0) && (
          <p className="text-center text-muted-foreground">No blog posts yet</p>
        )}
      </div>
    </div>
  );
}
