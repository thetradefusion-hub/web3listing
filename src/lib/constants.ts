import type { UserRole } from "@/types/database";

export const SITE_NAME = "TokenWeb3Listing";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const MIN_WITHDRAWAL = 10;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  waiting_payment: "Waiting Payment",
  payment_confirmed: "Payment Confirmed",
  in_progress: "In Progress",
  third_party_review: "Third Party Review",
  completed: "Completed",
  delivered: "Delivered",
  closed: "Closed",
};

export const PRICING_BADGES: Record<string, { label: string; className: string }> = {
  fixed: { label: "Fixed Price", className: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400" },
  quote: { label: "Custom Quote", className: "border-amber-500/30 bg-amber-500/15 text-amber-400" },
  enterprise: { label: "Enterprise", className: "border-red-500/30 bg-red-500/15 text-red-400" },
};

export const ADMIN_ROLES: UserRole[] = ["super_admin", "operations_manager"];
export const ALL_STAFF_ROLES: UserRole[] = ["super_admin", "operations_manager", "service_team"];
export const PARTNER_ROLE: UserRole = "agent";
export const CLIENT_ROLE: UserRole = "user";
export const OWNER_ROLES: UserRole[] = ["agent", "user"];

export function isPartnerRole(role: UserRole) {
  return role === PARTNER_ROLE;
}

export function isClientRole(role: UserRole) {
  return role === CLIENT_ROLE;
}

export const BLOCKCHAIN_NETWORKS = [
  "Ethereum", "BSC", "Polygon", "Arbitrum", "Base", "Solana", "Avalanche", "Tron", "Other",
];

export const TELEGRAM_SUPPORT =
  process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_GROUP_URL || "https://t.me/TokenWeb3Listing";
