"use client";

import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function SearchIntelligenceSection() {
  const intel = useWorkspaceIntelligence();
  const { search } = intel;

  return (
    <div className="space-y-6">
      <GlassCard className="border border-[#4940c6]/20 bg-gradient-to-br from-[#4940c6]/10 via-transparent to-[#f36901]/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]">Search intelligence</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-white">SEO · GEO · AEO</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#A0AEC0]">
          Query demand, share-of-voice, and generative answer coverage — structured for category defense and
          growth plays.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={search.methodNote} />
      <IntelligenceKpiGrid kpis={search.kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-white">Share of voice trend</h3>
            <CardInfoTip
              subject="SOV trend"
              text="Owned visibility vs category average across tracked query clusters (8-week window)."
            />
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={search.sovTrend}>
                <CartesianGrid stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="period" tick={axisStyle} />
                <YAxis tick={axisStyle} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Legend />
                <Line type="monotone" dataKey="owned" name="Owned" stroke="#4940c6" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="categoryAvg"
                  name="Category avg"
                  stroke="#f36901"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">AEO engine coverage</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={search.aeoCoverage} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid stroke={chartGridStroke} horizontal={false} />
                <XAxis type="number" tick={axisStyle} />
                <YAxis type="category" dataKey="engine" width={120} tick={axisStyle} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Bar dataKey="answerShare" name="Answer share %" fill="#4940c6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <h3 className="font-display text-lg font-bold text-white">Query cluster decomposition</h3>
        <div className="nos-table-wrap mt-4">
          <table className="nos-table">
            <thead>
              <tr>
                <th>Cluster</th>
                <th>Volume</th>
                <th>SOV</th>
                <th>Trend</th>
                <th>AEO coverage</th>
                <th>Intent</th>
              </tr>
            </thead>
            <tbody>
              {search.queryClusters.map((row) => (
                <tr key={row.cluster}>
                  <td className="font-medium text-white">{row.cluster}</td>
                  <td>{row.volume.toLocaleString("en-US")}</td>
                  <td>{row.shareOfVoice}%</td>
                  <td className={row.trendPct >= 0 ? "text-[#01B574]" : "text-[#EE5D50]"}>
                    {row.trendPct >= 0 ? "+" : ""}
                    {row.trendPct}%
                  </td>
                  <td>{row.aeoCoverage}%</td>
                  <td className="capitalize text-[#A0AEC0]">{row.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard padding="lg">
        <h3 className="font-display text-lg font-bold text-white">GEO regional visibility</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {search.geoRegions.map((r) => (
            <li key={r.region} className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
              <p className="text-xs uppercase tracking-wider text-[#718096]">{r.region}</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">{r.visibility}%</p>
              <p className="mt-1 text-xs text-[#01B574]">+{r.delta}% vs prior</p>
            </li>
          ))}
        </ul>
      </GlassCard>

      <IntelligenceActionsPanel actions={search.recommendations} />
    </div>
  );
}
