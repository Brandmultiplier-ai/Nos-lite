"use client";

import type { StackItem } from "@/types/nos";

interface IntegrationStripProps {
  title: string;
  items: StackItem[];
  description?: string;
  className?: string;
}

export function IntegrationStrip({ title, items, description, className = "" }: IntegrationStripProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-gradient-to-r from-black/35 via-black/25 to-black/35 p-4 backdrop-blur-md ${className}`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0AEC0] ${
          description ? "mb-1" : "mb-3"
        }`}
      >
        {title}
      </p>
      {description ? <p className="mb-3 text-xs leading-relaxed text-[#718096]">{description}</p> : null}
      <div className="flex flex-wrap gap-2">
        {items.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/35 px-3 py-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3a32a0]/70 to-[#4940c6]/60 text-[10px] font-bold text-white">
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{tool.name}</p>
              <p className="truncate text-xs text-[#A0AEC0]">{tool.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
