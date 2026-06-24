"use client";

import Link from "next/link";
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

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-24 w-full lg:h-28"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#revenueGradient)" />
        <path
          d={linePath}
          fill="none"
          stroke="#6366F1"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = (i / Math.max(data.length - 1, 1)) * width;
          const y = height - (d.value / max) * (height - 4) - 2;
          return (
            <circle
              key={d.label}
              cx={x}
              cy={y}
              r="1.8"
              fill="#6366F1"
              className="opacity-0 hover:opacity-100"
            />
          );
        })}
      </svg>
      <div className="mt-1 flex justify-between gap-1 overflow-x-auto text-[9px] text-[#94A3B8]">
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
  const size = 88;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-3 lg:gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
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
          <p className="text-[9px] font-medium text-[#94A3B8]">Total Orders</p>
          <p className="text-base font-bold text-[#0F172A]">{total}</p>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2 text-[10px] lg:text-[11px]">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
              <span className="truncate text-[#64748B]">{seg.label}</span>
            </div>
            <span className="shrink-0 font-semibold text-[#0F172A]">
              {seg.count}{" "}
              <span className="font-normal text-[#94A3B8]">({seg.percent}%)</span>
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
        "block rounded-xl border p-2.5 shadow-sm transition-shadow hover:shadow-md lg:p-3",
        tone
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">{title}</p>
      <p className="mt-1 text-lg font-bold text-[#0F172A] lg:text-xl">{metric}</p>
      <p className="mt-0.5 text-[10px] text-[#64748B] lg:text-[11px]">{subtext}</p>
      <span className="mt-1.5 inline-flex text-[10px] font-semibold text-[#635BFF] lg:mt-2 lg:text-[11px]">{cta} →</span>
    </Link>
  );
}
