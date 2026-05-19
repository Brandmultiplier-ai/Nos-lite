import { CardInfoTip } from "@/components/ui/CardInfoTip";
import { orangeStatCardClassName } from "@/components/ui/statCardStyles";

interface SimpleStatCardProps {
  label: string;
  value: string;
  info?: string;
  className?: string;
}

export function SimpleStatCard({ label, value, info, className = "" }: SimpleStatCardProps) {
  return (
    <div className={`${orangeStatCardClassName} ${className}`.trim()}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.1em] text-white/90">
          {label}
        </p>
        {info?.trim() ? <CardInfoTip subject={label} text={info} className="text-white/80" /> : null}
      </div>
      <p className="mt-2 font-display text-[30px] font-bold leading-none text-white">{value}</p>
    </div>
  );
}
