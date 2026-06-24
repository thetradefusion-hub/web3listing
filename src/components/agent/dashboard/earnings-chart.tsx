"use client";

import { useState } from "react";

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function EarningsChart({
  data,
  compact,
}: {
  data: { label: string; amount: number }[];
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const width = 400;
  const height = compact ? 88 : 130;
  const padding = compact
    ? { top: 8, right: 8, bottom: 18, left: 32 }
    : { top: 12, right: 12, bottom: 24, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padding.top + chartH - (d.amount / maxAmount) * chartH;
    return { x, y, ...d };
  });

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? padding.left} ${padding.top + chartH} L ${points[0]?.x ?? padding.left} ${padding.top + chartH} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className={compact ? "h-[88px] w-full" : "h-[130px] w-full"} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#635BFF" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((t) => {
          const y = padding.top + chartH * (1 - t);
          const val = Math.round(maxAmount * t);
          return (
            <g key={t}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fill="#94A3B8" fontSize="11" fontWeight="500">
                ${val}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#earningsFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#635BFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g key={p.label}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3}
              fill="#635BFF"
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            <text x={p.x} y={height - 10} textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="500">
              {p.label}
            </text>
            {hovered === i && (
              <g>
                <rect
                  x={p.x - 36}
                  y={p.y - 36}
                  width={72}
                  height={26}
                  rx={8}
                  fill="#0F172A"
                />
                <text x={p.x} y={p.y - 18} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
                  ${p.amount}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
