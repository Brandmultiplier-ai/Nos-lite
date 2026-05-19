import { CardInfoTip } from "@/components/ui/CardInfoTip";
import type { KpiStat } from "@/types/nos";
import type { IconType } from "react-icons";
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { orangeStatCardClassName } from "@/components/ui/statCardStyles";

const iconMap: Record<KpiStat["iconColor"], { Icon: IconType }> = {
  purple: { Icon: HiOutlineLightningBolt },
  teal: { Icon: HiOutlineUserGroup },
  blue: { Icon: HiOutlineMail },
  green: { Icon: HiOutlineChartBar },
};

interface StatCardProps {
  stat: KpiStat;
  info?: string;
}

export function StatCard({ stat, info }: StatCardProps) {
  const { Icon } = iconMap[stat.iconColor];
  const positive = stat.change >= 0;

  return (
    <div className={orangeStatCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.1em] text-white/90">
              {stat.label}
            </p>
            {info?.trim() ? (
              <CardInfoTip subject={stat.label} text={info} className="text-white/80" />
            ) : null}
          </div>
          <p className="mt-2 font-display text-[30px] font-bold leading-none text-white">{stat.value}</p>
          <p
            className={`mt-2 inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${
              positive ? "bg-white/20 text-white" : "bg-black/20 text-white"
            }`}
          >
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
