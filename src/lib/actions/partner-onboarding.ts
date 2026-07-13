"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, isEmailDeliveryConfigured } from "@/lib/email";
import { requireAuth } from "@/lib/auth";
import {
  PARTNER_AGREEMENT_POLICIES,
  PARTNER_AGREEMENT_VERSION,
  PARTNER_ROLE,
} from "@/lib/constants";
import {
  getPartnerOnboardingPath,
  nextStatusAfterKycReview,
} from "@/lib/partner-onboarding";
import type { PartnerOnboardingStatus } from "@/types/database";

function otpEmail(code: string) {
  return {
    subject: "Verify your email — Web3Listing Partner",
    html: `
      <h2>Email verification</h2>
      <p>Your Web3Listing partner application verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;">${code}</p>
      <p>This code expires in 15 minutes.</p>
    `,
  };
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function getClientMeta() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown",
    userAgent: h.get("user-agent") || "unknown",
  };
}

async function issueEmailOtp(
  userId: string,
  email: string
): Promise<
  | { error: string }
  | { success: true; stub: boolean; devCode?: string }
> {
  const admin = createAdminClient();
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await admin
    .from("partner_email_otps")
    .update({ consumed_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("consumed_at", null);

  const { error } = await admin.from("partner_email_otps").insert({
    user_id: userId,
    email: email.toLowerCase(),
    code,
    expires_at: expiresAt,
  });
  if (error) return { error: error.message };

  const emailResult = await sendEmail({ to: email, ...otpEmail(code) });
  if (!emailResult.success) {
    return {
      error:
        typeof emailResult.error === "string"
          ? emailResult.error
          : "Failed to send verification email. Check RESEND_API_KEY / EMAIL_FROM.",
    };
  }

  // Local/dev without Resend: OTP is only in DB + server logs — surface for testing.
  const stub = "stub" in emailResult && emailResult.stub;
  if (stub) {
    console.warn(`[Partner OTP stub] ${email} → ${code}`);
  }

  return {
    success: true as const,
    stub: Boolean(stub),
    // Only expose code when email was not actually delivered (stub mode).
    ...(stub && process.env.NODE_ENV !== "production" ? { devCode: code } : {}),
  };
}

export async function applyToBecomePartner(data: {
  full_name: string;
  company_name?: string;
  email: string;
  password: string;
  mobile: string;
  telegram_username: string;
  country: string;
  website?: string;
  years_of_experience: string;
  monthly_client_volume: string;
  services_offered: string;
}) {
  const email = data.email.trim().toLowerCase();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("profiles")
    .select("id, role")
    .eq("email", email)
    .maybeSingle();
  if (existing) {
    return { error: "An account with this email already exists. Please login instead." };
  }

  const { data: authUser, error } = await admin.auth.admin.createUser({
    email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name,
      role: PARTNER_ROLE,
      company_name: data.company_name || null,
      country: data.country,
    },
  });

  if (error) return { error: error.message };
  if (!authUser.user) return { error: "Failed to create account" };

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: data.full_name.trim(),
      company_name: data.company_name?.trim() || null,
      mobile: data.mobile.trim(),
      telegram_username: data.telegram_username.trim().replace(/^@/, ""),
      country: data.country.trim(),
      partner_website: data.website?.trim() || null,
      years_of_experience: data.years_of_experience.trim(),
      monthly_client_volume: data.monthly_client_volume.trim(),
      services_offered: data.services_offered.trim(),
      role: PARTNER_ROLE,
      kyc_status: "pending",
      // Email OTP skipped for now — resume from business profile.
      partner_onboarding_status: "email_verified",
      email_verified_at: new Date().toISOString(),
    })
    .eq("id", authUser.user.id);

  if (profileError) return { error: profileError.message };

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: data.password,
  });
  if (signInError) {
    return {
      success: true,
      needsLogin: true,
      redirectTo: "/login?redirect=/partner/onboarding/business-profile",
    };
  }

  return { success: true, redirectTo: "/partner/onboarding/business-profile" };
}

export async function resendPartnerEmailOtp(): Promise<
  | { error: string }
  | { success: true; stub: boolean; devCode?: string }
> {
  const profile = await requireAuth([PARTNER_ROLE]);
  if (profile.partner_onboarding_status !== "applied") {
    return { error: "Email is already verified or application is not pending verification." };
  }
  const result = await issueEmailOtp(profile.id, profile.email);
  if ("error" in result && result.error) {
    return { error: result.error };
  }
  if (!("success" in result)) {
    return { error: "Failed to send verification code." };
  }
  return {
    success: true,
    stub: Boolean(result.stub),
    ...("devCode" in result && result.devCode ? { devCode: result.devCode } : {}),
  };
}

/** Local-only: when Resend is not configured, show the latest OTP on the verify screen. */
export async function getPartnerEmailOtpDevHint() {
  if (process.env.NODE_ENV === "production" || isEmailDeliveryConfigured()) {
    return { stub: false as const };
  }

  const profile = await requireAuth([PARTNER_ROLE]);
  if (profile.partner_onboarding_status !== "applied") {
    return { stub: true as const };
  }

  const admin = createAdminClient();
  const { data: otp } = await admin
    .from("partner_email_otps")
    .select("code, expires_at")
    .eq("user_id", profile.id)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp || new Date(otp.expires_at).getTime() < Date.now()) {
    return { stub: true as const };
  }

  return { stub: true as const, code: otp.code as string };
}

export async function verifyPartnerEmailOtp(code: string) {
  const profile = await requireAuth([PARTNER_ROLE]);
  const admin = createAdminClient();
  const trimmed = code.trim();

  if (!/^\d{6}$/.test(trimmed)) return { error: "Enter the 6-digit code from your email." };

  const { data: otp } = await admin
    .from("partner_email_otps")
    .select("*")
    .eq("user_id", profile.id)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp) return { error: "No active verification code. Please resend OTP." };
  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return { error: "Code expired. Please resend OTP." };
  }
  if ((otp.attempts || 0) >= 5) {
    return { error: "Too many attempts. Please resend OTP." };
  }

  if (otp.code !== trimmed) {
    await admin
      .from("partner_email_otps")
      .update({ attempts: (otp.attempts || 0) + 1 })
      .eq("id", otp.id);
    return { error: "Invalid code. Please try again." };
  }

  await admin
    .from("partner_email_otps")
    .update({
      consumed_at: new Date().toISOString(),
      attempts: (otp.attempts || 0) + 1,
    })
    .eq("id", otp.id);

  await admin
    .from("profiles")
    .update({
      email_verified_at: new Date().toISOString(),
      partner_onboarding_status: "email_verified",
    })
    .eq("id", profile.id);

  revalidatePath("/partner/onboarding");
  return { success: true, redirectTo: "/partner/onboarding/business-profile" };
}

export async function savePartnerBusinessProfile(data: {
  company_description: string;
  business_type: string;
  target_market: string;
  existing_client_base: string;
  monthly_leads: string;
  preferred_services: string;
}) {
  const profile = await requireAuth([PARTNER_ROLE]);
  const status = profile.partner_onboarding_status || "none";
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      company_description: data.company_description.trim(),
      business_type: data.business_type.trim(),
      target_market: data.target_market.trim(),
      existing_client_base: data.existing_client_base.trim(),
      monthly_leads: data.monthly_leads.trim(),
      preferred_services: data.preferred_services.trim(),
      partner_onboarding_status:
        status === "email_verified" || status === "applied" ? "profile_complete" : status,
    })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  revalidatePath("/partner/onboarding");
  return { success: true, redirectTo: "/partner/onboarding/kyc" };
}

export async function acceptPartnerAgreements(acceptedPolicyIds: string[]) {
  const profile = await requireAuth([PARTNER_ROLE]);
  const required = PARTNER_AGREEMENT_POLICIES.filter((p) => !("optional" in p && p.optional)).map(
    (p) => p.id
  );
  const missing = required.filter((id) => !acceptedPolicyIds.includes(id));
  if (missing.length) {
    return { error: "Please accept all required policies to continue." };
  }

  const meta = await getClientMeta();
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { error } = await admin.from("partner_agreements").upsert(
    {
      user_id: profile.id,
      agreement_version: PARTNER_AGREEMENT_VERSION,
      accepted_policies: acceptedPolicyIds,
      accepted_at: now,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    },
    { onConflict: "user_id,agreement_version" }
  );
  if (error) return { error: error.message };

  const kycApproved = profile.kyc_status === "approved";
  const nextStatus: PartnerOnboardingStatus = kycApproved ? "active" : "agreements_pending";

  await admin
    .from("profiles")
    .update({
      partner_agreements_accepted_at: now,
      partner_onboarding_status: nextStatus,
      partner_activated_at: kycApproved ? now : null,
    })
    .eq("id", profile.id);

  revalidatePath("/partner/onboarding");
  revalidatePath("/partner");
  revalidatePath("/admin/partners");

  if (kycApproved) {
    return { success: true, redirectTo: "/partner" };
  }
  return {
    success: true,
    redirectTo: "/partner/onboarding/pending",
    message: "Agreements accepted. Your application is under review.",
  };
}

export async function getPartnerOnboardingRedirect() {
  const profile = await requireAuth([PARTNER_ROLE]);
  return {
    status: profile.partner_onboarding_status || "none",
    path: getPartnerOnboardingPath(profile.partner_onboarding_status, {
      agreementsAccepted: Boolean(profile.partner_agreements_accepted_at),
    }),
  };
}

/** Called from reviewKyc / approveAgentKyc to advance onboarding. */
export async function syncPartnerOnboardingAfterKyc(userId: string, approved: boolean) {
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("partner_onboarding_status, partner_agreements_accepted_at, role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== PARTNER_ROLE) return;

  const agreementsAccepted = Boolean(profile.partner_agreements_accepted_at);
  const next = nextStatusAfterKycReview(approved, agreementsAccepted);
  const patch: Record<string, string | null> = {
    partner_onboarding_status: next,
  };
  if (next === "active") {
    patch.partner_activated_at = new Date().toISOString();
  }
  await admin.from("profiles").update(patch).eq("id", userId);
}
