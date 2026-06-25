import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PartnerProjectsView } from "@/components/partner/projects/partner-projects-view";

export default async function UserProjectsPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: projects }, { data: orders }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("agent_id", profile!.id)
      .order("created_at", { ascending: false }),
    supabase.from("orders").select("project_id").eq("agent_id", profile!.id),
  ]);

  const orderCountByProject: Record<string, number> = {};
  for (const order of orders || []) {
    orderCountByProject[order.project_id] = (orderCountByProject[order.project_id] || 0) + 1;
  }

  return (
    <PartnerProjectsView
      projects={projects || []}
      orderCountByProject={orderCountByProject}
      basePath="/user"
    />
  );
}
