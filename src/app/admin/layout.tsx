import { redirect } from "next/navigation";
import { getCurrentUser, isStaffRole } from "@/lib/auth";
import { AdminPortalShell } from "@/components/admin/portal-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUser();
  if (!profile) redirect("/login");
  if (!isStaffRole(profile.role)) redirect("/agent");

  return <AdminPortalShell profile={profile}>{children}</AdminPortalShell>;
}
