"use client";

import { useId } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

interface CardInfoTipProps {
  text: string;
  /** Short label for assistive tech (avoid duplicating entire tooltip). */
  subject?: string;
  className?: string;
}

export function CardInfoTip({ text, subject = "Metric", className = "" }: CardInfoTipProps) {
  const base = useId().replace(/:/g, "");
  const tipId = `${base}-desc`;
  const label = `${subject} explanation`;

  return (
    <span className={`group/tip relative inline-flex shrink-0 ${className}`}>
      <button
        type="button"
        className="-m-0.5 rounded-lg p-0.5 text-[#718096] outline-none transition hover:text-[#a0aec0] focus-visible:ring-2 focus-visible:ring-[#4940c6]/55"
        aria-label={label}
        aria-describedby={tipId}
      >
        <HiOutlineInformationCircle className="h-4 w-4" aria-hidden />
      </button>
      <span
        id={tipId}
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+6px)] left-1/2 z-[80] w-56 max-w-[min(14rem,calc(100vw-3rem))] -translate-x-1/2 rounded-lg border border-white/[0.12] bg-[#0c101c]/96 px-3 py-2 text-left text-[11px] font-normal leading-snug text-[#D9E4F8] opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition duration-150 group-focus-within/tip:visible group-focus-within/tip:opacity-100 group-hover/tip:visible group-hover/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

interface MetricHeadingWithInfoProps {
  title: string;
  hint: string;
  /** Classes for the title element only */
  titleClassName?: string;
}

export function MetricHeadingWithInfo({
  title,
  hint,
  titleClassName = "text-xs font-semibold uppercase tracking-[0.08em] text-[#A0AEC0]",
}: MetricHeadingWithInfoProps) {
  if (!hint.trim()) {
    return <p className={titleClassName}>{title}</p>;
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <p className={`min-w-0 flex-1 ${titleClassName}`}>{title}</p>
      <CardInfoTip subject={title} text={hint} />
    </div>
  );
}
