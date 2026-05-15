import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { GlassCard } from "@/components/ui/GlassCard";

interface SimpleStatCardProps {
  label: string;
  value: string;
  /** Shown next to label; appears on hover/focus of the info control. */
  info?: string;
  className?: string;
}

export function SimpleStatCard({ label, value, info, className = "" }: SimpleStatCardProps) {
  return (
    <GlassCard padding="md" className={`min-h-[110px] ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#A0AEC0]">
          {label}
        </p>
        {info?.trim() ? <CardInfoTip subject={label} text={info} /> : null}
      </div>
      <p className="mt-2 font-display text-[30px] font-bold leading-none text-white">{value}</p>
    </GlassCard>
  );
}
