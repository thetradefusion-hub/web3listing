import { BlogPostForm } from "@/components/admin/blog-post-form";
import { AdminPageShell, AdminPageHeader } from "@/components/admin/ui";

export default function AdminNewBlogPostPage() {
  return (
    <AdminPageShell>
      <AdminPageHeader
        title="New blog post"
        description="Write and publish an article for the public blog"
      />
      <BlogPostForm />
    </AdminPageShell>
  );
}
