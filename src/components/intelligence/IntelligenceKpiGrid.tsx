"use client";

import type { IntelligenceKpi } from "@/types/nos";
import { useTheme } from "@/theme/ThemeProvider";

export function IntelligenceKpiGrid({ kpis }: { kpis: IntelligenceKpi[] }) {
  const { theme } = useTheme();
  const isMboard = theme.metricCardStyle === "mboard";
  const usesTokens = theme.metricCardStyle !== "gradient";

  return (
    <div
      className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-4 ${
        theme.metricCardStyle === "cubic" ||
        theme.metricCardStyle === "vibrant" ||
        theme.metricCardStyle === "mboard" ||
        theme.metricCardStyle === "brand" ||
        theme.metricCardStyle === "editorial"
          ? "gap-4"
          : ""
      }`}
    >
      {kpis.map((kpi, index) => {
        const positive = kpi.change >= 0;
        const featured = isMboard && index === 0;
        const cardClass = featured ? theme.statCardFeaturedClassName : theme.statCardClassName;
        const valueClass = theme.statValueClassName;

        if (isMboard) {
          return (
            <div key={kpi.label} className={cardClass}>
              <p className={theme.statLabelClassName}>{kpi.label}</p>
              <p className={`${valueClass} mt-1`}>{kpi.value}</p>
              <p className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
                {positive ? "+" : ""}
                {kpi.change}% vs prior period
              </p>
              <p className={theme.statContextClassName}>{kpi.context}</p>
            </div>
          );
        }

        const tokenFeatured = usesTokens && index === 0;
        const featuredCardClass = tokenFeatured ? theme.statCardFeaturedClassName : cardClass;
        const featuredValueClass = tokenFeatured ? theme.statValueFeaturedClassName : valueClass;

        return (
          <div key={kpi.label} className={featuredCardClass}>
            <p className={theme.statLabelClassName}>{kpi.label}</p>
            <p className={featuredValueClass}>{kpi.value}</p>
            <p className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
              {positive ? "+" : ""}
              {kpi.change}% vs prior period
            </p>
            <p className={theme.statContextClassName}>{kpi.context}</p>
          </div>
        );
      })}
    </div>
  );
}
