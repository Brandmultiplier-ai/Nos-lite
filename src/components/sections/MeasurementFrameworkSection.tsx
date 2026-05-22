"use client";

import { useChartTheme } from "@/components/charts/chartTheme";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import {
  IntelligencePanelHeader,
  MboardChartFrame,
  MboardChartLegend,
  MboardDeltaPill,
  MboardMetricMeter,
} from "@/components/intelligence/mboardUi";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function MeasurementFrameworkSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle } = useChartTheme();
  const copy = useSectionThemeCopy();
  const { measurement } = useWorkspaceIntelligence();

  const radarData = measurement.attributes.map((a) => ({
    attribute: a.label,
    score: a.score,
    benchmark: a.benchmark,
  }));

  const polarTick = copy.themed ? axisStyle : { fill: "#A0AEC0", fontSize: 10 };
  const polarGridStroke = copy.themed ? chartGridStroke : "rgba(255,255,255,0.1)";

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className={copy.tc.eyebrow}>Measurement framework</p>
        <h2 className={`mt-1 ${copy.themed ? copy.tc.sectionTitleLg : "font-display text-2xl font-bold text-white"}`}>
          FURCR brand attributes
        </h2>
        <p className={`mt-2 max-w-3xl text-sm ${copy.muted}`}>
          Familiarity, uniqueness, consistency, relevance, and reverence — scored with explicit methodology notes.
        </p>
        <p className={`mt-4 font-display text-4xl font-semibold tracking-[-0.02em] ${copy.tc.accentText}`}>
          {measurement.compositeIndex}
          <span className={`ml-2 text-base font-normal ${copy.muted}`}>composite index</span>
        </p>
        <p className={`text-sm ${copy.tc.successText}`}>+{measurement.compositeTrendPct}% vs prior quarter</p>
      </GlassCard>

      <IntelligenceMethodBanner note={measurement.methodNote} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="FURCR profile" title="Attribute radar" />
          {copy.isV5 ? (
            <>
              <MboardChartFrame>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={polarGridStroke} />
                      <PolarAngleAxis dataKey="attribute" tick={polarTick} />
                      <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke={chartColors.primaryDark}
                        fill={chartColors.primaryDark}
                        fillOpacity={0.35}
                      />
                      <Radar
                        name="Benchmark"
                        dataKey="benchmark"
                        stroke={chartColors.teal}
                        fill={chartColors.teal}
                        fillOpacity={0.2}
                      />
                      <Tooltip contentStyle={tooltipContentStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </MboardChartFrame>
              <MboardChartLegend
                items={[
                  { label: "Score", color: chartColors.primaryDark },
                  { label: "Benchmark", color: chartColors.teal },
                ]}
              />
            </>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={polarGridStroke} />
                  <PolarAngleAxis dataKey="attribute" tick={polarTick} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke={chartColors.primaryDark} fill={chartColors.primaryDark} fillOpacity={0.35} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke={chartColors.teal} fill={chartColors.teal} fillOpacity={0.2} />
                  <Legend />
                  <Tooltip contentStyle={tooltipContentStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Attribute detail" title="Scorecards" />
          <ul className="mt-4 space-y-3">
            {measurement.attributes.map((a) => (
              <li
                key={a.id}
                className={copy.themed ? `${copy.tc.innerPanel} p-4` : "rounded-xl border border-white/[0.08] bg-black/25 p-4"}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-semibold ${copy.ink}`}>{a.label}</span>
                  {copy.isV5 ? (
                    <MboardMetricMeter value={a.score} tone="navy" />
                  ) : (
                    <span className={`font-display text-xl font-semibold tracking-[-0.02em] ${copy.tc.accentText}`}>{a.score}</span>
                  )}
                </div>
                <p className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${copy.muteSm}`}>
                  <span>Benchmark {a.benchmark}</span>
                  {copy.isV5 ? (
                    <MboardDeltaPill value={a.trendPct} suffix="trend" className="!mt-0" />
                  ) : (
                    <span>
                      trend {a.trendPct >= 0 ? "+" : ""}
                      {a.trendPct}%
                    </span>
                  )}
                </p>
                <p className={`mt-2 text-[11px] leading-snug ${copy.muted}`}>{a.methodNote}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <IntelligencePanelHeader eyebrow="8-month trend" title="Attribute trends (8 mo)" />
        {copy.isV5 ? (
          <>
            <MboardChartFrame>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurement.trendSeries} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                    <CartesianGrid stroke={chartGridStroke} vertical={false} />
                    <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 100]} tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipContentStyle} />
                    <Line type="monotone" dataKey="familiarity" stroke={chartColors.primaryDark} dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="uniqueness" stroke={chartColors.accent} dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="consistency" stroke={chartColors.teal} dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="relevance" stroke={chartColors.green} dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="reverence" stroke={chartColors.red} dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </MboardChartFrame>
            <MboardChartLegend
              items={[
                { label: "Familiarity", color: chartColors.primaryDark },
                { label: "Uniqueness", color: chartColors.accent },
                { label: "Consistency", color: chartColors.teal },
                { label: "Relevance", color: chartColors.green },
                { label: "Reverence", color: chartColors.red },
              ]}
            />
          </>
        ) : (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={measurement.trendSeries}>
                <CartesianGrid stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisStyle} />
                <YAxis domain={[40, 100]} tick={axisStyle} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Legend />
                <Line type="monotone" dataKey="familiarity" stroke={chartColors.primaryDark} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="uniqueness" stroke={chartColors.accent} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="consistency" stroke={chartColors.teal} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="relevance" stroke={chartColors.green} dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="reverence" stroke={chartColors.red} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      <IntelligenceActionsPanel actions={measurement.recommendations} />
    </div>
  );
}
