import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PartnerKycView } from "@/components/partner/kyc/partner-kyc-view";

export default async function KycPage({
  searchParams,
}: {
  searchParams: Promise<{ required?: string }>;
}) {
  const profile = await getCurrentUser();
  const supabase = await createClient();
  const params = await searchParams;

  const [{ data: kyc }, managerResult] = await Promise.all([
    supabase.from("kyc_submissions").select("*").eq("user_id", profile!.id).single(),
    profile?.account_manager_id
      ? supabase.from("account_managers").select("telegram_link").eq("id", profile.account_manager_id).single()
      : supabase.from("account_managers").select("telegram_link").eq("is_active", true).limit(1).single(),
  ]);

  return (
    <PartnerKycView
      profile={profile!}
      kyc={kyc}
      required={params.required === "true"}
      managerTelegramLink={managerResult.data?.telegram_link}
    />
  );
}
