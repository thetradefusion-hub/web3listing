import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";
import { CLIENT_ROLE, PARTNER_ROLE } from "@/lib/constants";

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

export function isPartnerRole(role: UserRole) {
  return role === PARTNER_ROLE;
}

export function isClientRole(role: UserRole) {
  return role === CLIENT_ROLE;
}

export function isOwnerRole(role: UserRole) {
  return isPartnerRole(role) || isClientRole(role);
}
