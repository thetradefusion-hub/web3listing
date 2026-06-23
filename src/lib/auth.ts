import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const profile = await getCurrentUser();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}

export function isAdminRole(role: UserRole) {
  return role === "super_admin" || role === "operations_manager";
}

export function isStaffRole(role: UserRole) {
  return isAdminRole(role) || role === "service_team";
}
