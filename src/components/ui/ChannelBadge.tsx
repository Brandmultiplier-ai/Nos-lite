"use client";

import { isBrandTheme, isCubicTheme, isMboardTheme, isVibrantTheme, usesDesignTokens } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

const v1ChannelColors: Record<string, string> = {
  Website: "bg-[#4940c6]/20 text-[#4940c6]",
  LinkedIn: "bg-[#00D4FF]/20 text-[#00D4FF]",
  Email: "bg-[#3a32a0]/20 text-[#A78BFA]",
  Content: "bg-[#01B574]/20 text-[#01B574]",
};

const v3ChannelColors: Record<string, string> = {
  Website: "bg-[var(--theme-link)]/12 text-[var(--theme-link)]",
  LinkedIn: "bg-[var(--theme-signal-light)]/12 text-[var(--theme-signal-light)]",
  Email: "bg-[var(--theme-primary)]/12 text-[var(--theme-primary)]",
  Content: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
};

const v2ChannelColors: Record<string, string> = {
  Website: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  LinkedIn: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  Email: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  Content: "bg-[var(--theme-success-soft)] text-[var(--theme-success)]",
};

export function ChannelBadge({ channel }: { channel: string }) {
  const { version } = useTheme();
  const themed = usesDesignTokens(version);
  const colors = isMboardTheme(version)
    ? {
        Website: "bg-[#EEF4FF] text-[#5B8DEF] border-[#B4D3FF]",
        LinkedIn: "bg-[#FFF4E6] text-[#FF9F29] border-[#FFD699]",
        Email: "bg-[#FFF0F0] text-[#FF6B6B] border-[#FFCACA]",
        Content: "bg-[#F3EEFF] text-[#9B88FF] border-[#DDD6FE]",
      }
    : isBrandTheme(version)
      ? {
          Website: "bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/30",
          LinkedIn: "bg-[#4940C6]/15 text-[#4940C6] border-[#4940C6]/30",
          Email: "bg-[#F36901]/15 text-[#F36901] border-[#F36901]/30",
          Content: "bg-[#6366F1]/15 text-[#6366F1] border-[#6366F1]/30",
        }
    : isVibrantTheme(version)
    ? {
        Website: "bg-[#14332f] text-[#4adeca] border-[#4adeca]/30",
        LinkedIn: "bg-[#3d2f14] text-[#fcd34d] border-[#fcd34d]/30",
        Email: "bg-[#3d1829] text-[#f472b6] border-[#f472b6]/30",
        Content: "bg-[#143322] text-[#22c55e] border-[#22c55e]/30",
      }
    : isCubicTheme(version)
    ? v3ChannelColors
    : themed
      ? v2ChannelColors
      : v1ChannelColors;
  const radius =
    isBrandTheme(version) ? "rounded-[2px]" : isVibrantTheme(version) || isCubicTheme(version) ? "rounded-lg" : themed ? "rounded-full" : "rounded-lg";
  const borderClass = isMboardTheme(version) || isVibrantTheme(version) || isBrandTheme(version)
    ? "border"
    : themed
      ? "border border-[var(--theme-hairline)]"
      : "border border-white/10";

  return (
    <span
      className={`inline-flex ${radius} ${borderClass} px-2.5 py-0.5 text-xs font-semibold ${colors[channel] ?? (themed ? "bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]" : "bg-white/10 text-white")}`}
    >
      {channel}
    </span>
  );
}
