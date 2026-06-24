import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ServiceDetailView } from "@/components/agent/services/service-detail-view";
import { rel } from "@/components/agent/ui";

export default async function AgentServiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ project?: string; order?: string }>;
}) {
  const { slug } = await params;
  const { project: projectId } = await searchParams;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("*, service_categories(name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!service) notFound();

  const category = rel(service.service_categories);

  const [{ data: projects }, { data: recentOrders }, { data: manager }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("agent_id", profile!.id)
      .in("status", ["submitted", "approved"]),
    supabase
      .from("orders")
      .select("id, updated_at, projects(project_name, token_symbol)")
      .eq("service_id", service.id)
      .in("status", ["completed", "delivered", "closed"])
      .order("updated_at", { ascending: false })
      .limit(4),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),
  ]);

  const recentListings =
    recentOrders?.map((o) => {
      const project = rel(o.projects);
      return {
        id: o.id,
        project_name: project?.project_name || "Project",
        token_symbol: project?.token_symbol || null,
        completed_at: o.updated_at,
      };
    }) || [];

  return (
    <ServiceDetailView
      service={service}
      categoryName={category?.name || "Services"}
      categorySlug={category?.slug || ""}
      projects={projects || []}
      defaultProjectId={projectId}
      recentListings={recentListings}
      managerTelegramLink={manager?.telegram_link}
    />
  );
}
