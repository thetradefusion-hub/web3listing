import type { Service, ServiceCategory } from "@/types/database";
import { getServiceCommissionPreview, getServicePriceLabel, PRICING_CTA } from "@/lib/pricing";
import { formatCurrency } from "@/lib/commission";
import {
  Building2,
  Bot,
  Briefcase,
  Code,
  Lock,
  MessageCircle,
  Newspaper,
  Search,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "listing-services": Building2,
  "explorer-services": Search,
  "wallet-listing": Wallet,
  "market-making": TrendingUp,
  "token-security": Shield,
  "liquidity-lock": Lock,
  "pr-distribution": Newspaper,
  "influencer-marketing": Users,
  "community-management": MessageCircle,
  "trending-services": Zap,
  "ai-services": Bot,
  "development-services": Code,
  "premium-advisory": Briefcase,
};

export const CATEGORY_SHORT_LABELS: Record<string, string> = {
  "listing-services": "Listing",
  "explorer-services": "Explorer",
  "wallet-listing": "Wallet",
  "market-making": "Markets",
  "token-security": "Security",
  "liquidity-lock": "Liquidity",
  "pr-distribution": "PR",
  "influencer-marketing": "Influencer",
  "community-management": "Comms",
  "trending-services": "Trending",
  "ai-services": "AI",
  "development-services": "Dev",
  "premium-advisory": "Advisory",
};

export function getCategoryShortLabel(slug: string, name: string) {
  return CATEGORY_SHORT_LABELS[slug] || name.replace(/\s+services?$/i, "").trim() || name;
}

export const BADGE_STYLES = {
  hot: "border-destructive/30 bg-destructive/10 text-destructive",
  popular: "border-chart-2/30 bg-chart-2/10 text-chart-2",
  new: "border-primary/30 bg-primary/10 text-primary",
} as const;

export const BADGE_LABELS = {
  hot: "Hot",
  popular: "Popular",
  new: "New",
} as const;

const LOGO_COLORS = [
  "bg-primary/10 text-primary",
  "bg-chart-2/10 text-chart-2",
  "bg-chart-3/10 text-chart-3",
  "bg-chart-4/10 text-chart-4",
  "bg-chart-5/10 text-chart-5",
];

export const SERVICE_ACCENT_GRADIENTS = [
  "from-[#6366F1] via-[#8B5CF6] to-[#A855F7]",
  "from-[#0EA5E9] via-[#6366F1] to-[#8B5CF6]",
  "from-[#10B981] via-[#14B8A6] to-[#0EA5E9]",
  "from-[#F59E0B] via-[#F97316] to-[#EF4444]",
  "from-[#EC4899] via-[#8B5CF6] to-[#6366F1]",
];

export function getServiceAccent(name: string) {
  return SERVICE_ACCENT_GRADIENTS[name.charCodeAt(0) % SERVICE_ACCENT_GRADIENTS.length];
}

export function getServiceLogoColor(name: string) {
  const index = name.charCodeAt(0) % LOGO_COLORS.length;
  return LOGO_COLORS[index];
}

export function getServiceInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Known exchange / platform logos when `logo_url` is not set in admin. */
const BRAND_LOGO_PATTERNS: { pattern: RegExp; url: string }[] = [
  { pattern: /binance/i, url: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { pattern: /okx|oklx/i, url: "https://cryptologos.cc/logos/okx-okx-logo.png" },
  { pattern: /mexc/i, url: "https://cryptologos.cc/logos/mexc-mexc-logo.png" },
  { pattern: /gate/i, url: "https://cryptologos.cc/logos/gate-gt-logo.png" },
  { pattern: /kucoin/i, url: "https://cryptologos.cc/logos/kucoin-kcs-logo.png" },
  { pattern: /bitget/i, url: "https://cryptologos.cc/logos/bitget-token-bgb-logo.png" },
  { pattern: /bitmart/i, url: "https://cryptologos.cc/logos/bitmart-bmx-logo.png" },
  { pattern: /bingx/i, url: "https://cryptologos.cc/logos/bingx-bingx-logo.png" },
  { pattern: /coinstore/i, url: "https://cryptologos.cc/logos/coinstore-coin-logo.png" },
  { pattern: /latoken/i, url: "https://cryptologos.cc/logos/latoken-la-logo.png" },
  { pattern: /lbank/i, url: "https://cryptologos.cc/logos/lbank-lbk-logo.png" },
  { pattern: /blofin/i, url: "https://cryptologos.cc/logos/blofin-blo-logo.png" },
  { pattern: /coingecko/i, url: "https://cryptologos.cc/logos/coingecko-gecko-logo.png" },
  { pattern: /trust\s*wallet/i, url: "https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png" },
  { pattern: /metamask/i, url: "https://cryptologos.cc/logos/metamask-mask-logo.png" },
  { pattern: /dextools/i, url: "https://cryptologos.cc/logos/dextools-dext-logo.png" },
  { pattern: /certik/i, url: "https://cryptologos.cc/logos/certik-ctk-logo.png" },
];

export function getServiceLogoUrl(service: { name: string; logo_url?: string | null }) {
  const stored = service.logo_url?.trim();
  if (stored) return stored;

  for (const { pattern, url } of BRAND_LOGO_PATTERNS) {
    if (pattern.test(service.name)) return url;
  }

  return null;
}

export function pickFeaturedServices<T extends Service>(services: T[], limit = 8): T[] {
  const rank = (service: T) => {
    let score = service.sort_order ?? 999;
    if (service.badge === "hot") score -= 10_000;
    else if (service.badge === "popular") score -= 5_000;
    if (getServiceLogoUrl(service)) score -= 1_000;
    const category = service.service_categories?.slug;
    if (category === "listing-services") score -= 500;
    if (category === "wallet-listing") score -= 400;
    return score;
  };

  return [...services].sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}

export function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

/** Parse admin-entered networks (comma, newline, or "Name (STD)" chunks). */
export function parseNetworks(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  const trimmed = value.trim();

  for (const sep of ["\n", ",", ";", "|"]) {
    if (trimmed.includes(sep)) {
      return trimmed.split(sep).map((s) => s.trim()).filter(Boolean);
    }
  }

  const withParens = trimmed.match(/[A-Za-z0-9](?:[A-Za-z0-9\s-]*[A-Za-z0-9])?\s*\([^)]+\)/g);
  let remainder = trimmed;
  const networks: string[] = [];

  if (withParens?.length) {
    for (const part of withParens) {
      networks.push(part.trim());
      remainder = remainder.replace(part, " ");
    }
  }

  remainder = remainder.replace(/\s+/g, " ").trim();
  if (remainder) {
    const tokens = remainder.match(/\bCore DAO\b|[A-Za-z0-9]+/g);
    if (tokens?.length) {
      tokens.forEach((token) => networks.push(token));
    }
  }

  return networks.length > 0 ? networks : [trimmed];
}

export function getCategoryCounts(services: Service[]) {
  const counts: Record<string, number> = {};
  services.forEach((s) => {
    counts[s.category_id] = (counts[s.category_id] || 0) + 1;
  });
  return counts;
}

export function filterServices(
  services: Service[],
  params: {
    q?: string;
    category?: string;
    categories: ServiceCategory[];
    minPrice?: string;
    maxPrice?: string;
    tat?: string;
    payment?: string;
  }
) {
  let result = [...services];

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.overview?.toLowerCase().includes(q)
    );
  }

  if (params.category) {
    result = result.filter((s) => {
      const cat = Array.isArray(s.service_categories)
        ? s.service_categories[0]
        : s.service_categories;
      return cat?.slug === params.category;
    });
  }

  if (params.minPrice) {
    const min = Number(params.minPrice);
    if (!Number.isNaN(min)) {
      result = result.filter((s) => s.pricing_model === "fixed" && (s.price ?? 0) >= min);
    }
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice);
    if (!Number.isNaN(max)) {
      result = result.filter(
        (s) =>
          s.pricing_model !== "fixed" || s.price == null || s.price <= max
      );
    }
  }

  if (params.tat) {
    result = result.filter((s) => s.estimated_tat === params.tat);
  }

  if (params.payment) {
    result = result.filter((s) => s.payment_terms === params.payment);
  }

  return result;
}

export function getUniqueTatOptions(services: Service[]) {
  return [...new Set(services.map((s) => s.estimated_tat).filter(Boolean))] as string[];
}

export function getUniquePaymentOptions(services: Service[]) {
  return [...new Set(services.map((s) => s.payment_terms).filter(Boolean))] as string[];
}

export function getServiceCardMeta(service: Service) {
  return {
    priceLabel: getServicePriceLabel(service),
    ctaLabel: PRICING_CTA[service.pricing_model],
    commission: getServiceCommissionPreview(service),
    commissionLabel:
      getServiceCommissionPreview(service) != null
        ? formatCurrency(getServiceCommissionPreview(service)!)
        : null,
  };
}

export function getServiceOrderPath(basePath: string, serviceSlug: string, projectId?: string) {
  const query = projectId ? `?project=${encodeURIComponent(projectId)}` : "";
  return `${basePath}/services/${serviceSlug}/order${query}`;
}
