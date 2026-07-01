import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { CustomRequirementsListView } from "@/components/user/custom-requirements/custom-requirements-ui";

export default async function UserCustomRequirementsPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: requirements } = await supabase
    .from("custom_requirements")
    .select("*, projects(project_name, token_symbol)")
    .eq("user_id", profile!.id)
    .order("created_at", { ascending: false });

  return <CustomRequirementsListView requirements={requirements || []} />;
}
