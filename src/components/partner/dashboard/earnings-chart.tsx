"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { chartCssVars } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

const chartConfig = {
  amount: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function EarningsChart({
  data,
  compact,
}: {
  data: { label: string; amount: number }[];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[120px] w-full"
        initialDimension={{ width: 320, height: 120 }}
      >
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          />
          <ChartTooltip
            cursor={{ fill: "color-mix(in oklch, var(--chart-1) 8%, transparent)" }}
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <span className="font-semibold tabular-nums text-chart-1">
                    ${Number(value).toLocaleString()}
                  </span>
                )}
              />
            }
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={28}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.amount > 0
                    ? "var(--chart-1)"
                    : "color-mix(in oklch, var(--muted-foreground) 18%, transparent)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto w-full", "h-[180px]")}
      initialDimension={{ width: 320, height: 180 }}
    >
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/50" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => (
                <span className="font-semibold tabular-nums text-chart-1">
                  ${Number(value).toLocaleString()}
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="amount"
          type="monotone"
          fill="url(#earningsGradient)"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          dot={{ fill: "var(--chart-4)", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--card)", fill: "var(--chart-1)" }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
