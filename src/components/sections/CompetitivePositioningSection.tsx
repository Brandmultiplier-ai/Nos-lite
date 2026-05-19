"use client";

import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import { CompetitiveQuadrantChart } from "@/components/intelligence/CompetitiveQuadrantChart";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CompetitivePositioningSection() {
  const { competitive } = useWorkspaceIntelligence();

  const kpis = [
    {
      label: "Category rank",
      value: `#${competitive.rankHistory[competitive.rankHistory.length - 1]?.rank ?? 2}`,
      change: 8,
      context: `of ${competitive.rankHistory[0]?.total ?? 5} tracked competitors`,
    },
    {
      label: "Salience index",
      value: "58",
      change: 5,
      context: "Blended awareness proxy vs category",
    },
    {
      label: "Differentiation index",
      value: "64",
      change: 7,
      context: "Message uniqueness score vs corpus",
    },
    {
      label: "Quadrant stability",
      value: "High",
      change: 3,
      context: "Volatility of position over last 4 periods",
    },
  ];

  const rankChart = competitive.rankHistory.map((r) => ({
    period: r.period,
    rank: r.rank,
  }));

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4940c6]">Competitive positioning</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-white">Quadrant dynamics over time</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#A0AEC0]">
          Track how your brand moves on differentiation vs salience — replay quarterly snapshots and rank history.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={competitive.methodNote} />
      <IntelligenceKpiGrid kpis={kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CompetitiveQuadrantChart data={competitive} />
        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Rank trajectory</h3>
          <p className="mt-1 text-xs text-[#718096]">Lower rank number is better (1 = leader)</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rankChart}>
                <CartesianGrid stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="period" tick={axisStyle} />
                <YAxis reversed domain={[1, 5]} tick={axisStyle} allowDecimals={false} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Line type="monotone" dataKey="rank" stroke="#4940c6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <IntelligenceActionsPanel actions={competitive.recommendations} />
    </div>
  );
}
