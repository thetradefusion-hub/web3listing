import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { ServicePricingCard } from "@/components/shared/service-pricing-card";
import { PRICING_CTA } from "@/lib/pricing";
import type { PricingModel } from "@/types/database";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase.from("services").select("name").eq("slug", slug).single();
  return { title: service?.name || "Service" };
}

export default async function PublicServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, service_categories(name)")
    .eq("slug", slug)
    .single();

  if (!service) notFound();

  const model = service.pricing_model as PricingModel;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">{service.service_categories?.name}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{service.name}</h1>
          <PricingBadge model={model} variant="dark" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
          {model === "quote" && (
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Partner selects service and submits requirements</li>
                  <li>2. Admin reviews and sources vendor pricing</li>
                  <li>3. Custom quote generated with margin</li>
                  <li>4. Client pays — work begins</li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit border-white/10 bg-white/[0.02]">
          <CardContent className="pt-6">
            <ServicePricingCard service={service}>
              <Button className="lh-btn-cta w-full" asChild>
                <Link href="/login">{PRICING_CTA[model]}</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Partner login required to place orders
              </p>
            </ServicePricingCard>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
