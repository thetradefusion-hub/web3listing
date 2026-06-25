import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PartnerSupportView } from "@/components/partner/support/partner-support-view";

export default async function SupportPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: tickets }, { data: manager }] = await Promise.all([
    supabase
      .from("tickets")
      .select("*")
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false }),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("*").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("*").eq("is_active", true).limit(1).single(),
  ]);

  return <PartnerSupportView tickets={tickets || []} manager={manager} />;
}
