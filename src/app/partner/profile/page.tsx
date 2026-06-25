import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PartnerProfileView } from "@/components/partner/profile/partner-profile-view";

export default async function ProfilePage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ count: projectCount }, { count: orderCount }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("agent_id", profile!.id),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("agent_id", profile!.id),
  ]);

  return (
    <PartnerProfileView
      profile={profile!}
      projectCount={projectCount || 0}
      orderCount={orderCount || 0}
    />
  );
}
