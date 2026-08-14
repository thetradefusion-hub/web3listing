import type { KycStatus, UserRole } from "@/types/database";
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

/** Route prefixes that require approved KYC before access. */
export const KYC_GATED_PATH_PREFIXES: Record<PortalKind, readonly string[]> = {
  partner: ["/partner/services"],
  user: [],
};

export function getPortalForRole(role: UserRole): PortalKind | null {
  if (role === PARTNER_ROLE) return "partner";
  if (role === CLIENT_ROLE) return "user";
  return null;
}

export function portalRequiresKyc(role: UserRole): boolean {
  const portal = getPortalForRole(role);
  return portal ? PORTALS[portal].kycRequired : false;
}

export function getKycBlockError(profile: {
  role: UserRole;
  kyc_status: KycStatus;
}): string | null {
  if (!portalRequiresKyc(profile.role)) return null;
  if (profile.kyc_status === "approved") return null;
  const portal = getPortalForRole(profile.role);
  const kycPath = portal ? `${PORTALS[portal].basePath}/kyc` : "/kyc";
  return `KYC approval required. Complete verification at ${kycPath} before continuing.`;
}

export function pathRequiresKyc(path: string, portal: PortalKind): boolean {
  return KYC_GATED_PATH_PREFIXES[portal].some((prefix) => path.startsWith(prefix));
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
