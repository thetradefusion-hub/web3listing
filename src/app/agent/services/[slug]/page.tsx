import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PricingBadge } from "@/components/shared/pricing-badge";
import { ServicePricingCard } from "@/components/shared/service-pricing-card";
import { OrderForm } from "@/components/agent/order-form";
import { formatCurrency } from "@/lib/commission";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  AgentPrimaryButton,
  rel,
} from "@/components/agent/ui";

export default async function AgentServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const { slug } = await params;
  const { project: projectId } = await searchParams;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, service_categories(name)")
    .eq("slug", slug)
    .single();

  if (!service) notFound();

  const category = rel(service.service_categories);

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("agent_id", profile!.id)
    .in("status", ["submitted", "approved"]);

  return (
    <AgentPageShell className="mx-auto max-w-4xl">
      <AgentPageHeader
        title={service.name}
        description={category?.name}
        badge={<PricingBadge model={service.pricing_model} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AgentPanel>
            <AgentPanelHeader title="Description" />
            <AgentPanelBody>
              <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
            </AgentPanelBody>
          </AgentPanel>

          {service.proof_of_work && (
            <AgentPanel>
              <AgentPanelHeader title="Proof of Work" />
              <AgentPanelBody>
                <p className="text-sm text-slate-600">{service.proof_of_work}</p>
              </AgentPanelBody>
            </AgentPanel>
          )}

          {service.pricing_model === "quote" && (
            <AgentPanel>
              <AgentPanelHeader title="Quote Flow" />
              <AgentPanelBody>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li>1. Select service and submit requirements</li>
                  <li>2. Admin reviews and gets vendor pricing</li>
                  <li>3. Quote generated with margin added</li>
                  <li>4. Payment link sent — pay to start work</li>
                </ol>
              </AgentPanelBody>
            </AgentPanel>
          )}

          <AgentPanel>
            <AgentPanelHeader title="Service Details" />
            <AgentPanelBody className="grid gap-3 text-sm">
              {[
                ["TAT", service.estimated_tat],
                ["Payment Terms", service.payment_terms],
                [
                  "Commission",
                  service.commission_type === "percentage"
                    ? `${service.commission_value}%`
                    : formatCurrency(service.commission_value),
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-slate-50 pb-2 last:border-0">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800">{value || "—"}</span>
                </div>
              ))}
              {service.demo_link && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Demo</span>
                  <a
                    href={service.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-violet-600 hover:underline"
                  >
                    View Demo
                  </a>
                </div>
              )}
            </AgentPanelBody>
          </AgentPanel>
        </div>

        <AgentPanel className="h-fit">
          <AgentPanelBody>
            <ServicePricingCard service={service}>
              {projects && projects.length > 0 ? (
                <OrderForm service={service} projects={projects} defaultProjectId={projectId} />
              ) : (
                <div className="space-y-3 text-center">
                  <p className="text-sm text-slate-500">Create and submit a project first</p>
                  <AgentPrimaryButton href="/agent/projects/new">Create Project</AgentPrimaryButton>
                </div>
              )}
            </ServicePricingCard>
          </AgentPanelBody>
        </AgentPanel>
      </div>
    </AgentPageShell>
  );
}
