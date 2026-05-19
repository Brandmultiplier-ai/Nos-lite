"use client";

import { IntelligenceActionsPanel } from "@/components/intelligence/IntelligenceActionsPanel";
import { IntelligenceKpiGrid } from "@/components/intelligence/IntelligenceKpiGrid";
import { IntelligenceMethodBanner } from "@/components/intelligence/IntelligenceMethodBanner";
import { useWorkspaceIntelligence } from "@/components/intelligence/useWorkspaceIntelligence";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export function NarrativeIntelligenceSection() {
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f36901]">Narrative intelligence</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-white">Storyline → channel → pipeline</h2>
        <p className="mt-3 rounded-xl border border-white/[0.08] bg-black/30 p-4 text-sm leading-relaxed text-[#D9E4F8]">
          {narrative.coreStoryline}
        </p>
      </GlassCard>

      <IntelligenceMethodBanner note={narrative.methodNote} />
      <IntelligenceKpiGrid kpis={kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Storyline variants</h3>
          <ul className="mt-4 space-y-3">
            {narrative.variants.map((v) => (
              <li key={v.id} className="rounded-xl border border-white/[0.08] bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-white">{v.name}</p>
                  <span className="text-xs text-[#f36901]">{v.deploymentPct}% deployment</span>
                </div>
                <p className="mt-2 text-xs text-[#A0AEC0]">{v.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {v.channels.map((ch) => (
                    <ChannelBadge key={ch} channel={ch} />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="rounded-lg bg-[#4940c6]/15 py-2">
                    <p className="text-[#718096]">CAC</p>
                    <p className="font-semibold text-white">{v.cacDeltaPct}%</p>
                  </div>
                  <div className="rounded-lg bg-[#f36901]/15 py-2">
                    <p className="text-[#718096]">Velocity</p>
                    <p className="font-semibold text-white">{v.velocityDeltaDays}d</p>
                  </div>
                  <div className="rounded-lg bg-[#01B574]/15 py-2">
                    <p className="text-[#718096]">Conv.</p>
                    <p className="font-semibold text-white">+{v.conversionLiftPct}%</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard padding="lg">
          <h3 className="font-display text-lg font-bold text-white">Channel deployment map</h3>
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
                    <td className="text-white">{row.variantName}</td>
                    <td>{row.touchpoints.toLocaleString("en-US")}</td>
                    <td>{row.pipelineShare}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <h3 className="font-display text-lg font-bold text-white">Pipeline impact attribution</h3>
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
                  <td className="font-medium text-white">{row.metric}</td>
                  <td>{row.baseline}</td>
                  <td className="text-[#f36901]">{row.optimized}</td>
                  <td className={row.liftPct >= 0 ? "text-[#01B574]" : "text-[#EE5D50]"}>
                    {row.liftPct >= 0 ? "+" : ""}
                    {row.liftPct}%
                  </td>
                  <td className="text-[#A0AEC0]">{row.attributionNote}</td>
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
