"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { upsertBlogPost, deleteBlogPost } from "@/lib/actions";
import { BLOG_CATEGORIES, slugifyBlogTitle } from "@/lib/blog";
import { ImageUrlPreview } from "@/components/admin/image-url-preview";
import { BlogRichEditor } from "@/components/admin/blog-rich-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { BlogPost } from "@/types/database";

const inputClass = "h-11 rounded-xl";
const textareaClass = "rounded-xl";

function isEmptyHtml(html: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return !text;
}

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [category, setCategory] = useState(post?.category || "Crypto");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugifyBlogTitle(title));
  }, [title, slugTouched]);

  const wordEstimate = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text ? text.split(" ").length : 0;
  }, [content]);

  const readMinutes = Math.max(1, Math.ceil(wordEstimate / 200));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEmptyHtml(content)) {
      toast.error("Content is required");
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await upsertBlogPost(
      {
        title: String(form.get("title") || "").trim(),
        slug: String(form.get("slug") || "").trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image: String(form.get("cover_image") || "").trim() || null,
        category,
        is_published: isPublished,
        is_featured: isFeatured,
      },
      post?.id
    );
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(post ? "Post updated" : "Post created");
    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!post?.id) return;
    if (!window.confirm("Delete this blog post permanently?")) return;
    setDeleting(true);
    const result = await deleteBlogPost(post.id);
    setDeleting(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted");
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card size="sm" className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-base">Post details</CardTitle>
          <CardDescription>
            Title, slug, category, and cover image shown on the public blog.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title" className="mb-2 block">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              required
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How to Get Listed on DEXTools"
            />
          </div>

          <div>
            <Label htmlFor="slug" className="mb-2 block">
              Slug *
            </Label>
            <Input
              id="slug"
              name="slug"
              required
              className={inputClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="how-to-get-listed-on-dextools"
            />
          </div>

          <div>
            <Label className="mb-2 block">Category *</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BLOG_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="cover_image" className="mb-2 block">
              Cover image URL
            </Label>
            <ImageUrlPreview
              id="cover_image"
              name="cover_image"
              defaultValue={post?.cover_image || ""}
              placeholder="https://…"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Label htmlFor="excerpt">Excerpt / SEO summary</Label>
              <span className="text-[11px] text-muted-foreground">{excerpt.length}/220</span>
            </div>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              maxLength={220}
              className={textareaClass}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown on the blog card and search previews"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <Label>Content *</Label>
              <span className="text-[11px] text-muted-foreground">
                ~{wordEstimate} words · {readMinutes} min read
              </span>
            </div>
            <BlogRichEditor value={content} onChange={setContent} />
          </div>

          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={isPublished} onCheckedChange={(v) => setIsPublished(v === true)} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={isFeatured} onCheckedChange={(v) => setIsFeatured(v === true)} />
              Featured in Popular articles
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading} className="rounded-xl font-semibold">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {post ? "Save changes" : "Create post"}
        </Button>
        <Button type="button" variant="outline" className="rounded-xl" asChild>
          <Link href="/admin/blog">Cancel</Link>
        </Button>
        {post?.is_published && post.slug ? (
          <Button type="button" variant="outline" className="rounded-xl" asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Eye className="size-4" />
              Preview live
            </Link>
          </Button>
        ) : null}
        {post ? (
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
