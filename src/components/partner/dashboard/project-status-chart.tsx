"use client";

import { cn } from "@/lib/utils";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#94A3B8"];

export function ProjectStatusChart({
  data,
  total,
  compact,
}: {
  data: { name: string; value: number; percent: number }[];
  total: number;
  compact?: boolean;
}) {
  const size = compact ? 96 : 150;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = compact ? 42 : 65;
  const innerR = compact ? 30 : 45;
  const gap = 0.04;

  let angle = -Math.PI / 2;
  const sum = data.reduce((s, d) => s + d.value, 0) || 1;

  const arcs = data.map((item, i) => {
    const slice = (item.value / sum) * (Math.PI * 2 - gap * data.length);
    const start = angle + gap / 2;
    const end = start + slice;
    angle = end + gap / 2;

    const x1o = cx + outerR * Math.cos(start);
    const y1o = cy + outerR * Math.sin(start);
    const x2o = cx + outerR * Math.cos(end);
    const y2o = cy + outerR * Math.sin(end);
    const x1i = cx + innerR * Math.cos(end);
    const y1i = cy + innerR * Math.sin(end);
    const x2i = cx + innerR * Math.cos(start);
    const y2i = cy + innerR * Math.sin(start);
    const large = slice > Math.PI ? 1 : 0;

    const d = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${x2i} ${y2i}`,
      "Z",
    ].join(" ");

    return { d, color: COLORS[i % COLORS.length], item };
  });

  return (
    <div className={cn("flex items-center", compact ? "gap-3" : "flex-col gap-4 sm:flex-row")}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, i) => (
            <path key={i} d={arc.d} fill={arc.color} opacity={0.9} />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className={cn("font-bold leading-none text-[#0F172A]", compact ? "text-lg" : "text-[28px]")}>{total}</p>
          <p className={cn("font-medium text-[#94A3B8]", compact ? "mt-0.5 text-[9px]" : "mt-1 text-xs")}>Projects</p>
        </div>
      </div>
      <div className={cn("flex-1", compact ? "space-y-1" : "space-y-2")}>
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className={cn("truncate text-[#64748B]", compact ? "text-[10px]" : "text-sm")}>{item.name}</span>
            </div>
            <span className={cn("shrink-0 font-semibold text-[#0F172A]", compact ? "text-[10px]" : "text-sm")}>{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
