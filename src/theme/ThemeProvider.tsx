"use client";

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import type { ThemeVersion } from "@/routing/versionRoutes";
import { getVersionTheme, type VersionTheme } from "@/theme/versionThemes";

interface ThemeContextValue {
  version: ThemeVersion;
  theme: VersionTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  version,
  children,
}: {
  version: ThemeVersion;
  children: ReactNode;
}) {
  const theme = useMemo(() => getVersionTheme(version), [version]);

  const style = theme.cssVars as CSSProperties;

  return (
    <ThemeContext.Provider value={{ version, theme }}>
      <div
        className="nos-theme-root min-h-full"
        style={style}
        data-theme-version={version}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

export function useChartTheme() {
  const { theme, version } = useTheme();
  const charts = theme.charts;

  return useMemo(
    () => ({
      chartColors: {
        primary: charts.primary,
        primaryDark: charts.primaryDark,
        accent: charts.accent,
        accentBright: charts.accentBright,
        teal: charts.teal,
        green: charts.green,
        red: charts.red,
      },
      chartBarPalette: charts.barPalette,
      chartChannelColors: charts.channelColors,
      chartBarRadius: (version === "v4"
        ? [12, 12, 12, 12]
        : version === "v5"
          ? [6, 6, 6, 6]
          : version === "v6"
            ? [2, 2, 2, 2]
            : [8, 8, 0, 0]) as [number, number, number, number],
      isNeonCharts: version === "v4",
      isMboardCharts: version === "v5",
      isBrandCharts: version === "v6",
      chartGridStroke: charts.gridStroke,
      axisStyle: {
        fill: charts.axisFill,
        fontSize: 11,
        ...(version === "v2"
          ? { fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace" }
          : {}),
      },
      tooltipContentStyle: {
        background: charts.tooltipBackground,
        border: `1px solid ${charts.tooltipBorder}`,
        borderRadius:
          version === "v2" ? 10 : version === "v3" ? 12 : version === "v4" ? 12 : version === "v5" ? 12 : version === "v6" ? 2 : 14,
        color:
          version === "v5"
            ? "#1A1C3D"
            : version === "v4" || version === "v6"
              ? "#ffffff"
              : version === "v3"
                ? "#fff"
                : "#fff",
        boxShadow: charts.tooltipShadow,
      },
    }),
    [charts, version],
  );
}
