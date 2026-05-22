"use client";

import { sectionTitles } from "@/data/nosData";
import { useDashboard } from "@/context/DashboardContext";
import { useTheme } from "@/theme/ThemeProvider";
import { isCubicTheme, isEditorialTheme, isMboardTheme, isVibrantTheme } from "@/theme/themeClasses";

export function TopBar() {
  const { section, data } = useDashboard();
  const { theme, version } = useTheme();
  const pageTitle = sectionTitles[section] ?? "Overview";

  if (version === "v2") {
    return (
      <header className={theme.topBarClassName}>
        <div>
          <p className="nos-section-eyebrow">NOS · {pageTitle.toUpperCase()}</p>
          <h1
            className="mt-1 text-[20px] font-semibold leading-6 tracking-[-0.4px] text-[var(--theme-ink)]"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--theme-ink-secondary)]">
            <span className="font-medium text-[var(--theme-ink)]">{data.name}</span>
            {" · "}
            {data.subtitle}
          </p>
        </div>
      </header>
    );
  }

  if (isCubicTheme(version)) {
    return (
      <header className={theme.topBarClassName}>
        <div>
          <p className="nos-cubic-eyebrow">NOS · {pageTitle.toUpperCase()}</p>
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight text-[var(--theme-ink)]">
            {pageTitle}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--theme-ink-secondary)]">
            <span className="font-medium text-[var(--theme-ink)]">{data.name}</span>
            {" · "}
            {data.subtitle}
          </p>
        </div>
      </header>
    );
  }

  if (isMboardTheme(version)) {
    const firstName = data.name.split(" ")[0] ?? data.name;
    return (
      <header className={theme.topBarClassName}>
        <div>
          <h1 className="font-display text-[28px] font-bold leading-tight text-[var(--theme-ink)]">
            Welcome Back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-[var(--theme-ink-secondary)]">
            <span className="font-semibold text-[var(--theme-ink)]">{data.name}</span>
            {" · "}
            {data.subtitle}
          </p>
        </div>
      </header>
    );
  }

  if (isVibrantTheme(version)) {
    return (
      <header className={theme.topBarClassName}>
        <div>
          <h1 className="nos-vibrant-title text-[32px] leading-tight text-[var(--theme-ink)]">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-[var(--theme-ink-secondary)]">
            <span className="font-semibold text-[var(--theme-ink)]">{data.name}</span>
            {" · "}
            {data.subtitle}
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className={theme.topBarClassName}>
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
