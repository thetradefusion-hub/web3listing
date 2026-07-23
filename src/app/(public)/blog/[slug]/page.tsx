import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/public/blog/blog-article-page";
import { getPublishedBlogPostBySlug, getPublishedBlogPosts } from "@/lib/public-catalog-cache";
import type { BlogPost } from "@/types/database";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  return {
    title: post?.title || "Blog",
    description: post?.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getPublishedBlogPosts(),
  ]);

  if (!post) notFound();

  const popular = (
    allPosts.filter((p) => p.is_featured && p.slug !== post.slug).length > 0
      ? allPosts.filter((p) => p.is_featured && p.slug !== post.slug)
      : allPosts.filter((p) => p.slug !== post.slug)
  ).slice(0, 8);

  return <BlogArticlePage post={post as BlogPost} popular={popular} />;
}
