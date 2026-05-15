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
import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";

interface EngagementAreaChartProps {
  data: LinkedInEngagementPoint[];
}

export function EngagementAreaChart({ data }: EngagementAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="engagementAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4940c6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#4940c6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
        <XAxis
          dataKey="week"
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ stroke: "#4940c6", strokeOpacity: 0.22 }} />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke="#4940c6"
          fill="url(#engagementAreaGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
