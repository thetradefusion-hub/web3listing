import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AgentPortalShell } from "@/components/agent/portal-shell";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  if (profile.role !== "agent") redirect("/admin");

  const supabase = await createClient();
  const { data: manager } = profile.account_manager_id
    ? await supabase.from("account_managers").select("*").eq("id", profile.account_manager_id).single()
    : await supabase.from("account_managers").select("*").eq("is_active", true).limit(1).single();

  return (
    <AgentPortalShell profile={profile} manager={manager}>
      {children}
    </AgentPortalShell>
  );
}
