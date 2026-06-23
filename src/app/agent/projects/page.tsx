import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Plus } from "lucide-react";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPrimaryButton,
  AgentPanel,
  AgentPanelBody,
  AgentEmptyState,
  AgentBadge,
  projectStatusVariant,
} from "@/components/agent/ui";

export default async function ProjectsPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("agent_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <AgentPageShell>
      <AgentPageHeader
        title="My Projects"
        description="Manage your token projects and launch listings"
        action={
          <AgentPrimaryButton href="/agent/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </AgentPrimaryButton>
        }
      />

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/agent/projects/${project.id}`}>
              <AgentPanel className="h-full transition hover:border-violet-200 hover:shadow-md">
                <AgentPanelBody>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                      {project.token_symbol?.slice(0, 2).toUpperCase() || "P"}
                    </div>
                    <AgentBadge variant={projectStatusVariant(project.status)}>{project.status}</AgentBadge>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{project.project_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {project.token_name} ({project.token_symbol})
                  </p>
                  <p className="mt-2 text-xs text-slate-400">{project.blockchain_network}</p>
                </AgentPanelBody>
              </AgentPanel>
            </Link>
          ))}
        </div>
      ) : (
        <AgentEmptyState
          title="No projects yet"
          description="Create your first token project to start ordering Web3 listing services."
          action={
            <AgentPrimaryButton href="/agent/projects/new">
              <Plus className="h-4 w-4" />
              Create Project
            </AgentPrimaryButton>
          }
        />
      )}
    </AgentPageShell>
  );
}
