import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { getServicePriceLabel } from "@/lib/pricing";
import type { PricingModel } from "@/types/database";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPanel,
  AgentPanelBody,
  AgentFilterPill,
  rel,
} from "@/components/agent/ui";

export default async function AgentServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; category?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: allServices }, { data: categories }] = await Promise.all([
    supabase.from("services").select("*, service_categories(name, slug)").eq("is_active", true).order("sort_order"),
    supabase.from("service_categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const services = params.category
    ? allServices?.filter((s) => rel(s.service_categories)?.slug === params.category)
    : allServices;

  const baseQuery = params.project ? `?project=${params.project}` : "";
  const withProject = (extra: string) =>
    params.project ? `${extra}${extra.includes("?") ? "&" : "?"}project=${params.project}` : extra;

  function getPriceDisplay(service: { pricing_model: PricingModel; price: number | null; service_fee: number | null }) {
    return getServicePriceLabel(service);
  }

  return (
    <AgentPageShell>
      <AgentPageHeader
        title="All Services"
        description="Browse and order Web3 listing, marketing, and growth services"
      />

      <div className="flex flex-wrap gap-2">
        <AgentFilterPill href={`/agent/services${baseQuery}`} active={!params.category}>
          All
        </AgentFilterPill>
        {categories?.map((cat) => (
          <AgentFilterPill
            key={cat.id}
            href={`/agent/services?category=${cat.slug}${params.project ? `&project=${params.project}` : ""}`}
            active={params.category === cat.slug}
          >
            {cat.name}
          </AgentFilterPill>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services?.map((service) => {
          const category = rel(service.service_categories);
          return (
            <Link key={service.id} href={`/agent/services/${service.slug}${withProject("")}`}>
              <AgentPanel className="flex h-full flex-col transition hover:border-violet-200 hover:shadow-md">
                <AgentPanelBody className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    <PricingBadge model={service.pricing_model} />
                  </div>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-600">{category?.name}</p>
                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-500">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-semibold text-slate-900">{getPriceDisplay(service)}</span>
                    <span className="text-xs text-slate-400">{service.estimated_tat}</span>
                  </div>
                </AgentPanelBody>
              </AgentPanel>
            </Link>
          );
        })}
      </div>
    </AgentPageShell>
  );
}
