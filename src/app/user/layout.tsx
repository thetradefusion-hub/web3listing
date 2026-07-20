import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAccountManagerForProfile } from "@/lib/account-manager";
import { UserPortalShell } from "@/components/user/portal-shell";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  if (profile.role !== "user") {
    if (profile.role === "agent") redirect("/partner");
    redirect("/admin");
  }

  const manager = await getAccountManagerForProfile(profile);

  return (
    <UserPortalShell profile={profile} manager={manager}>
      {children}
    </UserPortalShell>
  );
}
