"use client";

import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function BrandIntelligenceSection() {
  const { brand } = useWorkspaceIntelligence();

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]">Brand intelligence</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-white">Sentiment · share · strategy</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#A0AEC0]">
          Mention share, sentiment decomposition, and theme momentum — framed for competitive narrative defense.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={brand.methodNote} />
      <IntelligenceKpiGrid kpis={brand.kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Sentiment trajectory</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={brand.sentimentTrend}>
                <CartesianGrid stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="period" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#01B574" fill="#01B574" fillOpacity={0.35} />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#718096" fill="#718096" fillOpacity={0.25} />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#EE5D50" fill="#EE5D50" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Share of mention</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brand.competitorMentions}>
                <CartesianGrid stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="brand" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Bar dataKey="shareOfMention" fill="#4940c6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <h3 className="font-display text-lg font-bold text-white">Theme analysis</h3>
        <div className="nos-table-wrap mt-4">
          <table className="nos-table">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Volume</th>
                <th>Sentiment</th>
                <th>Momentum</th>
              </tr>
            </thead>
            <tbody>
              {brand.themes.map((t) => (
                <tr key={t.theme}>
                  <td className="font-medium text-white">{t.theme}</td>
                  <td>{t.volume}</td>
                  <td>{t.sentiment}</td>
                  <td className={t.momentum >= 0 ? "text-[#01B574]" : "text-[#EE5D50]"}>
                    {t.momentum >= 0 ? "+" : ""}
                    {t.momentum}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2">
        {brand.revenueProxy.map((r) => (
          <GlassCard key={r.label} padding="md">
            <p className="text-xs uppercase tracking-wider text-[#718096]">{r.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#f36901]">{r.value}</p>
            <p className="mt-2 text-[11px] text-[#A0AEC0]">{r.note}</p>
          </GlassCard>
        ))}
      </div>

      <IntelligenceActionsPanel actions={brand.recommendations} />
    </div>
  );
}
