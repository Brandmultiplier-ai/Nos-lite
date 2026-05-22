"use client";

import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { useTheme } from "@/theme/ThemeProvider";

interface SimpleStatCardProps {
  label: string;
  value: string;
  info?: string;
  context?: string;
  className?: string;
  featured?: boolean;
}

export function SimpleStatCard({
  label,
  value,
  info,
  context,
  className = "",
  featured = false,
}: SimpleStatCardProps) {
  const { theme } = useTheme();
  const cardClass = featured ? theme.statCardFeaturedClassName : theme.statCardClassName;
  const isMboard = theme.metricCardStyle === "mboard";
  const tipClass =
    theme.metricCardStyle === "gradient"
      ? "text-white/80"
      : isMboard
        ? "text-[var(--theme-ink-secondary)] hover:text-[var(--theme-ink)]"
        : "text-[var(--theme-mute)]";

  return (
    <div className={`${cardClass} ${className}`.trim()}>
      <div className="flex items-start justify-between gap-2">
        <p className={`min-w-0 flex-1 ${theme.statLabelClassName}`}>{label}</p>
        {info?.trim() ? <CardInfoTip subject={label} text={info} className={tipClass} /> : null}
      </div>
      <p className={`${theme.statValueClassName}${isMboard ? " mt-1" : ""}`}>{value}</p>
      {context?.trim() ? <p className={theme.statContextClassName}>{context}</p> : null}
    </div>
  );
}
