"use client";

import { sectionTitles } from "@/data/nosData";
import { useDashboard } from "@/context/DashboardContext";

export function TopBar() {
  const { section, data } = useDashboard();
  const pageTitle = sectionTitles[section] ?? "Overview";

  return (
    <header className="nos-surface-card sticky top-4 z-20 mb-6 rounded-2xl px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A0AEC0]">
          Pages / <span className="text-white">{pageTitle}</span>
        </p>
        <h1 className="mt-1 font-display text-[30px] font-bold leading-tight text-white">
          {pageTitle}
        </h1>
        <p className="mt-0.5 text-sm text-[#A0AEC0]">
          <span className="font-medium text-white">{data.name}</span>
          {" · "}
          {data.subtitle}
        </p>
      </div>
    </header>
  );
}
