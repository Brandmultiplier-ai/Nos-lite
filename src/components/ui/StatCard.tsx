"use client";

import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { useTheme } from "@/theme/ThemeProvider";
import type { KpiStat } from "@/types/nos";
import type { IconType } from "react-icons";
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlineUserGroup,
} from "react-icons/hi";

const iconMap: Record<KpiStat["iconColor"], { Icon: IconType }> = {
  purple: { Icon: HiOutlineLightningBolt },
  teal: { Icon: HiOutlineUserGroup },
  blue: { Icon: HiOutlineMail },
  green: { Icon: HiOutlineChartBar },
};

const cubicIconBg: Record<KpiStat["iconColor"], string> = {
  purple: "bg-[rgba(123,97,255,0.18)] text-[#7B61FF]",
  teal: "bg-[rgba(0,194,255,0.15)] text-[#00C2FF]",
  blue: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA]",
  green: "bg-[rgba(74,222,128,0.15)] text-[#4ADE80]",
};

const vibrantAccent: Record<
  KpiStat["iconColor"],
  { iconBg: string; iconText: string; link: string }
> = {
  purple: {
    iconBg: "bg-[#4adeca]",
    iconText: "text-[#111111]",
    link: "text-[#4adeca]",
  },
  teal: {
    iconBg: "bg-[#fb923c]",
    iconText: "text-[#111111]",
    link: "text-[#fb923c]",
  },
  blue: {
    iconBg: "bg-[#f472b6]",
    iconText: "text-[#111111]",
    link: "text-[#f472b6]",
  },
  green: {
    iconBg: "bg-[#a855f7]",
    iconText: "text-[#ffffff]",
    link: "text-[#a855f7]",
  },
};

const mboardIcon: Record<KpiStat["iconColor"], { bg: string; text: string }> = {
  purple: { bg: "bg-[#EEF4FF]", text: "text-[#5B8DEF]" },
  teal: { bg: "bg-[#FFF0F0]", text: "text-[#FF6B6B]" },
  blue: { bg: "bg-[#F3EEFF]", text: "text-[#9B88FF]" },
  green: { bg: "bg-[#FFF4E6]", text: "text-[#FF9F29]" },
};

const brandIconAccent: Record<
  KpiStat["iconColor"],
  { iconBg: string; iconText: string; link: string }
> = {
  purple: {
    iconBg: "bg-[#4940C6]",
    iconText: "text-white",
    link: "text-[#4940C6]",
  },
  teal: {
    iconBg: "bg-[#0EA5E9]",
    iconText: "text-white",
    link: "text-[#0EA5E9]",
  },
  blue: {
    iconBg: "bg-[#6366F1]",
    iconText: "text-white",
    link: "text-[#6366F1]",
  },
  green: {
    iconBg: "bg-[#F36901]",
    iconText: "text-white",
    link: "text-[#F36901]",
  },
};

interface StatCardProps {
  stat: KpiStat;
  info?: string;
  featured?: boolean;
}

export function StatCard({ stat, info, featured = false }: StatCardProps) {
  const { theme } = useTheme();
  const { Icon } = iconMap[stat.iconColor];
  const positive = stat.change >= 0;
  const cardClass = featured ? theme.statCardFeaturedClassName : theme.statCardClassName;
  const valueClass = featured ? theme.statValueFeaturedClassName : theme.statValueClassName;

  if (theme.metricCardStyle === "brand") {
    const accent = brandIconAccent[stat.iconColor];
    return (
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent.iconBg} ${accent.iconText}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            {info?.trim() ? (
              <CardInfoTip subject={stat.label} text={info} className="text-[var(--theme-mute)]" />
            ) : null}
          </div>
          <div>
            <p className={theme.statLabelClassName}>{stat.label}</p>
            <p className={valueClass}>{stat.value}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className={`text-base font-normal ${accent.link}`}>View all</span>
              <span className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
                {positive ? "+" : ""}
                {stat.change}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme.metricCardStyle === "mboard") {
    const icon = mboardIcon[stat.iconColor];
    return (
      <div className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={valueClass}>{stat.value}</p>
            <p className={theme.statLabelClassName}>{stat.label}</p>
            <p className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
              {positive ? "↑" : "↓"} {positive ? "+" : ""}
              {stat.change}% <span className="font-normal text-[var(--theme-mute)]">this period</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${icon.bg} ${icon.text}`}>
              <Icon className="h-5 w-5" />
            </div>
            {info?.trim() ? (
              <CardInfoTip subject={stat.label} text={info} className="text-[var(--theme-mute)]" />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (theme.metricCardStyle === "vibrant") {
    const accent = vibrantAccent[stat.iconColor];
    return (
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accent.iconBg} ${accent.iconText}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            {info?.trim() ? (
              <CardInfoTip subject={stat.label} text={info} className="text-[var(--theme-mute)]" />
            ) : null}
          </div>
          <div>
            <p className={theme.statLabelClassName}>{stat.label}</p>
            <p className={valueClass}>{stat.value}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold ${accent.link}`}>View all</span>
              <span className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
                {positive ? "+" : ""}
                {stat.change}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme.metricCardStyle === "cubic") {
    return (
      <div className={cardClass}>
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${cubicIconBg[stat.iconColor]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className={`min-w-0 flex-1 ${theme.statLabelClassName}`}>{stat.label}</p>
              {info?.trim() ? (
                <CardInfoTip subject={stat.label} text={info} className="text-[var(--theme-mute)]" />
              ) : null}
            </div>
            <p className={valueClass}>{stat.value}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[var(--theme-link)]">View all</span>
              <span className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
                {positive ? "+" : ""}
                {stat.change}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme.metricCardStyle === "flat" || theme.metricCardStyle === "editorial") {
    return (
      <div className={cardClass}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className={`min-w-0 flex-1 ${theme.statLabelClassName}`}>{stat.label}</p>
              {info?.trim() ? (
                <CardInfoTip subject={stat.label} text={info} className="text-[var(--theme-mute)]" />
              ) : null}
            </div>
            <p className={valueClass}>{stat.value}</p>
            <p className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
              {positive ? "+" : ""}
              {stat.change}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className={`min-w-0 flex-1 ${theme.statLabelClassName}`}>{stat.label}</p>
            {info?.trim() ? (
              <CardInfoTip subject={stat.label} text={info} className="text-white/80" />
            ) : null}
          </div>
          <p className={theme.statValueClassName}>{stat.value}</p>
          <p className={positive ? theme.statDeltaPositiveClassName : theme.statDeltaNegativeClassName}>
            {positive ? "+" : ""}
            {stat.change}%
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white shadow-[0_6px_14px_rgba(0,0,0,0.15)]">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
