"use client";

import type { ReactNode } from "react";
import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { isMboardTheme, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

export function MboardDeltaPill({
  value,
  suffix = "vs prior period",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const positive = value >= 0;
  return (
    <span className={`${positive ? "nos-mboard-delta-positive" : "nos-mboard-delta-negative"} ${className}`}>
      {positive ? "+" : ""}
      {value}%{suffix ? ` ${suffix}` : ""}
    </span>
  );
}

const intentStyles: Record<string, string> = {
  commercial: "nos-mboard-intent nos-mboard-intent-commercial",
  informational: "nos-mboard-intent nos-mboard-intent-informational",
  navigational: "nos-mboard-intent nos-mboard-intent-navigational",
};

export function MboardIntentBadge({ intent }: { intent: string }) {
  return <span className={intentStyles[intent] ?? "nos-mboard-intent"}>{intent}</span>;
}

export function MboardMetricMeter({
  value,
  max = 100,
  tone = "navy",
  showValue = true,
}: {
  value: number;
  max?: number;
  tone?: "navy" | "orange" | "blue";
  showValue?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex min-w-[88px] items-center gap-2">
      <div className="nos-mboard-meter min-w-[52px] flex-1">
        <div className={`nos-mboard-meter-fill nos-mboard-meter-fill-${tone}`} style={{ width: `${pct}%` }} />
      </div>
      {showValue ? <span className="nos-mboard-meter-value">{value}%</span> : null}
    </div>
  );
}

export function MboardChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string; dashed?: boolean }>;
}) {
  return (
    <div className="nos-mboard-chart-legend">
      {items.map((item) => (
        <span key={item.label} className="nos-mboard-chart-legend-item">
          <span
            className={`nos-mboard-chart-legend-swatch${item.dashed ? " nos-mboard-chart-legend-swatch-dashed" : ""}`}
            style={{ backgroundColor: item.dashed ? "transparent" : item.color, borderColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function IntelligencePanelHeader({
  title,
  eyebrow,
  hint,
}: {
  title: string;
  eyebrow?: string;
  hint?: string;
}) {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const isMboard = isMboardTheme(version);

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        {isMboard && eyebrow ? <p className="nos-mboard-chart-eyebrow">{eyebrow}</p> : null}
        <h3 className={isMboard ? "nos-mboard-chart-title" : tc.sectionTitle}>{title}</h3>
      </div>
      {hint?.trim() ? <CardInfoTip subject={title} text={hint} /> : null}
    </div>
  );
}

export function MboardChartFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`nos-mboard-chart-frame ${className}`}>{children}</div>;
}

export function MboardGeoCard({
  region,
  visibility,
  delta,
}: {
  region: string;
  visibility: number;
  delta: number;
}) {
  return (
    <li className="nos-mboard-geo-card">
      <p className="nos-mboard-geo-label">{region}</p>
      <p className="nos-mboard-geo-value">{visibility}%</p>
      <div className="nos-mboard-meter mt-3">
        <div className="nos-mboard-meter-fill nos-mboard-meter-fill-navy" style={{ width: `${visibility}%` }} />
      </div>
      <MboardDeltaPill value={delta} suffix="vs prior" className="mt-3" />
    </li>
  );
}
