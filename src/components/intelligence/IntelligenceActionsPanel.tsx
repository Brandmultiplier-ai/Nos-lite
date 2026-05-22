"use client";

import type { IntelligenceAction } from "@/types/nos";
import { IntelligencePanelHeader } from "@/components/intelligence/mboardUi";
import { GlassCard } from "@/components/ui/GlassCard";
import { isMboardTheme, usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

const v1PriorityStyles: Record<IntelligenceAction["priority"], string> = {
  high: "border-[#f36901]/40 bg-[#f36901]/10 text-[#ffb380]",
  medium: "border-[#4940c6]/40 bg-[#4940c6]/12 text-[#c4b5fd]",
  low: "border-white/15 bg-white/[0.04] text-[#A0AEC0]",
};

export function IntelligenceActionsPanel({
  actions,
  title = "Recommended actions",
}: {
  actions: IntelligenceAction[];
  title?: string;
}) {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);
  const isMboard = isMboardTheme(version);

  const priorityStyles: Record<IntelligenceAction["priority"], string> = themed
    ? {
        high: "border-[var(--theme-primary)]/30 bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
        medium: "border-[var(--theme-link)]/30 bg-[var(--theme-link)]/10 text-[var(--theme-link)]",
        low: `border-[var(--theme-hairline)] bg-[var(--theme-canvas-overlay)] ${tc.mutedText}`,
      }
    : v1PriorityStyles;

  const mboardRowClass: Record<IntelligenceAction["priority"], string> = {
    high: "nos-mboard-action-row nos-mboard-action-row-high",
    medium: "nos-mboard-action-row nos-mboard-action-row-medium",
    low: "nos-mboard-action-row nos-mboard-action-row-low",
  };

  return (
    <GlassCard padding="lg" className={themed ? "" : "border-white/[0.08]"}>
      {isMboard ? (
        <IntelligencePanelHeader eyebrow="Playbook" title={title} />
      ) : (
        <h3 className={themed ? tc.sectionTitle : "font-display text-lg font-bold text-white"}>{title}</h3>
      )}
      <ul className="mt-4 space-y-3">
        {actions.map((a) => (
          <li
            key={a.title}
            className={
              isMboard
                ? `${mboardRowClass[a.priority]} p-4 transition hover:shadow-[var(--theme-card-shadow)]`
                : themed
                  ? `${tc.rowInteractive} p-4 hover:bg-[var(--theme-canvas-soft)]`
                  : "rounded-xl border border-white/[0.08] bg-black/25 p-4 transition hover:border-white/[0.12]"
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`rounded-[999px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityStyles[a.priority]}`}
              >
                {a.priority}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  isMboard
                    ? "bg-white text-[var(--theme-mute)] shadow-[var(--theme-card-shadow)]"
                    : themed
                      ? tc.mutedText
                      : "text-[#718096]"
                }`}
              >
                {a.confidence}% confidence
              </span>
            </div>
            <p className={`mt-2 text-sm font-semibold ${themed ? tc.inkText : "text-white"}`}>{a.title}</p>
            <p className={`mt-1 text-xs leading-relaxed ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>
              {a.body}
            </p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
