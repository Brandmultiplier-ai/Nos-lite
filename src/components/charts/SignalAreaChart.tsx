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
import { useChartTheme } from "@/components/charts/chartTheme";

interface SignalAreaChartProps {
  data: ChartPoint[];
}

export function SignalAreaChart({ data }: SignalAreaChartProps) {
  const { chartColors, chartGridStroke, tooltipContentStyle, axisStyle, isNeonCharts, isMboardCharts } =
    useChartTheme();

  const primaryStroke = isNeonCharts ? chartColors.primary : chartColors.primaryDark;
  const secondaryStroke = isNeonCharts ? chartColors.teal : chartColors.accent;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="signalAccentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={secondaryStroke}
              stopOpacity={isNeonCharts ? 0.12 : isMboardCharts ? 0.15 : 0.4}
            />
            <stop offset="100%" stopColor={secondaryStroke} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="signalPrimaryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={primaryStroke}
              stopOpacity={isNeonCharts ? 0.18 : isMboardCharts ? 0.12 : 0.4}
            />
            <stop offset="100%" stopColor={primaryStroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={tooltipContentStyle}
          cursor={{ stroke: primaryStroke, strokeOpacity: 0.22 }}
        />
        <Area
          type="monotone"
          dataKey="signals"
          stroke={secondaryStroke}
          fill="url(#signalAccentGrad)"
          strokeWidth={isMboardCharts ? 2.5 : 2}
          strokeDasharray={isNeonCharts ? "6 5" : undefined}
        />
        <Area
          type="monotone"
          dataKey="leads"
          stroke={primaryStroke}
          fill="url(#signalPrimaryGrad)"
          strokeWidth={isMboardCharts ? 2.5 : isNeonCharts ? 2.5 : 2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
