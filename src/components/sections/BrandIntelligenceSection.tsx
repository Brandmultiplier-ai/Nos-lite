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
} from "@/components/intelligence/mboardUi";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";
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
  Cell,
} from "recharts";

export function BrandIntelligenceSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle, chartBarPalette, chartBarRadius, isNeonCharts, isMboardCharts } =
    useChartTheme();
  const copy = useSectionThemeCopy();
  const { brand } = useWorkspaceIntelligence();

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className={copy.themed ? copy.tc.eyebrow : "text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]"}>
          Brand intelligence
        </p>
        <h2 className={`mt-1 ${copy.themed ? copy.tc.sectionTitleLg : "font-display text-2xl font-bold text-white"}`}>
          Sentiment · share · strategy
        </h2>
        <p className={`mt-2 max-w-3xl text-sm ${copy.muted}`}>
          Mention share, sentiment decomposition, and theme momentum — framed for competitive narrative defense.
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={brand.methodNote} />
      <IntelligenceKpiGrid kpis={brand.kpis} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="8-week trend" title="Sentiment trajectory" />
          {copy.isV5 ? (
            <>
              <MboardChartFrame>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={brand.sentimentTrend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} vertical={false} />
                      <XAxis dataKey="period" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        stackId="1"
                        stroke={chartColors.green}
                        fill={chartColors.green}
                        fillOpacity={0.35}
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stackId="1"
                        stroke="#696969"
                        fill="#696969"
                        fillOpacity={0.25}
                      />
                      <Area
                        type="monotone"
                        dataKey="negative"
                        stackId="1"
                        stroke={chartColors.red}
                        fill={chartColors.red}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend
                items={[
                  { label: "Positive", color: chartColors.green },
                  { label: "Neutral", color: "#696969" },
                  { label: "Negative", color: chartColors.red },
                ]}
              />
            </>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={brand.sentimentTrend}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="period" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke={chartColors.green} fill={chartColors.green} fillOpacity={0.35} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#696969" fill="#696969" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke={chartColors.red} fill={chartColors.red} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Mention share" title="Share of mention" />
          {copy.isV5 ? (
            <>
              <MboardChartFrame>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={brand.competitorMentions} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} vertical={false} />
                      <XAxis dataKey="brand" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipContentStyle} />
                      <Bar
                        dataKey="shareOfMention"
                        fill={chartColors.primaryDark}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend items={[{ label: "Share of mention", color: chartColors.primaryDark }]} />
            </>
          ) : (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brand.competitorMentions}>
                  <CartesianGrid stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="brand" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Bar
                    dataKey="shareOfMention"
                    fill={isMboardCharts ? chartColors.primaryDark : isNeonCharts ? chartBarPalette[0] : chartColors.primaryDark}
                    radius={chartBarRadius}
                    maxBarSize={isNeonCharts ? 42 : isMboardCharts ? 36 : undefined}
                  >
                    {isNeonCharts
                      ? brand.competitorMentions.map((row, index) => (
                          <Cell key={row.brand} fill={chartBarPalette[index % chartBarPalette.length]} />
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
        <IntelligencePanelHeader eyebrow="Theme corpus" title="Theme analysis" />
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
                  <td className={`font-medium ${copy.ink}`}>{t.theme}</td>
                  <td>{t.volume}</td>
                  <td>{t.sentiment}</td>
                  <td>
                    {copy.isV5 ? (
                      <MboardDeltaPill value={t.momentum} suffix="" className="!mt-0" />
                    ) : (
                      <span className={t.momentum >= 0 ? copy.tc.successText : copy.tc.dangerText}>
                        {t.momentum >= 0 ? "+" : ""}
                        {t.momentum}%
                      </span>
                    )}
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
            <p className={copy.themed ? copy.tc.eyebrow : "text-xs uppercase tracking-wider text-[#718096]"}>{r.label}</p>
            <p className={`mt-1 font-display text-2xl font-semibold tracking-[-0.02em] ${copy.tc.accentText}`}>{r.value}</p>
            <p className={`mt-2 text-[11px] ${copy.muted}`}>{r.note}</p>
          </GlassCard>
        ))}
      </div>

      <IntelligenceActionsPanel actions={brand.recommendations} />
    </div>
  );
}
