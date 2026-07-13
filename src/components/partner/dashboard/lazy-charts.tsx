"use client";

import dynamic from "next/dynamic";

const EarningsChart = dynamic(
  () =>
    import("@/components/partner/dashboard/earnings-chart").then((m) => m.EarningsChart),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-muted/60" />,
  }
);

const ProjectStatusChart = dynamic(
  () =>
    import("@/components/partner/dashboard/project-status-chart").then(
      (m) => m.ProjectStatusChart
    ),
  {
    ssr: false,
    loading: () => <div className="h-[220px] animate-pulse rounded-xl bg-muted/60" />,
  }
);

export function LazyEarningsChart(
  props: React.ComponentProps<typeof EarningsChart>
) {
  return <EarningsChart {...props} />;
}

export function LazyProjectStatusChart(
  props: React.ComponentProps<typeof ProjectStatusChart>
) {
  return <ProjectStatusChart {...props} />;
}
