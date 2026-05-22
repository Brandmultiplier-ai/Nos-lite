"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/theme/ThemeProvider";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function GlassCard({
  children,
  className = "",
  padding = "lg",
}: GlassCardProps) {
  const { theme } = useTheme();
  const hoverClass =
    theme.metricCardStyle === "gradient"
      ? "transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_20px_45px_rgba(0,0,0,0.33),0_0_0_1px_rgba(73,64,198,0.26)]"
      : "";

  const borderRadius =
    theme.metricCardStyle === "mboard"
      ? "rounded-2xl"
      : theme.metricCardStyle === "vibrant"
      ? "rounded-[28px]"
      : theme.metricCardStyle === "cubic"
        ? "rounded-[14px]"
        : theme.metricCardStyle === "editorial"
          ? "rounded-[24px]"
          : theme.metricCardStyle === "flat"
            ? "rounded-[10px]"
            : "rounded-2xl";

  const elevatedClass = "";

  return (
    <div className={`nos-surface-card ${borderRadius}${elevatedClass} ${hoverClass} ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
}
