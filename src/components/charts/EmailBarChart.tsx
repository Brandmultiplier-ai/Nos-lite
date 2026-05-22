"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EmailWeekBar } from "@/types/nos";
import { useChartTheme } from "@/components/charts/chartTheme";

interface EmailBarChartProps {
  data: EmailWeekBar[];
}

export function EmailBarChart({ data }: EmailBarChartProps) {
  const { chartColors, chartGridStroke, tooltipContentStyle, axisStyle, chartBarRadius, isNeonCharts, isMboardCharts } =
    useChartTheme();

  const legendColor = isMboardCharts ? "#737791" : isNeonCharts ? "#9ca3af" : "#A0AEC0";
  const sentFill = isNeonCharts ? chartColors.primary : isMboardCharts ? chartColors.primaryDark : "url(#emailSentGrad)";
  const replyFill = isNeonCharts ? chartColors.teal : isMboardCharts ? chartColors.teal : "url(#emailReplyGrad)";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="emailSentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.primary} stopOpacity={1} />
            <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={isNeonCharts ? 0.85 : 0.86} />
          </linearGradient>
          <linearGradient id="emailReplyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.98} />
            <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0.75} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Legend wrapperStyle={{ color: legendColor, fontSize: 12 }} />
        <Bar
          dataKey="sent"
          fill={sentFill}
          radius={chartBarRadius}
          maxBarSize={isNeonCharts || isMboardCharts ? 36 : undefined}
        />
        <Bar
          dataKey="replies"
          fill={replyFill}
          radius={chartBarRadius}
          maxBarSize={isNeonCharts || isMboardCharts ? 36 : undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
