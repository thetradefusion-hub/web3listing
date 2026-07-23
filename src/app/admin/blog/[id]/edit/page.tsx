import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { AdminPageShell, AdminPageHeader } from "@/components/admin/ui";
import type { BlogPost } from "@/types/database";

export default async function AdminEditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (!post) notFound();

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Edit blog post"
        description="Update content, category, cover image, and publish settings"
      />
      <BlogPostForm post={post as BlogPost} />
    </AdminPageShell>
  );
}
