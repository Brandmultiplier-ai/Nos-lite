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
import type { ChartPoint } from "@/types/nos";
import { axisStyle, chartColors, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";

interface SignalAreaChartProps {
  data: ChartPoint[];
}

export function SignalAreaChart({ data }: SignalAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="signalAccentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.4} />
            <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="signalPurpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4940c6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#4940c6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
        <XAxis
          dataKey="month"
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
          dataKey="signals"
          stroke={chartColors.accent}
          fill="url(#signalAccentGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="#4940c6"
          fill="url(#signalPurpleGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
