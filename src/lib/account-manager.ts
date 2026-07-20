import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AccountManager, Profile } from "@/types/database";

/** Shared account manager lookup — deduped per request across layout + pages. */
export const getAccountManagerForProfile = cache(
  async (profile: Profile): Promise<AccountManager | null> => {
    const supabase = await createClient();
    const { data: manager } = profile.account_manager_id
      ? await supabase
          .from("account_managers")
          .select("*")
          .eq("id", profile.account_manager_id)
          .single()
      : await supabase.from("account_managers").select("*").eq("is_active", true).limit(1).single();

    return (manager as AccountManager | null) ?? null;
  }
);
