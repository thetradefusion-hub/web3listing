import { ProjectForm } from "@/components/agent/project-form";
import { AgentPageShell, AgentPageHeader, AgentPanel, AgentPanelHeader, AgentPanelBody } from "@/components/agent/ui";

export default function NewProjectPage() {
  return (
    <AgentPageShell className="mx-auto max-w-4xl">
      <AgentPageHeader
        title="Create New Project"
        description="Fill in your token project details to start ordering services"
      />
      <AgentPanel>
        <AgentPanelHeader title="Project Information" />
        <AgentPanelBody>
          <ProjectForm />
        </AgentPanelBody>
      </AgentPanel>
    </AgentPageShell>
  );
}
