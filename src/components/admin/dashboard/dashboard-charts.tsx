"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function RevenueChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const width = 100;
  const height = 48;
  const max = Math.max(...data.map((d) => d.value), 1);
  const points = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y = height - (d.value / max) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const areaPath = `M0,${height} L${points.join(" L")} L${width},${height} Z`;
  const linePath = `M${points.join(" L")}`;
  const gradientId = "adminRevenueGradient";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-28 w-full sm:h-32"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between gap-1 overflow-x-auto text-[10px] text-muted-foreground">
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d) => (
          <span key={d.label} className="shrink-0">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function OrderDonutChart({
  segments,
  total,
}: {
  segments: { label: string; count: number; percent: number; color: string }[];
  total: number;
}) {
  const size = 96;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          {segments.map((seg) => {
            const dash = (seg.percent / 100) * circumference;
            const circle = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-medium text-muted-foreground">Total</p>
          <p className="text-xl font-bold tabular-nums text-foreground">{total}</p>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: seg.color }}
              />
              <span className="truncate text-muted-foreground">{seg.label}</span>
            </div>
            <span className="shrink-0 font-semibold tabular-nums text-foreground">
              {seg.count}{" "}
              <span className="font-normal text-muted-foreground">({seg.percent}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActionCard({
  title,
  metric,
  subtext,
  href,
  cta,
  tone,
}: {
  title: string;
  metric: string;
  subtext: string;
  href: string;
  cta: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md",
        tone
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">{metric}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:gap-1.5">
        {cta}
        <ArrowRight className="size-3.5" strokeWidth={2.5} />
      </span>
    </Link>
  );
}
