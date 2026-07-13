import type { PartnerOnboardingStatus, Profile } from "@/types/database";

export function getPartnerOnboardingPath(
  status: PartnerOnboardingStatus | null | undefined,
  options?: { agreementsAccepted?: boolean }
): string {
  const agreementsAccepted = Boolean(options?.agreementsAccepted);
  switch (status) {
    case "applied":
    case "email_verified":
      return "/partner/onboarding/business-profile";
    case "profile_complete":
    case "kyc_rejected":
      return "/partner/onboarding/kyc";
    case "kyc_pending":
      return agreementsAccepted
        ? "/partner/onboarding/pending"
        : "/partner/onboarding/agreements";
    case "agreements_pending":
      return agreementsAccepted
        ? "/partner/onboarding/pending"
        : "/partner/onboarding/agreements";
    case "active":
      return "/partner";
    default:
      return "/become-a-partner";
  }
}

export function isPartnerOnboardingComplete(
  profile: Pick<Profile, "role" | "partner_onboarding_status" | "kyc_status">
) {
  if (profile.role !== "agent") return true;
  const status = profile.partner_onboarding_status || "none";
  if (status === "active") return true;
  // Legacy partners: approved KYC but status never migrated
  if (status === "none" && profile.kyc_status === "approved") return true;
  return false;
}

export function isPartnerOnboardingPath(path: string) {
  return path.startsWith("/partner/onboarding");
}

export function canAccessPartnerPortal(
  profile: Pick<Profile, "role" | "partner_onboarding_status" | "kyc_status">
) {
  return isPartnerOnboardingComplete(profile);
}

/** After KYC review, move partner to the correct next onboarding status. */
export function nextStatusAfterKycReview(
  approved: boolean,
  agreementsAccepted: boolean
): PartnerOnboardingStatus {
  if (!approved) return "kyc_rejected";
  if (agreementsAccepted) return "active";
  return "agreements_pending";
}

export const ONBOARDING_STEPS = [
  { id: "business-profile", label: "Business profile", statuses: ["applied", "email_verified"] },
  { id: "kyc", label: "KYC documents", statuses: ["profile_complete", "kyc_rejected", "kyc_pending"] },
  { id: "agreements", label: "Agreements", statuses: ["kyc_pending", "agreements_pending"] },
  { id: "pending", label: "Under review", statuses: ["agreements_pending", "kyc_pending"] },
] as const;
