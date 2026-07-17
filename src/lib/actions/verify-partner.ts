"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { PARTNER_ROLE } from "@/lib/constants";

export type PartnerVerifyResult =
  | {
      status: "verified";
      displayName: string;
      companyName: string | null;
      matchedBy: "email" | "mobile" | "telegram" | "id";
    }
  | {
      status: "unverified";
      query: string;
    }
  | {
      status: "error";
      error: string;
    };

function normalizeQuery(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

function detectAndNormalize(raw: string): {
  kind: "email" | "mobile" | "telegram" | "id" | "unknown";
  value: string;
} {
  const q = normalizeQuery(raw);
  if (!q) return { kind: "unknown", value: "" };

  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRe.test(q)) return { kind: "id", value: q.toLowerCase() };

  if (q.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) {
    return { kind: "email", value: q.toLowerCase() };
  }

  const telegram = q.replace(/^@/, "").replace(/^https?:\/\/(t\.me|telegram\.me)\//i, "");
  if (/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(telegram) && !telegram.includes("@")) {
    // Prefer telegram when it looks like a username (starts with letter, has underscore, etc.)
    // But pure numeric or phone-like should be mobile.
    if (!/^\d+$/.test(telegram)) {
      return { kind: "telegram", value: telegram.toLowerCase() };
    }
  }

  const digits = q.replace(/[^\d+]/g, "");
  const mobileDigits = digits.replace(/^\+/, "").replace(/\D/g, "");
  if (mobileDigits.length >= 8 && mobileDigits.length <= 15) {
    return { kind: "mobile", value: mobileDigits };
  }

  if (q.startsWith("@") || /^https?:\/\/(t\.me|telegram\.me)\//i.test(q)) {
    return { kind: "telegram", value: telegram.toLowerCase() };
  }

  // Fallback: treat as telegram username attempt
  if (/^[a-zA-Z0-9_]{5,32}$/.test(q)) {
    return { kind: "telegram", value: q.toLowerCase() };
  }

  return { kind: "unknown", value: q };
}

function mobileMatches(stored: string | null, needleDigits: string) {
  if (!stored) return false;
  const storedDigits = stored.replace(/\D/g, "");
  if (!storedDigits) return false;
  return (
    storedDigits === needleDigits ||
    storedDigits.endsWith(needleDigits) ||
    needleDigits.endsWith(storedDigits)
  );
}

export async function verifyPartnerContact(query: string): Promise<PartnerVerifyResult> {
  const detected = detectAndNormalize(query);
  if (!detected.value || detected.kind === "unknown") {
    return {
      status: "error",
      error: "Enter a valid email, mobile number, Telegram username, or partner ID.",
    };
  }

  if (detected.value.length < 3) {
    return { status: "error", error: "Query is too short." };
  }

  try {
    const admin = createAdminClient();
    let match:
      | {
          id: string;
          full_name: string | null;
          company_name: string | null;
          email: string;
          mobile: string | null;
          telegram_username: string | null;
        }
      | null = null;
    let matchedBy: "email" | "mobile" | "telegram" | "id" = "email";

    if (detected.kind === "id") {
      const { data } = await admin
        .from("profiles")
        .select("id, full_name, company_name, email, mobile, telegram_username")
        .eq("id", detected.value)
        .eq("role", PARTNER_ROLE)
        .eq("partner_onboarding_status", "active")
        .maybeSingle();
      match = data;
      matchedBy = "id";
    } else if (detected.kind === "email") {
      const { data } = await admin
        .from("profiles")
        .select("id, full_name, company_name, email, mobile, telegram_username")
        .eq("email", detected.value)
        .eq("role", PARTNER_ROLE)
        .eq("partner_onboarding_status", "active")
        .maybeSingle();
      match = data;
      matchedBy = "email";
    } else if (detected.kind === "telegram") {
      const { data } = await admin
        .from("profiles")
        .select("id, full_name, company_name, email, mobile, telegram_username")
        .ilike("telegram_username", detected.value)
        .eq("role", PARTNER_ROLE)
        .eq("partner_onboarding_status", "active")
        .maybeSingle();
      match = data;
      matchedBy = "telegram";
    } else if (detected.kind === "mobile") {
      // Fetch active partners with mobile set, then match normalized digits.
      const { data } = await admin
        .from("profiles")
        .select("id, full_name, company_name, email, mobile, telegram_username")
        .eq("role", PARTNER_ROLE)
        .eq("partner_onboarding_status", "active")
        .not("mobile", "is", null)
        .limit(500);
      match = (data || []).find((row) => mobileMatches(row.mobile, detected.value)) ?? null;
      matchedBy = "mobile";
    }

    if (!match) {
      return { status: "unverified", query: normalizeQuery(query) };
    }

    return {
      status: "verified",
      displayName: match.full_name?.trim() || match.company_name?.trim() || "Verified Partner",
      companyName: match.company_name?.trim() || null,
      matchedBy,
    };
  } catch {
    return {
      status: "error",
      error: "Verification is temporarily unavailable. Please try again.",
    };
  }
}
