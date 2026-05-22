"use client";

import { HiOutlineBeaker } from "react-icons/hi";
import { isBrandTheme, isCubicTheme, isMboardTheme, isVibrantTheme, usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

export function IntelligenceMethodBanner({ note }: { note: string }) {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);

  if (isBrandTheme(version)) {
    return (
      <div className="flex gap-3 rounded-[2px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] p-6">
        <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-primary)]" aria-hidden />
        <p className={`text-sm font-light leading-5 ${tc.secondaryText}`}>
          <span className={`font-bold ${tc.inkText}`}>Method: </span>
          {note}
        </p>
      </div>
    );
  }

  if (isMboardTheme(version)) {
    return (
      <div className="flex gap-3 rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-4 py-3 shadow-[var(--theme-card-shadow)]">
        <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-primary)]" aria-hidden />
        <p className={`text-xs leading-relaxed ${tc.secondaryText}`}>
          <span className={`font-semibold ${tc.inkText}`}>Method: </span>
          {note}
        </p>
      </div>
    );
  }

  if (isVibrantTheme(version)) {
    return (
      <div className="flex gap-3 rounded-[28px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-4 py-3">
        <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-accent-teal)]" aria-hidden />
        <p className={`text-xs leading-relaxed ${tc.secondaryText}`}>
          <span className={`font-semibold ${tc.inkText}`}>Method: </span>
          {note}
        </p>
      </div>
    );
  }

  if (isCubicTheme(version)) {
    return (
      <div className="flex gap-3 rounded-[14px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-4 py-3">
        <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-primary)]" aria-hidden />
        <p className={`text-xs leading-relaxed ${tc.secondaryText}`}>
          <span className={`font-semibold ${tc.inkText}`}>Method: </span>
          {note}
        </p>
      </div>
    );
  }

  if (themed) {
    return (
      <div className={`flex gap-3 rounded-[10px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-4 py-3`}>
        <HiOutlineBeaker className={`mt-0.5 h-5 w-5 shrink-0 ${tc.accentText}`} aria-hidden />
        <p className={`text-xs leading-relaxed ${tc.secondaryText}`}>
          <span className={`font-semibold ${tc.inkText}`}>Method: </span>
          {note}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 rounded-xl border border-[#4940c6]/25 bg-[#121832] px-4 py-3">
      <HiOutlineBeaker className="mt-0.5 h-5 w-5 shrink-0 text-[#f36901]" aria-hidden />
      <p className="text-xs leading-relaxed text-[#A0AEC0]">
        <span className="font-semibold text-white">Method: </span>
        {note}
      </p>
    </div>
  );
}
