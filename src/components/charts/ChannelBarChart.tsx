"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelBar } from "@/types/nos";
import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";

interface ChannelBarChartProps {
  data: ChannelBar[];
}

export function ChannelBarChart({ data }: ChannelBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="channelBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4940c6" stopOpacity={1} />
            <stop offset="100%" stopColor="#3a32a0" stopOpacity={0.86} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} />
        <XAxis
          dataKey="channel"
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="volume" fill="url(#channelBarGrad)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
