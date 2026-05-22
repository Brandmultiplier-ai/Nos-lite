"use client";

import { isMboardTheme, usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

export function useSectionThemeCopy() {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);
  const isV5 = isMboardTheme(version);

  const darkGradientGlass = themed
    ? ""
    : "border-white/[0.08] bg-gradient-to-br from-[#100f24]/88 via-[#0C1029]/88 to-[#06080F]/92";

  return {
    version,
    tc,
    themed,
    isV5,
    darkGradientGlass,
    ink: themed ? tc.inkText : "text-white",
    muted: themed ? tc.secondaryText : "text-[#A0AEC0]",
    muteSm: themed ? tc.mutedText : "text-[#718096]",
    h2: themed ? tc.sectionTitleLg : "font-display text-xl font-bold text-white",
    h3: themed ? tc.sectionTitle : "font-display text-lg font-bold text-white",
    tabShell: themed ? tc.tabBarShell : "inline-flex rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1",
    tabShellTight: themed ? `${tc.tabBarShell} !p-1.5` : "inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1.5",
    pagBtn: themed
      ? "rounded-lg border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-3 py-1 text-xs font-medium text-[var(--theme-ink)] hover:bg-[var(--theme-canvas-soft)] disabled:cursor-not-allowed disabled:opacity-40"
      : "rounded-lg border border-white/[0.12] px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40",
    tableRow: themed ? `cursor-pointer border-l-4 transition ${tc.inkText}` : "cursor-pointer border-l-4 text-white transition",
    tableRowHover: themed ? "hover:bg-[var(--theme-canvas-soft)]" : "hover:bg-white/[0.035]",
    drawerAside: isV5
      ? "absolute right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.12)]"
      : "absolute right-0 top-0 z-50 h-full w-full max-w-[420px] overflow-y-auto border-l border-white/[0.08] bg-gradient-to-b from-[#16132A]/96 via-[#0E1324]/96 to-[#070A12]/97 p-5 shadow-[-20px_0_42px_rgba(0,0,0,0.5)] backdrop-blur-xl",
    drawerPanel: isV5 ? `${tc.innerPanel} text-sm` : "rounded-2xl border border-white/[0.08] bg-black/30 p-4 text-sm",
    closeBtn: themed
      ? `${tc.mutedText} rounded-lg p-1 hover:bg-[var(--theme-canvas-soft)] hover:text-[var(--theme-ink)]`
      : "rounded-lg p-1 text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white",
    tabClass: (active: boolean) =>
      `rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? tc.tabActive : tc.tabInactive}`,
    filterClass: (active: boolean) =>
      `rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] transition ${
        active ? tc.filterActive : `${tc.filterInactive} border-transparent`
      }`,
    inputClass: themed
      ? "w-full rounded-xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-3 py-2 text-sm text-[var(--theme-ink)] placeholder:text-[var(--theme-mute)] focus:border-[var(--theme-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-soft)]"
      : "w-full rounded-xl border border-white/[0.12] bg-black/30 px-3 py-2 text-sm text-white placeholder:text-[#718096] focus:border-[#4940c6]/60 focus:outline-none",
  };
}
