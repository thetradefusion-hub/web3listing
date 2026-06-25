import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ProjectDetailView } from "@/components/partner/projects/project-detail-view";
import { PartnerPageShell, rel } from "@/components/user/ui";

export default async function UserProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("agent_id", profile!.id)
    .single();

  if (!project) notFound();

  const [{ data: orders }, { data: services }, { data: manager }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, services(*, service_categories(name, slug))")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("services")
      .select("*, service_categories(name, slug)")
      .eq("is_active", true)
      .order("sort_order")
      .limit(48),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),
  ]);

  return (
    <PartnerPageShell compact fullWidth className="gap-4 sm:gap-5">
      <ProjectDetailView
        project={project}
        orders={
          orders?.map((o) => ({
            ...o,
            services: rel(o.services),
          })) || []
        }
        services={
          services?.map((s) => ({
            ...s,
            service_categories: rel(s.service_categories),
          })) || []
        }
        managerTelegramLink={manager?.telegram_link}
        basePath="/user"
      />
    </PartnerPageShell>
  );
}
