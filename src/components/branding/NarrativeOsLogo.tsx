"use client";

import { useThemeClasses } from "@/theme/themeClasses";
import { useTheme } from "@/theme/ThemeProvider";
import { isBrandTheme, isCubicTheme, isMboardTheme, isVibrantTheme } from "@/theme/themeClasses";

type NarrativeOsLogoSize = "sidebar" | "hero";

export function NarrativeOsLogo({
  size = "sidebar",
  className = "",
}: {
  size?: NarrativeOsLogoSize;
  className?: string;
}) {
  const { version } = useTheme();
  const tc = useThemeClasses();
  const hero = size === "hero";
  const isMboard = isMboardTheme(version);
  const isTokenized = version === "v2" || isCubicTheme(version) || isVibrantTheme(version) || isMboard || isBrandTheme(version);

  const mark = (
    <>
      {isMboard ? (
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl bg-[var(--theme-primary)] font-bold text-white ${
            hero ? "h-11 w-11 text-base" : "h-9 w-9 text-xs"
          }`}
          aria-hidden
        >
          N
        </span>
      ) : (
        <span
          className={`shrink-0 rounded-lg ${tc.logoMark} ${
            hero ? "h-11 w-1.5" : "h-8 w-[3px]"
          } ${isTokenized ? "" : "shadow-[0_0_16px_rgba(73,64,198,0.35)]"}`}
          aria-hidden
        />
      )}

      <div className="relative min-w-0">
        {!isTokenized && !hero ? (
          <div
            className="pointer-events-none absolute -inset-x-4 -inset-y-3 rounded-xl bg-[radial-gradient(120%_90%_at_0%_0%,rgba(73,64,198,0.22),transparent_62%)]"
            aria-hidden
          />
        ) : null}
        {!isTokenized && hero ? (
          <div
            className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-lg bg-[radial-gradient(100%_100%_at_30%_-10%,rgba(73,64,198,0.12),transparent_65%)]"
            aria-hidden
          />
        ) : null}

        <p
          className={`relative font-extrabold uppercase tabular-nums leading-none ${
            hero
              ? "text-[2.1rem] tracking-[0.2em] sm:text-[2.5rem] sm:tracking-[0.24em]"
              : "text-xl tracking-[0.34em]"
          } ${isTokenized ? tc.inkText : "font-display"}`}
        >
          {isTokenized ? (
            <span
              className={
                isMboard
                  ? `font-display font-bold tracking-tight ${hero ? "text-[var(--theme-ink)]" : "text-white"}`
                  : isVibrantTheme(version)
                    ? "font-display font-bold tracking-tight text-[var(--theme-ink)]"
                    : isCubicTheme(version)
                      ? "font-display font-semibold tracking-[0.2em]"
                      : ""
              }
            >
              NOS
            </span>
          ) : (
            <span className="bg-gradient-to-b from-white via-[#eef2ff] to-[#6ec8ff] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(73,64,198,0.25)]">
              NOS
            </span>
          )}
        </p>
      </div>
    </>
  );

  if (hero) {
    return (
      <div className={`relative mx-auto flex w-fit items-center justify-center px-2 py-1 ${className}`}>
        <div className="relative flex items-center gap-3.5 sm:gap-4">{mark}</div>
      </div>
    );
  }

  return <div className={`relative inline-flex max-w-full items-center gap-2.5 ${className}`}>{mark}</div>;
}
