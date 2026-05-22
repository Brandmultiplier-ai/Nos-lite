"use client";

import { useMemo, useState } from "react";
import type { CompetitivePositioningData } from "@/types/nos";
import { GlassCard } from "@/components/ui/GlassCard";
import { useChartTheme } from "@/components/charts/chartTheme";
import { usesDesignTokens, useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";

const PAD = 48;
const SIZE = 320;

export function CompetitiveQuadrantChart({ data }: { data: CompetitivePositioningData }) {
  const [idx, setIdx] = useState(data.snapshots.length - 1);
  const snap = data.snapshots[idx] ?? data.snapshots[0];
  const { version } = useTheme();
  const tc = useThemeClasses();
  const themed = usesDesignTokens(version);
  const { chartColors } = useChartTheme();

  const points = useMemo(() => {
    return snap.competitors.map((c) => ({
      ...c,
      px: PAD + (c.x / 100) * (SIZE - PAD * 2),
      py: SIZE - PAD - (c.y / 100) * (SIZE - PAD * 2),
    }));
  }, [snap]);

  const gridStroke = themed ? "var(--theme-hairline)" : "rgba(255,255,255,0.12)";
  const labelFill = themed ? "#696969" : "#718096";
  const nameFill = themed ? "#141413" : "#fff";

  return (
    <GlassCard padding="lg" className={themed ? "" : "border-white/[0.08]"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className={themed ? tc.sectionTitle : "font-display text-lg font-bold text-white"}>
            Competitive quadrant
          </h3>
          <p className={`mt-1 text-xs ${themed ? tc.secondaryText : "text-[#A0AEC0]"}`}>
            {data.axisXLabel} × {data.axisYLabel}
          </p>
        </div>
        <div className={themed ? tc.tabBarShell : "flex gap-1 rounded-lg border border-white/10 bg-black/30 p-1"}>
          {data.snapshots.map((s, i) => (
            <button
              key={s.period}
              type="button"
              onClick={() => setIdx(i)}
              className={`px-3 py-1 text-xs font-semibold transition ${
                i === idx ? tc.tabActive : tc.tabInactive
              } ${themed ? "" : "rounded-md"}`}
            >
              {s.period}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto mt-4 w-full max-w-[420px]"
        role="img"
        aria-label={`Competitive positioning for ${snap.period}`}
      >
        <defs>
          <linearGradient id="quadBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={chartColors.primaryDark} stopOpacity="0.12" />
            <stop offset="100%" stopColor={chartColors.accent} stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect x={PAD} y={PAD} width={SIZE - PAD * 2} height={SIZE - PAD * 2} fill="url(#quadBg)" rx="8" />
        <line x1={SIZE / 2} y1={PAD} x2={SIZE / 2} y2={SIZE - PAD} stroke={gridStroke} />
        <line x1={PAD} y1={SIZE / 2} x2={SIZE - PAD} y2={SIZE / 2} stroke={gridStroke} />
        <text x={SIZE - PAD - 4} y={PAD + 14} textAnchor="end" fill={labelFill} fontSize="9">
          {data.quadrantLabels.q1}
        </text>
        <text x={PAD + 4} y={PAD + 14} fill={labelFill} fontSize="9">
          {data.quadrantLabels.q2}
        </text>
        <text x={PAD + 4} y={SIZE - PAD - 6} fill={labelFill} fontSize="9">
          {data.quadrantLabels.q3}
        </text>
        <text x={SIZE - PAD - 4} y={SIZE - PAD - 6} textAnchor="end" fill={labelFill} fontSize="9">
          {data.quadrantLabels.q4}
        </text>
        {points.map((p) => (
          <g key={p.id}>
            <circle
              cx={p.px}
              cy={p.py}
              r={p.isSelf ? 9 : 7}
              fill={p.isSelf ? chartColors.accent : chartColors.primaryDark}
              stroke={p.isSelf ? chartColors.accentBright : chartColors.teal}
              strokeWidth={2}
              opacity={0.95}
            />
            <text x={p.px} y={p.py - 12} textAnchor="middle" fill={nameFill} fontSize="9" fontWeight="600">
              {p.name}
            </text>
          </g>
        ))}
      </svg>

      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {data.movementHighlights.map((m) => (
          <li
            key={m.competitor}
            className={
              themed
                ? `${tc.innerPanel} px-3 py-2 text-xs`
                : "rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2 text-xs"
            }
          >
            <span className={`font-semibold ${themed ? tc.inkText : "text-white"}`}>{m.competitor}</span>
            <span
              className={`ml-2 font-medium ${
                m.direction === "up" ? tc.successText : m.direction === "down" ? tc.dangerText : tc.secondaryText
              }`}
            >
              {m.delta}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
