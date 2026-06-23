import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("legal_pages").select("title").eq("slug", slug).single();
  return { title: page?.title || "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("legal_pages").select("*").eq("slug", slug).single();

  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/">← Home</Link>
      </Button>
      <h1 className="text-3xl font-bold">{page.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last Updated: {new Date(page.updated_at).toLocaleDateString()}
      </p>
      <div className="mt-8 whitespace-pre-wrap text-muted-foreground leading-relaxed">
        {page.content}
      </div>
    </div>
  );
}
