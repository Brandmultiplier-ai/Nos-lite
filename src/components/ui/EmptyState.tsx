"use client";

import { usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

export function EmptyState({ message }: { message: string }) {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);

  if (themed && (version === "v3" || version === "v4" || version === "v5")) {
    return (
      <p
        className={`${
          version === "v5"
            ? "rounded-2xl border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] shadow-[var(--theme-card-shadow)]"
            : version === "v4"
              ? "rounded-[28px] border border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)]"
              : "rounded-[14px] border border-dashed border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)]"
        } px-4 py-8 text-center text-sm ${tc.secondaryText}`}
      >
        {message}
      </p>
    );
  }

  if (themed) {
    return (
      <p
        className={`rounded-[10px] border border-dashed border-[var(--theme-hairline)] bg-[var(--theme-canvas-card)] px-4 py-8 text-center text-sm ${tc.secondaryText}`}
      >
        {message}
      </p>
    );
  }

  return (
    <p className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-4 py-8 text-center text-sm text-[#A0AEC0]">
      {message}
    </p>
  );
}
