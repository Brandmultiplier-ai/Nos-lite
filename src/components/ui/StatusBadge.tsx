"use client";

import { isCubicTheme, isVibrantTheme, usesDesignTokens } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

const v1StatusColors: Record<string, string> = {
  Hot: "bg-[#EE5D50]/20 text-[#EE5D50]",
  Warm: "bg-orange-500/20 text-orange-400",
  Cold: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Active: "bg-[#01B574]/20 text-[#01B574]",
  Running: "bg-[#01B574]/20 text-[#01B574]",
  Paused: "bg-[#A0AEC0]/20 text-[#A0AEC0]",
  Completed: "bg-[#4940c6]/20 text-[#4940c6]",
  "In sequence": "bg-[#00D4FF]/14 text-[#00D4FF]",
  Replied: "bg-[#01B574]/20 text-[#01B574]",
  Bounced: "bg-[#EE5D50]/22 text-[#EE5D50]",
  Unsubscribed: "bg-[#A0AEC0]/18 text-[#A0AEC0]",
  "Opened only": "bg-[#4940c6]/16 text-[#C4BEFF]",
  Published: "bg-[#01B574]/20 text-[#01B574]",
  Scheduled: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Draft: "bg-[#A0AEC0]/20 text-[#A0AEC0]",
};

const themedStatusColors: Record<string, string> = {
  Hot: "bg-[var(--theme-danger-soft)] text-[var(--theme-danger)]",
  Warm: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  Cold: "bg-[var(--theme-link)]/12 text-[var(--theme-link)]",
  Active: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
  Running: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
  Paused: "bg-[var(--theme-canvas-overlay)] text-[var(--theme-mute)]",
  Completed: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  "In sequence": "bg-[var(--theme-link)]/12 text-[var(--theme-link)]",
  Replied: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
  Bounced: "bg-[var(--theme-danger-soft)] text-[var(--theme-danger)]",
  Unsubscribed: "bg-[var(--theme-canvas-overlay)] text-[var(--theme-mute)]",
  "Opened only": "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  Published: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
  Scheduled: "bg-[var(--theme-link)]/12 text-[var(--theme-link)]",
  Draft: "bg-[var(--theme-canvas-overlay)] text-[var(--theme-mute)]",
};

export function StatusBadge({ status }: { status: string }) {
  const { version } = useTheme();
  const themed = usesDesignTokens(version);
  const colors = themed ? themedStatusColors : v1StatusColors;
  const radius = isVibrantTheme(version) || isCubicTheme(version) ? "rounded-lg" : themed ? "rounded-full" : "rounded-lg";
  const border = themed
    ? "border border-[var(--theme-hairline)]"
    : "border border-white/10";

  return (
    <span
      className={`inline-flex ${radius} ${border} px-2.5 py-0.5 text-xs font-semibold ${colors[status] ?? (themed ? "bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]" : "bg-white/10 text-white")}`}
    >
      {status}
    </span>
  );
}
