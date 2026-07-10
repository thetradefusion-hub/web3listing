import type { Order, Project, Service, ServiceCategory } from "@/types/database";
import { parseJsonArray } from "@/lib/service-catalog";

export type GrowthPhase = {
  id: string;
  label: string;
  status: "completed" | "in_progress" | "pending";
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
  /** 0–100 stage progress based on completed + partial in-progress orders */
  progressPct: number;
};

/** The 7 core journey categories (migration 029). */
export const CORE_GROWTH_CATEGORIES = [
  { slug: "development", label: "Development", stageTitle: "Project Development Stage" },
  { slug: "security", label: "Security", stageTitle: "Token Security Stage" },
  { slug: "marketing", label: "Marketing", stageTitle: "Marketing & PR Stage" },
  { slug: "exchange-listing", label: "Exchange Listing", stageTitle: "Exchange Listing Stage" },
  { slug: "market-making", label: "Market Making", stageTitle: "Market Making Stage" },
  { slug: "listing-services", label: "Listing Services", stageTitle: "Listing Services Stage" },
  { slug: "growth", label: "Growth", stageTitle: "Growth & Scaling Stage" },
] as const;

export type CoreGrowthSlug = (typeof CORE_GROWTH_CATEGORIES)[number]["slug"];

/** Map legacy category slugs onto the 7 core journey categories. */
export const LEGACY_CATEGORY_ALIASES: Record<string, CoreGrowthSlug> = {
  "development-services": "development",
  "token-security": "security",
  "liquidity-lock": "security",
  "pr-distribution": "marketing",
  "influencer-marketing": "marketing",
  "community-management": "marketing",
  "cex-exchange-listing-services": "exchange-listing",
  "explorer-services": "listing-services",
  "trending-services": "listing-services",
  "wallet-listing": "listing-services",
  "ai-services": "growth",
  "premium-advisory": "growth",
};

export const CATEGORY_TAB_GROUPS: Record<string, string[]> = {
  all: [],
  development: ["development", "development-services"],
  security: ["security", "token-security", "liquidity-lock"],
  marketing: ["marketing", "pr-distribution", "influencer-marketing", "community-management"],
  "exchange-listing": ["exchange-listing", "cex-exchange-listing-services"],
  "market-making": ["market-making"],
  "listing-services": ["listing-services", "explorer-services", "trending-services", "wallet-listing"],
  growth: ["growth", "ai-services", "premium-advisory"],
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

type ServiceWithCategory = Service & {
  service_categories?: { slug: string; name?: string } | { slug: string; name?: string }[] | null;
};

type OrderWithService = Order & { services?: ServiceWithCategory };

function getCategorySlug(service?: ServiceWithCategory | null) {
  const cat = service?.service_categories;
  const category = Array.isArray(cat) ? cat[0] : cat;
  return category?.slug || null;
}

export function resolveCoreCategorySlug(slug?: string | null): CoreGrowthSlug | null {
  if (!slug) return null;
  if (CORE_GROWTH_CATEGORIES.some((c) => c.slug === slug)) return slug as CoreGrowthSlug;
  return LEGACY_CATEGORY_ALIASES[slug] || null;
}

function isOrderDone(status: string) {
  return ["completed", "delivered", "closed"].includes(status);
}

export function getServicesForCategory(services: ServiceWithCategory[], slug: string) {
  const group = CATEGORY_TAB_GROUPS[slug] || [slug];
  return services.filter((s) => {
    const serviceSlug = getCategorySlug(s);
    return serviceSlug ? group.includes(serviceSlug) || resolveCoreCategorySlug(serviceSlug) === slug : false;
  });
}

export function computeGrowthPhases(
  _project: Project,
  orders: OrderWithService[],
  services: ServiceWithCategory[] = []
) {
  const phases: GrowthPhase[] = CORE_GROWTH_CATEGORIES.map((category) => {
    const categoryServices = getServicesForCategory(services, category.slug);
    const totalCount = categoryServices.length;
    const serviceIds = new Set(categoryServices.map((s) => s.id));

    const matchingOrders = orders.filter((o) => {
      const orderSlug = getCategorySlug(o.services);
      const core = resolveCoreCategorySlug(orderSlug);
      if (core === category.slug) return true;
      if (o.service_id && serviceIds.has(o.service_id)) return true;
      return false;
    });

    const completedServiceIds = new Set(
      matchingOrders.filter((o) => isOrderDone(o.status)).map((o) => o.service_id)
    );
    const inProgressServiceIds = new Set(
      matchingOrders
        .filter((o) => !isOrderDone(o.status) && !completedServiceIds.has(o.service_id))
        .map((o) => o.service_id)
    );

    const completedCount = completedServiceIds.size;
    const inProgressCount = inProgressServiceIds.size;
    // Any ordered service in this category fulfills the stage (100%)
    const hasAnyOrder = matchingOrders.length > 0;
    const progressPct = hasAnyOrder ? 100 : 0;
    const status: GrowthPhase["status"] = hasAnyOrder ? "completed" : "pending";

    return {
      id: category.slug,
      label: category.label,
      status,
      completedCount,
      inProgressCount,
      totalCount,
      progressPct,
    };
  });

  // Overall score = how many of the 7 stages have at least one ordered service
  const stagesCompleted = phases.filter((p) => p.status === "completed").length;
  const score = Math.round((stagesCompleted / Math.max(phases.length, 1)) * 100);
  const stagesInProgress = 0;
  const servicesCompleted = phases.reduce((sum, p) => sum + p.completedCount, 0);
  const servicesInProgress = phases.reduce((sum, p) => sum + p.inProgressCount, 0);
  const servicesTotal = phases.reduce((sum, p) => sum + p.totalCount, 0);

  return {
    phases,
    score,
    summary: {
      stagesCompleted,
      stagesInProgress,
      stagesTotal: phases.length,
      servicesCompleted,
      servicesInProgress,
      servicesTotal,
    },
  };
}

export function getGrowthCategoryMeta(slug: string) {
  return CORE_GROWTH_CATEGORIES.find((c) => c.slug === slug) || null;
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
  services: (Service & {
    service_categories?: { slug: string; name: string } | { slug: string; name: string }[] | null;
  })[],
  orderedServiceIds: Set<string>
) {
  const picks = services.filter((s) => !orderedServiceIds.has(s.id)).slice(0, 4);
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

export function filterServicesByTab(services: ServiceWithCategory[], tab: string) {
  if (tab === "all") return services;
  return getServicesForCategory(services, tab);
}

export function countByTab(services: ServiceWithCategory[], tab: string) {
  return filterServicesByTab(services, tab).length;
}

export function pickDefaultGrowthCategory(phases: GrowthPhase[]) {
  return (
    phases.find((p) => p.status === "in_progress")?.id ||
    phases.find((p) => p.status === "pending")?.id ||
    phases[0]?.id ||
    "development"
  );
}

export function mergeCategoriesWithCore(categories: ServiceCategory[]) {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return CORE_GROWTH_CATEGORIES.map((core, index) => {
    const existing = bySlug.get(core.slug);
    return (
      existing ||
      ({
        id: `core-${core.slug}`,
        name: core.label,
        slug: core.slug,
        description: null,
        icon: core.slug,
        sort_order: index + 1,
        is_active: true,
      } satisfies ServiceCategory)
    );
  });
}
