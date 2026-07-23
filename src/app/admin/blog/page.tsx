import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatBlogDate } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import {
  AdminPageShell,
  AdminPageHeader,
  AdminPanel,
  AdminPanelBody,
  AdminBadge,
  AdminEmptyState,
} from "@/components/admin/ui";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Blog"
        description="Create and publish articles for the public knowledge base"
        action={
          <Button className="rounded-xl font-semibold" asChild>
            <Link href="/admin/blog/new">
              <Plus className="size-4" />
              New post
            </Link>
          </Button>
        }
      />

      {posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <AdminPanel key={post.id}>
              <AdminPanelBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-slate-900">{post.title}</p>
                    <AdminBadge variant={post.is_published ? "success" : "muted"}>
                      {post.is_published ? "Published" : "Draft"}
                    </AdminBadge>
                    {post.is_featured ? <AdminBadge variant="info">Popular</AdminBadge> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {post.category || "Uncategorized"} · /blog/{post.slug}
                    {post.published_at ? ` · ${formatBlogDate(post.published_at)}` : ""}
                  </p>
                </div>
                <Button variant="outline" className="shrink-0 rounded-xl" asChild>
                  <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                </Button>
              </AdminPanelBody>
            </AdminPanel>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          title="No blog posts yet"
          description="Create your first article to appear on the public blog."
          action={
            <Button className="rounded-xl font-semibold" asChild>
              <Link href="/admin/blog/new">
                <Plus className="size-4" />
                New post
              </Link>
            </Button>
          }
        />
      )}
    </AdminPageShell>
  );
}
