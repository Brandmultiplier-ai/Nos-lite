"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelBar } from "@/types/nos";
import { useChartTheme } from "@/components/charts/chartTheme";

interface ChannelBarChartProps {
  data: ChannelBar[];
}

export function ChannelBarChart({ data }: ChannelBarChartProps) {
  const {
    chartColors,
    chartGridStroke,
    tooltipContentStyle,
    axisStyle,
    chartBarPalette,
    chartBarRadius,
    isNeonCharts,
    isMboardCharts,
  } = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey="channel" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar
          dataKey="volume"
          fill={isNeonCharts ? chartBarPalette[0] : chartColors.primaryDark}
          radius={chartBarRadius}
          maxBarSize={isNeonCharts || isMboardCharts ? 42 : undefined}
        >
          {isNeonCharts
            ? data.map((row, index) => (
                <Cell key={row.channel} fill={chartBarPalette[index % chartBarPalette.length]} />
              ))
            : null}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
