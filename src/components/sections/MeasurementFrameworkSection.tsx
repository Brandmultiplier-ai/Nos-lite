"use client";

import { axisStyle, chartGridStroke, tooltipContentStyle } from "@/components/charts/chartTheme";
import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { GlassCard } from "@/components/ui/GlassCard";
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
  const { measurement } = useWorkspaceIntelligence();

  const radarData = measurement.attributes.map((a) => ({
    attribute: a.label,
    score: a.score,
    benchmark: a.benchmark,
  }));

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4940c6]">Measurement framework</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-white">FURCR brand attributes</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#A0AEC0]">
          Familiarity, uniqueness, consistency, relevance, and reverence — scored with explicit methodology notes.
        </p>
        <p className="mt-4 font-display text-4xl font-bold text-[#f36901]">
          {measurement.compositeIndex}
          <span className="ml-2 text-base font-normal text-[#A0AEC0]">composite index</span>
        </p>
        <p className="text-sm text-[#01B574]">+{measurement.compositeTrendPct}% vs prior quarter</p>
      </GlassCard>

      <IntelligenceMethodBanner note={measurement.methodNote} />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Attribute radar</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: "#A0AEC0", fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar name="Score" dataKey="score" stroke="#4940c6" fill="#4940c6" fillOpacity={0.35} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#f36901" fill="#f36901" fillOpacity={0.2} />
                <Legend />
                <Tooltip contentStyle={tooltipContentStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Scorecards</h3>
          <ul className="mt-4 space-y-3">
            {measurement.attributes.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{a.label}</span>
                  <span className="font-display text-xl font-bold text-[#4940c6]">{a.score}</span>
                </div>
                <p className="mt-1 text-xs text-[#718096]">Benchmark {a.benchmark} · trend {a.trendPct >= 0 ? "+" : ""}{a.trendPct}%</p>
                <p className="mt-2 text-[11px] leading-snug text-[#A0AEC0]">{a.methodNote}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <h3 className="font-display text-lg font-bold text-white">Attribute trends (8 mo)</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={measurement.trendSeries}>
              <CartesianGrid stroke={chartGridStroke} vertical={false} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis domain={[40, 100]} tick={axisStyle} />
              <Tooltip contentStyle={tooltipContentStyle} />
              <Legend />
              <Line type="monotone" dataKey="familiarity" stroke="#4940c6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="uniqueness" stroke="#f36901" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="consistency" stroke="#00D4FF" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="relevance" stroke="#01B574" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="reverence" stroke="#EE5D50" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <IntelligenceActionsPanel actions={measurement.recommendations} />
    </div>
  );
}
