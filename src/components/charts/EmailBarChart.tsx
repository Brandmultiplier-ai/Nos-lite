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
import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";

interface EmailBarChartProps {
  data: EmailWeekBar[];
}

export function EmailBarChart({ data }: EmailBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="emailSentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4940c6" stopOpacity={1} />
            <stop offset="100%" stopColor="#3a32a0" stopOpacity={0.86} />
          </linearGradient>
          <linearGradient id="emailReplyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.98} />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.75} />
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
        <Tooltip contentStyle={tooltipContentStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Legend wrapperStyle={{ color: "#A0AEC0", fontSize: 12 }} />
        <Bar dataKey="sent" fill="url(#emailSentGrad)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="replies" fill="url(#emailReplyGrad)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
