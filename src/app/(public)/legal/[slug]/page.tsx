import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getLegalDocument } from "@/lib/legal-content";
import { LegalDocumentView } from "@/components/public/legal-document-view";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (document) {
    return { title: `${document.title} | ${document.site}` };
  }

  const supabase = await createClient();
  const { data: page } = await supabase.from("legal_pages").select("title").eq("slug", slug).single();
  return { title: page?.title || "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (document) {
    return <LegalDocumentView document={document} />;
  }

  const supabase = await createClient();
  const { data: page } = await supabase.from("legal_pages").select("*").eq("slug", slug).single();

  if (!page) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" asChild>
        <Link href="/">← Home</Link>
      </Button>
      <h1 className="text-2xl font-bold sm:text-3xl">{page.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last Updated: {new Date(page.updated_at).toLocaleDateString()}
      </p>
      <div className="mt-8 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
        {page.content}
      </div>
    </div>
  );
}
