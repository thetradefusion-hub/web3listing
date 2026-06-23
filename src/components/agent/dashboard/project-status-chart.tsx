"use client";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#94A3B8"];

export function ProjectStatusChart({
  data,
  total,
}: {
  data: { name: string; value: number; percent: number }[];
  total: number;
}) {
  const size = 150;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 65;
  const innerR = 45;
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
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-[150px] w-[150px] shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, i) => (
            <path key={i} d={arc.d} fill={arc.color} opacity={0.9} />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[28px] font-bold leading-none text-[#0F172A]">{total}</p>
          <p className="mt-1 text-xs font-medium text-[#94A3B8]">Projects</p>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm text-[#64748B]">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
