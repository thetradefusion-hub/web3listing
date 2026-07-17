import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { ServicePricingCard } from "@/components/shared/service-pricing-card";
import { PRICING_CTA } from "@/lib/pricing";
import {
  getCategoryIcon,
  getServiceLogoColor,
  getServiceLogoUrl,
} from "@/lib/service-catalog";
import { cn } from "@/lib/utils";
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
    .select("*, service_categories(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!service) notFound();

  const model = service.pricing_model as PricingModel;
  const category = Array.isArray(service.service_categories)
    ? service.service_categories[0]
    : service.service_categories;
  const logoUrl = getServiceLogoUrl(service);
  const CatIcon = getCategoryIcon(category?.slug);

  return (
    <div className="landing-section">
      <div className="landing-container max-w-5xl">
        <Button variant="outline" className="mb-6 h-10 rounded-xl font-semibold" asChild>
          <Link href={category?.slug ? `/services?category=${category.slug}` : "/services"}>
            <ArrowLeft data-icon="inline-start" />
            {category?.name ? `Back to ${category.name}` : "Back to services"}
          </Link>
        </Button>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={cn(
                "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/60",
                logoUrl ? "bg-white dark:bg-white" : getServiceLogoColor(service.name)
              )}
            >
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="" className="size-12 object-contain" />
              ) : (
                <CatIcon className="size-7" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0">
              {category?.name ? (
                <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
              ) : null}
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{service.name}</h1>
              {service.estimated_tat ? (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {service.estimated_tat}
                </p>
              ) : null}
            </div>
          </div>
          <PricingBadge model={model} variant="dark" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {service.description || "Professional Web3 service with transparent pricing and dedicated support."}
                </p>
              </CardContent>
            </Card>

            {service.overview ? (
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{service.overview}</p>
                </CardContent>
              </Card>
            ) : null}

            {service.demo_link || service.proof_of_work_url ? (
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {service.demo_link ? (
                    <Button variant="outline" className="rounded-xl" asChild>
                      <a href={service.demo_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink data-icon="inline-start" />
                        Demo
                      </a>
                    </Button>
                  ) : null}
                  {service.proof_of_work_url ? (
                    <Button variant="outline" className="rounded-xl" asChild>
                      <a href={service.proof_of_work_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink data-icon="inline-start" />
                        Proof of work
                      </a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {model === "quote" ? (
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li>1. Partner selects service and submits requirements</li>
                    <li>2. Admin reviews and sources vendor pricing</li>
                    <li>3. Custom quote generated with margin</li>
                    <li>4. Client pays — work begins</li>
                  </ol>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Card className="h-fit border-border/80 bg-card/70">
            <CardContent className="pt-6">
              <ServicePricingCard service={service}>
                <Button className="lh-btn-cta w-full" asChild>
                  <Link href="/login">{PRICING_CTA[model]}</Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Login required to place orders
                </p>
              </ServicePricingCard>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
