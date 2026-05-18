import type { IntelligenceKpi } from "@/types/nos";
import { GlassCard } from "@/components/ui/GlassCard";

export function IntelligenceKpiGrid({ kpis }: { kpis: IntelligenceKpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const positive = kpi.change >= 0;
        return (
          <GlassCard key={kpi.label} padding="md" className="border-white/[0.08]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A0AEC0]">{kpi.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs font-semibold ${positive ? "text-[#01B574]" : "text-[#EE5D50]"}`}>
              {positive ? "+" : ""}
              {kpi.change}% vs prior period
            </p>
            <p className="mt-2 text-[11px] leading-snug text-[#718096]">{kpi.context}</p>
          </GlassCard>
        );
      })}
    </div>
  );
}
