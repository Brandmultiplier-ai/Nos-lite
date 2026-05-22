"use client";

import { useChartTheme } from "@/components/charts/chartTheme";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import {
  IntelligencePanelHeader,
  MboardChartFrame,
  MboardChartLegend,
  MboardDeltaPill,
  MboardGeoCard,
  MboardIntentBadge,
  MboardMetricMeter,
} from "@/components/intelligence/mboardUi";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import { isMboardTheme, usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";
import { useId, useMemo } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

export function SearchIntelligenceSection() {
  const {
    chartGridStroke,
    tooltipContentStyle,
    chartColors,
    axisStyle,
    chartBarPalette,
    isNeonCharts,
    isMboardCharts,
  } = useChartTheme();
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);
  const isMboard = isMboardTheme(version);
  const chartId = useId().replace(/:/g, "");
  const intel = useWorkspaceIntelligence();
  const { search } = intel;

  const aeoChartData = useMemo(
    () => search.aeoCoverage.map((row) => ({ ...row, trackMax: 100 })),
    [search.aeoCoverage],
  );

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className={themed ? tc.eyebrow : "text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]"}>
          Search intelligence
        </p>
        <h2 className={`mt-1 ${themed ? tc.sectionTitleLg : "font-display text-2xl font-bold text-white"}`}>
          SEO · GEO · AEO
        </h2>
        <p className={`mt-2 max-w-3xl text-sm ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>
          Query demand, share-of-voice, and generative answer coverage — structured for category defense and
          growth plays.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={search.methodNote} />
      <IntelligenceKpiGrid kpis={search.kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <IntelligencePanelHeader
            eyebrow="8-week trend"
            title="Share of voice trend"
            hint="Owned visibility vs category average across tracked query clusters (8-week window)."
          />
          {isMboard ? (
            <>
              <MboardChartFrame>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={search.sovTrend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`sovOwned-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.18} />
                          <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartGridStroke} vertical={false} />
                      <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area
                        type="monotone"
                        dataKey="owned"
                        stroke="none"
                        fill={`url(#sovOwned-${chartId})`}
                        fillOpacity={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="owned"
                        name="Owned"
                        stroke={chartColors.primaryDark}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: chartColors.primaryDark, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: chartColors.primaryDark }}
                      />
                      <Line
                        type="monotone"
                        dataKey="categoryAvg"
                        name="Category avg"
                        stroke={chartColors.teal}
                        strokeWidth={2}
                        dot={{ r: 3, fill: chartColors.teal, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: chartColors.teal }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend
                items={[
                  { label: "Owned", color: chartColors.primaryDark },
                  { label: "Category avg", color: chartColors.teal },
                ]}
              />
            </>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={search.sovTrend}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="period" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Line
                    type="monotone"
                    dataKey="owned"
                    name="Owned"
                    stroke={chartColors.primaryDark}
                    strokeWidth={isNeonCharts ? 2.5 : 2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="categoryAvg"
                    name="Category avg"
                    stroke={chartColors.teal}
                    strokeWidth={isNeonCharts ? 2.5 : 2}
                    strokeDasharray={isNeonCharts ? "6 5" : undefined}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Answer surfaces" title="AEO engine coverage" />
          {isMboard ? (
            <>
              <MboardChartFrame>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aeoChartData} layout="vertical" margin={{ left: 8, right: 12 }}>
                      <CartesianGrid stroke={chartGridStroke} horizontal={false} />
                      <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <YAxis type="category" dataKey="engine" width={120} tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Bar
                        dataKey="trackMax"
                        fill="#E2E8F0"
                        radius={[0, 8, 8, 0]}
                        maxBarSize={22}
                        barSize={22}
                        isAnimationActive={false}
                      />
                      <Bar dataKey="answerShare" name="Answer share %" fill={chartColors.primaryDark} radius={[0, 8, 8, 0]} maxBarSize={22} barSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend items={[{ label: "Answer share %", color: chartColors.primaryDark }]} />
            </>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={search.aeoCoverage} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid stroke={chartGridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisStyle} />
                  <YAxis type="category" dataKey="engine" width={120} tick={axisStyle} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Bar
                    dataKey="answerShare"
                    name="Answer share %"
                    fill={chartColors.primaryDark}
                    radius={isNeonCharts ? [0, 12, 12, 0] : [0, 6, 6, 0]}
                    maxBarSize={isNeonCharts ? 22 : undefined}
                  >
                    {isNeonCharts
                      ? search.aeoCoverage.map((row, index) => (
                          <Cell key={row.engine} fill={chartBarPalette[index % chartBarPalette.length]} />
                        ))
                      : null}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <IntelligencePanelHeader eyebrow="Query demand" title="Query cluster decomposition" />
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
                  <td className={`font-medium ${themed ? tc.inkText : "text-white"}`}>{row.cluster}</td>
                  <td>{row.volume.toLocaleString("en-US")}</td>
                  <td>
                    {isMboard ? (
                      <MboardMetricMeter value={row.shareOfVoice} tone="navy" />
                    ) : (
                      `${row.shareOfVoice}%`
                    )}
                  </td>
                  <td>
                    {isMboard ? (
                      <MboardDeltaPill value={row.trendPct} suffix="" className="!mt-0" />
                    ) : (
                      <span className={row.trendPct >= 0 ? tc.successText : tc.dangerText}>
                        {row.trendPct >= 0 ? "+" : ""}
                        {row.trendPct}%
                      </span>
                    )}
                  </td>
                  <td>
                    {isMboard ? (
                      <MboardMetricMeter value={row.aeoCoverage} tone="blue" />
                    ) : (
                      `${row.aeoCoverage}%`
                    )}
                  </td>
                  <td>
                    {isMboard ? (
                      <MboardIntentBadge intent={row.intent} />
                    ) : (
                      <span className={`capitalize ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>
                        {row.intent}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard padding="lg">
        <IntelligencePanelHeader eyebrow="Regional GEO" title="GEO regional visibility" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {search.geoRegions.map((r) =>
            isMboard ? (
              <MboardGeoCard key={r.region} region={r.region} visibility={r.visibility} delta={r.delta} />
            ) : (
              <li
                key={r.region}
                className={themed ? `${tc.innerPanel} p-4` : "rounded-xl border border-white/[0.08] bg-black/25 p-4"}
              >
                <p className={themed ? tc.eyebrow : "text-xs uppercase tracking-wider text-[#718096]"}>{r.region}</p>
                <p
                  className={`mt-1 font-display text-2xl font-semibold tracking-[-0.02em] ${themed ? tc.inkText : "font-display text-2xl font-bold text-white"}`}
                >
                  {r.visibility}%
                </p>
                <p className={`mt-1 text-xs ${tc.successText}`}>+{r.delta}% vs prior</p>
              </li>
            ),
          )}
        </ul>
      </GlassCard>

      <IntelligenceActionsPanel actions={search.recommendations} />
    </div>
  );
}
