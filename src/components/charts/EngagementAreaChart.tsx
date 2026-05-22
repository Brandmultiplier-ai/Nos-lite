"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LinkedInEngagementPoint } from "@/types/nos";
import { useChartTheme } from "@/components/charts/chartTheme";

interface EngagementAreaChartProps {
  data: LinkedInEngagementPoint[];
}

export function EngagementAreaChart({ data }: EngagementAreaChartProps) {
  const { chartColors, chartGridStroke, tooltipContentStyle, axisStyle, isNeonCharts, isMboardCharts } = useChartTheme();
  const stroke = isNeonCharts ? chartColors.primary : chartColors.primaryDark;
  const fillOpacity = isNeonCharts ? 0.2 : isMboardCharts ? 0.15 : 0.45;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="engagementAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={tooltipContentStyle}
          cursor={{ stroke, strokeOpacity: 0.22 }}
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke={stroke}
          fill="url(#engagementAreaGrad)"
          strokeWidth={isMboardCharts || isNeonCharts ? 2.5 : 2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
