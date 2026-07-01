import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  CustomRequirementForm,
  CustomRequirementNewHeader,
} from "@/components/user/custom-requirement-form";
import { CustomRequirementFormTips } from "@/components/user/custom-requirements/custom-requirements-ui";
import { PartnerPageShell, PartnerPanel, PartnerPanelBody } from "@/components/user/ui";

export default async function NewCustomRequirementPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, project_name, token_symbol")
    .eq("agent_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <PartnerPageShell className="mx-auto max-w-6xl">
      <CustomRequirementNewHeader />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <PartnerPanel className="overflow-hidden border-primary/10 shadow-sm">
          <PartnerPanelBody className="p-4 sm:p-6">
            <CustomRequirementForm projects={projects || []} />
          </PartnerPanelBody>
        </PartnerPanel>

        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <CustomRequirementFormTips />
          </div>
        </aside>
      </div>

      <div className="mt-6 lg:hidden">
        <CustomRequirementFormTips />
      </div>
    </PartnerPageShell>
  );
}
