import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { SupportClient } from "@/components/agent/support-client";
import { AgentPageShell, AgentPageHeader } from "@/components/agent/ui";

export default async function SupportPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <AgentPageShell narrow>
      <AgentPageHeader
        title="Support Tickets"
        description="Get help via Telegram or submit a support ticket"
      />
      <SupportClient tickets={tickets || []} />
    </AgentPageShell>
  );
}
