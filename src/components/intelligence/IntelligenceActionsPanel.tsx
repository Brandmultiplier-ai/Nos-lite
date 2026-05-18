import type { IntelligenceAction } from "@/types/nos";
import { GlassCard } from "@/components/ui/GlassCard";

const priorityStyles: Record<IntelligenceAction["priority"], string> = {
  high: "border-[#f36901]/40 bg-[#f36901]/10 text-[#ffb380]",
  medium: "border-[#4940c6]/40 bg-[#4940c6]/12 text-[#c4b5fd]",
  low: "border-white/15 bg-white/[0.04] text-[#A0AEC0]",
};

export function IntelligenceActionsPanel({
  actions,
  title = "Recommended actions",
}: {
  actions: IntelligenceAction[];
  title?: string;
}) {
  return (
    <GlassCard padding="lg" className="border-white/[0.08]">
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {actions.map((a) => (
          <li
            key={a.title}
            className="rounded-xl border border-white/[0.08] bg-black/25 p-4 transition hover:border-white/[0.12]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityStyles[a.priority]}`}
              >
                {a.priority}
              </span>
              <span className="text-[10px] text-[#718096]">{a.confidence}% confidence</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{a.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#A0AEC0]">{a.body}</p>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
