import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ProjectForm } from "@/components/agent/project-form";
import {
  AgentPageShell,
  AgentPageHeader,
  AgentPanel,
  AgentPanelHeader,
  AgentPanelBody,
  AgentPrimaryButton,
  AgentBadge,
  projectStatusVariant,
} from "@/components/agent/ui";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <AgentPageShell className="mx-auto max-w-4xl">
      <AgentPageHeader
        title={project.project_name}
        description={`${project.token_name} · ${project.blockchain_network}`}
        badge={<AgentBadge variant={projectStatusVariant(project.status)}>{project.status}</AgentBadge>}
      />

      {project.status === "draft" ? (
        <AgentPanel>
          <AgentPanelHeader title="Edit Project" />
          <AgentPanelBody>
            <ProjectForm project={project} />
          </AgentPanelBody>
        </AgentPanel>
      ) : (
        <AgentPanel>
          <AgentPanelBody className="grid gap-4 md:grid-cols-2">
            {[
              ["Symbol", project.token_symbol],
              ["Contract", project.contract_address || "—"],
              ["Website", project.website_url || "—"],
              ["Email", project.official_email || "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
              </div>
            ))}
          </AgentPanelBody>
        </AgentPanel>
      )}

      <AgentPrimaryButton href={`/agent/services?project=${project.id}`}>
        Select Service for This Project
      </AgentPrimaryButton>
    </AgentPageShell>
  );
}
