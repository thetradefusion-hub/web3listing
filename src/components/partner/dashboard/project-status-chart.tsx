"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { chartCssVars, chartTextClasses } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

export function ProjectStatusChart({
  data,
  total,
  compact,
}: {
  data: { name: string; value: number; percent: number }[];
  total: number;
  compact?: boolean;
}) {
  const chartConfig = data.reduce<ChartConfig>((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: chartCssVars[index % chartCssVars.length],
    };
    return acc;
  }, {});

  return (
    <div className={cn("flex w-full min-h-[168px] flex-col items-center justify-center gap-5 sm:flex-row sm:items-center")}>
      <ChartContainer
        config={chartConfig}
        className={cn("aspect-square w-full max-w-[132px] shrink-0", compact ? "h-[128px]" : "h-[148px]")}
        initialDimension={{ width: 128, height: compact ? 128 : 148 }}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={compact ? 38 : 44}
            outerRadius={compact ? 56 : 64}
            strokeWidth={2}
            stroke="var(--card)"
            paddingAngle={data.length > 1 ? 3 : 0}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={chartCssVars[index % chartCssVars.length]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 6} className="fill-foreground text-2xl font-bold">
                      {total}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-muted-foreground text-[10px] font-medium">
                      Total
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-2">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="size-2.5 shrink-0 rounded-full ring-2 ring-card"
                style={{ backgroundColor: chartCssVars[index % chartCssVars.length] }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.value} project{item.value === 1 ? "" : "s"}</p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                chartTextClasses[index % chartTextClasses.length]
              )}
            >
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
