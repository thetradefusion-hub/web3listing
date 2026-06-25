import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { PartnerWalletView } from "@/components/partner/wallet/partner-wallet-view";

export default async function PartnerWalletPage() {
  const profile = await getCurrentUser();
  const supabase = await createClient();

  const [{ data: wallet }, { data: ledger }, { data: withdrawals }] = await Promise.all([
    supabase.from("wallets").select("*").eq("user_id", profile!.id).single(),
    supabase
      .from("commission_ledger")
      .select("*")
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <PartnerWalletView
      wallet={wallet}
      ledger={ledger || []}
      withdrawals={withdrawals || []}
    />
  );
}
