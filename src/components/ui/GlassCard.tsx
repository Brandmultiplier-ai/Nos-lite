import type { ReactNode } from "react";

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
  return (
    <div
      className={`nos-surface-card rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_20px_45px_rgba(0,0,0,0.33),0_0_0_1px_rgba(73,64,198,0.26)] ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
