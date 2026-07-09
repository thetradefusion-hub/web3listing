import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PortalProjectEditView } from "@/components/partner/projects/portal-project-edit-view";

export default async function PartnerProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: project }, { count: orderCount }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).eq("agent_id", profile!.id).single(),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("project_id", id),
  ]);

  if (!project) notFound();

  return (
    <PortalProjectEditView
      project={project}
      orderCount={orderCount || 0}
      basePath="/partner"
    />
  );
}
