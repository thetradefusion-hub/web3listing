import type { OrderStatus } from "@/types/database";

export const ORDER_STATUS_GROUPS: Record<string, OrderStatus[]> = {
  Pending: ["submitted", "under_review", "waiting_payment"],
  "In Progress": ["payment_confirmed", "in_progress"],
  "Under Review": ["third_party_review"],
  Completed: ["completed", "delivered", "closed"],
};

export const DONUT_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  "In Progress": "#3B82F6",
  "Under Review": "#8B5CF6",
  Completed: "#10B981",
  Cancelled: "#EF4444",
};

export function buildRevenueSeries(
  payments: { amount: number; created_at: string }[],
  days = 14
) {
  const buckets: { label: string; value: number; date: string }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    const value = payments
      .filter((p) => p.created_at.slice(0, 10) === key)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    buckets.push({ label, value, date: key });
  }

  return buckets;
}

export function buildOrderStatusDistribution(orders: { status: OrderStatus }[]) {
  const total = orders.length || 1;
  return Object.entries(ORDER_STATUS_GROUPS).map(([label, statuses]) => {
    const count = orders.filter((o) => statuses.includes(o.status)).length;
    return {
      label,
      count,
      percent: Math.round((count / total) * 100),
      color: DONUT_COLORS[label],
    };
  });
}

export function buildTopServices(
  orders: { service_id: string; services?: { name: string } | { name: string }[] | null }[]
) {
  const counts: Record<string, { name: string; count: number }> = {};

  orders.forEach((o) => {
    const service = Array.isArray(o.services) ? o.services[0] : o.services;
    const name = service?.name || "Unknown";
    if (!counts[o.service_id]) counts[o.service_id] = { name, count: 0 };
    counts[o.service_id].count += 1;
  });

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: string;
};

export function buildRecentActivities(input: {
  orders: { id: string; order_number: string; created_at: string; status: string }[];
  payments: { id: string; amount: number; created_at: string }[];
  kycCount: number;
  projectCount: number;
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  input.orders.slice(0, 3).forEach((o) => {
    items.push({
      id: `order-${o.id}`,
      title: "New Order Created",
      description: `Order #${o.order_number} — ${o.status.replace(/_/g, " ")}`,
      time: o.created_at,
      tone: "bg-[#EEF2FF] text-[#6366F1]",
    });
  });

  input.payments.slice(0, 2).forEach((p) => {
    items.push({
      id: `pay-${p.id}`,
      title: "Payment Received",
      description: `$${Number(p.amount).toLocaleString()} confirmed`,
      time: p.created_at,
      tone: "bg-[#ECFDF5] text-[#059669]",
    });
  });

  if (input.kycCount > 0) {
    items.push({
      id: "kyc-pending",
      title: "KYC Pending",
      description: `${input.kycCount} submissions awaiting review`,
      time: new Date().toISOString(),
      tone: "bg-[#FFF7ED] text-[#EA580C]",
    });
  }

  if (input.projectCount > 0) {
    items.push({
      id: "project-pending",
      title: "Project Submitted",
      description: `${input.projectCount} projects need approval`,
      time: new Date().toISOString(),
      tone: "bg-[#F5F3FF] text-[#7C3AED]",
    });
  }

  return items
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);
}

export function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getDateRangeLabel(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}
