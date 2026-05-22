"use client";

import { useChartTheme } from "@/components/charts/chartTheme";
import { CompetitiveQuadrantChart } from "@/components/intelligence/CompetitiveQuadrantChart";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { IntelligencePanelHeader, MboardChartFrame, MboardChartLegend } from "@/components/intelligence/mboardUi";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CompetitivePositioningSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle } = useChartTheme();
  const copy = useSectionThemeCopy();
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
        <p className={copy.tc.eyebrow}>Competitive positioning</p>
        <h2 className={`mt-1 ${copy.themed ? copy.tc.sectionTitleLg : "font-display text-2xl font-bold text-white"}`}>
          Quadrant dynamics over time
        </h2>
        <p className={`mt-2 max-w-3xl text-sm ${copy.muted}`}>
          Track how your brand moves on differentiation vs salience — replay quarterly snapshots and rank history.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={competitive.methodNote} />
      <IntelligenceKpiGrid kpis={kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CompetitiveQuadrantChart data={competitive} />
        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Rank history" title="Rank trajectory" />
          <p className={`mt-1 text-xs ${copy.muteSm}`}>Lower rank number is better (1 = leader)</p>
          {copy.isV5 ? (
            <>
              <MboardChartFrame>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rankChart} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} vertical={false} />
                      <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis reversed domain={[1, 5]} tick={axisStyle} allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Line
                        type="monotone"
                        dataKey="rank"
                        stroke={chartColors.primaryDark}
                        strokeWidth={2}
                        dot={{ r: 4, fill: chartColors.primaryDark, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend items={[{ label: "Category rank", color: chartColors.primaryDark }]} />
            </>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankChart}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="period" tick={axisStyle} />
                  <YAxis reversed domain={[1, 5]} tick={axisStyle} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Line type="monotone" dataKey="rank" stroke={chartColors.primaryDark} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      <IntelligenceActionsPanel actions={competitive.recommendations} />
    </div>
  );
}
