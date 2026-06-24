import { ProjectForm } from "@/components/partner/project-form";
import { PartnerPageShell, PartnerPageHeader, PartnerPanel, PartnerPanelHeader, PartnerPanelBody } from "@/components/partner/ui";

export default function NewProjectPage() {
  return (
    <PartnerPageShell className="mx-auto max-w-4xl">
      <PartnerPageHeader
        title="Create New Project"
        description="Fill in your token project details to start ordering services"
      />
      <PartnerPanel>
        <PartnerPanelHeader title="Project Information" />
        <PartnerPanelBody>
          <ProjectForm />
        </PartnerPanelBody>
      </PartnerPanel>
    </PartnerPageShell>
  );
}
