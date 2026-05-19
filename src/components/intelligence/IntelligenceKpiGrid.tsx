import type { IntelligenceKpi } from "@/types/nos";
import { orangeStatCardClassName } from "@/components/ui/statCardStyles";

export function IntelligenceKpiGrid({ kpis }: { kpis: IntelligenceKpi[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const positive = kpi.change >= 0;
        return (
          <div key={kpi.label} className={orangeStatCardClassName}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/90">{kpi.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs font-semibold ${positive ? "text-white" : "text-white/90"}`}>
              {positive ? "+" : ""}
              {kpi.change}% vs prior period
            </p>
            <p className="mt-2 text-[11px] leading-snug text-white/80">{kpi.context}</p>
          </div>
        );
      })}
    </div>
  );
}
