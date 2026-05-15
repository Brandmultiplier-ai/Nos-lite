import { GlassCard } from "@/components/ui/GlassCard";

interface SimpleStatCardProps {
  label: string;
  value: string;
  className?: string;
}

export function SimpleStatCard({ label, value, className = "" }: SimpleStatCardProps) {
  return (
    <GlassCard padding="md" className={`min-h-[110px] ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A0AEC0]">{label}</p>
      <p className="mt-2 font-display text-[30px] font-bold leading-none text-white">{value}</p>
    </GlassCard>
  );
}
