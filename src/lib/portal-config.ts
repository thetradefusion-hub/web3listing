import type { UserRole } from "@/types/database";
import { CLIENT_ROLE, PARTNER_ROLE } from "@/lib/constants";

export type PortalKind = "partner" | "user";

export const PORTALS = {
  partner: {
    basePath: "/partner",
    role: PARTNER_ROLE,
    label: "Partner Panel",
    showCommission: true,
    showWallet: true,
    kycRequired: true,
    projectAutoApprove: false,
  },
  user: {
    basePath: "/user",
    role: CLIENT_ROLE,
    label: "User Panel",
    showCommission: false,
    showWallet: false,
    kycRequired: false,
    projectAutoApprove: true,
  },
} as const;

export function getPortalForRole(role: UserRole): PortalKind | null {
  if (role === PARTNER_ROLE) return "partner";
  if (role === CLIENT_ROLE) return "user";
  return null;
}

export function getPortalPathForRole(role: UserRole): string {
  if (role === "super_admin" || role === "operations_manager" || role === "service_team") {
    return "/admin";
  }
  const portal = getPortalForRole(role);
  return portal ? PORTALS[portal].basePath : "/login";
}

export function getPortalConfig(kind: PortalKind) {
  return PORTALS[kind];
}
