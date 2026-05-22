"use client";

import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { IntelligencePanelHeader, MboardDeltaPill, MboardMetricMeter } from "@/components/intelligence/mboardUi";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { isEditorialTheme } from "@/theme/themeClasses";
import { useSectionThemeCopy } from "@/theme/sectionThemeCopy";

export function NarrativeIntelligenceSection() {
  const copy = useSectionThemeCopy();
  const isV3 = isEditorialTheme(copy.version);
  const { narrative } = useWorkspaceIntelligence();

  const kpis = [
    {
      label: "Active storyline variants",
      value: String(narrative.variants.length),
      change: 0,
      context: "Deployed across channels in this workspace",
    },
    {
      label: "Blended CAC delta",
      value: `${narrative.pipelineImpact[0]?.liftPct ?? -15}%`,
      change: narrative.pipelineImpact[0]?.liftPct ?? -15,
      context: "vs baseline with optimized narrative mix",
    },
    {
      label: "Velocity improvement",
      value: `${Math.abs(narrative.pipelineImpact[1]?.liftPct ?? 17)} days`,
      change: 12,
      context: "Modeled deal cycle compression",
    },
    {
      label: "SQL conversion lift",
      value: `+${narrative.pipelineImpact[2]?.liftPct ?? 21}%`,
      change: narrative.pipelineImpact[2]?.liftPct ?? 21,
      context: "Attributed to aligned storyline deployment",
    },
  ];

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <p className={copy.themed ? copy.tc.eyebrow : "text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]"}>
          Narrative intelligence
        </p>
        <h2 className={`mt-1 ${copy.themed ? copy.tc.sectionTitleLg : "font-display text-2xl font-bold text-white"}`}>
          Storyline → channel → pipeline
        </h2>
        <p
          className={
            isV3
              ? `${copy.tc.insightCard} mt-3 text-sm leading-relaxed ${copy.muted}`
              : copy.themed
                ? `mt-3 rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-soft)] p-4 text-sm leading-relaxed ${copy.muted}`
                : "mt-3 rounded-xl border border-white/[0.08] bg-black/30 p-4 text-sm leading-relaxed text-[#D9E4F8]"
          }
        >
          {narrative.coreStoryline}
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={narrative.methodNote} />
      <IntelligenceKpiGrid kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Storyline mix" title="Storyline variants" />
          <ul className="mt-4 space-y-3">
            {narrative.variants.map((v) => (
              <li
                key={v.id}
                className={copy.themed ? `${copy.tc.innerPanel} p-4` : "rounded-xl border border-white/[0.08] bg-black/25 p-4"}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={`font-semibold ${copy.ink}`}>{v.name}</p>
                  {copy.isV5 ? (
                    <MboardMetricMeter value={v.deploymentPct} tone="orange" />
                  ) : (
                    <span className={`text-xs ${copy.tc.accentText}`}>{v.deploymentPct}% deployment</span>
                  )}
                </div>
                <p className={`mt-2 text-xs ${copy.muted}`}>{v.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.channels.map((ch) => (
                    <ChannelBadge key={ch} channel={ch} />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className={`rounded-[6px] py-2 ${copy.tc.accentBgSoft}`}>
                    <p className={copy.tc.mutedText}>CAC</p>
                    {copy.isV5 ? (
                      <div className="mt-1 flex justify-center">
                        <MboardDeltaPill value={v.cacDeltaPct} suffix="" className="!mt-0" />
                      </div>
                    ) : (
                      <p className={`font-semibold ${copy.ink}`}>{v.cacDeltaPct}%</p>
                    )}
                  </div>
                  <div className={`rounded-[6px] py-2 ${copy.tc.accentBgSoft}`}>
                    <p className={copy.tc.mutedText}>Velocity</p>
                    <p className={`font-semibold ${copy.ink}`}>{v.velocityDeltaDays}d</p>
                  </div>
                  <div className="rounded-[6px] bg-[var(--theme-success-soft)] py-2">
                    <p className={copy.tc.mutedText}>Conv.</p>
                    {copy.isV5 ? (
                      <div className="mt-1 flex justify-center">
                        <MboardDeltaPill value={v.conversionLiftPct} suffix="" className="!mt-0" />
                      </div>
                    ) : (
                      <p className={`font-semibold ${copy.ink}`}>+{v.conversionLiftPct}%</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard padding="lg">
          <IntelligencePanelHeader eyebrow="Channel map" title="Channel deployment map" />
          <div className="nos-table-wrap mt-4">
            <table className="nos-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Variant</th>
                  <th>Touchpoints</th>
                  <th>Pipeline share</th>
                </tr>
              </thead>
              <tbody>
                {narrative.channelDeployments.map((row) => (
                  <tr key={row.channel}>
                    <td>
                      <ChannelBadge channel={row.channel} />
                    </td>
                    <td className={copy.ink}>{row.variantName}</td>
                    <td>{row.touchpoints.toLocaleString("en-US")}</td>
                    <td>
                      {copy.isV5 ? (
                        <MboardMetricMeter value={row.pipelineShare} tone="blue" />
                      ) : (
                        `${row.pipelineShare}%`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <IntelligencePanelHeader eyebrow="Pipeline lift" title="Pipeline impact attribution" />
        <div className="nos-table-wrap mt-4">
          <table className="nos-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Baseline</th>
                <th>Optimized</th>
                <th>Lift</th>
                <th>Attribution</th>
              </tr>
            </thead>
            <tbody>
              {narrative.pipelineImpact.map((row) => (
                <tr key={row.metric}>
                  <td className={`font-medium ${copy.ink}`}>{row.metric}</td>
                  <td>{row.baseline}</td>
                  <td className={copy.tc.accentText}>{row.optimized}</td>
                  <td>
                    {copy.isV5 ? (
                      <MboardDeltaPill value={row.liftPct} suffix="" className="!mt-0" />
                    ) : (
                      <span className={row.liftPct >= 0 ? copy.tc.successText : copy.tc.dangerText}>
                        {row.liftPct >= 0 ? "+" : ""}
                        {row.liftPct}%
                      </span>
                    )}
                  </td>
                  <td className={copy.muted}>{row.attributionNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <IntelligenceActionsPanel actions={narrative.recommendations} />
    </div>
  );
}
