"use client";

export const axisStyle = { fill: "#A0AEC0", fontSize: 11 };

/** @deprecated Use useChartTheme() in client components for version-aware charts. */
export const chartColors = {
  primary: "#5b4ed4",
  primaryDark: "#4940c6",
  accent: "#f36901",
  accentBright: "#ff7a1a",
  teal: "#00D4FF",
  green: "#01B574",
  red: "#EE5D50",
};

/** @deprecated Use useChartTheme() in client components for version-aware charts. */
export const tooltipContentStyle = {
  background: "rgba(12, 10, 28, 0.96)",
  border: "1px solid rgba(91, 78, 212, 0.35)",
  borderRadius: 14,
  color: "#fff",
  boxShadow: "0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(243, 105, 1, 0.08)",
};

/** @deprecated Use useChartTheme() in client components for version-aware charts. */
export const chartGridStroke = "rgba(255,255,255,0.045)";

export { useChartTheme } from "@/theme/ThemeProvider";
