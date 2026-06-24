import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { SupportClient } from "@/components/partner/support-client";
import { PartnerPageShell, PartnerPageHeader } from "@/components/partner/ui";

export default async function SupportPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", profile!.id)
    .order("created_at", { ascending: false });

  return (
    <PartnerPageShell narrow>
      <PartnerPageHeader
        title="Support Tickets"
        description="Get help via Telegram or submit a support ticket"
      />
      <SupportClient tickets={tickets || []} />
    </PartnerPageShell>
  );
}
