import type { Order, Project, Service } from "@/types/database";
import { parseJsonArray } from "@/lib/service-catalog";

export type GrowthPhase = {
  id: string;
  label: string;
  status: "completed" | "in_progress" | "pending";
};

export const CATEGORY_TAB_GROUPS: Record<string, string[]> = {
  all: [],
  visibility: ["listing-services", "explorer-services", "trending-services", "wallet-listing"],
  security: ["token-security", "liquidity-lock"],
  marketing: ["pr-distribution", "influencer-marketing", "community-management"],
  growth: ["market-making", "ai-services", "premium-advisory"],
  development: ["development-services"],
};

export const WHY_RECOMMENDATIONS = [
  {
    title: "Increase Visibility",
    description: "Get listed on trackers, explorers, and exchanges to reach more investors.",
    tone: "bg-primary/10 text-primary ring-primary/20",
  },
  {
    title: "Build Trust",
    description: "Security audits and verified profiles improve investor confidence.",
    tone: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
  },
  {
    title: "Accelerate Growth",
    description: "Marketing and community services drive organic adoption faster.",
    tone: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
  },
  {
    title: "Expert Guidance",
    description: "Our team recommends services based on your project stage and goals.",
    tone: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
  },
];

const PHASE_CATEGORY_MAP: Record<string, string[]> = {
  setup: [],
  security: ["token-security", "liquidity-lock"],
  visibility: ["listing-services", "explorer-services", "trending-services", "wallet-listing"],
  liquidity: ["liquidity-lock", "market-making"],
  marketing: ["pr-distribution", "influencer-marketing", "community-management"],
  growth: ["market-making", "ai-services", "premium-advisory", "development-services"],
};

function orderMatchesCategories(
  order: Order & { services?: Service & { service_categories?: { slug: string } | { slug: string }[] | null } },
  slugs: string[]
) {
  const cat = order.services?.service_categories;
  const category = Array.isArray(cat) ? cat[0] : cat;
  return category?.slug ? slugs.includes(category.slug) : false;
}

function isOrderDone(status: string) {
  return ["completed", "delivered", "closed"].includes(status);
}

function isOrderActive(status: string) {
  return ["in_progress", "third_party_review", "payment_confirmed", "under_review", "waiting_payment"].includes(status);
}

export function computeGrowthPhases(
  project: Project,
  orders: (Order & {
    services?: Service & { service_categories?: { slug: string } | { slug: string }[] | null };
  })[]
) {
  const phases: GrowthPhase[] = [
    {
      id: "setup",
      label: "Project Setup",
      status:
        project.status === "approved" || project.status === "submitted"
          ? "completed"
          : project.status === "draft"
            ? "in_progress"
            : "pending",
    },
    {
      id: "security",
      label: "Token Security",
      status: orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.security) && isOrderDone(o.status))
        ? "completed"
        : orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.security))
          ? "in_progress"
          : "pending",
    },
    {
      id: "visibility",
      label: "Visibility & Listing",
      status: orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.visibility) && isOrderDone(o.status))
        ? "completed"
        : orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.visibility))
          ? "in_progress"
          : "pending",
    },
    {
      id: "liquidity",
      label: "Liquidity Setup",
      status: orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.liquidity) && isOrderDone(o.status))
        ? "completed"
        : orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.liquidity))
          ? "in_progress"
          : "pending",
    },
    {
      id: "marketing",
      label: "Marketing & PR",
      status: orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.marketing) && isOrderDone(o.status))
        ? "completed"
        : orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.marketing))
          ? "in_progress"
          : "pending",
    },
    {
      id: "growth",
      label: "Growth & Scaling",
      status: orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.growth) && isOrderDone(o.status))
        ? "completed"
        : orders.some((o) => orderMatchesCategories(o, PHASE_CATEGORY_MAP.growth))
          ? "in_progress"
          : "pending",
    },
  ];

  const completed = phases.filter((p) => p.status === "completed").length;
  const inProgress = phases.filter((p) => p.status === "in_progress").length;
  const score = Math.round(((completed + inProgress * 0.5) / phases.length) * 100);

  return { phases, score };
}

export function getServiceImpactBadge(service: Service, categorySlug?: string) {
  if (service.badge === "hot")
    return { label: "High Impact", tone: "border-chart-2/30 bg-chart-2/10 text-chart-2" };
  if (service.badge === "popular")
    return { label: "Recommended", tone: "border-primary/30 bg-primary/10 text-primary" };
  if (service.badge === "new" || categorySlug === "trending-services")
    return { label: "Trending", tone: "border-chart-3/30 bg-chart-3/10 text-chart-3" };
  return { label: "Recommended", tone: "border-primary/30 bg-primary/10 text-primary" };
}

export function getServiceBenefits(service: Service) {
  const items = parseJsonArray<string>(service.whats_included);
  if (items.length > 0) return items.slice(0, 3);
  return [
    "Professional end-to-end support",
    "Dedicated account manager follow-up",
    "Transparent pricing and delivery",
  ];
}

export function buildRoadmap(
  services: (Service & { service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null })[],
  orderedServiceIds: Set<string>
) {
  const picks = services
    .filter((s) => !orderedServiceIds.has(s.id))
    .slice(0, 4);

  const boosts = ["+20% Visibility Boost", "+15% Trust Score", "+25% Reach Boost", "+10% Growth Boost"];

  return picks.map((service, i) => {
    const cat = Array.isArray(service.service_categories)
      ? service.service_categories[0]
      : service.service_categories;
    return {
      service,
      step: i + 1,
      boost: boosts[i % boosts.length],
      categoryName: cat?.name || "Service",
    };
  });
}

export function filterServicesByTab(
  services: (Service & { service_categories?: { slug: string } | { slug: string }[] | null })[],
  tab: string
) {
  if (tab === "all") return services;
  const slugs = CATEGORY_TAB_GROUPS[tab] || [];
  return services.filter((s) => {
    const cat = Array.isArray(s.service_categories) ? s.service_categories[0] : s.service_categories;
    return cat?.slug && slugs.includes(cat.slug);
  });
}

export function countByTab(
  services: (Service & { service_categories?: { slug: string } | { slug: string }[] | null })[],
  tab: string
) {
  return filterServicesByTab(services, tab).length;
}
