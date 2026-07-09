import type { Project } from "@/types/database";

export type RequirementFieldType = "text" | "url" | "email" | "number" | "textarea";

export type StructuredOrderRequirements = {
  kind: "structured";
  responses: Record<string, string>;
  notes?: string;
};

export type LegacyOrderRequirements = {
  kind: "legacy";
  text: string;
};

const STRUCTURED_PREFIX = '{"_v":1,"responses":';

function normalizeLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/\[.*?\]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function inferRequirementFieldType(label: string): RequirementFieldType {
  const normalized = normalizeLabel(label);

  if (normalized.includes("email")) return "email";
  if (
    normalized.includes("website") ||
    normalized.includes("whitepaper") ||
    normalized.includes("logo") ||
    normalized.includes("url") ||
    normalized.includes("link") ||
    normalized.includes("http")
  ) {
    return "url";
  }
  if (normalized.includes("decimal")) return "number";
  if (
    normalized.includes("social") ||
    normalized.includes("description") ||
    normalized.includes("notes") ||
    normalized.includes("additional")
  ) {
    return "textarea";
  }
  return "text";
}

export function getProjectPrefillValue(label: string, project: Project): string | null {
  const normalized = normalizeLabel(label);

  if (normalized.includes("project name")) return project.project_name || null;
  if (normalized.includes("token name")) return project.token_name || null;
  if (normalized.includes("token symbol") || normalized === "symbol") return project.token_symbol || null;
  if (normalized.includes("contract")) return project.contract_address || null;
  if (normalized.includes("network") || normalized.includes("blockchain")) {
    return project.blockchain_network || null;
  }
  if (normalized.includes("website")) return project.website_url || null;
  if (normalized.includes("whitepaper")) return project.whitepaper_url || null;
  if (normalized.includes("tokenomics")) return project.tokenomics_url || null;
  if (normalized.includes("logo")) return project.logo_url || null;
  if (normalized.includes("email")) return project.official_email || null;
  if (normalized.includes("telegram")) return project.social_telegram || null;
  if (normalized.includes("twitter")) return project.social_twitter || null;
  if (normalized.includes("discord")) return project.social_discord || null;
  if (normalized.includes("medium")) return project.social_medium || null;
  if (normalized.includes("github")) return project.social_github || null;

  return null;
}

export function serializeRequirementResponses(
  responses: Record<string, string>,
  notes?: string
): string {
  return JSON.stringify({
    _v: 1,
    responses,
    notes: notes?.trim() || undefined,
  });
}

export function parseOrderRequirements(
  raw: string | null | undefined
): StructuredOrderRequirements | LegacyOrderRequirements | null {
  if (!raw?.trim()) return null;

  const trimmed = raw.trim();
  if (!trimmed.startsWith(STRUCTURED_PREFIX)) {
    return { kind: "legacy", text: trimmed };
  }

  try {
    const parsed = JSON.parse(trimmed) as {
      _v?: number;
      responses?: Record<string, string>;
      notes?: string;
    };
    if (!parsed.responses || typeof parsed.responses !== "object") {
      return { kind: "legacy", text: trimmed };
    }
    return {
      kind: "structured",
      responses: parsed.responses,
      notes: parsed.notes,
    };
  } catch {
    return { kind: "legacy", text: trimmed };
  }
}

export function validateRequirementResponses(
  requiredDocuments: string[],
  responses: Record<string, string>
): string | null {
  for (const label of requiredDocuments) {
    if (!responses[label]?.trim()) {
      return `Please complete: ${label}`;
    }
  }
  return null;
}
