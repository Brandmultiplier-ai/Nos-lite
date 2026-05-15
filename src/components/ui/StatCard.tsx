import { GlassCard } from "@/components/ui/GlassCard";
import type { KpiStat } from "@/types/nos";
import type { IconType } from "react-icons";
import {
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineMail,
  HiOutlineUserGroup,
} from "react-icons/hi";

const iconMap: Record<KpiStat["iconColor"], { Icon: IconType; bg: string }> = {
  purple: { Icon: HiOutlineLightningBolt, bg: "bg-[#4940c6]" },
  teal: { Icon: HiOutlineUserGroup, bg: "bg-[#00D4FF]" },
  blue: { Icon: HiOutlineMail, bg: "bg-[#3a32a0]" },
  green: { Icon: HiOutlineChartBar, bg: "bg-[#01B574]" },
};

interface StatCardProps {
  stat: KpiStat;
}

export function StatCard({ stat }: StatCardProps) {
  const { Icon, bg } = iconMap[stat.iconColor];
  const positive = stat.change >= 0;

  return (
    <GlassCard padding="md" className="min-h-[110px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A0AEC0]">
            {stat.label}
          </p>
          <p className="mt-2 font-display text-[30px] font-bold leading-none text-white">
            {stat.value}
          </p>
          <p
            className={`mt-2 inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${positive ? "bg-[#01B574]/15 text-[#01B574]" : "bg-[#EE5D50]/15 text-[#EE5D50]"}`}
          >
            {positive ? "+" : ""}
            {stat.change}%
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 shadow-[0_8px_18px_rgba(0,0,0,0.3)] ${bg}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
