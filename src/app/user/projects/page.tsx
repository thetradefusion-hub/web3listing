import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  PartnerProjectsView,
  type ProjectCardProgress,
} from "@/components/partner/projects/partner-projects-view";
import { computeGrowthPhases } from "@/lib/project-recommendations";
import { rel } from "@/components/user/ui";
import type { Order, Project, Service } from "@/types/database";

type OrderRow = Order & {
  services?: (Service & {
    service_categories?: { slug: string; name?: string } | { slug: string; name?: string }[] | null;
  }) | null;
};

function buildProgressByProject(projects: Project[], orders: OrderRow[]) {
  const byProject: Record<string, OrderRow[]> = {};
  for (const order of orders) {
    const list = byProject[order.project_id] || [];
    list.push(order);
    byProject[order.project_id] = list;
  }

  const progressByProject: Record<string, ProjectCardProgress> = {};
  for (const project of projects) {
    const projectOrders = (byProject[project.id] || []).map((o) => ({
      ...o,
      services: o.services || undefined,
    }));
    const { score, summary } = computeGrowthPhases(project, projectOrders, []);
    progressByProject[project.id] = {
      score,
      stagesCompleted: summary.stagesCompleted,
      stagesTotal: summary.stagesTotal,
    };
  }
  return progressByProject;
}

export default async function UserProjectsPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: projects }, { data: orders }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("agent_id", profile!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*, services(id, service_categories(name, slug))")
      .eq("agent_id", profile!.id),
  ]);

  const orderRows: OrderRow[] =
    orders?.map((o) => ({
      ...o,
      services: rel(o.services),
    })) || [];

  const orderCountByProject: Record<string, number> = {};
  for (const order of orderRows) {
    orderCountByProject[order.project_id] = (orderCountByProject[order.project_id] || 0) + 1;
  }

  const progressByProject = buildProgressByProject(projects || [], orderRows);

  return (
    <PartnerProjectsView
      projects={projects || []}
      orderCountByProject={orderCountByProject}
      progressByProject={progressByProject}
      basePath="/user"
    />
  );
}
