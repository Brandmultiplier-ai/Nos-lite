import type { ThemeVersion } from "@/routing/versionRoutes";
import { useTheme } from "@/theme/ThemeProvider";

export interface ThemeClasses {
  eyebrow: string;
  accentText: string;
  accentTextHover: string;
  accentBgSolid: string;
  accentBgMuted: string;
  accentBgSoft: string;
  accentBorder: string;
  accentBorderMuted: string;
  accentBorderStrong: string;
  panelFlat: string;
  panelRaised: string;
  innerPanel: string;
  insightCard: string;
  tabActive: string;
  tabInactive: string;
  filterActive: string;
  filterInactive: string;
  rowInteractive: string;
  rowSelected: string;
  rowSelectedBorder: string;
  avatar: string;
  badge: string;
  badgeText: string;
  buttonPrimary: string;
  buttonSecondary: string;
  link: string;
  progressPrimary: string;
  progressSecondary: string;
  focusBorder: string;
  workspaceActive: string;
  workspaceInactive: string;
  accountAvatar: string;
  accountPanel: string;
  dropdown: string;
  divider: string;
  mutedText: string;
  secondaryText: string;
  inkText: string;
  logoMark: string;
  sectionTitle: string;
  sectionTitleLg: string;
  tabBarShell: string;
  successText: string;
  dangerText: string;
}

const v1ThemeClasses: ThemeClasses = {
  eyebrow: "text-xs font-semibold uppercase tracking-[0.14em] text-[#4940c6]",
  accentText: "text-[#4940c6]",
  accentTextHover: "text-[#4940c6] hover:text-white",
  accentBgSolid: "bg-[#4940c6]",
  accentBgMuted: "bg-[#4940c6]/75",
  accentBgSoft: "bg-[#4940c6]/15",
  accentBorder: "border-[#4940c6]/35",
  accentBorderMuted: "border-[#4940c6]/25",
  accentBorderStrong: "border-[#4940c6]/60",
  panelFlat: "rounded-2xl border border-[#4940c6]/20 bg-gradient-to-br from-[#181f45] via-[#121832] to-[#0e1428]",
  panelRaised: "rounded-2xl border border-[#4940c6]/15 bg-[#121832]",
  innerPanel:
    "rounded-2xl border border-[#4940c6]/14 bg-gradient-to-br from-[#221F45]/84 via-[#171A37]/88 to-[#0A0D18]/92 p-4",
  insightCard: "rounded-xl border border-white/15 bg-white/[0.03]",
  tabActive: "bg-[#4940c6] text-white",
  tabInactive: "text-[#A0AEC0] hover:text-white",
  filterActive: "bg-[#4940c6]/80 text-white",
  filterInactive: "text-[#A0AEC0] hover:text-white",
  rowInteractive:
    "rounded-xl border border-white/[0.06] bg-black/20 transition hover:border-[#4940c6]/35",
  rowSelected: "border-l-[#4940c6] bg-white/[0.06]",
  rowSelectedBorder: "border-[#4940c6]/60 bg-white/[0.05]",
  avatar: "bg-gradient-to-br from-[#3a32a0] to-[#4940c6] text-white",
  badge: "rounded-lg border border-[#4940c6]/25 bg-[#4940c6]/12 px-2 py-1 text-xs text-[#D8CEFF]",
  badgeText: "text-[#D8CEFF]",
  buttonPrimary: "rounded-lg bg-[#4940c6] px-3 py-2 text-xs font-semibold text-white hover:opacity-95",
  buttonSecondary:
    "rounded-lg border border-white/[0.14] bg-transparent px-3 py-2 text-xs font-medium text-white hover:bg-white/[0.06]",
  link: "text-[#4940c6] hover:text-white",
  progressPrimary: "bg-gradient-to-r from-[#4940c6] to-[#00D4FF]",
  progressSecondary: "bg-gradient-to-r from-[#00D4FF] to-[#4940c6]",
  focusBorder: "focus:border-[#4940c6]/60",
  workspaceActive: "bg-[#4940c6]/22 text-white ring-1 ring-[#4940c6]/40",
  workspaceInactive: "text-[#A0AEC0] hover:bg-white/[0.06] hover:text-white",
  accountAvatar:
    "bg-gradient-to-br from-[#2B2F45] to-[#151823] text-white ring-2 ring-[#4940c6]/40",
  accountPanel: "rounded-xl border border-white/[0.08] bg-black/35 p-3 backdrop-blur-md",
  dropdown:
    "rounded-xl border border-white/[0.1] bg-[#0c101c]/98 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl",
  divider: "border-white/[0.06]",
  mutedText: "text-[#718096]",
  secondaryText: "text-[#A0AEC0]",
  inkText: "text-white",
  logoMark: "bg-gradient-to-b from-[#4940c6] via-[#5b4ed4] to-[#00b8e6]",
  sectionTitle: "font-display text-lg font-bold text-white",
  sectionTitleLg: "font-display text-2xl font-bold text-white",
  tabBarShell: "inline-flex rounded-xl border border-white/[0.08] bg-[#111C44]/70 p-1",
  successText: "text-[#01B574]",
  dangerText: "text-[#EE5D50]",
};

const v2ThemeClasses: ThemeClasses = {
  eyebrow: "nos-section-eyebrow",
  accentText: "text-[var(--theme-primary)]",
  accentTextHover: "text-[var(--theme-primary)] hover:text-[var(--theme-ink)]",
  accentBgSolid: "bg-[var(--theme-primary)]",
  accentBgMuted: "bg-[var(--theme-primary)]",
  accentBgSoft: "bg-[var(--theme-primary-soft)]",
  accentBorder: "border-[var(--theme-primary)]",
  accentBorderMuted: "border-[var(--theme-hairline)]",
  accentBorderStrong: "border-[var(--theme-primary)]",
  panelFlat:
    "rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)]",
  panelRaised:
    "rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-raised)]",
  innerPanel:
    "rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-4",
  insightCard:
    "rounded-[8px] border-l-[3px] border-[var(--theme-primary)] bg-[var(--theme-canvas-raised)] border-y-0 border-r-0",
  tabActive: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  tabInactive: "text-[var(--theme-ink-secondary)] hover:text-[var(--theme-ink)]",
  filterActive: "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  filterInactive: "text-[var(--theme-ink-secondary)] hover:text-[var(--theme-ink)]",
  rowInteractive:
    "rounded-[8px] border border-[var(--theme-hairline)] bg-transparent transition hover:bg-[var(--theme-canvas-card)]",
  rowSelected: "border-l-[var(--theme-primary)] bg-[var(--theme-canvas-card)]",
  rowSelectedBorder:
    "border-[var(--theme-primary)] bg-[var(--theme-canvas-card)]",
  avatar: "bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]",
  badge:
    "rounded-full border border-[var(--theme-hairline)] bg-[var(--theme-canvas-overlay)] px-2 py-1 text-xs text-[var(--theme-ink-secondary)]",
  badgeText: "text-[var(--theme-ink-secondary)]",
  buttonPrimary:
    "rounded-[8px] bg-[var(--theme-primary)] px-3 py-2 text-[13px] font-medium text-white hover:bg-[var(--theme-primary-hover)]",
  buttonSecondary:
    "rounded-[8px] border border-[var(--theme-hairline-strong)] bg-transparent px-3 py-2 text-[13px] font-medium text-[var(--theme-ink)] hover:bg-[var(--theme-canvas-card)]",
  link: "text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)]",
  progressPrimary: "bg-[var(--theme-primary)]",
  progressSecondary: "bg-[var(--theme-mute)]",
  focusBorder: "focus:border-[var(--theme-primary)] focus:shadow-[0_0_0_2px_var(--theme-primary-soft)]",
  workspaceActive:
    "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)] ring-1 ring-[var(--theme-primary)]",
  workspaceInactive:
    "text-[var(--theme-ink-secondary)] hover:bg-[var(--theme-canvas-card)] hover:text-[var(--theme-ink)]",
  accountAvatar:
    "bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)] ring-1 ring-[var(--theme-hairline)]",
  accountPanel:
    "rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-3",
  dropdown:
    "rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-overlay)] p-1.5 shadow-none",
  divider: "border-[var(--theme-hairline)]",
  mutedText: "text-[var(--theme-mute)]",
  secondaryText: "text-[var(--theme-ink-secondary)]",
  inkText: "text-[var(--theme-ink)]",
  logoMark: "bg-[var(--theme-primary)]",
  sectionTitle: "font-display text-lg font-semibold text-[var(--theme-ink)]",
  sectionTitleLg: "font-display text-2xl font-semibold text-[var(--theme-ink)]",
  tabBarShell:
    "inline-flex rounded-[8px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-1",
  successText: "text-[var(--theme-success)]",
  dangerText: "text-[var(--theme-danger)]",
};

const v3ThemeClasses: ThemeClasses = {
  eyebrow: "nos-cubic-eyebrow",
  accentText: "text-[var(--theme-primary)]",
  accentTextHover: "text-[var(--theme-primary-hover)] hover:text-[var(--theme-primary)]",
  accentBgSolid: "bg-[var(--theme-primary)]",
  accentBgMuted: "bg-[var(--theme-primary)]",
  accentBgSoft: "bg-[var(--theme-primary-soft)]",
  accentBorder: "border-[var(--theme-primary)]",
  accentBorderMuted: "border-[var(--theme-hairline)]",
  accentBorderStrong: "border-[var(--theme-primary)]",
  panelFlat:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)]",
  panelRaised:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] shadow-[var(--theme-elevated-shadow)]",
  innerPanel:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-4",
  insightCard:
    "rounded-[14px] border border-[var(--theme-hairline)] border-l-[3px] border-l-[var(--theme-primary)] bg-[var(--theme-canvas-card)] p-4",
  tabActive: "rounded-lg bg-[var(--theme-primary)] text-white",
  tabInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink)]",
  filterActive: "rounded-lg bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  filterInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink-secondary)]",
  rowInteractive:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] transition hover:bg-[var(--theme-canvas-raised)]",
  rowSelected: "border-l-[var(--theme-primary)] bg-[var(--theme-canvas-raised)]",
  rowSelectedBorder:
    "border-[var(--theme-primary)] bg-[var(--theme-canvas-raised)]",
  avatar: "rounded-full bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]",
  badge:
    "rounded-lg bg-[var(--theme-canvas-overlay)] px-2.5 py-1 text-xs text-[var(--theme-ink-secondary)]",
  badgeText: "text-[var(--theme-ink-secondary)]",
  buttonPrimary: "nos-btn-cubic-primary",
  buttonSecondary: "nos-btn-cubic-secondary",
  link: "text-[var(--theme-link)] hover:text-[var(--theme-primary-hover)]",
  progressPrimary: "rounded-full bg-[var(--theme-signal-light)]",
  progressSecondary: "rounded-full bg-[var(--theme-canvas-overlay)]",
  focusBorder:
    "focus:border-[var(--theme-primary)] focus:shadow-[0_0_0_3px_rgba(123,97,255,0.2)]",
  workspaceActive:
    "bg-[var(--theme-primary-soft)] text-[var(--theme-primary)] ring-1 ring-[var(--theme-primary)]",
  workspaceInactive:
    "text-[var(--theme-mute)] hover:bg-[var(--theme-canvas-card)] hover:text-[var(--theme-ink)]",
  accountAvatar:
    "rounded-xl bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)] ring-1 ring-[var(--theme-hairline)]",
  accountPanel:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-4 shadow-[var(--theme-elevated-shadow)]",
  dropdown:
    "rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-2 shadow-[var(--theme-elevated-shadow)]",
  divider: "border-[var(--theme-hairline)]",
  mutedText: "text-[var(--theme-mute)]",
  secondaryText: "text-[var(--theme-ink-secondary)]",
  inkText: "text-[var(--theme-ink)]",
  logoMark: "bg-[var(--theme-primary)]",
  sectionTitle: "font-display text-lg font-semibold text-[var(--theme-ink)]",
  sectionTitleLg: "font-display text-2xl font-semibold text-[var(--theme-ink)]",
  tabBarShell:
    "inline-flex rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-1",
  successText: "text-[var(--theme-success)]",
  dangerText: "text-[var(--theme-danger)]",
};

const v4ThemeClasses: ThemeClasses = {
  eyebrow: "nos-vibrant-eyebrow",
  accentText: "text-[var(--theme-signal-light)]",
  accentTextHover: "text-[var(--theme-accent-yellow)] hover:text-[var(--theme-signal-light)]",
  accentBgSolid: "bg-[var(--theme-primary)]",
  accentBgMuted: "bg-[var(--theme-accent-teal)]",
  accentBgSoft: "bg-[var(--theme-primary-soft)]",
  accentBorder: "border-[var(--theme-accent-teal)]",
  accentBorderMuted: "border-[var(--theme-hairline)]",
  accentBorderStrong: "border-[var(--theme-accent-yellow)]",
  panelFlat:
    "rounded-[28px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)]",
  panelRaised:
    "rounded-[28px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] shadow-[var(--theme-elevated-shadow)]",
  innerPanel:
    "rounded-[24px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-4",
  insightCard:
    "rounded-[28px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-5 border-l-[4px] border-l-[var(--theme-accent-teal)]",
  tabActive: "rounded-[14px] bg-[var(--theme-primary)] text-[#111111]",
  tabInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink)]",
  filterActive: "rounded-[14px] bg-[var(--theme-primary-soft)] text-[var(--theme-accent-yellow)]",
  filterInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink-secondary)]",
  rowInteractive:
    "rounded-[24px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] transition hover:bg-[var(--theme-canvas-raised)]",
  rowSelected: "border-l-[var(--theme-accent-teal)] bg-[var(--theme-canvas-raised)]",
  rowSelectedBorder:
    "ring-2 ring-[var(--theme-accent-teal)] bg-[var(--theme-canvas-raised)]",
  avatar: "rounded-full bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]",
  badge:
    "rounded-xl bg-[var(--theme-canvas-overlay)] px-2.5 py-1 text-xs text-[var(--theme-ink-secondary)]",
  badgeText: "text-[var(--theme-ink-secondary)]",
  buttonPrimary: "nos-btn-vibrant-primary",
  buttonSecondary: "nos-btn-vibrant-secondary",
  link: "text-[var(--theme-link)] hover:text-[var(--theme-accent-yellow)]",
  progressPrimary: "rounded-full bg-gradient-to-r from-[#a855f7] to-[#4adeca]",
  progressSecondary: "rounded-full bg-[var(--theme-canvas-overlay)]",
  focusBorder:
    "focus:border-[var(--theme-accent-teal)] focus:shadow-[0_0_0_3px_rgba(74,222,202,0.2)]",
  workspaceActive:
    "bg-[var(--theme-primary-soft)] text-[var(--theme-accent-yellow)] ring-1 ring-[var(--theme-accent-yellow)]",
  workspaceInactive:
    "text-[var(--theme-mute)] hover:bg-[var(--theme-canvas-card)] hover:text-[var(--theme-ink)]",
  accountAvatar:
    "rounded-full bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)] ring-1 ring-[var(--theme-hairline)]",
  accountPanel:
    "rounded-[24px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-4 shadow-[var(--theme-elevated-shadow)]",
  dropdown:
    "rounded-[20px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-2 shadow-[var(--theme-elevated-shadow)]",
  divider: "border-[var(--theme-hairline)]",
  mutedText: "text-[var(--theme-mute)]",
  secondaryText: "text-[var(--theme-ink-secondary)]",
  inkText: "text-[var(--theme-ink)]",
  logoMark: "bg-[var(--theme-accent-teal)]",
  sectionTitle: "font-display text-lg font-semibold text-[var(--theme-ink)]",
  sectionTitleLg: "font-display text-2xl font-bold text-[var(--theme-ink)]",
  tabBarShell:
    "inline-flex rounded-[16px] bg-[var(--theme-canvas-overlay)] p-1",
  successText: "text-[var(--theme-success)]",
  dangerText: "text-[var(--theme-danger)]",
};

const v5ThemeClasses: ThemeClasses = {
  eyebrow: "nos-mboard-eyebrow",
  accentText: "text-[var(--theme-primary)]",
  accentTextHover: "text-[var(--theme-primary-hover)] hover:text-[var(--theme-primary)]",
  accentBgSolid: "bg-[var(--theme-primary)]",
  accentBgMuted: "bg-[var(--theme-primary-soft)]",
  accentBgSoft: "bg-[var(--theme-primary-soft)]",
  accentBorder: "border-[var(--theme-primary)]",
  accentBorderMuted: "border-[var(--theme-hairline)]",
  accentBorderStrong: "border-[var(--theme-primary)]",
  panelFlat: "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] shadow-[var(--theme-card-shadow)]",
  panelRaised:
    "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] shadow-[var(--theme-elevated-shadow)]",
  innerPanel:
    "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-soft)] p-4",
  insightCard:
    "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-5 shadow-[var(--theme-card-shadow)] border-l-[4px] border-l-[var(--theme-primary)]",
  tabActive: "rounded-lg bg-[var(--theme-primary)] text-white",
  tabInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink)]",
  filterActive: "rounded-lg bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]",
  filterInactive: "text-[var(--theme-mute)] hover:text-[var(--theme-ink-secondary)]",
  rowInteractive:
    "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] transition hover:shadow-[var(--theme-card-shadow)]",
  rowSelected: "border-l-[var(--theme-primary)] bg-[var(--theme-canvas-soft)]",
  rowSelectedBorder: "ring-2 ring-[var(--theme-primary-soft)] bg-[var(--theme-canvas-soft)]",
  avatar: "rounded-full bg-[var(--theme-canvas-overlay)] text-[var(--theme-ink)]",
  badge:
    "rounded-lg bg-[var(--theme-canvas-soft)] px-2.5 py-1 text-xs text-[var(--theme-ink-secondary)]",
  badgeText: "text-[var(--theme-ink-secondary)]",
  buttonPrimary: "nos-btn-mboard-primary",
  buttonSecondary: "nos-btn-mboard-secondary",
  link: "text-[var(--theme-primary)] hover:text-[var(--theme-primary-hover)]",
  progressPrimary: "rounded-full bg-[var(--theme-primary)]",
  progressSecondary: "rounded-full bg-[var(--theme-canvas-overlay)]",
  focusBorder:
    "focus:border-[var(--theme-primary)] focus:shadow-[0_0_0_3px_rgba(255,159,41,0.2)]",
  workspaceActive:
    "bg-white/10 text-white ring-1 ring-white/20",
  workspaceInactive:
    "text-[#8B92B3] hover:bg-white/[0.06] hover:text-white",
  accountAvatar:
    "rounded-xl bg-white/10 text-white ring-1 ring-white/15",
  accountPanel:
    "rounded-2xl border border-white/10 bg-[#232547] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.25)]",
  dropdown:
    "rounded-2xl border border-white/10 bg-[#232547] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.25)]",
  divider: "border-white/10",
  mutedText: "text-[var(--theme-mute)]",
  secondaryText: "text-[var(--theme-ink-secondary)]",
  inkText: "text-[var(--theme-ink)]",
  logoMark: "bg-[var(--theme-primary)]",
  sectionTitle: "font-display text-lg font-bold text-[var(--theme-ink)]",
  sectionTitleLg: "font-display text-2xl font-bold text-[var(--theme-ink)]",
  tabBarShell:
    "inline-flex rounded-xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-1 shadow-[var(--theme-card-shadow)]",
  successText: "text-[var(--theme-success)]",
  dangerText: "text-[var(--theme-danger)]",
};

export function getThemeClasses(version: ThemeVersion): ThemeClasses {
  if (version === "v2") return v2ThemeClasses;
  if (version === "v3") return v3ThemeClasses;
  if (version === "v4") return v4ThemeClasses;
  if (version === "v5") return v5ThemeClasses;
  return v1ThemeClasses;
}

export function useThemeClasses() {
  const { version } = useTheme();
  return getThemeClasses(version);
}

/** Channel-specific insight strip */
export function insightAccentClass(channel: string, version: ThemeVersion): string {
  if (version === "v2") {
    return getThemeClasses("v2").insightCard;
  }
  if (version === "v3") {
    return getThemeClasses("v3").insightCard;
  }
  if (version === "v4") {
    return getThemeClasses("v4").insightCard;
  }
  if (version === "v5") {
    return getThemeClasses("v5").insightCard;
  }
  if (channel === "Website") return "from-[#00D4FF]/18 border-[#00D4FF]/35";
  if (channel === "LinkedIn") return "from-[#4940c6]/18 border-[#4940c6]/35";
  if (channel === "Email") return "from-[#EE8A50]/14 border-[#EE8A50]/32";
  if (channel === "Content") return "from-[#01B574]/16 border-[#01B574]/32";
  return "from-[#CBD5FF]/10 border-white/15";
}

export function isEmberTheme(version: ThemeVersion): boolean {
  return version === "v2";
}

export function isMboardTheme(version: ThemeVersion): boolean {
  return version === "v5";
}

export function isVibrantTheme(version: ThemeVersion): boolean {
  return version === "v4";
}

export function isCubicTheme(version: ThemeVersion): boolean {
  return version === "v3";
}

/** @deprecated Use isCubicTheme — v3 is now CUBIC Deep Tech Dark */
export function isEditorialTheme(version: ThemeVersion): boolean {
  return version === "v3";
}

export function usesDesignTokens(version: ThemeVersion): boolean {
  return version === "v2" || version === "v3" || version === "v4" || version === "v5";
}
