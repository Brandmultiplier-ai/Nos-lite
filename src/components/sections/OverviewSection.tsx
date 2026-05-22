"use client";

import { ChannelBarChart } from "@/components/charts/ChannelBarChart";
import { SignalAreaChart } from "@/components/charts/SignalAreaChart";
import { useChartTheme } from "@/components/charts/chartTheme";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDashboard } from "@/context/DashboardContext";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { ChannelPulseMetric } from "@/types/nos";
import { CHART_CARD_DESCRIPTIONS, METRIC_DESCRIPTIONS, pulseGridCardHint } from "@/data/metricDescriptions";
import { useMemo, useId } from "react";
import { insightAccentClass, isMboardTheme, isVibrantTheme, usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

export function OverviewSection() {
  const { chartGridStroke, tooltipContentStyle, chartColors, axisStyle, chartBarPalette, chartBarRadius, chartChannelColors, isNeonCharts, isMboardCharts } = useChartTheme();
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);
  const isV4 = isVibrantTheme(version);
  const isV5 = isMboardTheme(version);
  const useChannelColors = isV4 || isV5;
  const useMultiColorBars = isNeonCharts;
  const useSparkMulticolor = isNeonCharts || isMboardCharts;
  const { data, workspaceId } = useDashboard();
  const { overview } = data;
  const gid = useId().replace(/:/g, "");

  const filteredFeed = overview.signalFeed;
  const narratives = overview.narrativeInsights ?? [];
  const crossWeekly = overview.crossChannelWeekly ?? [];
  const pulses = overview.channelPulse ?? [];

  const inferredMix = useMemo(() => {
    const total = overview.channelBreakdown.reduce((s, row) => s + row.volume, 0) || 1;
    return overview.channelBreakdown.map((row) => ({
      channel: row.channel,
      share: Math.round((row.volume / total) * 100),
    }));
  }, [overview.channelBreakdown]);

  const sparkVolume = overview.channelBreakdown.reduce((s, b) => s + b.volume, 0) || 1;

  const volumeSparkSeries = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        step: `${i + 1}`,
        v: Math.max(410, Math.round((sparkVolume / 420) * (520 + Math.sin(i / 4) * 90 + ((i + 9) % 7) * 22))),
      })),
    [sparkVolume],
  );

  const pulseGrid: ChannelPulseMetric[] = pulses.length ? pulses : [];

  const inferredPulse: ChannelPulseMetric[] =
    pulses.length === 0
      ? overview.channelBreakdown.map((row) => ({
          channel: row.channel,
          signals: row.volume,
          qualifiedLeads: Math.max(34, Math.round(row.volume * 0.074)),
          takeaway: `Blend for ${row.channel} shows steady ingestion — reconcile with outbound pacing.`,
        }))
      : [];

  const pulsesToShow = pulseGrid.length ? pulseGrid : inferredPulse;

  const engagementRatioSeries = useMemo(
    () =>
      pulsesToShow.map((row) => ({
        channel: row.channel,
        ingest: row.signals,
        qualified: row.qualifiedLeads,
        conv: Math.round((row.qualifiedLeads / Math.max(1, row.signals)) * 100),
      })),
    [pulsesToShow],
  );

  const maxSignals = Math.max(1, ...pulsesToShow.map((p) => p.signals));
  const normSeries = pulsesToShow.map((row) => ({
    channel: row.channel,
    norm: Math.round((row.signals / maxSignals) * 100),
  }));

  const sectionTitle = themed ? `font-display text-xl font-bold ${tc.inkText}` : "font-display text-xl font-bold text-white";
  const sectionSub = themed ? `text-sm ${tc.secondaryText}` : "text-sm text-[#A0AEC0]";
  const sectionSubMt = themed ? `mt-1 ${sectionSub}` : `mt-1 text-sm text-[#A0AEC0]`;

  return (
    <div className="relative space-y-6">
      <GlassCard className="p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className={themed ? tc.eyebrow : "text-xs uppercase tracking-[0.18em] text-[#74B7FF]/90"}>
              Acquisition intelligence
            </p>
            <h1
              className={
                themed
                  ? `font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl ${tc.inkText}`
                  : "font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              }
            >
              Signals, volume, and what it means across every motion
            </h1>
            <p className={themed ? `text-sm ${tc.secondaryText}` : "text-sm text-[#A0AEC0]"}>
              Website de-anonymization, LinkedIn cadence, Instantly-ready mailboxes, and content echoes — unified for ops
              review.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {(["Website", "LinkedIn", "Email", "Content"] as const).map((ch) => (
              <ChannelBadge key={ch} channel={ch} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <p className={themed ? `text-xs uppercase tracking-[0.1em] ${tc.mutedText}` : "text-xs uppercase tracking-[0.1em] text-[#A0AEC0]"}>Channel footprint</p>
              <CardInfoTip
                subject="Channel footprint"
                text="Each bar’s width is the modeled share of gross volume for that motion — a quick mix read before drilling into tables."
              />
            </div>
            <div className="mt-4 space-y-2">
              {inferredMix.map((row, index) => (
                <div key={row.channel} className="flex items-center gap-3 text-sm">
                  <span className={themed ? `w-28 ${tc.secondaryText}` : "w-28 text-[#A0AEC0]"}>{row.channel}</span>
                  <div className={`h-2 flex-1 overflow-hidden rounded-full ${themed ? "bg-[var(--theme-canvas-overlay)]" : "bg-white/[0.06]"}`}>
                    <div
                      className={`h-full rounded-full ${themed && !useChannelColors ? tc.progressPrimary : !themed ? "bg-gradient-to-r from-[#4940c6] to-[#00D4FF]" : ""}`}
                      style={{
                        width: `${row.share}%`,
                        ...(useChannelColors
                          ? { backgroundColor: chartChannelColors[row.channel] ?? chartBarPalette[index % chartBarPalette.length] }
                          : {}),
                      }}
                    />
                  </div>
                  <span className={`w-12 text-right font-semibold tabular-nums ${themed ? tc.inkText : "text-white"}`}>{row.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`md:col-span-7 min-h-[220px] min-w-0 p-3 sm:p-5 ${themed ? `${tc.innerPanel} !shadow-none` : "rounded-2xl border border-[#4940c6]/15 bg-[#121832]"}`}>
            <div className="min-h-[200px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={volumeSparkSeries} margin={{ left: 4, right: 14, top: 8, bottom: 4 }}>
                  {!useSparkMulticolor ? (
                    <defs>
                      <linearGradient id={`ovSpark-${gid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={themed ? chartColors.accent : "#00D4FF"} stopOpacity={0.82} />
                        <stop offset="100%" stopColor={chartColors.primaryDark} stopOpacity={0.35} />
                      </linearGradient>
                    </defs>
                  ) : null}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                  <XAxis dataKey="step" tick={axisStyle} axisLine={false} tickLine={false} hide />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={44} tickMargin={8} />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Bar
                    dataKey="v"
                    radius={chartBarRadius}
                    fill={useSparkMulticolor ? chartBarPalette[0] : `url(#ovSpark-${gid})`}
                    maxBarSize={useSparkMulticolor ? 28 : undefined}
                  >
                    {useSparkMulticolor
                      ? volumeSparkSeries.map((row, index) => (
                          <Cell key={row.step} fill={chartBarPalette[index % chartBarPalette.length]} />
                        ))
                      : null}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <p className={themed ? `text-[11px] uppercase tracking-[0.12em] ${tc.mutedText}` : "text-[11px] uppercase tracking-[0.12em] text-[#6B758E]"}>
                Synthetic momentum · Total channel volume pacing
              </p>
              <CardInfoTip subject="Synthetic momentum" text={CHART_CARD_DESCRIPTIONS["Synthetic momentum"]} />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {overview.kpis.map((kpi, index) => (
          <StatCard
            key={kpi.label}
            stat={kpi}
            info={METRIC_DESCRIPTIONS[kpi.label]}
            featured={index === 0}
          />
        ))}
      </div>

      {narratives.length > 0 && (
        <GlassCard>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={sectionTitle}>Operational narratives</h2>
                <CardInfoTip subject="Operational narratives" text={CHART_CARD_DESCRIPTIONS["Operational narratives"]} />
              </div>
              <p className={sectionSubMt}>
                Short reads on mix, intent, and hygiene — generated from live demo cohorts.
              </p>
            </div>
          </div>
          <div className="flex snap-x gap-4 overflow-x-auto pb-3">
            {narratives.map((n) => (
              <div
                key={n.id}
                className={`min-w-[240px] max-w-[300px] flex-none snap-start p-5 ${
                  themed
                    ? insightAccentClass(n.channel, version)
                    : `rounded-2xl border bg-gradient-to-b ${insightAccentClass(n.channel, version)}`
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.channel === "Mixed" ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${themed ? "bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink-secondary)]" : "bg-white/[0.08] text-white/80"}`}>
                        Mixed motions
                      </span>
                    ) : (
                      <ChannelBadge channel={n.channel as "Website" | "LinkedIn" | "Email" | "Content"} />
                    )}
                  </div>
                  <CardInfoTip
                    subject={n.headline}
                    text="Interpretive read generated from modeled mix and hygiene signals — use to steer weekly reviews."
                  />
                </div>
                <h3 className={`font-semibold leading-snug ${themed ? tc.inkText : "text-white"}`}>{n.headline}</h3>
                <p className={`mt-2 text-xs leading-relaxed ${themed ? tc.secondaryText : "text-[#B8C7E8]"}`}>{n.body}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {crossWeekly.length > 0 && (
        <GlassCard>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={sectionTitle}>Cross-channel ingestion</h2>
                <CardInfoTip subject="Cross-channel ingestion" text={CHART_CARD_DESCRIPTIONS["Cross-channel ingestion"]} />
              </div>
              <p className={sectionSubMt}>Stacked weekly signals across outbound + inbound surfaces</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={crossWeekly} margin={{ left: -8, right: 8, top: 12, bottom: 12 }}>
              <defs>
                <linearGradient id={`cc-w-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={useChannelColors ? chartChannelColors.Website : "#00D4FF"} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={useChannelColors ? chartChannelColors.Website : "#00D4FF"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`cc-li-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={useChannelColors ? chartChannelColors.LinkedIn : chartColors.primaryDark} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={useChannelColors ? chartChannelColors.LinkedIn : chartColors.primaryDark} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`cc-em-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={useChannelColors ? chartChannelColors.Email : "#EE8A50"} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={useChannelColors ? chartChannelColors.Email : "#EE8A50"} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`cc-co-${gid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={useChannelColors ? chartChannelColors.Content : "#01B574"} stopOpacity={0.38} />
                  <stop offset="100%" stopColor={useChannelColors ? chartChannelColors.Content : "#01B574"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipContentStyle} />
              <Legend wrapperStyle={{ color: isV4 ? "#9ca3af" : isV5 ? "#96A5B8" : "#A0AEC0", fontSize: 11 }} verticalAlign="top" iconType="circle" />
              <Area type="monotone" dataKey="website" stackId="a" stroke={useChannelColors ? chartChannelColors.Website : "#00D4FF"} fill={`url(#cc-w-${gid})`} strokeWidth={1.5} />
              <Area type="monotone" dataKey="linkedin" stackId="a" stroke={useChannelColors ? chartChannelColors.LinkedIn : chartColors.teal} fill={`url(#cc-li-${gid})`} strokeWidth={1.5} />
              <Area type="monotone" dataKey="email" stackId="a" stroke={useChannelColors ? chartChannelColors.Email : "#EE8A50"} fill={`url(#cc-em-${gid})`} strokeWidth={1.5} />
              <Area type="monotone" dataKey="content" stackId="a" stroke={useChannelColors ? chartChannelColors.Content : "#01B574"} fill={`url(#cc-co-${gid})`} strokeWidth={1.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassCard>
          <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className={sectionTitle}>Channel pulse grid</h2>
              <CardInfoTip subject="Channel pulse grid" text={CHART_CARD_DESCRIPTIONS["Channel pulse grid"]} />
            </div>
          </div>
          <p className={`mb-6 text-sm ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>Qualified lift vs ingest — where urgency clusters</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pulsesToShow.map((row) => (
              <div
                key={row.channel}
                className={
                  themed
                    ? `${tc.innerPanel} rounded-2xl ${isV5 ? "" : "!bg-[var(--theme-canvas-raised)]"}`
                    : "rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                }
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <ChannelBadge channel={row.channel as "Website" | "LinkedIn" | "Email" | "Content"} />
                  <CardInfoTip subject={`${row.channel} pulse`} text={pulseGridCardHint(row.channel)} />
                </div>
                <dl className={`grid grid-cols-2 gap-3 text-xs ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>
                  <div>
                    <dt className="uppercase tracking-[0.08em]">Signals</dt>
                    <dd className={`mt-2 text-xl font-semibold ${themed ? tc.inkText : "text-white"}`}>{row.signals.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.08em]">Qualified</dt>
                    <dd className={`mt-2 text-xl font-semibold ${themed ? tc.successText : "text-[#01B574]"}`}>{row.qualifiedLeads.toLocaleString()}</dd>
                  </div>
                </dl>
                <p className={`mt-3 text-xs leading-relaxed ${themed ? tc.mutedText : "text-[#8C9BCA]"}`}>{row.takeaway}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={sectionTitle}>Qualification & raw scale</h2>
                <CardInfoTip
                  subject="Qualification & raw scale"
                  text={CHART_CARD_DESCRIPTIONS["Qualification & raw scale"]}
                />
              </div>
              <p className={sectionSubMt}>Two lenses: conversion ratio (%) and normalized ingest</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={engagementRatioSeries} margin={{ top: 16, left: -8, right: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
              <XAxis dataKey="channel" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => (typeof value === "number" ? `${value}%` : `${value ?? "–"}`)} contentStyle={tooltipContentStyle} />
              <Bar dataKey="conv" radius={chartBarRadius} fill={useMultiColorBars ? chartBarPalette[0] : isMboardCharts ? chartColors.primaryDark : `url(#ovConv-${gid})`} maxBarSize={useMultiColorBars || isMboardCharts ? 42 : undefined}>
                {useMultiColorBars
                  ? engagementRatioSeries.map((row, index) => (
                      <Cell key={row.channel} fill={chartBarPalette[index % chartBarPalette.length]} />
                    ))
                  : null}
              </Bar>
              {!useMultiColorBars && !isMboardCharts ? (
                <defs>
                  <linearGradient id={`ovConv-${gid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#01B574" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              ) : null}
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-6">
            <p className={`mb-3 text-xs uppercase tracking-[0.1em] ${themed ? tc.mutedText : "text-[#6B758E]"}`}>Relative ingest (normalized)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={normSeries} margin={{ left: -8, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridStroke} vertical={false} />
                <XAxis dataKey="channel" tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipContentStyle} />
                <Bar dataKey="norm" radius={chartBarRadius} fill={useMultiColorBars ? chartBarPalette[2] : isMboardCharts ? chartColors.primaryDark : "#00D4FF"} opacity={useMultiColorBars || isMboardCharts ? 1 : 0.45} maxBarSize={useMultiColorBars || isMboardCharts ? 42 : undefined}>
                  {useMultiColorBars
                    ? normSeries.map((row, index) => (
                        <Cell key={row.channel} fill={chartBarPalette[(index + 2) % chartBarPalette.length]} />
                      ))
                    : null}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h2 className={sectionTitle}>Signal throughput</h2>
                <CardInfoTip
                  subject="Signal throughput"
                  text={CHART_CARD_DESCRIPTIONS["Signal throughput"]}
                />
              </div>
              <p className={`mt-1 text-sm ${themed ? tc.successText : "text-[#01B574]"}`}>{overview.signalGrowth}</p>
            </div>
          </div>
          <SignalAreaChart key={workspaceId} data={overview.signalChart} />
        </GlassCard>
        <GlassCard>
          <div className="mb-4 flex items-start justify-between gap-2">
            <h2 className={sectionTitle}>Channel breakdown</h2>
            <CardInfoTip subject="Channel breakdown" text={CHART_CARD_DESCRIPTIONS["Channel breakdown"]} />
          </div>
          <ChannelBarChart key={workspaceId} data={overview.channelBreakdown} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className={sectionTitle}>Active signal feed</h2>
            <CardInfoTip subject="Active signal feed" text={CHART_CARD_DESCRIPTIONS["Active signal feed"]} />
          </div>
          {filteredFeed.length === 0 ? (
            <EmptyState message="No signals to show." />
          ) : (
            <div className="nos-table-wrap">
              <table className="nos-table min-w-[520px]">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Channel</th>
                    <th>Signal Type</th>
                    <th>Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeed.map((row) => (
                    <tr key={`${row.company}-${row.time}-${row.signalType}`}>
                      <td className={themed ? tc.inkText : "font-semibold text-white"}>{row.company}</td>
                      <td>
                        <ChannelBadge channel={row.channel} />
                      </td>
                      <td className={themed ? tc.secondaryText : "text-[#A0AEC0]"}>{row.signalType}</td>
                      <td className={themed ? (isV5 ? "font-semibold text-[#5B8DEF]" : `font-semibold ${tc.accentText}`) : "font-semibold text-[#00D4FF]"}>{row.score}</td>
                      <td className={themed ? tc.mutedText : "text-[#A0AEC0]"}>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className={sectionTitle}>Funnel progression</h2>
            <CardInfoTip subject="Funnel progression" text={CHART_CARD_DESCRIPTIONS["Funnel progression"]} />
          </div>
          <div className="space-y-5">
            {overview.funnel.map((step) => (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className={themed ? tc.secondaryText : "text-[#A0AEC0]"}>{step.label}</span>
                  <span className={`font-semibold ${themed ? tc.inkText : "text-white"}`}>{step.value.toLocaleString()}</span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${themed ? "bg-[var(--theme-canvas-overlay)]" : "bg-[#0B1437]"}`}>
                  <div
                    className={`h-full rounded-full ${themed ? (isV5 ? "bg-[var(--theme-primary)]" : tc.progressPrimary) : "bg-gradient-to-r from-[#00D4FF] to-[#4940c6]"}`}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
