import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("title").eq("slug", slug).single();
  return { title: post?.title || "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).single();

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/blog">← Back to Blog</Link>
      </Button>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
      </p>
      <div className="prose prose-invert mt-8 max-w-none">
        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{post.content}</p>
      </div>
    </article>
  );
}
